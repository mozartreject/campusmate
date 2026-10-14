import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Ticket, 
  Filter,
  Share2,
  CalendarCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CampusEvent } from '../types';

export const EventsPage: React.FC = () => {
  const { events, toggleEventRSVP, addToast, currentUser } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'All Events' | 'My Registrations'>('All Events');
  const [ticketModalEvent, setTicketModalEvent] = useState<CampusEvent | null>(null);

  const categories = ['All', 'Hackathon', 'Workshop', 'Sports', 'Cultural'];

  const filteredEvents = events.filter(e => {
    const matchesTab = activeTab === 'All Events' ? true : e.registered;
    const matchesCategory = activeCategory === 'All' || e.category === activeCategory;
    return matchesTab && matchesCategory;
  });

  const handleShareEvent = (event: CampusEvent) => {
    addToast({
      title: 'Link Copied',
      message: `Event link for "${event.title}" copied to clipboard.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Campus Events & Clubs</h2>
            <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
              {events.filter(e => e.registered).length} RSVP'd
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized hub for hackathons, technical workshops, sports tournaments, and student council meets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            {(['All Events', 'My Registrations'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200">
            <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-400 mt-1">You haven't RSVP'd to any events in this category yet.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* Date Badge */}
                  <div className="w-16 py-2.5 bg-blue-600 text-white rounded-2xl flex flex-col items-center justify-center text-center shadow-xs shrink-0">
                    <span className="text-lg font-black leading-none">{evt.day}</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">{evt.month}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {evt.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{evt.club}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {evt.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleShareEvent(evt)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                    title="Share event"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {evt.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.seatsLeft} seats remaining</span>
                </span>

                <div className="flex items-center gap-2">
                  {evt.registered && (
                    <button
                      onClick={() => setTicketModalEvent(evt)}
                      className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleEventRSVP(evt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      evt.registered
                        ? 'bg-emerald-100 hover:bg-red-50 hover:text-red-700 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {evt.registered ? 'Registered (Cancel RSVP)' : 'Register / RSVP'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Digital Ticket / Pass Modal */}
      {ticketModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Ticket className="w-6 h-6" />
            </div>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Official Event Pass</span>
            <h3 className="text-lg font-black text-slate-900 mt-1">{ticketModalEvent.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{ticketModalEvent.venue} • {ticketModalEvent.date}</p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl my-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Attendee:</span>
                <span className="font-bold text-slate-800">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SAP ID:</span>
                <span className="font-mono text-slate-800">{currentUser.sapId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seat / Token:</span>
                <span className="font-bold text-blue-600">PASS-2026-094</span>
              </div>
            </div>

            {/* Simulated QR Code */}
            <div className="w-32 h-32 bg-slate-100 border border-slate-200 mx-auto rounded-xl flex items-center justify-center p-2 mb-4">
              <div className="w-full h-full border-4 border-slate-800 border-dashed rounded-lg flex items-center justify-center text-[10px] font-mono font-bold text-slate-600">
                [QR PASS SCAN]
              </div>
            </div>

            <button
              onClick={() => setTicketModalEvent(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
