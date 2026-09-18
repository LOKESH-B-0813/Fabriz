/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Priority, Recurrence, Task, TaskEvent, Note, VaultEntry } from './types';
import { initialTasks } from './data/initialData';
import { AndroidFrame } from './components/AndroidFrame';
import { TodayView } from './components/TodayView';
import { TasksView } from './components/TasksView';
import { NotesView } from './components/NotesView';
import { VaultView } from './components/VaultView';
import { InsightsView } from './components/InsightsView';
import { TaskDetailView } from './components/TaskDetailView';
import { AddTaskModal } from './components/AddTaskModal';
import { SettingsView } from './components/SettingsView';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import {
  Code,
  Download,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { downloadAndroidProjectZip } from './utils/zipExporter';

const initialNotes: Note[] = [
  {
    id: 'note-1',
    userId: 'user-local',
    title: 'Fabriz Philosophy',
    content: 'Fabriz doesn’t just remember what you have to do. It remembers what you keep avoiding.\n\nSimplicity is clarity. A tool that demands too much of your attention ceases to be a tool.',
    tags: ['philosophy', 'design'],
    imageReferences: [],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000,
    archived: false
  },
  {
    id: 'note-2',
    userId: 'user-local',
    title: 'Android Keystore AES-256',
    content: 'Client-side AES-GCM encryption ensures secrets remain unreadable by database admins or intermediate proxy hops. The master key derives a high-entropy AES key via PBKDF2.',
    tags: ['security', 'cryptography'],
    imageReferences: [],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 3,
    archived: false
  }
];

const initialVaultEntries: VaultEntry[] = [
  {
    id: 'vault-1',
    userId: 'user-local',
    websiteName: 'GitHub',
    websiteUrl: 'github.com',
    username: 'lokesh.dev',
    encryptedPassword: {
      cipherText: 'encrypted_token_sample',
      iv: 'iv_sample'
    },
    plainPassword: 'ghp_SamplePersonalAccessToken999$',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3
  },
  {
    id: 'vault-2',
    userId: 'user-local',
    websiteName: 'AWS Console',
    websiteUrl: 'aws.amazon.com',
    username: 'root_ops',
    encryptedPassword: {
      cipherText: 'encrypted_token_sample_2',
      iv: 'iv_sample_2'
    },
    plainPassword: 'K8s_Production_Cluster_Secret_42#',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 6
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('fabriz_tasks_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return initialTasks;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('fabriz_notes_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
    return initialNotes;
  });

  const [vaultEntries, setVaultEntries] = useState<VaultEntry[]>(() => {
    const saved = localStorage.getItem('fabriz_vault_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved vault', e);
      }
    }
    return initialVaultEntries;
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('fabriz_onboarding_done') === 'true';
  });

  const [activeTab, setActiveTab] = useState<'today' | 'tasks' | 'notes' | 'vault'>('today');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [useDeviceFrame, setUseDeviceFrame] = useState(true);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('fabriz_tasks_data', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fabriz_notes_data', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('fabriz_vault_data', JSON.stringify(vaultEntries));
  }, [vaultEntries]);

  const handleToggleComplete = (taskId: string) => {
    const now = Date.now();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const willComplete = !t.completed;
        const newEvent: TaskEvent = {
          id: `ev-${Date.now()}`,
          type: willComplete ? 'COMPLETED' : 'REOPENED',
          timestamp: now
        };
        const updated = {
          ...t,
          completed: willComplete,
          completedAt: willComplete ? now : null,
          updatedAt: now,
          history: [...t.history, newEvent]
        };
        if (selectedTask?.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      })
    );
  };

  const handlePostpone = (taskId: string, newDueAt: number, note: string) => {
    const now = Date.now();
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const delay = Math.max(0, newDueAt - (t.dueAt || now));
        const newEvent: TaskEvent = {
          id: `ev-${Date.now()}`,
          type: 'POSTPONED',
          timestamp: now,
          note,
          previousDueAt: t.dueAt || undefined,
          newDueAt
        };
        const updated: Task = {
          ...t,
          dueAt: newDueAt,
          postponedCount: t.postponedCount + 1,
          totalPostponementDuration: t.totalPostponementDuration + delay,
          lastPostponedAt: now,
          attemptCount: t.attemptCount + 1,
          updatedAt: now,
          history: [...t.history, newEvent]
        };
        if (selectedTask?.id === taskId) {
          setSelectedTask(updated);
        }
        return updated;
      })
    );
  };

  const handleAddTask = (
    title: string,
    description: string,
    dueAt: number | null,
    priority: Priority,
    recurrence: Recurrence
  ) => {
    const now = Date.now();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      userId: 'user-local',
      title,
      description,
      createdAt: now,
      updatedAt: now,
      dueAt,
      completedAt: null,
      reminderAt: dueAt ? dueAt - 30 * 60 * 1000 : null,
      priority,
      recurrence,
      completed: false,
      archived: false,
      postponedCount: 0,
      totalPostponementDuration: 0,
      lastPostponedAt: null,
      lastCompletedAt: null,
      attemptCount: 0,
      lastOpenedAt: null,
      history: [
        {
          id: `ev-${Date.now()}`,
          type: 'CREATED',
          timestamp: now
        }
      ]
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);
  };

  const handleSeedDemo = () => {
    setTasks(initialTasks);
    setSelectedTask(null);
  };

  // Note management
  const handleSaveNote = (noteData: Partial<Note>) => {
    const now = Date.now();
    if (noteData.id) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteData.id
            ? {
                ...n,
                ...noteData,
                updatedAt: now
              } as Note
            : n
        )
      );
    } else {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        userId: 'user-local',
        title: noteData.title || 'Untitled',
        content: noteData.content || '',
        tags: noteData.tags || [],
        imageReferences: noteData.imageReferences || [],
        createdAt: now,
        updatedAt: now,
        archived: false
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleToggleArchiveNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, archived: !n.archived } : n))
    );
  };

  // Vault management
  const handleAddVaultEntry = (data: {
    websiteName: string;
    websiteUrl: string;
    username: string;
    rawPass: string;
  }) => {
    if (vaultEntries.length >= 15) return;
    const now = Date.now();
    const newEntry: VaultEntry = {
      id: `vault-${Date.now()}`,
      userId: 'user-local',
      websiteName: data.websiteName,
      websiteUrl: data.websiteUrl,
      username: data.username,
      encryptedPassword: {
        cipherText: `cipher_${Date.now()}`,
        iv: `iv_${Date.now()}`
      },
      plainPassword: data.rawPass,
      createdAt: now,
      updatedAt: now
    };
    setVaultEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteVaultEntry = (id: string) => {
    setVaultEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Determine current screen inside simulator
  const renderScreenContent = () => {
    if (!hasCompletedOnboarding) {
      return (
        <div className="h-full flex flex-col items-center justify-between p-8 text-center text-neutral-100 bg-neutral-900">
          <div className="my-auto space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight">FABRIZ</h1>
            <p className="text-xs font-semibold text-amber-400 tracking-wider">KEEPS YOU AWAKE</p>
            <div className="pt-6 text-sm text-neutral-300 max-w-xs leading-relaxed">
              Your tasks. Your notes.
              <br />
              Your memories. Your vault.
            </div>
          </div>
          <button
            onClick={() => {
              setHasCompletedOnboarding(true);
              localStorage.setItem('fabriz_onboarding_done', 'true');
            }}
            className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition"
          >
            Get Started
          </button>
        </div>
      );
    }

    if (isSettingsOpen) {
      return (
        <SettingsView
          onBack={() => setIsSettingsOpen(false)}
          theme={themeMode}
          onThemeChange={setThemeMode}
          notificationsEnabled={notificationsEnabled}
          onNotificationsToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          onSeedDemo={handleSeedDemo}
        />
      );
    }

    if (isInsightsOpen) {
      return (
        <InsightsView
          tasks={tasks}
          onSelectTask={(task) => {
            setIsInsightsOpen(false);
            setSelectedTask(task);
          }}
          onSeedDemo={handleSeedDemo}
        />
      );
    }

    if (selectedTask) {
      return (
        <TaskDetailView
          task={selectedTask}
          onBack={() => setSelectedTask(null)}
          onToggleComplete={handleToggleComplete}
          onPostpone={handlePostpone}
          onDelete={handleDeleteTask}
        />
      );
    }

    switch (activeTab) {
      case 'today':
        return (
          <TodayView
            tasks={tasks.filter((t) => !t.completed)}
            onSelectTask={setSelectedTask}
            onToggleComplete={handleToggleComplete}
            onPostpone={handlePostpone}
            onOpenAdd={() => setIsAddModalOpen(true)}
            onOpenInsights={() => setIsInsightsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            onSelectTask={setSelectedTask}
            onToggleComplete={handleToggleComplete}
            onPostpone={handlePostpone}
          />
        );
      case 'notes':
        return (
          <NotesView
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onToggleArchive={handleToggleArchiveNote}
          />
        );
      case 'vault':
        return (
          <VaultView
            entries={vaultEntries}
            onAddEntry={handleAddVaultEntry}
            onDeleteEntry={handleDeleteVaultEntry}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top utility bar */}
      <header className="h-14 border-b border-neutral-800/80 px-6 flex items-center justify-between shrink-0 bg-neutral-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-base text-neutral-100">FABRIZ</span>
            <span className="text-[11px] font-medium text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Keeps You Awake
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseDeviceFrame(!useDeviceFrame)}
            title={useDeviceFrame ? 'Switch to responsive view' : 'Switch to mobile frame'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 text-xs border border-neutral-700/60 transition"
          >
            {useDeviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{useDeviceFrame ? 'Expanded View' : 'Device Frame'}</span>
          </button>

          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-100 text-xs border border-neutral-700/60 transition"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Android Codebase</span>
          </button>

          <button
            onClick={() => downloadAndroidProjectZip()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export Android ZIP</span>
          </button>
        </div>
      </header>

      {/* Main simulator canvas */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {useDeviceFrame ? (
          <AndroidFrame
            activeTab={activeTab}
            onTabChange={(tab) => {
              setSelectedTask(null);
              setIsSettingsOpen(false);
              setIsInsightsOpen(false);
              setActiveTab(tab);
            }}
            showBottomBar={hasCompletedOnboarding && !selectedTask && !isSettingsOpen && !isInsightsOpen}
          >
            {renderScreenContent()}
          </AndroidFrame>
        ) : (
          <div className="w-full max-w-xl h-[800px] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden relative">
              {renderScreenContent()}
            </div>
            {hasCompletedOnboarding && !selectedTask && !isSettingsOpen && !isInsightsOpen && (
              <div className="h-14 bg-neutral-950 border-t border-neutral-800 px-6 flex items-center justify-around shrink-0">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`text-xs font-medium ${activeTab === 'today' ? 'text-amber-400' : 'text-neutral-500'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`text-xs font-medium ${activeTab === 'tasks' ? 'text-amber-400' : 'text-neutral-500'}`}
                >
                  Tasks
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`text-xs font-medium ${activeTab === 'notes' ? 'text-amber-400' : 'text-neutral-500'}`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab('vault')}
                  className={`text-xs font-medium ${activeTab === 'vault' ? 'text-amber-400' : 'text-neutral-500'}`}
                >
                  Vault
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />

      {/* Code Explorer & ZIP Export Modal */}
      <CodeExplorerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
