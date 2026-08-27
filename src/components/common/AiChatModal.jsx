import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  HelpCircle, 
  GraduationCap, 
  MessageSquare, 
  Maximize2, 
  Minimize2,
  Lightbulb,
  Upload,
  FileCode,
  Globe,
  Settings,
  RotateCcw,
  CheckCircle2,
  Code
} from 'lucide-react';
import { soundFx } from '../../lib/soundFx';

// Kho kiến thức AI phản hồi thông minh chuẩn GDPT 2018 THCS
const AI_KNOWLEDGE_BASE = [
  {
    keywords: ['pytago', 'pitago', 'tam giac vuong', 'toán', 'toan'],
    subject: 'Toán Học',
    reply: `📐 **Định lý Pytago (Toán THCS - Hình học 7, 8):**
- Trong một tam giác vuông, bình phương của cạnh huyền bằng tổng bình phương của hai cạnh góc vuông.
- **Công thức:** a² + b² = c² (với c là cạnh huyền, a và b là hai cạnh góc vuông).
- **Ví dụ mẫu:** Cho tam giác vuông có a = 3cm, b = 4cm.
  ⇒ c² = 3² + 4² = 9 + 16 = 25 ⇒ c = √25 = 5cm.
- **Bộ ba số Pytago phổ biến:** (3, 4, 5), (5, 12, 13), (6, 8, 10), (8, 15, 17).`
  },
  {
    keywords: ['nguyên tử', 'nguyen tu', 'proton', 'electron', 'neutron', 'hạt nhân', 'khtn', 'hóa học', 'khoa học tự nhiên'],
    subject: 'Khoa Học Tự Nhiên',
    reply: `🧪 **Cấu Tạo Nguyên Tử (KHTN 7 - GDPT 2018):**
1. **Hạt Nhân (ở tâm nguyên tử):**
   - **Proton (p):** Mang điện tích dương (+1), khối lượng ≈ 1 amu.
   - **Neutron (n):** Không mang điện, khối lượng ≈ 1 amu.
2. **Vỏ Nguyên Tử (xung quanh hạt nhân):**
   - **Electron (e):** Mang điện tích âm (-1), khối lượng rất nhỏ (≈ 0.00055 amu).
3. **Đặc điểm quan trọng:**
   - Nguyên tử **trung hòa về điện**: Số Proton = Số Electron (Z = p = e).
   - Khối lượng nguyên tử tập trung hầu hết ở **hạt nhân** do electron có khối lượng không đáng kể.`
  },
  {
    keywords: ['quang hợp', 'quang hop', 'thực vật', 'sinh học', 'khtn 7'],
    subject: 'Khoa Học Tự Nhiên',
    reply: `🌿 **Quá Trình Quang Hợp Ở Thực Vật (KHTN 7):**
- **Phương trình tổng quát:**
  Nước (H₂O) + Khí Carbon dioxide (CO₂) —(Ánh sáng mặt trời, Diệp lục)→ Glucose (C₆H₁₂O₆) + Khí Oxygen (O₂)
- **Vai trò:**
  - Cung cấp nguồn chất hữu cơ nuôi cây và sinh vật dị dưỡng.
  - Cân bằng khí quyển: hấp thụ CO₂ và giải phóng khí O₂ duy trì sự sống trên Trái Đất.`
  },
  {
    keywords: ['đồng chí', 'dong chi', 'chính hữu', 'ngữ văn', 'ngu van', 'văn học'],
    subject: 'Ngữ Văn',
    reply: `📖 **Phân Tích Bài Thơ "Đồng Chí" - Chính Hữu (Ngữ Văn THCS):**
- **Hoàn cảnh sáng tác:** Đầu năm 1948, sau chiến dịch Việt Bắc thu - đông 1947.
- **Cơ sở hình thành tình đồng chí:**
  1. Chung cảnh ngộ xuất thân nghèo khó: *"Quê hương anh nước mặn đồng chua / Làng tôi nghèo đất cày lên sỏi đá"*.
  2. Chung lý tưởng chiến đấu, cùng thực hiện nhiệm vụ thiêng liêng.
  3. Cùng chia sẻ những gian lao, thiếu thốn nơi chiến trường.
- **Hình ảnh biểu tượng tuyệt đẹp:** *"Đầu súng trăng treo"* - sự kết hợp hài hòa giữa hiện thực khốc liệt và cảm hứng lãng mạn cách mạng.`
  },
  {
    keywords: ['thì', 'tense', 'present simple', 'past simple', 'hiện tại đơn', 'tiếng anh', 'english'],
    subject: 'Tiếng Anh',
    reply: `🇬🇧 **Tóm Tắt Các Thì Tiếng Anh Cơ Bản THCS:**
1. **Hiện Tại Đơn (Present Simple):**
   - Công thức: S + V(s/es) + O
   - Dùng cho thói quen, sự thật hiển nhiên. (Dấu hiệu: always, usually, every day).
2. **Quá Khứ Đơn (Past Simple):**
   - Công thức: S + V2/ed + O
   - Dùng cho hành động đã xảy ra và kết thúc trong quá khứ. (Dấu hiệu: yesterday, last year, ago).
3. **Hiện Tại Hoàn Thành (Present Perfect):**
   - Công thức: S + have/has + V3/ed + O
   - Dùng cho hành động xảy ra trong quá khứ kéo dài đến hiện tại. (Dấu hiệu: since, for, already, yet).`
  },
  {
    keywords: ['điện biên phủ', 'dien bien phu', '1954', 'lịch sử', 'lich su', 'địa lý'],
    subject: 'Lịch Sử & Địa Lý',
    reply: `📜 **Chiến Thắng Lịch Sử Điện Biên Phủ (7/5/1954):**
- **Tổng chỉ huy:** Đại tướng Võ Nguyên Giáp.
- **Phương châm tác chiến:** Chuyển từ *"Đánh nhanh, thắng nhanh"* sang *"Đánh chắc, tiến chắc"*.
- **Thời gian diễn ra:** Gồm 3 đợt tiến công từ 13/3/1954 đến 17h30 ngày 7/5/1954 (toàn thắng).
- **Ý nghĩa lịch sử:** Đập tan kế hoạch Nava của thực dân Pháp, đưa đến việc ký kết Hiệp định Giơ-ne-vơ 1954, *"Lừng lẫy năm châu, chấn động địa cầu"*!`
  },
  {
    keywords: ['thuật toán', 'thuat toan', 'nhi phan', 'tìm kiếm', 'tin học', 'tin hoc', 'scratch', 'python'],
    subject: 'Tin Học',
    reply: `💻 **Thuật Toán Tìm Kiếm Nhị Phân (Binary Search - Tin Học THCS):**
- **Điều kiện áp dụng:** Danh sách các phần tử **BẮT BUỘC ĐÃ ĐƯỢC SẮP XẾP** (tăng dần hoặc giảm dần).
- **Nguyên lý hoạt động:**
  1. So sánh phần tử cần tìm với phần tử ở giữa danh sách.
  2. Nếu bằng ⇒ Tìm thấy ngay.
  3. Nếu nhỏ hơn ⇒ Thu hẹp phạm vi tìm kiếm sang nửa bên trái.
  4. Nếu lớn hơn ⇒ Thu hẹp phạm vi tìm kiếm sang nửa bên phải.
  5. Lặp lại cho đến khi tìm thấy hoặc không còn phần tử nào.
- **Độ phức tạp:** O(log₂ N) - Cực kỳ nhanh so với tìm kiếm tuần tự!`
  },
  {
    keywords: ['gdcd', 'quyền', 'nghĩa vụ', 'học tập', 'pháp luật', 'đạo đức'],
    subject: 'Giáo Dục Công Dân',
    reply: `⚖️ **Quyền & Nghĩa Vụ Học Tập Của Học Sinh (GDCD THCS):**
- **Quyền học tập:** Mọi công dân đều có quyền học không hạn chế từ thấp đến cao, học bất cứ ngành nghề nào, học bằng nhiều hình thức.
- **Nghĩa vụ của học sinh:**
  - Hoàn thành chương trình phổ cập giáo dục THCS.
  - Chăm chỉ rèn luyện đạo đức, tích cực tiếp thu kiến thức.
  - Kính trọng thầy cô giáo, đoàn kết giúp đỡ bạn bè cùng tiến bộ.`
  }
];

