import React from 'react';
import { 
  LayoutGrid, 
  CalendarDays, 
  UserCheck, 
  FileText, 
  GraduationCap, 
  BookMarked, 
  Sparkles, 
  Megaphone, 
  Sun, 
  Moon, 
  Camera, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeAvatar } from './SafeAvatar';

interface EliteSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const EliteSidebar: React.FC<EliteSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse
}) => {
  const { 
    currentUser, 
    unreadAnnouncementsCount, 
    assignments, 
    overallAttendance, 
    darkMode, 
    setDarkMode, 
    setAvatarModalOpen,
    logout
  } = useApp();

  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Academic Hub', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'timetable', label: 'Class Timetable', icon: <CalendarDays className="w-5 h-5" /> },
    { 
      id: 'attendance', 
      label: 'Attendance & Bunks', 
      icon: <UserCheck className="w-5 h-5" />,
      badge: `${overallAttendance}%` 
    },
    { 
      id: 'assignments', 
      label: 'Priority Tasks', 
      icon: <FileText className="w-5 h-5" />,
      badge: assignments.filter(a => !a.completed).length ? `${assignments.filter(a => !a.completed).length}` : undefined 
    },
    { id: 'exams', label: 'Examination Hall', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'notes', label: 'Library & Notes', icon: <BookMarked className="w-5 h-5" /> },
    { id: 'events', label: 'Campus Life & RSVP', icon: <Sparkles className="w-5 h-5" /> },
    { 
      id: 'announcements', 
      label: 'Notices & Bulletins', 
      icon: <Megaphone className="w-5 h-5" />,
      badge: unreadAnnouncementsCount ? `${unreadAnnouncementsCount}` : undefined
    },
    { id: 'profile', label: 'My Profile & Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:self-start max-h-screen ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          darkMode 
            ? 'bg-[#0E1017] text-slate-200 border-r border-white/5' 
            : 'bg-white text-slate-800 border-r border-slate-200 shadow-lg'
        } flex flex-col justify-between p-4 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } select-none overflow-hidden`}
      >
        {/* Scrollable Navigation Middle Region */}
        <div className="flex-1 overflow-y-auto pr-0.5 min-h-0 space-y-4">
          {/* Top Logo & Collapse Toggle */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} pb-4 border-b ${
            darkMode ? 'border-white/5' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md text-white shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="font-display text-base font-extrabold tracking-tight leading-none">
                    CAMPUSMATE
                  </h2>
                  <p className="text-[10px] font-tech text-indigo-500 font-semibold mt-1">
                    NMIMS MPSTME · SEM VII
                  </p>
                </div>
              )}
            </div>

            {/* Collapse/Expand Toggle Button (Desktop) */}
            <button
              onClick={onToggleCollapse}
              className={`hidden lg:flex p-1.5 rounded-xl transition-colors ${
                darkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" role="menu">
            {!isCollapsed && (
              <span className="text-[10px] font-tech uppercase tracking-widest opacity-50 px-3 block mb-2 font-bold">
                NAVIGATION
              </span>
            )}

            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center py-3' : 'justify-between px-3.5 py-2.5'} rounded-2xl text-xs font-tech font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : darkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-white' : 'opacity-80 group-hover:text-indigo-500'} transition-colors`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="tracking-wide">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : darkMode
                        ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Pinned Bottom Footer (Never Falls Below The Fold) */}
        <div className={`shrink-0 mt-auto pt-3 border-t ${darkMode ? 'border-white/5' : 'border-slate-100'} space-y-2.5`}>
          
          {/* Action-Oriented Dark / Light Theme Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2'} rounded-xl border transition-colors ${
              darkMode ? 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="flex items-center gap-2 font-tech text-xs font-semibold">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              {!isCollapsed && <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>}
            </span>
          </button>

          {/* Student Profile Identity Card */}
          <div className={`p-2.5 rounded-2xl border flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${
            darkMode ? 'bg-[#141624] border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div 
              onClick={() => {
                onSelectTab('profile');
                onClose();
              }}
              className="flex items-center gap-3 min-w-0 cursor-pointer group/profile flex-1"
              title="Open profile details"
            >
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setAvatarModalOpen(true);
                }}
                className="relative cursor-pointer shrink-0 group/avatar"
                title="Click to change photo"
              >
                <SafeAvatar 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/50 group-hover/avatar:opacity-75 transition-opacity" 
                />
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {!isCollapsed && (
                <div className="min-w-0 truncate">
                  <p className="text-xs font-display font-bold truncate leading-tight group-hover/profile:text-indigo-500 transition-colors">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] opacity-60 truncate font-tech">Roll {currentUser.rollNo} • SAP {currentUser.sapId}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={() => setAvatarModalOpen(true)}
                className="p-1.5 opacity-60 hover:opacity-100 hover:text-indigo-500 transition-colors"
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sign Out Button with Error Prevention Dialog */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-full py-2 px-3 rounded-xl border text-xs font-tech font-bold flex items-center justify-center gap-2 transition-colors ${
              darkMode 
                ? 'border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' 
                : 'border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title="Sign out of CampusMate"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Confirmation Modal for Sign Out (Prevents Accidental State Loss) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-scale-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 border shadow-2xl ${
            darkMode ? 'bg-[#141624] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-display text-lg font-bold">Confirm Sign Out</h3>
            <p className="text-xs opacity-75 mt-2 leading-relaxed">
              Are you sure you want to sign out of CampusMate? Your attendance records, checklist progress, and submission history are securely saved.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`px-4 py-2 rounded-xl text-xs font-tech font-semibold transition-colors ${
                  darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="px-4 py-2 rounded-xl text-xs font-tech font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
