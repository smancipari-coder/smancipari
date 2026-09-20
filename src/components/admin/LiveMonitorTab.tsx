import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Search, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertTriangle, 
  Clock, 
  FileSpreadsheet, 
  Filter, 
  BookOpen, 
  Check, 
  X,
  Radio,
  ArrowUpDown,
  RefreshCw,
  Trash2,
  Loader2
} from 'lucide-react';
import { 
  ExamSession, 
  ExamSubmission, 
  ActiveStudentExamState, 
  StudentClass, 
  ALL_CLASSES, 
  Question,
  AdminUser
} from '../../types';
import { 
  getActiveStudentExams, 
  getStoredSubmissions, 
  getQuestionsByExamId,
  deleteSubmission,
  clearAllSubmissions,
  removeActiveStudentExam,
  registerActiveProctor,
  updateProctorHeartbeat,
  removeActiveProctor,
  getActiveProctors,
  addActivityLog,
  subscribeToCloudSubmissions,
  subscribeToActiveExams,
  fetchSubmissionsFromCloud,
  CBT_EVENT_VIOLATION,
  CBT_EVENT_STATE_UPDATE
} from '../../utils/storage';
import { exportSubmissionsToExcel } from '../../utils/excelHelper';

interface LiveMonitorTabProps {
  exams: ExamSession[];
  currentAdmin?: AdminUser;
}

