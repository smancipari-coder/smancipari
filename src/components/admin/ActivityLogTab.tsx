import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  ShieldAlert, 
  UserCog, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Eye,
  Activity,
  Radio,
  FileSpreadsheet,
  Layers,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { ActivityLog, ActiveMonitorProctor } from '../../types';
import { 
  getStoredActivityLogs, 
  clearActivityLogs, 
  getActiveProctors, 
  CBT_EVENT_STATE_UPDATE 
} from '../../utils/storage';

export const ActivityLogTab: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>(getStoredActivityLogs());
  const [activeProctors, setActiveProctors] = useState<ActiveMonitorProctor[]>(getActiveProctors());
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);

  const reloadData = () => {
    setLogs(getStoredActivityLogs());
    setActiveProctors(getActiveProctors());
  };

  useEffect(() => {
    reloadData();

    const handleUpdate = () => {
      reloadData();
    };

    window.addEventListener(CBT_EVENT_STATE_UPDATE, handleUpdate);
    const interval = setInterval(reloadData, 3000);

    return () => {
      window.removeEventListener(CBT_EVENT_STATE_UPDATE, handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleConfirmClearLogs = () => {
    clearActivityLogs();
    setLogs([]);
    setShowClearConfirmModal(false);
  };

  // Stats calculation
  const questionLogs = logs.filter(
    (l) => l.action.includes('QUESTION') || l.action === 'IMPORT_QUESTIONS'
  );
  const examLogs = logs.filter((l) => l.action.includes('EXAM'));
  const proctorLogs = logs.filter(
    (l) => l.action === 'RESET_SUBMISSION' || l.actor.includes('Pengawas') || l.role === 'PENGAWAS' || l.details.toLowerCase().includes('pantau')
  );
  const cheatingLogs = logs.filter((l) => l.action === 'CHEATING_ALERT');

  // Distinct actors for questions
  const questionAuthors = Array.from(new Set(questionLogs.map((l) => l.actor)));
  // Distinct actors for exams
  const examSchedulers = Array.from(new Set(examLogs.map((l) => l.actor)));

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'ALL') {
      if (filterAction === 'QUESTION') {
        if (!log.action.includes('QUESTION') && log.action !== 'IMPORT_QUESTIONS') return false;
      } else if (filterAction === 'EXAM') {
        if (!log.action.includes('EXAM')) return false;
      } else if (filterAction === 'PROCTOR') {
        const isProctorRelated = 
          log.role === 'PENGAWAS' || 
          log.actor.toLowerCase().includes('pengawas') || 
          log.action === 'RESET_SUBMISSION' || 
          log.details.toLowerCase().includes('pantau') ||
          log.details.toLowerCase().includes('pengawas');
        if (!isProctorRelated) return false;
      } else if (filterAction === 'CHEATING') {
        if (log.action !== 'CHEATING_ALERT') return false;
      } else if (filterAction === 'SUBMISSION') {
        if (log.action !== 'STUDENT_SUBMIT') return false;
      } else if (filterAction === 'ADMIN') {
        if (!log.action.includes('ADMIN') && log.action !== 'CHANGE_PASSWORD' && log.action !== 'LOGIN') return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.role.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const getActionBadge = (action: ActivityLog['action']) => {
    switch (action) {
      case 'CREATE_QUESTION':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <BookOpen className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Tambah Butir Soal',
        };
      case 'IMPORT_QUESTIONS':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          icon: <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />,
          label: 'Impor Soal Excel',
        };
      case 'UPDATE_QUESTION':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <BookOpen className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Edit Butir Soal',
        };
      case 'DELETE_QUESTION':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Hapus Butir Soal',
        };
      case 'CREATE_EXAM':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: <Calendar className="w-3.5 h-3.5 text-blue-600" />,
          label: 'Tambah Jadwal Ujian',
        };
      case 'UPDATE_EXAM':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: <Calendar className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'Update Jadwal Ujian',
        };
      case 'DELETE_EXAM':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: <Trash2 className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Hapus Jadwal Ujian',
        };
      case 'CHEATING_ALERT':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Pelanggaran Anti-Curang',
        };
      case 'RESET_SUBMISSION':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <RefreshCw className="w-3.5 h-3.5 text-amber-600" />,
          label: 'Reset Akses Ujian',
        };
      case 'LOGIN':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: <UserCog className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Admin Masuk',
        };
      case 'STUDENT_SUBMIT':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Kumpul Ujian',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: <History className="w-3.5 h-3.5 text-slate-500" />,
          label: action,
        };
    }
  };

  const getRoleBadge = (role: string) => {
    const r = role.toUpperCase();
    if (r.includes('SUPER')) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
          Super Admin
        </span>
      );
    }
    if (r.includes('GURU')) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Guru Mapel
        </span>
      );
    }
    if (r.includes('PENGAWAS')) {
      return (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
          Pengawas Ujian
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Audit Trail & Pemantau Aktivitas Sistem</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Memonitor secara transparan siapa saja yang menambahkan jadwal ujian, menyusun bank soal, serta pengawas yang sedang memantau ruang ujian.
          </p>
        </div>

        <button
          onClick={() => setShowClearConfirmModal(true)}
          disabled={logs.length === 0}
          className="self-start sm:self-auto px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Bersihkan Riwayat Log</span>
        </button>
      </div>

      {/* Overview Metric Cards (Super Admin Transparency) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Penambahan Soal */}
        <div 
          onClick={() => setFilterAction(filterAction === 'QUESTION' ? 'ALL' : 'QUESTION')}
          className={`bg-white rounded-2xl border p-4 transition cursor-pointer shadow-sm ${
            filterAction === 'QUESTION' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Penyusun Bank Soal</span>
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-black rounded-lg border border-emerald-200">
              {questionLogs.length} Aksi
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600 font-medium">
              {questionAuthors.length > 0 ? (
                <span>Ditambahkan oleh: <strong className="text-slate-900">{questionAuthors.slice(0, 3).join(', ')}{questionAuthors.length > 3 ? ` +${questionAuthors.length - 3} lainnya` : ''}</strong></span>
              ) : (
                <span className="text-slate-400">Belum ada riwayat penambahan soal</span>
              )}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span>Klik untuk filter log soal</span>
              <span>→</span>
            </p>
          </div>
        </div>

        {/* Card 2: Penambahan Jadwal */}
        <div 
          onClick={() => setFilterAction(filterAction === 'EXAM' ? 'ALL' : 'EXAM')}
          className={`bg-white rounded-2xl border p-4 transition cursor-pointer shadow-sm ${
            filterAction === 'EXAM' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Pembuat Jadwal Ujian</span>
            </span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-black rounded-lg border border-blue-200">
              {examLogs.length} Sesi
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600 font-medium">
              {examSchedulers.length > 0 ? (
                <span>Dibuat oleh: <strong className="text-slate-900">{examSchedulers.slice(0, 3).join(', ')}{examSchedulers.length > 3 ? ` +${examSchedulers.length - 3} lainnya` : ''}</strong></span>
              ) : (
                <span className="text-slate-400">Belum ada riwayat pembuatan jadwal</span>
              )}
            </div>
            <p className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
              <span>Klik untuk filter log jadwal</span>
              <span>→</span>
            </p>
          </div>
        </div>

        {/* Card 3: Pengawas Aktif & Pemantau */}
        <div 
          onClick={() => setFilterAction(filterAction === 'PROCTOR' ? 'ALL' : 'PROCTOR')}
          className={`bg-white rounded-2xl border p-4 transition cursor-pointer shadow-sm ${
            filterAction === 'PROCTOR' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Pengawas & Pemantauan</span>
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{activeProctors.length} Aktif Online</span>
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-slate-600 font-medium">
              {activeProctors.length > 0 ? (
                <span>Sedang memantau: <strong className="text-slate-900">{activeProctors.map(p => p.name).join(', ')}</strong></span>
              ) : (
                <span className="text-slate-400">Tidak ada pengawas di tab pantau saat ini</span>
              )}
            </div>
            <p className="text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
              <span>Lihat daftar pengawas aktif & aksi</span>
              <span>→</span>
            </p>
          </div>
        </div>
      </div>

      {/* LIVE PROCTORS SECTION WIDGET */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 relative"></div>
            </div>
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <span>Pengawas Ujian yang Sedang Memantau (Real-time Live)</span>
            </h3>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Diperbarui otomatis setiap beberapa detik</span>
          </div>
        </div>

        <div className="mt-4">
          {activeProctors.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              <Radio className="w-6 h-6 text-slate-500 mx-auto mb-2 opacity-50" />
              <p>Belum ada pengawas atau guru yang sedang membuka tab "Pantau & Nilai".</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Setiap kali Pengawas atau Guru Mapel membuka dasbor pantau, nama dan sesi yang mereka awasi akan tercatat di sini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeProctors.map((proctor) => (
                <div 
                  key={proctor.adminId}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3.5 space-y-2 hover:bg-white/15 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>{proctor.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono">
                        @{proctor.username}
                      </div>
                    </div>
                    <div>
                      {proctor.role === 'GURU_MAPEL' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Guru Mapel
                        </span>
                      ) : proctor.role === 'SUPER_ADMIN' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Super Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Pengawas
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5">
                    {proctor.subject && (
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-[11px] text-slate-400">Mata Pelajaran:</span>
                        <span className="font-bold text-white">{proctor.subject}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-[11px] text-slate-400">Sesi yang Dipantau:</span>
                      <span className="font-bold text-indigo-300 truncate max-w-[150px]">
                        {proctor.examTitle || 'Semua Sesi'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-[11px] text-slate-400">Status Proctor:</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Aktif Memantau</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FILTER BUTTONS & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterAction('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                filterAction === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({logs.length})
            </button>
            <button
              onClick={() => setFilterAction('QUESTION')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterAction === 'QUESTION'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bank Soal ({questionLogs.length})</span>
            </button>
            <button
              onClick={() => setFilterAction('EXAM')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterAction === 'EXAM'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Ujian ({examLogs.length})</span>
            </button>
            <button
              onClick={() => setFilterAction('PROCTOR')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterAction === 'PROCTOR'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pengawas & Reset ({proctorLogs.length})</span>
            </button>
            <button
              onClick={() => setFilterAction('CHEATING')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterAction === 'CHEATING'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Anti-Curang ({cheatingLogs.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pelaku, mapel, deskripsi..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* LOG DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/90 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Pelaku / Aktor</th>
                <th className="py-3 px-4">Peran</th>
                <th className="py-3 px-4">Jenis Aksi</th>
                <th className="py-3 px-4">Target Objek</th>
                <th className="py-3 px-4">Rincian Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-slate-600">Tidak ada catatan aktivitas yang cocok.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Coba ubah kata kunci pencarian atau tombol filter di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const badge = getActionBadge(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{log.actor}</div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getRoleBadge(log.role)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${badge.bg}`}>
                          {badge.icon}
                          <span>{badge.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 max-w-[160px] truncate">
                        {log.target}
                      </td>
                      <td className="py-3 px-4 text-slate-600 leading-relaxed max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION MODAL: BERSIHKAN LOG */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Bersihkan Seluruh Riwayat Log?</h3>
              <p className="text-xs text-slate-500">
                Tindakan ini akan mengosongkan seluruh audit trail aktivitas sistem, termasuk riwayat perubahan soal, jadwal, dan deteksi kecurangan. Data ini tidak dapat dipulihkan kembali.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmClearLogs}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Ya, Bersihkan Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
