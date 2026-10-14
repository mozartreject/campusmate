export type NavigationTab = 
  | 'dashboard' 
  | 'timetable' 
  | 'attendance' 
  | 'assignments' 
  | 'notes' 
  | 'exams' 
  | 'events' 
  | 'announcements' 
  | 'settings';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  sapId: string;
  email: string;
  program: string;
  semester: string;
  section: string;
  college: string;
  avatar: string;
  personaType: 'overloaded_planner' | 'overcommitted_achiever' | 'placement_senior';
  personaTitle: string;
  quote: string;
  attendanceTarget: number;
}

export interface ClassSchedule {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  subject: string;
  code: string;
  time: string;
  startTime: string;
  endTime: string;
  faculty: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  color: string;
  isToday: boolean;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface AttendanceRecord {
  id: string;
  subject: string;
  code: string;
  attended: number;
  total: number;
  percentage: number;
  faculty: string;
  room: string;
  status: 'safe' | 'warning' | 'critical';
  color: string;
  lastUpdated: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  dueTime: string;
  deadlineRelative: string;
  priority: PriorityLevel;
  completed: boolean;
  submissionType: 'File Upload' | 'GitHub Link' | 'Document' | 'Presentation';
  description: string;
  points: number;
  tags: string[];
}

export interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string;
  dateObj: string; // ISO
  time: string;
  venue: string;
  seatNo: string;
  daysLeft: number;
  syllabus: string[];
  weightage: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'PPT' | 'Doc' | 'Code';
  size: string;
  uploadedBy: string;
  date: string;
  bookmarked: boolean;
  unit: string;
  downloadCount: number;
  category?: 'Notes' | 'PYQ' | 'Mock Paper';
  year?: string;
  solutionsIncluded?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Academic' | 'Exams' | 'Urgent' | 'Events' | 'Administrative';
  date: string;
  relativeTime: string;
  content: string;
  author: string;
  isUrgent: boolean;
  isRead: boolean;
  pinned?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  venue: string;
  club: string;
  category: 'Hackathon' | 'Workshop' | 'Sports' | 'Cultural';
  registered: boolean;
  seatsLeft: number;
  color: string;
  description: string;
}

export interface HCIPrincipleInfo {
  id: string;
  category: "Donald Norman's 7 Stages" | "Shneiderman's 8 Golden Rules" | "Nielsen's 10 Heuristics" | "Norman's 7 Principles of Design" | "7 Universal Design Principles";
  title: string;
  ruleNumber?: number;
  summary: string;
  campusMateApplication: string;
  uiTarget: string;
}

export interface HistoryAction {
  id: string;
  description: string;
  undo: () => void;
  redo: () => void;
  timestamp: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  undoAction?: () => void;
  undoLabel?: string;
}
