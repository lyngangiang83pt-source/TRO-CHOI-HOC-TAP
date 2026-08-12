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
    <div className="w-full glass-panel rounded-3xl p-5 border border-slate-800 flex flex-col items-center">
      <h3 className="text-sm font-heading font-bold text-white mb-2 text-center">
        {title}
      </h3>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
            <Radar
              name="Năng lực"
              dataKey="score"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
