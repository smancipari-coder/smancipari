import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  AdminUser,
  ExamSession,
  Question,
  ExamSubmission,
  ActivityLog,
  ActiveStudentExamState,
  ViolationEvent,
  ActiveMonitorProctor,
  RegisteredStudent
} from '../types';
import {
  INITIAL_ADMINS,
  INITIAL_EXAMS,
  INITIAL_QUESTIONS,
  INITIAL_SUBMISSIONS,
  INITIAL_ACTIVITY_LOGS
} from '../data/initialData';
import {
  INITIAL_REGISTERED_STUDENTS,
  findStudentByNis
} from '../data/studentsData';

// Storage keys for local fallback / cache
const STORAGE_KEYS = {
  ADMINS: 'cbt_admins_v1',
  CURRENT_ADMIN: 'cbt_current_admin_v1',
  EXAMS: 'cbt_exams_v1',
  QUESTIONS: 'cbt_questions_v1',
  SUBMISSIONS: 'cbt_submissions_v1',
  ACTIVE_EXAMS: 'cbt_active_exams_v1',
  ACTIVITY_LOGS: 'cbt_activity_logs_v1',
  CURRENT_STUDENT: 'cbt_current_student_v1',
  ACTIVE_PROCTORS: 'cbt_active_proctors_v1',
  ADMIN_SESSION_ID: 'cbt_admin_session_id_v1',
  ADMIN_LOGOUT_REASON: 'cbt_admin_logout_reason_v1',
  STUDENTS: 'cbt_students_v1',
};

// Firestore collections
const COLLECTIONS = {
  ADMINS: 'cbt_admins',
  EXAMS: 'cbt_exams',
  QUESTIONS: 'cbt_questions',
  SUBMISSIONS: 'cbt_submissions',
  ACTIVE_EXAMS: 'cbt_active_exams',
  ACTIVITY_LOGS: 'cbt_activity_logs',
  ACTIVE_PROCTORS: 'cbt_active_proctors',
  ADMIN_SESSIONS: 'cbt_admin_sessions',
  STUDENTS: 'cbt_students',
};

// Helper to strip any undefined values and prevent Firestore SDK synchronous crashes
function cleanFirestoreData<T>(obj: T): any {
  return JSON.parse(JSON.stringify(obj));
}

// Event bus name for reactive updates
export const CBT_EVENT_VIOLATION = 'cbt_violation_alert';
export const CBT_EVENT_STATE_UPDATE = 'cbt_state_update';

function notifyChange(type: string, detail?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CBT_EVENT_STATE_UPDATE, { detail: { type, ...detail } }));
  }
}

// Track online sync status
let isCloudSynced = false;

