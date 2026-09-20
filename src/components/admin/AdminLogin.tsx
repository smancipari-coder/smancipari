import React, { useState } from 'react';
import { 
  UserCog, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound,
  Clock,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { AdminUser } from '../../types';
import { getStoredAdmins, addActivityLog, getAdminLogoutReason, setAdminLogoutReason } from '../../utils/storage';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onCancel: () => void;
  logoutReason?: 'IDLE_TIMEOUT' | 'REMOTE_DEVICE' | 'USER_LOGOUT' | string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onCancel, logoutReason }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const activeLogoutReason = logoutReason || getAdminLogoutReason();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUsername = username.trim();
    const cleanPassword = password;

    if (!cleanUsername) {
      setErrorMessage('Username admin atau pengawas wajib diisi.');
      return;
    }

    if (!cleanPassword) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    const admins = getStoredAdmins();
    const found = admins.find(
      (a) => a.username.toLowerCase() === cleanUsername.toLowerCase() && a.password === cleanPassword
    );

    if (!found) {
      setErrorMessage('Username atau kata sandi tidak valid. Pastikan penulisan huruf besar/kecil sesuai.');
      return;
    }

    setAdminLogoutReason(null);

    addActivityLog({
      actor: found.username,
      role: found.role,
      action: 'LOGIN',
      target: 'Dasbor Admin & Pengawas',
      details: `${found.name} (${found.role}) berhasil masuk ke sistem manajemen CBT.`,
      level: 'info'
    });

    onLoginSuccess(found);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-14">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto mb-3 text-indigo-400">
            <UserCog className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Portal Administrator & Pengawas
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Masuk untuk memantau peserta ujian, bank soal, jadwal, dan log kecurangan.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
          {activeLogoutReason === 'IDLE_TIMEOUT' && !errorMessage && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex items-start gap-3 animate-in fade-in shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="font-extrabold text-amber-900 text-[13px]">Sesi Logout Otomatis (120 Detik)</p>
                <p className="text-amber-800 leading-relaxed">
                  Aplikasi telah didiamkan tanpa aktivitas selama <strong>120 detik (2 menit)</strong>. Sesuai protokol keamanan dan perlindungan data ujian, sesi admin telah dilogout secara otomatis. Silakan login kembali.
                </p>
              </div>
            </div>
          )}

          {activeLogoutReason === 'REMOTE_DEVICE' && !errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-xs flex items-start gap-3 animate-in fade-in shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="font-extrabold text-rose-900 text-[13px]">Sesi Terbuka di Perangkat Lain</p>
                <p className="text-rose-800 leading-relaxed">
                  Akun admin Anda baru saja login atau dibuka di perangkat/device lain. Sesuai ketentuan keamanan satu perangkat aktif, Anda wajib login kembali jika ingin melanjutkan di perangkat ini.
                </p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label 
              htmlFor="admin-username-input" 
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Username Akun <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserCog className="w-4 h-4" />
              </div>
              <input
                id="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition font-medium"
                required
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div>
            <label 
              htmlFor="admin-password-input" 
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide"
            >
              Kata Sandi (Password) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Secure Access Information Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Akses Berdasarkan Peran</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Hak akses akan disesuaikan secara otomatis untuk <strong>Super Admin</strong>, <strong>Guru Mapel</strong>, dan <strong>Pengawas Ujian</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              id="btn-back-to-student-portal"
              onClick={onCancel}
              className="w-full sm:flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>← Portal Siswa</span>
            </button>
            <button
              id="btn-submit-admin-login"
              type="submit"
              className="w-full sm:flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Masuk Sistem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
