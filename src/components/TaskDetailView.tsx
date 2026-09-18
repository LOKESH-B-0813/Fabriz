import React, { useState } from 'react';
import { Task, TaskEvent } from '../types';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  History,
  Lightbulb,
  MoreVertical,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { PostponeModal } from './PostponeModal';

interface TaskDetailViewProps {
  task: Task;
  onBack: () => void;
  onToggleComplete: (id: string) => void;
  onPostpone: (id: string, newDueAt: number, note: string) => void;
  onDelete: (id: string) => void;
}

export const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  task,
  onBack,
  onToggleComplete,
  onPostpone,
  onDelete
}) => {
  const [isPostponeOpen, setIsPostponeOpen] = useState(false);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const ageDays = Math.max(0, Math.floor((now - task.createdAt) / dayMs));
  const delayDays = Math.max(0, Math.floor(task.totalPostponementDuration / dayMs));

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-4 pb-20 text-neutral-100">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Heading */}
      <div className="mt-4">
        <h2 className="text-xl font-bold tracking-tight text-neutral-100">{task.title}</h2>
        {task.description ? (
          <p className="mt-2 text-xs text-neutral-300 leading-relaxed">{task.description}</p>
        ) : (
          <p className="mt-2 text-xs italic text-neutral-500">No notes attached.</p>
        )}
      </div>

      {/* Quick metadata chips */}
      <div className="flex flex-wrap gap-2 mt-3.5">
        {task.priority !== 'NONE' && (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60">
            Priority: {task.priority.toLowerCase()}
          </span>
        )}
        {task.dueAt && (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/60 flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-neutral-400" />
            {formatDate(task.dueAt)}
          </span>
        )}
      </div>

      {/* Avoidance Reflection Banner (if postponed multiple times) */}
      {task.postponedCount >= 2 && (
        <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 flex gap-3 text-left">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-amber-300">Avoidance Memory Active</div>
            <div className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {task.postponedCount >= 4
                ? `You have postponed this task ${task.postponedCount} times. A recurring delay often signals an ambiguous first step. Try breaking it down into a 5-minute action.`
                : `Moved ${task.postponedCount} times. Notice when you tend to push this task back.`}
            </div>
          </div>
        </div>
      )}

      {/* Section: TASK MEMORY */}
      <div className="mt-6">
        <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
          TASK MEMORY
        </div>
        <div className="rounded-xl bg-neutral-850/80 border border-neutral-800 p-3.5 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Created</span>
            <span className="font-medium text-neutral-200">{ageDays} days ago</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Postponed</span>
            <span className={`font-semibold ${task.postponedCount >= 3 ? 'text-amber-400' : 'text-neutral-200'}`}>
              {task.postponedCount} {task.postponedCount === 1 ? 'time' : 'times'}
            </span>
          </div>
          {task.lastPostponedAt && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Last postponed</span>
              <span className="text-neutral-300">{formatDate(task.lastPostponedAt)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Total delay accumulated</span>
            <span className="font-medium text-neutral-200">{delayDays} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Review sessions</span>
            <span className="text-neutral-300">{Math.max(1, task.attemptCount)} times</span>
          </div>
        </div>
      </div>

      {/* Section: TIMELINE */}
      <div className="mt-6">
        <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-3">
          TIMELINE
        </div>
        <div className="space-y-0 pl-1">
          {task.history.map((event, idx) => {
            const isLast = idx === task.history.length - 1;
            const dotColor =
              event.type === 'CREATED'
                ? 'bg-blue-400'
                : event.type === 'POSTPONED'
                ? 'bg-amber-400'
                : event.type === 'COMPLETED'
                ? 'bg-emerald-400'
                : 'bg-neutral-500';

            return (
              <div key={event.id || idx} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full ${dotColor} mt-1`} />
                  {!isLast && <div className="w-0.5 h-9 bg-neutral-800 my-0.5" />}
                </div>
                <div className="pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-200 capitalize">
                      {event.type.toLowerCase()}
                    </span>
                    <span className="text-[10px] text-neutral-500">{formatDate(event.timestamp)}</span>
                  </div>
                  {event.note && (
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">{event.note}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-6 flex gap-2.5">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 ${
            task.completed
              ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
              : 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
          }`}
        >
          {task.completed ? (
            <>
              <RotateCcw className="w-4 h-4" />
              Reopen Task
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Complete Task
            </>
          )}
        </button>

        {!task.completed && (
          <button
            onClick={() => setIsPostponeOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-xl font-medium text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center justify-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            Postpone
          </button>
        )}
      </div>

      {/* Postpone Dialog */}
      <PostponeModal
        task={task}
        isOpen={isPostponeOpen}
        onClose={() => setIsPostponeOpen(false)}
        onConfirm={(newDue, note) => onPostpone(task.id, newDue, note)}
      />
    </div>
  );
};