// -------------------------------------------------------------
// Real-time Cloud Synchronization Engine (Firestore <-> Local Cache)
// -------------------------------------------------------------
export function initOnlineSync() {
  if (isCloudSynced) return;
  isCloudSynced = true;

  try {
    // 1. Sync Exams
    const examsQuery = query(collection(db, COLLECTIONS.EXAMS));
    onSnapshot(examsQuery, (snapshot) => {
      if (snapshot.empty) {
        // Seed initial exams to cloud if empty
        INITIAL_EXAMS.forEach((exam) => {
          try {
            setDoc(doc(db, COLLECTIONS.EXAMS, exam.id), cleanFirestoreData(exam)).catch(() => {});
          } catch (e) {}
        });
      } else {
        const exams: ExamSession[] = [];
        snapshot.forEach((d) => exams.push(d.data() as ExamSession));
        localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
        notifyChange('EXAMS');
      }
    }, () => {});

    // 2. Sync Questions
    const questionsQuery = query(collection(db, COLLECTIONS.QUESTIONS));
    onSnapshot(questionsQuery, (snapshot) => {
      if (snapshot.empty) {
        INITIAL_QUESTIONS.forEach((q) => {
          try {
            setDoc(doc(db, COLLECTIONS.QUESTIONS, q.id), cleanFirestoreData(q)).catch(() => {});
          } catch (e) {}
        });
      } else {
        const questions: Question[] = [];
        snapshot.forEach((d) => questions.push(d.data() as Question));
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
        notifyChange('QUESTIONS');
      }
    }, () => {});

    // 3. Sync Admins
    const adminsQuery = query(collection(db, COLLECTIONS.ADMINS));
    onSnapshot(adminsQuery, (snapshot) => {
      if (snapshot.empty) {
        INITIAL_ADMINS.forEach((adm) => {
          try {
            setDoc(doc(db, COLLECTIONS.ADMINS, adm.id), cleanFirestoreData(adm)).catch(() => {});
          } catch (e) {}
        });
      } else {
        const admins: AdminUser[] = [];
        snapshot.forEach((d) => admins.push(d.data() as AdminUser));
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
        notifyChange('ADMINS');
      }
    }, () => {});

    // 4. Sync Submissions
    const subsQuery = query(collection(db, COLLECTIONS.SUBMISSIONS));
    onSnapshot(subsQuery, (snapshot) => {
      if (snapshot.empty) {
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS + '_cleared', 'true');
        notifyChange('SUBMISSIONS');
        return;
      }

      const subs: ExamSubmission[] = [];
      snapshot.forEach((d) => {
        subs.push(d.data() as ExamSubmission);
      });

      // Sort newest first
      subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
      localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS + '_cleared');
      notifyChange('SUBMISSIONS');
    }, (err) => {
      console.warn('Submissions snapshot stream warning:', err);
    });

    // 5. Sync Active Student Exams (Live Monitoring)
    const activeExamsQuery = query(collection(db, COLLECTIONS.ACTIVE_EXAMS));
    onSnapshot(activeExamsQuery, (snapshot) => {
      const activeList: ActiveStudentExamState[] = [];
      snapshot.forEach((d) => activeList.push(d.data() as ActiveStudentExamState));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAMS, JSON.stringify(activeList));
      notifyChange('ACTIVE_EXAMS');
    }, () => {});

    // 6. Sync Activity Logs
    const logsQuery = query(collection(db, COLLECTIONS.ACTIVITY_LOGS));
    onSnapshot(logsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const logs: ActivityLog[] = [];
        snapshot.forEach((d) => logs.push(d.data() as ActivityLog));
        // Sort descending by timestamp
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 500)));
        notifyChange('ACTIVITY_LOGS');
      } else {
        INITIAL_ACTIVITY_LOGS.forEach((lg) => {
          try {
            setDoc(doc(db, COLLECTIONS.ACTIVITY_LOGS, lg.id), cleanFirestoreData(lg)).catch(() => {});
          } catch (e) {}
        });
      }
    }, () => {});

    // 7. Sync Active Proctors
    const proctorsQuery = query(collection(db, COLLECTIONS.ACTIVE_PROCTORS));
    onSnapshot(proctorsQuery, (snapshot) => {
      const proctors: ActiveMonitorProctor[] = [];
      const now = Date.now();
      snapshot.forEach((d) => {
        const p = d.data() as ActiveMonitorProctor;
        if (now - p.lastHeartbeat < 120000) {
          proctors.push(p);
        }
      });
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROCTORS, JSON.stringify(proctors));
      notifyChange('ACTIVE_PROCTORS');
    }, () => {});

    // 8. Sync Registered Students (Database Online CBT)
    const studentsQuery = query(collection(db, COLLECTIONS.STUDENTS));
    onSnapshot(studentsQuery, (snapshot) => {
      const isCleared = localStorage.getItem(STORAGE_KEYS.STUDENTS + '_cleared') === 'true';
      if (isCleared) {
        return;
      }
      if (snapshot.empty) {
        // Seed initial students to online cloud Firestore
        seedStudentsToCloud();
      } else {
        const cloudStudents: RegisteredStudent[] = [];
        snapshot.forEach((d) => cloudStudents.push(d.data() as RegisteredStudent));
        
        // Safeguard: Never overwrite a larger local database with a smaller partial cloud snapshot!
        const localStudents = getStoredRegisteredStudents();
        if (cloudStudents.length >= localStudents.length) {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(cloudStudents));
          notifyChange('STUDENTS');
        } else {
          console.log(`Preserved local students (${localStudents.length} siswa vs cloud ${cloudStudents.length} siswa).`);
        }
      }
    }, () => {});

  } catch (err) {
    console.warn('Online sync initialization fallback to local:', err);
  }
}

