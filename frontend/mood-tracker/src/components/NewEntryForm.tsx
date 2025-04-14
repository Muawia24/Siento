// components/NewEntryForm.tsx
import React, { useState } from 'react';
import { PenLine, Plus } from 'lucide-react';

interface NewEntryFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export const NewEntryForm: React.FC<NewEntryFormProps> = ({ onSubmit }) => {
  const [journalEntry, setJournalEntry] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;
    await onSubmit(journalEntry);
    setJournalEntry('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <PenLine className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">New Journal Entry</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="entry" className="block text-sm font-semibold text-gray-700 mb-3">
            What's on your mind?
          </label>
          <textarea
            id="entry"
            rows={5}
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            placeholder="Write your thoughts here..."
          />
        </div>
        
        <button
          type="submit"
          disabled={!journalEntry.trim()}
          className="w-full flex justify-center items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Entry</span>
        </button>
      </form>
    </div>
  );
};