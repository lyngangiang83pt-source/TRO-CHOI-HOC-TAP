import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  BookOpen, 
  Plus, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Gamepad2, 
  FileText, 
  Wand2, 
  Search,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

// Kho câu hỏi mẫu có sẵn theo chương trình GDPT 2018 THCS
const PRESET_QUESTION_BANK = [
  {
    id: 'bank-1',
    subject: 'Khoa Học Tự Nhiên',
    grade_level: '7',
    topic: 'Nguyên Tử & Phân Tử - Hóa Học 7',
    count: 5,
    type: 'trac_nghiem',
    questions: [
      { q: 'Hạt nhân nguyên tử được cấu tạo bởi những hạt nào?', options: ['Proton và Neutron', 'Electron và Proton', 'Electron và Neutron', 'Chỉ có Proton'], correct: 0, explanation: 'Hạt nhân nguyên tử gồm hạt Proton (mang điện dương) và Neutron (không mang điện).' },
      { q: 'Hạt mang điện tích âm trong nguyên tử là hạt nào?', options: ['Electron', 'Proton', 'Neutron', 'Hạt Nhân'], correct: 0, explanation: 'Hạt Electron mang điện tích âm (-1e) và di chuyển xung quanh hạt nhân.' },
      { q: 'Kí hiệu hóa học của nguyên tố Oxygen là gì?', options: ['O', 'Ox', 'Og', 'O2'], correct: 0, explanation: 'Kí hiệu hóa học của Oxygen là O, có nguyên tử khối bằng 16.' },
      { q: 'Khối lượng của nguyên tử tập trung chủ yếu ở đâu?', options: ['Ở Hạt Nhân', 'Ở Vỏ Electron', 'Được phân bố đều', 'Ở các hạt Electron'], correct: 0, explanation: 'Khối lượng hạt Proton và Neutron lớn hơn rất nhiều so với Electron nên khối lượng nguyên tử tập trung ở hạt nhân.' },
      { q: 'Kí hiệu hóa học của nguyên tố Hydrogen là gì?', options: ['H', 'Hy', 'Hg', 'H2'], correct: 0, explanation: 'Kí hiệu hóa học của Hydrogen là H, có nguyên tử khối bằng 1.' }
    ]
  },
  {
    id: 'bank-2',
    subject: 'Toán Học',
    grade_level: '6',
    topic: 'Hình Học Trực Quan: Tam Giác Đều, Hình Vuông, Hình Chữ Nhật',
    count: 5,
    type: 'trac_nghiem',
    questions: [
      { q: 'Hình tam giác đều có đặc điểm nào sau đây?', options: ['3 cạnh bằng nhau và 3 góc bằng nhau', '2 cạnh bằng nhau', 'Có 1 góc vuông', 'Có 4 cạnh bằng nhau'], correct: 0, explanation: 'Tam giác đều có 3 cạnh bằng nhau và 3 góc bằng nhau (mỗi góc bằng 60°).' },
      { q: 'Hình nào có 4 cạnh bằng nhau và 4 góc vuông?', options: ['Hình vuông', 'Hình chữ nhật', 'Hình thoi', 'Hình bình hành'], correct: 0, explanation: 'Hình vuông vừa có 4 cạnh bằng nhau vừa có 4 góc vuông.' },
      { q: 'Chu vi hình vuông có độ dài cạnh a = 5cm là bao nhiêu?', options: ['20 cm', '25 cm', '10 cm', '15 cm'], correct: 0, explanation: 'Chu vi hình vuông C = 4 × a = 4 × 5 = 20cm.' },
      { q: 'Diện tích hình chữ nhật có chiều dài 8cm, chiều rộng 5cm là bao nhiêu?', options: ['40 cm²', '26 cm²', '13 cm²', '30 cm²'], correct: 0, explanation: 'Diện tích hình chữ nhật S = a × b = 8 × 5 = 40cm².' },
      { q: 'Hình thoi có hai đường chéo có tính chất gì?', options: ['Vuông góc với nhau', 'Bằng nhau', 'Song song với nhau', 'Trùng nhau'], correct: 0, explanation: 'Hai đường chéo của hình thoi cắt nhau tại trung điểm mỗi đường và vuông góc với nhau.' }
    ]
  },
  {
    id: 'bank-3',
    subject: 'Tiếng Anh',
    grade_level: '8',
    topic: 'Unit 1: Leisure Time & Hobbies (Từ Vựng & Ngữ Pháp)',
    count: 5,
    type: 'tu_luan',
    questions: [
      { q: 'Từ tiếng Anh nào chỉ sở thích "Làm đồ thủ công" (bắt đầu bằng chữ C)?', answers: ['CRAFT', 'MAKING CRAFTS'], explanation: 'Crafts có nghĩa là các đồ vật thủ công mỹ nghệ tự làm.' },
      { q: 'Điền dạng đúng của động từ: She enjoys (read) __________ books in her free time.', answers: ['READING'], explanation: 'Sau động từ "enjoy" ta dùng V-ing: enjoy + reading.' },
      { q: 'Từ tiếng Anh nào có nghĩa là "Thời gian rảnh rỗi" (bắt đầu bằng L)?', answers: ['LEISURE', 'LEISURE TIME'], explanation: 'Leisure time có nghĩa là thời gian rỗi rãi, thư giãn.' },
      { q: 'Quá khứ đơn (V2) của động từ "BECOME" là gì?', answers: ['BECAME'], explanation: 'Động từ bất quy tắc Become -> Became -> Become.' },
      { q: 'Từ nào đồng nghĩa với "Hobby" (bắt đầu bằng P)?', answers: ['PASTIME'], explanation: 'Pastime nghĩa là trò tiêu khiển, sở thích lúc rảnh rỗi.' }
    ]
  },
  {
    id: 'bank-4',
    subject: 'Lịch Sử & Địa Lý',
    grade_level: '9',
    topic: 'Chiến Thắng Lịch Sử Điện Biên Phủ 1954',
    count: 5,
    type: 'trac_nghiem',
    questions: [
      { q: 'Chiến thắng Điện Biên Phủ lịch sử diễn ra vào năm nào?', options: ['Năm 1954', 'Năm 1945', 'Năm 1975', 'Năm 1968'], correct: 0, explanation: 'Chiến dịch Điện Biên Phủ toàn thắng vào ngày 7/5/1954.' },
      { q: 'Vị Đại tướng nào là Tổng chỉ huy Chiến dịch Điện Biên Phủ?', options: ['Võ Nguyên Giáp', 'Văn Tiến Dũng', 'Nguyễn Chí Thanh', 'Trần Hưng Đạo'], correct: 0, explanation: 'Đại tướng Võ Nguyên Giáp là Tổng chỉ huy kiêm Bí thư Đảng ủy Chiến dịch Điện Biên Phủ.' },
      { q: 'Châm ngôn nổi tiếng nào gắn liền với chiến thắng Điện Biên Phủ?', options: ['Lừng lẫy năm châu, chấn động địa cầu', 'Nam quốc sơn hà', 'Bình Ngô đại cáo', 'Không có gì quý hơn độc lập tự do'], correct: 0, explanation: 'Chiến thắng Điện Biên Phủ được ca ngợi "Lừng lẫy năm châu, chấn động địa cầu".' },
      { q: 'Tập đoàn cứ điểm Điện Biên Phủ của quân Pháp gồm bao nhiêu phân khu?', options: ['3 phân khu', '2 phân khu', '5 phân khu', '7 phân khu'], correct: 0, explanation: 'Tập đoàn cứ điểm gồm 3 phân khu (Bắc, Trung tâm, Nam) với 49 cứ điểm.' },
      { q: 'Người anh hùng nào đã lấy thân mình chèn pháo trong chiến dịch Điện Biên Phủ?', options: ['Tô Vĩnh Diện', 'Bế Văn Đàn', 'Phan Đình Giót', 'Cù Chính Lan'], correct: 0, explanation: 'Anh hùng Tô Vĩnh Diện đã lấy thân mình chèn pháo cứu pháo không rơi xuống vực.' }
    ]
  }
];

