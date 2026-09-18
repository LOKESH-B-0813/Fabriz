import React, { useState } from 'react';
import { Priority, Recurrence } from '../types';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    description: string,
    dueAt: number | null,
    priority: Priority,
    recurrence: Recurrence
  ) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duePreset, setDuePreset] = useState<'today' | 'tomorrow' | 'later' | 'none'>('today');
  const [priority, setPriority] = useState<Priority>('NONE');
  const [recurrence, setRecurrence] = useState<Recurrence>('NONE');
  const [showMore, setShowMore] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();
    let computedDue: number | null = null;
    if (duePreset === 'today') {
      const d = new Date();
      d.setHours(18, 0, 0, 0);
      computedDue = d.getTime();
    } else if (duePreset === 'tomorrow') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(18, 0, 0, 0);
      computedDue = d.getTime();
    } else if (duePreset === 'later') {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      d.setHours(12, 0, 0, 0);
      computedDue = d.getTime();
    }

    onAdd(title.trim(), description.trim(), computedDue, priority, recurrence);
    setTitle('');
    setDescription('');
    setDuePreset('today');
    setPriority('NONE');
    setRecurrence('NONE');
    setShowMore(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-semibold">New Task</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs attention?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800/90 border border-neutral-700 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-hidden focus:border-amber-400 transition"
            />
          </div>

          <div>
            <div className="text-xs text-neutral-400 mb-1.5 font-medium">When to address</div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['today', 'tomorrow', 'later', 'none'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDuePreset(preset)}
                  className={`py-1.5 px-2 rounded-lg text-xs capitalize font-medium border transition ${
                    duePreset === preset
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 font-semibold'
                      : 'bg-neutral-800/60 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
                  }`}
                >
                  {preset === 'none' ? 'Someday' : preset}
                </button>
              ))}
            </div>
          </div>

          {/* Progressive disclosure toggle */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center justify-between py-1 text-xs text-neutral-400 hover:text-neutral-200 transition"
          >
            <span>{showMore ? 'Fewer options' : 'More options (notes, priority, repeat)'}</span>
            {showMore ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMore && (
            <div className="space-y-3.5 pt-1 border-t border-neutral-800">
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional context, notes, or sub-steps..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800/70 border border-neutral-700 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-hidden focus:border-amber-400 transition"
                />
              </div>

              <div>
                <div className="text-xs text-neutral-400 mb-1 font-medium">Priority</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['NONE', 'LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-1 px-2 rounded-md text-xs capitalize border transition ${
                        priority === p
                          ? 'bg-neutral-200 text-neutral-900 border-neutral-200 font-medium'
                          : 'bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      {p === 'NONE' ? 'Normal' : p.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs text-neutral-400 mb-1 font-medium">Repeat</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRecurrence(r)}
                      className={`py-1 px-2 rounded-md text-xs capitalize border transition ${
                        recurrence === r
                          ? 'bg-neutral-200 text-neutral-900 border-neutral-200 font-medium'
                          : 'bg-neutral-800/60 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      {r === 'NONE' ? 'Once' : r.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:pointer-events-none text-neutral-950 font-semibold text-xs transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
