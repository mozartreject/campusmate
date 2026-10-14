import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  NavigationTab, 
  StudentProfile, 
  ClassSchedule, 
  AttendanceRecord, 
  Assignment, 
  Exam, 
  NoteItem, 
  Announcement, 
  CampusEvent,
  ToastMessage,
  HCIPrincipleInfo,
  HistoryAction
} from '../types';
import { 
  mockStudents, 
  mockTimetable, 
  mockAttendance, 
  mockAssignments, 
  mockAnnouncements, 
  mockEvents, 
  mockExams,
  mockNotes,
  mockHCIPrinciples
} from '../data/mockData';

interface AppContextType {
  // Navigation & User
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentUser: StudentProfile;
  setCurrentUser: (user: StudentProfile) => void;
  allUsers: StudentProfile[];
  addNewUser: (user: Omit<StudentProfile, 'id'>) => StudentProfile;
  isLoggedIn: boolean;
  login: (user?: StudentProfile) => void;
  logout: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Timetable
  timetable: ClassSchedule[];
  selectedDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  setSelectedDay: (day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday') => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  overallAttendance: number;
  attendanceTarget: number;
  setAttendanceTarget: (target: number) => void;
  logClassAttendance: (recordId: string, attended: boolean) => void;

  // Assignments
  assignments: Assignment[];
  toggleAssignmentComplete: (id: string) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  deleteAssignment: (id: string) => void;

  // Events
  events: CampusEvent[];
  toggleEventRSVP: (id: string) => void;

  // Announcements
  announcements: Announcement[];
  markAnnouncementAsRead: (id: string) => void;
  markAllAnnouncementsAsRead: () => void;
  unreadAnnouncementsCount: number;

  // Notes
  notes: NoteItem[];
  toggleNoteBookmark: (id: string) => void;

  // Exams
  exams: Exam[];

  // Accessibility & Preferences
  textSize: 'normal' | 'large' | 'xlarge';
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  undoWindowSeconds: number;
  setUndoWindowSeconds: (sec: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (enabled: boolean) => void;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'highContrast';
  setColorBlindMode: (mode: 'none' | 'protanopia' | 'deuteranopia' | 'highContrast') => void;

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Finger Gestures & Universal History Stack (Shneiderman #6, Nielsen #3, Norman #6)
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  canUndo: boolean;
  canRedo: boolean;
  triggerUndo: () => boolean;
  triggerRedo: () => boolean;
  lastGesture: { type: 'undo' | 'redo' | 'none'; message: string; timestamp: number } | null;
  clearHistory: () => void;

  // Avatar Customization
  updateProfileAvatar: (newAvatarUrl: string) => void;
  avatarModalOpen: boolean;
  setAvatarModalOpen: (open: boolean) => void;

  // HCI Principles Inspector
  hciModalOpen: boolean;
  setHciModalOpen: (open: boolean) => void;
  hciPrinciples: HCIPrincipleInfo[];
  selectedPrincipleId: string | null;
  setSelectedPrincipleId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User list state with persistence
  const [allUsers, setAllUsers] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem('campusmate_all_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return mockStudents;
  });

  // User & Navigation
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<StudentProfile>(allUsers[0]);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamically default to current academic day of the week
  const getInitialAcademicDay = (): 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' => {
    const day = new Date().getDay(); // 0 Sun, 1 Mon, 2 Tue, 3 Wed, 4 Thu, 5 Fri, 6 Sat
    switch (day) {
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      default: return 'Monday';
    }
  };

  // Data states
  const [timetable] = useState<ClassSchedule[]>(mockTimetable);
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>(getInitialAcademicDay);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [attendanceTarget, setAttendanceTarget] = useState<number>(75);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [events, setEvents] = useState<CampusEvent[]>(mockEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [notes, setNotes] = useState<NoteItem[]>(mockNotes);
  const [exams] = useState<Exam[]>(mockExams);

  // Avatar Modal & Custom Picture
  const [avatarModalOpen, setAvatarModalOpen] = useState<boolean>(false);

  // Accessibility & Theme
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [undoWindowSeconds, setUndoWindowSeconds] = useState<number>(10);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(false);
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'highContrast'>('none');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // HCI Modal
  const [hciModalOpen, setHciModalOpen] = useState<boolean>(false);
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<string | null>(null);

  // Apply HTML accessibility & theme attributes dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-text-size', textSize);

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    if (reduceMotion) {
      root.classList.add('reduce-motion');
      root.setAttribute('data-reduce-motion', 'true');
    } else {
      root.classList.remove('reduce-motion');
      root.removeAttribute('data-reduce-motion');
    }

    if (dyslexiaFont) {
      root.classList.add('dyslexia-font');
      root.setAttribute('data-dyslexia', 'true');
    } else {
      root.classList.remove('dyslexia-font');
      root.removeAttribute('data-dyslexia');
    }

    const colorBlindClasses = ['colorblind-mode', 'colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia', 'colorblind-highContrast'];
    root.classList.remove(...colorBlindClasses);

    if (colorBlindMode !== 'none') {
      root.classList.add('colorblind-mode', `colorblind-${colorBlindMode}`);
      root.setAttribute('data-colorblind', colorBlindMode);
    } else {
      root.removeAttribute('data-colorblind');
    }
  }, [textSize, highContrast, darkMode, reduceMotion, dyslexiaFont, colorBlindMode]);

