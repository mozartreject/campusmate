import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserCheck, 
  FileCheck2, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  Megaphone, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { NavigationTab } from '../types';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, unreadAnnouncementsCount, setHciModalOpen, currentUser, logout } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'timetable', label: 'Timetable', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'attendance', label: 'Attendance', icon: <UserCheck className="w-5 h-5" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileCheck2 className="w-5 h-5" /> },
    { id: 'notes', label: 'Notes', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'exams', label: 'Exams', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'events', label: 'Events', icon: <Sparkles className="w-5 h-5" /> },
    { 
      id: 'announcements', 
      label: 'Announcements', 
      icon: <Megaphone className="w-5 h-5" />,
      badge: unreadAnnouncementsCount > 0 ? unreadAnnouncementsCount : undefined 
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside 
      className="w-64 bg-[#2563EB] text-white flex flex-col justify-between shrink-0 shadow-xl min-h-screen z-20 transition-all select-none"
      aria-label="Main Navigation"
    >
      {/* Top Branding matching Figma Prototype */}
      <div>
        <div className="p-6 pb-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md p-1.5 shrink-0">
            {/* Graduation Cap Logo from Slides */}
            <svg 
              viewBox="0 0 48 48" 
              className="w-full h-full text-[#1E3A8A]" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M24 8L4 18L24 28L44 18L24 8Z" 
                fill="#1E293B" 
              />
              <path 
                d="M10 21.5V31.5C10 37.5 16.5 41 24 41C31.5 41 38 37.5 38 31.5V21.5L24 28.5L10 21.5Z" 
                fill="#1E293B" 
                fillOpacity="0.8" 
              />
              <path 
                d="M40 19.5V33H42V18.5L40 19.5Z" 
                fill="#D97706" 
              />
              <circle cx="41" cy="34" r="2.5" fill="#D97706" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 font-serif">
              CampusMate
            </h1>
            <p className="text-[11px] text-blue-100 font-medium tracking-wide opacity-90">
              NMIMS MPSTME • AI & DS
            </p>
          </div>
        </div>

        {/* Navigation list matching slide pill style */}
        <nav className="mt-4 px-3 space-y-1.5" role="menu">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-[#2563EB] shadow-md font-semibold translate-x-1'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#2563EB]' : 'text-white'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 bg-amber-400 text-slate-900 rounded-full text-xs font-bold flex items-center justify-center shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: HCI Principles Explorer & User Bar */}
      <div className="p-3 border-t border-blue-400/30 space-y-2">
        {/* HCI Principles Inspector Button */}
        <button
          onClick={() => setHciModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/30 text-xs font-medium transition-all group"
          title="Inspect HCI Principles applied in CampusMate"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span className="font-semibold text-amber-100">HCI Principles Evaluator</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* User Mini Profile */}
        <div className="bg-blue-700/60 rounded-xl p-2.5 flex items-center justify-between border border-blue-400/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50 shrink-0" 
            />
            <div className="min-w-0 truncate">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-blue-200 truncate">{currentUser.rollNo} • Sem {currentUser.semester}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-600 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
