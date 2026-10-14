import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  BellRing,
  Download,
  Filter,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassSchedule } from '../types';

export const TimetablePage: React.FC = () => {
  const { timetable, selectedDay, setSelectedDay, addToast } = useApp();
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [filterType, setFilterType] = useState<'All' | 'Lecture' | 'Lab'>('All');
  const [remindersSet, setRemindersSet] = useState<Record<string, boolean>>({
    'sched-1': true,
    'sched-2': true
  });

  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  const toggleReminder = (id: string, subject: string) => {
    setRemindersSet(prev => {
      const nextState = !prev[id];
      addToast({
        title: nextState ? 'Reminder Set' : 'Reminder Removed',
        message: nextState ? `You will be notified 15 minutes before ${subject}.` : `Alert removed for ${subject}.`,
        type: 'info'
      });
      return { ...prev, [id]: nextState };
    });
  };

  const handleExportCalendar = () => {
    addToast({
      title: 'Calendar Sync Generated 📅',
      message: 'Timetable exported to .ICS format for Google Calendar / Apple Calendar.',
      type: 'success'
    });
  };

  const daySchedule = timetable.filter(item => {
    const matchesDay = item.day === selectedDay;
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesDay && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header and Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Timetable</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              Semester VII • Division A
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weekly class schedules, lab rooms, faculty allocations and live class alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Day / Week View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'day' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'week' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Grid
            </button>
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="All">All Formats</option>
              <option value="Lecture">Lectures Only</option>
              <option value="Lab">Labs Only</option>
            </select>
          </div>

          <button
            onClick={handleExportCalendar}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Sync to Calendar</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs (for Day View) */}
      {viewMode === 'day' && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          {days.map((day) => {
            const isSelected = selectedDay === day;
            const count = timetable.filter(t => t.day === day).length;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`py-3 px-2 rounded-xl text-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="block text-xs font-bold tracking-tight">{day}</span>
                <span className={`text-[10px] mt-0.5 block ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {count} {count === 1 ? 'class' : 'classes'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Day View Timeline Content */}
      {viewMode === 'day' ? (
        <div className="space-y-4">
          {daySchedule.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No scheduled classes</h3>
              <p className="text-xs text-slate-400 mt-1">Enjoy your study and project work time!</p>
            </div>
          ) : (
            daySchedule.map((item) => {
              const hasReminder = remindersSet[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Time Pill */}
                    <div className="w-20 py-2.5 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-xs font-extrabold text-blue-700 leading-tight">
                        {item.startTime}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        to {item.endTime.split(' ')[0]}
                      </span>
                    </div>

                    {/* Class Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.type === 'Lab' 
                            ? 'bg-purple-100 text-purple-800' 
                            : item.type === 'Tutorial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-xs font-mono text-slate-400 font-medium">
                          {item.code}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.subject}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {item.room}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" /> {item.faculty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Live Status */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.status === 'ongoing'
                        ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400/30 animate-pulse'
                        : item.status === 'completed'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {item.status === 'ongoing' ? '● Currently In Session' : item.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </span>

                    <button
                      onClick={() => toggleReminder(item.id, item.subject)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        hasReminder
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={hasReminder ? 'Reminder enabled' : 'Set class reminder'}
                    >
                      {hasReminder ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Weekly Grid View */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs overflow-x-auto">
          <div className="min-w-[700px] grid grid-cols-5 gap-4">
            {days.map(day => (
              <div key={day} className="space-y-3">
                <div className="text-center pb-2 border-b border-slate-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">{day}</h4>
                  <span className="text-[10px] text-slate-400">
                    {timetable.filter(t => t.day === day).length} sessions
                  </span>
                </div>

                <div className="space-y-2.5">
                  {timetable.filter(t => t.day === day).map(c => (
                    <div 
                      key={c.id}
                      className="p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 rounded-2xl transition-all cursor-pointer"
                    >
                      <span className="text-[9px] font-bold text-blue-700 block mb-0.5">{c.time}</span>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{c.subject}</p>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {c.room}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