  // Method to register new student user from login page
  const addNewUser = (newUser: Omit<StudentProfile, 'id'>): StudentProfile => {
    const id = `student-${Date.now()}`;
    const fullUser: StudentProfile = {
      ...newUser,
      id
    };
    const updated = [...allUsers, fullUser];
    setAllUsers(updated);
    try {
      localStorage.setItem('campusmate_all_users', JSON.stringify(updated));
    } catch {}
    addToast({
      title: 'New Scholar Registered! 🎓',
      message: `Profile created for ${fullUser.name} (${fullUser.rollNo}).`,
      type: 'success'
    });
    return fullUser;
  };

  const updateProfileAvatar = (newAvatarUrl: string) => {
    setCurrentUser(prev => ({ ...prev, avatar: newAvatarUrl }));
    addToast({
      title: 'Profile Picture Updated! 📸',
      message: 'New avatar saved and applied to your companion pass.',
      type: 'success'
    });
  };

  // Overall attendance calculation
  const totalAttended = attendanceRecords.reduce((acc, curr) => acc + curr.attended, 0);
  const totalClasses = attendanceRecords.reduce((acc, curr) => acc + curr.total, 0);
  const overallAttendance = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  // Unread announcements
  const unreadAnnouncementsCount = announcements.filter(a => !a.isRead).length;

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after configurable undo window (Shneiderman Rule #6)
    setTimeout(() => {
      removeToast(id);
    }, undoWindowSeconds * 1000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // History stack for Undo & Redo (Shneiderman #6, Nielsen #3, Norman #6)
  const [undoStack, setUndoStack] = useState<HistoryAction[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryAction[]>([]);
  const [lastGesture, setLastGesture] = useState<{
    type: 'undo' | 'redo' | 'none';
    message: string;
    timestamp: number;
  } | null>(null);

  const pushHistoryAction = (action: Omit<HistoryAction, 'id' | 'timestamp'>) => {
    const newAction: HistoryAction = {
      ...action,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };
    setUndoStack(prev => [newAction, ...prev].slice(0, 30));
    setRedoStack([]); // New action clears redo stack
  };

  const triggerUndo = (): boolean => {
    if (undoStack.length === 0) {
      setLastGesture({ type: 'none', message: 'Nothing left to undo', timestamp: Date.now() });
      addToast({ title: 'Undo Buffer Empty', message: 'No recent actions to undo.', type: 'info' });
      return false;
    }
    const [actionToUndo, ...remainingUndo] = undoStack;
    actionToUndo.undo();
    setUndoStack(remainingUndo);
    setRedoStack(prev => [actionToUndo, ...prev].slice(0, 30));
    setLastGesture({ type: 'undo', message: actionToUndo.description, timestamp: Date.now() });
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
    } catch {}
    addToast({
      title: '↺ Action Undone (Finger Gesture)',
      message: actionToUndo.description,
      type: 'info',
      undoLabel: 'Redo 👉',
      undoAction: () => triggerRedo()
    });
    return true;
  };

  const triggerRedo = (): boolean => {
    if (redoStack.length === 0) {
      setLastGesture({ type: 'none', message: 'Nothing left to redo', timestamp: Date.now() });
      addToast({ title: 'Redo Buffer Empty', message: 'No undone actions to redo.', type: 'info' });
      return false;
    }
    const [actionToRedo, ...remainingRedo] = redoStack;
    actionToRedo.redo();
    setRedoStack(remainingRedo);
    setUndoStack(prev => [actionToRedo, ...prev].slice(0, 30));
    setLastGesture({ type: 'redo', message: actionToRedo.description, timestamp: Date.now() });
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(40);
    } catch {}
    addToast({
      title: '↻ Action Redone (Finger Gesture)',
      message: actionToRedo.description,
      type: 'success',
      undoLabel: 'Undo 👈',
      undoAction: () => triggerUndo()
    });
    return true;
  };

  const clearHistory = () => {
    setUndoStack([]);
    setRedoStack([]);
  };

  // Toggle assignment completion with satisfying feedback (Shneiderman Rule #3 & #6)
  const toggleAssignmentComplete = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    const willBeCompleted = !assignment.completed;

    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, completed: willBeCompleted };
      }
      return a;
    }));

    pushHistoryAction({
      description: willBeCompleted 
        ? `Completed "${assignment.title}"` 
        : `Reopened "${assignment.title}"`,
      undo: () => {
        setAssignments(curr => curr.map(item => item.id === id ? { ...item, completed: !willBeCompleted } : item));
      },
      redo: () => {
        setAssignments(curr => curr.map(item => item.id === id ? { ...item, completed: willBeCompleted } : item));
      }
    });

    if (willBeCompleted) {
      addToast({
        title: 'Task Completed! 🎉',
        message: `Marked "${assignment.title}" as complete. (Swipe left with finger to Undo)`,
        type: 'success',
        undoLabel: 'Undo 👈',
        undoAction: () => triggerUndo()
      });
    } else {
      addToast({
        title: 'Task Reopened',
        message: `"${assignment.title}" moved back to pending.`,
        type: 'info',
        undoLabel: 'Undo 👈',
        undoAction: () => triggerUndo()
      });
    }
  };

  const addAssignment = (newAsg: Omit<Assignment, 'id'>) => {
    const id = `asg-${Date.now()}`;
    const createdItem: Assignment = { ...newAsg, id };
    setAssignments(prev => [createdItem, ...prev]);

    pushHistoryAction({
      description: `Created task "${createdItem.title}"`,
      undo: () => {
        setAssignments(curr => curr.filter(a => a.id !== id));
      },
      redo: () => {
        setAssignments(curr => [createdItem, ...curr]);
      }
    });

    addToast({
      title: 'Assignment Created',
      message: `"${newAsg.title}" added to your planner.`,
      type: 'success',
      undoLabel: 'Undo 👈',
      undoAction: () => triggerUndo()
    });
  };

  const deleteAssignment = (id: string) => {
    const target = assignments.find(a => a.id === id);
    if (!target) return;

    const deletedItem = { ...target };
    setAssignments(prev => prev.filter(a => a.id !== id));

    pushHistoryAction({
      description: `Deleted "${deletedItem.title}"`,
      undo: () => {
        setAssignments(curr => [deletedItem, ...curr]);
      },
      redo: () => {
        setAssignments(curr => curr.filter(a => a.id !== id));
      }
    });

    addToast({
      title: 'Assignment Removed',
      message: `"${target.title}" was deleted.`,
      type: 'warning',
      undoLabel: 'Undo Delete 👈',
      undoAction: () => triggerUndo()
    });
  };

  // Toggle RSVP for events
  const toggleEventRSVP = (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;

    const isRegistering = !event.registered;

    setEvents(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          registered: isRegistering,
          seatsLeft: isRegistering ? Math.max(0, e.seatsLeft - 1) : e.seatsLeft + 1
        };
      }
      return e;
    }));

    pushHistoryAction({
      description: isRegistering ? `RSVP for "${event.title}"` : `Cancelled RSVP for "${event.title}"`,
      undo: () => {
        setEvents(curr => curr.map(e => e.id === id ? {
          ...e,
          registered: !isRegistering,
          seatsLeft: isRegistering ? e.seatsLeft + 1 : Math.max(0, e.seatsLeft - 1)
        } : e));
      },
      redo: () => {
        setEvents(curr => curr.map(e => e.id === id ? {
          ...e,
          registered: isRegistering,
          seatsLeft: isRegistering ? Math.max(0, e.seatsLeft - 1) : e.seatsLeft + 1
        } : e));
      }
    });

    if (isRegistering) {
      addToast({
        title: 'RSVP Confirmed! 🎟️',
        message: `Registered for "${event.title}". Added to your calendar.`,
        type: 'success',
        undoLabel: 'Undo 👈',
        undoAction: () => triggerUndo()
      });
    } else {
      addToast({
        title: 'RSVP Cancelled',
        message: `You withdrew your registration for "${event.title}".`,
        type: 'info',
        undoLabel: 'Undo 👈',
        undoAction: () => triggerUndo()
      });
    }
  };

  // Announcements
  const markAnnouncementAsRead = (id: string) => {
    const target = announcements.find(a => a.id === id);
    if (!target || target.isRead) return;

    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));

    pushHistoryAction({
      description: `Read announcement "${target.title.slice(0, 24)}..."`,
      undo: () => {
        setAnnouncements(curr => curr.map(a => a.id === id ? { ...a, isRead: false } : a));
      },
      redo: () => {
        setAnnouncements(curr => curr.map(a => a.id === id ? { ...a, isRead: true } : a));
      }
    });
  };

  const markAllAnnouncementsAsRead = () => {
    const prevAnnouncements = [...announcements];
    setAnnouncements(prev => prev.map(a => ({ ...a, isRead: true })));

    pushHistoryAction({
      description: 'Marked all bulletins as read',
      undo: () => {
        setAnnouncements(prevAnnouncements);
      },
      redo: () => {
        setAnnouncements(curr => curr.map(a => ({ ...a, isRead: true })));
      }
    });

    addToast({
      title: 'Announcements Updated',
      message: 'All notices marked as read.',
      type: 'info',
      undoLabel: 'Undo 👈',
      undoAction: () => triggerUndo()
    });
  };

  // Notes bookmark
  const toggleNoteBookmark = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const nextState = !note.bookmarked;
    setNotes(prev => prev.map(n => n.id === id ? { ...n, bookmarked: nextState } : n));

    pushHistoryAction({
      description: nextState ? `Bookmarked "${note.title.slice(0, 24)}..."` : `Removed bookmark for "${note.title.slice(0, 24)}..."`,
      undo: () => {
        setNotes(curr => curr.map(n => n.id === id ? { ...n, bookmarked: !nextState } : n));
      },
      redo: () => {
        setNotes(curr => curr.map(n => n.id === id ? { ...n, bookmarked: nextState } : n));
      }
    });

    addToast({
      title: nextState ? 'Bookmark Saved' : 'Bookmark Removed',
      message: nextState ? `Added "${note.title}" to quick access.` : `Removed "${note.title}" from bookmarks.`,
      type: 'info',
      undoLabel: 'Undo 👈',
      undoAction: () => triggerUndo()
    });
  };

  // Attendance simulation logger with instant reversible action (Shneiderman Rule #6, Nielsen 3)
  const logClassAttendance = (recordId: string, attended: boolean) => {
    const target = attendanceRecords.find(r => r.id === recordId);
    if (!target) return;
    const previousSnapshot = [...attendanceRecords];

    const nextSnapshot = attendanceRecords.map(r => {
      if (r.id === recordId) {
        const newAttended = attended ? r.attended + 1 : r.attended;
        const newTotal = r.total + 1;
        const newPct = Math.round((newAttended / newTotal) * 100);
        const newStatus = newPct < attendanceTarget ? ('warning' as const) : ('safe' as const);
        return {
          ...r,
          attended: newAttended,
          total: newTotal,
          percentage: newPct,
          status: newStatus,
          lastUpdated: 'Just now'
        };
      }
      return r;
    });

    setAttendanceRecords(nextSnapshot);

    pushHistoryAction({
      description: attended ? `Attended ${target.subject}` : `Absence in ${target.subject}`,
      undo: () => {
        setAttendanceRecords(previousSnapshot);
      },
      redo: () => {
        setAttendanceRecords(nextSnapshot);
      }
    });

    addToast({
      title: attended ? 'Class Attended Logged ✓' : 'Absence Logged ⚠️',
      message: `${target.subject}: ${attended ? 'Attended (+1)' : 'Absence recorded'}. Attendance updated.`,
      type: attended ? 'success' : 'warning',
      undoLabel: 'Undo Action 👈',
      undoAction: () => triggerUndo()
    });
  };

  const login = (user?: StudentProfile) => {
    if (user) setCurrentUser(user);
    setIsLoggedIn(true);
    addToast({
      title: 'Welcome Back!',
      message: `Signed in as ${user?.name || currentUser.name}.`,
      type: 'success'
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    addToast({
      title: 'Logged Out',
      message: 'You have been securely signed out.',
      type: 'info'
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        setCurrentUser,
        allUsers,
        addNewUser,
        isLoggedIn,
        login,
        logout,
        searchQuery,
        setSearchQuery,
        timetable,
        selectedDay,
        setSelectedDay,
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
        markAllAnnouncementsAsRead,
        unreadAnnouncementsCount,
        notes,
        toggleNoteBookmark,
        exams,
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        darkMode,
        setDarkMode,
        undoWindowSeconds,
        setUndoWindowSeconds,
        reduceMotion,
        setReduceMotion,
        dyslexiaFont,
        setDyslexiaFont,
        colorBlindMode,
        setColorBlindMode,
        toasts,
        addToast,
        removeToast,
        undoStack,
        redoStack,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        triggerUndo,
        triggerRedo,
        lastGesture,
        clearHistory,
        updateProfileAvatar,
        avatarModalOpen,
        setAvatarModalOpen,
        hciModalOpen,
        setHciModalOpen,
        hciPrinciples: mockHCIPrinciples,
        selectedPrincipleId,
        setSelectedPrincipleId
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