// Auto-trigger sync
if (typeof window !== 'undefined') {
  initOnlineSync();
}

// --- REGISTERED STUDENTS (DATABASE ONLINE CBT) ---
export function getStoredRegisteredStudents(): RegisteredStudent[] {
  try {
    const isCleared = localStorage.getItem(STORAGE_KEYS.STUDENTS + '_cleared') === 'true';
    if (isCleared) {
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_REGISTERED_STUDENTS));
      return INITIAL_REGISTERED_STUDENTS;
    }
    const parsed = JSON.parse(raw) as RegisteredStudent[];
    return parsed;
  } catch {
    return INITIAL_REGISTERED_STUDENTS;
  }
}

export function findRegisteredStudent(queryNis: string): RegisteredStudent | null {
  if (!queryNis) return null;
  const raw = queryNis.trim();
  const clean = raw.replace(/^0+/, '');

  // 1. Authoritative lookup from active stored database
  const students = getStoredRegisteredStudents();
  const match = students.find((s) => {
    if (s.nis === raw || s.nis.padStart(4, '0') === raw.padStart(4, '0')) return true;
    if (clean && String(parseInt(s.nis, 10)) === clean) return true;
    if (s.altNis && s.altNis.some((a) => a === raw || a === clean || a.padStart(4, '0') === raw.padStart(4, '0'))) return true;
    if (s.nisn && (s.nisn === raw || s.nisn.slice(-4) === raw)) return true;
    return false;
  });
  if (match) return match;

  // 2. If not cleared and still empty, check embedded lookup
  const isCleared = localStorage.getItem(STORAGE_KEYS.STUDENTS + '_cleared') === 'true';
  if (!isCleared && students.length === 0) {
    const fastMatch = findStudentByNis(raw);
    if (fastMatch) return fastMatch;
  }

  return null;
}

export async function saveRegisteredStudent(student: RegisteredStudent): Promise<void> {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS + '_cleared');
  const students = getStoredRegisteredStudents();
  const idx = students.findIndex((s) => s.id === student.id || s.nis === student.nis);
  if (idx >= 0) {
    students[idx] = student;
  } else {
    students.push(student);
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  notifyChange('STUDENTS');

  try {
    await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), cleanFirestoreData(student));
  } catch (err) {
    console.warn('Failed saving student to cloud:', err);
  }
}

export async function updateRegisteredStudent(student: RegisteredStudent): Promise<void> {
  await saveRegisteredStudent(student);
}

export async function deleteRegisteredStudent(studentId: string): Promise<void> {
  const students = getStoredRegisteredStudents().filter((s) => s.id !== studentId);
  if (students.length === 0) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS + '_cleared', 'true');
  }
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  notifyChange('STUDENTS');

  try {
    await deleteDoc(doc(db, COLLECTIONS.STUDENTS, studentId));
  } catch (err) {
    console.warn('Failed deleting student from cloud:', err);
  }
}

export async function clearAllRegisteredStudents(): Promise<void> {
  const currentStudents = getStoredRegisteredStudents();
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.STUDENTS + '_cleared', 'true');
  notifyChange('STUDENTS');

  try {
    // Clean all docs in Firestore collection in background
    for (const student of currentStudents) {
      deleteDoc(doc(db, COLLECTIONS.STUDENTS, student.id)).catch(() => {});
    }
  } catch (err) {
    console.warn('Failed clearing students in cloud:', err);
  }
}

