import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StudentLogin } from './components/student/StudentLogin';
import { StudentVerify } from './components/student/StudentVerify';
import { CbtExamView } from './components/student/CbtExamView';
import { StudentResult } from './components/student/StudentResult';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  Student, 
  ExamSession, 
  ExamSubmission, 
  AdminUser, 
  AppView 
} from './types';
import { 
  getStoredExams, 
  getCurrentAdmin, 
  setCurrentAdmin, 
  clearCurrentAdmin,
  getStoredSubmissions,
  saveSubmission,
  getCurrentAdminSessionId,
  subscribeToAdminCloudSession,
  getAdminLogoutReason,
  setAdminLogoutReason
} from './utils/storage';

const ADMIN_IDLE_TIMEOUT_SECONDS = 120; // 120 detik inaktif -> auto-logout

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('STUDENT_LOGIN');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentExam, setCurrentExam] = useState<ExamSession | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<ExamSubmission | null>(null);
  const [currentAdmin, setCurrentAdminState] = useState<AdminUser | null>(getCurrentAdmin());
  const [adminLogoutReason, setAdminLogoutReasonState] = useState<string | null>(getAdminLogoutReason());
  const [remainingIdleSeconds, setRemainingIdleSeconds] = useState<number>(ADMIN_IDLE_TIMEOUT_SECONDS);

  const lastActivityRef = useRef<number>(Date.now());

  // Function to extend/reset admin idle timer
  const handleExtendAdminSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    setRemainingIdleSeconds(ADMIN_IDLE_TIMEOUT_SECONDS);
  }, []);

  // Admin Logout Handler with specific reasons
  const handleAdminLogout = useCallback((reason?: 'USER_LOGOUT' | 'IDLE_TIMEOUT' | 'REMOTE_DEVICE') => {
    const finalReason = reason || 'USER_LOGOUT';
    setAdminLogoutReason(finalReason === 'USER_LOGOUT' ? null : finalReason);
    setAdminLogoutReasonState(finalReason === 'USER_LOGOUT' ? null : finalReason);
    clearCurrentAdmin(finalReason);
    setCurrentAdminState(null);
    setRemainingIdleSeconds(ADMIN_IDLE_TIMEOUT_SECONDS);
    setCurrentView('ADMIN_LOGIN');
  }, []);

  // 1. INACTIVITY AUTO-LOGOUT MONITOR (120 Detik)
  useEffect(() => {
    if (!currentAdmin) {
      return;
    }

    lastActivityRef.current = Date.now();
    setRemainingIdleSeconds(ADMIN_IDLE_TIMEOUT_SECONDS);

    const onUserInteraction = () => {
      lastActivityRef.current = Date.now();
    };

    const trackedEvents = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click', 'wheel'];
    trackedEvents.forEach((ev) => {
      window.addEventListener(ev, onUserInteraction, { passive: true });
    });

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const remaining = Math.max(0, ADMIN_IDLE_TIMEOUT_SECONDS - elapsedSeconds);
      setRemainingIdleSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        console.warn('Admin idle timeout reached (120s). Auto logging out.');
        handleAdminLogout('IDLE_TIMEOUT');
      }
    }, 1000);

    return () => {
      trackedEvents.forEach((ev) => {
        window.removeEventListener(ev, onUserInteraction);
      });
      clearInterval(interval);
    };
  }, [currentAdmin, handleAdminLogout]);

  // 2. MULTI-DEVICE SESSION ENFORCEMENT VIA FIRESTORE
  // If this admin account logs in on a different device, this device immediately detects it and logs out
  useEffect(() => {
    if (!currentAdmin) return;

    const localSessionId = getCurrentAdminSessionId();
    if (!localSessionId || !currentAdmin.username) return;

    const unsubscribe = subscribeToAdminCloudSession(
      currentAdmin.username,
      localSessionId,
      () => {
        handleAdminLogout('REMOTE_DEVICE');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentAdmin, handleAdminLogout]);

  // Student Flow Handlers
  const handleStudentLoginSuccess = (student: Student, exam: ExamSession) => {
    setCurrentStudent(student);
    setCurrentExam(exam);
    setCurrentView('STUDENT_VERIFY');
  };

  const handleStartExam = () => {
    setCurrentView('STUDENT_EXAM');
  };

  const handleExamFinished = (submission: ExamSubmission) => {
    saveSubmission(submission);
    setLatestSubmission(submission);
    setCurrentView('STUDENT_RESULT');
  };

  const handleReturnToLogin = () => {
    setCurrentStudent(null);
    setCurrentExam(null);
    setLatestSubmission(null);
    setCurrentView('STUDENT_LOGIN');
  };

  // Admin Flow Handlers
  const handleAdminLoginSuccess = (admin: AdminUser) => {
    setAdminLogoutReason(null);
    setAdminLogoutReasonState(null);
    setCurrentAdmin(admin);
    setCurrentAdminState(admin);
    lastActivityRef.current = Date.now();
    setRemainingIdleSeconds(ADMIN_IDLE_TIMEOUT_SECONDS);
    setCurrentView('ADMIN_DASHBOARD');
  };

  const handleSwitchPortal = (target: 'STUDENT' | 'ADMIN') => {
    if (target === 'STUDENT') {
      setCurrentView('STUDENT_LOGIN');
    } else {
      // Opening admin portal: if opened on a different device or session expired, must login again
      const activeAdmin = getCurrentAdmin();
      if (activeAdmin) {
        setCurrentView('ADMIN_DASHBOARD');
      } else {
        setCurrentView('ADMIN_LOGIN');
      }
    }
  };

  const isExamOngoing = currentView === 'STUDENT_EXAM';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar (Hidden during active CBT exam for strict fullscreen anti-cheat) */}
      {!isExamOngoing && (
        <Navbar
          currentView={currentView}
          onSwitchPortal={handleSwitchPortal}
          onLogoutAdmin={handleAdminLogout}
          adminUser={currentAdmin}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: STUDENT LOGIN */}
        {currentView === 'STUDENT_LOGIN' && (
          <StudentLogin
            onLoginSuccess={handleStudentLoginSuccess}
            onGoToAdmin={() => handleSwitchPortal('ADMIN')}
          />
        )}

        {/* VIEW 2: STUDENT DATA VERIFICATION */}
        {currentView === 'STUDENT_VERIFY' && currentStudent && currentExam && (
          <StudentVerify
            student={currentStudent}
            exam={currentExam}
            onStartExam={handleStartExam}
            onBack={handleReturnToLogin}
          />
        )}

        {/* VIEW 3: CBT EXAM SCREEN (ANTI-CHEAT FULLSCREEN ENGINE) */}
        {currentView === 'STUDENT_EXAM' && currentStudent && currentExam && (
          <CbtExamView
            student={currentStudent}
            exam={currentExam}
            onFinishExam={handleExamFinished}
          />
        )}

        {/* VIEW 4: STUDENT EXAM RESULT & RECEIPT */}
        {currentView === 'STUDENT_RESULT' && latestSubmission && (
          <StudentResult
            submission={latestSubmission}
            onReturnHome={handleReturnToLogin}
          />
        )}

        {/* VIEW 5: ADMIN LOGIN */}
        {currentView === 'ADMIN_LOGIN' && (
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onCancel={() => setCurrentView('STUDENT_LOGIN')}
            logoutReason={adminLogoutReason}
          />
        )}

        {/* VIEW 6: ADMIN DASHBOARD */}
        {currentView === 'ADMIN_DASHBOARD' && currentAdmin && (
          <AdminDashboard
            currentAdmin={currentAdmin}
            onLogout={handleAdminLogout}
            remainingIdleSeconds={remainingIdleSeconds}
            onExtendSession={handleExtendAdminSession}
          />
        )}
      </main>

      {/* Footer (Hidden during active CBT exam) */}
      {!isExamOngoing && (
        <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-0.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700">CBT Anti-Cheat Engine v2.4</span>
                <span className="text-slate-400">• Proteksi Kiosk Layar Penuh Aktif</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 pl-4 sm:pl-4">
                created by <span className="font-bold text-indigo-600 tracking-wide">FERI ANGGRIAWAN</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs">
              Sistem Ujian Online Berstandar Nasional untuk SMA (Kelas 10, 11, 12)
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
