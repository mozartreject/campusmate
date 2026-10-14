import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  Download, 
  FileText, 
  Eye, 
  Filter, 
  ExternalLink,
  X,
  FileCode,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';

export const NotesPage: React.FC = () => {
  const { notes, toggleNoteBookmark, addToast } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [previewNote, setPreviewNote] = useState<NoteItem | null>(null);

  const subjects = ['All', 'Human Computer Interaction', 'Machine Learning', 'Data Mining', 'Database Management Systems', 'Cloud Computing & DevOps'];

  const filteredNotes = notes.filter(n => {
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    const matchesType = selectedType === 'All' || n.type === selectedType;
    const matchesQuery = n.title.toLowerCase().includes(searchFilter.toLowerCase()) || n.subject.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSubject && matchesType && matchesQuery;
  });

  const handleDownload = (note: NoteItem) => {
    addToast({
      title: 'Download Started',
      message: `Downloading "${note.title}" (${note.size}).`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Study Materials & Notes</h2>
          <p className="text-xs text-slate-500 mt-1">
            Faculty verified lecture slides, syllabus reference guides, and shared laboratory codes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Internal search */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter notes..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-2xl focus:outline-none"
          >
            <option value="All">All Formats</option>
            <option value="PDF">PDF Documents</option>
            <option value="PPT">Presentations</option>
            <option value="Doc">Study Sheets</option>
            <option value="Code">Code Repos</option>
          </select>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedSubject === s
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No resources found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your subject or format filters.</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      note.type === 'PDF' 
                        ? 'bg-red-100 text-red-700' 
                        : note.type === 'PPT'
                        ? 'bg-amber-100 text-amber-700'
                        : note.type === 'Code'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {note.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{note.unit}</span>
                  </div>

                  <button
                    onClick={() => toggleNoteBookmark(note.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors"
                    title={note.bookmarked ? 'Remove bookmark' : 'Bookmark note'}
                  >
                    <Bookmark className={`w-4 h-4 ${note.bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {note.subject}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>By {note.uploadedBy}</span>
                  <span>{note.size}</span>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center gap-2">
                <button
                  onClick={() => setPreviewNote(note)}
                  className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Quick Read</span>
                </button>

                <button
                  onClick={() => handleDownload(note)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{previewNote.subject} • {previewNote.unit}</span>
                <h3 className="text-lg font-bold text-slate-900">{previewNote.title}</h3>
              </div>
              <button onClick={() => setPreviewNote(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs space-y-4 max-h-80 overflow-y-auto">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <h4 className="font-bold text-slate-800 text-sm mb-1">Key Principles & Lecture Notes:</h4>
                <p className="text-slate-600 leading-relaxed">
                  1. Shneiderman's 8 Golden Rules: Consistency, Universal usability, Informative feedback, Dialogs yielding closure, Error prevention, Easy reversal of actions, Support internal locus of control, Reduce short-term memory load.
                </p>
                <p className="text-slate-600 leading-relaxed mt-2">
                  2. Norman's 7 Principles: Discoverability, Feedback, Conceptual Model, Affordances, Signifiers, Mappings, Constraints.
                </p>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Verified by {previewNote.uploadedBy}</span>
                <span>Document Size: {previewNote.size}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Document Reader Simulation</span>
              <button
                onClick={() => {
                  handleDownload(previewNote);
                  setPreviewNote(null);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Download Original File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