export const AiQuestionGenerator = ({ onGameCreated }) => {
  const [activeSubTab, setActiveSubTab] = useState('ai_generator'); // 'ai_generator' | 'preset_bank'
  
  // AI Generator Form State
  const [subject, setSubject] = useState('Khoa Học Tự Nhiên');
  const [gradeLevel, setGradeLevel] = useState('7');
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [questionType, setQuestionType] = useState('trac_nghiem'); // 'trac_nghiem' | 'tu_luan'
  
  const [generating, setGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 🤖 Hàm giả lập AI Trí Tuệ Nhân Tạo tạo câu hỏi tự động
  const handleGenerateAiQuiz = (e) => {
    e.preventDefault();
    soundFx.play('click');

    if (!topic || !topic.trim()) {
      soundFx.play('wrong');
      alert('⚠️ Vui lòng nhập Chủ đề bài học để AI tạo câu hỏi!');
      return;
    }

    setGenerating(true);
    setGeneratedQuiz(null);

    // Mô phỏng AI xử lý tạo ngân hàng câu hỏi thông minh
    setTimeout(() => {
      soundFx.play('victory');
      setGenerating(false);

      const topicClean = topic.trim();
      let mockQuestions = [];

      if (questionType === 'trac_nghiem') {
        for (let i = 1; i <= questionCount; i++) {
          mockQuestions.push({
            q: `[AI ${subject} ${gradeLevel}] Câu ${i}: Nội dung trọng tâm về "${topicClean}"?`,
            options: [
              `Đáp án chuẩn A cho chủ đề ${topicClean}`,
              `Khái niệm mở rộng B của bài học`,
              `Phương án nhiễu C cần chú ý`,
              `Phương án nhiễu D sai quy tắc`
            ],
            correct: 0,
            explanation: `Lời giải chi tiết từ AI: Khái niệm "${topicClean}" tuân theo đúng chương trình GDPT 2018 Lớp ${gradeLevel}.`
          });
        }
      } else {
        for (let i = 1; i <= questionCount; i++) {
          mockQuestions.push({
            q: `[AI ${subject} ${gradeLevel}] Câu ${i}: Hãy gõ từ khóa chính của chủ đề "${topicClean}"?`,
            answers: [topicClean.toUpperCase(), topicClean],
            explanation: `Lời giải chi tiết từ AI: Từ khóa đáp án chuẩn là "${topicClean}".`
          });
        }
      }

      setGeneratedQuiz({
        title: `AI Game: ${topicClean} (${subject} ${gradeLevel})`,
        subject,
        grade_level: gradeLevel,
        topic: topicClean,
        type: questionType,
        questions: mockQuestions
      });
    }, 1200);
  };

  // 🚀 Hàm 1-Click chuyển đổi bộ câu hỏi AI thành Bài Chơi Mới
  const handlePublishQuizToGame = (quizObj) => {
    soundFx.play('correct');

    const htmlCode = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${quizObj.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; min-height: 100vh; padding: 1.5rem; }
    .glass { background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: 1.5rem; }
  </style>
</head>
<body class="flex flex-col justify-center items-center">
  <div id="app" class="glass max-w-2xl w-full p-6 text-center space-y-6">
    <h1 class="text-2xl font-bold text-amber-400">🤖 ${quizObj.title}</h1>
    <p class="text-xs text-slate-300">Bộ câu hỏi tự động được tạo từ Trợ Lý AI Giáo Dục</p>
    <div id="quiz-box" class="text-left space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
      <h3 id="q-title" class="font-bold text-base text-white">Loading...</h3>
      <div id="options-box" class="space-y-2"></div>
      <div id="expl-box" class="hidden p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold"></div>
    </div>
    <button id="next-btn" onclick="nextQ()" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-xs text-white">CÂU HỎI TIẾP THEO</button>
  </div>
  <script>
    const QUIZ = ${JSON.stringify(quizObj.questions)};
    let cur = 0;
    function loadQ() {
      if(cur >= QUIZ.length) {
        document.getElementById('app').innerHTML = '<h2 class="text-2xl font-bold text-emerald-400">🎉 HOÀN THÀNH XUẤT SẮC!</h2><p class="text-xs text-slate-300 mt-2">Em đã hoàn thành tất cả câu hỏi do AI tạo ra!</p>';
        confetti(); return;
      }
      const q = QUIZ[cur];
      document.getElementById('q-title').innerText = (cur+1) + '. ' + q.q;
      const box = document.getElementById('options-box');
      box.innerHTML = '';
      document.getElementById('expl-box').classList.add('hidden');
      if(q.options) {
        q.options.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.className = 'w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-xs font-semibold text-white transition-all';
          btn.innerText = String.fromCharCode(65+idx) + '. ' + opt;
          btn.onclick = () => checkAns(idx === q.correct, q.explanation);
          box.appendChild(btn);
        });
      }
    }
    function checkAns(isOk, expl) {
      const eBox = document.getElementById('expl-box');
      eBox.innerText = isOk ? '✅ CHÍNH XÁC! ' + expl : '❌ CHƯA ĐÚNG! ' + expl;
      eBox.classList.remove('hidden');
      if(isOk) confetti();
    }
    function nextQ() { cur++; loadQ(); }
    loadQ();
  </script>
</body>
</html>`;

    if (typeof onGameCreated === 'function') {
      onGameCreated({
        title: quizObj.title,
        description: `Bộ câu hỏi AI tự động gồm ${quizObj.questions.length} câu thuộc chủ đề ${quizObj.topic}`,
        game_type: 'html5_zip',
        game_url: 'html5-embedded-content',
        grade_level: quizObj.grade_level,
        subject: quizObj.subject,
        config: { htmlContent: htmlCode }
      });
    }
  };

  const filteredPresetBank = PRESET_QUESTION_BANK.filter(b => 
    b.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner - NỀN VÀNG NHẠT */}
      <div 
        style={{
          background: '#FFFBEB',
          border: '2px solid #FDE047',
          boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2)'
        }}
        className="p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md border border-amber-500 font-black">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-black text-amber-950 flex items-center gap-2 drop-shadow-xs">
              TRỢ LÝ AI TẠO CÂU HỎI & KHO CÂU HỎI BÀI HỌC
            </h3>
            <p className="text-xs text-amber-900 mt-0.5 font-bold">
              Tự động hóa 100% quá trình tạo câu hỏi trắc nghiệm & tự luận theo chương trình GDPT 2018
            </p>
          </div>
        </div>

        {/* Sub Tab Switcher */}
        <div 
          style={{ background: '#FEF9C3', border: '1.5px solid #FDE047' }}
          className="flex p-1 rounded-2xl text-xs font-black shrink-0"
        >
          <button
            onClick={() => setActiveSubTab('ai_generator')}
            style={
              activeSubTab === 'ai_generator'
                ? { background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)', color: '#FFFFFF', border: '2px solid #34D399' }
                : { background: 'transparent', color: '#78350F' }
            }
            className="px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-xs font-black"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>🤖 AI Tạo Câu Hỏi</span>
          </button>

          <button
            onClick={() => setActiveSubTab('preset_bank')}
            style={
              activeSubTab === 'preset_bank'
                ? { background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)', color: '#FFFFFF', border: '2px solid #34D399' }
                : { background: 'transparent', color: '#78350F' }
            }
            className="px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-xs font-black"
          >
            <BookOpen className="w-4 h-4 text-emerald-300" />
            <span>📚 Kho Câu Hỏi Mẫu</span>
          </button>
        </div>
      </div>


      {/* ==================================================================== */}
      {/* SUB TAB 1: AI AUTO QUESTION GENERATOR */}
      {/* ==================================================================== */}
      {activeSubTab === 'ai_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Generator Form Panel - NỀN VÀNG NHẠT */}
          <div 
            style={{
              background: '#FFFBEB',
              border: '2px solid #FDE047',
              boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.2)'
            }}
            className="p-6 rounded-3xl space-y-4 text-amber-950 shadow-xl"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-amber-300/80 text-amber-950 text-sm font-heading font-black">
              <Wand2 className="w-4 h-4 text-amber-600" />
              <span>Thiết Lập Yêu Cầu Tạo Câu Hỏi AI</span>
            </div>

            <form onSubmit={handleGenerateAiQuiz} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-amber-950 mb-1">Môn Học (GDPT 2018):</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-amber-300 text-xs font-black text-slate-900 focus:outline-none focus:border-amber-500 shadow-inner"
                >
                  <option value="Khoa Học Tự Nhiên">Khoa Học Tự Nhiên</option>
                  <option value="Toán Học">Toán Học</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Ngữ Văn">Ngữ Văn</option>
                  <option value="Lịch Sử & Địa Lý">Lịch Sử & Địa Lý</option>
                  <option value="Tin Học">Tin Học</option>
                  <option value="GDCD">GDCD</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Khối Lớp:</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Số Câu Hỏi:</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={5}>5 Câu Hỏi</option>
                    <option value={10}>10 Câu Hỏi</option>
                    <option value={15}>15 Câu Hỏi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dạng Câu Hỏi:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuestionType('trac_nghiem')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      questionType === 'trac_nghiem'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Trắc Nghiệm A/B/C/D
                  </button>

                  <button
                    type="button"
                    onClick={() => setQuestionType('tu_luan')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      questionType === 'tu_luan'
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Tự Luận Gõ Từ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Bài Học / Chủ Đề Cụ Thể:</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Nguyên tử khối / Hình tam giác / Past Simple..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                {generating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>AI Đang Phân Tích & Tạo Câu Hỏi...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 text-amber-300" />
                    <span>✨ AI TẠO BỘ CÂU HỎI NGAY</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview & Export Panel */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            {generatedQuiz ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-base font-heading font-extrabold text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      {generatedQuiz.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Đã tạo thành công {generatedQuiz.questions.length} câu hỏi chuẩnGDPT 2018
                    </p>
                  </div>

                  <button
                    onClick={() => handlePublishQuizToGame(generatedQuiz)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
                  >
                    <Gamepad2 className="w-4 h-4" />
                    <span>🚀 ĐĂNG THÀNH GAME MỚI NGAY</span>
                  </button>
                </div>

                {/* List of Generated Questions */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {generatedQuiz.questions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                      <div className="font-bold text-white flex items-start gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono">
                          Q{idx + 1}
                        </span>
                        <span className="leading-relaxed">{q.q}</span>
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 pl-6">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded-lg border font-mono text-[11px] ${
                                oIdx === q.correct
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.answers && (
                        <div className="pl-6 text-emerald-400 font-mono font-bold">
                          Đáp án tự luận: {q.answers.join(' / ')}
                        </div>
                      )}

                      <div className="pl-6 text-[11px] text-slate-400 italic">
                        💡 {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-800 rounded-2xl">
                <div className="w-16 h-16 rounded-3xl bg-purple-600/10 text-purple-400 flex items-center justify-center mb-3">
                  <Bot className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-sm font-heading font-bold text-slate-300 mb-1">
                  Chưa Có Bộ Câu Hỏi Nào Được Tạo
                </h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Nhập tên bài học bên trái và nhấp nút <strong className="text-purple-400">"AI TẠO BỘ CÂU HỎI NGAY"</strong> để hệ thống tự động sinh bộ câu hỏi và tạo game tức thì!
                </p>
              </div>
            )}
          </div>

        </div>
      )}


      {/* ==================================================================== */}
      {/* SUB TAB 2: PRESET QUESTION BANK (GDPT 2018) */}
      {/* ==================================================================== */}
      {activeSubTab === 'preset_bank' && (
        <div className="space-y-4">
          
          {/* Search Input Bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm môn học, từ khóa bài học GDPT..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Question Bank Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPresetBank.map((bank) => (
              <div key={bank.id} className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                      {bank.subject} - Lớp {bank.grade_level}
                    </span>
                    <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {bank.count} Câu Hỏi
                    </span>
                  </div>

                  <h4 className="text-sm font-heading font-extrabold text-white mb-1">
                    {bank.topic}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Bộ câu hỏi chuẩn kiến thức GDPT 2018 với lời giải thích chi tiết đầy đủ.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Dạng: {bank.type === 'trac_nghiem' ? 'Trắc nghiệm A/B/C/D' : 'Tự luận gõ từ'}
                  </span>

                  <button
                    onClick={() => handlePublishQuizToGame(bank)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>TẠO GAME NGAY</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
