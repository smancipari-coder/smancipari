import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Calendar, 
  BookOpen, 
  UserCog, 
  History, 
  LogOut, 
  ShieldCheck, 
  FileSpreadsheet, 
  Layers, 
  Bell,
  Share2,
  Clock,
  AlertTriangle,
  Users
} from 'lucide-react';
import { AdminUser, ExamSession } from '../../types';
import { getStoredExams, saveExams, clearCurrentAdmin, CBT_EVENT_VIOLATION } from '../../utils/storage';
import { LiveMonitorTab } from './LiveMonitorTab';
import { StudentsDatabaseTab } from './StudentsDatabaseTab';
import { ExamScheduleTab } from './ExamScheduleTab';
import { QuestionBankTab } from './QuestionBankTab';
import { AdminManagementTab } from './AdminManagementTab';
import { ActivityLogTab } from './ActivityLogTab';
import { ShareAppModal } from '../ShareAppModal';

interface AdminDashboardProps {
  currentAdmin: AdminUser;
  onLogout: () => void;
  remainingIdleSeconds?: number;
  onExtendSession?: () => void;
}

export type AdminTab = 'MONITOR' | 'STUDENTS' | 'SCHEDULE' | 'QUESTIONS' | 'ADMINS' | 'LOGS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentAdmin, 
  onLogout,
  remainingIdleSeconds,
  onExtendSession
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser>(currentAdmin);
  const [activeTab, setActiveTab] = useState<AdminTab>('MONITOR');
  const [exams, setExams] = useState<ExamSession[]>(getStoredExams());
  const [hasNewViolation, setHasNewViolation] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Determine allowed tabs based on role
  // GURU_MAPEL: Pantau & Nilai, Jadwal Ujian, Bank Soal & Excel
  // PENGAWAS: Pantau & Nilai saja
  // SUPER_ADMIN: Semua menu
  const isSuperAdmin = adminUser.role === 'SUPER_ADMIN';
  const isGuruMapel = adminUser.role === 'GURU_MAPEL';
  const isPengawas = adminUser.role === 'PENGAWAS';

  const canAccessTab = (tab: AdminTab): boolean => {
    if (isSuperAdmin) return true;
    if (isGuruMapel) {
      return tab === 'MONITOR' || tab === 'STUDENTS' || tab === 'SCHEDULE' || tab === 'QUESTIONS';
    }
    if (isPengawas) {
      return tab === 'MONITOR' || tab === 'STUDENTS';
    }
    return tab === 'MONITOR';
  };

  // Enforce access control if active tab is not allowed
  useEffect(() => {
    if (!canAccessTab(activeTab)) {
      setActiveTab('MONITOR');
    }
  }, [adminUser.role, activeTab]);

  useEffect(() => {
    const handleViolation = () => {
      setHasNewViolation(true);
    };
    window.addEventListener(CBT_EVENT_VIOLATION, handleViolation);
    return () => {
      window.removeEventListener(CBT_EVENT_VIOLATION, handleViolation);
    };
  }, []);

  const handleExamsUpdated = (updatedExams: ExamSession[]) => {
    setExams(updatedExams);
  };

  const handleTabChange = (tab: AdminTab) => {
    if (!canAccessTab(tab)) return;
    setActiveTab(tab);
    if (tab === 'MONITOR') {
      setHasNewViolation(false);
    }
  };

  const handleConfirmLogout = () => {
    clearCurrentAdmin();
    setShowLogoutModal(false);
    onLogout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Admin Subheader Bar */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black tracking-tight">
                Panel Kontrol CBT & Anti-Cheat
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                adminUser.role === 'SUPER_ADMIN'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-400/30'
                  : adminUser.role === 'GURU_MAPEL'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                  : 'bg-blue-500/30 text-blue-300 border border-blue-400/30'
              }`}>
                {adminUser.role === 'SUPER_ADMIN' 
                  ? 'Super Admin' 
                  : adminUser.role === 'GURU_MAPEL' 
                  ? `Guru Mapel${adminUser.subject ? `: ${adminUser.subject}` : ''}`
                  : 'Pengawas Ujian'}
              </span>

              {remainingIdleSeconds !== undefined && (
                <button
                  type="button"
                  onClick={onExtendSession}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide transition cursor-pointer border ${
                    remainingIdleSeconds <= 30
                      ? 'bg-rose-500/30 text-rose-200 border-rose-400/60 animate-pulse'
                      : remainingIdleSeconds <= 60
                      ? 'bg-amber-500/25 text-amber-200 border-amber-400/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                  title="Sesi otomatis logout jika tidak ada aktivitas selama 120 detik. Klik untuk mereset timer."
                >
                  <Clock className={`w-3 h-3 ${remainingIdleSeconds <= 30 ? 'text-rose-400' : 'text-indigo-400'}`} />
                  <span>
                    Auto Logout: {Math.floor(remainingIdleSeconds / 60)}:{String(remainingIdleSeconds % 60).padStart(2, '0')}
                  </span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Selamat datang, <strong className="text-slate-200">{adminUser.name}</strong> (@{adminUser.username})
              {adminUser.role === 'GURU_MAPEL' && (
                <span className="text-emerald-400 ml-1.5 font-medium">• Akses: Pantau & Nilai, Jadwal Ujian, Bank Soal</span>
              )}
              {adminUser.role === 'PENGAWAS' && (
                <span className="text-blue-400 ml-1.5 font-medium">• Akses: Pantau & Nilai Realtime</span>
              )}
            </p>
          </div>
        </div>

        {/* Action & Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bagikan Link Ujian Siswa Button */}
          <button
            id="btn-admin-share-exam"
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-900/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            title="Bagikan Tautan Ujian Online Siswa & Format Pengumuman WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan Link Ujian Siswa</span>
          </button>

          {/* Tab Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/50">
          {/* Pantau & Nilai (All roles) */}
          <button
            id="tab-btn-monitor"
            onClick={() => handleTabChange('MONITOR')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 relative cursor-pointer ${
              activeTab === 'MONITOR'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Pantau & Nilai</span>
            {hasNewViolation && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 animate-ping" />
            )}
          </button>

          {/* Data Siswa (All roles) */}
          {canAccessTab('STUDENTS') && (
            <button
              id="tab-btn-students"
              onClick={() => handleTabChange('STUDENTS')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'STUDENTS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Data Siswa</span>
            </button>
          )}

          {/* Jadwal Ujian (SUPER_ADMIN and GURU_MAPEL only) */}
          {canAccessTab('SCHEDULE') && (
            <button
              id="tab-btn-schedule"
              onClick={() => handleTabChange('SCHEDULE')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'SCHEDULE'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Ujian</span>
            </button>
          )}

          {/* Bank Soal & Excel (SUPER_ADMIN and GURU_MAPEL only) */}
          {canAccessTab('QUESTIONS') && (
            <button
              id="tab-btn-questions"
              onClick={() => handleTabChange('QUESTIONS')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'QUESTIONS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bank Soal & Excel</span>
            </button>
          )}

          {/* Kelola Admin (SUPER_ADMIN only) */}
          {canAccessTab('ADMINS') && (
            <button
              id="tab-btn-admins"
              onClick={() => handleTabChange('ADMINS')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'ADMINS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Kelola Admin</span>
            </button>
          )}

          {/* Log Aktivitas & Audit (SUPER_ADMIN only) */}
          {canAccessTab('LOGS') && (
            <button
              id="tab-btn-logs"
              onClick={() => handleTabChange('LOGS')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'LOGS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Log Aktivitas</span>
            </button>
          )}

          {/* Dedicated Logout Menu Button */}
          <div className="h-5 w-px bg-slate-700 mx-1 hidden sm:block" />
          <button
            id="admin-logout-menu-btn"
            onClick={() => setShowLogoutModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 hover:border-transparent cursor-pointer shadow-xs active:scale-95"
            title="Keluar dari Panel Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Admin</span>
          </button>
          </div>
        </div>
      </div>

      {/* IN-APP LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Keluar dari Dasbor Admin?</h3>
              <p className="text-xs text-slate-500">
                Sesi aktif Anda sebagai <strong className="text-slate-800">{adminUser.name}</strong> (@{adminUser.username}) akan diakhiri dan Anda akan dikembalikan ke halaman login.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                id="btn-cancel-logout"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-logout-action"
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Ya, Keluar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share / Online Exam Modal */}
      <ShareAppModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
      />

      {/* Main Tab Content View */}
      <div className="transition-all duration-200">
        {activeTab === 'MONITOR' && (
          <LiveMonitorTab exams={exams} currentAdmin={adminUser} />
        )}
        {activeTab === 'STUDENTS' && canAccessTab('STUDENTS') && (
          <StudentsDatabaseTab currentAdmin={adminUser} />
        )}
        {activeTab === 'SCHEDULE' && canAccessTab('SCHEDULE') && (
          <ExamScheduleTab 
            exams={exams} 
            onExamsUpdated={handleExamsUpdated} 
            currentAdmin={adminUser} 
          />
        )}
        {activeTab === 'QUESTIONS' && canAccessTab('QUESTIONS') && (
          <QuestionBankTab 
            exams={exams} 
            onExamsUpdated={handleExamsUpdated} 
            currentAdmin={adminUser} 
          />
        )}
        {activeTab === 'ADMINS' && canAccessTab('ADMINS') && (
          <AdminManagementTab
            currentAdmin={adminUser}
            onAdminUpdated={(updated) => setAdminUser(updated)}
          />
        )}
        {activeTab === 'LOGS' && canAccessTab('LOGS') && (
          <ActivityLogTab currentAdmin={adminUser} exams={exams} />
        )}
      </div>

      {/* FLOATING INACTIVITY WARNING TOAST (LAST 30 SECONDS) */}
      {remainingIdleSeconds !== undefined && remainingIdleSeconds <= 30 && remainingIdleSeconds > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md border-2 border-amber-500 shadow-2xl p-4 rounded-2xl text-white max-w-sm flex items-center gap-3.5 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex flex-col items-center justify-center shrink-0 text-amber-400 font-black">
            <span className="text-base leading-none">{remainingIdleSeconds}</span>
            <span className="text-[9px] uppercase tracking-wider text-amber-300">detik</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-amber-300 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Sesi Hampir Berakhir
            </p>
            <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">
              Tidak ada aktivitas terdeteksi. Sesi admin akan otomatis logout demi keamanan.
            </p>
          </div>
          <button
            type="button"
            onClick={onExtendSession}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-indigo-950/40 shrink-0 active:scale-95 transition"
          >
            Tetap Aktif
          </button>
        </div>
      )}
    </div>
  );
};
