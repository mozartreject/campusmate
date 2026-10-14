import { 
  StudentProfile, 
  ClassSchedule, 
  AttendanceRecord, 
  Assignment, 
  Exam, 
  NoteItem, 
  Announcement, 
  CampusEvent,
  HCIPrincipleInfo 
} from '../types';
import { defaultAvatars } from '../utils/avatarUtils';

export const mockStudents: StudentProfile[] = [
  {
    id: 'student-janvi-porwal',
    name: 'Janvi Porwal',
    rollNo: 'A012',
    sapId: '70562300006',
    email: 'janvi.porwal@nmims.edu.in',
    program: 'B.Tech AI & Data Science',
    semester: 'VII',
    section: 'A',
    college: "SVKM's NMIMS MPSTME",
    avatar: defaultAvatars.janviPorwal,
    personaType: 'overloaded_planner',
    personaTitle: 'Lead Contributor & Designer',
    quote: 'I need one place that tells me what actually matters today without bouncing between four apps.',
    attendanceTarget: 75
  },
  {
    id: 'student-aarav-sharma',
    name: 'Aarav Sharma',
    rollNo: 'A045',
    sapId: '70562300142',
    email: 'aarav.sharma@nmims.edu.in',
    program: 'B.Tech AI & Data Science',
    semester: 'VII',
    section: 'A',
    college: "SVKM's NMIMS MPSTME",
    avatar: defaultAvatars.aaravSharma,
    personaType: 'overloaded_planner',
    personaTitle: 'The Overloaded Planner (Persona)',
    quote: 'I don\'t need another app that gives me more notifications. I need one place that tells me what actually matters today.',
    attendanceTarget: 75
  },
  {
    id: 'student-janvi-jain',
    name: 'Janvi Jain',
    rollNo: 'A011',
    sapId: '70562300089',
    email: 'janvi.jain@nmims.edu.in',
    program: 'B.Tech AI & Data Science',
    semester: 'VII',
    section: 'A',
    college: "SVKM's NMIMS MPSTME",
    avatar: defaultAvatars.janviJain,
    personaType: 'overcommitted_achiever',
    personaTitle: 'Research & UX Lead',
    quote: 'Visual hierarchy and instant recognition are the key to reducing student anxiety.',
    attendanceTarget: 80
  },
  {
    id: 'student-joshua-rebello',
    name: 'Joshua Rebello',
    rollNo: 'S020',
    sapId: '70562200090',
    email: 'joshua.rebello@nmims.edu.in',
    program: 'B.Tech AI & Data Science',
    semester: 'VII',
    section: 'A',
    college: "SVKM's NMIMS MPSTME",
    avatar: defaultAvatars.joshuaRebello,
    personaType: 'placement_senior',
    personaTitle: 'System Architect & HCI Developer',
    quote: 'Good systems give immediate feedback and make irreversible mistakes impossible to commit.',
    attendanceTarget: 75
  }
];

