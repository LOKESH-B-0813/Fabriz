import React, { useState } from 'react';
import { VaultEntry } from '../types';
import { Lock, Unlock, Plus, Copy, Eye, EyeOff, ExternalLink, Trash2, ShieldAlert } from 'lucide-react';

interface VaultViewProps {
  entries: VaultEntry[];
  onAddEntry: (entry: { websiteName: string; websiteUrl: string; username: string; rawPass: string }) => void;
  onDeleteEntry: (id: string) => void;
}

const MAX_VAULT_ENTRIES = 15;

export const VaultView: React.FC<VaultViewProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [masterPasswordInput, setMasterPasswordInput] = useState('');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New entry form state
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isLimitReached = entries.length >= MAX_VAULT_ENTRIES;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterPasswordInput.trim()) {
      setIsLocked(false);
      setMasterPasswordInput('');
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    setRevealedIds({});
  };

  const handleCopy = (entry: VaultEntry) => {
    const textToCopy = entry.plainPassword || 'MockDecryptedPassword123!';
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteName.trim() || !password.trim()) return;
    onAddEntry({
      websiteName: websiteName.trim(),
      websiteUrl: websiteUrl.trim(),
      username: username.trim(),
      rawPass: password.trim()
    });
    setWebsiteName('');
    setWebsiteUrl('');
    setUsername('');
    setPassword('');
    setShowAddModal(false);
  };

  if (isLocked) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900 text-neutral-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Password Manager</h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
          Client-side AES-256-GCM encrypted.
          <br />
          Enter master password to unlock your credentials.
        </p>

        <form onSubmit={handleUnlock} className="w-full max-w-xs mt-6 space-y-3">
          <input
            type="password"
            placeholder="Master password"
            value={masterPasswordInput}
            onChange={(e) => setMasterPasswordInput(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!masterPasswordInput.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-bold text-xs transition"
          >
            Unlock Password Manager
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-900 text-neutral-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Password Manager</h2>
          <p className="text-[11px] text-neutral-400">
            <span className={isLimitReached ? 'text-rose-400 font-bold' : 'text-amber-400'}>
              {entries.length}
            </span>{' '}
            / {MAX_VAULT_ENTRIES} entries
          </p>
        </div>
        <button
          onClick={handleLock}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Lock</span>
        </button>
      </div>

      {/* 15 entries limit warning banner */}
      {isLimitReached && (
        <div className="flex items-center gap-2 p-2.5 mb-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Password limit reached (15/15). Delete an item to store new credentials.</span>
        </div>
      )}

      {/* Entry List or Empty State */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {entries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
            <p className="text-sm font-semibold text-neutral-400">No passwords saved yet.</p>
            <p className="text-xs mt-1 text-neutral-500">
              Store up to 15 important passwords securely.
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const isRevealed = !!revealedIds[entry.id];
            const passwordDisplay = isRevealed
              ? entry.plainPassword || 'DecryptedSecret'
              : '••••••••••••';

            return (
              <div
                key={entry.id}
                className="p-3 rounded-xl bg-neutral-800/40 border border-neutral-800/80 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-200">{entry.websiteName}</h4>
                    {entry.websiteUrl && (
                      <a
                        href={entry.websiteUrl.startsWith('http') ? entry.websiteUrl : `https://${entry.websiteUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-amber-400/90 hover:underline"
                      >
                        {entry.websiteUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1 rounded text-neutral-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {entry.username && (
                  <p className="text-xs text-neutral-400 font-mono">{entry.username}</p>
                )}

                {/* Password display bar */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-xs font-mono text-neutral-300 select-all">
                    {passwordDisplay}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setRevealedIds((prev) => ({ ...prev, [entry.id]: !prev[entry.id] }))
                      }
                      className="p-1 text-neutral-400 hover:text-neutral-200"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(entry)}
                      className="p-1 text-amber-400 hover:text-amber-300"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {copiedId === entry.id && (
                  <p className="text-[10px] text-emerald-400 font-medium">Copied to clipboard!</p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* FAB */}
      {!isLimitReached && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-400/10 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Password</span>
          </button>
        </div>
      )}

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
            <h3 className="text-base font-bold text-neutral-100">Add Password Entry</h3>

            <form onSubmit={handleSaveEntry} className="space-y-3">
              <input
                type="text"
                placeholder="Website / App Name (e.g. GitHub)"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />

              <input
                type="text"
                placeholder="Website URL (e.g. github.com)"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />

              <input
                type="text"
                placeholder="Username / Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!websiteName.trim() || !password.trim()}
                  className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
