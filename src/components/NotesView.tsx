import React, { useState } from 'react';
import { Note } from '../types';
import { Search, Plus, Archive, Image as ImageIcon, X, Trash2, ArrowLeft, Check } from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  onSaveNote: (note: Partial<Note>) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onToggleArchive
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [activeEditingNote, setActiveEditingNote] = useState<Note | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Editor states
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);

  const filteredNotes = notes.filter((n) => {
    const matchesArchived = showArchived ? n.archived : !n.archived;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesArchived;
    const matchesQuery =
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q));
    return matchesArchived && matchesQuery;
  });

  const openEditor = (note?: Note) => {
    if (note) {
      setActiveEditingNote(note);
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags);
      setEditImages(note.imageReferences);
      setIsCreatingNew(false);
    } else {
      setActiveEditingNote(null);
      setEditTitle('');
      setEditContent('');
      setEditTags([]);
      setEditImages([]);
      setIsCreatingNew(true);
    }
  };

  const handleSave = () => {
    if (!editTitle.trim() && !editContent.trim()) return;
    onSaveNote({
      id: activeEditingNote?.id,
      title: editTitle.trim(),
      content: editContent.trim(),
      tags: editTags,
      imageReferences: editImages,
      archived: activeEditingNote?.archived || false
    });
    setActiveEditingNote(null);
    setIsCreatingNew(false);
  };

  if (activeEditingNote || isCreatingNew) {
    return (
      <div className="h-full flex flex-col bg-neutral-900 text-neutral-100 p-4">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <button
            onClick={() => {
              setActiveEditingNote(null);
              setIsCreatingNew(false);
            }}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {activeEditingNote && (
              <>
                <button
                  onClick={() => onToggleArchive(activeEditingNote.id)}
                  title="Archive Note"
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-amber-400"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    onDeleteNote(activeEditingNote.id);
                    setActiveEditingNote(null);
                    setIsCreatingNew(false);
                  }}
                  title="Delete Note"
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Note Fields */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-transparent text-lg font-bold placeholder-neutral-500 focus:outline-none"
          />

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            {editTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-xs"
              >
                #{tag}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-rose-400"
                  onClick={() => setEditTags(editTags.filter((t) => t !== tag))}
                />
              </span>
            ))}
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="tag"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTagInput.trim()) {
                    e.preventDefault();
                    if (!editTags.includes(newTagInput.trim())) {
                      setEditTags([...editTags, newTagInput.trim().replace('#', '')]);
                    }
                    setNewTagInput('');
                  }
                }}
                className="w-16 bg-neutral-800/60 border border-neutral-700/60 rounded px-1.5 py-0.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Attached images preview */}
          {editImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {editImages.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                  <img src={img} alt="Attached" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setEditImages(editImages.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-black"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            placeholder="Start writing... thoughts, snippets, reflections."
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-72 bg-transparent text-sm text-neutral-300 placeholder-neutral-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Bottom Attachment bar */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-amber-400">
            <ImageIcon className="w-4 h-4" />
            <span>Attach photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setEditImages([...editImages, url]);
                }
              }}
            />
          </label>
          <span className="text-[11px] text-neutral-500">Android Photo Picker supported</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-900 text-neutral-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {showArchived ? 'Archived Notes' : 'Notes'}
          </h2>
          <p className="text-[11px] text-neutral-400">Personal knowledge shelf</p>
        </div>
        <button
          onClick={() => setShowArchived(!showArchived)}
          title="Toggle archived"
          className={`p-2 rounded-xl transition ${
            showArchived ? 'bg-amber-400/20 text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Archive className="w-4 h-4" />
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search notes, tags, insights..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
        />
      </div>

      {/* List or Empty State */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredNotes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
            <p className="text-sm font-semibold text-neutral-400">Nothing saved yet.</p>
            <p className="text-xs mt-1 text-neutral-500">Write something worth keeping.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => openEditor(note)}
              className="p-3 rounded-xl bg-neutral-800/40 hover:bg-neutral-800/70 border border-neutral-800/70 cursor-pointer transition"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-neutral-200 truncate flex-1">
                  {note.title || 'Untitled Note'}
                </h4>
                <span className="text-[10px] text-neutral-500 ml-2">
                  {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {note.content && (
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {note.content}
                </p>
              )}
              {(note.tags.length > 0 || note.imageReferences.length > 0) && (
                <div className="flex items-center gap-2 mt-2 pt-1 border-t border-neutral-800/40">
                  {note.imageReferences.length > 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400/90">
                      <ImageIcon className="w-3 h-3" />
                      {note.imageReferences.length}
                    </span>
                  )}
                  {note.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-neutral-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => openEditor()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-400/10 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>
    </div>
  );
};