export const mockTimetable: ClassSchedule[] = [
  // Monday (Today)
  {
    id: 'sched-1',
    day: 'Monday',
    subject: 'Human Computer Interaction',
    code: 'CS701',
    time: '08:30 AM - 10:00 AM',
    startTime: '08:30 AM',
    endTime: '10:00 AM',
    faculty: 'Prof. Neha Gupta',
    room: 'Room 403',
    type: 'Lecture',
    color: 'blue',
    isToday: true,
    status: 'completed'
  },
  {
    id: 'sched-2',
    day: 'Monday',
    subject: 'Machine Learning',
    code: 'CS702',
    time: '10:30 AM - 12:30 PM',
    startTime: '10:30 AM',
    endTime: '12:30 PM',
    faculty: 'Dr. Rajesh Sharma',
    room: 'Lab 205',
    type: 'Lab',
    color: 'emerald',
    isToday: true,
    status: 'ongoing'
  },
  {
    id: 'sched-3',
    day: 'Monday',
    subject: 'Data Mining',
    code: 'CS703',
    time: '02:00 PM - 03:30 PM',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    faculty: 'Prof. Amit Roy',
    room: 'Room 501',
    type: 'Lecture',
    color: 'indigo',
    isToday: true,
    status: 'upcoming'
  },
  // Tuesday
  {
    id: 'sched-4',
    day: 'Tuesday',
    subject: 'Database Management Systems',
    code: 'CS704',
    time: '09:00 AM - 10:30 AM',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    faculty: 'Prof. Anjali Desai',
    room: 'Room 402',
    type: 'Lecture',
    color: 'amber',
    isToday: false,
    status: 'upcoming'
  },
  {
    id: 'sched-5',
    day: 'Tuesday',
    subject: 'Cloud Computing & DevOps',
    code: 'CS705',
    time: '11:00 AM - 01:00 PM',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    faculty: 'Dr. Vikram Seth',
    room: 'Lab 301',
    type: 'Lab',
    color: 'violet',
    isToday: false,
    status: 'upcoming'
  },
  {
    id: 'sched-6',
    day: 'Tuesday',
    subject: 'Machine Learning (Tutorial)',
    code: 'CS702-T',
    time: '02:30 PM - 04:00 PM',
    startTime: '02:30 PM',
    endTime: '04:00 PM',
    faculty: 'Dr. Rajesh Sharma',
    room: 'Room 403',
    type: 'Tutorial',
    color: 'emerald',
    isToday: false,
    status: 'upcoming'
  },
  // Wednesday
  {
    id: 'sched-7',
    day: 'Wednesday',
    subject: 'Human Computer Interaction (Lab)',
    code: 'CS701-L',
    time: '08:30 AM - 10:30 AM',
    startTime: '08:30 AM',
    endTime: '10:30 AM',
    faculty: 'Prof. Neha Gupta',
    room: 'Design Lab 4',
    type: 'Lab',
    color: 'blue',
    isToday: false,
    status: 'upcoming'
  },
  {
    id: 'sched-8',
    day: 'Wednesday',
    subject: 'Data Mining',
    code: 'CS703',
    time: '11:15 AM - 12:45 PM',
    startTime: '11:15 AM',
    endTime: '12:45 PM',
    faculty: 'Prof. Amit Roy',
    room: 'Room 501',
    type: 'Lecture',
    color: 'indigo',
    isToday: false,
    status: 'upcoming'
  },
  // Thursday
  {
    id: 'sched-9',
    day: 'Thursday',
    subject: 'Database Management Systems',
    code: 'CS704',
    time: '10:00 AM - 12:00 PM',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    faculty: 'Prof. Anjali Desai',
    room: 'Lab 102',
    type: 'Lab',
    color: 'amber',
    isToday: false,
    status: 'upcoming'
  },
  {
    id: 'sched-10',
    day: 'Thursday',
    subject: 'Major Project Seminar',
    code: 'CS799',
    time: '01:30 PM - 03:30 PM',
    startTime: '01:30 PM',
    endTime: '03:30 PM',
    faculty: 'Project Review Committee',
    room: 'Auditorium 2',
    type: 'Tutorial',
    color: 'rose',
    isToday: false,
    status: 'upcoming'
  },
  // Friday
  {
    id: 'sched-11',
    day: 'Friday',
    subject: 'Cloud Computing & DevOps',
    code: 'CS705',
    time: '09:00 AM - 10:30 AM',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    faculty: 'Dr. Vikram Seth',
    room: 'Room 403',
    type: 'Lecture',
    color: 'violet',
    isToday: false,
    status: 'upcoming'
  },
  {
    id: 'sched-12',
    day: 'Friday',
    subject: 'Ethics in AI & Intellectual Property',
    code: 'HS701',
    time: '11:00 AM - 12:30 PM',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    faculty: 'Prof. S. Kulkarni',
    room: 'Room 501',
    type: 'Lecture',
    color: 'teal',
    isToday: false,
    status: 'upcoming'
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    subject: 'Human Computer Interaction',
    code: 'CS701',
    attended: 23,
    total: 25,
    percentage: 92,
    faculty: 'Prof. Neha Gupta',
    room: 'Room 403',
    status: 'safe',
    color: '#10B981', // green
    lastUpdated: 'Today, 09:30 AM'
  },
  {
    id: 'att-2',
    subject: 'Machine Learning',
    code: 'CS702',
    attended: 26,
    total: 32,
    percentage: 81,
    faculty: 'Dr. Rajesh Sharma',
    room: 'Lab 205',
    status: 'safe',
    color: '#10B981',
    lastUpdated: 'Yesterday'
  },
  {
    id: 'att-3',
    subject: 'Data Mining',
    code: 'CS703',
    attended: 22,
    total: 25,
    percentage: 88,
    faculty: 'Prof. Amit Roy',
    room: 'Room 501',
    status: 'safe',
    color: '#10B981',
    lastUpdated: 'Yesterday'
  },
  {
    id: 'att-4',
    subject: 'Database Management Systems',
    code: 'CS704',
    attended: 18,
    total: 25,
    percentage: 72,
    faculty: 'Prof. Anjali Desai',
    room: 'Room 402',
    status: 'warning', // Below 75%
    color: '#EF4444', // Red/Orange warning
    lastUpdated: '2 days ago'
  },
  {
    id: 'att-5',
    subject: 'Cloud Computing & DevOps',
    code: 'CS705',
    attended: 17,
    total: 20,
    percentage: 85,
    faculty: 'Dr. Vikram Seth',
    room: 'Lab 301',
    status: 'safe',
    color: '#10B981',
    lastUpdated: '3 days ago'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'HCI Interactive Prototype',
    subject: 'Human Computer Interaction (CS701)',
    dueDate: '2026-10-12T23:59:00',
    dueTime: '11:59 PM',
    deadlineRelative: 'Tomorrow, 12 Oct · Due in 1 day',
    priority: 'High',
    completed: false,
    submissionType: 'GitHub Link',
    description: 'Design and implement the high-fidelity interactive prototype applying Shneiderman\'s 8 golden rules and Norman\'s 7 stages of action.',
    points: 25,
    tags: ['Prototype', 'HCI Project', 'High-Fidelity']
  },
  {
    id: 'asg-2',
    title: 'Machine Learning CNN Report',
    subject: 'Machine Learning (CS702)',
    dueDate: '2026-10-14T23:59:00',
    dueTime: '11:59 PM',
    deadlineRelative: 'Wed, 14 Oct · Due in 3 days',
    priority: 'Medium',
    completed: false,
    submissionType: 'File Upload',
    description: 'Submit exploratory data analysis, hyperparameter tuning curves, and comparative evaluation report for Image Classification using CNNs.',
    points: 20,
    tags: ['CNN', 'Python', 'Report']
  },
  {
    id: 'asg-3',
    title: 'DBMS Distributed Transactions Deck',
    subject: 'Database Management Systems (CS704)',
    dueDate: '2026-10-17T23:59:00',
    dueTime: '11:59 PM',
    deadlineRelative: 'Sat, 17 Oct · Due in 6 days',
    priority: 'Low',
    completed: false,
    submissionType: 'Presentation',
    description: 'Prepare a 10-slide deck on distributed consensus, two-phase commit, and ACID vs BASE properties in modern NoSQL clusters.',
    points: 15,
    tags: ['Slides', 'NoSQL', 'Transactions']
  },
  {
    id: 'asg-4',
    title: 'Data Mining Clustering Analysis',
    subject: 'Data Mining (CS703)',
    dueDate: '2026-10-25T23:59:00',
    dueTime: '11:59 PM',
    deadlineRelative: 'Sun, 25 Oct · Due in 14 days',
    priority: 'Medium',
    completed: true,
    submissionType: 'File Upload',
    description: 'Implement K-Means and DBSCAN algorithms on customer segmentation datasets and plot Silhouette analysis scores.',
    points: 20,
    tags: ['K-Means', 'DBSCAN', 'Analytics']
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mid-Term Exam Seating Plan & Passes Released',
    category: 'Exams',
    date: '11 Oct 2026',
    relativeTime: 'Today, 09:30 AM',
    content: 'All Semester VII B.Tech students are hereby informed that the portal for downloading official examination passes is now active. Hall 2 and Hall 3 seating plans are published.',
    author: 'Examination Controller Office',
    isUrgent: true,
    isRead: false,
    pinned: true
  },
  {
    id: 'ann-2',
    title: 'Workshop on AI & Production Model Deployment',
    category: 'Academic',
    date: '10 Oct 2026',
    relativeTime: 'Yesterday, 03:00 PM',
    content: 'Department of Computer Engineering and ACM Student Chapter presents a hands-on masterclass on "Deploying Deep Learning Models to Production using FastAPI and Docker" in Lab 301. Limited to 60 seats.',
    author: 'AI & Data Science Department',
    isUrgent: false,
    isRead: false
  },
  {
    id: 'ann-3',
    title: 'Central Library Server Upgrades & Quiet Hours',
    category: 'Administrative',
    date: '08 Oct 2026',
    relativeTime: '3 days ago',
    content: 'Due to scheduled electrical maintenance and digital repository server upgrades, the physical Central Reference Library will observe quiet study hours this weekend. Digital journals remain accessible via campus VPN.',
    author: 'Chief Librarian',
    isUrgent: false,
    isRead: true
  },
  {
    id: 'ann-4',
    title: 'Major Project Phase 1 Synopsis Submission',
    category: 'Exams',
    date: '05 Oct 2026',
    relativeTime: '6 days ago',
    content: 'Capstone review committee requires all AI & DS groups to submit their Phase 1 problem formulations, literature surveys, and architecture diagrams via the portal.',
    author: 'Academic Registrar',
    isUrgent: true,
    isRead: true
  }
];

