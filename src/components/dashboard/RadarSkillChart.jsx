import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const SAMPLE_SKILL_DATA = [
  { subject: 'Toán Học', score: 85, fullMark: 100 },
  { subject: 'Ngữ Văn', score: 70, fullMark: 100 },
  { subject: 'Tiếng Anh', score: 92, fullMark: 100 },
  { subject: 'KHTN', score: 88, fullMark: 100 },
  { subject: 'LS & DL', score: 75, fullMark: 100 },
  { subject: 'Tin Học', score: 95, fullMark: 100 },
  { subject: 'GDCD', score: 80, fullMark: 100 }
];

export const RadarSkillChart = ({ data = SAMPLE_SKILL_DATA, title = "Biểu Đồ Đánh Giá Năng Lực 7 Môn GDPT 2018" }) => {
  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #065F46 0%, #059669 50%, #047857 100%)',
        border: '2px solid #34D399',
        boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.35)'
      }}
      className="w-full rounded-3xl p-6 flex flex-col items-center shadow-xl"
    >
      <h3 
        style={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
        className="text-base font-heading font-black mb-4 text-center tracking-wide"
      >
        {title}
      </h3>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#FEF08A', fontSize: 12, fontWeight: '800' }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              stroke="rgba(255, 255, 255, 0.4)" 
              tick={{ fill: '#D1FAE5', fontSize: 10 }}
            />
            <Radar
              name="Điểm Năng Lực"
              dataKey="score"
              stroke="#FACC15"
              strokeWidth={3}
              fill="#FDE047"
              fillOpacity={0.45}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#064E3B', 
                borderColor: '#34D399', 
                borderWidth: '2px',
                borderRadius: '16px', 
                color: '#FFFFFF', 
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
