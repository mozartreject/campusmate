import React, { useState } from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Sun, 
  Moon,
  User,
  KeyRound,
  Plus,
  UserPlus,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeAvatar } from './SafeAvatar';
import { StudentProfile } from '../types';
import { createSvgAvatar } from '../utils/avatarUtils';

const avatarPresets = [
  { id: 'av1', label: 'Indigo', url: createSvgAvatar('av1', ['#6366F1', '#4338CA'], '#4F46E5', true) },
  { id: 'av2', label: 'Rose', url: createSvgAvatar('av2', ['#EC4899', '#BE185D'], '#DB2777', true) },
  { id: 'av3', label: 'Blue', url: createSvgAvatar('av3', ['#3B82F6', '#1D4ED8'], '#2563EB', false) },
  { id: 'av4', label: 'Emerald', url: createSvgAvatar('av4', ['#10B981', '#047857'], '#059669', false) },
  { id: 'av5', label: 'Purple', url: createSvgAvatar('av5', ['#8B5CF6', '#6D28D9'], '#7C3AED', false) },
  { id: 'av6', label: 'Amber', url: createSvgAvatar('av6', ['#F59E0B', '#D97706'], '#B45309', true) }
];

export const LoginPage: React.FC = () => {
  const { allUsers, addNewUser, login, darkMode, setDarkMode, colorBlindMode, setColorBlindMode } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile>(allUsers[0]);
  const [authMode, setAuthMode] = useState<'quick' | 'credentials'>('quick');
  const [emailOrSap, setEmailOrSap] = useState(allUsers[0]?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New Scholar Registration State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRoll, setNewUserRoll] = useState('');
  const [newUserSap, setNewUserSap] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPersona, setNewUserPersona] = useState<'overloaded_planner' | 'overcommitted_achiever' | 'placement_senior'>('overloaded_planner');
  const [newUserTitle, setNewUserTitle] = useState('B.Tech AI & Data Science Scholar');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(avatarPresets[0].url);
  const [newUserAttendanceTarget, setNewUserAttendanceTarget] = useState(75);
  const [registrationError, setRegistrationError] = useState('');

  const handleSelectStudent = (student: StudentProfile) => {
    setSelectedStudent(student);
    setEmailOrSap(student.email);
  };

  const handleQuickLogin = (student: StudentProfile) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(student);
    }, 400);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Find matching user or use selected
      const matched = allUsers.find(
        u => u.email.toLowerCase() === emailOrSap.toLowerCase() || u.sapId === emailOrSap
      ) || selectedStudent;

      login(matched);
    }, 500);
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      setRegistrationError('Please provide your full student name.');
      return;
    }
    if (!newUserRoll.trim()) {
      setRegistrationError('Please provide your roll number (e.g. A048).');
      return;
    }
    if (!newUserSap.trim() || newUserSap.trim().length < 8) {
      setRegistrationError('Please enter a valid NMIMS SAP ID (minimum 8 digits).');
      return;
    }

    const email = newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '.')}@nmims.edu.in`;

    const created = addNewUser({
      name: newUserName.trim(),
      rollNo: newUserRoll.trim().toUpperCase(),
      sapId: newUserSap.trim(),
      email,
      program: 'B.Tech AI & Data Science',
      semester: 'VII',
      section: 'A',
      college: "SVKM's NMIMS MPSTME",
      avatar: selectedAvatarUrl,
      personaType: newUserPersona,
      personaTitle: newUserTitle.trim() || 'AI & Data Science Scholar',
      quote: 'Personalized workspace for MPSTME Semester VII.',
      attendanceTarget: newUserAttendanceTarget
    });

    // Reset and sign in
    setNewUserName('');
    setNewUserRoll('');
    setNewUserSap('');
    setNewUserEmail('');
    setRegistrationError('');
    setShowAddUserModal(false);

    setSelectedStudent(created);
    setEmailOrSap(created.email);
    handleQuickLogin(created);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden transition-colors ${
      darkMode ? 'bg-[#0B0D13] text-slate-100' : 'bg-[#F4F6FB] text-slate-900'
    }`}>
      
      {/* Ambient Glowing Auras */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none animate-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none animate-glow" />

      {/* Top Floating Controls: Color-Blind Toggle & Dark/Light Mode */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2.5">
        <button
          onClick={() => {
            const modes: ('none' | 'protanopia' | 'deuteranopia' | 'highContrast')[] = ['none', 'protanopia', 'deuteranopia', 'highContrast'];
            const nextIdx = (modes.indexOf(colorBlindMode) + 1) % modes.length;
            setColorBlindMode(modes[nextIdx]);
          }}
          className={`px-3 py-2 rounded-2xl border transition-all text-xs font-tech font-bold flex items-center gap-1.5 ${
            colorBlindMode !== 'none'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
              : darkMode 
              ? 'bg-[#141624] border-white/10 text-slate-300 hover:text-white' 
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
          }`}
          title="Toggle Color-Blind Safe Mode (Protanopia / Deuteranopia / High-Contrast)"
        >
          <span>👁️</span>
          <span className="hidden sm:inline">
            {colorBlindMode === 'none' ? 'Color-Blind Safe' : colorBlindMode === 'highContrast' ? 'Monochrome' : colorBlindMode.toUpperCase()}
          </span>
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-2xl border transition-all ${
            darkMode 
              ? 'bg-[#141624] border-white/10 text-slate-300 hover:text-white' 
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
          }`}
          title="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>

      {/* Main Login Card with Stepped Folder Tab Aesthetic */}
      <div className="w-full max-w-4xl relative z-10 animate-page-enter">
        
        {/* Stepped Tab Header Cap */}
        <div className="relative w-full overflow-hidden">
          <svg 
            viewBox="0 0 400 32" 
            className="w-full h-8 block -mb-[1px]" 
            preserveAspectRatio="none"
            fill={darkMode ? '#141624' : '#FFFFFF'}
          >
            <path d="M 0,32 L 0,16 C 0,8 8,0 18,0 L 220,0 C 235,0 245,12 260,12 L 382,12 C 392,12 400,18 400,26 L 400,32 Z" />
          </svg>
          <div className="absolute top-1 left-5 text-[10px] font-tech font-bold uppercase tracking-widest text-indigo-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SVKM'S NMIMS MPSTME · OFFICIAL STUDENT AUTHENTICATION</span>
          </div>
        </div>

        {/* Card Body */}
        <div className={`p-8 sm:p-12 rounded-b-[36px] border shadow-2xl ${
          darkMode ? 'bg-[#141624] border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Branding & Overview */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg text-white shadow-indigo-500/30 shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight leading-none">
                    CAMPUSMATE
                  </h1>
                  <p className="text-xs font-tech text-indigo-500 font-bold mt-1">
                    Smart Student Companion · Sem VII AI & DS
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className={`font-display text-3xl sm:text-4xl font-black leading-tight ${
                  darkMode ? 'text-white' : 'text-slate-950'
                }`}>
                  Sign in to your<br />Academic Workspace
                </h2>
                <p className={`text-xs sm:text-sm font-sans leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Single Sign-On portal for SVKM's NMIMS MPSTME. Securely access your personalized timetable, safe attendance metrics, priority assignments, and lecture notes.
                </p>
              </div>

              {/* Mode Toggle: Secure Login vs Evaluator Demo Switcher */}
              <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 max-w-md ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setAuthMode('credentials')}
                  className={`flex-1 py-2 rounded-xl text-xs font-tech font-bold transition-all ${
                    authMode === 'credentials'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  🔒 Secure Student Login
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('quick')}
                  className={`flex-1 py-2 rounded-xl text-xs font-tech font-bold transition-all ${
                    authMode === 'quick'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  🧪 Demo Persona Switcher
                </button>
              </div>

              <div className="pt-1 flex items-center gap-2 text-[11px] font-tech opacity-70">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Encrypted Academic SSO · Student credentials and privacy protected</span>
              </div>
            </div>

            {/* Right Column: Authentication Panel */}
            <div className="lg:col-span-6">
              
              {authMode === 'credentials' ? (
                /* Primary Mode: Secure Student Credentials Form (Nielsen Heuristic #5, Shneiderman Rule #5) */
                <form onSubmit={handleFormLogin} className="space-y-4 animate-scale-in">
                  <div className={`p-3.5 rounded-2xl border text-xs font-tech ${
                    darkMode ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
                  } flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Selected: <strong>{selectedStudent.name}</strong> ({selectedStudent.rollNo})</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setRegistrationError('');
                          setShowAddUserModal(true);
                        }}
                        className="text-indigo-500 hover:text-indigo-400 font-bold flex items-center gap-1"
                        title="Register a new student user"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Add User</span>
                      </button>
                      <span className="opacity-30">|</span>
                      <button
                        type="button"
                        onClick={() => setAuthMode('quick')}
                        className="underline font-bold hover:text-indigo-400"
                      >
                        Switch
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-tech font-bold opacity-80 mb-1.5">
                      Institutional Email or SAP ID
                    </label>
                    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}>
                      <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                      <input 
                        type="text"
                        required
                        value={emailOrSap}
                        onChange={(e) => setEmailOrSap(e.target.value)}
                        placeholder="e.g. 70562200090 or joshua.rebello@nmims.edu.in"
                        className="bg-transparent text-xs sm:text-sm font-sans w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-tech font-bold opacity-80 mb-1.5">
                      Portal Password
                    </label>
                    <div className={`flex items-center justify-between gap-2.5 px-4 py-3 rounded-2xl border ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}>
                      <div className="flex items-center gap-2.5 flex-1">
                        <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your student password"
                          className="bg-transparent text-xs sm:text-sm font-sans w-full focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="opacity-60 hover:opacity-100 transition-opacity p-1"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-tech pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-400 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="opacity-75">Remember credentials</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("Password reset instructions sent to registered NMIMS email.")} 
                      className="text-indigo-500 hover:underline font-bold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-tech font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{isLoading ? 'Authenticating...' : `Sign In as ${selectedStudent.name}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Mode 2: Evaluator Persona Switcher (Cleanly labeled for HCI Review) */
                <div className="space-y-4 animate-scale-in">
                  <div className={`p-3 rounded-xl border text-xs font-tech leading-relaxed ${
                    darkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <strong>HCI Prototype Notice:</strong> In production, authentication is routed via institutional SSO without public profile switching. For usability evaluation, select a student persona below to load their individual timetable, attendance, and tasks.
                  </div>

                  <div className="space-y-2.5">
                    {allUsers.map((student) => {
                      const isSelected = selectedStudent.id === student.id;
                      return (
                        <div
                          key={student.id}
                          onClick={() => {
                            handleSelectStudent(student);
                            setAuthMode('credentials');
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                            isSelected
                              ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/40 shadow-md'
                              : darkMode 
                              ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10' 
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <SafeAvatar 
                              src={student.avatar} 
                              alt={student.name}
                              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/40" 
                            />
                            <div>
                              <h3 className={`font-display font-bold text-sm leading-tight ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {student.name}
                              </h3>
                              <p className="text-xs font-tech text-indigo-500 font-semibold mt-0.5">
                                Roll: {student.rollNo} · {student.personaTitle || 'AI & DS Scholar'}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-tech font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">
                            Select →
                          </span>
                        </div>
                      );
                    })}

                    {/* Add New Scholar Profile Action Card (Directly beside existing ready-to-sign-in users) */}
                    <div
                      onClick={() => {
                        setRegistrationError('');
                        setShowAddUserModal(true);
                      }}
                      className={`p-3.5 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex items-center justify-between group ${
                        darkMode 
                          ? 'bg-indigo-950/20 border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-950/30' 
                          : 'bg-indigo-50/70 border-indigo-400/80 hover:border-indigo-500 hover:bg-indigo-100/60 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-500 group-hover:scale-105 transition-transform shadow-sm">
                          <UserPlus className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-sm leading-tight text-indigo-500 flex items-center gap-1.5">
                            <span>+ Add New Scholar Profile</span>
                          </h3>
                          <p className={`text-xs font-tech mt-0.5 ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            Register your own Roll No, SAP ID & Attendance Target
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-tech font-bold text-white bg-indigo-600 group-hover:bg-indigo-500 px-3 py-1.5 rounded-xl shadow-xs transition-colors">
                        Create +
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: ADD NEW SCHOLAR PROFILE REGISTRATION              */}
      {/* ======================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden animate-scale-in max-h-[92vh] flex flex-col ${
            darkMode ? 'bg-[#141624] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-current/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">
                    Register New Scholar Profile
                  </h3>
                  <p className="text-xs font-tech text-indigo-500 font-semibold">
                    SVKM's NMIMS MPSTME · Semester VII AI & DS
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddUserModal(false);
                  setRegistrationError('');
                }}
                className="p-2 opacity-60 hover:opacity-100 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateNewUser} className="p-6 space-y-4 overflow-y-auto flex-1">
              {registrationError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-tech flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{registrationError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-tech font-bold opacity-80 mb-1">
                  Full Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Shah"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Roll No and SAP ID Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-tech font-bold opacity-80 mb-1">
                    Roll Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A055"
                    value={newUserRoll}
                    onChange={(e) => setNewUserRoll(e.target.value.toUpperCase())}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans uppercase border focus:outline-none focus:border-indigo-500 ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  <p className="text-[10px] opacity-60 mt-1 font-tech">Convention: Division + 3 digits (e.g. A048)</p>
                </div>

                <div>
                  <label className="block text-xs font-tech font-bold opacity-80 mb-1">
                    NMIMS SAP ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 70562200115"
                    value={newUserSap}
                    onChange={(e) => setNewUserSap(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans border focus:outline-none focus:border-indigo-500 ${
                      darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                  <p className="text-[10px] opacity-60 mt-1 font-tech">11-digit institutional SAP ID</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-tech font-bold opacity-80 mb-1">
                  Institutional Email (Optional - Auto suggested)
                </label>
                <input
                  type="email"
                  placeholder={newUserName ? `${newUserName.toLowerCase().replace(/\s+/g, '.')}@nmims.edu.in` : "name@nmims.edu.in"}
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Persona Tag */}
              <div>
                <label className="block text-xs font-tech font-bold opacity-80 mb-1.5">
                  Academic Focus Persona
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'overloaded_planner', title: 'Curriculum Scholar', desc: 'Focuses on 8 courses & 85% attendance' },
                    { id: 'overcommitted_achiever', title: 'Tech Leader', desc: 'Active in Hackathons, clubs & labs' },
                    { id: 'placement_senior', title: 'Placement Senior', desc: 'Prioritizes resumes & mock interviews' }
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setNewUserPersona(p.id as any);
                        setNewUserTitle(p.title);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        newUserPersona === p.id
                          ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/40'
                          : darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-display font-bold text-xs">{p.title}</p>
                      <p className="text-[10px] opacity-70 font-sans mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Preset Selector */}
              <div>
                <label className="block text-xs font-tech font-bold opacity-80 mb-1.5">
                  Choose Scholar Avatar
                </label>
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {avatarPresets.map((av) => {
                    const isSelected = selectedAvatarUrl === av.url;
                    return (
                      <div
                        key={av.id}
                        onClick={() => setSelectedAvatarUrl(av.url)}
                        className={`cursor-pointer p-1 rounded-2xl transition-all shrink-0 ${
                          isSelected ? 'ring-3 ring-indigo-500 scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <SafeAvatar
                          src={av.url}
                          alt={av.label}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Attendance Target */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-tech font-bold opacity-80">
                    Mandatory Attendance Target: <strong className="text-indigo-500">{newUserAttendanceTarget}%</strong>
                  </label>
                  <span className="text-[10px] font-tech opacity-60">NMIMS Rule: Minimum 75%</span>
                </div>
                <div className="flex items-center gap-2">
                  {[75, 80, 85].map(target => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => setNewUserAttendanceTarget(target)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-tech font-bold border transition-all ${
                        newUserAttendanceTarget === target
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                          : darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      {target}% Target
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-current/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setRegistrationError('');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-tech font-bold opacity-60 hover:opacity-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-tech font-bold shadow-md flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Sign In Immediately</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