export const mockEvents: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'HackNMIMS 2026 Flagship Hackathon',
    date: '18 OCT 2026',
    day: '18',
    month: 'OCT',
    time: '09:00 AM',
    venue: 'Main Auditorium',
    club: 'NMIMS Tech Council & CSI',
    category: 'Hackathon',
    registered: true,
    seatsLeft: 14,
    color: 'bg-blue-600',
    description: '36-hour flagship annual campus hackathon focusing on Generative AI, Sustainable Smart Cities, and FinTech. Cash pool ₹1,50,000.'
  },
  {
    id: 'evt-2',
    title: 'Transformer Architectures & LoRA Fine-Tuning',
    date: '24 OCT 2026',
    day: '24',
    month: 'OCT',
    time: '11:00 AM',
    venue: 'Lab 301',
    club: 'ACM Student Chapter',
    category: 'Workshop',
    registered: false,
    seatsLeft: 8,
    color: 'bg-emerald-600',
    description: 'Deep dive into transformer architectures, LLM fine-tuning with LoRA, and serving pipelines. Hands-on coding in JupyterLab.'
  },
  {
    id: 'evt-3',
    title: 'Annual Inter-Department Sports Fest',
    date: '02 NOV 2026',
    day: '02',
    month: 'NOV',
    time: '04:00 PM',
    venue: 'College Ground',
    club: 'Sports Council',
    category: 'Sports',
    registered: false,
    seatsLeft: 45,
    color: 'bg-indigo-600',
    description: 'Inter-department cricket tournament, futsal showdown, badminton singles, and athletics heats. Cheer on your section!'
  },
  {
    id: 'evt-4',
    title: 'Google Cloud Jam & Vertex AI DevFest',
    date: '10 NOV 2026',
    day: '10',
    month: 'NOV',
    time: '02:00 PM',
    venue: 'Seminar Hall 2',
    club: 'GDG On Campus MPSTME',
    category: 'Workshop',
    registered: false,
    seatsLeft: 25,
    color: 'bg-amber-600',
    description: 'Explore Google Cloud credits, Vertex AI development, and Google Summer of Code orientation.'
  }
];

