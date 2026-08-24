import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF4E8] text-[#1C1917] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-amber-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-xl font-heading font-black text-slate-900 mb-2">
              Hệ Thống Đang Được Tối Ưu
            </h2>
            <p className="text-xs text-slate-600 mb-6 font-medium">
              Vui lòng bấm nút bên dưới để làm mới và tiếp tục trải nghiệm Kho Trò Chơi Học Tập Cấp 2.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all"
            >
              🔄 Khởi Động Lại Hệ Thống
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
