import React, { useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlineChevronDown } from 'react-icons/hi';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between mb-6">
      {/* Left — Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-kavach-muted mt-0.5">Real-time overview of your cloud security</p>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-4">
        {/* Instance Selector */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-kavach-text hover:bg-white/[0.06] transition-colors">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          All Instances
          <HiOutlineChevronDown className="w-4 h-4 text-kavach-muted" />
        </button>

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors">
          <HiOutlineBell className="w-5 h-5 text-kavach-muted" />
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
            3
          </span>
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/[0.08]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white">
            A
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-white leading-tight">Admin</p>
            <p className="text-[11px] text-kavach-muted leading-tight">admin@cyberkavach.io</p>
          </div>
        </div>
      </div>
    </header>
  );
}
