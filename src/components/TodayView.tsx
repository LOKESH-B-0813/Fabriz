import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Clock, Plus, RotateCw, Settings, Sparkles } from 'lucide-react';
import { PostponeModal } from './PostponeModal';

interface TodayViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  onPostpone: (id: string, newDueAt: number, note: string) => void;
  onOpenAdd: () => void;
  onOpenInsights?: () => void;
  onOpenSettings: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  onSelectTask,
  onToggleComplete,
  onPostpone,
  onOpenAdd,
  onOpenInsights,
  onOpenSettings
}) => {
  const [postponeTask, setPostponeTask] = useState<Task | null>(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col h-full overflow-hidden text-neutral-100">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-neutral-400">{greeting}</div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Today</h1>
        </div>
        <div className="flex items-center gap-1">
          {onOpenInsights && (
            <button
              onClick={onOpenInsights}
              className="p-2 rounded-xl text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition"
              title="Task Insights"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2.5 pb-24">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
            <div className="text-sm font-medium">Nothing demanding your attention.</div>
            <div className="text-xs text-neutral-500 mt-1">Take a breath or plan ahead.</div>
          </div>
        ) : (
          tasks.map((task) => {
            const isAvoided = task.postponedCount >= 3;
            const hasDueTime = task.dueAt != null;

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="group relative flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-850/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-700/80 transition cursor-pointer text-left shadow-xs"
              >
                {/* Complete circle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(task.id);
                  }}
                  className={`shrink-0 w-5 h-5 mt-0.5 rounded-full border transition flex items-center justify-center ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-neutral-950'
                      : 'border-neutral-600 hover:border-amber-400'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium truncate ${
                        task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Badges / Micro-details */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {hasDueTime && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400 bg-neutral-900/60 px-2 py-0.5 rounded-md border border-neutral-800">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(task.dueAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}

                    {task.priority !== 'NONE' && (
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md ${
                          task.priority === 'HIGH'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}

                    {/* Signature Differentiator: Avoidance / Postponement badge */}
                    {task.postponedCount > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                          isAvoided
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-neutral-800/90 text-neutral-400 border-neutral-700/50'
                        }`}
                      >
                        <RotateCw className="w-2.5 h-2.5" />
                        Postponed {task.postponedCount}x
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Postpone button */}
                {!task.completed && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPostponeTask(task);
                    }}
                    title="Reschedule task"
                    className="shrink-0 opacity-80 hover:opacity-100 p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Add Task button */}
      <div className="absolute bottom-16 left-0 right-0 p-4 pointer-events-none flex justify-center">
        <button
          onClick={onOpenAdd}
          className="pointer-events-auto flex items-center justify-center gap-2 w-full max-w-[calc(100%-2rem)] py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-sm shadow-lg shadow-amber-500/10 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add task
        </button>
      </div>

      {/* Postpone Modal */}
      {postponeTask && (
        <PostponeModal
          task={postponeTask}
          isOpen={!!postponeTask}
          onClose={() => setPostponeTask(null)}
          onConfirm={(newDue, note) => {
            onPostpone(postponeTask.id, newDue, note);
            setPostponeTask(null);
          }}
        />
      )}
    </div>
  );
};
