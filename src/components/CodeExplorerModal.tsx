import React, { useState } from 'react';
import {
  FileCode,
  Download,
  X,
  Check,
  ChevronRight,
  Folder,
  Copy
} from 'lucide-react';
import { androidCodebaseFiles, downloadAndroidProjectZip } from '../utils/zipExporter';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedFile, setSelectedFile] = useState(androidCodebaseFiles[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await downloadAndroidProjectZip();
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-5xl h-[85vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <FileCode className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-100">Native Android Source Code</div>
              <div className="text-xs text-neutral-400">Kotlin • Jetpack Compose • Firestore • WorkManager</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? 'Packaging...' : 'Download Project (.zip)'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area: Sidebar tree + Code preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* File list */}
          <div className="w-72 border-r border-neutral-800/80 bg-neutral-950/40 p-3 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1.5">
              Project Structure
            </div>
            {androidCodebaseFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition ${
                    isSelected
                      ? 'bg-amber-500/15 text-amber-300 font-medium border border-amber-500/20'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                  <span className="truncate font-mono text-[11px]">{file.path}</span>
                </button>
              );
            })}
          </div>

          {/* Code viewer */}
          <div className="flex-1 flex flex-col bg-neutral-950 overflow-hidden">
            <div className="px-5 py-2.5 border-b border-neutral-800/70 flex items-center justify-between bg-neutral-900/40">
              <span className="font-mono text-xs text-neutral-300">{selectedFile.path}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 py-1 px-2.5 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="flex-1 overflow-auto p-5 font-mono text-xs text-neutral-300 leading-relaxed select-text whitespace-pre">
              {selectedFile.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