export async function resetRegisteredStudentsToDefault(): Promise<RegisteredStudent[]> {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS + '_cleared');
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_REGISTERED_STUDENTS));
  notifyChange('STUDENTS');

  try {
    await seedStudentsToCloud();
  } catch (err) {
    console.warn('Failed reseeding default students:', err);
  }

  return INITIAL_REGISTERED_STUDENTS;
}

export async function saveBulkRegisteredStudents(
  incomingStudents: RegisteredStudent[],
  replaceAll = false
): Promise<number> {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS + '_cleared');
  let finalStudents: RegisteredStudent[];
  if (replaceAll) {
    finalStudents = [...incomingStudents];
  } else {
    const existing = getStoredRegisteredStudents();
    if (existing.length === 0) {
      finalStudents = [...incomingStudents];
    } else {
      const map = new Map<string, RegisteredStudent>();
      // Index existing by clean NIS
      existing.forEach((s) => {
        const key = s.nis.trim().toLowerCase() || s.id;
        map.set(key, s);
      });
      // Merge or update incoming
      incomingStudents.forEach((s) => {
        const key = s.nis.trim().toLowerCase() || s.id;
        map.set(key, s);
      });
      finalStudents = Array.from(map.values());
    }
  }

  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(finalStudents));
  notifyChange('STUDENTS');

  // Push ALL students to Firestore in batches (Firestore max per batch is 500)
  try {
    const CHUNK_SIZE = 400;
    for (let i = 0; i < finalStudents.length; i += CHUNK_SIZE) {
      const chunk = finalStudents.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      for (const student of chunk) {
        const studentRef = doc(db, COLLECTIONS.STUDENTS, student.id);
        batch.set(studentRef, cleanFirestoreData(student));
      }
      await batch.commit().catch((err) => {
        console.warn('Batch commit chunk notice:', err);
      });
    }
  } catch (err) {
    console.warn('Bulk push notice:', err);
  }

  return finalStudents.length;
}

// Seed students to Firestore in non-blocking batches
export async function seedStudentsToCloud(): Promise<void> {
  try {
    // Only upload essential initial students or in chunks
    const chunk = INITIAL_REGISTERED_STUDENTS.slice(0, 40); // Seed representative sample first
    for (const student of chunk) {
      await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), cleanFirestoreData(student)).catch(() => {});
    }
  } catch (err) {
    console.warn('Seed students notice:', err);
  }
}

// --- ADMIN USERS ---
export function getStoredAdmins(): AdminUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADMINS;
  }
}

export function saveAdmins(admins: AdminUser[]) {
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
  notifyChange('ADMINS');

  // Push to Firestore safely
  admins.forEach((admin) => {
    try {
      const clean = cleanFirestoreData(admin);
      setDoc(doc(db, COLLECTIONS.ADMINS, admin.id), clean).catch((err) => {
        console.warn('Firestore saveAdmins async error:', err);
      });
    } catch (err) {
      console.warn('Firestore saveAdmins sync error:', err);
    }
  });
}

export function deleteAdmin(adminId: string) {
  const admins = getStoredAdmins();
  const updated = admins.filter((a) => a.id !== adminId);
  localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(updated));
  notifyChange('ADMINS');

  try {
    deleteDoc(doc(db, COLLECTIONS.ADMINS, adminId)).catch(() => {});
  } catch (err) {
    console.warn('deleteAdmin error:', err);
  }
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    // Isolated in sessionStorage so that opening on a different device or new browser session always requires logging in again
    const raw = sessionStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    if (raw) {
      return JSON.parse(raw);
    }
    // Clean up any legacy localStorage admin credentials to guarantee no stale cross-device persistence
    if (localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN)) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
    return null;
  } catch {
    return null;
  }
}

export function getCurrentAdminSessionId(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION_ID);
  } catch {
    return null;
  }
}

export function getAdminLogoutReason(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_LOGOUT_REASON);
  } catch {
    return null;
  }
}

