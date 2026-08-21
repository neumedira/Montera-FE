import React from 'react';

export default function NotesInput({ note, setNote }) {
  return (
    <div className="mt-6 mb-5">
      <label className="block text-xs font-black tracking-wider text-gray-900 uppercase mb-2">
        NOTES (OPTIONAL)
      </label>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note to your order?"
          className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}