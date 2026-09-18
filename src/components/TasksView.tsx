import React, { useState, useMemo } from 'react';
import { Task, TaskFilter } from '../types';
import { Check, Clock, RotateCw, Search, X } from 'lucide-react';
import { PostponeModal } from './PostponeModal';

interface TasksViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  onPostpone: (id: string, newDueAt: number, note: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onSelectTask,
  onToggleComplete,
  onPostpone
}) => {
  const [filter, setFilter] = useState<TaskFilter>('TODAY');
  const [search, setSearch] = useState('');
  const [postponeTask, setPostponeTask] = useState<Task | null>(null);

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      // Tab filter
      switch (filter) {
        case 'TODAY':
          if (task.completed) return false;
          if (!task.dueAt) return true;
          return task.dueAt <= now + dayMs;
        case 'UPCOMING':
          if (task.completed) return false;
          return task.dueAt != null && task.dueAt > now + dayMs;
        case 'OVERDUE':
          return !task.completed && task.dueAt != null && task.dueAt < now;
        case 'COMPLETED':
          return task.completed;
        case 'POSTPONED':
          return !task.completed && task.postponedCount >= 2;
        default:
          return true;
      }
    });
  }, [tasks, filter, search, now]);

  const filterTabs: { id: TaskFilter; label: string }[] = [
    { id: 'TODAY', label: 'Today' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'OVERDUE', label: 'Overdue' },
    { id: 'POSTPONED', label: 'Avoided' },
    { id: 'COMPLETED', label: 'Done' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden text-neutral-100">
      {/* Header */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">Tasks</h1>
      </div>

      {/* Search Input */}
      <div className="px-5 py-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-850 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-hidden focus:border-amber-400 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                isActive
                  ? 'bg-amber-400 text-neutral-950 border-amber-400 font-semibold'
                  : 'bg-neutral-850 text-neutral-400 border-neutral-800 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2 pb-20">
        {filteredTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
            <div className="text-xs font-medium">No tasks found</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              {search ? 'Try a different search query.' : 'Clear filters or add a new task.'}
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isAvoided = task.postponedCount >= 3;
            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="group relative flex items-start gap-3 p-3 rounded-xl bg-neutral-850/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-neutral-700/80 transition cursor-pointer text-left"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(task.id);
                  }}
                  className={`shrink-0 w-4 h-4 mt-0.5 rounded-full border transition flex items-center justify-center ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-400 text-neutral-950'
                      : 'border-neutral-600 hover:border-amber-400'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                </button>

                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-medium block truncate ${
                      task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                    }`}
                  >
                    {task.title}
                  </span>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    {task.dueAt && (
                      <span className="text-[10px] text-neutral-400">
                        {new Date(task.dueAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    )}

                    {task.postponedCount > 0 && (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${
                          isAvoided
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                            : 'text-neutral-400'
                        }`}
                      >
                        <RotateCw className="w-2.5 h-2.5" />
                        {task.postponedCount}x postponed
                      </span>
                    )}
                  </div>
                </div>

                {!task.completed && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPostponeTask(task);
                    }}
                    title="Postpone"
                    className="p-1 rounded-md text-neutral-500 hover:text-amber-400 hover:bg-neutral-800 transition"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

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
