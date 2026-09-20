import React, { useState } from 'react';
import { 
  UserCheck, 
  BookOpen, 
  Clock, 
  ShieldAlert, 
  CheckSquare, 
  ArrowLeft, 
  Play, 
  Lock, 
  AlertOctagon, 
  HelpCircle, 
  Award, 
  KeyRound,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Student, ExamSession, ExamSubmission } from '../../types';
import { hasStudentTakenExam } from '../../utils/storage';
import { getExamScheduleDetails } from '../../utils/examScheduleHelper';

interface StudentVerifyProps {
  student: Student;
  exam: ExamSession;
  onBack: () => void;
  onStartExam: () => void;
  onViewPreviousResult?: (submission: ExamSubmission) => void;
}

export const StudentVerify: React.FC<StudentVerifyProps> = ({
  student,
  exam,
  onBack,
  onStartExam,
  onViewPreviousResult,
}) => {
  const [tokenInput, setTokenInput] = useState<string>(exam.token || '');
  const [agreedToRules, setAgreedToRules] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string>('');

  // Check real-time schedule status
  const scheduleDetails = getExamScheduleDetails(exam);
  const isExamScheduleRunning = scheduleDetails.isRunning;

  // Check if student has already completed this exam
  const existingSubmission = hasStudentTakenExam(student.nisn, exam.id);

  const handleConfirmAndStart = () => {
    setTokenError('');

    if (!isExamScheduleRunning) {
      setTokenError(`Ujian tidak dapat dimulai karena sesi ini tidak sedang berjalan. ${scheduleDetails.message}`);
      return;
    }

    if (existingSubmission) {
      return; // blocked
    }

    if (!agreedToRules) {
      setTokenError('Anda harus mencentang persetujuan tata tertib dan pakta integritas ujian.');
      return;
    }

    // Safely request fullscreen inside user gesture
    try {
      if (document.documentElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.info('Iframe or container opted out of automatic fullscreen:', err);
        });
      }
    } catch (e) {
      // Ignored for iframe permissions
    }

    // Launch exam
    onStartExam();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-slate-900 p-6 sm:p-7 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Tahap 2 dari 2: Verifikasi
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Cek & Konfirmasi Data Siswa
              </h1>
            </div>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* ALREADY TAKEN BLOCKER ALERT */}
          {existingSubmission ? (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 sm:p-6 text-rose-950 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-200/80 rounded-xl text-rose-700 shrink-0 mt-0.5">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base sm:text-lg text-rose-900">
                    Akses Ditolak: Anda Sudah Menyelesaikan Ujian Ini!
                  </h3>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    Sistem CBT mencatat bahwa siswa dengan NIS <strong>{student.nis || student.nisn}</strong> ({student.name}) telah mengumpulkan lembar jawaban untuk sesi <strong>{exam.title}</strong> pada {new Date(existingSubmission.submittedAt).toLocaleString('id-ID')}.
                  </p>
                  <p className="text-xs text-rose-700 font-semibold pt-1">
                    Kebijakan Sistem: Setiap siswa <strong>TIDAK BISA MENGERJAKAN 2X</strong> untuk satu sesi ujian yang sama.
                  </p>
                </div>
              </div>

              {/* Summary of prior submission */}
              <div className="bg-white/80 border border-rose-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Nilai yang Telah Diperoleh:</span>
                  <span className="font-black text-xl text-rose-700">{existingSubmission.score.toFixed(1)} / 100</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Jawaban Benar:</span>
                  <span className="font-bold text-slate-800">{existingSubmission.totalCorrect} Soal</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Pelanggaran Tercatat:</span>
                  <span className="font-bold text-rose-600">{existingSubmission.violationCount}x</span>
                </div>
                <button
                  id="btn-view-previous-result"
                  type="button"
                  onClick={() => onViewPreviousResult(existingSubmission)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Lihat Bukti Hasil Ujian</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Student Biodata Card */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Identitas Peserta Ujian
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Nomor Induk Siswa (NIS)</span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900 font-mono tracking-wider">
                  {student.nis || student.nisn}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Nama Lengkap</span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  {student.name}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Rombongan Belajar / Kelas</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800 mt-0.5">
                  Kelas {student.studentClass}
                </span>
              </div>
            </div>
          </div>

          {/* Exam Details Card */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. Rincian Sesi Ujian
            </h2>
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-100 pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                    {exam.subject}
                  </span>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    {exam.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-white rounded-lg border border-indigo-200 text-indigo-900 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Durasi: {exam.durationMinutes} Menit</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="bg-white p-3 rounded-xl border border-indigo-100/70">
                  <span className="text-slate-400 block text-[11px]">Jumlah Soal</span>
                  <span className="font-bold text-slate-900 text-sm">{exam.totalQuestions} Butir Pilihan Ganda</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100/70">
                  <span className="text-slate-400 block text-[11px]">Standar Kelulusan</span>
                  <span className="font-bold text-slate-900 text-sm">KKM: {exam.kkm}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100/70">
                  <span className="text-slate-400 block text-[11px]">Toleransi Anti-Curang</span>
                  <span className="font-bold text-rose-600 text-sm">Maks {exam.maxViolations}x Peringatan</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100/70">
                  <span className="text-slate-400 block text-[11px]">Status Sesi</span>
                  <span className={`font-bold text-sm ${
                    isExamScheduleRunning ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {scheduleDetails.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Alert if schedule is not running */}
          {!isExamScheduleRunning && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 text-rose-950 flex items-start gap-3">
              <div className="p-2 bg-rose-200/80 rounded-xl text-rose-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-rose-900">
                  Perhatian: Sesi Ujian Tidak Sedang Berjalan!
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {scheduleDetails.message}
                </p>
                <p className="text-[11px] text-rose-700 font-semibold">
                  Siswa hanya diizinkan masuk ke ruang ujian pada rentang waktu yang telah dijadwalkan oleh sekolah.
                </p>
              </div>
            </div>
          )}

          {/* Status Otorisasi Token Ujian (Token hanya dikelola pengawas di menu admin) */}
          <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide block">
                  Otorisasi Token Sesi Ujian Berhasil
                </span>
                <p className="text-xs text-emerald-800">
                  Token pengawas untuk mata pelajaran <strong>{exam.subject}</strong> telah divalidasi.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider self-start sm:self-auto shadow-xs">
              Token Terverifikasi
            </span>
          </div>

          {/* Anti-Cheat Warning Rules Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 text-amber-950 space-y-3">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Ketentuan & Mekanisme Pengawasan Anti-Curang</span>
            </div>
            
            <ul className="text-xs text-amber-900/90 space-y-2 list-disc list-inside leading-relaxed font-medium">
              <li>
                <strong>Kunci Layar Penuh (Kiosk Mode):</strong> Saat ujian dimulai, layar peramban akan otomatis beralih ke mode layar penuh dan dikunci.
              </li>
              <li>
                <strong>Deteksi Layar & Tab:</strong> Sistem secara otomatis mendeteksi setiap tindakan membuka tab lain, berpindah aplikasi (Alt+Tab), minimize jendela, atau menekan tombol inspeksi (F12/DevTools).
              </li>
              <li>
                <strong>Peringatan Real-Time:</strong> Setiap perpindahan layar dicatat seketika di log aktivitas dan dilaporkan langsung ke layar pemantauan pengawas/admin.
              </li>
              <li>
                <strong>Diskualifikasi Otomatis:</strong> Apabila siswa melanggar melebihi batas toleransi ({exam.maxViolations} kali), sesi ujian akan <strong>otomatis dikunci dan diserahkan</strong> ke server.
              </li>
            </ul>

            {!existingSubmission && (
              <label className="flex items-start gap-2.5 pt-2 cursor-pointer select-none">
                <input
                  id="checkbox-rules-agreement"
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-amber-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-950">
                  Saya telah memeriksa kebenaran data di atas dan menyatakan bersedia mematuhi seluruh tata tertib ujian dengan jujur dan mandiri.
                </span>
              </label>
            )}
          </div>

          {tokenError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              {tokenError}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Ganti Data / Identitas
            </button>

            {existingSubmission ? (
              <div className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Ujian Telah Selesai Dikerjakan (1x Attempt)</span>
              </div>
            ) : !isExamScheduleRunning ? (
              <div className="text-xs text-rose-700 font-bold flex items-center gap-2 bg-rose-50 px-4 py-2.5 rounded-xl border border-rose-200">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Jadwal Ujian Tidak Aktif ({scheduleDetails.label})</span>
              </div>
            ) : (
              <button
                id="btn-start-cbt-exam"
                type="button"
                onClick={handleConfirmAndStart}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Konfirmasi & Mulai Kerjakan Soal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
