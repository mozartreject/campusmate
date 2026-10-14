import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  FileCheck2, 
  GraduationCap, 
  BookOpen, 
  Megaphone, 
  Ticket, 
  Share2, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  X, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sliders, 
  Award, 
  ChevronRight,
  Calculator,
  Pin,
  Eye,
  Check,
  Search,
  Menu,
  Home,
  User,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, ClassSchedule, Assignment, StudentProfile } from '../types';

export const CampusMateNotebookApp: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    allUsers, 
    timetable, 
    attendanceRecords, 
    overallAttendance, 
    attendanceTarget, 
    setAttendanceTarget,
    logClassAttendance,
    assignments, 
    toggleAssignmentComplete, 
    addAssignment, 
    deleteAssignment,
    events, 
    toggleEventRSVP,
    announcements, 
    markAnnouncementAsRead, 
    notes,
    exams,
    addToast,
    hciPrinciples,
    setHciModalOpen
  } = useApp();

  // Active section for sidebar highlight
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Local state for notebook interactions
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [timetableMode, setTimetableMode] = useState<'day' | 'week'>('day');
  
  // Interactive Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isHciDrawerOpen, setIsHciDrawerOpen] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Human Computer Interaction');
  const [taskPriority, setTaskPriority] = useState<PriorityLevel>('High');
  const [taskDue, setTaskDue] = useState('Due Tomorrow, 11:59 PM');

  // Notes search inside notebook
  const [noteSearch, setNoteSearch] = useState('');

  // Selected subject for catch-up bunk calculator
  const [selectedCalcId, setSelectedCalcId] = useState<string>(attendanceRecords[3]?.id || attendanceRecords[0]?.id);
  const selectedCalcRecord = attendanceRecords.find(r => r.id === selectedCalcId) || attendanceRecords[0];

  // Predictive catch-up calculation
  const calculatePlanning = (attended: number, total: number, targetPct: number) => {
    const currentPct = (attended / total) * 100;
    const target = targetPct / 100;

    if (currentPct >= targetPct) {
      const safeSkips = Math.floor((attended - target * total) / target);
      return {
        isSafe: true,
        count: Math.max(0, safeSkips),
        message: safeSkips > 0 
          ? `You can safely bunk ${safeSkips} more class${safeSkips > 1 ? 'es' : ''} while maintaining above ${targetPct}%.`
          : `You are right on the edge of ${targetPct}%. Do not miss the next session!`
      };
    } else {
      const classesNeeded = Math.ceil((target * total - attended) / (1 - target));
      return {
        isSafe: false,
        count: Math.max(1, classesNeeded),
        message: `You must attend the next ${classesNeeded} consecutive class${classesNeeded > 1 ? 'es' : ''} without missing to reach ${targetPct}%.`
      };
    }
  };

  const currentPlan = calculatePlanning(selectedCalcRecord.attended, selectedCalcRecord.total, attendanceTarget);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addAssignment({
      title: taskTitle.trim(),
      subject: taskSubject,
      dueDate: new Date().toISOString(),
      dueTime: '11:59 PM',
      deadlineRelative: taskDue,
      priority: taskPriority,
      completed: false,
      submissionType: 'File Upload',
      description: 'Added from notebook planner.',
      points: 20,
      tags: ['Notebook', taskSubject.split(' ')[0]]
    });

    setTaskTitle('');
    setIsTaskModalOpen(false);
  };

  const handlePrintNotebook = () => {
    window.print();
  };

  const scrollTo = (id: string, sectionKey: string) => {
    setActiveSection(sectionKey);
    setSidebarOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nav menu items for the sidebar
  const navItems = [
    { id: 'overview-section', key: 'overview', label: 'Overview & Pass', icon: '🏠' },
    { id: 'timetable-section', key: 'timetable', label: "Today's Timetable", icon: '📅', badge: `${timetable.filter(c => c.isToday).length}` },
    { id: 'attendance-section', key: 'attendance', label: 'Bunk Calculator', icon: '🧮', badge: `${overallAttendance}%` },
    { id: 'assignments-section', key: 'assignments', label: 'Tasks & Deadlines', icon: '📝', badge: `${assignments.filter(a => !a.completed).length}` },
    { id: 'exams-section', key: 'exams', label: 'Exam Countdown', icon: '🎓', badge: `${exams.length}` },
    { id: 'notes-section', key: 'notes', label: 'Notes & Materials', icon: '📚' },
    { id: 'events-section', key: 'events', label: 'Campus Events', icon: '✨' },
    { id: 'announcements-section', key: 'announcements', label: 'Notice Board', icon: '📣', badge: `${announcements.filter(a => !a.isRead).length}` },
    { id: 'hci-section', key: 'hci', label: 'HCI Evaluation', icon: '🧠' },
  ];

  const sanitizedMRZName = currentUser.name.toUpperCase().replace(/[^A-Z]/g, '<').slice(0, 24);

  return (
    <div className="min-h-screen text-zinc-900 font-sans selection:bg-amber-200 flex flex-col bg-[#F3EDE0]">
      
      {/* Top Mobile Bar with Hamburger & Student Info */}
      <div className="bg-zinc-900 text-white px-4 py-2.5 text-xs flex items-center justify-between sticky top-0 z-50 border-b border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-amber-300 flex items-center gap-1.5 font-marker text-sm"
          >
            <Menu className="w-4 h-4" />
            <span>Index Tabs</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-typewriter font-bold tracking-tight text-amber-300">
              CAMPUSMATE NOTEBOOK
            </span>
            <span className="text-zinc-400 hidden sm:inline">• NMIMS MPSTME Sem VII</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPersonaModalOpen(true)}
            className="px-2.5 py-1 bg-amber-300 hover:bg-amber-400 text-zinc-900 font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs font-marker text-xs"
          >
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{currentUser.name.split(' ')[0]}</span>
          </button>

          <button
            onClick={() => setIsHciDrawerOpen(true)}
            className="hidden sm:flex px-2.5 py-1 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-lg transition-colors items-center gap-1 shadow-2xs font-marker text-xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>HCI Matrix</span>
          </button>

          <button
            onClick={handlePrintNotebook}
            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            title="Print notebook"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Notebook Sidebar + Center Spiral Divider + Right Ruled Paper Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ======================================================== */}
        {/* LEFT SIDEBAR: HAND-DRAWN NOTEBOOK INDEX TABS */}
        {/* ======================================================== */}
        <aside 
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#F5EED9] border-r-2 border-zinc-900 flex flex-col justify-between p-5 pt-16 lg:pt-5 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          } select-none`}
        >
          {/* Top Logo / Notebook Branding */}
          <div>
            {/* Close button on mobile */}
            <div className="flex items-center justify-between lg:hidden mb-3">
              <span className="font-typewriter font-bold text-xs text-rose-800">NOTEBOOK TABS</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-zinc-700 hover:text-zinc-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Graduation Cap Doodle Logo */}
            <div className="bg-white border-2 border-zinc-900 rounded-2xl p-3.5 shadow-[3px_3px_0px_#18181B] mb-5 relative">
              <div className="w-12 h-3 bg-amber-200/90 mx-auto -mt-5 mb-2 rounded-xs border border-amber-300 rotate-[-1deg]"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-300 border-2 border-zinc-900 flex items-center justify-center shrink-0 shadow-2xs">
                  <GraduationCap className="w-6 h-6 text-zinc-900" />
                </div>
                <div>
                  <h1 className="font-handwriting text-2xl font-black text-zinc-900 leading-none">
                    CampusMate
                  </h1>
                  <p className="font-typewriter text-[10px] text-zinc-600 mt-0.5 font-bold">
                    STUDENT NOTEBOOK
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <nav className="space-y-1.5">
              <p className="text-[10px] font-typewriter font-bold uppercase text-zinc-500 tracking-wider px-2 mb-1">
                INDEX TABS:
              </p>

              {navItems.map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => scrollTo(item.id, item.key)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-marker text-base font-bold transition-all text-left group ${
                      isActive
                        ? 'bg-yellow-300 text-zinc-900 border-2 border-zinc-900 shadow-[2px_2px_0px_#000] translate-x-1'
                        : 'text-zinc-700 hover:bg-white/80 hover:text-zinc-900 border border-transparent hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{item.icon}</span>
                      <span className="leading-tight">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-typewriter font-bold px-2 py-0.5 rounded-full border ${
                        isActive 
                          ? 'bg-zinc-900 text-yellow-300 border-zinc-900' 
                          : 'bg-amber-100 text-amber-950 border-amber-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar Widget: Active Student Persona Card */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-300 space-y-2.5">
            <div 
              onClick={() => setIsPersonaModalOpen(true)}
              className="bg-white border-2 border-zinc-900 rounded-xl p-2.5 shadow-[2px_2px_0px_#18181B] flex items-center justify-between cursor-pointer hover:bg-amber-50 transition-colors"
              title="Click to switch persona"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-lg object-cover border border-zinc-900 shrink-0" 
                />
                <div className="min-w-0 truncate">
                  <p className="font-handwriting text-lg font-bold text-zinc-900 leading-tight truncate">
                    {currentUser.name}
                  </p>
                  <p className="font-typewriter text-[9px] text-zinc-500 truncate">
                    {currentUser.rollNo} • Sem {currentUser.semester}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-marker font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Switch
              </span>
            </div>

            {/* Quick HCI Button */}
            <button
              onClick={() => setIsHciDrawerOpen(true)}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-marker font-bold text-xs rounded-xl shadow-[2px_2px_0px_#F59E0B] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>HCI Principles Evaluator</span>
            </button>
          </div>
        </aside>

        {/* Overlay backdrop on mobile */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-zinc-900/50 backdrop-blur-2xs z-30 lg:hidden"
          />
        )}

        {/* ======================================================== */}
        {/* SPIRAL BINDER COILS SEPARATOR (Authentic notebook look) */}
        {/* ======================================================== */}
        <div className="hidden lg:flex flex-col justify-around py-6 w-7 bg-[#E5DEC7] border-r-2 border-zinc-900 shrink-0 select-none z-20 shadow-inner">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center my-1">
              <div className="w-5 h-2.5 bg-gradient-to-r from-zinc-400 via-zinc-100 to-zinc-400 rounded-full border border-zinc-800 shadow-2xs transform -rotate-12" />
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* RIGHT NOTEBOOK PAPER: MAIN LINED CONTENT AREA */}
        {/* ======================================================== */}
        <main className="flex-1 notebook-paper overflow-y-auto px-6 sm:px-12 md:pl-24 md:pr-12 py-10 md:py-14">
          
          {/* Top Product / Semester Specs Line from Template */}
          <div id="overview-section" className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-typewriter text-rose-800 tracking-wider font-semibold mb-6 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rose-700 rounded-full inline-block"></span>
              <span className="text-zinc-900 font-bold font-sans">SVKM's NMIMS MPSTME</span>
            </div>
            <div>
              PROJECT #HCI · SEMESTER VII · IN SESSION FOREVER
            </div>
          </div>

          {/* HERO GRID: Left Copy + Right Taped Student Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Headline, Actions & Quick Specs */}
            <div className="lg:col-span-6 space-y-6 pt-2">
              
              {/* Big Headline styled identical to "Buy nothing. Keep the receipt." */}
              <div className="space-y-1">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-handwriting text-zinc-900 leading-[1.05] tracking-tight">
                  Manage <span className="highlighter-yellow px-4 py-0.5 rounded-full inline-block transform -rotate-1 shadow-2xs">college.</span>
                </h1>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold font-handwriting text-zinc-900 leading-[1.05] tracking-tight">
                  Keep your
                </h2>
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold font-handwriting text-zinc-900 leading-[1.05] tracking-tight">
                  <span className="squiggly-underline">sanity.</span>
                </h2>
              </div>

              {/* Sub-body copy */}
              <p className="text-base sm:text-lg font-marker text-zinc-800 max-w-lg leading-relaxed pt-2">
                No 6+ disconnected apps. No 10 PM attendance panic. You choose how to balance your day — and you walk away with a centralized companion that stops missed deadlines before they happen.
              </p>

              {/* Buttons matching template: Black sketchy button + Pink sketchy button */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => scrollTo('timetable-section', 'timetable')}
                  className="sketchy-border bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3.5 text-base sm:text-lg font-marker font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Check today's schedule</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => scrollTo('attendance-section', 'attendance')}
                  className="sketchy-border-double bg-pink-200 hover:bg-pink-300 text-zinc-900 px-6 py-3 text-base sm:text-lg font-marker font-bold shadow-[3px_3px_0px_#18181B] hover:shadow-[1px_1px_0px_#18181B] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Calculate Bunks 🧮</span>
                </button>
              </div>

              {/* Team Credits Sub-copy */}
              <p className="text-xs sm:text-sm font-marker text-zinc-700 pt-2 leading-normal">
                Group Project Team:{' '}
                <span className="font-bold text-zinc-900">Janvi Jain (A011)</span>,{' '}
                <span className="font-bold text-zinc-900">Janvi Porwal (A012)</span>,{' '}
                <span className="font-bold text-zinc-900">Joshua Rebello (S020)</span>.{' '}
                <button onClick={() => setIsHciDrawerOpen(true)} className="underline font-bold text-amber-900 hover:text-amber-700">
                  View HCI Principles
                </button>
              </p>

              {/* Red Monospace Specs */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-typewriter text-rose-800 font-bold tracking-tight">
                <span>✓ {overallAttendance}% ATTENDANCE</span>
                <span>✓ 3 CLASSES TODAY</span>
                <span>✓ {assignments.filter(a => !a.completed).length} PENDING TASKS</span>
                <span>✓ 0 PANIC</span>
              </div>

              {/* Hand-drawn ink arrow */}
              <div className="pt-8 flex items-center gap-3">
                <svg viewBox="0 0 60 40" className="w-12 h-8 text-zinc-900 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 10 Q25 35 48 20" />
                  <path d="M40 16 L49 20 L44 28" />
                </svg>
                <button onClick={() => scrollTo('timetable-section', 'timetable')} className="text-base font-handwriting text-zinc-800 font-bold hover:text-zinc-950 hover:underline">
                  Scroll. It gets organized.
                </button>
              </div>
            </div>

            {/* Right Column: The Suspended Student Companion Card / Certificate */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center pt-4 lg:pt-0">
              <div className="relative w-full max-w-lg group">
                
                {/* Semi-translucent yellow masking / washi tape on top of the card */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-40 h-8 washi-tape z-30 rotate-[-1.5deg] pointer-events-none opacity-90 shadow-2xs"></div>

                {/* Yellow Circular Sticker on top-right: "86%" */}
                <div 
                  className="absolute -top-6 -right-3 w-16 h-16 rounded-full bg-yellow-300 border-[3px] border-zinc-900 z-30 shadow-md flex flex-col items-center justify-center rotate-[12deg] cursor-pointer hover:scale-105 transition-transform"
                  title="Overall Attendance Percentage"
                >
                  <span className="font-typewriter font-black text-lg text-zinc-900 leading-none">{overallAttendance}%</span>
                  <span className="text-[8px] font-typewriter font-bold uppercase text-zinc-800">SAFE</span>
                </div>

                {/* Blue Oval Sticker on bottom-left: "DBMS: 72% ⚠️" */}
                <div 
                  className="absolute -bottom-5 -left-4 px-3.5 py-1.5 rounded-full bg-sky-200 border-2 border-zinc-900 z-30 shadow-md rotate-[-8deg] cursor-pointer hover:scale-105 transition-transform"
                  title="Low attendance warning flagged for DBMS"
                >
                  <span className="font-marker font-bold text-xs text-sky-950 flex items-center gap-1">
                    <span>DBMS: 72% ⚠️</span>
                  </span>
                </div>

                {/* The Certificate / Student Card */}
                <div
                  className="bg-[#FAF7EE] border-[3px] border-amber-900/60 rounded-lg p-6 sm:p-7 shadow-xl transform rotate-[1.2deg] hover:rotate-0 transition-transform duration-300 relative overflow-hidden"
                  style={{ boxShadow: '8px 10px 0px rgba(24, 24, 27, 0.15)' }}
                >
                  <div className="border border-dashed border-amber-800/40 p-4 sm:p-5 rounded relative">
                    
                    {/* Card Header */}
                    <div className="flex items-center justify-between text-[11px] font-typewriter text-amber-950 font-bold border-b border-amber-900/20 pb-2 mb-4">
                      <span>CAMPUSMATE · NMIMS MPSTME</span>
                      <span className="bg-amber-950/10 px-2 py-0.5 rounded text-amber-900 font-mono">
                        SAP: {currentUser.sapId}
                      </span>
                    </div>

                    {/* Middle Content */}
                    <div className="flex items-start gap-4 sm:gap-5">
                      
                      {/* Student Avatar / Doodle */}
                      <div 
                        onClick={() => setIsPersonaModalOpen(true)}
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 border-zinc-900 rounded p-1 shrink-0 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-colors shadow-2xs relative group/avatar"
                        title="Click to switch student persona!"
                      >
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.name} 
                          className="w-full h-full object-cover rounded" 
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-zinc-900/80 text-[8px] text-white text-center font-typewriter py-0.5">
                          SWITCH
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-typewriter text-amber-900 tracking-wider font-semibold uppercase block">
                          CERTIFICATE OF ENROLLMENT
                        </span>

                        <h3 
                          onClick={() => setIsPersonaModalOpen(true)}
                          className="text-2xl sm:text-3xl font-bold font-handwriting text-zinc-900 truncate hover:text-amber-700 cursor-pointer transition-colors mt-0.5"
                        >
                          {currentUser.name}
                        </h3>

                        <p className="text-xs font-marker text-zinc-600">
                          {currentUser.program} • Sem {currentUser.semester} • Roll {currentUser.rollNo}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] sm:text-[11px] font-typewriter text-amber-950 font-bold">
                          <span>ATTEND: {overallAttendance}%</span>
                          <span>STATUS: REGULAR</span>
                          <span>EXPIRES: 2027</span>
                        </div>
                      </div>
                    </div>

                    {/* Persona Quote */}
                    <p className="text-[11px] font-marker text-zinc-700 leading-snug mt-4 pt-3 border-t border-amber-900/10 italic">
                      "{currentUser.quote}"
                    </p>

                    {/* Circular Rubber Stamp: "HCI VERIFIED" */}
                    <div className="absolute right-3 bottom-6 transform -rotate-12 pointer-events-none opacity-85">
                      <div className="w-24 h-24 rounded-full border-2 border-amber-800 flex flex-col items-center justify-center p-1 text-center bg-amber-800/5 shadow-2xs">
                        <div className="w-20 h-20 rounded-full border border-dashed border-amber-800 flex flex-col items-center justify-center">
                          <span className="text-[8px] font-typewriter font-bold tracking-widest text-amber-900">NMIMS OFFICIAL</span>
                          <span className="text-[10px] font-typewriter font-black tracking-wider text-amber-900 leading-tight">HCI COMPLIANT<br/>CAMPUSMATE</span>
                          <span className="text-[7px] font-typewriter text-amber-800">★ SHNEIDERMAN ★</span>
                        </div>
                      </div>
                    </div>

                    {/* Monospace MRZ Barcode Text */}
                    <div className="mt-4 pt-2 font-mono text-[9px] sm:text-[10px] text-zinc-500 tracking-wider overflow-hidden select-all whitespace-pre leading-tight">
                      <div>{`NMIMS<MPSTME<${sanitizedMRZName}<<<<<<<<<<<<<<`}</div>
                      <div>{`${currentUser.sapId}<SEM07<AI<DS<ATTEND${overallAttendance}<<<<<<<`}</div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs font-marker text-zinc-600 mt-4">
                  Personalized companion card for {currentUser.name}. Shown at actual size: fits in your pocket.
                </p>

                <div className="flex items-center justify-center gap-3 mt-3">
                  <button
                    onClick={() => setIsPersonaModalOpen(true)}
                    className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-zinc-900 text-xs font-marker font-bold rounded-lg border border-amber-300 transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Switch Persona</span>
                  </button>
                  <button
                    onClick={handlePrintNotebook}
                    className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-marker font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Companion Pass</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ALL 10 HCI CAMPUSMATE MODULES */}
          {/* ======================================================== */}
          <div className="mt-20 pt-12 border-t-2 border-dashed border-zinc-300 space-y-16">
            
            {/* 1. TIMETABLE MODULE */}
            <div id="timetable-section" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                    MODULE 01 · TIMETABLE & CLASS ALERTS
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                    Today's Class Schedule <span className="highlighter-yellow px-2 py-0.5 rounded">without the clutter</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-marker text-zinc-600">
                    Surfacing class, time, and room details so you don't have to scramble through PDFs.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF7EE] p-1.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#000]">
                  <button
                    onClick={() => setTimetableMode('day')}
                    className={`px-3 py-1 text-xs font-marker font-bold rounded-lg transition-all ${
                      timetableMode === 'day' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    Day View
                  </button>
                  <button
                    onClick={() => setTimetableMode('week')}
                    className={`px-3 py-1 text-xs font-marker font-bold rounded-lg transition-all ${
                      timetableMode === 'week' ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    Weekly Grid
                  </button>
                </div>
              </div>

              {timetableMode === 'day' && (
                <div className="flex flex-wrap gap-2">
                  {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-typewriter font-bold border-2 transition-all ${
                        selectedDay === day
                          ? 'bg-amber-300 text-zinc-900 border-zinc-900 shadow-[2px_2px_0px_#000]'
                          : 'bg-[#FAF7EE] text-zinc-700 border-zinc-400 hover:border-zinc-900'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timetable.filter(c => timetableMode === 'day' ? c.day === selectedDay : true).map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-2xl p-5 shadow-[4px_4px_0px_#18181B] flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
                  >
                    <div className="w-16 h-4 bg-amber-200/80 mx-auto -mt-6 mb-3 rounded-xs border border-amber-300 shadow-2xs rotate-1"></div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-typewriter text-zinc-500 mb-2">
                        <span className="font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          {c.startTime}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-zinc-600">
                          {c.type}
                        </span>
                      </div>

                      <h4 className="text-xl font-bold font-handwriting text-zinc-900 leading-tight">
                        {c.subject}
                      </h4>

                      <div className="mt-3 space-y-1 text-xs font-marker text-zinc-700">
                        <p className="flex items-center gap-1.5 font-bold text-zinc-900">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>Venue: {c.room}</span>
                        </p>
                        <p className="text-zinc-600">
                          Faculty: {c.faculty} ({c.code})
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between">
                      <span className={`text-[10px] font-typewriter font-bold px-2.5 py-0.5 rounded-full ${
                        c.status === 'ongoing'
                          ? 'bg-emerald-200 text-emerald-950 border border-emerald-400 animate-pulse'
                          : c.status === 'completed'
                          ? 'bg-zinc-200 text-zinc-600'
                          : 'bg-blue-100 text-blue-900 border border-blue-300'
                      }`}>
                        {c.status === 'ongoing' ? '● IN SESSION' : c.status.toUpperCase()}
                      </span>

                      <button
                        onClick={() => addToast({ title: 'Reminder Set', message: `Notifying 15m before ${c.subject}`, type: 'info' })}
                        className="text-xs font-marker text-blue-800 hover:underline"
                      >
                        Set Alert 🔔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. ATTENDANCE & BUNK CALCULATOR MODULE */}
            <div id="attendance-section" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                    MODULE 02 · ATTENDANCE & BUNK CALCULATOR
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                    Catch-up & Bunk Planner <span className="highlighter-yellow px-2 py-0.5 rounded">before it's a 10 PM crisis</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-marker text-zinc-600">
                    Solves Aarav's pain point: predicts how many classes you must attend or can safely miss.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF7EE] p-1.5 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#000]">
                  <span className="text-xs font-typewriter font-bold text-zinc-700 pl-2">Goal:</span>
                  <button
                    onClick={() => setAttendanceTarget(75)}
                    className={`px-3 py-1 text-xs font-marker font-bold rounded-lg ${
                      attendanceTarget === 75 ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    75% (Norm)
                  </button>
                  <button
                    onClick={() => setAttendanceTarget(80)}
                    className={`px-3 py-1 text-xs font-marker font-bold rounded-lg ${
                      attendanceTarget === 80 ? 'bg-zinc-900 text-white' : 'text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    80% (Safe)
                  </button>
                </div>
              </div>

              <div className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-3xl p-6 shadow-[6px_6px_0px_#18181B] space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-300 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-700" />
                    <span className="font-marker font-bold text-base text-zinc-900">
                      Pick a course to simulate attendance math:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {attendanceRecords.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedCalcId(r.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-typewriter font-bold border-2 transition-all ${
                          selectedCalcRecord.id === r.id
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-[2px_2px_0px_#F59E0B]'
                            : 'bg-white text-zinc-800 border-zinc-400 hover:border-zinc-900'
                        }`}
                      >
                        {r.code} ({r.percentage}%)
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border-2 ${
                  currentPlan.isSafe 
                    ? 'bg-emerald-50 border-emerald-800 text-emerald-950' 
                    : 'bg-amber-50 border-amber-900 text-amber-950'
                } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white border border-zinc-900 shadow-2xs shrink-0">
                      {currentPlan.isSafe ? <CheckCircle2 className="w-6 h-6 text-emerald-700" /> : <AlertTriangle className="w-6 h-6 text-amber-700" />}
                    </div>
                    <div>
                      <h4 className="font-handwriting text-2xl font-bold leading-tight">
                        {selectedCalcRecord.subject} ({selectedCalcRecord.percentage}%)
                      </h4>
                      <p className="font-marker text-sm mt-0.5 leading-snug">
                        {currentPlan.message}
                      </p>
                      <p className="font-typewriter text-[11px] text-zinc-600 mt-1">
                        Attended: {selectedCalcRecord.attended} / {selectedCalcRecord.total} sessions conducted
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-marker text-xs">
                    <button
                      onClick={() => logClassAttendance(selectedCalcRecord.id, true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border border-zinc-900 shadow-[2px_2px_0px_#000]"
                    >
                      + Attended Class
                    </button>
                    <button
                      onClick={() => logClassAttendance(selectedCalcRecord.id, false)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border border-zinc-900 shadow-[2px_2px_0px_#000]"
                    >
                      - Missed Class
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm font-marker">
                    <thead>
                      <tr className="border-b-2 border-zinc-900 text-zinc-900 font-bold text-base">
                        <th className="pb-2">Course Name</th>
                        <th className="pb-2 text-center">Attended</th>
                        <th className="pb-2 text-center">Conducted</th>
                        <th className="pb-2 text-center">Percentage</th>
                        <th className="pb-2 text-right">Standing</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-300">
                      {attendanceRecords.map(item => {
                        const isLow = item.percentage < attendanceTarget;
                        return (
                          <tr key={item.id} className="hover:bg-amber-100/40 transition-colors">
                            <td className="py-2.5">
                              <span className="font-bold text-zinc-900">{item.subject}</span>{' '}
                              <span className="text-zinc-500 font-typewriter text-[11px]">({item.code})</span>
                            </td>
                            <td className="py-2.5 text-center font-typewriter font-bold">{item.attended}</td>
                            <td className="py-2.5 text-center font-typewriter">{item.total}</td>
                            <td className="py-2.5 text-center">
                              <span className={`font-typewriter font-black text-sm px-2 py-0.5 rounded ${
                                isLow ? 'bg-red-200 text-red-950 font-bold' : 'bg-emerald-100 text-emerald-950'
                              }`}>
                                {item.percentage}%
                              </span>
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`font-typewriter text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isLow ? 'border-red-500 text-red-700 bg-red-50' : 'border-emerald-500 text-emerald-800 bg-emerald-50'
                              }`}>
                                {isLow ? 'CRITICAL RISK' : 'HEALTHY'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3. ASSIGNMENTS & TASKS MODULE */}
            <div id="assignments-section" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                    MODULE 03 · PRIORITY ASSIGNMENTS
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                    Upcoming Deadlines <span className="highlighter-yellow px-2 py-0.5 rounded">tagged by priority</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-marker text-zinc-600">
                    High, Medium, and Low labels so you immediately know what to tackle first.
                  </p>
                </div>

                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="sketchy-border bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 font-marker font-bold text-sm shadow-[2px_2px_0px_#000] flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task to Notebook</span>
                </button>
              </div>

              <div className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-3xl p-6 shadow-[6px_6px_0px_#18181B] space-y-3">
                {assignments.map(asg => (
                  <div
                    key={asg.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-start justify-between gap-4 ${
                      asg.completed 
                        ? 'border-zinc-300 bg-zinc-100/60 opacity-60' 
                        : 'border-zinc-900 bg-white shadow-[2px_2px_0px_#000]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleAssignmentComplete(asg.id)}
                        className="mt-0.5 w-6 h-6 rounded-lg border-2 border-zinc-900 flex items-center justify-center shrink-0 hover:bg-amber-100 transition-colors"
                        title={asg.completed ? 'Mark pending' : 'Mark done'}
                      >
                        {asg.completed && <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span className="font-typewriter text-[10px] font-bold text-zinc-500 uppercase">
                            {asg.subject}
                          </span>

                          <span className={`text-[10px] font-typewriter font-bold px-2 py-0.5 rounded-full border ${
                            asg.priority === 'High' 
                              ? 'bg-amber-200 border-amber-500 text-amber-950' 
                              : asg.priority === 'Medium'
                              ? 'bg-orange-200 border-orange-500 text-orange-950'
                              : 'bg-emerald-200 border-emerald-500 text-emerald-950'
                          }`}>
                            {asg.priority} Priority
                          </span>
                        </div>

                        <h4 className={`text-xl font-handwriting font-bold leading-tight ${asg.completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                          {asg.title}
                        </h4>

                        <p className="text-xs font-marker text-zinc-600 mt-0.5">
                          {asg.deadlineRelative} • {asg.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteAssignment(asg.id)}
                      className="p-1 text-zinc-400 hover:text-red-700 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. UPCOMING EXAMINATIONS MODULE */}
            <div id="exams-section" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                    MODULE 04 · EXAM COUNTDOWN & VENUES
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                    Semester VII Mid-Term Exams <span className="highlighter-yellow px-2 py-0.5 rounded">at a glance</span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exams.map((ex, index) => (
                  <div 
                    key={ex.id}
                    className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-2xl p-5 shadow-[4px_4px_0px_#18181B] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-typewriter text-zinc-500 mb-2">
                        <span className="font-bold text-amber-900">PAPER #{index + 1} ({ex.code})</span>
                        <span className="bg-rose-100 text-rose-900 font-bold px-2 py-0.5 rounded border border-rose-300">
                          {ex.daysLeft} DAYS REMAINING
                        </span>
                      </div>

                      <h4 className="text-2xl font-bold font-handwriting text-zinc-900 leading-tight">
                        {ex.subject}
                      </h4>

                      <div className="mt-3 space-y-1 text-xs font-marker text-zinc-700">
                        <p className="flex items-center gap-1.5 font-bold text-zinc-900">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>Date: {ex.date} ({ex.time})</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-zinc-700">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>Venue: {ex.venue} (Seat {ex.seatNo})</span>
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-zinc-300 flex flex-wrap gap-1.5">
                        {ex.syllabus.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[10px] font-marker bg-white border border-zinc-300 px-2 py-0.5 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 text-right">
                      <button
                        onClick={() => addToast({ title: 'Hall Ticket Verified', message: `Seat ${ex.seatNo} assigned for ${currentUser.name}`, type: 'success' })}
                        className="text-xs font-marker font-bold text-blue-800 hover:underline"
                      >
                        Download Admit Card Slip →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. NOTES & STUDY MATERIALS MODULE */}
            <div id="notes-section" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                    MODULE 05 · REPOSITORY
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                    Notes & Study Materials <span className="highlighter-yellow px-2 py-0.5 rounded">faculty verified</span>
                  </h3>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search lecture notes..."
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-[#FAF7EE] border-2 border-zinc-900 rounded-xl text-xs font-marker focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {notes.filter(n => n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.subject.toLowerCase().includes(noteSearch.toLowerCase())).map(note => (
                  <div
                    key={note.id}
                    className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-2xl p-4 shadow-[3px_3px_0px_#18181B] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-typewriter text-zinc-500 mb-2">
                        <span className="bg-amber-200 text-amber-950 font-bold px-2 py-0.5 rounded border border-amber-400">
                          {note.type}
                        </span>
                        <span>{note.size}</span>
                      </div>

                      <h4 className="text-lg font-bold font-handwriting text-zinc-900 leading-snug">
                        {note.title}
                      </h4>

                      <p className="text-xs font-marker text-zinc-600 mt-1">
                        {note.subject} • By {note.uploadedBy}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-zinc-200 flex items-center justify-between text-xs font-marker">
                      <button
                        onClick={() => addToast({ title: 'Document Preview', message: `Opened ${note.title} for reading`, type: 'info' })}
                        className="font-bold text-blue-800 hover:underline"
                      >
                        Quick Read 📖
                      </button>
                      <button
                        onClick={() => addToast({ title: 'Download Complete', message: `Saved ${note.title} (${note.size})`, type: 'success' })}
                        className="font-bold text-zinc-800 hover:underline"
                      >
                        Download 💾
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. CAMPUS EVENTS & HACKATHONS */}
            <div id="events-section" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                    MODULE 06 · CAMPUS CLUBS & EVENTS
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                    Hackathons, Workshops & Sports
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map(evt => (
                  <div
                    key={evt.id}
                    className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-2xl p-5 shadow-[4px_4px_0px_#18181B] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="px-2.5 py-1 bg-zinc-900 text-white rounded-lg text-center font-typewriter font-bold leading-none">
                          <span className="text-sm block">{evt.day}</span>
                          <span className="text-[9px] uppercase tracking-wider block text-amber-300">{evt.month}</span>
                        </div>
                        <span className="text-[10px] font-typewriter text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
                          {evt.time}
                        </span>
                      </div>

                      <h4 className="text-xl font-bold font-handwriting text-zinc-900 leading-tight">
                        {evt.title}
                      </h4>

                      <p className="text-xs font-marker text-zinc-600 mt-1 line-clamp-2">
                        {evt.description}
                      </p>

                      <p className="text-[11px] font-typewriter text-zinc-500 mt-2">
                        📍 {evt.venue} • {evt.club}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-200">
                      <button
                        onClick={() => toggleEventRSVP(evt.id)}
                        className={`w-full py-2 rounded-xl text-xs font-marker font-bold border-2 transition-all ${
                          evt.registered
                            ? 'bg-emerald-200 border-emerald-700 text-emerald-950 shadow-2xs'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900 shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        {evt.registered ? 'RSVP Confirmed ✓ (View Pass)' : 'Register / RSVP →'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. ANNOUNCEMENTS BOARD */}
            <div id="announcements-section" className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                    MODULE 07 · NOTICES
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                    College Notice Board <span className="highlighter-yellow px-2 py-0.5 rounded">centralized</span>
                  </h3>
                </div>
              </div>

              <div className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-3xl p-6 shadow-[6px_6px_0px_#18181B] space-y-3">
                {announcements.map(ann => (
                  <div
                    key={ann.id}
                    onClick={() => markAnnouncementAsRead(ann.id)}
                    className="p-4 bg-white border-2 border-zinc-900 rounded-2xl shadow-[2px_2px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Pin className={`w-5 h-5 shrink-0 mt-0.5 ${ann.isUrgent ? 'text-rose-600' : 'text-blue-600'}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-typewriter font-bold bg-amber-100 text-amber-900 px-2 py-0.2 rounded border border-amber-300">
                            {ann.category}
                          </span>
                          <span className="text-[10px] font-typewriter text-zinc-400">
                            {ann.date} ({ann.relativeTime})
                          </span>
                        </div>
                        <h4 className="text-lg font-handwriting font-bold text-zinc-900 leading-tight">
                          {ann.title}
                        </h4>
                        <p className="text-xs font-marker text-zinc-600 mt-0.5">
                          {ann.content}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-marker text-blue-800 font-bold shrink-0 self-end sm:self-center">
                      {ann.author}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. HCI PRINCIPLES EVALUATOR */}
            <div id="hci-section" className="space-y-6 pt-4">
              <div className="text-center space-y-2">
                <span className="text-xs font-typewriter uppercase text-rose-700 font-bold tracking-widest">
                  ACADEMIC HCI EVALUATION
                </span>
                <h3 className="text-3xl sm:text-4xl font-bold font-handwriting text-zinc-900">
                  How CampusMate Satisfies <span className="highlighter-yellow px-2 py-0.5 rounded">All HCI Principles</span>
                </h3>
                <p className="text-sm font-marker text-zinc-600 max-w-xl mx-auto">
                  Evaluated against Shneiderman's 8 Golden Rules and the 7 Principles of Universal Design (Slides 17–19).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hciPrinciples.map(rule => (
                  <div 
                    key={rule.id}
                    className="bg-[#FAF7EE] border-2 border-zinc-900 rounded-2xl p-5 shadow-[4px_4px_0px_#18181B] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-typewriter text-zinc-500 mb-2">
                        <span className="bg-zinc-900 text-white font-bold px-2 py-0.5 rounded">
                          {rule.category.includes('Shneiderman') ? `RULE #${rule.ruleNumber}` : `PRINCIPLE #${rule.ruleNumber}`}
                        </span>
                        <span className="font-bold text-amber-900">{rule.uiTarget}</span>
                      </div>

                      <h4 className="text-xl font-bold font-handwriting text-zinc-900 leading-tight">
                        {rule.title}
                      </h4>

                      <p className="text-xs font-marker text-zinc-600 mt-1 leading-relaxed">
                        {rule.summary}
                      </p>

                      <div className="mt-3 p-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-marker text-zinc-800 leading-snug">
                        <span className="font-bold text-zinc-900">Applied in CampusMate: </span>
                        {rule.campusMateApplication}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 pt-8 border-t border-zinc-300 text-center font-typewriter text-xs text-zinc-500 space-y-2">
            <p>© 2026 CampusMate • NMIMS MPSTME HCI Project</p>
            <p className="text-[10px] text-zinc-400">
              Team: Janvi Jain (A011) · Janvi Porwal (A012) · Joshua Rebello (S020)
            </p>
          </div>
        </main>
      </div>

      {/* MODAL 1: ADD TASK */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF7EE] border-[3px] border-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#000] relative">
            <button onClick={() => setIsTaskModalOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 p-1">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-bold font-handwriting text-zinc-900 mb-4">
              Add New Academic Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4 font-marker text-xs">
              <div>
                <label className="block text-sm font-bold text-zinc-800 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Norman's Principles Summary"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-zinc-900 rounded-xl font-handwriting text-xl text-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">Subject</label>
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-zinc-900 rounded-xl font-marker"
                >
                  <option value="Human Computer Interaction">Human Computer Interaction</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Mining">Data Mining</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-800 mb-1">Priority</label>
                <div className="grid grid-cols-3 gap-2 font-typewriter">
                  {(['High', 'Medium', 'Low'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskPriority(p)}
                      className={`py-2 rounded-xl border-2 font-bold ${
                        taskPriority === p ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-marker font-bold text-base rounded-xl shadow-[3px_3px_0px_#F59E0B]"
                >
                  Save Task to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PERSONA SWITCHER */}
      {isPersonaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF7EE] border-[3px] border-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-[8px_8px_0px_#000] relative">
            <button onClick={() => setIsPersonaModalOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-900 p-1">
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-typewriter uppercase text-zinc-500 font-bold block mb-1">
              SIMULATE RESEARCH PERSONA (SLIDE 4 & 9)
            </span>
            <h3 className="text-2xl font-bold font-handwriting text-zinc-900 mb-4">
              Select Student Persona
            </h3>

            <div className="space-y-2">
              {allUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setIsPersonaModalOpen(false);
                    addToast({
                      title: 'Persona Activated',
                      message: `Viewing CampusMate as ${user.name} (${user.personaTitle})`,
                      type: 'info'
                    });
                  }}
                  className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                    currentUser.id === user.id
                      ? 'bg-amber-200 border-zinc-900 shadow-[3px_3px_0px_#000]'
                      : 'bg-white border-zinc-300 hover:border-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-zinc-900" />
                    <div>
                      <h4 className="font-handwriting text-xl font-bold text-zinc-900">{user.name}</h4>
                      <p className="font-marker text-xs text-zinc-600">{user.personaTitle} • {user.rollNo}</p>
                    </div>
                  </div>
                  {currentUser.id === user.id && (
                    <span className="text-[10px] font-typewriter font-bold bg-zinc-900 text-white px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: HCI PRINCIPLES DRAWER */}
      {isHciDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-[#FAF7EE] border-[3px] border-zinc-900 rounded-3xl max-w-3xl w-full max-h-[85vh] p-6 shadow-[10px_10px_0px_#000] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-900 mb-4 shrink-0">
              <div>
                <span className="text-[10px] font-typewriter font-bold text-rose-800 uppercase">
                  SVKM'S NMIMS MPSTME · COURSE EVALUATION
                </span>
                <h3 className="text-2xl font-bold font-handwriting text-zinc-900">
                  HCI Principles Evaluation & Heuristics Matrix
                </h3>
              </div>
              <button onClick={() => setIsHciDrawerOpen(false)} className="text-zinc-500 hover:text-zinc-900 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-2">
              {hciPrinciples.map(p => (
                <div key={p.id} className="p-3.5 bg-white border-2 border-zinc-900 rounded-xl shadow-2xs">
                  <div className="flex items-center justify-between text-[10px] font-typewriter mb-1">
                    <span className="font-bold text-rose-800">
                      {p.category.includes('Shneiderman') ? `RULE #${p.ruleNumber}` : `PRINCIPLE #${p.ruleNumber}`}
                    </span>
                    <span className="text-zinc-500">{p.uiTarget}</span>
                  </div>
                  <h4 className="font-handwriting text-xl font-bold text-zinc-900">{p.title}</h4>
                  <p className="font-marker text-xs text-zinc-600 mt-0.5">{p.summary}</p>
                  <p className="font-marker text-xs text-zinc-800 font-bold mt-1.5 bg-amber-50 p-2 rounded border border-amber-200">
                    💡 Implementation: {p.campusMateApplication}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-300 mt-4 text-right shrink-0">
              <button
                onClick={() => setIsHciDrawerOpen(false)}
                className="px-5 py-2 bg-zinc-900 text-white font-marker font-bold text-sm rounded-xl shadow-[2px_2px_0px_#000]"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