export function setAdminLogoutReason(reason: string | null) {
  try {
    if (reason) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_LOGOUT_REASON, reason);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_LOGOUT_REASON);
    }
  } catch {}
}

export function setCurrentAdmin(admin: AdminUser | null, reason?: string) {
  if (admin) {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION_ID, sessionId);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_LOGOUT_REASON);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);

    // Register active session in Cloud Firestore for cross-device single active session enforcement
    try {
      setDoc(doc(db, COLLECTIONS.ADMIN_SESSIONS, admin.username.toLowerCase()), {
        sessionId,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        adminId: admin.id,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        loggedInAt: new Date().toISOString(),
        lastActiveAt: Date.now()
      }).catch((err) => {
        console.warn('Register cloud admin session warning:', err);
      });
    } catch (e) {}
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    if (reason) {
      setAdminLogoutReason(reason);
    }
  }
  notifyChange('CURRENT_ADMIN');
}

export function clearCurrentAdmin(reason?: string) {
  const current = getCurrentAdmin();
  if (current) {
    try {
      deleteDoc(doc(db, COLLECTIONS.ADMIN_SESSIONS, current.username.toLowerCase())).catch(() => {});
    } catch (e) {}
  }
  setCurrentAdmin(null, reason);
}

export function subscribeToAdminCloudSession(
  username: string,
  localSessionId: string,
  onRemoteLoginDetected: () => void
): () => void {
  try {
    const sessionDocRef = doc(db, COLLECTIONS.ADMIN_SESSIONS, username.toLowerCase());
    const unsub = onSnapshot(sessionDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.sessionId && data.sessionId !== localSessionId) {
          console.warn('Admin logged in on a different device! Invalidating current device session.');
          onRemoteLoginDetected();
        }
      }
    }, (err) => {
      console.warn('Admin cloud session stream warning:', err);
    });
    return unsub;
  } catch (err) {
    console.warn('subscribeToAdminCloudSession error:', err);
    return () => {};
  }
}

// --- EXAM SESSIONS ---
export function getStoredExams(): ExamSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
      return INITIAL_EXAMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EXAMS;
  }
}

export function saveExams(exams: ExamSession[]) {
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  notifyChange('EXAMS');

  // Sync to Firestore
  exams.forEach((exam) => {
    try {
      const clean = cleanFirestoreData(exam);
      setDoc(doc(db, COLLECTIONS.EXAMS, exam.id), clean).catch(() => {});
    } catch (err) {
      console.warn('saveExams sync error:', err);
    }
  });
}

export function deleteExam(examId: string) {
  const exams = getStoredExams();
  const updated = exams.filter((e) => e.id !== examId);
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(updated));
  notifyChange('EXAMS');

  try {
    deleteDoc(doc(db, COLLECTIONS.EXAMS, examId)).catch(() => {});
  } catch (err) {
    console.warn('deleteExam error:', err);
  }
}

// --- QUESTIONS ---
export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_QUESTIONS;
  }
}

export function saveQuestions(questions: Question[]) {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  notifyChange('QUESTIONS');

  // Sync to Firestore
  questions.forEach((q) => {
    try {
      const clean = cleanFirestoreData(q);
      setDoc(doc(db, COLLECTIONS.QUESTIONS, q.id), clean).catch(() => {});
    } catch (err) {
      console.warn('saveQuestions sync error:', err);
    }
  });
}

export function getQuestionsByExamId(examId: string): Question[] {
  const all = getStoredQuestions();
  return all.filter((q) => q.examId === examId).sort((a, b) => a.number - b.number);
}

