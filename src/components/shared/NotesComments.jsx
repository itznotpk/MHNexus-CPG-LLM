import React, { useState } from 'react';
import { MessageSquare, Plus, X, Edit3, Save, Trash2, User, Clock } from 'lucide-react';
import { VoiceInputButton } from './VoiceInput';

// Single Note/Comment Component
function NoteItem({ note, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);

  const handleSave = () => {
    onEdit(note.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(note.text);
    setIsEditing(false);
  };

  return (
    <div className="bg-white/60 rounded-lg p-3 border border-slate-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-primary-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={2}
              autoFocus
            />
          ) : (
            <p className="text-sm text-slate-700">{note.text}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-slate-500 hover:bg-slate-50 rounded"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-slate-500 hover:bg-slate-50 rounded"
                title="Edit"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {note.author}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {note.timestamp}
        </span>
      </div>
    </div>
  );
}

// Notes/Comments Section for a Recommendation
export function NotesSection({ itemId, notes = [], onAddNote, onEditNote, onDeleteNote }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(itemId, {
        id: Date.now().toString(),
        text: newNote.trim(),
        author: 'Dr. Current User',
        timestamp: new Date().toLocaleString()
      });
      setNewNote('');
      setIsAdding(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setNewNote((prev) => prev + (prev ? ' ' : '') + transcript);
  };

  const itemNotes = notes.filter(note => note.itemId === itemId);

  return (
    <div className="mt-3 border-t border-slate-200/50 pt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
          <MessageSquare className="w-3.5 h-3.5" />
          Notes ({itemNotes.length})
        </span>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Note
          </button>
        )}
      </div>

      {/* Existing Notes */}
      {itemNotes.length > 0 && (
        <div className="space-y-2 mb-2">
          {itemNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onEdit={(noteId, text) => onEditNote(itemId, noteId, text)}
              onDelete={(noteId) => onDeleteNote(itemId, noteId)}
            />
          ))}
        </div>
      )}

      {/* Add New Note */}
      {isAdding && (
        <div className="bg-white/60 rounded-lg p-3 border border-primary-200">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note or comment..."
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white/80"
            rows={2}
            autoFocus
          />
          <div className="flex items-center justify-between mt-2">
            <VoiceInputButton
              onTranscript={handleVoiceTranscript}
              className="text-xs"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewNote('');
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact Notes Indicator
export function NotesIndicator({ count = 0, onClick }) {
  if (count === 0) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary-600"
        title="Add a note"
      >
        <MessageSquare className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700"
      title={`${count} note${count > 1 ? 's' : ''}`}
    >
      <MessageSquare className="w-3.5 h-3.5" />
      <span className="font-medium">{count}</span>
    </button>
  );
}
