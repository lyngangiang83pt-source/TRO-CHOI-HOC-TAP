import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Play, FileCode } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const Html5ZipUploader = ({ onZipParsed }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [detectedHtml, setDetectedHtml] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng không phân biệt hoa thường hoặc MIME type
    const isZip = file.name.toLowerCase().endsWith('.zip') || 
                  file.type === 'application/zip' || 
                  file.type === 'application/x-zip-compressed' ||
                  file.type === 'application/x-zip' ||
                  file.type === 'application/octet-stream';

    if (!isZip) {
      setError('Vui lòng chọn đúng file nén định dạng .ZIP!');
      return;
    }

    soundFx.play('click');
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFileName(file.name);
    setDetectedHtml('');

    try {
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);

      // Lọc toàn bộ các file .html hoặc .htm trong gói ZIP (bỏ qua thư mục)
      const allFiles = Object.keys(unzipped.files);
      const htmlFiles = allFiles.filter(
        path => !unzipped.files[path].dir && (path.toLowerCase().endsWith('.html') || path.toLowerCase().endsWith('.htm'))
      );

      if (htmlFiles.length === 0) {
        throw new Error('Không tìm thấy bất kỳ file HTML (.html hoặc .htm) nào trong gói nén ZIP!');
      }

      // Thuật toán thông minh chọn file khởi chạy (Entry point):
      // Ưu tiên: index.html -> index.htm -> main.html -> default.html -> file html đầu tiên tìm thấy
      let entryFileKey = 
        htmlFiles.find(p => p.toLowerCase().endsWith('index.html')) ||
        htmlFiles.find(p => p.toLowerCase().endsWith('index.htm')) ||
        htmlFiles.find(p => p.toLowerCase().endsWith('main.html')) ||
        htmlFiles.find(p => p.toLowerCase().endsWith('default.html')) ||
        htmlFiles[0];

      setDetectedHtml(entryFileKey);

      // Đọc nội dung file HTML entry
      const indexContent = await unzipped.files[entryFileKey].async('text');
      
      // Tạo URL Blob từ nội dung HTML
      const blob = new Blob([indexContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);

      setSuccess(true);
      soundFx.play('correct');

      if (typeof onZipParsed === 'function') {
        onZipParsed({
          fileName: file.name,
          entryFile: entryFileKey,
          blobUrl,
          rawZipFile: file
        });
      }
    } catch (err) {
      console.error('Lỗi giải nén ZIP HTML5:', err);
      setError(err.message || 'Giải nén file HTML5 ZIP thất bại. Vui lòng kiểm tra lại cấu trúc file nén.');
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
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
        Hệ thống tự động quét và giải nén thông minh mọi gói ZIP từ Google Drive, iSpring, Canva, Wordwall (tự động nhận diện file index.html / main.html / .html bất kỳ).
      </p>

      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 cursor-pointer transition-all">
        <Upload className="w-4 h-4" />
        <span>{loading ? 'Đang Tự Động Quét & Giải Nén...' : 'Chọn File HTML5 .ZIP'}</span>
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
            <span>Đã tự động nhận diện và giải nén thành công!</span>
          </div>
          {detectedHtml && (
            <span className="text-[11px] font-mono text-emerald-400/80">
              Entry point: <FileCode className="w-3.5 h-3.5 inline ml-1" /> {detectedHtml}
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
