import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, FileArchive, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

export const Html5ZipUploader = ({ onZipParsed }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Kiểm tra định dạng không phân biệt hoa thường hoặc MIME type
    const isZip = file.name.toLowerCase().endsWith('.zip') || 
                  file.type === 'application/zip' || 
                  file.type === 'application/x-zip-compressed' ||
                  file.type === 'application/x-zip';

    if (!isZip) {
      setError('Vui lòng chọn đúng file nén định dạng .ZIP (ví dụ: game.zip)!');
      return;
    }

    soundFx.play('click');
    setLoading(true);
    setError(null);
    setSuccess(false);
    setFileName(file.name);

    try {
      const zip = new JSZip();
      const unzipped = await zip.loadAsync(file);

      // Tìm file index.html trong file ZIP (hỗ trợ cả thư mục con)
      let indexFileKey = Object.keys(unzipped.files).find(
        path => path.toLowerCase().endsWith('index.html')
      );

      if (!indexFileKey) {
        throw new Error('Không tìm thấy file index.html trong gói ZIP!');
      }

      const indexContent = await unzipped.files[indexFileKey].async('text');
      
      // Tạo URL Blob từ nội dung index.html
      const blob = new Blob([indexContent], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);

      setSuccess(true);
      soundFx.play('correct');

      if (typeof onZipParsed === 'function') {
        onZipParsed({
          fileName: file.name,
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
        Chọn file nén <span className="text-indigo-300 font-mono font-bold">.ZIP</span> chứa trò chơi HTML5 (bao gồm file index.html). Hệ thống sẽ tự động giải nén & tạo bài chơi.
      </p>

      <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 cursor-pointer transition-all">
        <Upload className="w-4 h-4" />
        <span>{loading ? 'Đang Giải Nén File ZIP...' : 'Chọn File HTML5 .ZIP'}</span>
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
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Giải nén file ZIP thành công! Đã sẵn sàng nhúng bài chơi.</span>
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
