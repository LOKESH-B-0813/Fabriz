import React from 'react';
import { ArrowLeft, Bell, Check, Cloud, Database, Lock, Moon, Shield, Sun } from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
  theme: 'dark' | 'light' | 'system';
  onThemeChange: (theme: 'dark' | 'light' | 'system') => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: () => void;
  onSeedDemo: () => void;
  user?: { uid: string; email: string; username: string } | null;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  theme,
  onThemeChange,
  notificationsEnabled,
  onNotificationsToggle,
  onSeedDemo,
  user,
  onLogout
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto px-5 py-4 pb-20 text-neutral-100">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-neutral-800/80">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-neutral-100">Settings</h1>
      </div>

      <div className="space-y-6 mt-4 text-left">
        {/* Appearance */}
        <div>
          <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
            APPEARANCE
          </div>
          <div className="rounded-2xl bg-neutral-850/80 border border-neutral-800 p-2 space-y-1">
            {(['dark', 'light', 'system'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onThemeChange(mode)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs capitalize transition ${
                  theme === mode
                    ? 'bg-neutral-800 font-semibold text-neutral-100'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                }`}
              >
                <span>{mode} Mode</span>
                {theme === mode && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
            NOTIFICATIONS
          </div>
          <div className="rounded-2xl bg-neutral-850/80 border border-neutral-800 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-neutral-200">Awake Alerts</div>
                <div className="text-[11px] text-neutral-400">Reminders for upcoming & avoided tasks</div>
              </div>
              <button
                onClick={onNotificationsToggle}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  notificationsEnabled ? 'bg-amber-400' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-neutral-950 transition-transform ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Sync */}
        <div>
          <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
            ACCOUNT & CLOUD SYNC
          </div>
          <div className="rounded-2xl bg-neutral-850/80 border border-neutral-800 p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Persistence</span>
              <span className="text-neutral-200 font-medium">Offline-First (Firestore Enabled)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Session</span>
              <span className="text-neutral-200 font-medium">Anonymous / Local Scoped</span>
            </div>
            <div className="pt-2">
              <button
                onClick={onSeedDemo}
                className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-amber-400 font-medium text-xs border border-neutral-700 transition text-center"
              >
                Seed Demo Tasks & Avoidance History
              </button>
            </div>
          </div>
        </div>

        {/* Privacy & About */}
        <div>
          <div className="text-[11px] tracking-wider uppercase font-bold text-neutral-400 mb-2">
            PRIVACY & ABOUT
          </div>
          <div className="rounded-2xl bg-neutral-850/80 border border-neutral-800 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-200">Fabriz</span>
              <span className="text-neutral-500">v1.0.0 Native</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              <span className="text-neutral-300 font-medium">&ldquo;Keeps You Awake&rdquo;</span> — Designed to help you confront procrastination without shame or excessive friction.
            </p>
            <div className="pt-1 text-[11px] text-neutral-400 flex items-start gap-2 border-t border-neutral-800">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Fabriz stores only your tasks and postponement timestamps. No location, contacts, microphone, or tracking.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
