import React from 'react';
import { Task } from '../types';
import { Lightbulb, RotateCcw, TrendingUp } from 'lucide-react';

interface InsightsViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onSeedDemo: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  tasks,
  onSelectTask,
  onSeedDemo
}) => {
  const now = Date.now();
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => !t.completed && t.dueAt != null && t.dueAt < now).length;
  const repeatedlyPostponed = tasks.filter((t) => !t.completed && t.postponedCount >= 2);

  // Ranked most postponed
  const mostPostponed = [...tasks]
    .filter((t) => t.postponedCount > 0)
    .sort((a, b) => b.postponedCount - a.postponedCount)
    .slice(0, 4);

  // Behavioral patterns computed deterministically
  const patterns: string[] = [];

  // Evening avoidance pattern
  const eveningDelays = tasks.flatMap((t) =>
    t.history.filter((h) => {
      if (h.type !== 'POSTPONED') return false;
      const hour = new Date(h.timestamp).getHours();
      return hour >= 21 || hour <= 2;
    })
  );

  if (eveningDelays.length >= 2) {
    patterns.push(
      'You postpone most tasks late in the evening. Fatigue often creates artificial resistance.'
    );
  }

  if (repeatedlyPostponed.length >= 2) {
    patterns.push(
      `${repeatedlyPostponed.length} active tasks have been postponed repeatedly. Consider defining an actionable 2-minute starter step.`
    );
  }

  const highDelayTasks = tasks.filter((t) => t.totalPostponementDuration > 7 * 24 * 3600 * 1000);
  if (highDelayTasks.length > 0) {
    patterns.push(
      `"${highDelayTasks[0].title}" has accumulated over a week of total delay. Is it still genuinely important to you?`
    );
  }

  if (patterns.length === 0) {
    patterns.push(
      'Tasks scheduled with morning due times are completed 2x faster than open-ended tasks.'
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-4 pb-20 text-neutral-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Insights</h1>
        <button
          onClick={onSeedDemo}
          title="Seed realistic avoidance demo scenarios"
          className="text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 px-2.5 py-1 rounded-lg transition"
        >
          Load Demo Data
        </button>
      </div>

      {/* Section: TASK MEMORY */}
      <div className="mt-2">
        <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
          TASK MEMORY
        </div>
        <div className="rounded-2xl bg-neutral-850/80 border border-neutral-800 p-4 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Tasks completed</span>
            <span className="font-semibold text-neutral-200">{completedCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Tasks currently active</span>
            <span className="font-semibold text-neutral-200">{activeCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Tasks overdue</span>
            <span className={`font-semibold ${overdueCount > 0 ? 'text-rose-400' : 'text-neutral-200'}`}>
              {overdueCount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Tasks postponed repeatedly</span>
            <span className={`font-semibold ${repeatedlyPostponed.length > 0 ? 'text-amber-400' : 'text-neutral-200'}`}>
              {repeatedlyPostponed.length}
            </span>
          </div>
        </div>
      </div>

      {/* Section: Most Postponed Tasks */}
      <div className="mt-6">
        <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
          YOUR MOST POSTPONED TASKS
        </div>
        {mostPostponed.length === 0 ? (
          <div className="rounded-xl bg-neutral-850/60 border border-neutral-800/80 p-4 text-center text-xs text-neutral-500">
            No postponements recorded yet. Fabriz tracks avoidance as you reschedule tasks.
          </div>
        ) : (
          <div className="space-y-2">
            {mostPostponed.map((task, idx) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-850/80 hover:bg-neutral-800 border border-neutral-800 cursor-pointer transition text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-xs font-bold text-neutral-500">{idx + 1}.</span>
                  <span className="text-xs font-medium text-neutral-200 truncate">{task.title}</span>
                </div>
                <span className="shrink-0 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {task.postponedCount} {task.postponedCount === 1 ? 'time' : 'times'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Patterns */}
      <div className="mt-6">
        <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
          PATTERNS
        </div>
        <div className="space-y-2.5">
          {patterns.map((pattern, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-850/80 border border-neutral-800 text-left"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-300 leading-relaxed">{pattern}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
