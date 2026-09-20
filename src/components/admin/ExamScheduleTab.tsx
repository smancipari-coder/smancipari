import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldAlert, 
  KeyRound, 
  Check, 
  X, 
  BookOpen, 
  Layers, 
  Search,
  AlertCircle
} from 'lucide-react';
import { ExamSession, StudentClass, ALL_CLASSES, AdminUser } from '../../types';
import { saveExams, addActivityLog } from '../../utils/storage';
import { copyToClipboard } from '../../utils/clipboard';
import { getExamScheduleDetails } from '../../utils/examScheduleHelper';

interface ExamScheduleTabProps {
  exams: ExamSession[];
  onExamsUpdated: (exams: ExamSession[]) => void;
  currentAdmin?: AdminUser;
}

export const ExamScheduleTab: React.FC<ExamScheduleTabProps> = ({ exams, onExamsUpdated, currentAdmin }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExam, setEditingExam] = useState<ExamSession | null>(null);
  const [copiedExamId, setCopiedExamId] = useState<string | null>(null);
  const [examToDelete, setExamToDelete] = useState<ExamSession | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [targetType, setTargetType] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [selectedClasses, setSelectedClasses] = useState<StudentClass[]>(['10E1', '10E2', '10E3']);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('07:30');
  const [endTime, setEndTime] = useState<string>('15:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [token, setToken] = useState<string>('CBT2026');
  const [kkm, setKkm] = useState<number>(75);
  const [maxViolations, setMaxViolations] = useState<number>(3);
  const [status, setStatus] = useState<ExamSession['status']>('ACTIVE');
  const [formError, setFormError] = useState<string>('');

  const openCreateModal = () => {
    setEditingExam(null);
    setTitle('');
    setSubject(currentAdmin?.subject || '');
    setTargetType('ALL');
    setSelectedClasses(['10E1', '10E2']);
    setStartDate(new Date().toISOString().split('T')[0]);
    setStartTime('07:30');
    setEndTime('15:00');
    setDurationMinutes(45);
    setToken(`CBT${Math.floor(1000 + Math.random() * 9000)}`);
    setKkm(75);
    setMaxViolations(3);
    setStatus('ACTIVE');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exam: ExamSession) => {
    setEditingExam(exam);
    setTitle(exam.title);
    setSubject(exam.subject);
    setTargetType(exam.targetClasses === 'ALL' ? 'ALL' : 'SPECIFIC');
    setSelectedClasses(Array.isArray(exam.targetClasses) ? exam.targetClasses : ['10E1']);
    setStartDate(exam.startDate);
    setStartTime(exam.startTime);
    setEndTime(exam.endTime);
    setDurationMinutes(exam.durationMinutes);
    setToken(exam.token);
    setKkm(exam.kkm);
    setMaxViolations(exam.maxViolations);
    setStatus(exam.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !subject.trim()) {
      setFormError('Judul Ujian dan Mata Pelajaran wajib diisi.');
      return;
    }
    if (durationMinutes <= 0) {
      setFormError('Durasi ujian harus lebih dari 0 menit.');
      return;
    }

    const targetClassesPayload: StudentClass[] | 'ALL' =
      targetType === 'ALL' ? 'ALL' : selectedClasses;

    if (editingExam) {
      // Update existing
      const updated = exams.map((item) =>
        item.id === editingExam.id
          ? {
              ...item,
              title: title.trim(),
              subject: subject.trim(),
              targetClasses: targetClassesPayload,
              startDate,
              startTime,
              endTime,
              durationMinutes,
              token: token.trim().toUpperCase(),
              kkm,
              maxViolations,
              status,
            }
          : item
      );
      saveExams(updated);
      onExamsUpdated(updated);

      addActivityLog({
        actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
        role: currentAdmin?.role || 'SUPER_ADMIN',
        action: 'UPDATE_EXAM',
        target: title,
        details: `Memperbarui jadwal ujian: ${title} (${subject}). Durasi: ${durationMinutes} menit. Status: ${status}. Diperbarui oleh ${currentAdmin?.name || 'Admin'}.`,
        level: 'info'
      });
    } else {
      // Create new
      const newExam: ExamSession = {
        id: `exam-${Date.now()}`,
        title: title.trim(),
        subject: subject.trim(),
        gradeLevels: ['10', '11', '12'],
        targetClasses: targetClassesPayload,
        startDate,
        startTime,
        endTime,
        durationMinutes,
        token: token.trim().toUpperCase(),
        totalQuestions: 0,
        totalPoints: 0,
        kkm,
        maxViolations,
        status,
        createdAt: new Date().toISOString(),
        createdBy: currentAdmin?.name || 'Super Admin Pusat',
        creatorUsername: currentAdmin?.username || 'admin',
        creatorRole: currentAdmin?.role || 'SUPER_ADMIN',
      };
      const updated = [newExam, ...exams];
      saveExams(updated);
      onExamsUpdated(updated);

      addActivityLog({
        actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
        role: currentAdmin?.role || 'SUPER_ADMIN',
        action: 'CREATE_EXAM',
        target: newExam.title,
        details: `Menambahkan jadwal ujian baru: ${newExam.title} (${newExam.subject}, Token: ${newExam.token}). Dibuat oleh ${currentAdmin?.name || 'Admin'} [${currentAdmin?.role || 'SUPER_ADMIN'}].`,
        level: 'info'
      });
    }

    setIsModalOpen(false);
  };

  const handleConfirmDeleteExam = () => {
    if (!examToDelete) return;
    const updated = exams.filter((e) => e.id !== examToDelete.id);
    saveExams(updated);
    onExamsUpdated(updated);

    addActivityLog({
      actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
      role: currentAdmin?.role || 'SUPER_ADMIN',
      action: 'DELETE_EXAM',
      target: examToDelete.title,
      details: `Menghapus jadwal sesi ujian: ${examToDelete.title} (${examToDelete.subject}). Dihapus oleh ${currentAdmin?.name || 'Admin'}.`,
      level: 'danger'
    });

    setExamToDelete(null);
  };

  const toggleClassSelection = (cls: StudentClass) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const filteredExams = exams.filter((e) => {
    const query = searchTerm.toLowerCase();
    return e.title.toLowerCase().includes(query) || e.subject.toLowerCase().includes(query) || e.token.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Pengaturan Jadwal Ujian Siswa</span>
          </h2>
          <p className="text-xs text-slate-500">
            Atur mata pelajaran, tanggal pelaksanaan, alokasi waktu, token akses, dan rombel target.
          </p>
        </div>

        <button
          id="btn-add-new-exam"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jadwal Ujian Baru</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan judul ujian, mata pelajaran, atau token..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExams.map((exam) => {
          const schedule = getExamScheduleDetails(exam);
          const isTokenCurrentlyActive = exam.status === 'ACTIVE' && schedule.isRunning;

          return (
          <div
            key={exam.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 space-y-4 hover:shadow-md transition ${
              isTokenCurrentlyActive ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200">
                {exam.subject}
              </span>
              
              <div className="flex items-center gap-1.5">
                {exam.status !== 'ACTIVE' ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    exam.status === 'DRAFT' ? 'bg-slate-100 text-slate-700' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {exam.status === 'DRAFT' ? 'Draf' : 'Nonaktif'}
                  </span>
                ) : schedule.isRunning ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Sedang Berjalan
                  </span>
                ) : schedule.isUpcoming ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    ⏳ Belum Dimulai
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    🚫 Telah Berakhir
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                {exam.title}
              </h3>
              
              <div className={`mt-2 p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                isTokenCurrentlyActive 
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center gap-2 font-mono">
                  <KeyRound className={`w-4 h-4 shrink-0 ${isTokenCurrentlyActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Token Masuk Ujian</span>
                    <strong className="text-slate-900 tracking-wider font-black text-sm">{exam.token}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isTokenCurrentlyActive 
                      ? 'bg-emerald-200/80 text-emerald-900' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isTokenCurrentlyActive ? '🟢 Token Aktif' : '🔒 Token Tidak Aktif'}
                  </span>

                  <button
                    type="button"
                    onClick={async () => {
                      await copyToClipboard(exam.token);
                      setCopiedExamId(exam.id);
                      setTimeout(() => setCopiedExamId(null), 2000);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Salin Token Khusus Pengawas"
                  >
                    {copiedExamId === exam.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Tersalin</span>
                      </>
                    ) : (
                      <span>Salin</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Tanggal Pelaksanaan:</span>
                <span className="font-semibold text-slate-800">{exam.startDate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Waktu & Durasi:</span>
                <span className="font-semibold text-slate-800">{exam.startTime} - {exam.endTime} ({exam.durationMinutes} Menit)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Target Kelas:</span>
                <span className="font-bold text-indigo-700">
                  {exam.targetClasses === 'ALL' ? 'Semua Kelas (10, 11, 12)' : `${exam.targetClasses.length} Rombel Terpilih`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Toleransi Anti-Curang:</span>
                <span className="font-bold text-rose-600">Maks {exam.maxViolations}x Peringatan</span>
              </div>
              {exam.createdBy && (
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400">Penyusun:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <span>{exam.createdBy}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      exam.creatorRole === 'GURU_MAPEL' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {exam.creatorRole === 'GURU_MAPEL' ? 'Guru Mapel' : 'Super Admin'}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <button
                onClick={() => openEditModal(exam)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setExamToDelete(exam)}
                className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* DELETE EXAM MODAL */}
      {examToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Hapus Jadwal Ujian?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus jadwal ujian <strong className="text-slate-900">{examToDelete.title}</strong> ({examToDelete.subject})? Semua butir soal dan data terkait sesi ini akan dihapus.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExamToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteExam}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Ya, Hapus Jadwal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT EXAM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-base">
                  {editingExam ? 'Edit Jadwal Sesi Ujian' : 'Tambah Jadwal Ujian Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExam} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Judul Ujian <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Penilaian Tengah Semester (PTS)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Mata Pelajaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Misal: Matematika Wajib"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Target Classes Selection */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wide">
                  Target Peserta / Rombel Kelas
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="targetType"
                      checked={targetType === 'ALL'}
                      onChange={() => setTargetType('ALL')}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">Semua Kelas (Kelas 10, 11, 12)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="targetType"
                      checked={targetType === 'SPECIFIC'}
                      onChange={() => setTargetType('SPECIFIC')}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">Pilih Rombel Tertentu</span>
                  </label>
                </div>

                {targetType === 'SPECIFIC' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] text-slate-500 block">Centang kelas yang berhak mengikuti ujian ini:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 max-h-36 overflow-y-auto">
                      {ALL_CLASSES.map((cls) => {
                        const checked = selectedClasses.includes(cls);
                        return (
                          <button
                            key={cls}
                            type="button"
                            onClick={() => toggleClassSelection(cls)}
                            className={`p-1.5 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                              checked
                                ? 'bg-indigo-600 text-white border-indigo-700'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {cls}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Dates & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Tanggal Ujian
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Duration, Token, KKM, Violations */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Durasi (Menit)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={360}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Token Sesi
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    KKM Kelulusan
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kkm}
                    onChange={(e) => setKkm(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Toleransi Curang
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxViolations}
                    onChange={(e) => setMaxViolations(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Status Pelaksanaan
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="ACTIVE">Aktif (Dapat Dikerjakan Siswa)</option>
                  <option value="DRAFT">Draf (Belum Dibuka)</option>
                  <option value="FINISHED">Selesai / Ditutup</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-exam-submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  {editingExam ? 'Simpan Perubahan' : 'Simpan Jadwal Ujian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
