import React from 'react';
import { Calendar, CheckSquare, FileText, Lock, Wifi, Battery } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: 'today' | 'tasks' | 'notes' | 'vault';
  onTabChange: (tab: 'today' | 'tasks' | 'notes' | 'vault') => void;
  showBottomBar?: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  showBottomBar = true
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative w-full max-w-[390px] h-[780px] rounded-[44px] bg-neutral-950 border-[7px] border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100 ring-1 ring-neutral-700/40">
      {/* Front camera punch hole */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-neutral-900 border border-neutral-800 z-50 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-950/80" />
      </div>

      {/* Android Status Bar */}
      <div className="h-10 px-6 flex items-center justify-between text-[11px] font-semibold text-neutral-400 select-none shrink-0 z-40 bg-neutral-950">
        <span>{currentTime}</span>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-1">
            <span className="text-[10px]">98%</span>
            <Battery className="w-4 h-4 fill-neutral-400" />
          </div>
        </div>
      </div>

      {/* Screen Content Container */}
      <div className="flex-1 overflow-hidden relative bg-neutral-900">
        {children}
      </div>

      {/* Material 3 Bottom Navigation Bar - 4 Primary destinations */}
      {showBottomBar && (
        <div className="h-16 bg-neutral-950 border-t border-neutral-800/80 px-4 flex items-center justify-around shrink-0 z-40">
          <button
            onClick={() => onTabChange('today')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'today' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Today</span>
          </button>

          <button
            onClick={() => onTabChange('tasks')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'tasks' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Tasks</span>
          </button>

          <button
            onClick={() => onTabChange('notes')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'notes' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Notes</span>
          </button>

          <button
            onClick={() => onTabChange('vault')}
            title="Password Manager"
            aria-label="Password Manager"
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              activeTab === 'vault' ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-semibold">Passwords</span>
          </button>
        </div>
      )}

      {/* Android Gesture Bar */}
      <div className="h-4 bg-neutral-950 flex items-center justify-center shrink-0">
        <div className="w-28 h-1 rounded-full bg-neutral-700/60" />
      </div>
    </div>
  );
};