export const mockExams: Exam[] = [
  {
    id: 'ex-1',
    subject: 'Human Computer Interaction',
    code: 'CS701',
    date: '15 Oct 2026',
    dateObj: '2026-10-15T10:00:00',
    time: '10:00 AM - 01:00 PM',
    venue: 'Exam Hall 3 (4th Floor)',
    seatNo: 'S-412',
    daysLeft: 3,
    syllabus: [
      'Norman\'s Principles of Design & Affordances',
      'Shneiderman\'s 8 Golden Rules & 7 Universal Principles',
      'Fitts\' Law, Hick-Hyman Law & Cognitive Ergonomics',
      'Heuristic Evaluation & Usability Testing Methods'
    ],
    weightage: '40% Mid-Term'
  },
  {
    id: 'ex-2',
    subject: 'Machine Learning',
    code: 'CS702',
    date: '18 Oct 2026',
    dateObj: '2026-10-18T10:00:00',
    time: '10:00 AM - 01:00 PM',
    venue: 'Exam Hall 2 (3rd Floor)',
    seatNo: 'S-412',
    daysLeft: 6,
    syllabus: [
      'Supervised Learning: SVM, Decision Trees, Random Forests',
      'Neural Networks, Backpropagation & Gradient Descent',
      'Convolutional & Recurrent Architectures',
      'Model Evaluation: ROC-AUC, Precision-Recall, F1-Score'
    ],
    weightage: '40% Mid-Term'
  },
  {
    id: 'ex-3',
    subject: 'Data Mining',
    code: 'CS703',
    date: '22 Oct 2026',
    dateObj: '2026-10-22T14:00:00',
    time: '02:00 PM - 05:00 PM',
    venue: 'Lab 204 (2nd Floor)',
    seatNo: 'L-210',
    daysLeft: 10,
    syllabus: [
      'Data Preprocessing & Discretization',
      'Apriori & FP-Growth Association Rules',
      'K-Means, Hierarchical & DBSCAN Clustering',
      'Outlier Detection Techniques'
    ],
    weightage: '40% Mid-Term'
  },
  {
    id: 'ex-4',
    subject: 'Database Management Systems',
    code: 'CS704',
    date: '26 Oct 2026',
    dateObj: '2026-10-26T10:00:00',
    time: '10:00 AM - 01:00 PM',
    venue: 'Exam Hall 3 (4th Floor)',
    seatNo: 'S-412',
    daysLeft: 14,
    syllabus: [
      'Relational Algebra & Normalization up to BCNF',
      'Transaction Processing, ACID & Concurrency Control',
      'Query Optimization Strategies',
      'Distributed Databases & 2PC Protocol'
    ],
    weightage: '40% Mid-Term'
  }
];

