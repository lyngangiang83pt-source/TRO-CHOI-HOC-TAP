import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Play, FileCode, Presentation, Sparkles, Download } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const Html5ZipUploader = ({ onZipParsed }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [detectedType, setDetectedType] = useState(''); // 'html' | 'ppt'
  const [detectedHtml, setDetectedHtml] = useState('');
  const [pptList, setPptList] = useState([]);
  const [selectedPpt, setSelectedPpt] = useState('');
  const [zipContents, setZipContents] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Thuật toán quét sâu tìm HTML hoặc PowerPoint (.ppt/.pptx) hoặc Zip lồng nhau
  const findMediaRecursively = async (unzipped, depth = 0) => {
    const allKeys = Object.keys(unzipped.files);

    // 1. Quét tìm các file HTML (.html / .htm)
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
      return { type: 'html', entryKey, content };
    }

    // 2. Quét tìm các file Trò Chơi PowerPoint (.ppt / .pptx)
    const pptFiles = allKeys.filter(
      path => !unzipped.files[path].dir && (path.toLowerCase().endsWith('.ppt') || path.toLowerCase().endsWith('.pptx'))
    );

    if (pptFiles.length > 0) {
      return { type: 'ppt', pptFiles, entryKey: pptFiles[0] };
    }

    // 3. Quét các file ZIP lồng nhau (Google Drive Bulk Zip)
    if (depth < 3) {
      const nestedZipKeys = allKeys.filter(
        path => !unzipped.files[path].dir && path.toLowerCase().endsWith('.zip')
      );

      for (const nestedKey of nestedZipKeys) {
        try {
          const nestedBuffer = await unzipped.files[nestedKey].async('arraybuffer');
          const nestedZip = new JSZip();
          const unzippedNested = await nestedZip.loadAsync(nestedBuffer);
          const result = await findMediaRecursively(unzippedNested, depth + 1);
          if (result) {
            return {
              ...result,
              entryKey: `${nestedKey} ➔ ${result.entryKey}`
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
    setPptList([]);
    setZipContents([]);

    try {
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);

      // Lưu danh sách file chẩn đoán
      const topFiles = Object.keys(unzipped.files)
        .filter(k => !unzipped.files[k].dir)
        .slice(0, 6);
      setZipContents(topFiles);

      const result = await findMediaRecursively(unzipped);

      if (!result) {
        throw new Error(
          `Gói nén "${file.name}" không chứa file HTML5 hoặc Slide PowerPoint. Danh sách file: ${topFiles.join(', ')}`
        );
      }

      setDetectedType(result.type);

      if (result.type === 'html') {
        setDetectedHtml(result.entryKey);
        const blob = new Blob([result.content], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        setSuccess(true);
        soundFx.play('correct');

        if (typeof onZipParsed === 'function') {
          onZipParsed({
            gameType: 'html5',
            fileName: file.name,
            entryFile: result.entryKey,
            blobUrl,
            rawZipFile: file
          });
        }
      } else if (result.type === 'ppt') {
        setPptList(result.pptFiles);
        setSelectedPpt(result.pptFiles[0]);
        setSuccess(true);
        soundFx.play('correct');

        if (typeof onZipParsed === 'function') {
          onZipParsed({
            gameType: 'powerpoint',
            fileName: file.name,
            pptList: result.pptFiles,
            entryFile: result.pptFiles[0],
            rawZipFile: file
          });
        }
      }

    } catch (err) {
      console.error('Lỗi giải nén ZIP:', err);
      setError(err.message || 'Giải nén file nén thất bại.');
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
        Upload Trò Chơi HTML5 & PowerPoint ZIP (GAME-02)
      </h4>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
        Tự động nhận diện Trò chơi HTML5 (Wordwall, Canva, iSpring) và Bộ Trò chơi PowerPoint tương tác (.ppt, .pptx) trong gói ZIP Google Drive.
      </p>

      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 cursor-pointer transition-all">
        <Upload className="w-4 h-4" />
        <span>{loading ? 'Đang Quét & Phân Loại Game...' : 'Chọn File HTML5 / PowerPoint .ZIP'}</span>
        <input
          type="file"
          accept=".zip,.ZIP,.ppt,.pptx,application/zip,application/x-zip-compressed,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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

      {/* Kết quả nhận diện thành công HTML5 */}
      {success && detectedType === 'html' && (
        <div className="mt-3 inline-flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Đã tự động nhận diện Trò chơi HTML5 thành công!</span>
          </div>
          {detectedHtml && (
            <span className="text-[11px] font-mono text-emerald-400/80">
              Entry point: <FileCode className="w-3.5 h-3.5 inline ml-1" /> {detectedHtml}
            </span>
          )}
        </div>
      )}

      {/* Kết quả nhận diện thành công PowerPoint Games */}
      {success && detectedType === 'ppt' && (
        <div className="mt-3 flex flex-col items-center gap-2 p-4 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold w-full text-left">
          <div className="flex items-center gap-1.5 text-amber-200 font-bold">
            <Presentation className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Phát hiện {pptList.length} Trò Chơi PowerPoint (.ppt / .pptx) trong gói ZIP!</span>
          </div>

          <div className="w-full bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2 mt-1">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">
              Danh Sách Slide Game Tìm Thấy (Chọn để xem):
            </span>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {pptList.map((pptName, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedPpt(pptName)}
                  className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                    selectedPpt === pptName 
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50' 
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {pptName.split('/').pop()}
                  </span>
                  <span className="text-[10px] text-indigo-400 shrink-0 uppercase">PPT Game</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
            ✨ Bài chơi PowerPoint đã được nhận diện. Thầy/Cô có thể tạo bài học tương tác trực tiếp hoặc trình chiếu trên lớp cho học sinh!
          </p>
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
