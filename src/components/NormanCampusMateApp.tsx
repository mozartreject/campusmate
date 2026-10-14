import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  Brain, 
  Briefcase, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  UserCheck, 
  FileCheck2, 
  BookOpen, 
  Megaphone, 
  Settings, 
  Bell, 
  Camera, 
  Award, 
  Sliders, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  X,
  Target,
  BarChart3,
  Heart,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Flame,
  Activity,
  Layers,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvatarUploaderModal } from './AvatarUploaderModal';

interface GoalOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  normanPrinciple: string;
}

export const NormanCampusMateApp: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    setCurrentUser,
    overallAttendance, 
    attendanceRecords,
    attendanceTarget,
    setAttendanceTarget,
    logClassAttendance,
    timetable,
    assignments,
    toggleAssignmentComplete,
    exams,
    announcements,
    events,
    toggleEventRSVP,
    notes,
    addToast,
    setAvatarModalOpen,
    darkMode,
    setDarkMode,
    setHciModalOpen
  } = useApp();

  // Wizard Step (0: Goal Selection matching image, 1: Timetable & Schedule, 2: Attendance Bunk Engine, 3: Deadlines & Tasks)
  const [currentStep, setCurrentStep] = useState<number>(1); // Step 1 is Goal Selection as in screenshot (Question 06 of 12)
  const [selectedGoalId, setSelectedGoalId] = useState<string>('goal-attendance');
  
  // Navigation dock state
  const [activeDockTab, setActiveDockTab] = useState<'home' | 'timetable' | 'coach' | 'progress' | 'profile'>('home');
  const [normanModalOpen, setNormanModalOpen] = useState<boolean>(false);

  // 6 Academic Goals matching the 3x2 grid in the user's reference image
  const goals: GoalOption[] = [
    {
      id: 'goal-attendance',
      title: 'Maintain 75%+ Attendance',
      description: 'Avoid NMIMS default list and calculate safe bunks',
      icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
      category: 'Academic Safety',
      normanPrinciple: 'Signifier & Feedback: Clear visual indicator with status threshold'
    },
    {
      id: 'goal-exams',
      title: 'Ace Mid-Term Examinations',
      description: 'Target GPA > 3.7 with countdowns & hall venues',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600" />,
      category: 'Excellence',
      normanPrinciple: 'Affordance: Actionable checklist for exam prep'
    },
    {
      id: 'goal-deadlines',
      title: 'Submit Tasks on Time',
      description: 'Prioritize High, Medium, Low assignments',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      category: 'Time Management',
      normanPrinciple: 'Constraint & Mapping: Prioritization by urgency'
    },
    {
      id: 'goal-events',
      title: 'Active Campus Life',
      description: 'Hackathons, technical workshops & sports meets',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      category: 'Engagement',
      normanPrinciple: 'Discoverability: One-click RSVP without scattered notices'
    },
    {
      id: 'goal-stress',
      title: 'Reduce Cognitive Overload',
      description: 'Single centralized dashboard instead of 6 apps',
      icon: <Brain className="w-5 h-5 text-rose-500" />,
      category: 'Mental Wellbeing',
      normanPrinciple: 'Conceptual Model: Cohesive mental model of daily priorities'
    },
    {
      id: 'goal-career',
      title: 'Placement & Industry Skills',
      description: 'Capstone project, ML repositories & internships',
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      category: 'Career Readiness',
      normanPrinciple: 'Tolerance for Error: Reversible task states & undo actions'
    }
  ];

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  const handleSelectGoal = (id: string) => {
    setSelectedGoalId(id);
    addToast({
      title: 'Focus Goal Selected',
      message: `Configured CampusMate to prioritize "${goals.find(g => g.id === id)?.title}".`,
      type: 'info'
    });
  };

  const handleNext = () => {
    if (activeDockTab === 'home') {
      setActiveDockTab('progress');
    } else if (activeDockTab === 'progress') {
      setActiveDockTab('timetable');
    } else {
      setActiveDockTab('home');
    }

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3B82F6', '#60A5FA', '#93C5FD']
      });
    } catch {}
  };

  const handleBack = () => {
    if (activeDockTab === 'timetable') setActiveDockTab('progress');
    else if (activeDockTab === 'progress') setActiveDockTab('home');
    else setActiveDockTab('home');
  };

  // Norman's 7 Principles Documentation
  const normansPrinciples = [
    {
      num: 1,
      title: 'Discoverability',
      desc: 'It is possible to determine what actions are possible and the current state of the device.',
      campusMateApp: 'Prominent 3x2 selection grid with hover elevations, explicit status pills ("In Session", "Safe Standing"), and unmistakable clickable affordances.',
      uiRef: 'Goal Selection Grid & Status Cards'
    },
    {
      num: 2,
      title: 'Feedback',
      desc: 'There is full and continuous information about the results of actions and the current state.',
      campusMateApp: 'Selecting a card instantly turns the border vibrant blue with an animated checkmark; marking an assignment done triggers celebratory confetti and an interactive Undo toast.',
      uiRef: 'Card Selection State & Toast Notifications'
    },
    {
      num: 3,
      title: 'Conceptual Model',
      desc: 'The design projects all information needed to create a good conceptual model, giving understanding and control.',
      campusMateApp: 'Students select an academic goal on the left, and the right ambient panel immediately shows their personalized roadmap and active summary cards.',
      uiRef: 'Split-Screen Layout (Left: Inputs, Right: Outcomes)'
    },
    {
      num: 4,
      title: 'Affordances',
      desc: 'The proper affordances exist to make the desired actions possible.',
      campusMateApp: 'Buttons look distinctly pushable with pills, rounded corners, drop shadows, and active states. Radio circles invite clicking.',
      uiRef: 'Radio selection rings, Back & Next action pills'
    },
    {
      num: 5,
      title: 'Signifiers',
      desc: 'Signifiers communicate where the action should take place (icons, labels, chevrons).',
      campusMateApp: 'Blue checkmark badge on selected items, empty radio circles on unselected items, arrow icons on action buttons, and camera icon on profile avatars.',
      uiRef: 'Checkmark badges, Radio indicators, Iconography'
    },
    {
      num: 6,
      title: 'Mappings',
      desc: 'The relationship between controls and their actions in the world is natural and intuitive.',
      campusMateApp: '"Back" is located on the left and "Next" on the right matching cultural reading order; attendance colors map intuitively (Green = Safe >=75%, Red = Shortage <75%).',
      uiRef: 'Stepper controls & traffic light attendance gauges'
    },
    {
      num: 7,
      title: 'Constraints',
      desc: 'Physical, logical, semantic, and cultural constraints guide action and ease interpretation.',
      campusMateApp: 'Single-selection constraint enforces picking one primary focus at a time; disabled next states when inputs are invalid; confirmation modals prevent accidental sign-outs.',
      uiRef: 'Single-select radio group & Confirmation dialogs'
    }
  ];

  return (
    <div className="min-h-screen bg-[#DDE7F5] p-3 sm:p-6 md:p-10 flex items-center justify-center font-sans antialiased text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Outer Device / Bezel Wrapper matching the user's reference image */}
      <div className="w-full max-w-7xl bg-[#0F1117] rounded-[36px] sm:rounded-[44px] p-2.5 sm:p-4 shadow-2xl border-4 border-slate-800/80 flex flex-col justify-between overflow-hidden relative">
        
        {/* ======================================================== */}
        {/* MAIN VIEWPORT: SPLIT SCREEN (LEFT: WIZARD / RIGHT: AMBIENT) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1">
          
          {/* ------------------------------------------------------ */}
          {/* LEFT HALF: INTERACTIVE QUIZ & WORKFLOW (COLS 7) */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-4">
            
            {/* Top Row: 3 Status Cards matching reference image */}
            <div className="grid grid-cols-12 gap-2.5 sm:gap-3">
              
              {/* Card 1 (Wide): Fitness / Academic Plan Card */}
              <div className="col-span-6 sm:col-span-6 bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full w-max">
                  ACADEMIC SETUP
                </span>
                <div className="mt-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    Find your <span className="text-blue-600 italic font-serif">perfect</span> plan
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Answer a few questions to calibrate your companion.
                  </p>
                </div>
              </div>

              {/* Card 2: Question / Semester Counter */}
              <div className="col-span-3 sm:col-span-3 bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                  Semester
                </span>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600 leading-none">
                    07
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    of 08
                  </span>
                </div>
              </div>

              {/* Card 3: Type / Program */}
              <div className="col-span-3 sm:col-span-3 bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                  Program
                </span>
                <div>
                  <span className="text-lg sm:text-xl font-black text-blue-600 leading-none truncate block">
                    AI & DS
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    Div A • NMIMS
                  </span>
                </div>
              </div>
            </div>

            {/* Main Interactive Card: "What do you want to achieve?" */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-100 flex-1 flex flex-col justify-between">
              
              <div>
                {/* Header Tag + Title matching reference layout */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase block mb-1">
                      CHOOSE YOUR ACADEMIC FOCUS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                      What do you want<br/>to achieve?
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Select the option that best fits your current motivation or academic goal.
                    </p>
                  </div>

                  {/* 3D Target Dartboard Illustration from reference image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative shrink-0 hidden sm:flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-blue-50/80 border-4 border-blue-100 flex items-center justify-center shadow-inner relative">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-200 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-blue-600 shadow-md flex items-center justify-center">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      {/* Arrow doodle */}
                      <div className="absolute -top-1 -right-1 w-6 h-6 text-blue-600 transform rotate-45">
                        ➔
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6 Selectable Options in 3x2 Grid matching reference image */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
                  {goals.map((g) => {
                    const isSelected = selectedGoalId === g.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => handleSelectGoal(g.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[110px] sm:min-h-[125px] ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20'
                            : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {g.icon}
                          </div>

                          {/* Radio Ring / Checkmark Badge matching reference image */}
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                            {g.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                            {g.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Bar inside the Card matching reference image */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setNormanModalOpen(true)}
                  className="text-xs font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Inspect 7 Norman's Principles</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors shadow-2xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* RIGHT HALF: ETHEREAL AMBIENT BLUE PANEL (COLS 5) */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[480px] bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1E3A8A] text-white shadow-xl">
            
            {/* Ambient Background Aura & Student Silhouette */}
            <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
              <svg viewBox="0 0 400 600" className="w-full h-full object-cover">
                <circle cx="200" cy="150" r="160" fill="url(#ethereal-grad)" filter="blur(40px)" />
                <defs>
                  <radialGradient id="ethereal-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
                    <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            {/* Silhouette / Student Art Overlay matching the posture in reference photo */}
            <div className="absolute right-0 bottom-10 w-64 h-80 opacity-30 pointer-events-none">
              <svg viewBox="0 0 200 300" className="w-full h-full fill-white">
                <circle cx="100" cy="60" r="28" />
                <path d="M70,95 Q100,80 130,95 L145,170 Q150,220 130,280 L70,280 Q50,220 55,170 Z" />
                <path d="M125,100 L170,40 Q180,35 185,50 L140,120 Z" />
              </svg>
            </div>

            {/* Top Tag: AI / Companion Learning */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-medium border border-white/20 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>CampusMate is optimizing your semester</span>
              </div>
            </div>

            {/* Middle Big Title matching reference image */}
            <div className="relative z-10 my-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                CAMPUSMATE 2026
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 leading-tight tracking-tight">
                Your goals.<br/>Our plan.
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-2 max-w-xs leading-relaxed">
                A human-centered student companion replacing 6+ fragmented portals, built strictly on Norman's 7 Principles.
              </p>
            </div>

            {/* Bottom Row: 3 Frosted Glass Summary Cards matching reference image */}
            <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3">
              
              {/* Glass Card 1: Goal */}
              <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex flex-col justify-between min-h-[95px]">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white mb-1">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">Goal</h4>
                  <p className="text-[10px] text-blue-100 truncate mt-0.5">
                    {selectedGoal.title.split(' ')[0]} {selectedGoal.title.split(' ')[1]}
                  </p>
                </div>
              </div>

              {/* Glass Card 2: Attendance / Status */}
              <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex flex-col justify-between min-h-[95px]">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white mb-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">Attendance</h4>
                  <p className="text-[10px] text-blue-100 truncate mt-0.5">
                    {overallAttendance}% (Safe)
                  </p>
                </div>
              </div>

              {/* Glass Card 3: Preferences / Focus */}
              <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex flex-col justify-between min-h-[95px]">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white mb-1">
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">Focus</h4>
                  <p className="text-[10px] text-blue-100 truncate mt-0.5">
                    Sem VII AI&DS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BOTTOM DOCK / NAVBAR MATCHING USER'S IMAGE */}
        {/* ======================================================== */}
        <div className="mt-3 sm:mt-4 bg-[#090A0F] rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/10 text-white text-xs">
          
          {/* Left Logo + Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">
              CampusMate
            </span>
          </div>

          {/* Center Navigation Links matching reference dock */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setActiveDockTab('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeDockTab === 'home' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveDockTab('timetable')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeDockTab === 'timetable' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📅</span>
              <span className="hidden sm:inline">Timetable</span>
            </button>

            <button
              onClick={() => setNormanModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-blue-400 font-bold hover:bg-white/10 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>HCI Principles</span>
            </button>

            <button
              onClick={() => setActiveDockTab('progress')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeDockTab === 'progress' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📊</span>
              <span className="hidden sm:inline">Attendance</span>
            </button>
          </div>

          {/* Right Controls: Settings, Notifications & Profile Avatar Picture */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHciModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
              title="Academic Settings & Evaluation"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => addToast({ title: 'Notices Updated', message: 'You have 2 pending announcements.', type: 'info' })}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1 right-1" />
            </button>

            {/* Profile Avatar with Camera Option to Change Picture */}
            <div 
              onClick={() => setAvatarModalOpen(true)}
              className="relative cursor-pointer group"
              title="Click to change profile picture"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/60 group-hover:opacity-80 transition-opacity" 
              />
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: DON NORMAN'S 7 PRINCIPLES & HCI EVALUATION */}
      {/* ======================================================== */}
      {normanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] p-6 sm:p-8 shadow-2xl flex flex-col relative overflow-hidden border border-slate-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  HUMAN-COMPUTER INTERACTION FOUNDATION
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  Don Norman's 7 Principles of Design
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  How CampusMate implements the fundamental design principles from *The Design of Everyday Things*.
                </p>
              </div>
              <button 
                onClick={() => setNormanModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3.5 pr-2">
              {normansPrinciples.map(p => (
                <div key={p.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                      Principle #{p.num}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      UI Element: {p.uiRef}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {p.desc}
                  </p>

                  <div className="mt-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-snug">
                    <span className="font-bold text-blue-900">Applied in CampusMate: </span>
                    {p.campusMateApp}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>SVKM's NMIMS MPSTME • Janvi Jain, Janvi Porwal, Joshua Rebello</span>
              <button
                onClick={() => setNormanModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
              >
                Done
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