export const mockNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Norman\'s 7 Principles & Shneiderman\'s 8 Golden Rules Guide',
    subject: 'Human Computer Interaction',
    type: 'PDF',
    size: '4.2 MB',
    uploadedBy: 'Prof. Neha Gupta',
    date: '28 Sep 2026',
    bookmarked: true,
    unit: 'Unit 2',
    downloadCount: 142
  },
  {
    id: 'note-2',
    title: 'Convolutional Neural Networks & Optimization Algorithms',
    subject: 'Machine Learning',
    type: 'PPT',
    size: '12.8 MB',
    uploadedBy: 'Dr. Rajesh Sharma',
    date: '25 Sep 2026',
    bookmarked: true,
    unit: 'Unit 4',
    downloadCount: 198
  },
  {
    id: 'note-3',
    title: 'Apriori Algorithm & Association Mining Solved Problems',
    subject: 'Data Mining',
    type: 'PDF',
    size: '3.1 MB',
    uploadedBy: 'Prof. Amit Roy',
    date: '22 Sep 2026',
    bookmarked: false,
    unit: 'Unit 3',
    downloadCount: 89
  },
  {
    id: 'note-4',
    title: 'ACID Properties, Two-Phase Locking & Serializability',
    subject: 'Database Management Systems',
    type: 'Doc',
    size: '1.8 MB',
    uploadedBy: 'Prof. Anjali Desai',
    date: '18 Sep 2026',
    bookmarked: false,
    unit: 'Unit 3',
    downloadCount: 110
  },
  {
    id: 'note-5',
    title: 'Usability Testing Protocol & Heuristic Evaluation Worksheet',
    subject: 'Human Computer Interaction',
    type: 'Doc',
    size: '1.2 MB',
    uploadedBy: 'Prof. Neha Gupta',
    date: '15 Sep 2026',
    bookmarked: true,
    unit: 'Unit 5',
    downloadCount: 165
  },
  {
    id: 'note-6',
    title: 'Dockerizing Microservices & Kubernetes Deployment Configs',
    subject: 'Cloud Computing & DevOps',
    type: 'Code',
    size: '850 KB',
    uploadedBy: 'Dr. Vikram Seth',
    date: '12 Sep 2026',
    bookmarked: false,
    unit: 'Unit 2',
    downloadCount: 77,
    category: 'Notes'
  },
  // ========================================================
  // PREVIOUS YEARS QUESTION PAPERS (PYQs)
  // ========================================================
  {
    id: 'note-pyq-1',
    title: 'HCI End-Semester Examination Solved Paper (Nov 2025)',
    subject: 'Human Computer Interaction',
    type: 'PDF',
    size: '3.8 MB',
    uploadedBy: 'Prof. Neha Gupta',
    date: '02 Oct 2026',
    bookmarked: true,
    unit: 'PYQ 2025',
    downloadCount: 312,
    category: 'PYQ',
    year: '2025',
    solutionsIncluded: true
  },
  {
    id: 'note-pyq-2',
    title: 'Machine Learning End-Term PYQ with Model Solutions (Nov 2025)',
    subject: 'Machine Learning',
    type: 'PDF',
    size: '5.4 MB',
    uploadedBy: 'Dr. Rajesh Sharma',
    date: '01 Oct 2026',
    bookmarked: true,
    unit: 'PYQ 2025',
    downloadCount: 285,
    category: 'PYQ',
    year: '2025',
    solutionsIncluded: true
  },
  {
    id: 'note-pyq-3',
    title: 'Data Mining Previous Year Question Paper (Dec 2025 Solved)',
    subject: 'Data Mining',
    type: 'PDF',
    size: '3.2 MB',
    uploadedBy: 'Prof. Amit Roy',
    date: '29 Sep 2026',
    bookmarked: false,
    unit: 'PYQ 2025',
    downloadCount: 164,
    category: 'PYQ',
    year: '2025',
    solutionsIncluded: true
  },
  {
    id: 'note-pyq-4',
    title: 'DBMS Normalization & Concurrency Control PYQ (Nov 2025)',
    subject: 'Database Management Systems',
    type: 'PDF',
    size: '4.1 MB',
    uploadedBy: 'Prof. Anjali Desai',
    date: '28 Sep 2026',
    bookmarked: true,
    unit: 'PYQ 2025',
    downloadCount: 220,
    category: 'PYQ',
    year: '2025',
    solutionsIncluded: true
  },
  {
    id: 'note-pyq-5',
    title: 'Cloud Computing & DevOps Semester VII Paper (May 2025)',
    subject: 'Cloud Computing & DevOps',
    type: 'PDF',
    size: '2.9 MB',
    uploadedBy: 'Dr. Vikram Seth',
    date: '26 Sep 2026',
    bookmarked: false,
    unit: 'PYQ 2025',
    downloadCount: 140,
    category: 'PYQ',
    year: '2025',
    solutionsIncluded: true
  },
  {
    id: 'note-pyq-6',
    title: 'Ethics in AI & Intellectual Property Solved Question Bank (2025)',
    subject: 'Ethics in AI & Intellectual Property',
    type: 'Doc',
    size: '1.9 MB',
    uploadedBy: 'Prof. S. Kulkarni',
    date: '20 Sep 2026',
    bookmarked: false,
    unit: 'PYQ 2025',
    downloadCount: 95,
    category: 'PYQ',
    year: '2025',
    solutionsIncluded: true
  },
  // ========================================================
  // MOCK SAMPLE PAPERS (2026 BLUEPRINT & MODEL PAPERS)
  // ========================================================
  {
    id: 'note-mock-1',
    title: 'HCI Official Mock Sample Question Paper (Sem VII 2026 Blueprint)',
    subject: 'Human Computer Interaction',
    type: 'PDF',
    size: '4.5 MB',
    uploadedBy: 'MPSTME Examination Cell',
    date: '05 Oct 2026',
    bookmarked: true,
    unit: 'Mock 2026',
    downloadCount: 420,
    category: 'Mock Paper',
    year: '2026',
    solutionsIncluded: true
  },
  {
    id: 'note-mock-2',
    title: 'Machine Learning Comprehensive Mock Exam Paper with Marking Scheme',
    subject: 'Machine Learning',
    type: 'PDF',
    size: '6.1 MB',
    uploadedBy: 'Department of AI & DS',
    date: '04 Oct 2026',
    bookmarked: true,
    unit: 'Mock 2026',
    downloadCount: 380,
    category: 'Mock Paper',
    year: '2026',
    solutionsIncluded: true
  },
  {
    id: 'note-mock-3',
    title: 'Data Mining Predictive Model Exam Paper (Association & Clustering)',
    subject: 'Data Mining',
    type: 'PDF',
    size: '3.6 MB',
    uploadedBy: 'Prof. Amit Roy',
    date: '03 Oct 2026',
    bookmarked: false,
    unit: 'Mock 2026',
    downloadCount: 195,
    category: 'Mock Paper',
    year: '2026',
    solutionsIncluded: true
  },
  {
    id: 'note-mock-4',
    title: 'DBMS Model Examination Paper (ACID Transactions & SQL Queries)',
    subject: 'Database Management Systems',
    type: 'PDF',
    size: '3.9 MB',
    uploadedBy: 'Prof. Anjali Desai',
    date: '02 Oct 2026',
    bookmarked: true,
    unit: 'Mock 2026',
    downloadCount: 260,
    category: 'Mock Paper',
    year: '2026',
    solutionsIncluded: true
  },
  {
    id: 'note-mock-5',
    title: 'Cloud Computing & DevOps Model Exam Paper (Kubernetes & CI/CD)',
    subject: 'Cloud Computing & DevOps',
    type: 'PDF',
    size: '4.2 MB',
    uploadedBy: 'Dr. Vikram Seth',
    date: '01 Oct 2026',
    bookmarked: false,
    unit: 'Mock 2026',
    downloadCount: 175,
    category: 'Mock Paper',
    year: '2026',
    solutionsIncluded: true
  }
];