// --- SUBMISSIONS ---
export function getStoredSubmissions(): ExamSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveSubmission(submission: ExamSubmission): Promise<{ success: boolean; cloudSynced: boolean; error?: string }> {
  const subs = getStoredSubmissions();
  const updated = [submission, ...subs.filter((s) => !(s.studentNisn === submission.studentNisn && s.examId === submission.examId))];
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));
  localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS + '_cleared');
  
  // Remove from active exams
  removeActiveStudentExam(submission.studentNisn, submission.examId);

  // Sync to Firestore
  let cloudSynced = false;
  let cloudError: string | undefined;
  try {
    const clean = cleanFirestoreData(submission);
    await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, submission.id), clean);
    cloudSynced = true;
    console.info('Submission successfully saved to Firestore cloud:', submission.id);
  } catch (err: any) {
    cloudError = err?.message || 'Gagal sinkronisasi cloud';
    console.warn('saveSubmission firestore sync error:', err);
  }

  // Add activity log
  addActivityLog({
    actor: submission.studentName,
    role: 'STUDENT',
    action: 'STUDENT_SUBMIT',
    target: `${submission.examTitle} (NISN: ${submission.studentNisn})`,
    details: `Selesai mengerjakan ujian dengan Nilai: ${submission.score.toFixed(1)} / 100 (${submission.totalCorrect} Benar, ${submission.totalIncorrect} Salah). Status: ${submission.status}. Pelanggaran: ${submission.violationCount}x.`,
    level: submission.violationCount > 0 ? 'warning' : 'info'
  });

  notifyChange('SUBMISSIONS');
  return { success: true, cloudSynced, error: cloudError };
}

export async function fetchSubmissionsFromCloud(): Promise<ExamSubmission[]> {
  try {
    const q = query(collection(db, COLLECTIONS.SUBMISSIONS));
    const snapshot = await getDocs(q);
    const subs: ExamSubmission[] = [];
    snapshot.forEach((d) => {
      subs.push(d.data() as ExamSubmission);
    });
    subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
    notifyChange('SUBMISSIONS');
    return subs;
  } catch (err) {
    console.warn('fetchSubmissionsFromCloud error:', err);
    return getStoredSubmissions();
  }
}

export function subscribeToCloudSubmissions(onUpdate: (subs: ExamSubmission[]) => void): () => void {
  try {
    const subsQuery = query(collection(db, COLLECTIONS.SUBMISSIONS));
    return onSnapshot(subsQuery, (snapshot) => {
      const subs: ExamSubmission[] = [];
      snapshot.forEach((d) => {
        subs.push(d.data() as ExamSubmission);
      });
      subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
      onUpdate(subs);
      notifyChange('SUBMISSIONS');
    }, (err) => {
      console.warn('subscribeToCloudSubmissions snapshot error:', err);
    });
  } catch (err) {
    console.warn('subscribeToCloudSubmissions init error:', err);
    return () => {};
  }
}

export function subscribeToActiveExams(onUpdate: (actives: ActiveStudentExamState[]) => void): () => void {
  try {
    const q = query(collection(db, COLLECTIONS.ACTIVE_EXAMS));
    return onSnapshot(q, (snapshot) => {
      const actives: ActiveStudentExamState[] = [];
      snapshot.forEach((d) => actives.push(d.data() as ActiveStudentExamState));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAMS, JSON.stringify(actives));
      onUpdate(actives);
      notifyChange('ACTIVE_EXAMS');
    }, (err) => {
      console.warn('subscribeToActiveExams snapshot error:', err);
    });
  } catch (err) {
    console.warn('subscribeToActiveExams init error:', err);
    return () => {};
  }
}

export function hasStudentTakenExam(nisn: string, examId: string): ExamSubmission | null {
  const subs = getStoredSubmissions();
  return subs.find((s) => s.studentNisn.trim() === nisn.trim() && s.examId === examId) || null;
}

