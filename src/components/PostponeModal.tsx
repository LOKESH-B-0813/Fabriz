import React from 'react';
import { Task } from '../types';
import { Clock, ArrowRight, Lightbulb, X } from 'lucide-react';

interface PostponeModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDueAt: number, note: string) => void;
}

export const PostponeModal: React.FC<PostponeModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const count = task.postponedCount;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold">Reschedule Task</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {count >= 2 && (
          <div className="my-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex gap-3 text-left">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-amber-200">
              {count >= 4
                ? `This task has been postponed ${count} times. Consider breaking it down into a smaller initial step.`
                : `You've moved this task ${count} times. Give yourself realistic breathing room.`}
            </p>
          </div>
        )}

        <p className="text-xs text-neutral-400 mb-3 text-left">
          When would you like to revisit &ldquo;<span className="text-neutral-200 font-medium">{task.title}</span>&rdquo;?
        </p>

        <div className="space-y-2">
          <button
            onClick={() => {
              onConfirm(now + 3 * 60 * 60 * 1000, 'Postponed +3 hours');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/50 text-left transition group"
          >
            <div>
              <div className="text-sm font-medium text-neutral-200">Later today</div>
              <div className="text-xs text-neutral-400">+3 hours from now</div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-200 transition" />
          </button>

          <button
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              tomorrow.setHours(9, 0, 0, 0);
              onConfirm(tomorrow.getTime(), 'Moved to tomorrow morning');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/50 text-left transition group"
          >
            <div>
              <div className="text-sm font-medium text-neutral-200">Tomorrow morning</div>
              <div className="text-xs text-neutral-400">9:00 AM</div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-200 transition" />
          </button>

          <button
            onClick={() => {
              onConfirm(now + 2 * dayMs, 'Moved 2 days ahead');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/50 text-left transition group"
          >
            <div>
              <div className="text-sm font-medium text-neutral-200">In 2 days</div>
              <div className="text-xs text-neutral-400">48 hours delay</div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-200 transition" />
          </button>

          <button
            onClick={() => {
              onConfirm(now + 7 * dayMs, 'Postponed to next week');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/50 text-left transition group"
          >
            <div>
              <div className="text-sm font-medium text-neutral-200">Next week</div>
              <div className="text-xs text-neutral-400">+7 days</div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-200 transition" />
          </button>
        </div>

        <div className="mt-4 pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
