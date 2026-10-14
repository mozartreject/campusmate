import React, { useState } from 'react';
import { 
  Megaphone, 
  AlertCircle, 
  CheckCheck, 
  Filter, 
  Calendar, 
  User, 
  Pin, 
  X,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Announcement } from '../types';

export const AnnouncementsPage: React.FC = () => {
  const { 
    announcements, 
    markAnnouncementAsRead, 
    markAllAnnouncementsAsRead,
    unreadAnnouncementsCount 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const categories = ['All', 'Academic', 'Exams', 'Urgent', 'Administrative'];

  const filtered = announcements.filter(a => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Urgent') return a.isUrgent;
    return a.category === activeCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Announcements & Notices</h2>
            {unreadAnnouncementsCount > 0 && (
              <span className="text-xs bg-red-100 text-red-800 font-bold px-2.5 py-0.5 rounded-full">
                {unreadAnnouncementsCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official broadcasts from the Registrar, Examination Cell, Department HOD, and Student Affairs.
          </p>
        </div>

        <button
          onClick={markAllAnnouncementsAsRead}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === c
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Announcement List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              markAnnouncementAsRead(item.id);
              setSelectedAnnouncement(item);
            }}
            className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer ${
              !item.isRead 
                ? 'border-blue-300 bg-blue-50/20 shadow-xs' 
                : 'border-slate-200 hover:border-slate-300'
            } flex items-start justify-between gap-4 group`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                item.isUrgent 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {item.isUrgent ? <AlertCircle className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {item.pinned && (
                    <span className="flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      <Pin className="w-2.5 h-2.5" /> Pinned
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.isUrgent ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.category}
                  </span>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>

                <h3 className={`text-base font-bold group-hover:text-blue-600 transition-colors leading-snug ${
                  !item.isRead ? 'text-slate-900 font-extrabold' : 'text-slate-800'
                }`}>
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>

                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <span>Author: {item.author}</span>
                  <span>•</span>
                  <span>Posted: {item.date} ({item.relativeTime})</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                Read Notice →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {selectedAnnouncement.category}
              </span>
              <button onClick={() => setSelectedAnnouncement(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-900 leading-snug">
              {selectedAnnouncement.title}
            </h3>

            <div className="my-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-3">
              <p>{selectedAnnouncement.content}</p>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Authority: {selectedAnnouncement.author}</span>
              <span>Published: {selectedAnnouncement.date}</span>
            </div>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Close Announcement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
