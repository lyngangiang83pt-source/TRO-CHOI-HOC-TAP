import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Play, FileCode, Layers, FileText } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const Html5ZipUploader = ({ onZipParsed }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [detectedHtml, setDetectedHtml] = useState('');
  const [zipContents, setZipContents] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Hàm quét đệ quy tìm file HTML hoặc tự động mở gói nén ZIP lồng nhau (Google Drive Bulk Zip)
  const findHtmlEntryRecursively = async (unzipped, depth = 0) => {
    const allKeys = Object.keys(unzipped.files);

    // 1. Tìm các file .html hoặc .htm trực tiếp trong zip này
    const htmlFiles = allKeys.filter(
      path => !unzipped.files[path].dir && (path.toLowerCase().endsWith('.html') || path.toLowerCase().endsWith('.htm'))
    );

    if (htmlFiles.length > 0) {
      let entryKey = 
        htmlFiles.find(p => p.toLowerCase().endsWith('index.html')) ||
        htmlFiles.find(p => p.toLowerCase().endsWith('index.htm')) ||
        htmlFiles.find(p => p.toLowerCase().endsWith('main.html')) ||
        htmlFiles.find(p => p.toLowerCase().endsWith('default.html')) ||
        htmlFiles[0];

      const content = await unzipped.files[entryKey].async('text');
      return { entryKey, content };
    }

    // 2. Nếu là file nén gộp của Google Drive chứa các file .zip con bên trong
    if (depth < 3) {
      const nestedZipKeys = allKeys.filter(
        path => !unzipped.files[path].dir && path.toLowerCase().endsWith('.zip')
      );

      for (const nestedKey of nestedZipKeys) {
        try {
          const nestedBuffer = await unzipped.files[nestedKey].async('arraybuffer');
          const nestedZip = new JSZip();
          const unzippedNested = await nestedZip.loadAsync(nestedBuffer);
          const result = await findHtmlEntryRecursively(unzippedNested, depth + 1);
          if (result) {
            return {
              entryKey: `${nestedKey} ➔ ${result.entryKey}`,
              content: result.content
            };
          }
        } catch (err) {
          console.warn('Lỗi đọc zip lồng:', nestedKey, err);
        }
      }
    }

    return null;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    soundFx.play('click');
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFileName(file.name);
    setDetectedHtml('');
    setZipContents([]);

    try {
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);

      // Lưu danh sách 5 file đầu tiên để chẩn đoán nếu thiếu HTML
      const topFiles = Object.keys(unzipped.files)
        .filter(k => !unzipped.files[k].dir)
        .slice(0, 5);
      setZipContents(topFiles);

      // Chạy thuật toán quét sâu đệ quy lồng nhau
      const result = await findHtmlEntryRecursively(unzipped);

      if (!result) {
        throw new Error(
          `Gói ZIP "${file.name}" không chứa file HTML hoặc file game nén con. Các file tìm thấy: ${topFiles.join(', ')}`
        );
      }

      setDetectedHtml(result.entryKey);

      // Tạo URL Blob từ nội dung HTML
      const blob = new Blob([result.content], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);

      setSuccess(true);
      soundFx.play('correct');

      if (typeof onZipParsed === 'function') {
        onZipParsed({
          fileName: file.name,
          entryFile: result.entryKey,
          blobUrl,
          rawZipFile: file
        });
      }
    } catch (err) {
      console.error('Lỗi giải nén ZIP HTML5:', err);
      setError(err.message || 'Giải nén file HTML5 ZIP thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 mb-3">
        <FileArchive className="w-7 h-7" />
      </div>

      <h4 className="text-base font-heading font-bold text-white mb-1">
        Upload Trò Chơi HTML5 ZIP (GAME-02)
      </h4>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
        Hệ thống hỗ trợ giải nén sâu đa tầng đệ quy (quét tự động mọi file nén gộp Google Drive, iSpring, Canva, Wordwall).
      </p>

      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 cursor-pointer transition-all">
        <Upload className="w-4 h-4" />
        <span>{loading ? 'Đang Giải Nén Sâu Đa Tầng Đệ Quy...' : 'Chọn File HTML5 .ZIP'}</span>
        <input
          type="file"
          accept=".zip,.ZIP,application/zip,application/x-zip-compressed,application/x-zip,application/octet-stream"
          onChange={handleFileUpload}
          disabled={loading}
          className="hidden"
        />
      </label>

      {fileName && (
        <p className="text-xs text-slate-300 font-mono mt-3">
          File đã chọn: <span className="text-indigo-400">{fileName}</span>
        </p>
      )}

      {success && (
        <div className="mt-3 inline-flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Đã tự động quét sâu đệ quy và giải nén thành công!</span>
          </div>
          {detectedHtml && (
            <span className="text-[11px] font-mono text-emerald-400/80">
              Entry point: <FileCode className="w-3.5 h-3.5 inline ml-1" /> {detectedHtml}
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          {zipContents.length > 0 && (
            <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2 rounded-xl border border-slate-800 w-full text-left">
              <span className="text-slate-300 font-bold block mb-1">Các file phát hiện trong gói ZIP:</span>
              <ul className="list-disc list-inside space-y-0.5">
                {zipContents.map((f, idx) => (
                  <li key={idx} className="truncate">{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