export const mockHCIPrinciples: HCIPrincipleInfo[] = [
  // Shneiderman's 8 Golden Rules
  {
    id: 'shn-1',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 1,
    title: 'Strive for Consistency',
    summary: 'Consistent sequences of actions, terminology, layouts, fonts, and color coding across the entire application.',
    campusMateApplication: 'Unified royal blue brand system, identical card borders and padding, persistent left sidebar, and standardized badge styles across all 10 modules.',
    uiTarget: 'Sidebar navigation & widget cards'
  },
  {
    id: 'shn-2',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 2,
    title: 'Cater to Universal Usability',
    summary: 'Recognize the needs of diverse users and allow customization: beginners to experts, visual adjustments, and high contrast.',
    campusMateApplication: 'High Contrast Mode, dynamic text scaling (Normal/Large/XL), and quick-action shortcuts for time-poor seniors (Karan) vs overloaded planners (Aarav).',
    uiTarget: 'Accessibility toolbar & Settings'
  },
  {
    id: 'shn-3',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 3,
    title: 'Offer Informative Feedback',
    summary: 'For every user action, there should be clear, modest system feedback proportional to the action taken.',
    campusMateApplication: 'Instant toast notifications when completing assignments, dynamic SVG attendance progress updates, and tangible checkmark feedback upon task completion.',
    uiTarget: 'Assignment completion & RSVP buttons'
  },
  {
    id: 'shn-4',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 4,
    title: 'Design Dialogs to Yield Closure',
    summary: 'Sequences of actions should be organized into groups with a beginning, middle, and end, providing satisfaction of accomplishment.',
    campusMateApplication: 'Assignment submission modal with step indicator, review screen, and clear completion confirmation with "Return to Dashboard" action.',
    uiTarget: 'Task & RSVP modals'
  },
  {
    id: 'shn-5',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 5,
    title: 'Prevent Errors',
    summary: 'Design system so that users cannot make serious errors; detect errors immediately and provide constructive error-handling.',
    campusMateApplication: 'Destructive actions (deleting tasks, dropping RSVP, resetting settings) require dual confirmation dialogs; form fields include inline live validation.',
    uiTarget: 'Confirmation modals & forms'
  },
  {
    id: 'shn-6',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 6,
    title: 'Permit Easy Reversal of Actions (Undo)',
    summary: 'Relieves anxiety, since the user knows that errors can be easily undone.',
    campusMateApplication: 'Marking a task as completed triggers an undo banner in the toast notification ("Completed! Click here to Undo within 8 seconds").',
    uiTarget: 'Toast notifications & task checklist'
  },
  {
    id: 'shn-7',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 7,
    title: 'Support Internal Locus of Control',
    summary: 'Experienced users strongly desire the sense that they are in charge of the interface and that the interface responds to their actions.',
    campusMateApplication: 'Students choose their attendance target (75% vs 80%), toggle day vs week timetable views, filter assignments by priority, and switch student personas.',
    uiTarget: 'Attendance target selector & Persona switcher'
  },
  {
    id: 'shn-8',
    category: "Shneiderman's 8 Golden Rules",
    ruleNumber: 8,
    title: 'Reduce Short-Term Memory Load',
    summary: 'Humans have limited capacity for short-term information retention (Miller\'s 7±2 rule). Interfaces must support recognition over recall.',
    campusMateApplication: 'Dashboard surfaces today\'s 3 classes, upcoming deadlines, exam countdown timers, and attendance warning (DBMS at 72%) on a single screen without manual searching.',
    uiTarget: 'Consolidated Dashboard'
  },

  // 7 Principles of Universal Design
  {
    id: 'ud-1',
    category: "7 Universal Design Principles",
    ruleNumber: 1,
    title: 'Equitable Use',
    summary: 'Useful and marketable to people with diverse abilities, avoiding stigmatizing any users.',
    campusMateApplication: 'Identical functionality available in standard mode, high contrast mode, and enlarged font sizes without degrading layout or hiding features.',
    uiTarget: 'Settings & Theme options'
  },
  {
    id: 'ud-2',
    category: "7 Universal Design Principles",
    ruleNumber: 2,
    title: 'Flexibility in Use',
    summary: 'Accommodates a wide range of individual preferences and abilities (choice in methods).',
    campusMateApplication: 'Multiple ways to navigate: sidebar clicks, global search bar with instant query matching, and day/week timetable switcher.',
    uiTarget: 'Global Search & Timetable view'
  },
  {
    id: 'ud-3',
    category: "7 Universal Design Principles",
    ruleNumber: 3,
    title: 'Simple and Intuitive Use',
    summary: 'Easy to understand regardless of the user\'s experience, knowledge, or concentration level.',
    campusMateApplication: 'Clear visual layout mirroring Aarav\'s mental model: morning classes first, urgent deadlines next, attendance safety gauges in familiar traffic light colors.',
    uiTarget: 'Dashboard visual hierarchy'
  },
  {
    id: 'ud-4',
    category: "7 Universal Design Principles",
    ruleNumber: 4,
    title: 'Perceptible Information',
    summary: 'Communicates necessary information effectively, redundant presentation (verbal, pictorial, tactile).',
    campusMateApplication: 'Attendance warnings use both color (red/amber), icons (alert triangle), and explicit explanatory text ("72% - Below 75% threshold, must attend next 3 classes").',
    uiTarget: 'Attendance status indicators'
  },
  {
    id: 'ud-5',
    category: "7 Universal Design Principles",
    ruleNumber: 5,
    title: 'Tolerance for Error',
    summary: 'Minimizes hazards and the adverse consequences of accidental or unintended actions.',
    campusMateApplication: 'Non-destructive design with confirmation modals, explicit discard warnings, and single-click undo.',
    uiTarget: 'Action confirmation dialogs'
  },
  {
    id: 'ud-6',
    category: "7 Universal Design Principles",
    ruleNumber: 6,
    title: 'Low Physical Effort',
    summary: 'Used efficiently and comfortably and with a minimum of fatigue.',
    campusMateApplication: 'Fitts\' Law optimized: high-frequency actions (RSVP, Check task, Search, View full schedule) have generous clickable hit targets (>44px).',
    uiTarget: 'Action buttons & interactive cards'
  },
  {
    id: 'ud-7',
    category: "7 Universal Design Principles",
    ruleNumber: 7,
    title: 'Size and Space for Approach and Use',
    summary: 'Appropriate size and space is provided for approach, reach, manipulation, and use regardless of user\'s body size, posture, or mobility.',
    campusMateApplication: 'Generous card spacing, legible 16px base font with customizable scaling up to 130%, and full keyboard tab-accessibility.',
    uiTarget: 'Overall layout & form inputs'
  },

  // Donald Norman's 7 Stages of Action & The Two Gulfs
  {
    id: 'norm-1',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 1,
    title: 'Stage 1: Establish the Goal',
    summary: 'The user forms the fundamental objective in their mind (e.g., "I need to ensure my attendance meets the 75% college requirement").',
    campusMateApplication: 'Attendance health gauge and safe bunk indicators are immediately prominent on the Academic Hub without cognitive delay.',
    uiTarget: 'Academic Hub & Attendance Tab'
  },
  {
    id: 'norm-2',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 2,
    title: 'Stage 2: Formulate the Intention',
    summary: 'The user turns the broad goal into a specific plan of intent (e.g., "I will use the Bunk Calculator to find my risk margin").',
    campusMateApplication: 'Dedicated, highly visible "Attendance & Bunks" navigation tab with clear mental-model alignment.',
    uiTarget: 'Navigation Sidebar & Breadcrumbs'
  },
  {
    id: 'norm-3',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 3,
    title: 'Stage 3: Specify the Actions at the Interface',
    summary: 'The user identifies the exact interface controls required (e.g., "Select DBMS CS703 from the subject chips").',
    campusMateApplication: 'Course chips display both subject title and course code ("DBMS (CS703) · 72%") to prevent cognitive recall strain.',
    uiTarget: 'Attendance Subject Selector Chips'
  },
  {
    id: 'norm-4',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 4,
    title: 'Stage 4: Execute the Action',
    summary: 'The user physically interacts with the control (presses keys or clicks the mouse).',
    campusMateApplication: 'Generous >44px touch targets with micro-interaction hover and press states to eliminate Fitts\' Law friction.',
    uiTarget: 'Interactive buttons & switches'
  },
  {
    id: 'norm-5',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 5,
    title: 'Stage 5: Perceive the System State',
    summary: 'The user registers the visual or auditory response provided by the interface.',
    campusMateApplication: 'High-contrast emerald/rose outcome banner immediately displays: "You must attend the next 2 consecutive classes".',
    uiTarget: 'Predictive Attendance Outcome Banner'
  },
  {
    id: 'norm-6',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 6,
    title: 'Stage 6: Interpret the System State',
    summary: 'The user makes sense of what they observed and grasps its operational meaning.',
    campusMateApplication: 'System uses plain student language ("2 more classes required to reach 75%") rather than raw mathematical formulas.',
    uiTarget: 'Plain-language calculation summary'
  },
  {
    id: 'norm-7',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 7,
    title: 'Stage 7: Evaluate with Respect to Goal',
    summary: 'The user compares the system outcome with their original goal to determine closure ("Yes, my attendance path is safe").',
    campusMateApplication: 'Closes the Gulf of Evaluation instantly; student achieves confidence and knows their exact next action.',
    uiTarget: 'Attendance & Task closure feedback'
  },
  {
    id: 'norm-gulfs',
    category: "Donald Norman's 7 Stages",
    ruleNumber: 8,
    title: 'Bridging the Two Gulfs (Execution & Evaluation)',
    summary: 'Gulf of Execution: gap between user intention and permitted interface actions. Gulf of Evaluation: gap between system display and user expectation.',
    campusMateApplication: 'Gulf of Execution minimized through 1-click actions and global search; Gulf of Evaluation minimized through dynamic clock-based status badges and undo toasts.',
    uiTarget: 'Global Search, Status Badges & Undo Toasts'
  },

  // Nielsen's 10 Usability Heuristics
  {
    id: 'niel-1',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 1,
    title: 'Visibility of System Status',
    summary: 'The design should always keep users informed about what is going on, through appropriate feedback within a reasonable time.',
    campusMateApplication: 'Dynamic class badge ("● IN SESSION", "UPCOMING", "COMPLETED") computed from live clock; live exam days countdown; toast alerts.',
    uiTarget: 'Timetable status badges & Exam countdowns'
  },
  {
    id: 'niel-2',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 2,
    title: 'Match Between System and Real World',
    summary: 'The design should speak the users\' language, with words, phrases, and concepts familiar to the user, rather than system-oriented terms.',
    campusMateApplication: 'Adopts authentic NMIMS MPSTME terminology: SAP ID, Roll Number, Semester VII, Mid-Term Admit Slips, 75% Bunk rule, and lecture folders.',
    uiTarget: 'Terminology, Admit Slips & Timetable'
  },
  {
    id: 'niel-3',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 3,
    title: 'User Control and Freedom',
    summary: 'Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without an extended process.',
    campusMateApplication: 'Configurable Undo toast for attendance marks and task submissions; cancel buttons on all modals; sign out confirmation dialog.',
    uiTarget: 'Undo toasts & Cancel dialogs'
  },
  {
    id: 'niel-4',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 4,
    title: 'Consistency and Standards',
    summary: 'Users should not have to wonder whether different words, situations, or actions mean the same thing.',
    campusMateApplication: 'Single unified typography (100% Space Grotesk); synchronized breadcrumbs and sidebar labels; standard stepped folder tab geometry.',
    uiTarget: 'Typography, Header Breadcrumbs & Folder Cards'
  },
  {
    id: 'niel-5',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 5,
    title: 'Error Prevention',
    summary: 'Better than good error messages is a careful design which prevents a problem from occurring in the first place.',
    campusMateApplication: 'Confirmation dialog before signing out; input validation on task creation; safe bunk calculator prevents accidental attendance debarment.',
    uiTarget: 'Logout confirmation & Task modal validation'
  },
  {
    id: 'niel-6',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 6,
    title: 'Recognition Rather than Recall',
    summary: 'Minimize the user\'s memory load by making elements, actions, and options visible. The user should not have to remember information from one part to another.',
    campusMateApplication: 'Subject titles displayed alongside codes (e.g., "HCI (CS701)"); document type filter toolbar with color legend; prefilled search suggestions.',
    uiTarget: 'Attendance chips, Library filters & Task lists'
  },
  {
    id: 'niel-7',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 7,
    title: 'Flexibility and Efficiency of Use',
    summary: 'Shortcuts — hidden from novice users — may speed up the interaction for the expert user such that the design can cater to both inexperienced and experienced users.',
    campusMateApplication: 'Timetable day/week switcher; 1-click "Alert Active" toggles; fast demo persona switching for testing; quick upload actions.',
    uiTarget: 'Timetable switcher & Quick action buttons'
  },
  {
    id: 'niel-8',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 8,
    title: 'Aesthetic and Minimalist Design',
    summary: 'Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with the relevant units.',
    campusMateApplication: 'Decluttered hero with compact headline and student greeting; focus calibrator eliminated; generous spacing and clean folder tab cards.',
    uiTarget: 'Decluttered Academic Hub Hero'
  },
  {
    id: 'niel-9',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 9,
    title: 'Help Users Recognize, Diagnose, and Recover from Errors',
    summary: 'Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.',
    campusMateApplication: 'Human-readable toast alerts ("Undo available for 10s", "Please select a valid submission file") with clear resolution buttons.',
    uiTarget: 'Interactive Toast system & Modal alerts'
  },
  {
    id: 'niel-10',
    category: "Nielsen's 10 Heuristics",
    ruleNumber: 10,
    title: 'Help and Documentation',
    summary: 'It’s best if the system doesn’t need any additional explanation, but it may be necessary to provide documentation to help users understand how to complete their tasks.',
    campusMateApplication: 'Integrated HCI Principles modal accessible via top navigation and hero; syllabus reference guidelines; inline tooltips on collapsed sidebar.',
    uiTarget: 'HCI Evaluator modal & Context tooltips'
  },

  // Donald Norman's 7 Principles of Design
  {
    id: 'norm-p1',
    category: "Norman's 7 Principles of Design",
    ruleNumber: 1,
    title: 'Use Knowledge in the World and in the Head',
    summary: 'Combine visible information on the screen with what users already know from memory and mental models.',
    campusMateApplication: 'Displays institutional NMIMS MPSTME conventions (SAP ID, Roll No, Sem VII), pairing course titles with codes (HCI CS701, ML CS702) and stepped physical folder tab cues so students do not rely on pure memory.',
    uiTarget: 'Timetable, Subject chips & Stepped folder cards'
  },
  {
    id: 'norm-p2',
    category: "Norman's 7 Principles of Design",
    ruleNumber: 2,
    title: 'Simplify the Structure of Tasks',
    summary: 'Restructure tasks to be simple, manageable steps rather than overwhelming cognitive processes.',
    campusMateApplication: 'Breaks assignment submissions into a 3-step structured modal (Select File → Verification → Submission Confirmation); student registration is broken into guided inputs with instant avatar presets.',
    uiTarget: 'Assignment upload modal & Scholar registration form'
  },
  {
    id: 'norm-p3',
    category: "Norman's 7 Principles of Design",
    ruleNumber: 3,
    title: 'Make Things Visible',
    summary: 'Ensure key controls and system state are prominent and easily discoverable without hunting.',
    campusMateApplication: 'Clock-driven live class status ("● IN SESSION", "UPCOMING", "COMPLETED"); prominent Color-Blind mode chip in topbar; remaining safe bunk badges; exam hall countdown timers.',
    uiTarget: 'Topbar badges, Live class indicator & Safe bunks widget'
  },
  {
    id: 'norm-p4',
    category: "Norman's 7 Principles of Design",
    ruleNumber: 4,
    title: 'Get the Mappings Right',
    summary: 'Ensure natural mappings where spatial and conceptual relationships between controls and their effects are obvious.',
    campusMateApplication: 'Finger swipe left maps directly to reversing backward in time (Undo); finger swipe right advances forward (Redo); attendance threshold slider shifts the safe bunk margin in real-time.',
    uiTarget: 'Finger gesture HUD, Attendance target slider & Text scale buttons'
  },
  {
    id: 'norm-p5',
    category: "Norman's 7 Principles of Design",
    ruleNumber: 5,
    title: 'Exploit the Power of Constraints',
    summary: 'Use logical, physical, and semantic constraints to make incorrect actions impossible.',
    campusMateApplication: 'Form inputs enforce uppercase division prefixes (A048) and numeric SAP IDs; attendance targets constrained to 50–95%; alert buttons disabled for already concluded classes.',
    uiTarget: 'Login form validation & Concluded class status chips'
  },
  {
    id: 'norm-p6',
    category: "Norman's 7 Principles of Design",
    ruleNumber: 6,
    title: 'Design for Error',
    summary: 'Assume users will make mistakes; design to prevent them, make them easy to discover, and provide instant recovery.',
    campusMateApplication: 'Universal Undo/Redo gesture engine (swipe left/right, Ctrl+Z); configurable action reversal tolerance window (6s, 10s, 15s); dual confirmation dialogs for destructive actions.',
    uiTarget: 'Universal Undo/Redo stack, Toast buffer & Sign out modal'
  },
  {
    id: 'norm-p7',
    category: "Norman's 7 Principles of Design",
    ruleNumber: 7,
    title: 'When All Else Fails, Standardize',
    summary: 'Where natural mappings are difficult, adopt consistent, universally understood standards.',
    campusMateApplication: 'Standardized stepped folder tabs across Library and Dashboard; consistent Mon-to-Fri timetable matrix; unified Space Grotesk typography; standard ISO keyboard shortcuts.',
    uiTarget: 'Consistent tab navigation, Grid matrix & Standardized typography'
  }
];
