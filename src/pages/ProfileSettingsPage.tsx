import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Eye, 
  Bell, 
  Shield, 
  Sliders, 
  LogOut, 
  RotateCcw, 
  CheckCircle2, 
  Moon, 
  Sun,
  AlertTriangle,
  Type,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileSettingsPage: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    allUsers, 
    textSize, 
    setTextSize, 
    highContrast, 
    setHighContrast, 
    darkMode, 
    setDarkMode,
    attendanceTarget,
    setAttendanceTarget,
    logout,
    addToast,
    setHciModalOpen
  } = useApp();

  const [notifications, setNotifications] = useState({
    attendanceWarnings: true,
    assignmentDeadlines: true,
    examNotifications: true,
    eventInvites: false
  });

  const [confirmLogout, setConfirmLogout] = useState(false);

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const next = { ...prev, [key]: !prev[key] };
      addToast({
        title: 'Preference Updated',
        message: 'Notification settings saved to your profile.',
        type: 'info'
      });
      return next;
    });
  };

  const handleResetSettings = () => {
    setTextSize('normal');
    setHighContrast(false);
    setDarkMode(false);
    setAttendanceTarget(75);
    addToast({
      title: 'Preferences Reset',
      message: 'System appearance restored to default HCI baseline.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Profile & Settings</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage academic profile, accessibility preferences, notification channels, and persona simulations.
          </p>
        </div>

        <button
          onClick={() => setHciModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-300 rounded-2xl text-xs font-bold transition-all"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>HCI Design Evaluation Matrix</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Academic Card & Persona Switcher */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official NMIMS Student ID Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Digital Student Identity
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                Active Student
              </span>
            </div>

            <div className="flex items-center gap-4 my-4">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">{currentUser.name}</h3>
                <p className="text-xs font-mono text-blue-700 font-semibold mt-0.5">SAP ID: {currentUser.sapId}</p>
                <p className="text-xs text-slate-500 mt-0.5">Roll No: {currentUser.rollNo} • Section {currentUser.section}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Institution:</span>
                <span className="font-semibold text-slate-800">{currentUser.college}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-800">{currentUser.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academic Standing:</span>
                <span className="font-semibold text-emerald-600">Semester {currentUser.semester} (Regular)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Registered Email:</span>
                <span className="font-mono text-slate-700">{currentUser.email}</span>
              </div>
            </div>
          </div>

          {/* Group Members & Persona Switcher (For Evaluation Demonstration) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Project Group Members & Personas
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Switch persona to test the interface against Aarav's scenario (Slide 9 & 10) or group member profiles.
            </p>

            <div className="space-y-2">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    addToast({
                      title: 'Persona Switched',
                      message: `Now viewing CampusMate as ${user.name}.`,
                      type: 'info'
                    });
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    currentUser.id === user.id
                      ? 'bg-blue-50 border-blue-400 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{user.name}</h4>
                      <p className="text-[10px] text-slate-500">{user.personaTitle} • {user.rollNo}</p>
                    </div>
                  </div>
                  {currentUser.id === user.id && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Accessibility, Notifications & Safety Settings */}
        <div className="lg:col-span-7 space-y-6">
          {/* HCI Universal Accessibility Suite */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Universal Usability & Accessibility Suite
                </h3>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                7 Principles Compliant
              </span>
            </div>

            {/* Font Size Scaling */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Dynamic Text Scaling</h4>
                  <p className="text-[11px] text-slate-500">Increases text legibility without breaking card alignment.</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {textSize === 'normal' ? '100% (Default)' : textSize === 'large' ? '115% (Comfort)' : '130% (High Readability)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                {(['normal', 'large', 'xlarge'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      textSize === size
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {size === 'normal' ? 'Normal (16px)' : size === 'large' ? 'Large (18px)' : 'Extra Large (20px)'}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800">High Contrast Palette</h4>
                <p className="text-[11px] text-slate-500">Enhances optical contrast for students with visual strain.</p>
              </div>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded-md focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Dark Theme Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Dark Interface Theme</h4>
                  <p className="text-[11px] text-slate-500">Reduces glare during night study sessions.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded-md focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Proactive Alert Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Prevent surprise crises (Slide 10) by delivering timely push notifications.
            </p>

            <div className="space-y-2 pt-2">
              {[
                { key: 'attendanceWarnings', label: 'Attendance Risk Warning', desc: 'Alert when any subject falls below required 75%' },
                { key: 'assignmentDeadlines', label: 'Urgent Assignment Reminders', desc: 'Push alert 24h and 4h prior to deadline' },
                { key: 'examNotifications', label: 'Exam Hall Ticket & Venue Updates', desc: 'Updates directly from Registrar' },
                { key: 'eventInvites', label: 'Campus Club & Hackathon Updates', desc: 'Invitations to workshops and seminars' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.label}</h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={(notifications as any)[item.key]}
                    onChange={() => toggleNotif(item.key as any)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Error Prevention & Session Controls (Shneiderman Rule #5) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleResetSettings}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default Appearance</span>
            </button>

            <button
              onClick={() => setConfirmLogout(true)}
              className="flex items-center gap-1.5 px-5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-2xl text-xs font-bold transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of CampusMate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal (Error Prevention) */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Sign Out Confirmation</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to end your session? Any unsaved local edits will be preserved in your current session.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setConfirmLogout(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  setConfirmLogout(false);
                  logout();
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
