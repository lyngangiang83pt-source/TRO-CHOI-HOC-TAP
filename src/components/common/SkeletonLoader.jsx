import React from 'react';

export const GameCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 shadow-lg space-y-3 skeleton-dark">
      <div className="w-full h-44 rounded-xl bg-slate-800/60" />
      <div className="flex justify-between items-center">
        <div className="w-20 h-5 rounded-full bg-slate-800/80" />
        <div className="w-16 h-5 rounded-full bg-slate-800/80" />
      </div>
      <div className="w-3/4 h-6 rounded bg-slate-800/80" />
      <div className="w-full h-10 rounded-lg bg-slate-800/80" />
      <div className="pt-2 flex justify-between items-center">
        <div className="w-16 h-4 rounded bg-slate-800/80" />
        <div className="w-24 h-8 rounded-xl bg-slate-800/80" />
      </div>
    </div>
  );
};

export const LeaderboardRowSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 skeleton-dark">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800" />
        <div className="w-10 h-10 rounded-xl bg-slate-800" />
        <div className="space-y-1">
          <div className="w-32 h-4 rounded bg-slate-800" />
          <div className="w-20 h-3 rounded bg-slate-800" />
        </div>
      </div>
      <div className="w-20 h-6 rounded-full bg-slate-800" />
    </div>
  );
};
