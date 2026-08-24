import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Play, FileCode, Presentation, Sparkles, Globe } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const Html5ZipUploader = ({ onZipParsed }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [detectedType, setDetectedType] = useState(''); // 'single_html' | 'zip_html' | 'ppt'
  const [detectedHtml, setDetectedHtml] = useState('');
  const [pptList, setPptList] = useState([]);
  const [selectedPpt, setSelectedPpt] = useState('');
  const [zipContents, setZipContents] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Thuật toán quét đệ quy tìm HTML hoặc PowerPoint (.ppt/.pptx) trong file ZIP
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
      return { type: 'zip_html', entryKey, content };
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

    const lowerName = file.name.toLowerCase();

    // 🌟 TRƯỜNG HỢP 1: THẦY UPLOAD TRỰC TIẾP FILE SƠ CẤP SINGLE .HTML / .HTM
    if (lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
      try {
        const textContent = await file.text();
        const blob = new Blob([textContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);

        setDetectedType('single_html');
        setDetectedHtml(file.name);
        setSuccess(true);
        soundFx.play('correct');

        if (typeof onZipParsed === 'function') {
          onZipParsed({
            gameType: 'html5',
            fileName: file.name,
            entryFile: file.name,
            blobUrl,
            htmlContent: textContent,
            rawFile: file
          });
        }
      } catch (err) {
        console.error('Lỗi đọc file HTML:', err);
        setError('Không thể đọc nội dung file HTML.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // 🌟 TRƯỜNG HỢP 2: THẦY UPLOAD FILE NÉN .ZIP (GIẢI NÉN ĐỆ QUY JSZIP)
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
          `Gói nén "${file.name}" không chứa file HTML5 hoặc Slide PowerPoint. Các file phát hiện: ${topFiles.join(', ')}`
        );
      }

      setDetectedType(result.type);

      if (result.type === 'zip_html') {
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
            htmlContent: result.content,
            rawZipFile: file
          });
        }
      } else if (result.type === 'ppt') {
        setPptList(result.pptFiles);
        setSelectedPpt(result.pptFiles[0]);
        setSuccess(true);
        soundFx.play('correct');

        const pptHtmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slide PowerPoint: ${file.name}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 2rem; background: #090d16; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .card { background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 1.5rem; padding: 2.5rem; max-width: 650px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6); backdrop-filter: blur(12px); }
    .icon { font-size: 3.5rem; margin-bottom: 1rem; }
    h1 { font-size: 1.4rem; color: #a5b4fc; margin: 0 0 0.5rem 0; font-weight: 800; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .badge { display: inline-block; padding: 0.4rem 1rem; background: rgba(99, 102, 241, 0.2); color: #818cf8; border-radius: 9999px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(99, 102, 241, 0.3); margin-bottom: 1rem; }
    .ppt-name { color: #f43f5e; font-weight: 700; word-break: break-all; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">📊</div>
    <div class="badge">Gói PowerPoint Slide Trình Chiếu</div>
    <h1>${file.name}</h1>
    <p>Slide PowerPoint: <span class="ppt-name">${result.pptFiles[0]}</span> đã sẵn sàng tương tác trên Kho Trò Chơi Học Tập!</p>
  </div>
</body>
</html>`;

        const blob = new Blob([pptHtmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);

        if (typeof onZipParsed === 'function') {
          onZipParsed({
            gameType: 'html5',
            fileName: file.name,
            pptList: result.pptFiles,
            entryFile: result.pptFiles[0],
            blobUrl,
            htmlContent: pptHtmlContent,
            rawZipFile: file
          });
        }
      }

    } catch (err) {
      console.error('Lỗi đọc file:', err);
      setError(err.message || 'Xử lý file thất bại. Vui lòng kiểm tra lại định dạng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 border border-slate-800 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 mb-3">
        <Globe className="w-7 h-7" />
      </div>

      <h4 className="text-base font-heading font-bold text-white mb-1">
        Upload Trò Chơi HTML5 (.html) & PowerPoint ZIP (GAME-02)
      </h4>
      <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
        Hệ thống tự động hỗ trợ cả <span className="text-indigo-300 font-bold">File HTML Đơn Lẻ (.html)</span> và <span className="text-purple-300 font-bold">Gói Nén ZIP</span> (Đường Lên Đỉnh Olympia, Wordwall, Canva, iSpring, PowerPoint).
      </p>

      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 cursor-pointer transition-all">
        <Upload className="w-4 h-4" />
        <span>{loading ? 'Đang Xử Lý & Đọc File...' : 'Chọn File HTML / .ZIP / PowerPoint'}</span>
        <input
          type="file"
          accept=".html,.htm,.zip,.ZIP,.ppt,.pptx,text/html,application/zip,application/x-zip-compressed,application/octet-stream"
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

      {/* Kết quả nhận diện thành công File HTML Đơn Lẻ */}
      {success && detectedType === 'single_html' && (
        <div className="mt-3 inline-flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Đã tự động đọc và tạo bài chơi HTML Đơn Lẻ (.html) thành công!</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80">
            Tên file game: <FileCode className="w-3.5 h-3.5 inline ml-1" /> {detectedHtml}
          </span>
        </div>
      )}

      {/* Kết quả nhận diện thành công HTML5 ZIP */}
      {success && detectedType === 'zip_html' && (
        <div className="mt-3 inline-flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Đã giải nén và nhận diện Trò chơi HTML5 ZIP thành công!</span>
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