const SUGGESTED_QUESTIONS = [
  { text: '📐 Giải thích định lý Pytago & bài tập mẫu', query: 'định lý pytago là gì và ví dụ' },
  { text: '🧪 Cấu tạo nguyên tử gồm các hạt nào?', query: 'cấu tạo nguyên tử proton electron' },
  { text: '🌿 Phương trình & vai trò quang hợp KHTN 7', query: 'quang hợp ở thực vật' },
  { text: '📖 Phân tích bài thơ Đồng Chí của Chính Hữu', query: 'bài thơ đồng chí chính hữu' },
  { text: '🇬🇧 Tổng hợp các thì tiếng Anh hay gặp ở THCS', query: 'các thì tiếng anh present simple past simple' },
  { text: '📜 Ý nghĩa chiến thắng lịch sử Điện Biên Phủ 1954', query: 'chiến thắng điện biên phủ 1954' },
  { text: '💻 Nguyên lý thuật toán tìm kiếm nhị phân', query: 'thuật toán tìm kiếm nhị phân tin học' }
];

// Mã HTML Chatbox mẫu mặc định nếu chưa upload
const DEFAULT_SAMPLE_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbox HTML Tùy Chỉnh</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #064E3B; color: #FFFFFF; display: flex; flex-direction: column; height: 100vh; padding: 16px; }
    .header { background: #065F46; padding: 12px 16px; border-radius: 16px; border: 2px solid #34D399; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
    .header h1 { font-size: 15px; color: #FEF08A; font-weight: 800; }
    .chat-box { flex: 1; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    .msg { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 13px; line-height: 1.5; }
    .msg.bot { background: #059669; color: #FFFFFF; border: 1px solid #34D399; align-self: flex-start; }
    .msg.user { background: #FEF08A; color: #064E3B; font-weight: bold; align-self: flex-end; }
    .input-row { display: flex; gap: 8px; margin-top: 12px; }
    input { flex: 1; padding: 12px 16px; border-radius: 12px; border: 2px solid #34D399; font-size: 13px; font-weight: bold; outline: none; }
    button { background: #FBBF24; color: #451A03; border: 2px solid #FDE047; font-weight: 900; padding: 12px 20px; border-radius: 12px; cursor: pointer; transition: transform 0.1s; }
    button:hover { transform: scale(1.02); }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤖 CHATBOX HTML TỰ TẢI LÊN CỦA THẦY</h1>
    <span style="font-size: 11px; background: #047857; padding: 4px 8px; border-radius: 8px; border: 1px solid #34D399;">HTML Live</span>
  </div>
  <div class="chat-box" id="chat">
    <div class="msg bot">
      👋 Xin chào Thầy và các bạn học sinh! Đây là khung Chatbox HTML tự tải lên.<br>
      Thầy có thể dán mã nhúng bot Coze, Dify, Botpress, Tawk.to hoặc upload bất kỳ file HTML chatbox nào vào đây!
    </div>
  </div>
  <div class="input-row">
    <input type="text" id="userInput" placeholder="Nhập nội dung trò chuyện..." onkeypress="if(event.key==='Enter') sendMsg()">
    <button onclick="sendMsg()">Gửi</button>
  </div>
  <script>
    function sendMsg() {
      var inp = document.getElementById('userInput');
      var txt = inp.value.trim();
      if(!txt) return;
      var box = document.getElementById('chat');
      var uDiv = document.createElement('div');
      uDiv.className = 'msg user';
      uDiv.innerText = txt;
      box.appendChild(uDiv);
      inp.value = '';
      box.scrollTop = box.scrollHeight;
      setTimeout(function() {
        var bDiv = document.createElement('div');
        bDiv.className = 'msg bot';
        bDiv.innerHTML = '🤖 Đã nhận: "<b>' + txt + '</b>". Chúc Thầy và các bạn một ngày học tập thật hiệu quả!';
        box.appendChild(bDiv);
        box.scrollTop = box.scrollHeight;
      }, 500);
    }
  </script>
</body>
</html>`;

export const AiChatModal = ({ isOpen, onClose }) => {
  // Tab chế độ: 'builtin' (Trợ lý tích hợp), 'custom_html' (Xem chatbox HTML), 'upload_settings' (Cài đặt / Upload HTML)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('hocvui_chatbox_tab') || 'builtin';
  });

  // Lưu mã HTML Chatbox tùy chỉnh
  const [customHtmlCode, setCustomHtmlCode] = useState(() => {
    return localStorage.getItem('hocvui_custom_chatbox_html') || DEFAULT_SAMPLE_HTML;
  });

  // Lưu URL Chatbox ngoài nếu dùng link
  const [customChatUrl, setCustomChatUrl] = useState(() => {
    return localStorage.getItem('hocvui_custom_chatbox_url') || '';
  });

  const [useUrlMode, setUseUrlMode] = useState(() => {
    return localStorage.getItem('hocvui_chatbox_use_url') === 'true';
  });

  const [uploadedFileName, setUploadedFileName] = useState(() => {
    return localStorage.getItem('hocvui_chatbox_file_name') || 'chatbox_custom.html';
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Lịch sử tin nhắn Built-in AI
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hocvui_ai_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: `👋 **Xin chào Bạn! Mình là Trợ Lý AI Học Vui Cấp 2.**

Mình có thể hỗ trợ Bạn:
- 💡 Giải đáp thắc mắc và tóm tắt bài học **7 Môn GDPT 2018** (Toán, Khoa Học Tự Nhiên, Ngữ Văn, Tiếng Anh, Lịch Sử & Địa Lý, Tin Học, GDCD).
- 🎮 Hướng dẫn cách chơi các trò chơi học tập và mẹo vượt ải để đạt **EXP** cao nhất!
- 📝 Hỗ trợ thầy cô tạo đề cương và câu hỏi trắc nghiệm nhanh chóng.
- 📁 **Thầy có thể bấm tab "Chatbox HTML" ở trên để tự tải lên file Chatbox HTML riêng của Thầy!**`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('hocvui_ai_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, activeTab]);

  useEffect(() => {
    localStorage.setItem('hocvui_chatbox_tab', activeTab);
  }, [activeTab]);

  if (!isOpen) return null;

  // Xử lý đọc file HTML từ máy tính
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFx.play('click');
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setCustomHtmlCode(content);
        setUploadedFileName(file.name);
        setUseUrlMode(false);
        localStorage.setItem('hocvui_custom_chatbox_html', content);
        localStorage.setItem('hocvui_chatbox_file_name', file.name);
        localStorage.setItem('hocvui_chatbox_use_url', 'false');
        setSaveSuccess(true);
        soundFx.play('correct');
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    };
    reader.readAsText(file);
  };

  // Lưu cài đặt mã HTML hoặc Link URL
  const handleSaveSettings = (e) => {
    e.preventDefault();
    soundFx.play('click');
    localStorage.setItem('hocvui_custom_chatbox_html', customHtmlCode);
    localStorage.setItem('hocvui_custom_chatbox_url', customChatUrl);
    localStorage.setItem('hocvui_chatbox_use_url', useUrlMode ? 'true' : 'false');
    setSaveSuccess(true);
    soundFx.play('correct');
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('custom_html');
    }, 1200);
  };

  // Khôi phục mã HTML mẫu
  const handleResetDefaultHtml = () => {
    soundFx.play('click');
    setCustomHtmlCode(DEFAULT_SAMPLE_HTML);
    setCustomChatUrl('');
    setUseUrlMode(false);
    setUploadedFileName('chatbox_sample.html');
    localStorage.setItem('hocvui_custom_chatbox_html', DEFAULT_SAMPLE_HTML);
    localStorage.setItem('hocvui_custom_chatbox_url', '');
    localStorage.setItem('hocvui_chatbox_use_url', 'false');
    localStorage.setItem('hocvui_chatbox_file_name', 'chatbox_sample.html');
  };

  const handleSendMessage = (textToSend = inputMessage) => {
    const query = (textToSend || '').trim();
    if (!query) return;

    soundFx.play('click');
    const userMsg = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      soundFx.play('correct');
      const lowerQuery = query.toLowerCase();
      let match = AI_KNOWLEDGE_BASE.find(k => 
        k.keywords.some(kw => lowerQuery.includes(kw))
      );

      let aiReplyText = '';
      if (match) {
        aiReplyText = `🤖 **[Trợ Lý AI - Môn ${match.subject}]**\n\n` + match.reply;
      } else {
        aiReplyText = `🤖 **[Trợ Lý AI Học Vui THCS]**

Cảm ơn câu hỏi: *"${query}"* của bạn!

📌 **Gợi ý giải đáp & Phương pháp học tập:**
1. **Kiến thức cốt lõi:** Đối với chủ đề này trong chương trình GDPT 2018 THCS, bạn hãy nắm vững các định nghĩa, công thức nền tảng trong Sách Giáo Khoa và sơ đồ tư duy tóm tắt bài học.
2. **Luyện tập qua trò chơi:** Bạn có thể vào mục **"Kho Game"** trên thanh Menu, chọn đúng Lớp (6, 7, 8, 9) và Môn học để thử thách các bài chơi tương tác giúp ghi nhớ sâu hơn!
3. **Mẹo ghi điểm:** Khi làm bài trắc nghiệm, hãy dùng phương pháp loại trừ đáp án vô lý trước để tăng tỉ lệ chính xác lên 100%.

Bạn muốn mình giải thích chi tiết hơn về phần nào của chủ đề này không?`;
      }

      const aiMsg = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleCopy = (id, text) => {
    soundFx.play('click');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    soundFx.play('click');
    const welcome = messages.slice(0, 1);
    setMessages(welcome);
    localStorage.removeItem('hocvui_ai_chat_history');
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#$]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Khung Chatbox AI Nền Xanh Lá Cây Ngọc Bích & Vàng Nắng Chuẩn Đẹp */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
          border: '2px solid #34D399',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
        }}
        className={`w-full rounded-3xl flex flex-col overflow-hidden text-white transition-all duration-300 shadow-2xl ${
          isMaximized 
            ? 'h-[96vh] max-w-6xl' 
            : 'h-[88vh] max-h-[750px] max-w-3xl'
        }`}
      >
        
        {/* Header Chatbox với Bộ Chuyển Đổi Tab Chế Độ */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
            borderBottom: '2px solid #34D399'
          }}
          className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-lg border border-amber-300">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg text-white drop-shadow-sm">
                  TRỢ LÝ AI CHATBOX THCS
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/50">
                  GDPT 2018
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium hidden xs:block">
                Hỏi đáp 7 môn THCS & Hỗ trợ nhúng Chatbox HTML riêng của Thầy
              </p>
            </div>
          </div>

          {/* Tab Selector Chế Độ: Builtin AI vs Chatbox HTML Upload vs Cài Đặt */}
          <div 
            style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            className="flex p-1 rounded-2xl text-xs font-black shrink-0"
          >
            <button
              onClick={() => { soundFx.play('click'); setActiveTab('builtin'); }}
              style={
                activeTab === 'builtin'
                  ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                  : { background: 'transparent', color: '#FFFFFF' }
              }
              className="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs font-black"
              title="Trợ lý AI GDPT 2018 tích hợp sẵn"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Tích Hợp</span>
            </button>

            <button
              onClick={() => { soundFx.play('click'); setActiveTab('custom_html'); }}
              style={
                activeTab === 'custom_html'
                  ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                  : { background: 'transparent', color: '#FFFFFF' }
              }
              className="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs font-black"
              title="Xem Chatbox HTML tự tải lên của Thầy"
            >
              <FileCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Chatbox HTML</span>
            </button>

            <button
              onClick={() => { soundFx.play('click'); setActiveTab('upload_settings'); }}
              style={
                activeTab === 'upload_settings'
                  ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                  : { background: 'transparent', color: '#FFFFFF' }
              }
              className="px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-xs font-black"
              title="Upload file HTML hoặc chỉnh sửa mã chatbox"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-700" />
              <span>Upload HTML</span>
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            {activeTab === 'builtin' && (
              <button
                onClick={handleClearHistory}
                className="p-2 rounded-xl bg-white/15 hover:bg-rose-600/80 text-emerald-100 hover:text-white transition-colors"
                title="Xóa lịch sử đoạn chat AI"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="hidden sm:block p-2 rounded-xl bg-white/15 hover:bg-white/25 text-emerald-100 hover:text-white transition-colors"
              title={isMaximized ? "Thu nhỏ cửa sổ" : "Phóng to toàn màn hình"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis?.cancel();
                onClose();
              }}
              style={{ background: '#FEF08A', color: '#1E3A8A', border: '2px solid #FACC15' }}
              className="p-2 rounded-xl font-black shadow-md hover:scale-105 transition-transform"
              title="Đóng Chatbox"
            >
              <X className="w-4 h-4 text-emerald-950 font-black" />
            </button>
          </div>
        </div>


        {/* ==================================================================== */}
        {/* TAB 1: TRỢ LÝ AI TÍCH HỢP SẴN (BUILT-IN GDPT 2018) */}
        {/* ==================================================================== */}
        {activeTab === 'builtin' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Nội Dung Cuộc Trò Chuyện */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-emerald-950/40">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar Icon */}
                  <div 
                    style={
                      msg.sender === 'user' 
                        ? { background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }
                        : { background: '#059669', color: '#FFFFFF', border: '2px solid #34D399' }
                    }
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md text-xs font-black"
                  >
                    {msg.sender === 'user' ? 'HS' : <Bot className="w-4 h-4 text-amber-300" />}
                  </div>

                  {/* Message Bubble */}
                  <div 
                    style={
                      msg.sender === 'user'
                        ? { 
                            background: '#FEF9C3', 
                            color: '#1C1917', 
                            border: '2px solid #FACC15',
                            boxShadow: '0 4px 12px rgba(250, 204, 21, 0.2)'
                          }
                        : { 
                            background: 'rgba(255, 255, 255, 0.12)', 
                            color: '#FFFFFF', 
                            border: '1.5px solid rgba(255, 255, 255, 0.25)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                          }
                    }
                    className="max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2 backdrop-blur-sm"
                  >
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1 border-t border-black/10 text-[10px] opacity-75 font-mono">
                      <span>{msg.time}</span>
                      
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSpeak(msg.text)}
                            className="hover:text-amber-300 transition-colors flex items-center gap-1 font-sans font-bold"
                            title="Đọc to câu trả lời"
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span>{isSpeaking ? 'Dừng' : 'Đọc'}</span>
                          </button>

                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="hover:text-amber-300 transition-colors flex items-center gap-1 font-sans font-bold"
                            title="Sao chép nội dung"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 border-2 border-emerald-400 flex items-center justify-center shadow-md">
                    <Bot className="w-4 h-4 text-amber-300 animate-spin" />
                  </div>
                  <div className="bg-white/15 px-4 py-3 rounded-2xl border border-white/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-xs text-emerald-100 font-bold ml-1">AI đang soạn câu trả lời...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Thanh Gợi Ý Câu Hỏi Nhanh (Prompt Chips) */}
            <div 
              style={{ background: 'rgba(0, 0, 0, 0.25)', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}
              className="p-2.5 sm:p-3 overflow-x-auto flex items-center gap-2 scrollbar-none"
            >
              <span className="text-[11px] font-black text-amber-300 shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                Gợi ý:
              </span>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.query)}
                  style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-100 hover:text-white hover:bg-emerald-600 transition-all whitespace-nowrap shrink-0 shadow-xs"
                >
                  {q.text}
                </button>
              ))}
            </div>

            {/* Form Nhập Tin Nhắn */}
            <div 
              style={{ background: 'linear-gradient(135deg, #065F46 0%, #047857 100%)', borderTop: '2px solid #34D399' }}
              className="p-3 sm:p-4"
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập câu hỏi bài học hoặc thắc mắc về trò chơi (VD: 'Định lý Pytago là gì?')..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-white border-2 border-emerald-300 text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  style={{
                    background: '#FBBF24',
                    color: '#451A03',
                    border: '2px solid #FDE047',
                    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                  }}
                  className="px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  <Send className="w-4 h-4 text-amber-950" />
                  <span className="hidden sm:inline">Gửi</span>
                </button>
              </form>
            </div>
          </div>
        )}


        {/* ==================================================================== */}
        {/* TAB 2: XEM CHATBOX HTML TỰ TẢI LÊN (CUSTOM HTML / URL CHATBOX) */}
        {/* ==================================================================== */}
        {activeTab === 'custom_html' && (
          <div className="flex-1 flex flex-col bg-slate-950/40 relative">
            
            {/* Top Toolbar của Tab Chatbox HTML */}
            <div 
              style={{ background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}
              className="px-4 py-2 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-emerald-100">
                  {useUrlMode ? `Đang nhúng Link URL: ${customChatUrl || 'Chưa thiết lập'}` : `Đang chạy File HTML: ${uploadedFileName}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { soundFx.play('click'); setActiveTab('upload_settings'); }}
                  style={{ background: '#FEF08A', color: '#064E3B', border: '1.5px solid #FACC15' }}
                  className="px-3 py-1 rounded-xl font-black flex items-center gap-1.5 shadow-xs hover:scale-105 transition-all text-[11px]"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Thay Đổi / Upload HTML Khác</span>
                </button>
              </div>
            </div>

            {/* iFrame Hiển Thị Chatbox HTML */}
            <div className="flex-1 w-full h-full bg-slate-900 overflow-hidden relative">
              {useUrlMode && customChatUrl ? (
                <iframe
                  src={customChatUrl}
                  title="Custom Chatbox URL"
                  className="w-full h-full border-0"
                  allow="camera; microphone; clipboard-write; autoplay; display-capture"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
              ) : (
                <iframe
                  srcDoc={customHtmlCode}
                  title="Custom Chatbox HTML"
                  className="w-full h-full border-0"
                  allow="camera; microphone; clipboard-write; autoplay; display-capture"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
              )}
            </div>
          </div>
        )}


        {/* ==================================================================== */}
        {/* TAB 3: CÀI ĐẶT & UPLOAD FILE HTML CHATBOX (UPLOAD & EDIT CODE) */}
        {/* ==================================================================== */}
        {activeTab === 'upload_settings' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-emerald-600">
            
            <div className="border-b border-emerald-500/40 pb-3">
              <h4 className="font-heading font-black text-lg text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-300" />
                <span>Tự Tải Lên & Thiết Lập Chatbox HTML Của Thầy</span>
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Thầy có thể tải lên file HTML chatbox riêng, dán mã nhúng script (Coze, Dify, Botpress, Tawk.to...) hoặc dán đường dẫn URL.
              </p>
            </div>

            {saveSuccess && (
              <div 
                style={{ background: '#FEF08A', color: '#064E3B', border: '2px solid #FACC15' }}
                className="p-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-md animate-in fade-in"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
                <span>Đã lưu cấu hình Chatbox HTML thành công! Đang chuyển sang màn hình hiển thị...</span>
              </div>
            )}

            {/* Khung Kéo Thả / Chọn File HTML Từ Máy Tính */}
            <div 
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '2px dashed #34D399',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
              className="p-6 rounded-3xl text-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 mx-auto flex items-center justify-center font-black shadow-lg border border-amber-300">
                <FileCode className="w-8 h-8" />
              </div>
              <div>
                <h5 className="font-heading font-black text-base text-white">
                  Tải Lên File Chatbox HTML từ Máy Tính
                </h5>
                <p className="text-xs text-emerald-100 mt-1">
                  Hỗ trợ định dạng file <span className="text-amber-300 font-mono font-bold">.html / .htm</span> (Tự động lưu vào trình duyệt của Thầy)
                </p>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".html,.htm,text/html" 
                onChange={handleFileUpload} 
                className="hidden" 
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'linear-gradient(135deg, #FEF08A 0%, #FBBF24 100%)',
                  color: '#451A03',
                  border: '2px solid #FDE047'
                }}
                className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4 text-amber-950" />
                <span>Chọn File .HTML Từ Máy Tính</span>
              </button>

              {uploadedFileName && (
                <p className="text-xs text-amber-200 font-mono font-bold">
                  📁 File hiện tại: {uploadedFileName}
                </p>
              )}
            </div>

            {/* Form Tuỳ Chọn Nhúng Link URL Hoặc Soạn Thảo Code Trực Tiếp */}
            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              {/* Switcher: Nhập Code HTML vs Dán Link URL */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/20 border border-white/10">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-100">
                  <input
                    type="radio"
                    name="mode"
                    checked={!useUrlMode}
                    onChange={() => setUseUrlMode(false)}
                    className="accent-amber-400 w-4 h-4"
                  />
                  <span>Dùng Mã Code / File HTML (Mặc định)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-100">
                  <input
                    type="radio"
                    name="mode"
                    checked={useUrlMode}
                    onChange={() => setUseUrlMode(true)}
                    className="accent-amber-400 w-4 h-4"
                  />
                  <span>Dùng Đường Dẫn Web URL (iFrame)</span>
                </label>
              </div>

              {useUrlMode ? (
                <div>
                  <label className="block text-xs font-black text-amber-200 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>Đường Dẫn URL Trang Chatbox (https://...):</span>
                  </label>
                  <input
                    type="url"
                    value={customChatUrl}
                    onChange={(e) => setCustomChatUrl(e.target.value)}
                    placeholder="Ví dụ: https://my-bot.coze.com/share/... hoặc link botpress"
                    className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-emerald-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-amber-200 flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      <span>Soạn Thảo Hoặc Dán Mã HTML / Script Nhúng:</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleResetDefaultHtml}
                      className="text-[11px] font-bold text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Khôi phục mã mẫu
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={customHtmlCode}
                    onChange={(e) => setCustomHtmlCode(e.target.value)}
                    placeholder="Dán toàn bộ mã HTML, CSS, JavaScript hoặc thẻ script nhúng chatbox vào đây..."
                    className="w-full p-4 rounded-2xl bg-slate-950 border-2 border-emerald-400 text-xs font-mono text-emerald-300 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner leading-relaxed"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  style={{
                    background: '#FBBF24',
                    color: '#451A03',
                    border: '2px solid #FDE047',
                    boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                  }}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-950" />
                  <span>💾 Lưu & Xem Chatbox HTML Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={() => { soundFx.play('click'); setActiveTab('custom_html'); }}
                  style={{ background: 'rgba(255, 255, 255, 0.15)', border: '1.5px solid rgba(255, 255, 255, 0.3)' }}
                  className="px-5 py-3.5 rounded-2xl font-black text-xs hover:bg-white/25 transition-all text-white"
                >
                  Bỏ Qua
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
