import React from 'react';
import { 
  Clock, 
  MapPin, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  TrendingUp,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    timetable, 
    attendanceRecords, 
    overallAttendance, 
    assignments, 
    toggleAssignmentComplete, 
    announcements, 
    events, 
    toggleEventRSVP,
    setActiveTab, 
    markAnnouncementAsRead 
  } = useApp();

  // Pending assignments count
  const pendingAssignments = assignments.filter(a => !a.completed);
  // Today's classes
  const todayClasses = timetable.filter(c => c.isToday || c.day === 'Monday');

  // Low attendance warning subjects (< 75%)
  const warningSubjects = attendanceRecords.filter(a => a.percentage < 75);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Banner Alert if low attendance exists (Aarav's Pain Point from Slide 10 & 14) */}
      {warningSubjects.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">Attendance Warning Alert</p>
              <p className="text-xs text-amber-700">
                Your attendance in <span className="font-semibold">{warningSubjects.map(s => s.subject).join(', ')}</span> is currently at {warningSubjects[0].percentage}%, below the required 75% NMIMS criteria.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-xs"
          >
            Calculate Catch-up
          </button>
        </div>
      )}

      {/* Row 1: Welcome Card + Attendance Overview matching Slide 15 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Welcome Back Card (Slide 15) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome Back!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Here's what's happening with your academics today.
            </p>

            {/* Quick stats pills from Slide 15 */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {/* Semester Pill */}
              <div className="flex items-center gap-2.5 bg-blue-50/80 border border-blue-100 px-3.5 py-2 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xs">
                  🎓
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Semester</span>
                  <span className="text-sm font-bold text-blue-900">{currentUser.semester}</span>
                </div>
              </div>

              {/* Today's Classes Pill */}
              <div className="flex items-center gap-2.5 bg-sky-50/80 border border-sky-100 px-3.5 py-2 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-sky-600/10 text-sky-600 flex items-center justify-center font-bold text-xs">
                  📅
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Today's Classes</span>
                  <span className="text-sm font-bold text-sky-900">{todayClasses.length}</span>
                </div>
              </div>

              {/* Pending Assignments Pill */}
              <div className="flex items-center gap-2.5 bg-amber-50/80 border border-amber-100 px-3.5 py-2 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                  📝
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Pending Tasks</span>
                  <span className="text-sm font-bold text-amber-900">{pendingAssignments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Persona Insight Quote (Slide 4 & 9) */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="truncate italic">"{currentUser.quote}"</span>
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline shrink-0 ml-2" onClick={() => setActiveTab('settings')}>
              Switch Persona
            </span>
          </div>

          {/* Decorative Student Avatar Illustration on the right */}
          <div className="absolute right-4 bottom-2 opacity-90 pointer-events-none hidden sm:block">
            <div className="w-32 h-32 relative">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
                {/* Stylized student illustration matching Slide 15 */}
                <path d="M70,160 Q100,120 130,160 Z" fill="#3B82F6" />
                <circle cx="100" cy="85" r="30" fill="#FCD34D" />
                <path d="M75,70 Q100,50 125,70 Q135,100 125,105 Q100,100 75,105 Z" fill="#374151" />
                <rect x="75" y="140" width="50" height="30" rx="4" fill="#1E293B" />
                <circle cx="100" cy="155" r="3" fill="#60A5FA" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Attendance Overview Card (Slide 15) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Attendance Overview
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                <span>This Semester</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Circular Progress + Breakdown */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Indicator matching Slide 15 ("86% Overall") */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={overallAttendance >= 80 ? '#10B981' : overallAttendance >= 75 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * overallAttendance) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {overallAttendance}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1">
                    Overall
                  </span>
                </div>
              </div>

              {/* Subject Breakdown Bars matching Slide 15 */}
              <div className="w-full space-y-2.5">
                {attendanceRecords.slice(0, 3).map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                        {item.subject}
                      </span>
                      <span className="font-bold text-slate-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.percentage >= 85 ? '#10B981' : item.percentage >= 75 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom encouragement text matching Slide 15 */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-medium">
              Keep it up! You're doing great. 🚀
            </span>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Today's Timetable + Upcoming Assignments matching Slide 15 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Today's Timetable */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Today's Timetable
            </h3>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View Full Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayClasses.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  {/* Time Badge (Slide 15 style) */}
                  <div className="w-16 h-12 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-2xs shrink-0">
                    <span className="text-[11px] font-bold text-blue-600 leading-tight">
                      {item.startTime.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">
                      {item.startTime.split(' ')[1]}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">
                      {item.subject}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400" /> {item.room}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-slate-400">{item.faculty}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    item.status === 'ongoing' 
                      ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                      : item.status === 'completed'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Assignments matching Slide 15 */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-500" />
              Upcoming Assignments
            </h3>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAssignmentComplete(item.id)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={item.completed ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-emerald-500 transition-colors" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-bold leading-snug ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.deadlineRelative}
                    </p>
                  </div>
                </div>

                {/* Priority Label matching Slide 15 (High / Medium / Low) */}
                <div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    item.priority === 'High' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : item.priority === 'Medium'
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Latest Announcements + Upcoming Events matching Slide 15 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Latest Announcements */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="p-1 bg-blue-100 text-blue-700 rounded-lg text-xs">📣</span>
              Latest Announcements
            </h3>
            <button
              onClick={() => setActiveTab('announcements')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markAnnouncementAsRead(item.id);
                  setActiveTab('announcements');
                }}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    item.isUrgent ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{item.category} Notice</span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-[11px] font-medium text-slate-400">
                    {item.relativeTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Events matching Slide 15 */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Upcoming Events
            </h3>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards with Date Badges matching Slide 15 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {events.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {/* Date Block (e.g. 12 AUG) */}
                    <div className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-center leading-none">
                      <span className="text-xs font-black block">{item.day}</span>
                      <span className="text-[9px] font-semibold tracking-wider uppercase block">{item.month}</span>
                    </div>

                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.time}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-2.5 h-2.5 shrink-0" /> {item.venue}
                  </p>
                </div>

                <button
                  onClick={() => toggleEventRSVP(item.id)}
                  className={`mt-3 w-full py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    item.registered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                  }`}
                >
                  {item.registered ? 'RSVP Confirmed ✓' : 'Register / RSVP'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
