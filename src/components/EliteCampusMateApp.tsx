import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  FileText, 
  GraduationCap, 
  BookMarked, 
  Megaphone, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Download, 
  Play, 
  Menu, 
  Check, 
  Ticket, 
  Moon, 
  Sun, 
  QrCode, 
  BookOpen, 
  X, 
  Upload, 
  PanelLeftClose, 
  PanelLeftOpen, 
  FileCheck, 
  LogOut, 
  BadgeCheck, 
  SlidersHorizontal, 
  Eye, 
  RotateCcw, 
  ShieldCheck, 
  Filter,
  Search,
  KeyRound,
  Shield,
  Smartphone,
  HelpCircle,
  Activity,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FolderCard } from './FolderCard';
import { EliteSidebar } from './EliteSidebar';
import { AvatarUploaderModal } from './AvatarUploaderModal';
import { SafeAvatar } from './SafeAvatar';
import { StudentCompanionIllustration } from './StudentCompanionIllustration';
import { AssignmentUploadModal } from './AssignmentUploadModal';
import { PriorityLevel, Assignment } from '../types';

export const EliteCampusMateApp: React.FC = () => {
  const { 
    currentUser, 
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
    darkMode, 
    setDarkMode, 
    textSize, 
    setTextSize, 
    highContrast, 
    setHighContrast, 
    undoWindowSeconds, 
    setUndoWindowSeconds, 
    reduceMotion,
    setReduceMotion,
    dyslexiaFont,
    setDyslexiaFont,
    colorBlindMode,
    setColorBlindMode,
    setAvatarModalOpen, 
    setHciModalOpen, 
    logout 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Timetable view state
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [timetableMode, setTimetableMode] = useState<'day' | 'week'>('day');
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({});

  // Library search, filter & sort state
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState<'ALL' | 'NOTES' | 'PYQ' | 'MOCK'>('ALL');
  const [noteTypeFilter, setNoteTypeFilter] = useState<'ALL' | 'PDF' | 'PPT' | 'DOC' | 'CODE'>('ALL');
  const [librarySearch, setLibrarySearch] = useState<string>('');
  const [librarySortBy, setLibrarySortBy] = useState<'recent' | 'size' | 'title'>('recent');

  // Notices (Announcements) search & filter
  const [noticesSearch, setNoticesSearch] = useState<string>('');
  const [noticesFilter, setNoticesFilter] = useState<'all' | 'unread' | 'academic' | 'placement'>('all');

  // Campus Life (Events) search & category
  const [eventsSearch, setEventsSearch] = useState<string>('');
  const [eventsCategory, setEventsCategory] = useState<string>('all');

  // Profile Security Form state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorActive, setTwoFactorActive] = useState(false);

  // Accessibility modal state
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // Tab label mapping for consistency across Sidebar and Header Breadcrumbs (Shneiderman #1, Nielsen #4)
  const tabLabels: Record<string, string> = {
    dashboard: 'Academic Hub',
    timetable: 'Class Timetable',
    attendance: 'Attendance & Bunks',
    assignments: 'Priority Tasks',
    exams: 'Examination Hall',
    notes: 'Library & Notes',
    events: 'Campus Life & RSVP',
    announcements: 'Notices & Bulletins',
    profile: 'Student Profile'
  };

  // Helper for recognition rather than recall: short subject name
  const getSubjectShortName = (name: string) => {
    if (name.includes('Human Computer Interaction')) return 'HCI';
    if (name.includes('Machine Learning')) return 'ML';
    if (name.includes('Data Mining')) return 'Data Mining';
    if (name.includes('Database Management')) return 'DBMS';
    if (name.includes('Cloud Computing')) return 'Cloud DevOps';
    if (name.includes('Ethics in AI')) return 'AI Ethics';
    return name;
  };

  // Dynamic class status computation from real-time clock (Nielsen #1, Norman Gulf of Evaluation)
  const computeClassStatus = (classItem: any) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const todayName = daysOfWeek[currentDayOfWeek];
    const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;

    // On weekend, Monday has not happened yet!
    if (isWeekend) {
      return 'upcoming';
    }

    const dayOrder: Record<string, number> = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5 };
    const todayNum = dayOrder[todayName] || 1;
    const targetNum = dayOrder[classItem.day] || 1;

    if (targetNum < todayNum) return 'completed';
    if (targetNum > todayNum) return 'upcoming';

    const parseTimeString = (timeStr: string) => {
      const parts = timeStr.trim().split(' ');
      const [hoursStr, minutesStr] = parts[0].split(':');
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const period = parts[1];
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    try {
      const start = parseTimeString(classItem.startTime);
      const end = parseTimeString(classItem.endTime);
      if (now > end) return 'completed';
      if (now >= start && now <= end) return 'ongoing';
      return 'upcoming';
    } catch {
      return classItem.status;
    }
  };

  // Dynamic exam countdown calculation from actual current date
  const getExamDaysLeft = (dateObjStr?: string) => {
    if (!dateObjStr) return 3;
    const target = new Date(dateObjStr);
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  // Shared upcoming exam
  const nextExam = exams[0];
  const nextExamDaysLeft = getExamDaysLeft(nextExam?.dateObj);

  // Dynamic live class for today (Nielsen #1, Norman Gulf of Evaluation)
  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = daysOfWeek[now.getDay()];
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const effectiveDay = isWeekend ? 'Monday' : todayDayName;

  const todayClasses = timetable.filter(c => c.day === effectiveDay);
  const liveClass = todayClasses.find(c => computeClassStatus(c) === 'ongoing') 
                 || todayClasses.find(c => computeClassStatus(c) === 'upcoming') 
                 || todayClasses[todayClasses.length - 1] 
                 || timetable[0];
  const liveStatus = isWeekend ? 'upcoming' : computeClassStatus(liveClass);

  // Standardized file-type color mapping for Library (Shneiderman #1, Nielsen #4)
  const getFileTypeColor = (type: string): 'rose' | 'amber' | 'blue' | 'emerald' => {
    switch (type.toUpperCase()) {
      case 'PDF': return 'rose';
      case 'PPT': return 'amber';
      case 'DOC': return 'blue';
      case 'CODE': return 'emerald';
      default: return 'blue';
    }
  };

  // Task creation modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Human Computer Interaction');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('High');

  // Assignment upload submission modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetAssignment, setTargetAssignment] = useState<Assignment | null>(null);

  // Note preview modal state
  const [activeNoteModal, setActiveNoteModal] = useState<any>(null);

  // Digital Event Pass modal state
  const [activeTicketModal, setActiveTicketModal] = useState<any>(null);

  // Bunk Calculator selected record
  const [selectedCalcId, setSelectedCalcId] = useState<string>(attendanceRecords[3]?.id || attendanceRecords[0]?.id);
  const selectedCalcRecord = attendanceRecords.find(r => r.id === selectedCalcId) || attendanceRecords[0];

  // Predictive catch-up calculation formula
  const calculatePlanning = (attended: number, total: number, targetPct: number) => {
    const currentPct = (attended / total) * 100;
    const target = targetPct / 100;

    if (currentPct >= targetPct) {
      const safeSkips = Math.floor((attended - target * total) / target);
      return {
        isSafe: true,
        count: Math.max(0, safeSkips),
        message: safeSkips > 0 
          ? `You can safely miss ${safeSkips} more class${safeSkips > 1 ? 'es' : ''} while maintaining above ${targetPct}%.`
          : `You are exactly on the ${targetPct}% threshold. Do not miss your next lecture!`
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
    if (!newTitle.trim()) return;

    addAssignment({
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: new Date().toISOString(),
      dueTime: '11:59 PM',
      deadlineRelative: 'Due soon',
      priority: newPriority,
      completed: false,
      submissionType: 'File Upload',
      description: 'Coursework task added to academic tracking pipeline.',
      points: 20,
      tags: ['Coursework', newSubject.split(' ')[0]]
    });

    setNewTitle('');
    setTaskModalOpen(false);
  };

  const handleAssignmentSubmitted = (assignmentId: string, _fileName: string) => {
    toggleAssignmentComplete(assignmentId);
  };

  const pendingTasks = assignments.filter(a => !a.completed);

  return (
    <div className={`min-h-screen flex ${
      darkMode ? 'bg-[#0B0D13] text-slate-100' : 'bg-[#F4F6FB] text-slate-900'
    } font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-300`}>
      
      {/* Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none animate-glow" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-glow" />

      {/* Persistent Collapsable Sidebar */}
      <EliteSidebar 
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        
        {/* Top Minimalist Header */}
        <header className={`px-6 sm:px-10 py-4 flex items-center justify-between border-b sticky top-0 z-30 backdrop-blur-md transition-colors ${
          darkMode ? 'bg-[#0B0D13]/85 border-white/5' : 'bg-white/85 border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl transition-colors ${
                darkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:flex p-2 rounded-xl transition-colors ${
                darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Interactive Breadcrumb (Shneiderman #8 Recognition over Recall, Nielsen #4 Consistency) */}
            <div className="flex items-center gap-2 text-xs font-tech">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`hover:text-indigo-500 transition-colors font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                CampusMate
              </button>
              <span className="opacity-40 font-mono">/</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-lg text-xs ${
                darkMode ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {tabLabels[activeTab] || 'Academic Hub'}
              </span>
            </div>

            {/* Synchronized Navigation Tabs matching sidebar labels exactly (Shneiderman Rule #1) */}
            <div className="hidden 2xl:flex items-center gap-1 text-xs font-tech font-bold">
              {[
                { id: 'dashboard', label: 'Academic Hub' },
                { id: 'timetable', label: 'Class Timetable' },
                { id: 'attendance', label: 'Attendance & Bunks' },
                { id: 'assignments', label: 'Priority Tasks' },
                { id: 'exams', label: 'Examination Hall' },
                { id: 'notes', label: 'Library & Notes' },
                { id: 'events', label: 'Campus Life' },
                { id: 'announcements', label: 'Notices' },
              ].map(t => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : darkMode
                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action: Accessibility Controls, Dark Mode & Safe Profile Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Color-Blind Active Indicator Chip & Quick Reset (Norman: Make Things Visible) */}
            {colorBlindMode !== 'none' && (
              <button
                onClick={() => setColorBlindMode('none')}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/40 text-xs font-tech font-bold flex items-center gap-1.5 hover:bg-amber-500/30 transition-all shadow-xs"
                title="Color-Blind Safe Mode is Active. Click to Reset to Standard."
              >
                <span>👁️</span>
                <span className="hidden md:inline font-bold uppercase">{colorBlindMode}</span>
                <span className="text-[10px] opacity-75 hover:opacity-100 font-sans ml-0.5">✕</span>
              </button>
            )}

            {/* Accessibility Controls & Preferences Modal Trigger (Shneiderman #2 Universal Usability) */}
            <button
              onClick={() => setAccessibilityModalOpen(true)}
              className={`p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-tech font-bold ${
                colorBlindMode !== 'none' || highContrast || textSize !== 'normal'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : darkMode 
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Universal Accessibility & Preferences"
              aria-label="Open accessibility settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Accessibility</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-colors ${
                darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Toggle dark/light theme"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Profile Avatar */}
            <div 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all group ${
                darkMode ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-100 hover:bg-slate-200 border-slate-300'
              }`}
              title="Open My Profile"
            >
              <div className="relative">
                <SafeAvatar 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/50"
                />
              </div>
              <span className={`text-xs font-tech font-bold hidden sm:inline ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Switching with Page Entry Animations */}
        <main className="flex-1 p-6 sm:p-10 md:p-14 max-w-7xl w-full mx-auto">
          
          {/* ======================================================== */}
          {/* HOME / DASHBOARD: HERO & FOLDER CARDS                    */}
          {/* ======================================================== */}
          {activeTab === 'dashboard' && (
            <div key="dashboard" className="space-y-12 animate-page-enter">
              
              {/* HERO SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left: Bold Modernist Headline */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Student Welcome & Status Badge */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all hover:scale-102 shadow-xs group ${
                        darkMode ? 'bg-[#141624] border-indigo-500/30 text-indigo-300' : 'bg-white border-indigo-200 text-indigo-900'
                      }`}
                      title="View student profile details"
                    >
                      <SafeAvatar 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500" 
                      />
                      <span className="text-xs font-tech font-bold">
                        Welcome back, {currentUser.name.split(' ')[0]} 👋 · Roll {currentUser.rollNo}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-tech font-bold text-emerald-500 uppercase">
                      ● Active Semester VII
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight ${
                      darkMode ? 'text-white' : 'text-slate-950'
                    }`}>
                      Unified Academic Workspace
                    </h1>
                    <p className="text-xs sm:text-sm font-tech font-semibold text-indigo-500">
                      SVKM's NMIMS MPSTME • Department of Artificial Intelligence & Data Science
                    </p>
                  </div>

                  <p className={`text-xs sm:text-sm font-sans max-w-lg leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    A centralized, human-centered student companion replacing fragmented portals. Built for students to navigate attendance, schedules, and coursework deadlines without cognitive strain.
                  </p>

                  {/* Interactive Quick Action Pill Search Bar */}
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div className={`relative w-full max-w-md flex items-center border rounded-full p-1.5 pl-5 shadow-md group focus-within:border-indigo-500 transition-colors ${
                      darkMode ? 'bg-[#151724] border-white/15' : 'bg-white border-slate-300'
                    }`}>
                      <input 
                        type="text"
                        placeholder="Search courses, venues, or tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`bg-transparent text-sm focus:outline-none flex-1 font-sans ${
                          darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                        }`}
                      />
                      <button
                        onClick={() => setActiveTab('timetable')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform shrink-0 font-bold ${
                          darkMode ? 'bg-white text-slate-900' : 'bg-indigo-600 text-white shadow-md'
                        }`}
                        title="Search timetable"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Secondary Action: Learn More / HCI */}
                  <div className="flex flex-wrap items-center gap-6 pt-1">
                    <button
                      onClick={() => setHciModalOpen(true)}
                      className={`flex items-center gap-3 text-xs font-tech font-bold transition-colors group ${
                        darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        darkMode ? 'bg-white/10 group-hover:bg-white/20 text-white' : 'bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600'
                      }`}>
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                      <span>Learn More about Norman's 7 Principles</span>
                    </button>
                  </div>

                  {/* Tag Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className={`px-3 py-1 rounded-full border text-[11px] font-tech font-bold tracking-wider uppercase ${
                      darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      HCI DESIGN
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-[11px] font-tech font-bold tracking-wider uppercase ${
                      darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      AI & DATA SCIENCE
                    </span>
                    <span className={`px-3 py-1 rounded-full border text-[11px] font-tech font-bold tracking-wider uppercase ${
                      darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      SEMESTER VII
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-tech font-bold tracking-wider text-blue-500 uppercase">
                      75% SAFE STANDING
                    </span>
                  </div>
                </div>

                {/* Right: Dynamic Lilac Folder Card with Vector Illustration */}
                <div className="lg:col-span-5">
                  <div className="relative group">
                    <FolderCard
                      variant="lilac"
                      tabLabel={
                        liveStatus === 'ongoing' 
                          ? '● LIVE IN SESSION' 
                          : liveStatus === 'completed' 
                          ? 'SESSIONS CONCLUDED' 
                          : 'UPCOMING SESSION'
                      }
                      onClick={() => setActiveTab('timetable')}
                      className="shadow-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300"
                    >
                      <div className="relative z-10 flex flex-col justify-between min-h-[340px]">
                        <div>
                          <span className="text-[11px] font-tech tracking-wider uppercase font-bold text-purple-950 block mb-1">
                            {liveClass.room} • {liveClass.startTime} - {liveClass.endTime}
                          </span>
                          <h3 className="font-display text-2xl sm:text-3xl font-black text-purple-950 leading-tight">
                            {liveClass.subject}
                          </h3>
                          <p className="text-xs font-semibold text-purple-900 mt-1">
                            {liveClass.faculty} • {liveClass.type}
                          </p>
                        </div>

                        {/* Vector Student Illustration */}
                        <div className="relative mt-4 flex items-center justify-center animate-float">
                          <StudentCompanionIllustration className="w-48 h-48 sm:w-56 sm:h-56" />
                        </div>

                        <div className="mt-4 pt-3 border-t border-purple-900/15 flex items-center justify-between text-xs font-bold text-purple-950 font-tech">
                          <span className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${liveStatus === 'ongoing' ? 'bg-emerald-600 animate-pulse' : 'bg-purple-900'}`} />
                            <span>
                              {liveStatus === 'ongoing' 
                                ? 'Currently Active in Schedule' 
                                : liveStatus === 'completed' 
                                ? 'All Today\'s Lectures Concluded' 
                                : `Next Lecture at ${liveClass.startTime}`}
                            </span>
                          </span>
                          <span className="underline">View Full Day →</span>
                        </div>
                      </div>
                    </FolderCard>
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* THE 3 STEPPED FOLDER CARDS                               */}
              {/* ======================================================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
                
                {/* 1. Vibrant Cobalt Blue Folder Card */}
                <FolderCard
                  variant="blue"
                  tabLabel="ACADEMIC TRACKER"
                  tag="ATTENDANCE ENGINE"
                  title="Official 75% Safe Standing"
                  metric={`${overallAttendance}%`}
                  icon={
                    <span 
                      title="Fewest classes you can miss in any subject (Lowest safe margin across all courses)"
                      className="text-xs font-tech font-bold px-2.5 py-1 rounded-full bg-white/20 text-white cursor-help flex items-center gap-1"
                    >
                      <span>+2 SAFE BUNKS</span>
                      <span className="text-[10px] opacity-75">ℹ️</span>
                    </span>
                  }
                  onClick={() => setActiveTab('attendance')}
                  className="hover:-translate-y-2 transition-all duration-300"
                >
                  <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                    Fewest classes you can miss in any subject while remaining eligible for exams.
                  </p>
                </FolderCard>

                {/* 2. Light Grey / Chalk Folder Card */}
                <FolderCard
                  variant="grey"
                  tabLabel="LEARNING PLATFORM"
                  tag="PENDING SUBMISSIONS"
                  title="Priority Academic Tasks"
                  metric={`${pendingTasks.length}`}
                  icon={
                    <span className="text-xs font-tech font-bold px-2.5 py-1 rounded-full bg-black/10 text-slate-800">
                      {pendingTasks.length} PENDING
                    </span>
                  }
                  onClick={() => setActiveTab('assignments')}
                  className="hover:-translate-y-2 transition-all duration-300"
                >
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Coursework and lab deliverables prioritized by upcoming deadlines.
                  </p>
                </FolderCard>

                {/* 3. Warm Ochre Yellow Folder Card */}
                <FolderCard
                  variant="yellow"
                  tabLabel="EXAM READINESS"
                  tag="NEXT UPCOMING PAPER"
                  title={nextExam ? nextExam.subject : "Mid-Term Examinations"}
                  icon={
                    <span className={`text-xs font-tech font-bold px-2.5 py-1 rounded-full ${
                      nextExamDaysLeft <= 3 
                        ? 'bg-rose-500/20 text-rose-800 border border-rose-500/30' 
                        : nextExamDaysLeft <= 7 
                        ? 'bg-amber-500/20 text-amber-900 border border-amber-500/30' 
                        : 'bg-indigo-500/20 text-indigo-900 border border-indigo-500/30'
                    }`}>
                      {nextExamDaysLeft} DAYS LEFT
                    </span>
                  }
                  onClick={() => setActiveTab('exams')}
                  className="hover:-translate-y-2 transition-all duration-300"
                >
                  <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                    {nextExam?.venue} • Seat {nextExam?.seatNo} • Verified admit slip ready.
                  </p>
                </FolderCard>
              </div>

              {/* Research Team Banner */}
              <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                darkMode ? 'bg-[#141624] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-wider font-bold block">
                    PROJECT TEAM · SVKM's NMIMS MPSTME · SEMESTER VII AI & DS
                  </span>
                  <h4 className={`font-display text-lg font-bold mt-1 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Janvi Jain (A011) • Janvi Porwal (A012) • Joshua Rebello (S020)
                  </h4>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Designed to eliminate student platform fragmentation using Don Norman's 7 Principles & Shneiderman's 8 Golden Rules.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-500 border border-indigo-500/30 rounded-xl text-xs font-tech font-bold transition-all flex items-center gap-2"
                  >
                    <BadgeCheck className="w-4 h-4" />
                    <span>My Account</span>
                  </button>
                  <button
                    onClick={() => setHciModalOpen(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-tech font-bold transition-all ${
                      darkMode ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    HCI Matrix →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TIMETABLE TAB                                            */}
          {/* ======================================================== */}
          {activeTab === 'timetable' && (
            <div key="timetable" className="space-y-8 animate-page-enter">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                    MODULE 01 · TIMETABLE
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                    darkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    Academic Class Schedule
                  </h2>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Never search through WhatsApp groups for room numbers or faculty names.
                  </p>
                </div>

                {/* Day / Week Switcher */}
                <div className={`flex items-center p-1 rounded-2xl border ${
                  darkMode ? 'bg-[#151722] border-white/10' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <button
                    onClick={() => setTimetableMode('day')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-tech font-bold transition-all ${
                      timetableMode === 'day' ? 'bg-indigo-600 text-white shadow-md' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    Day View
                  </button>
                  <button
                    onClick={() => setTimetableMode('week')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-tech font-bold transition-all ${
                      timetableMode === 'week' ? 'bg-indigo-600 text-white shadow-md' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    Weekly Grid
                  </button>
                </div>
              </div>

              {/* Day Selector Tabs */}
              {timetableMode === 'day' && (
                <div className="flex flex-wrap gap-2.5">
                  {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-xl text-xs font-tech font-bold transition-all ${
                        selectedDay === day
                          ? 'bg-indigo-600 text-white shadow-md scale-105'
                          : darkMode 
                          ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}

              {/* Day / Week Rendering */}
              {timetableMode === 'week' ? (
                <div className="space-y-6">
                  {/* Mon to Fri Time Matrix Table */}
                  <div className={`rounded-3xl border overflow-hidden shadow-xl ${
                    darkMode ? 'bg-[#141624] border-white/10' : 'bg-white border-slate-200'
                  }`}>
                    <div className="p-5 border-b border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-tech uppercase tracking-wider text-indigo-500 font-bold block">
                          WEEKLY SCHEDULE MATRIX · MON - FRI
                        </span>
                        <h3 className="font-display text-lg font-bold">
                          Full Academic Week Matrix (AI & Data Science Div A)
                        </h3>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Distinct daily slots eliminate overlap: ML Lab (Mon 10:30) vs Cloud Lab (Tue 11:00).
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-tech">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Lecture</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Lab</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Tutorial</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[920px]">
                        <thead>
                          <tr className={`border-b text-xs font-tech uppercase tracking-wider ${
                            darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                            <th className="py-3 px-4 font-bold w-40">Time Slot</th>
                            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
                              <th key={day} className={`py-3 px-4 font-bold ${day === todayDayName && !isWeekend ? 'text-indigo-500 bg-indigo-500/10' : ''}`}>
                                <div className="flex items-center justify-between">
                                  <span>{day}</span>
                                  {day === todayDayName && !isWeekend && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-600 text-white font-tech font-bold">TODAY</span>
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-current/10 text-xs">
                          {[
                            { id: 'morning', label: 'Morning Slot 1', span: '08:30 AM - 10:30 AM' },
                            { id: 'midday', label: 'Midday Slot 2', span: '10:30 AM - 01:00 PM' },
                            { id: 'afternoon', label: 'Afternoon Slot 3', span: '01:30 PM - 04:00 PM' }
                          ].map(slot => (
                            <tr key={slot.id} className="align-top">
                              <td className={`py-4 px-4 font-tech border-r border-current/10 ${darkMode ? 'bg-white/2' : 'bg-slate-50/50'}`}>
                                <div className="font-bold text-indigo-500">{slot.label}</div>
                                <div className="text-[11px] opacity-70 mt-0.5">{slot.span}</div>
                              </td>
                              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => {
                                const dayClasses = timetable.filter(c => c.day === day);
                                const slotClasses = dayClasses.filter(c => {
                                  const hour = parseInt(c.startTime.split(':')[0], 10);
                                  const isAM = c.startTime.includes('AM');
                                  if (slot.id === 'morning') {
                                    return isAM && (hour === 8 || hour === 9 || (hour === 10 && c.startTime.startsWith('10:00')));
                                  }
                                  if (slot.id === 'midday') {
                                    return (isAM && (c.startTime.startsWith('10:30') || hour === 11)) || c.startTime.startsWith('12:');
                                  }
                                  return !isAM || hour === 1 || hour === 2 || hour === 3 || hour === 4;
                                });

                                const isTodayCol = day === todayDayName && !isWeekend;

                                return (
                                  <td key={day} className={`py-3 px-3 border-r border-current/10 last:border-r-0 ${isTodayCol ? 'bg-indigo-500/5' : ''}`}>
                                    {slotClasses.length > 0 ? (
                                      <div className="space-y-2">
                                        {slotClasses.map(item => {
                                          const status = computeClassStatus(item);
                                          return (
                                            <div
                                              key={item.id}
                                              className={`p-3 rounded-2xl border transition-all ${
                                                status === 'ongoing'
                                                  ? 'bg-emerald-500/15 border-emerald-500/40 ring-2 ring-emerald-500/20'
                                                  : darkMode
                                                  ? 'bg-white/5 border-white/10 hover:border-indigo-500/40'
                                                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                                              }`}
                                            >
                                              <div className="flex items-center justify-between text-[10px] font-tech font-bold mb-1">
                                                <span className="text-indigo-500">{item.startTime} - {item.endTime}</span>
                                                <span className={`px-1.5 py-0.5 rounded uppercase text-[9px] ${
                                                  item.type === 'Lab' 
                                                    ? 'bg-emerald-500/20 text-emerald-500' 
                                                    : item.type === 'Tutorial' 
                                                    ? 'bg-amber-500/20 text-amber-500' 
                                                    : 'bg-blue-500/20 text-blue-500'
                                                }`}>
                                                  {item.type}
                                                </span>
                                              </div>
                                              <h5 className="font-display font-bold text-xs leading-tight">
                                                {item.subject}
                                              </h5>
                                              <div className="mt-1.5 flex items-center justify-between text-[10px] opacity-75 font-tech">
                                                <span>{item.room}</span>
                                                <span>{item.code}</span>
                                              </div>
                                              <div className="mt-1 flex items-center justify-between text-[9px] opacity-60">
                                                <span className="truncate">{item.faculty}</span>
                                                <span className={`px-1 rounded font-tech font-bold ${
                                                  status === 'ongoing'
                                                    ? 'text-emerald-500 bg-emerald-500/10'
                                                    : status === 'completed'
                                                    ? 'text-slate-400'
                                                    : 'text-indigo-400'
                                                }`}>
                                                  {status === 'ongoing' ? 'LIVE' : status.toUpperCase()}
                                                </span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div className={`h-full min-h-[85px] rounded-2xl border border-dashed flex flex-col items-center justify-center p-2 text-center ${
                                        darkMode ? 'border-white/5 text-slate-500' : 'border-slate-200 text-slate-400'
                                      }`}>
                                        <span className="text-[10px] font-tech font-semibold">Free Period</span>
                                        <span className="text-[9px] opacity-75">Self Study / Lab Free</span>
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* Class Cards for Day View */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {timetable.filter(c => c.day === selectedDay).map((item) => {
                    const status = computeClassStatus(item);
                    const hasAlert = !!activeAlerts[item.id];

                    const toggleAlert = () => {
                      const nextAlert = !hasAlert;
                      setActiveAlerts(prev => ({ ...prev, [item.id]: nextAlert }));
                      if (nextAlert) {
                        addToast({ 
                          title: 'Lecture Alert Armed', 
                          message: `10-min arrival reminder armed for ${item.subject} in ${item.room}`, 
                          type: 'success' 
                        });
                      } else {
                        addToast({ 
                          title: 'Alert Cancelled', 
                          message: `Reminder deactivated for ${item.subject}`, 
                          type: 'info' 
                        });
                      }
                    };

                    return (
                      <div
                        key={item.id}
                        className={`p-6 rounded-3xl border transition-all flex flex-col justify-between group shadow-lg hover:-translate-y-1.5 ${
                          darkMode ? 'bg-[#141624] border-white/10 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-3">
                            <span className={`font-tech font-bold px-2.5 py-0.5 rounded-full border ${
                              darkMode ? 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30' : 'text-indigo-600 bg-indigo-50 border-indigo-200'
                            }`}>
                              {item.startTime} - {item.endTime}
                            </span>
                            <span className="text-[10px] font-tech uppercase font-bold opacity-60">
                              {item.type}
                            </span>
                          </div>

                          <h4 className={`font-display text-xl font-bold group-hover:text-indigo-500 transition-colors ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {item.subject}
                          </h4>

                          <div className={`mt-4 space-y-1.5 text-xs ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            <p className={`flex items-center gap-2 font-medium ${
                              darkMode ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Venue: {item.room}</span>
                            </p>
                            <p>
                              Faculty: {item.faculty} ({item.code})
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-xs">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-tech font-bold ${
                            status === 'ongoing'
                              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 animate-pulse'
                              : status === 'completed'
                              ? 'bg-slate-500/20 text-slate-400 border border-slate-500/20'
                              : 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/30'
                          }`}>
                            {status === 'ongoing' ? '● IN SESSION' : status.toUpperCase()}
                          </span>

                          {status === 'completed' ? (
                            <span className="text-[11px] font-tech text-slate-400 italic">
                              Session Concluded
                            </span>
                          ) : (
                            <button
                              onClick={toggleAlert}
                              className={`text-xs font-tech font-semibold transition-colors flex items-center gap-1 ${
                                hasAlert ? 'text-emerald-500 hover:text-emerald-400 font-bold' : 'text-indigo-500 hover:text-indigo-600'
                              }`}
                              title={hasAlert ? "Click to cancel alert" : "Set alert reminder"}
                            >
                              {hasAlert ? 'Alert Active ✓' : 'Set Alert 🔔'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* ATTENDANCE & BUNK CALCULATOR TAB                         */}
          {/* ======================================================== */}
          {activeTab === 'attendance' && (
            <div key="attendance" className="space-y-8 animate-page-enter">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                    MODULE 02 · ATTENDANCE ENGINE
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                    darkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    Smart Catch-up & Safe Bunk Calculator
                  </h2>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Solves student anxiety: calculates exactly how many lectures you can miss or must attend.
                  </p>
                </div>

                <div className={`flex items-center gap-2 p-1.5 rounded-2xl border ${
                  darkMode ? 'bg-[#151722] border-white/10' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <span className="text-xs opacity-60 pl-2 font-tech">Threshold:</span>
                  <button
                    onClick={() => setAttendanceTarget(75)}
                    className={`px-3 py-1 rounded-xl text-xs font-tech font-bold transition-all ${
                      attendanceTarget === 75 ? 'bg-indigo-600 text-white' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    75% (NMIMS Rule)
                  </button>
                  <button
                    onClick={() => setAttendanceTarget(80)}
                    className={`px-3 py-1 rounded-xl text-xs font-tech font-bold transition-all ${
                      attendanceTarget === 80 ? 'bg-indigo-600 text-white' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    80% (Safe Target)
                  </button>
                </div>
              </div>

              {/* Calculator Box */}
              <div className={`p-7 rounded-3xl border shadow-xl space-y-6 ${
                darkMode ? 'bg-[#141624] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-current/10 pb-4">
                  <span className="text-xs font-tech uppercase font-bold opacity-80">
                    Select Subject for Predictive Analysis:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {attendanceRecords.map(r => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedCalcId(r.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-tech font-semibold border transition-all ${
                          selectedCalcRecord.id === r.id
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                            : darkMode 
                            ? 'bg-white/5 text-slate-300 border-white/10 hover:border-white/30' 
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                        title={r.subject}
                      >
                        {getSubjectShortName(r.subject)} ({r.code}) · {r.percentage}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outcome Banner */}
                <div className={`p-5 rounded-2xl border ${
                  currentPlan.isSafe
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-current/10 shrink-0">
                      {currentPlan.isSafe ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={`font-display text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {selectedCalcRecord.subject} ({selectedCalcRecord.percentage}%)
                      </h4>
                      <p className={`text-sm mt-0.5 leading-relaxed font-sans ${
                        darkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        {currentPlan.message}
                      </p>
                      <p className="text-[11px] opacity-70 mt-1 font-tech">
                        Attended {selectedCalcRecord.attended} / {selectedCalcRecord.total} sessions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => logClassAttendance(selectedCalcRecord.id, true)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold rounded-xl text-xs transition-colors shadow-md"
                    >
                      + Attended
                    </button>
                    <button
                      onClick={() => logClassAttendance(selectedCalcRecord.id, false)}
                      className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-tech font-bold rounded-xl text-xs transition-colors shadow-md"
                    >
                      - Missed
                    </button>
                  </div>
                </div>

                {/* Table Breakdown */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-current/10 opacity-60 font-tech uppercase tracking-wider pb-2">
                        <th className="pb-3">Course</th>
                        <th className="pb-3 text-center">Attended</th>
                        <th className="pb-3 text-center">Conducted</th>
                        <th className="pb-3 text-center">Percentage</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-current/5">
                      {attendanceRecords.map(item => {
                        const isLow = item.percentage < attendanceTarget;
                        return (
                          <tr key={item.id} className="hover:bg-current/5 transition-colors">
                            <td className="py-3.5">
                              <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.subject}</span>{' '}
                              <span className="opacity-60 text-[11px] font-tech">({item.code})</span>
                            </td>
                            <td className="py-3.5 text-center font-bold">{item.attended}</td>
                            <td className="py-3.5 text-center opacity-60">{item.total}</td>
                            <td className="py-3.5 text-center">
                              <span className={`font-black text-sm px-2.5 py-0.5 rounded-full ${
                                isLow ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
                              }`}>
                                {item.percentage}%
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <span className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded-full border ${
                                isLow ? 'border-rose-500/40 text-rose-500 bg-rose-500/10' : 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                              }`}>
                                {isLow ? 'DEFICIENCY' : 'SAFE'}
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
          )}

          {/* ======================================================== */}
          {/* ASSIGNMENTS TAB (WITH UPLOAD OPTION)                     */}
          {/* ======================================================== */}
          {activeTab === 'assignments' && (
            <div key="assignments" className="space-y-8 animate-page-enter">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                    MODULE 03 · WORKFLOW & SUBMISSIONS
                  </span>
                  <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                    darkMode ? 'text-white' : 'text-slate-950'
                  }`}>
                    Priority-Tagged Tasks
                  </h2>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Check off tasks with instant undo support, or upload coursework files directly.
                  </p>
                </div>

                <button
                  onClick={() => setTaskModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-tech font-bold transition-all shadow-md flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {assignments.map(asg => (
                  <div
                    key={asg.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:-translate-y-1 ${
                      asg.completed
                        ? 'opacity-60 bg-current/5 border-current/10'
                        : darkMode 
                        ? 'bg-[#141624] border-white/10 hover:border-indigo-500/40 shadow-lg' 
                        : 'bg-white border-slate-200 hover:border-indigo-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <button
                        onClick={() => toggleAssignmentComplete(asg.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          asg.completed ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-current/20 hover:border-indigo-500'
                        }`}
                        title="Mark task complete"
                      >
                        {asg.completed && <Check className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-tech font-bold opacity-60 uppercase">
                            {asg.subject}
                          </span>
                          <span className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded-full ${
                            asg.priority === 'High' 
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
                              : asg.priority === 'Medium'
                              ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30'
                              : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                          }`}>
                            {asg.priority} Priority
                          </span>
                          {asg.completed && (
                            <span className="text-[10px] font-tech font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                              <FileCheck className="w-3 h-3" />
                              <span>Completed / Submitted</span>
                            </span>
                          )}
                        </div>

                        <h4 className={`text-lg font-display font-bold truncate ${
                          asg.completed ? 'line-through opacity-60' : darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {asg.title}
                        </h4>

                        <p className={`text-xs mt-1 leading-relaxed ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {asg.deadlineRelative} • {asg.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Upload Submission + Delete */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setTargetAssignment(asg);
                          setUploadModalOpen(true);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-tech font-bold flex items-center gap-1.5 transition-colors ${
                          asg.completed 
                            ? 'bg-current/10 hover:bg-current/20 text-current' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                        }`}
                        title="Upload submission file"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{asg.completed ? 'Re-upload' : 'Upload Submission'}</span>
                      </button>

                      <button
                        onClick={() => deleteAssignment(asg.id)}
                        className="p-1.5 opacity-40 hover:opacity-100 hover:text-rose-500 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* EXAMINATIONS TAB                                         */}
          {/* ======================================================== */}
          {activeTab === 'exams' && (
            <div key="exams" className="space-y-8 animate-page-enter">
              <div>
                <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                  MODULE 04 · EXAMINATIONS
                </span>
                <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  Mid-Term Examination Vault
                </h2>
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Countdown to exams with designated seat codes and hall locations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exams.map((ex, index) => {
                  const daysLeft = getExamDaysLeft(ex.dateObj);
                  const chipColorClass = daysLeft <= 3 
                    ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' 
                    : daysLeft <= 7 
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' 
                    : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';

                  return (
                    <div 
                      key={ex.id}
                      className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition-all ${
                        darkMode ? 'bg-[#141624] border-white/10 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[10px] font-tech font-bold text-indigo-500 uppercase">
                            PAPER #{index + 1} ({ex.code})
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-tech font-bold ${chipColorClass}`}>
                            {daysLeft} DAYS LEFT
                          </span>
                        </div>

                      <h4 className={`font-display text-2xl font-bold mt-1 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {ex.subject}
                      </h4>

                      <div className={`mt-4 space-y-1.5 text-xs ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Date: {ex.date} ({ex.time})</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Location: {ex.venue} (Seat {ex.seatNo})</span>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-current/10 flex flex-wrap gap-1.5">
                        {ex.syllabus.map((s, i) => (
                          <span key={i} className={`text-[10px] font-tech px-2 py-0.5 rounded-lg border ${
                            darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-current/10 text-right">
                      <button
                        onClick={() => addToast({ title: 'Admit Card Downloaded', message: `Seat ${ex.seatNo} confirmed for ${currentUser.name}`, type: 'success' })}
                        className="text-xs font-tech font-bold text-indigo-500 hover:text-indigo-600"
                      >
                        Download Admit Slip →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

          {/* ======================================================== */}
          {/* NOTES & REPOSITORY TAB (STEPPED FOLDERS)                 */}
          {/* ======================================================== */}
          {activeTab === 'notes' && (
            <div key="notes" className="space-y-8 animate-page-enter">
              <div>
                <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                  MODULE 05 · REPOSITORY
                </span>
                <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  Academic Lecture Archives
                </h2>
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Categorized course folders with slides, question banks, and lab exercises.
                </p>
              </div>

              {/* Search, Filter & Sort Toolbar (Shneiderman #1 Consistency & Nielsen #6 Recognition over Recall) */}
              <div className="space-y-4">
                {/* Resource Category Tabs: All Resources, Lecture Notes, PYQs, Mock Sample Papers */}
                {(() => {
                  const notesCount = notes.filter(n => n.category === 'Notes' || (!n.category && !n.id.includes('pyq') && !n.id.includes('mock'))).length;
                  const pyqCount = notes.filter(n => n.category === 'PYQ' || n.id.includes('pyq')).length;
                  const mockCount = notes.filter(n => n.category === 'Mock Paper' || n.id.includes('mock')).length;

                  return (
                    <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-current/10">
                      {[
                        { id: 'ALL', label: 'All Resources', count: notes.length, icon: '📚' },
                        { id: 'NOTES', label: 'Lecture Notes & Slides', count: notesCount, icon: '📖' },
                        { id: 'PYQ', label: 'Previous Years Papers (PYQs)', count: pyqCount, icon: '📝' },
                        { id: 'MOCK', label: 'Mock Sample Papers (2026)', count: mockCount, icon: '🎯' }
                      ].map(tab => {
                        const isSelected = libraryCategoryFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setLibraryCategoryFilter(tab.id as any)}
                            className={`px-4 py-2 rounded-2xl text-xs font-tech font-bold transition-all flex items-center gap-2 ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/30'
                                : darkMode
                                ? 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                              isSelected 
                                ? 'bg-white/20 text-white' 
                                : darkMode ? 'bg-white/10 text-slate-400' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {tab.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      type="text"
                      placeholder="Search question papers, subjects, blueprint, or solutions..."
                      value={librarySearch}
                      onChange={(e) => setLibrarySearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-indigo-500 transition-colors ${
                        darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <span className="text-xs font-tech font-bold opacity-60">Sort By:</span>
                    <select
                      value={librarySortBy}
                      onChange={(e) => setLibrarySortBy(e.target.value as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-tech font-bold border focus:outline-none ${
                        darkMode ? 'bg-[#141624] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="recent">Newest Uploads</option>
                      <option value="title">Alphabetical (Title A-Z)</option>
                      <option value="size">File Size (Largest)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                  {/* Format Filter Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-tech font-bold opacity-60 flex items-center gap-1 mr-1">
                      <Filter className="w-3.5 h-3.5" />
                      Format:
                    </span>
                    {(['ALL', 'PDF', 'PPT', 'DOC', 'CODE'] as const).map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setNoteTypeFilter(filterType)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-tech font-bold transition-all ${
                          noteTypeFilter === filterType
                            ? 'bg-indigo-600 text-white shadow-md scale-102'
                            : darkMode 
                            ? 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {filterType === 'ALL' ? 'All Formats' : filterType}
                      </button>
                    ))}
                  </div>

                  {/* Color Legend */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-tech opacity-80">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> PDF
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> PPT
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> DOC
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> CODE
                    </span>
                  </div>
                </div>
              </div>

              {/* Categorized Stepped Folders Grid */}
              {(() => {
                const filteredNotes = notes
                  .filter(note => {
                    // Category Filter (Notes vs PYQs vs Mock Papers)
                    if (libraryCategoryFilter === 'NOTES') {
                      const isNote = note.category === 'Notes' || (!note.category && !note.id.includes('pyq') && !note.id.includes('mock'));
                      if (!isNote) return false;
                    } else if (libraryCategoryFilter === 'PYQ') {
                      const isPyq = note.category === 'PYQ' || note.id.includes('pyq');
                      if (!isPyq) return false;
                    } else if (libraryCategoryFilter === 'MOCK') {
                      const isMock = note.category === 'Mock Paper' || note.id.includes('mock');
                      if (!isMock) return false;
                    }

                    const matchesType = noteTypeFilter === 'ALL' || note.type.toUpperCase() === noteTypeFilter;
                    const q = librarySearch.toLowerCase().trim();
                    const matchesSearch = !q ||
                      note.title.toLowerCase().includes(q) ||
                      note.subject.toLowerCase().includes(q) ||
                      note.unit.toLowerCase().includes(q) ||
                      note.uploadedBy.toLowerCase().includes(q) ||
                      (note.year && note.year.includes(q)) ||
                      (note.category && note.category.toLowerCase().includes(q));
                    return matchesType && matchesSearch;
                  })
                  .sort((a, b) => {
                    if (librarySortBy === 'title') return a.title.localeCompare(b.title);
                    if (librarySortBy === 'size') {
                      const parseMb = (sz: string) => {
                        const n = parseFloat(sz);
                        if (sz.includes('GB')) return n * 1024;
                        if (sz.includes('KB')) return n / 1024;
                        return n;
                      };
                      return parseMb(b.size) - parseMb(a.size);
                    }
                    return 0;
                  });

                if (filteredNotes.length === 0) {
                  return (
                    <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="font-display text-lg font-bold">No academic resources found</p>
                      <p className="text-xs opacity-60 mt-1">Try adjusting your search query or selecting 'All Resources'.</p>
                      <button
                        onClick={() => { setLibrarySearch(''); setNoteTypeFilter('ALL'); setLibraryCategoryFilter('ALL'); }}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-tech font-bold"
                      >
                        Reset All Resource Filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => {
                      const cardVariant = getFileTypeColor(note.type);
                      const isPyq = note.category === 'PYQ' || note.id.includes('pyq');
                      const isMock = note.category === 'Mock Paper' || note.id.includes('mock');

                      return (
                        <FolderCard
                          key={note.id}
                          variant={cardVariant}
                          tabLabel={isPyq ? `PYQ ${note.year || '2025'}` : isMock ? 'MOCK BLUEPRINT' : note.type}
                          tag={note.subject}
                          title={note.title}
                          metric={note.size}
                          metricSize="sm"
                          icon={<BookOpen className="w-5 h-5 opacity-80" />}
                          onClick={() => setActiveNoteModal(note)}
                          className="hover:-translate-y-2 transition-all duration-300"
                        >
                          <div className="flex flex-col gap-1.5 mt-2 font-tech">
                            <div className="flex items-center justify-between text-xs">
                              <span className="opacity-80">By {note.uploadedBy}</span>
                              {note.solutionsIncluded && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-[10px] font-bold border border-emerald-500/30">
                                  Solved ✓
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[11px] opacity-60">
                              <span>{note.unit}</span>
                              <span>{note.downloadCount} Downloads</span>
                            </div>
                          </div>
                        </FolderCard>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ======================================================== */}
          {/* CAMPUS EVENTS & RSVP TAB                                 */}
          {/* ======================================================== */}
          {activeTab === 'events' && (
            <div key="events" className="space-y-8 animate-page-enter">
              <div>
                <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                  MODULE 06 · CAMPUS LIFE
                </span>
                <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  Hackathons, Seminars & Competitions
                </h2>
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  One-click RSVP with instant student ticket generation.
                </p>
              </div>

              {/* Search & Category Filter Toolbar */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      type="text"
                      placeholder="Search events, clubs, venues, or hackathons..."
                      value={eventsSearch}
                      onChange={(e) => setEventsSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-indigo-500 transition-colors ${
                        darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'all', label: 'All Events' },
                      { id: 'hackathon', label: 'Hackathons' },
                      { id: 'seminar', label: 'Seminars' },
                      { id: 'cultural', label: 'Cultural' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setEventsCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold transition-all ${
                          eventsCategory === cat.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : darkMode
                            ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(() => {
                const filteredEvents = events.filter(evt => {
                  const q = eventsSearch.toLowerCase().trim();
                  const matchesSearch = !q ||
                    evt.title.toLowerCase().includes(q) ||
                    evt.description.toLowerCase().includes(q) ||
                    evt.venue.toLowerCase().includes(q) ||
                    evt.club.toLowerCase().includes(q);
                  if (!matchesSearch) return false;
                  if (eventsCategory === 'hackathon') {
                    return evt.title.toLowerCase().includes('hack') || evt.club.toLowerCase().includes('code');
                  }
                  if (eventsCategory === 'seminar') {
                    return evt.title.toLowerCase().includes('seminar') || evt.title.toLowerCase().includes('ai') || evt.description.toLowerCase().includes('guest');
                  }
                  if (eventsCategory === 'cultural') {
                    return evt.title.toLowerCase().includes('fest') || evt.club.toLowerCase().includes('cultural');
                  }
                  return true;
                });

                if (filteredEvents.length === 0) {
                  return (
                    <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="font-display text-lg font-bold">No campus events found</p>
                      <p className="text-xs opacity-60 mt-1">Try searching for other student activities or clear filters.</p>
                      <button
                        onClick={() => { setEventsSearch(''); setEventsCategory('all'); }}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-tech font-bold"
                      >
                        Reset Event Search
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredEvents.map(evt => (
                      <div
                        key={evt.id}
                        className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between hover:-translate-y-1.5 transition-all ${
                          darkMode ? 'bg-[#141624] border-white/10 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-tech text-xs font-bold leading-none text-center">
                              <span className="block text-sm">{evt.day}</span>
                              <span className="text-[9px] uppercase tracking-wider">{evt.month}</span>
                            </div>
                            <span className="text-[11px] opacity-60 font-tech">{evt.time}</span>
                          </div>

                          <h4 className={`font-display text-xl font-bold ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {evt.title}
                          </h4>

                          <p className={`text-xs mt-2 line-clamp-2 ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {evt.description}
                          </p>

                          <p className="text-xs text-indigo-500 mt-3 flex items-center gap-1.5 font-tech font-semibold">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{evt.venue} • {evt.club}</span>
                          </p>
                        </div>

                        <div className="mt-6 space-y-2">
                          <button
                            onClick={() => toggleEventRSVP(evt.id)}
                            className={`w-full py-2.5 rounded-xl text-xs font-tech font-bold transition-all ${
                              evt.registered
                                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                            }`}
                          >
                            {evt.registered ? 'RSVP Confirmed ✓' : 'Register / RSVP →'}
                          </button>

                          {evt.registered && (
                            <button
                              onClick={() => setActiveTicketModal(evt)}
                              className="w-full py-1.5 text-xs text-indigo-500 hover:underline font-tech font-semibold flex items-center justify-center gap-1.5"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              <span>View Digital Event Pass</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ======================================================== */}
          {/* ANNOUNCEMENTS TAB                                        */}
          {/* ======================================================== */}
          {activeTab === 'announcements' && (
            <div key="announcements" className="space-y-8 animate-page-enter">
              <div>
                <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                  MODULE 07 · NOTICES
                </span>
                <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  Official College Bulletins
                </h2>
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Centralized academic notices, exam circulars, and departmental updates.
                </p>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      type="text"
                      placeholder="Search notices, circulars, exam notices, or authors..."
                      value={noticesSearch}
                      onChange={(e) => setNoticesSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-indigo-500 transition-colors ${
                        darkMode ? 'bg-white/5 border-white/10 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>

                  {/* Filter Category Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'all', label: 'All Notices' },
                      { id: 'unread', label: 'Unread Only' },
                      { id: 'academic', label: 'Academic / Exams' },
                      { id: 'placement', label: 'Placement & Industry' }
                    ].map(flt => (
                      <button
                        key={flt.id}
                        onClick={() => setNoticesFilter(flt.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-tech font-bold transition-all ${
                          noticesFilter === flt.id
                            ? 'bg-indigo-600 text-white shadow-md'
                            : darkMode
                            ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {flt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(() => {
                const filteredAnnouncements = announcements.filter(ann => {
                  const q = noticesSearch.toLowerCase().trim();
                  const matchesSearch = !q ||
                    ann.title.toLowerCase().includes(q) ||
                    ann.content.toLowerCase().includes(q) ||
                    ann.author.toLowerCase().includes(q) ||
                    ann.category.toLowerCase().includes(q);
                  if (!matchesSearch) return false;
                  if (noticesFilter === 'unread') return !ann.isRead;
                  if (noticesFilter === 'academic') {
                    return ann.category.toLowerCase().includes('academic') || ann.category.toLowerCase().includes('exam');
                  }
                  if (noticesFilter === 'placement') {
                    return ann.category.toLowerCase().includes('placement') || ann.category.toLowerCase().includes('industry') || ann.category.toLowerCase().includes('hackathon');
                  }
                  return true;
                });

                if (filteredAnnouncements.length === 0) {
                  return (
                    <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="font-display text-lg font-bold">No college bulletins found</p>
                      <p className="text-xs opacity-60 mt-1">Try clearing your search term or selecting 'All Notices'.</p>
                      <button
                        onClick={() => { setNoticesSearch(''); setNoticesFilter('all'); }}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-tech font-bold"
                      >
                        Reset Bulletin Filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3.5">
                    {filteredAnnouncements.map(ann => (
                      <div
                        key={ann.id}
                        onClick={() => markAnnouncementAsRead(ann.id)}
                        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-colors shadow-sm hover:-translate-y-1 ${
                          darkMode ? 'bg-[#141624] border-white/10 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-tech uppercase font-bold px-2 py-0.5 rounded border ${
                              darkMode ? 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30' : 'text-indigo-600 bg-indigo-50 border-indigo-200'
                            }`}>
                              {ann.category}
                            </span>
                            <span className="text-xs opacity-50 font-tech">{ann.relativeTime}</span>
                            {!ann.isRead && (
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                            )}
                          </div>

                          <h4 className={`font-display text-lg font-bold ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {ann.title}
                          </h4>

                          <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {ann.content}
                          </p>
                        </div>

                        <span className="text-xs opacity-60 shrink-0 self-end sm:self-center font-tech font-semibold">
                          {ann.author}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ======================================================== */}
          {/* PROFILE & SETTINGS TAB (EXCLUSIVE TO CURRENT USER)       */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div key="profile" className="space-y-8 animate-page-enter">
              <div>
                <span className="text-[10px] font-tech uppercase text-indigo-500 tracking-widest font-bold">
                  MODULE 08 · STUDENT PROFILE & IDENTITY
                </span>
                <h2 className={`text-3xl sm:text-4xl font-display font-black mt-1 ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  My Scholar Credentials & Security
                </h2>
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Verified student passport for SVKM's NMIMS MPSTME academic sessions.
                </p>
              </div>

              {/* Personal Student Card */}
              <div className={`p-8 rounded-3xl border shadow-xl space-y-8 ${
                darkMode ? 'bg-[#141624] border-white/10' : 'bg-white border-slate-200'
              }`}>
                
                {/* Header Identity Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-current/10">
                  <div className="flex items-center gap-5">
                    <div 
                      onClick={() => setAvatarModalOpen(true)}
                      className="relative cursor-pointer group shrink-0"
                      title="Click to upload or choose a new profile picture"
                    >
                      <SafeAvatar 
                        src={currentUser.avatar} 
                        alt={currentUser.name} 
                        className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/40 group-hover:opacity-75 transition-opacity shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-display text-2xl sm:text-3xl font-black ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {currentUser.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 text-[10px] font-tech font-bold uppercase">
                          Verified Scholar
                        </span>
                      </div>
                      
                      <p className="text-xs text-indigo-500 font-tech font-semibold mt-1">
                        SAP ID: {currentUser.sapId} • Roll: {currentUser.rollNo}
                      </p>
                      <p className={`text-xs mt-0.5 ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {currentUser.college} • {currentUser.program}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAvatarModalOpen(true)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-tech font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </button>
                    
                    <button
                      onClick={logout}
                      className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-xl text-xs font-tech font-bold transition-all flex items-center gap-1.5"
                      title="Sign out of account"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                {/* Academic Metrics Grid */}
                <div>
                  <h4 className="text-xs font-tech uppercase font-bold opacity-80 mb-4">
                    Current Semester Standing (Semester VII):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] opacity-60 font-tech uppercase">Overall Attendance</span>
                      <p className="text-2xl font-display font-black text-blue-500 mt-1">{overallAttendance}%</p>
                      <span 
                        title="Fewest classes you can miss in any subject while maintaining the 75% threshold (lowest safe margin across all enrolled courses)"
                        className="text-[10px] text-emerald-500 font-tech font-bold cursor-help flex items-center gap-1"
                      >
                        <span>+2 Safe Bunks</span>
                        <span className="text-[9px] opacity-75">ℹ️</span>
                      </span>
                      <span className="text-[9px] opacity-60 font-tech block">Lowest safe margin</span>
                    </div>

                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] opacity-60 font-tech uppercase">Division / Batch</span>
                      <p className="text-2xl font-display font-black text-indigo-500 mt-1">Div {currentUser.section}</p>
                      <span className="text-[10px] opacity-60 font-tech">AI & Data Science</span>
                    </div>

                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] opacity-60 font-tech uppercase">Pending Tasks</span>
                      <p className="text-2xl font-display font-black text-amber-500 mt-1">{pendingTasks.length}</p>
                      <span className="text-[10px] opacity-60 font-tech">Coursework Items</span>
                    </div>

                    <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="text-[10px] opacity-60 font-tech uppercase">Next Exam</span>
                      <p className="text-2xl font-display font-black text-purple-500 mt-1">{nextExamDaysLeft} Days</p>
                      <span className="text-[10px] opacity-60 font-tech">{nextExam?.subject || 'HCI'} • {nextExam?.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Settings & Accessibility Controls */}
                <div className="pt-2 border-t border-current/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <p className={`font-display font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Interface Theme</p>
                      <p className="opacity-60 text-[11px] font-tech">Switch dark obsidian / light alabaster</p>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`px-3.5 py-1.5 rounded-xl font-tech font-bold text-xs transition-colors ${
                        darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <p className={`font-display font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Undo Action Window</p>
                      <p className="opacity-60 text-[11px] font-tech">Shneiderman Rule #6 tolerance ({undoWindowSeconds}s)</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {([6, 10, 15] as const).map(sec => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => {
                            setUndoWindowSeconds(sec);
                            addToast({ title: 'Undo Window Updated', message: `Tolerance set to ${sec} seconds`, type: 'info' });
                          }}
                          className={`px-2.5 py-1 rounded-xl text-xs font-tech font-bold transition-all ${
                            undoWindowSeconds === sec
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-current/10 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {sec}s {sec === 10 && '★'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Account Security & Credential Protection */}
                <div className={`p-6 sm:p-7 rounded-3xl border ${
                  darkMode ? 'bg-[#181B2B] border-white/10' : 'bg-slate-50 border-slate-200'
                } space-y-6`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-current/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-bold">
                          Account Security & Two-Step Verification
                        </h4>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Manage login password, multi-factor authentication, and verified devices.
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-tech font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 self-start sm:self-auto flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>NMIMS SSO VERIFIED</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Password Update Form */}
                    <div className={`p-5 rounded-2xl border ${
                      darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <h5 className="font-display font-bold text-sm mb-1 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span>Update Scholar Password</span>
                      </h5>
                      <p className="text-[11px] opacity-60 mb-4">
                        Ensure passwords contain minimum 6 characters with numbers and symbols.
                      </p>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!currPassword) {
                            addToast({ title: 'Validation Error', message: 'Please enter your current password.', type: 'warning' });
                            return;
                          }
                          if (newPassword.length < 6) {
                            addToast({ title: 'Weak Password', message: 'New password must have at least 6 characters.', type: 'warning' });
                            return;
                          }
                          if (newPassword !== confirmPassword) {
                            addToast({ title: 'Mismatch', message: 'New password and confirmation do not match.', type: 'warning' });
                            return;
                          }
                          setCurrPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          addToast({ title: 'Password Updated', message: 'Your scholar password has been securely updated.', type: 'success' });
                        }}
                        className="space-y-3 text-xs"
                      >
                        <div>
                          <label className="block text-[11px] font-tech font-bold opacity-75 mb-1">Current Password</label>
                          <input
                            type="password"
                            placeholder="Enter current password"
                            value={currPassword}
                            onChange={(e) => setCurrPassword(e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${
                              darkMode ? 'bg-[#141624] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-tech font-bold opacity-75 mb-1">New Password</label>
                            <input
                              type="password"
                              placeholder="New password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${
                                darkMode ? 'bg-[#141624] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-tech font-bold opacity-75 mb-1">Confirm Password</label>
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 ${
                                darkMode ? 'bg-[#141624] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                              }`}
                            />
                          </div>
                        </div>
                        <div className="pt-1 text-right">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-tech font-bold transition-all shadow-md"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Two-Factor Authentication & Active Sessions */}
                    <div className="space-y-4">
                      {/* 2FA Toggle */}
                      <div className={`p-5 rounded-2xl border ${
                        darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-display font-bold text-sm flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-indigo-500" />
                            <span>Two-Factor Authentication (2FA)</span>
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              const next = !twoFactorActive;
                              setTwoFactorActive(next);
                              addToast({
                                title: next ? '2FA Activated' : '2FA Deactivated',
                                message: next 
                                  ? `Two-step verification now protects ${currentUser.email}`
                                  : 'Two-factor protection disabled.',
                                type: next ? 'success' : 'info'
                              });
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-tech font-bold transition-all ${
                              twoFactorActive 
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {twoFactorActive ? 'Enabled ✓' : 'Enable 2FA'}
                          </button>
                        </div>
                        <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Requires an authentication code sent to your registered NMIMS email ({currentUser.email}) on unrecognized browser logins.
                        </p>
                      </div>

                      {/* Active Session & Device Audit */}
                      <div className={`p-5 rounded-2xl border ${
                        darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-display font-bold text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span>Active Scholar Session</span>
                          </h5>
                          <span className="text-[10px] font-tech text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Current Device
                          </span>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          macOS (Apple Silicon) • Campus Network (IP: 103.21.124.8)
                        </p>
                        <div className="mt-3 pt-3 border-t border-current/10 flex items-center justify-between text-xs">
                          <span className="text-[11px] opacity-60 font-tech">Signed in 2 hours ago</span>
                          <button
                            type="button"
                            onClick={() => addToast({ title: 'Sessions Revoked', message: 'All other browser sessions terminated.', type: 'info' })}
                            className="text-[11px] font-tech font-bold text-rose-500 hover:text-rose-600"
                          >
                            Revoke Other Sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: CREATE TASK                                       */}
      {/* ======================================================== */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`${
            darkMode ? 'bg-[#141624] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
          } border rounded-3xl max-w-md w-full p-6 shadow-2xl`}>
            <h3 className="text-xl font-display font-bold mb-4">
              Add New Academic Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block opacity-80 font-tech font-bold mb-1">Task Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Heuristic Evaluation Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block opacity-80 font-tech font-bold mb-1">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    darkMode ? 'bg-[#1A1D2C] border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Human Computer Interaction">Human Computer Interaction</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Mining">Data Mining</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block opacity-80 font-tech font-bold mb-1">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2 rounded-xl border text-xs font-tech font-bold transition-all ${
                        newPriority === p ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-current/5 opacity-60 border-current/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 opacity-60 hover:opacity-100 font-tech font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-tech font-bold rounded-xl shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SUBMISSION UPLOADER                               */}
      {/* ======================================================== */}
      <AssignmentUploadModal 
        assignment={targetAssignment}
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setTargetAssignment(null);
        }}
        onSubmitted={handleAssignmentSubmitted}
      />

      {/* ======================================================== */}
      {/* MODAL: NOTE QUICK PREVIEW                                */}
      {/* ======================================================== */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`${
            darkMode ? 'bg-[#141624] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
          } border rounded-3xl max-w-lg w-full p-6 shadow-2xl`}>
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-tech uppercase font-bold px-2.5 py-0.5 rounded border ${
                  activeNoteModal.category === 'PYQ'
                    ? 'text-purple-400 bg-purple-950/60 border-purple-500/40'
                    : activeNoteModal.category === 'Mock Paper'
                    ? 'text-amber-400 bg-amber-950/60 border-amber-500/40'
                    : 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30'
                }`}>
                  {activeNoteModal.category === 'PYQ' ? `PYQ ${activeNoteModal.year || '2025'}` : activeNoteModal.category === 'Mock Paper' ? '2026 MOCK BLUEPRINT' : activeNoteModal.type}
                </span>
                <span className="text-xs opacity-60 font-tech">
                  {activeNoteModal.size} • {activeNoteModal.type}
                </span>
              </div>
              <button 
                onClick={() => setActiveNoteModal(null)}
                className="opacity-60 hover:opacity-100 p-1"
                title="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-display font-bold leading-snug">
              {activeNoteModal.title}
            </h3>
            <p className="text-xs text-indigo-500 font-tech mt-1">
              Course: <strong>{activeNoteModal.subject}</strong> · Contributor: {activeNoteModal.uploadedBy}
            </p>

            {/* Paper Details / Exam Blueprint */}
            {(activeNoteModal.category === 'PYQ' || activeNoteModal.category === 'Mock Paper' || activeNoteModal.id.includes('pyq') || activeNoteModal.id.includes('mock')) ? (
              <div className={`my-4 p-4 rounded-2xl border text-xs space-y-3 ${
                darkMode ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-current/10">
                  <span className="font-tech font-bold uppercase tracking-wider text-[11px] text-indigo-400">
                    MPSTME Semester VII Exam Blueprint
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-[10px] font-bold border border-emerald-500/30">
                    Model Solutions Included ✓
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] font-tech">
                  <div className="flex items-start justify-between gap-2">
                    <span className="opacity-80">Section A (20 Marks):</span>
                    <span className="font-semibold text-right">Conceptual definitions & Short problems</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="opacity-80">Section B (40 Marks):</span>
                    <span className="font-semibold text-right">Analytical derivations & Design proofs</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="opacity-80">Section C (40 Marks):</span>
                    <span className="font-semibold text-right">Case studies & System architecture blueprints</span>
                  </div>
                </div>

                <p className="text-[10px] opacity-60 font-tech pt-1 border-t border-current/10">
                  Total Weightage: 100 Marks (3h) • Curated by Department Review Board
                </p>
              </div>
            ) : (
              <div className={`my-4 p-4 rounded-2xl border text-xs space-y-2 ${
                darkMode ? 'bg-white/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <p>This repository item contains complete slide decks, chapter reviews, and exam preparation summaries compiled for Semester VII AI & DS.</p>
                <p className="text-[11px] opacity-75 font-tech">Module: {activeNoteModal.unit} • Verified NMIMS Academic Syllabus Standard.</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveNoteModal(null)}
                className="px-4 py-2 opacity-60 hover:opacity-100 text-xs font-tech font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToast({ 
                    title: 'Download Initialized 📥', 
                    message: `Downloaded "${activeNoteModal.title}" (${activeNoteModal.size}).`, 
                    type: 'success' 
                  });
                  setActiveNoteModal(null);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-tech font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Paper ({activeNoteModal.type})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DIGITAL EVENT PASS TICKET                         */}
      {/* ======================================================== */}
      {activeTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`${
            darkMode ? 'bg-[#141624] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
          } border rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden`}>
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <span className="text-[10px] font-tech uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                OFFICIAL ENTRY PASS
              </span>
              <button 
                onClick={() => setActiveTicketModal(null)}
                className="opacity-60 hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mx-auto flex items-center justify-center text-indigo-500">
                <Ticket className="w-8 h-8" />
              </div>

              <h4 className="font-display text-xl font-bold">
                {activeTicketModal.title}
              </h4>
              <p className="text-xs opacity-75 font-sans">
                {activeTicketModal.venue} • {activeTicketModal.day} {activeTicketModal.month} at {activeTicketModal.time}
              </p>

              {/* QR Code Graphic */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-inner my-2">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>

              <div className="text-[11px] font-tech opacity-70">
                PASS ID: NMIMS-HACK-{currentUser.sapId}
                <div className="font-bold mt-0.5">{currentUser.name} (Roll: {currentUser.rollNo})</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between text-xs">
              <span className="opacity-60 font-tech">NMIMS MPSTME</span>
              <button
                onClick={() => {
                  addToast({ title: 'Pass Saved', message: 'Digital pass saved to Apple Wallet / Google Pay mock pass.', type: 'success' });
                  setActiveTicketModal(null);
                }}
                className="text-indigo-500 hover:text-indigo-600 font-tech font-bold"
              >
                Save to Device →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ACCESSIBILITY PREFERENCES & UNIVERSAL USABILITY   */}
      {/* ======================================================== */}
      {accessibilityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`${
            darkMode ? 'bg-[#141624] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200 shadow-2xl'
          } border rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-6`}>
            
            <div className="flex items-center justify-between pb-3 border-b border-current/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">Universal Accessibility</h3>
                  <p className="text-[11px] opacity-60 font-tech">Shneiderman Rule #2 · Universal Usability & Reversal</p>
                </div>
              </div>
              <button 
                onClick={() => setAccessibilityModalOpen(false)}
                className="opacity-60 hover:opacity-100 p-1 rounded-lg"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs">
              {/* Text Size Scaling */}
              <div>
                <label className="font-tech font-bold uppercase tracking-wider opacity-75 block mb-2">
                  Typography Text Scale
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['normal', 'large', 'xlarge'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setTextSize(size)}
                      className={`p-3 rounded-2xl border font-tech font-bold text-center transition-all ${
                        textSize === size
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-102'
                          : darkMode
                          ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-sm capitalize">{size}</span>
                      <span className="text-[10px] opacity-75">
                        {size === 'normal' ? '100% Standard' : size === 'large' ? '115% Legible' : '130% Maximum'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast Mode Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-current/10 bg-current/5">
                <div>
                  <div className="font-bold font-display text-sm flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>High Contrast Mode</span>
                  </div>
                  <p className="text-[11px] opacity-60 mt-0.5">
                    Pure black/white theme with enhanced border visibility for low-vision users
                  </p>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`px-4 py-1.5 rounded-xl font-tech font-bold transition-all ${
                    highContrast 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {highContrast ? 'Enabled ✓' : 'Disabled'}
                </button>
              </div>

              {/* Reduce Motion Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-current/10 bg-current/5">
                <div>
                  <div className="font-bold font-display text-sm flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <span>Reduce Motion (Vestibular Comfort)</span>
                  </div>
                  <p className="text-[11px] opacity-60 mt-0.5">
                    Disables floating keyframes and scale transitions for vestibular sensitivity
                  </p>
                </div>
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`px-4 py-1.5 rounded-xl font-tech font-bold transition-all ${
                    reduceMotion 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {reduceMotion ? 'Enabled ✓' : 'Disabled'}
                </button>
              </div>

              {/* Dyslexia-Friendly Typography Font */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-current/10 bg-current/5">
                <div>
                  <div className="font-bold font-display text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Dyslexia-Friendly Font & Letter Spacing</span>
                  </div>
                  <p className="text-[11px] opacity-60 mt-0.5">
                    Applies increased character tracking and distinct letter weighting for reading ease
                  </p>
                </div>
                <button
                  onClick={() => setDyslexiaFont(!dyslexiaFont)}
                  className={`px-4 py-1.5 rounded-xl font-tech font-bold transition-all ${
                    dyslexiaFont 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {dyslexiaFont ? 'Enabled ✓' : 'Disabled'}
                </button>
              </div>

              {/* Color-Blind Safe Palette */}
              <div>
                <label className="font-tech font-bold uppercase tracking-wider opacity-75 block mb-1">
                  Color-Blind Safe Palette
                </label>
                <p className="text-[11px] opacity-60 mb-2">
                  Adapts status indicators with shape cues and high-contrast color gamuts (WCAG AA)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'Standard' },
                    { id: 'protanopia', label: 'Protanopia' },
                    { id: 'deuteranopia', label: 'Deuteranopia' },
                    { id: 'highContrast', label: 'Monochrome' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      onClick={() => setColorBlindMode(mode.id as any)}
                      className={`p-2.5 rounded-xl border font-tech font-bold text-center text-xs transition-all ${
                        colorBlindMode === mode.id
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                          : darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Reversal & Undo Duration */}
              <div>
                <label className="font-tech font-bold uppercase tracking-wider opacity-75 block mb-1">
                  Action Reversal Window (Undo Buffer)
                </label>
                <p className="text-[11px] opacity-60 mb-2">
                  Shneiderman Rule #6 · Controls how long toast notifications stay open for single-click undo
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {([6, 10, 15] as const).map((secs) => (
                    <button
                      key={secs}
                      onClick={() => {
                        setUndoWindowSeconds(secs);
                        addToast({ title: 'Preferences Updated', message: `Undo window set to ${secs} seconds`, type: 'info' });
                      }}
                      className={`p-2.5 rounded-2xl border font-tech font-bold text-center transition-all ${
                        undoWindowSeconds === secs
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : darkMode
                          ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {secs} Seconds {secs === 10 && '(Default)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link to HCI Evaluation */}
              <div className="pt-2 border-t border-current/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setAccessibilityModalOpen(false);
                    setHciModalOpen(true);
                  }}
                  className="text-xs font-tech font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Review Norman & Nielsen Frameworks →</span>
                </button>

                <button
                  onClick={() => {
                    setTextSize('normal');
                    setHighContrast(false);
                    setReduceMotion(false);
                    setDyslexiaFont(false);
                    setColorBlindMode('none');
                    setUndoWindowSeconds(10);
                    addToast({ title: 'Defaults Restored', message: 'Accessibility preferences reset to initial values.', type: 'info' });
                  }}
                  className="text-[11px] font-tech opacity-60 hover:opacity-100 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setAccessibilityModalOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-tech font-bold text-xs shadow-md"
              >
                Apply & Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Picture Uploader Modal */}
      <AvatarUploaderModal />
    </div>
  );
};
