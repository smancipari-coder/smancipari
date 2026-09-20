import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  GraduationCap, 
  UserCog, 
  LogOut, 
  BellRing,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Share2,
  Wifi
} from 'lucide-react';
import { AdminUser } from '../types';
import { ShareAppModal } from './ShareAppModal';

interface NavbarProps {
  currentView: 'STUDENT_LOGIN' | 'STUDENT_VERIFY' | 'STUDENT_EXAM' | 'STUDENT_RESULT' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';
  onSwitchPortal?: (portal: 'STUDENT' | 'ADMIN') => void;
  onNavigate?: (view: 'STUDENT_LOGIN' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD') => void;
  adminUser?: AdminUser | null;
  currentAdmin?: AdminUser | null;
  onLogoutAdmin?: () => void;
  onAdminLogout?: () => void;
  activeViolationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchPortal,
  onNavigate,
  adminUser,
  currentAdmin,
  onLogoutAdmin,
  onAdminLogout,
  activeViolationsCount = 0
}) => {
  const [time, setTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const effectiveAdmin = adminUser !== undefined ? adminUser : currentAdmin !== undefined ? currentAdmin : null;

  const handleStudentClick = () => {
    if (onSwitchPortal) {
      onSwitchPortal('STUDENT');
    } else if (onNavigate) {
      onNavigate('STUDENT_LOGIN');
    }
  };

  const handleAdminClick = () => {
    if (onSwitchPortal) {
      onSwitchPortal('ADMIN');
    } else if (onNavigate) {
      onNavigate(effectiveAdmin ? 'ADMIN_DASHBOARD' : 'ADMIN_LOGIN');
    }
  };

  const handleLogout = () => {
    if (onLogoutAdmin) onLogoutAdmin();
    else if (onAdminLogout) onAdminLogout();
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) + ' • ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // If in student exam mode, show a simplified lock bar
  if (currentView === 'STUDENT_EXAM') {
    return null; // The exam view has its own secure full-screen header
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                CBT Guard
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                Anti-Curang
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200" title="Terhubung ke Database Cloud Firestore Realtime">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online Cloud</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Sistem Ujian Online & Deteksi Pelanggaran Real-Time
            </p>
          </div>
        </div>

        {/* Live Clock & Fullscreen Toggle */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600 bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200/60">
          <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span>{time}</span>
          <div className="h-3 w-px bg-slate-300 mx-1" />
          <button 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
            className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Normal' : 'Fullscreen'}</span>
          </button>
        </div>

        {/* Navigation & Portal Switcher with Interactive Styling */}
        <div className="flex items-center gap-2">
          {/* Share / Bagikan Link Ujian Button */}
          <button
            id="nav-share-exam-btn"
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/90 border border-indigo-200/80 transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Bagikan Tautan Ujian Online Siswa & Panduan Publikasi"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Bagikan Link Ujian</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
          {/* Student Portal Button */}
          <button
            id="nav-student-portal-btn"
            onClick={handleStudentClick}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none group active:scale-95 ${
              currentView.startsWith('STUDENT')
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300/50 scale-[1.02] ring-2 ring-indigo-400/30'
                : 'text-slate-600 hover:text-indigo-700 hover:bg-white/90'
            }`}
            title="Beralih ke Portal Ujian Siswa"
          >
            <div className={`p-1 rounded-lg transition-colors ${
              currentView.startsWith('STUDENT') ? 'bg-indigo-500/50 text-white' : 'bg-slate-200 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span>Portal Siswa</span>
            {currentView.startsWith('STUDENT') && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
            )}
          </button>

          {/* Admin Portal Button */}
          {effectiveAdmin ? (
            <div className="flex items-center gap-1">
              <button
                id="nav-admin-dashboard-btn"
                onClick={handleAdminClick}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none group active:scale-95 ${
                  currentView === 'ADMIN_DASHBOARD'
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.02] ring-2 ring-slate-700/30'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/90'
                }`}
                title="Buka Dasbor Pengawasan Admin"
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  currentView === 'ADMIN_DASHBOARD' ? 'bg-slate-800 text-indigo-400' : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                }`}>
                  <UserCog className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline">Dasbor Admin</span>
                <span className="sm:hidden">Admin</span>
                {activeViolationsCount > 0 && (
                  <span className="flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full animate-bounce shadow-xs">
                    {activeViolationsCount}
                  </span>
                )}
              </button>
              
              <button
                id="nav-admin-logout-btn"
                onClick={handleLogout}
                title="Keluar dari akun admin/pengawas"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer active:scale-90"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="nav-admin-login-btn"
              onClick={handleAdminClick}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none group active:scale-95 ${
                currentView === 'ADMIN_LOGIN'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.02] ring-2 ring-slate-700/30'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/90'
              }`}
              title="Masuk ke Panel Pengawas / Admin"
            >
              <div className={`p-1 rounded-lg transition-colors ${
                currentView === 'ADMIN_LOGIN' ? 'bg-slate-800 text-indigo-400' : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
              }`}>
                <UserCog className="w-3.5 h-3.5" />
              </div>
              <span>Login Admin</span>
            </button>
          )}
          </div>
        </div>
      </div>

      {/* Share / Online Exam Modal */}
      <ShareAppModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </header>
  );
};