export async function deleteSubmission(submissionId: string): Promise<{ success: boolean; error?: string }> {
  const subs = getStoredSubmissions();
  const target = subs.find((s) => s.id === submissionId);
  const updated = subs.filter((s) => s.id !== submissionId);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));
  if (updated.length === 0) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS + '_cleared', 'true');
  }

  // Delete from Firestore
  let cloudError: string | undefined;
  try {
    await deleteDoc(doc(db, COLLECTIONS.SUBMISSIONS, submissionId));
    console.info('Submission permanently deleted from Firestore cloud:', submissionId);
  } catch (err: any) {
    console.warn('Failed to delete submission from Firestore:', err);
    cloudError = err?.message || 'Gagal menghapus data dari database cloud';
  }

  if (target) {
    addActivityLog({
      actor: 'Admin / Pengawas',
      role: 'ADMIN',
      action: 'UPDATE_EXAM',
      target: `${target.studentName} (${target.studentNisn})`,
      details: `Data lembar jawaban ${target.studentName} dihapus secara permanen dari Database Cloud Firestore dan sistem.`,
      level: 'warning'
    });
  }
  notifyChange('SUBMISSIONS');
  return { success: !cloudError, error: cloudError };
}

export async function clearAllSubmissions(examId?: string): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  const isAll = !examId || examId === 'ALL';
  let cloudError: string | undefined;
  let deletedCount = 0;

  // 1. Delete matching documents directly from Cloud Firestore
  try {
    const collRef = collection(db, COLLECTIONS.SUBMISSIONS);
    const q = isAll ? query(collRef) : query(collRef, where('examId', '==', examId));
    const snap = await getDocs(q);
    deletedCount = snap.size;

    const deletePromises = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
    console.info(`Successfully deleted ${deletedCount} submissions from Firestore permanently.`);
  } catch (err: any) {
    console.warn('Failed to clear submissions from Firestore:', err);
    cloudError = err?.message || 'Gagal mengosongkan rekaman dari database Cloud';
  }

  // 2. Update local storage
  const subs = getStoredSubmissions();
  let remaining: ExamSubmission[] = [];

  if (!isAll) {
    remaining = subs.filter((s) => s.examId !== examId);
    if (remaining.length === 0) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS + '_cleared', 'true');
    }
  } else {
    remaining = [];
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS + '_cleared', 'true');
  }

  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(remaining));

  addActivityLog({
    actor: 'Admin / Pengawas',
    role: 'ADMIN',
    action: 'UPDATE_EXAM',
    target: !isAll ? `Sesi Ujian ID ${examId}` : 'Semua Rekapitulasi Nilai',
    details: `Admin mengosongkan seluruh data rekapitulasi nilai secara permanen dari Database Cloud Firestore (${deletedCount} rekaman terhapus).`,
    level: 'warning'
  });

  notifyChange('SUBMISSIONS');
  return { success: !cloudError, deletedCount, error: cloudError };
}

// --- ACTIVE REALTIME SESSIONS ---
export function getActiveStudentExams(): ActiveStudentExamState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_EXAMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function updateActiveStudentExam(state: ActiveStudentExamState) {
  const actives = getActiveStudentExams().filter(
    (item) => !(item.nisn === state.nisn && item.examId === state.examId)
  );
  actives.push(state);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAMS, JSON.stringify(actives));
  notifyChange('ACTIVE_EXAMS', { nisn: state.nisn, examId: state.examId });

  // Sync to Firestore with composite key
  try {
    const docId = `active_${state.examId}_${state.nisn}`;
    setDoc(doc(db, COLLECTIONS.ACTIVE_EXAMS, docId), cleanFirestoreData(state)).catch(() => {});
  } catch (e) {}
}

export function removeActiveStudentExam(nisn: string, examId: string) {
  const actives = getActiveStudentExams().filter(
    (item) => !(item.nisn === nisn && item.examId === examId)
  );
  localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAMS, JSON.stringify(actives));
  notifyChange('ACTIVE_EXAMS');

  // Remove from Firestore
  try {
    const docId = `active_${examId}_${nisn}`;
    deleteDoc(doc(db, COLLECTIONS.ACTIVE_EXAMS, docId)).catch(() => {});
  } catch (e) {}
}

