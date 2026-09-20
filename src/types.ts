export type ClassGrade10 = '10E1' | '10E2' | '10E3' | '10E4' | '10E5' | '10E6' | '10E7';
export type ClassGrade11 = '11F1' | '11F2' | '11F3' | '11F4' | '11F5' | '11F6' | '11F7';
export type ClassGrade12 = '12F1' | '12F2' | '12F3' | '12F4' | '12F5' | '12F6' | '12F7';

export type StudentClass = ClassGrade10 | ClassGrade11 | ClassGrade12 | string;

export const ALL_CLASSES: StudentClass[] = [
  // Kelas 10
  '10E1', '10E2', '10E3', '10E4', '10E5', '10E6', '10E7',
  // Kelas 11
  '11F1', '11F2', '11F3', '11F4', '11F5', '11F6', '11F7',
  // Kelas 12
  '12F1', '12F2', '12F3', '12F4', '12F5', '12F6', '12F7'
];

export interface Student {
  nisn: string;
  nis?: string;
  name: string;
  studentClass: StudentClass;
  gender?: 'L' | 'P';
}

export interface RegisteredStudent {
  id: string;
  nis: string;            // 4-digit NIS (maksimal 4 angka)
  name: string;           // Nama Lengkap resmi (UPPERCASE)
  studentClass: StudentClass; // Kelas (10E1 - 10E7, 11F1, 12F1)
  gender: 'L' | 'P';
  nisn?: string;          // NISN 10 digit jika ada
  altNis: string[];       // Kunci pencarian alternatif
  schoolOrigin?: string;
}

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  image?: string;
}

export interface Question {
  id: string;
  examId: string;
  number: number;
  text: string;
  image?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D' | 'E';
  points: number;
  explanation?: string;
  createdBy?: string;
  creatorUsername?: string;
  creatorRole?: string;
  createdAt?: string;
}

export interface ExamSession {
  id: string;
  title: string;
  subject: string;
  gradeLevels: ('10' | '11' | '12')[];
  targetClasses: StudentClass[] | 'ALL';
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationMinutes: number;
  token: string;
  totalQuestions: number;
  totalPoints: number;
  kkm: number;
  maxViolations: number;
  status: 'DRAFT' | 'ACTIVE' | 'FINISHED';
  createdAt: string;
  createdBy?: string;
  creatorUsername?: string;
  creatorRole?: string;
}

export interface ViolationEvent {
  id: string;
  studentNisn: string;
  studentName: string;
  studentClass: string;
  examId: string;
  timestamp: string;
  type: 'TAB_SWITCH' | 'WINDOW_BLUR' | 'FULLSCREEN_EXIT' | 'DEVTOOLS_SHORTCUT' | 'KEY_COPY_PASTE' | 'WINDOW_RESIZE';
  description: string;
}

export interface StudentAnswer {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  isDoubtful: boolean;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  studentNisn: string;
  studentName: string;
  studentClass: StudentClass;
  startedAt: string;
  submittedAt: string;
  durationSpentSeconds: number;
  answers: Record<string, StudentAnswer>; // questionId -> answer
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  score: number; // 0 - 100
  totalPointsEarned: number;
  maxTotalPoints: number;
  isPassed: boolean;
  violationCount: number;
  violations: ViolationEvent[];
  status: 'SUBMITTED' | 'AUTO_SUBMITTED_VIOLATION' | 'AUTO_SUBMITTED_TIMEOUT';
}

export interface ActiveStudentExamState {
  nisn: string;
  name: string;
  studentClass: StudentClass;
  examId: string;
  startedAt: number; // timestamp
  currentQuestionIndex: number;
  answers: Record<string, StudentAnswer>;
  violations: ViolationEvent[];
  isLocked: boolean;
  lastActive: number;
}

export type AdminRole = 'SUPER_ADMIN' | 'PENGAWAS' | 'GURU_MAPEL';

export interface AdminUser {
  id: string;
  username: string;
  password: string; // In-memory/storage hashed/clean for demo
  name: string;
  role: AdminRole;
  subject?: string; // Mata pelajaran yang diampu (khusus Guru Mapel)
  createdAt: string;
}

export interface ActiveMonitorProctor {
  adminId: string;
  username: string;
  name: string;
  role: AdminRole;
  subject?: string;
  examId?: string;
  examTitle?: string;
  startedAt: string;
  lastHeartbeat: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string; // username or system
  role: string;
  action: 
    | 'LOGIN' 
    | 'CREATE_EXAM' 
    | 'UPDATE_EXAM' 
    | 'DELETE_EXAM' 
    | 'IMPORT_QUESTIONS' 
    | 'CREATE_QUESTION' 
    | 'UPDATE_QUESTION' 
    | 'DELETE_QUESTION' 
    | 'CREATE_ADMIN' 
    | 'UPDATE_ADMIN' 
    | 'DELETE_ADMIN' 
    | 'CHANGE_PASSWORD' 
    | 'STUDENT_SUBMIT' 
    | 'CHEATING_ALERT'
    | 'MONITOR_EXAM'
    | 'RESET_SUBMISSION';
  target: string;
  details: string;
  level: 'info' | 'warning' | 'danger';
}

export type AppView =
  | 'STUDENT_LOGIN'
  | 'STUDENT_VERIFY'
  | 'STUDENT_EXAM'
  | 'STUDENT_RESULT'
  | 'ADMIN_LOGIN'
  | 'ADMIN_DASHBOARD';
