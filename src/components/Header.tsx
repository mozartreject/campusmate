import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Bell, 
  ChevronDown, 
  User, 
  Sun, 
  Moon, 
  Eye, 
  Type, 
  ExternalLink,
  BookOpen,
  Calendar,
  FileText,
  AlertCircle,
  Sparkles,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavigationTab } from '../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    allUsers, 
    searchQuery, 
    setSearchQuery, 
    announcements, 
    markAnnouncementAsRead, 
    setActiveTab, 
    unreadAnnouncementsCount,
    highContrast,
    setHighContrast,
    darkMode,
    setDarkMode,
    textSize,
    setTextSize,
    setHciModalOpen,
    timetable,
    assignments,
    events,
    notes,
    exams
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const a11yRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (a11yRef.current && !a11yRef.current.contains(e.target as Node)) {
        setAccessibilityOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search results across all modules
  const searchResults = searchQuery.trim().length > 1 ? {
    classes: timetable.filter(c => c.subject.toLowerCase().includes(searchQuery.toLowerCase()) || c.faculty.toLowerCase().includes(searchQuery.toLowerCase())),
    assignments: assignments.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.subject.toLowerCase().includes(searchQuery.toLowerCase())),
    exams: exams.filter(e => e.subject.toLowerCase().includes(searchQuery.toLowerCase())),
    events: events.filter(ev => ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.club.toLowerCase().includes(searchQuery.toLowerCase())),
    notes: notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  } : null;

  const totalResults = searchResults 
    ? searchResults.classes.length + searchResults.assignments.length + searchResults.exams.length + searchResults.events.length + searchResults.notes.length
    : 0;

  const handleSearchResultClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setSearchFocused(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Personalized Greeting */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 tracking-wide">
          {getGreeting()},
        </span>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
          {currentUser.name.split(' ')[0]} <span className="inline-block animate-wave">👋</span>
        </h2>
      </div>

      {/* Center: Global Search Bar matching Slide 15 */}
      <div className="relative w-full max-w-lg mx-6" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, notes, events, exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Instant Dropdown (HCI Rule: Flexibility & Efficiency) */}
        {searchFocused && searchQuery.trim().length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100">
              <span>Search Results ({totalResults})</span>
              <span className="text-[10px] text-blue-600 font-normal">Press ESC to dismiss</span>
            </div>

            {totalResults === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs">
                No matching academic materials or events found for "{searchQuery}".
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {/* Classes */}
                {searchResults!.classes.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSearchResultClick('timetable')}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
                        <Calendar className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-blue-700">{c.subject}</p>
                        <p className="text-[11px] text-slate-500">{c.day} • {c.time} • {c.room}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Timetable</span>
                  </button>
                ))}

                {/* Assignments */}
                {searchResults!.assignments.map(a => (
                  <button
                    key={a.id}
                    onClick={() => handleSearchResultClick('assignments')}
                    className="w-full px-3 py-2 text-left hover:bg-amber-50 flex items-center justify-between group transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 bg-amber-100 text-amber-700 rounded-md">
                        <FileText className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-amber-700">{a.title}</p>
                        <p className="text-[11px] text-slate-500">{a.subject} • {a.deadlineRelative}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      a.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {a.priority} Priority
                    </span>
                  </button>
                ))}

                {/* Exams */}
                {searchResults!.exams.map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleSearchResultClick('exams')}
                    className="w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center justify-between group transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 bg-purple-100 text-purple-700 rounded-md">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-purple-700">{e.subject} Exam</p>
                        <p className="text-[11px] text-slate-500">{e.date} • {e.time} • {e.venue}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      In {e.daysLeft} days
                    </span>
                  </button>
                ))}

                {/* Notes */}
                {searchResults!.notes.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleSearchResultClick('notes')}
                    className="w-full px-3 py-2 text-left hover:bg-emerald-50 flex items-center justify-between group transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-md">
                        <BookOpen className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-emerald-700">{n.title}</p>
                        <p className="text-[11px] text-slate-500">{n.subject} • {n.type} ({n.size})</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Notes</span>
                  </button>
                ))}

                {/* Events */}
                {searchResults!.events.map(ev => (
                  <button
                    key={ev.id}
                    onClick={() => handleSearchResultClick('events')}
                    className="w-full px-3 py-2 text-left hover:bg-indigo-50 flex items-center justify-between group transition-colors rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-indigo-700">{ev.title}</p>
                        <p className="text-[11px] text-slate-500">{ev.date} • {ev.venue}</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Event</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Accessibility, Notifications & Student Avatar Dropdown */}
      <div className="flex items-center gap-3">
        {/* Universal Usability & Accessibility Quick Toggles */}
        <div className="relative" ref={a11yRef}>
          <button
            onClick={() => setAccessibilityOpen(!accessibilityOpen)}
            title="Accessibility & Universal Usability Controls"
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors relative"
            aria-label="Accessibility options"
          >
            <Eye className="w-5 h-5" />
            {highContrast && (
              <span className="w-2 h-2 bg-amber-500 rounded-full absolute top-1 right-1"></span>
            )}
          </button>

          {accessibilityOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs space-y-3 animate-in fade-in duration-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-blue-600" /> Accessibility Suite
                </span>
                <span className="text-[10px] text-slate-400">HCI Standard</span>
              </div>

              {/* Text Size Scaling */}
              <div>
                <label className="text-slate-600 font-medium block mb-1.5">Font Size</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setTextSize('normal')}
                    className={`py-1 text-center rounded font-medium transition-all ${
                      textSize === 'normal' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setTextSize('large')}
                    className={`py-1 text-center rounded font-medium transition-all ${
                      textSize === 'large' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    115%
                  </button>
                  <button
                    onClick={() => setTextSize('xlarge')}
                    className={`py-1 text-center rounded font-medium transition-all ${
                      textSize === 'xlarge' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    130%
                  </button>
                </div>
              </div>

              {/* High Contrast Mode Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="font-medium text-slate-800">High Contrast Mode</p>
                  <p className="text-[10px] text-slate-500">Caters to visual ergonomics</p>
                </div>
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Dark Theme Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span className="font-medium text-slate-800">Dark Mode</span>
                </div>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell matching Slide 15 */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAnnouncementsCount > 0 && (
              <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center absolute top-1 right-1 ring-2 ring-white animate-pulse">
                {unreadAnnouncementsCount}
              </span>
            )}
          </button>

          {/* Interactive Notifications Drawer */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 text-xs animate-in fade-in duration-100">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800">Notifications & Alerts</span>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => setActiveTab('announcements')}>
                  View all
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {announcements.slice(0, 4).map((ann) => (
                  <div 
                    key={ann.id}
                    onClick={() => markAnnouncementAsRead(ann.id)}
                    className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !ann.isRead ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {ann.isUrgent ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Bell className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${!ann.isRead ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                          {ann.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{ann.relativeTime} • {ann.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Dropdown matching Slide 15 ("Janvi Porwal ⌵") */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/60 transition-colors"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500" 
            />
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline-block">
              {currentUser.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in duration-100">
              <div className="p-3 bg-blue-50/60 rounded-xl mb-2">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
                    <p className="text-[11px] text-blue-700 font-medium">SAP ID: {currentUser.sapId}</p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-lg border border-blue-100">
                  <p className="font-semibold text-slate-800">{currentUser.program}</p>
                  <p>Semester {currentUser.semester}, Section {currentUser.section} • Roll {currentUser.rollNo}</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic">"{currentUser.personaTitle}"</p>
                </div>
              </div>

              {/* Persona Switcher (For HCI Evaluation & Demonstration) */}
              <div className="px-2 py-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Switch Persona / Group Member:
                </p>
                <div className="space-y-1">
                  {allUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                        currentUser.id === user.id ? 'bg-blue-100 text-blue-900 font-semibold' : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <div>
                          <p className="text-xs">{user.name}</p>
                          <p className="text-[9px] text-slate-400">{user.personaTitle}</p>
                        </div>
                      </div>
                      {currentUser.id === user.id && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 mt-2 pt-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-left transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Profile & Academic Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