export const LiveMonitorTab: React.FC<LiveMonitorTabProps> = ({ exams, currentAdmin }) => {
  const [activeSessions, setActiveSessions] = useState<ActiveStudentExamState[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  
  // Filters for submissions table
  const [selectedExamId, setSelectedExamId] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'HIGHEST_SCORE' | 'LOWEST_SCORE' | 'MOST_VIOLATIONS'>('NEWEST');

  // Modal for viewing student answer sheet
  const [selectedSubmissionForDetail, setSelectedSubmissionForDetail] = useState<ExamSubmission | null>(null);
  const [questionsForDetail, setQuestionsForDetail] = useState<Question[]>([]);

  // In-app modal for reset & delete submission
  const [submissionToReset, setSubmissionToReset] = useState<ExamSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ExamSubmission | null>(null);
  const [activeSessionToReset, setActiveSessionToReset] = useState<ActiveStudentExamState | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState<boolean>(false);
  const [isClearingAll, setIsClearingAll] = useState<boolean>(false);
  const [isDeletingSingle, setIsDeletingSingle] = useState<boolean>(false);
  const [isResettingSingle, setIsResettingSingle] = useState<boolean>(false);

  // Live Toast for new violations
  const [recentViolationAlert, setRecentViolationAlert] = useState<any | null>(null);

  // Cloud Sync State
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [cloudSyncMessage, setCloudSyncMessage] = useState<string>('');

  const reloadData = () => {
    setActiveSessions(getActiveStudentExams());
    setSubmissions(getStoredSubmissions());
  };

  const handleManualSyncCloud = async () => {
    setIsSyncingCloud(true);
    setCloudSyncMessage('');
    try {
      const cloudSubs = await fetchSubmissionsFromCloud();
      setSubmissions(cloudSubs);
      setCloudSyncMessage(`Berhasil menyinkronkan ${cloudSubs.length} data lembar jawaban langsung dari server online Cloud.`);
    } catch (e) {
      console.warn('Manual sync error:', e);
      setCloudSyncMessage('Menggunakan data cache lokal.');
    } finally {
      setIsSyncingCloud(false);
      setTimeout(() => {
        setCloudSyncMessage('');
      }, 6000);
    }
  };

  useEffect(() => {
    reloadData();

    // Direct Firestore real-time subscriptions for instant cross-device updates
    const unsubscribeSubs = subscribeToCloudSubmissions((cloudSubs) => {
      setSubmissions(cloudSubs);
    });

    const unsubscribeActives = subscribeToActiveExams((cloudActives) => {
      setActiveSessions(cloudActives);
    });

    // Register active proctor if admin is logged in
    if (currentAdmin) {
      registerActiveProctor(
        currentAdmin,
        selectedExamId !== 'ALL' ? selectedExamId : undefined,
        selectedExamId !== 'ALL' ? exams.find(e => e.id === selectedExamId)?.title : 'Semua Sesi Ujian'
      );
    }

    const handleViolationAlert = (e: any) => {
      setRecentViolationAlert(e.detail);
      reloadData();
      // Auto-hide alert banner after 8s
      setTimeout(() => {
        setRecentViolationAlert(null);
      }, 8000);
    };

    const handleStateUpdate = () => {
      reloadData();
    };

    window.addEventListener(CBT_EVENT_VIOLATION, handleViolationAlert);
    window.addEventListener(CBT_EVENT_STATE_UPDATE, handleStateUpdate);

    const interval = setInterval(() => {
      reloadData();
      if (currentAdmin) {
        updateProctorHeartbeat(currentAdmin.id);
      }
    }, 4000);

    return () => {
      unsubscribeSubs();
      unsubscribeActives();
      window.removeEventListener(CBT_EVENT_VIOLATION, handleViolationAlert);
      window.removeEventListener(CBT_EVENT_STATE_UPDATE, handleStateUpdate);
      clearInterval(interval);
      if (currentAdmin) {
        removeActiveProctor(currentAdmin.id);
      }
    };
  }, [currentAdmin, selectedExamId]);

  // Filter Submissions
  const filteredSubmissions = submissions
    .filter((sub) => {
      if (selectedExamId !== 'ALL' && sub.examId !== selectedExamId) return false;
      if (selectedClass !== 'ALL' && sub.studentClass !== selectedClass) return false;
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchesName = sub.studentName.toLowerCase().includes(query);
        const matchesNisn = sub.studentNisn.toLowerCase().includes(query);
        if (!matchesName && !matchesNisn) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === 'HIGHEST_SCORE') return b.score - a.score;
      if (sortBy === 'LOWEST_SCORE') return a.score - b.score;
      if (sortBy === 'MOST_VIOLATIONS') return b.violationCount - a.violationCount;
      return 0;
    });

  // Open detail answer sheet modal
  const handleOpenDetail = (sub: ExamSubmission) => {
    setSelectedSubmissionForDetail(sub);
    const qs = getQuestionsByExamId(sub.examId);
    setQuestionsForDetail(qs);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const examObj = exams.find((e) => e.id === selectedExamId);
    const examTitle = examObj ? examObj.title : 'Semua_Sesi_Ujian';
    exportSubmissionsToExcel(filteredSubmissions, examTitle);
  };

  return (
    <div className="space-y-8">
      {/* REAL-TIME VIOLATION POPUP ALERT BANNER */}
      {recentViolationAlert && (
        <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 animate-bounce">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm uppercase tracking-wider">
                  Deteksi Kecurangan Real-Time!
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20">
                  {recentViolationAlert.type}
                </span>
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                Siswa: <strong>{recentViolationAlert.studentName}</strong> ({recentViolationAlert.studentClass} - NIS: {recentViolationAlert.studentNisn}) • {recentViolationAlert.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setRecentViolationAlert(null)}
            className="p-1.5 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: LIVE ACTIVE SESSIONS MONITORING */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <span>Pemantauan Langsung (Live Exam Monitoring)</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {activeSessions.length} Siswa Aktif
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Memantau secara real-time status fokus peramban, nomor soal yang dikerjakan, dan pelanggaran layar siswa.
              </p>
            </div>
          </div>

          <button
            onClick={reloadData}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Perbarui Data</span>
          </button>
        </div>

        {activeSessions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
            Tidak ada siswa yang sedang aktif mengerjakan sesi ujian saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {activeSessions.map((session) => {
              const examInfo = exams.find((e) => e.id === session.examId);
              const elapsedMinutes = Math.floor((Date.now() - session.startedAt) / 60000);
              const violCount = session.violations ? session.violations.length : 0;
              const hasViolation = violCount > 0;

              return (
                <div
                  key={`${session.nisn}-${session.examId}`}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    hasViolation
                      ? 'bg-rose-50/70 border-rose-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 truncate">
                        {session.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        NIS: {session.nisn} • <span className="text-indigo-700 font-semibold">{session.studentClass}</span>
                      </div>
                    </div>

                    {hasViolation ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-1 animate-pulse">
                        <ShieldAlert className="w-3 h-3" />
                        <span>{violCount} Pelanggaran</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Aman (Kiosk)
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mata Pelajaran:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">
                        {examInfo?.subject || 'Ujian'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Posisi Soal:</span>
                      <span className="font-bold text-indigo-600">
                        Soal #{session.currentQuestionIndex + 1}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Durasi Berjalan:</span>
                      <span className="font-medium text-slate-700">{elapsedMinutes} Menit</span>
                    </div>
                  </div>

                  {/* Violation ticker summary */}
                  {hasViolation && session.violations && session.violations.length > 0 && (
                    <div className="mt-2.5 p-2 bg-rose-100/70 rounded-lg text-[11px] text-rose-900 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Pelanggaran Terakhir:</span>
                      </div>
                      <p className="text-[10px] leading-tight text-rose-800">
                        {session.violations[session.violations.length - 1].description}
                      </p>
                    </div>
                  )}

                  {/* Reset active session button */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveSessionToReset(session)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition flex items-center gap-1 cursor-pointer border border-rose-200"
                      title="Reset sesi realtime siswa jika freeze / bermasalah"
                    >
                      <RefreshCw className="w-3 h-3 text-rose-500" />
                      <span>Reset Sesi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: REKAPITULASI HASIL & NILAI SISWA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              Rekapitulasi Nilai & Hasil Ujian Siswa
            </h2>
            <p className="text-xs text-slate-500">
              Daftar seluruh lembar jawaban siswa yang telah terkoreksi otomatis oleh sistem CBT.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-manual-sync-cloud"
              type="button"
              onClick={handleManualSyncCloud}
              disabled={isSyncingCloud}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-60"
              title="Segarkan dan sinkronkan hasil ujian siswa langsung dari server Cloud"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCloud ? 'animate-spin text-indigo-600' : 'text-indigo-500'}`} />
              <span>{isSyncingCloud ? 'Menyinkronkan...' : 'Sinkronkan Cloud'}</span>
            </button>

            {submissions.length > 0 && (
              <button
                id="btn-clear-recap"
                onClick={() => setShowClearAllModal(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Kosongkan seluruh data rekapitulasi nilai siswa"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Kosongkan Rekap</span>
              </button>
            )}

            <button
              id="btn-export-scores-excel"
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Hasil ke Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Cloud Realtime Status & Messages */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-slate-700">Sinkronisasi Cloud Real-Time Aktif:</span>
            <span className="text-slate-500">Hasil pengerjaan dari perangkat siswa (HP/Laptop) akan otomatis tampil secara instan.</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Total Rekap: <strong className="text-slate-800">{submissions.length} Siswa</strong>
          </div>
        </div>

        {cloudSyncMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{cloudSyncMessage}</span>
          </div>
        )}

        {submissions.length > 0 && filteredSubmissions.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Terdapat <strong>{submissions.length} data ujian tersimpan</strong>, namun tersembunyi karena filter pilihan sesi/kelas tidak cocok.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedExamId('ALL');
                setSelectedClass('ALL');
                setSearchKeyword('');
              }}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
            >
              Reset Filter (Lihat Semua)
            </button>
          </div>
        )}

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Filter Exam */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
              Pilih Sesi Ujian:
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Semua Sesi Ujian</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.subject} — {ex.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Class */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
              Pilih Kelas:
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="ALL">Semua Rombel (10E, 11F, 12F)</option>
              {ALL_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  Kelas {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Search Keyword */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
              Cari Siswa:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Nama atau NISN..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">
              Urutkan Berdasarkan:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="NEWEST">Waktu Selesai Terkini</option>
              <option value="HIGHEST_SCORE">Nilai Tertinggi</option>
              <option value="LOWEST_SCORE">Nilai Terendah</option>
              <option value="MOST_VIOLATIONS">Pelanggaran Terbanyak</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4 text-center">Benar / Salah</th>
                <th className="py-3 px-4 text-center">Nilai (0-100)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Pelanggaran</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada data nilai ujian yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{sub.studentName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{sub.studentNisn}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {sub.studentClass}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium truncate max-w-[140px]">
                      {sub.subject}
                    </td>
                    <td className="py-3 px-4 text-center font-medium">
                      <span className="text-emerald-700 font-bold">{sub.totalCorrect}</span> / <span className="text-rose-600 font-bold">{sub.totalIncorrect}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-black text-sm ${sub.isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {sub.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.isPassed 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {sub.isPassed ? 'LULUS' : 'REMEDIAL'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.violationCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          {sub.violationCount}x Peringatan
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0 (Bersih)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(sub)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                          title="Lihat rincian lembar jawaban siswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => setSubmissionToReset(sub)}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                          title="Reset akses ujian (siswa dapat mengerjakan ulang)"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset</span>
                        </button>
                        <button
                          onClick={() => setSubmissionToDelete(sub)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                          title="Hapus rekapan nilai siswa ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESET SUBMISSION CONFIRMATION MODAL */}
      {/* RESET ACCESS CONFIRMATION MODAL */}
      {submissionToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <RefreshCw className={`w-6 h-6 ${isResettingSingle ? 'animate-spin' : ''}`} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Reset Akses Ujian Siswa?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda ingin mereset hasil ujian untuk <strong className="text-slate-900">{submissionToReset.studentName}</strong> ({submissionToReset.studentClass}) pada mapel <strong>{submissionToReset.subject}</strong>? Data akan dihapus dari Database Cloud dan siswa dapat masuk kembali mengerjakan ujian.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isResettingSingle}
                onClick={() => setSubmissionToReset(null)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isResettingSingle}
                onClick={async () => {
                  setIsResettingSingle(true);
                  try {
                    await deleteSubmission(submissionToReset.id);
                    removeActiveStudentExam(submissionToReset.studentNisn, submissionToReset.examId);
                    if (currentAdmin) {
                      addActivityLog({
                        actor: `${currentAdmin.name} (@${currentAdmin.username})`,
                        role: currentAdmin.role,
                        action: 'RESET_SUBMISSION',
                        target: submissionToReset.studentName,
                        details: `Mereset hasil ujian dan mengizinkan tes ulang untuk ${submissionToReset.studentName} (${submissionToReset.studentClass}) pada ujian ${submissionToReset.subject}.`,
                        level: 'warning'
                      });
                    }
                    setCloudSyncMessage(`Akses ujian ${submissionToReset.studentName} berhasil direset.`);
                  } finally {
                    setIsResettingSingle(false);
                    setSubmissionToReset(null);
                    reloadData();
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isResettingSingle ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mereset...</span>
                  </>
                ) : (
                  <span>Ya, Reset Ujian</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE SINGLE STUDENT SUBMISSION MODAL */}
      {submissionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Hapus Rekapan Siswa Permanen?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus data rekapitulasi nilai untuk <strong className="text-slate-900">{submissionToDelete.studentName}</strong> ({submissionToDelete.studentClass}) dengan nilai <strong className="text-indigo-600">{submissionToDelete.score}</strong>?
              </p>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-semibold text-left mt-2">
                ⚠️ Data lembar jawaban dan skor akan dihapus secara <strong>permanen dari Database Cloud Firestore</strong> dan tidak dapat dipulihkan.
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isDeletingSingle}
                onClick={() => setSubmissionToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-delete-single-submission"
                disabled={isDeletingSingle}
                onClick={async () => {
                  setIsDeletingSingle(true);
                  try {
                    const res = await deleteSubmission(submissionToDelete.id);
                    if (res.success) {
                      setCloudSyncMessage(`Data lembar jawaban ${submissionToDelete.studentName} berhasil dihapus permanen dari Database Cloud.`);
                    } else {
                      setCloudSyncMessage(`Catatan penghapusan: ${res.error || 'Data dihapus'}`);
                    }
                    if (currentAdmin) {
                      addActivityLog({
                        actor: `${currentAdmin.name} (@${currentAdmin.username})`,
                        role: currentAdmin.role,
                        action: 'UPDATE_EXAM',
                        target: `${submissionToDelete.studentName} (${submissionToDelete.studentNisn})`,
                        details: `Admin menghapus permanen rekapan nilai siswa ${submissionToDelete.studentName} dari Database Cloud Firestore.`,
                        level: 'warning'
                      });
                    }
                  } finally {
                    setIsDeletingSingle(false);
                    setSubmissionToDelete(null);
                    reloadData();
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeletingSingle ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Permanen</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET ACTIVE SESSION MODAL */}
      {activeSessionToReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Reset Sesi Berjalan Siswa?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda ingin mereset sesi live monitoring untuk <strong className="text-slate-900">{activeSessionToReset.name}</strong> ({activeSessionToReset.studentClass})? Status realtime akan di-unpin dari pemantauan aktif dan siswa dapat login kembali.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveSessionToReset(null)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  removeActiveStudentExam(activeSessionToReset.nisn, activeSessionToReset.examId);
                  if (currentAdmin) {
                    addActivityLog({
                      actor: `${currentAdmin.name} (@${currentAdmin.username})`,
                      role: currentAdmin.role,
                      action: 'UPDATE_EXAM',
                      target: activeSessionToReset.name,
                      details: `Admin mereset sesi pemantauan realtime ${activeSessionToReset.name} (${activeSessionToReset.studentClass}).`,
                      level: 'info'
                    });
                  }
                  setActiveSessionToReset(null);
                  reloadData();
                }}
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Ya, Reset Sesi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL RECAP CONFIRMATION MODAL */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Kosongkan Rekapitulasi Permanen?</h3>
              <p className="text-xs text-slate-500">
                {selectedExamId !== 'ALL' ? (
                  <>
                    Apakah Anda yakin ingin menghapus seluruh hasil rekapitulasi ujian untuk sesi terpilih (<strong className="text-slate-900">{exams.find(e => e.id === selectedExamId)?.title || selectedExamId}</strong>)?
                  </>
                ) : (
                  <>
                    Apakah Anda yakin ingin menghapus seluruh data rekapitulasi nilai ({submissions.length} rekaman lembar jawaban)?
                  </>
                )}
              </p>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-semibold text-left mt-2">
                ⚠️ Tindakan ini akan <strong>menghapus data secara permanen dari Database Cloud Firestore</strong> yang terhubung, bukan hanya localhost/peramban ini. Seluruh siswa terkait dapat mengerjakan ulang ujian.
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isClearingAll}
                onClick={() => setShowClearAllModal(false)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-clear-all-submissions"
                disabled={isClearingAll}
                onClick={async () => {
                  setIsClearingAll(true);
                  try {
                    const res = await clearAllSubmissions(selectedExamId);
                    if (res.success) {
                      setCloudSyncMessage(`Berhasil mengosongkan ${res.deletedCount} rekaman ujian secara permanen dari Database Cloud Firestore.`);
                    } else {
                      setCloudSyncMessage(`Catatan: ${res.error || 'Rekap dikosongkan'}`);
                    }
                    if (currentAdmin) {
                      addActivityLog({
                        actor: `${currentAdmin.name} (@${currentAdmin.username})`,
                        role: currentAdmin.role,
                        action: 'UPDATE_EXAM',
                        target: selectedExamId !== 'ALL' ? `Sesi ${selectedExamId}` : 'Semua Rekap',
                        details: `Admin mengosongkan seluruh lembar jawaban rekapitulasi nilai secara permanen dari Database Cloud Firestore (${res.deletedCount} data terhapus).`,
                        level: 'warning'
                      });
                    }
                  } finally {
                    setIsClearingAll(false);
                    setShowClearAllModal(false);
                    reloadData();
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isClearingAll ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mengosongkan Cloud...</span>
                  </>
                ) : (
                  <span>Ya, Kosongkan Permanen</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LEMBAR JAWABAN SISWA (DETAIL VIEW) */}
      {selectedSubmissionForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">Lembar Jawaban & Analisis Butir Soal</h3>
                <p className="text-xs text-slate-400">
                  {selectedSubmissionForDetail.studentName} • NISN: {selectedSubmissionForDetail.studentNisn} ({selectedSubmissionForDetail.studentClass})
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmissionForDetail(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Score header summary */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div>
                  <span className="text-slate-400 block">Nilai Akhir:</span>
                  <span className="text-2xl font-black text-indigo-600">
                    {selectedSubmissionForDetail.score.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Poin:</span>
                  <span className="text-2xl font-black text-slate-800">
                    {selectedSubmissionForDetail.totalPointsEarned} / {selectedSubmissionForDetail.maxTotalPoints}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Benar / Salah:</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {selectedSubmissionForDetail.totalCorrect} / {selectedSubmissionForDetail.totalIncorrect}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pelanggaran:</span>
                  <span className="text-2xl font-black text-rose-600">
                    {selectedSubmissionForDetail.violationCount}x
                  </span>
                </div>
              </div>

              {/* Violation Log in this session if any */}
              {selectedSubmissionForDetail.violations && selectedSubmissionForDetail.violations.length > 0 && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Catatan Riwayat Pelanggaran Siswa:</span>
                  </div>
                  <ul className="divide-y divide-rose-200/60 text-[11px] text-rose-800">
                    {selectedSubmissionForDetail.violations.map((v, i) => (
                      <li key={i} className="py-1 flex justify-between">
                        <span>• [{v.type}] {v.description}</span>
                        <span className="text-rose-600 font-mono">{new Date(v.timestamp).toLocaleTimeString('id-ID')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions List with Student's Answer */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                  Rincian Jawaban Siswa Tiap Nomor:
                </h4>

                {questionsForDetail.map((q, idx) => {
                  const studentAns = selectedSubmissionForDetail.answers[q.id];
                  const selectedKey = studentAns?.selectedOption;
                  const isCorrect = selectedKey === q.correctAnswer;
                  const isUnanswered = !selectedKey;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border-2 text-xs space-y-3 ${
                        isUnanswered
                          ? 'bg-slate-50 border-slate-200'
                          : isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-extrabold text-slate-900">
                          Nomor {idx + 1} ({q.points} Poin)
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isUnanswered
                            ? 'bg-slate-200 text-slate-700'
                            : isCorrect
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-rose-200 text-rose-900'
                        }`}>
                          {isUnanswered ? 'KOSONG' : isCorrect ? 'BENAR (+ ' + q.points + ' Poin)' : 'SALAH (0 Poin)'}
                        </span>
                      </div>

                      <p className="text-slate-800 font-medium whitespace-pre-line">
                        {q.text}
                      </p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt) => {
                          const isStudentPick = selectedKey === opt.key;
                          const isKeyCorrect = q.correctAnswer === opt.key;

                          let badgeClass = 'bg-white text-slate-700 border-slate-200';
                          if (isKeyCorrect) {
                            badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
                          } else if (isStudentPick && !isCorrect) {
                            badgeClass = 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
                          }

                          return (
                            <div
                              key={opt.key}
                              className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] ${badgeClass}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded bg-slate-900 text-white font-bold flex items-center justify-center text-[10px]">
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                              <div>
                                {isKeyCorrect && <span className="text-emerald-700 font-bold">Kunci</span>}
                                {isStudentPick && (
                                  <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-slate-800 text-white rounded">
                                    Pilihan Siswa
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600">
                          <span className="font-bold text-slate-800">Pembahasan: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedSubmissionForDetail(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