// --- VIOLATIONS LOGGING ---
export function recordViolation(violation: ViolationEvent) {
  // Update in active student session
  const actives = getActiveStudentExams();
  const target = actives.find(
    (item) => item.nisn === violation.studentNisn && item.examId === violation.examId
  );
  if (target) {
    target.violations = target.violations || [];
    target.violations.push(violation);
    target.lastActive = Date.now();
    updateActiveStudentExam(target);
  }

  // Add to global Activity Log
  addActivityLog({
    actor: 'Detektor Anti-Curang',
    role: 'SYSTEM',
    action: 'CHEATING_ALERT',
    target: `${violation.studentName} (${violation.studentClass} - NISN: ${violation.studentNisn})`,
    details: `Terdeteksi ${violation.type}: ${violation.description} pada ${new Date(violation.timestamp).toLocaleTimeString()}`,
    level: 'danger'
  });

  // Dispatch custom violation event for real-time notification toaster in admin monitor
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CBT_EVENT_VIOLATION, { detail: violation }));
  }
}

// --- ACTIVITY LOGS ---
export function getStoredActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
      return INITIAL_ACTIVITY_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITY_LOGS;
  }
}

export function addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
  const logs = getStoredActivityLogs();
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString()
  };
  const updated = [newLog, ...logs].slice(0, 500); // Keep last 500 logs
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(updated));
  notifyChange('ACTIVITY_LOGS');

  // Push to Firestore
  try {
    const clean = cleanFirestoreData(newLog);
    setDoc(doc(db, COLLECTIONS.ACTIVITY_LOGS, newLog.id), clean).catch(() => {});
  } catch (e) {}
}

export function clearActivityLogs() {
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify([]));
  notifyChange('ACTIVITY_LOGS');
}

// --- ACTIVE PROCTORS / MONITORS ---
export function getActiveProctors(): ActiveMonitorProctor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROCTORS);
    if (!raw) return [];
    const list: ActiveMonitorProctor[] = JSON.parse(raw);
    const now = Date.now();
    const valid = list.filter((p) => now - p.lastHeartbeat < 120000);
    if (valid.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROCTORS, JSON.stringify(valid));
    }
    return valid;
  } catch {
    return [];
  }
}

export function registerActiveProctor(admin: AdminUser, examId?: string, examTitle?: string) {
  try {
    const proctors = getActiveProctors().filter((p) => p.adminId !== admin.id);
    const newProctor: ActiveMonitorProctor = {
      adminId: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      subject: admin.subject,
      examId,
      examTitle,
      startedAt: new Date().toISOString(),
      lastHeartbeat: Date.now()
    };
    proctors.push(newProctor);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROCTORS, JSON.stringify(proctors));
    notifyChange('ACTIVE_PROCTORS');

    // Firestore sync
    try {
      const clean = cleanFirestoreData(newProctor);
      setDoc(doc(db, COLLECTIONS.ACTIVE_PROCTORS, admin.id), clean).catch(() => {});
    } catch (e) {}
  } catch {
    // Ignore storage quota or disabled errors
  }
}

export function updateProctorHeartbeat(adminId: string, examId?: string, examTitle?: string) {
  try {
    const proctors = getActiveProctors();
    const found = proctors.find((p) => p.adminId === adminId);
    if (found) {
      found.lastHeartbeat = Date.now();
      if (examId) found.examId = examId;
      if (examTitle) found.examTitle = examTitle;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROCTORS, JSON.stringify(proctors));
      notifyChange('ACTIVE_PROCTORS');

      try {
        const clean = cleanFirestoreData(found);
        setDoc(doc(db, COLLECTIONS.ACTIVE_PROCTORS, adminId), clean).catch(() => {});
      } catch (e) {}
    }
  } catch {
    // Ignore
  }
}

export function removeActiveProctor(adminId: string) {
  try {
    const proctors = getActiveProctors().filter((p) => p.adminId !== adminId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROCTORS, JSON.stringify(proctors));
    notifyChange('ACTIVE_PROCTORS');

    try {
      deleteDoc(doc(db, COLLECTIONS.ACTIVE_PROCTORS, adminId)).catch(() => {});
    } catch (e) {}
  } catch {
    // Ignore
  }
}
