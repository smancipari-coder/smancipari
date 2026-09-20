import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Printer, 
  Home, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  BookOpen,
  Calendar,
  AlertOctagon
} from 'lucide-react';
import { ExamSubmission } from '../../types';

interface StudentResultProps {
  submission: ExamSubmission;
  onReturnHome: () => void;
}

export const StudentResult: React.FC<StudentResultProps> = ({
  submission,
  onReturnHome,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isViolationAutoSubmit = submission.status === 'AUTO_SUBMITTED_VIOLATION';
  const isTimeoutAutoSubmit = submission.status === 'AUTO_SUBMITTED_TIMEOUT';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden print:border-none print:shadow-none">
        {/* Header Ribbon */}
        <div className={`p-6 sm:p-8 text-white text-center ${
          isViolationAutoSubmit 
            ? 'bg-rose-800' 
            : submission.isPassed 
            ? 'bg-emerald-700' 
            : 'bg-indigo-700'
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3 ring-8 ring-white/10">
            {isViolationAutoSubmit ? (
              <AlertOctagon className="w-8 h-8 text-white" />
            ) : (
              <Award className="w-8 h-8 text-white" />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isViolationAutoSubmit
              ? 'Ujian Dihentikan (Pelanggaran Anti-Curang)'
              : 'Bukti Hasil & Rekapitulasi Ujian'}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-md mx-auto">
            {isViolationAutoSubmit
              ? 'Lembar jawaban otomatis dikunci dan dikirim karena batas pelanggaran telah terlampaui.'
              : 'Lembar jawaban Anda telah berhasil disimpan dan dinilai secara otomatis oleh sistem CBT.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Score & Passing Status */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Nilai Akhir Ujian
              </span>
              <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                <span className={`text-5xl font-black ${
                  submission.isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {submission.score.toFixed(1)}
                </span>
                <span className="text-xl font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Total Poin: <strong>{submission.totalPointsEarned}</strong> dari maksimal {submission.maxTotalPoints} Poin
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end">
              <span className={`px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                submission.isPassed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {submission.isPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>LULUS KKM</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>BELUM TUNTAS / REMEDIAL</span>
                  </>
                )}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                {isTimeoutAutoSubmit ? 'Waktu Ujian Habis' : 'Status: ' + submission.status}
              </span>
            </div>
          </div>

          {/* Breakdown Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-emerald-800 block">Jawaban Benar</span>
              <span className="text-2xl font-black text-emerald-700 mt-0.5 block">
                {submission.totalCorrect}
              </span>
            </div>
            <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-rose-800 block">Jawaban Salah</span>
              <span className="text-2xl font-black text-rose-700 mt-0.5 block">
                {submission.totalIncorrect}
              </span>
            </div>
            <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-slate-700 block">Kosong / Lewat</span>
              <span className="text-2xl font-black text-slate-800 mt-0.5 block">
                {submission.totalUnanswered}
              </span>
            </div>
            <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-indigo-800 block">Waktu Selesai</span>
              <span className="text-xs font-bold text-indigo-900 mt-2 block">
                {Math.floor(submission.durationSpentSeconds / 60)} Menit
              </span>
            </div>
          </div>

          {/* Student & Exam Details Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <div className="bg-slate-100/70 px-4 py-2.5 font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
              Informasi Peserta & Sesi Ujian
            </div>
            <div className="divide-y divide-slate-200 bg-white">
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-slate-500">Nomor Induk Siswa Nasional (NISN)</span>
                <span className="font-mono font-bold text-slate-900">{submission.studentNisn}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-slate-500">Nama Lengkap</span>
                <span className="font-bold text-slate-900">{submission.studentName}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-slate-500">Kelas / Rombel</span>
                <span className="font-bold text-indigo-700">{submission.studentClass}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-slate-500">Mata Pelajaran & Ujian</span>
                <span className="font-bold text-slate-900">{submission.subject} — {submission.examTitle}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-slate-500">Waktu Pengumpulan</span>
                <span className="font-bold text-slate-900">
                  {new Date(submission.submittedAt).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Anti-Cheat Audit Record */}
          <div className={`p-4 rounded-2xl border text-xs ${
            submission.violationCount === 0
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/60 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {submission.violationCount === 0 ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Catatan Integritas: Bersih (0 Pelanggaran)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Catatan Integritas: {submission.violationCount} Pelanggaran Terdeteksi</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {submission.violationCount === 0
                ? 'Siswa mengerjakan ujian dengan integritas penuh tanpa tercatat adanya perpindahan tab atau keluar dari layar ujian.'
                : `Sistem mendeteksi dan mencatat ${submission.violationCount} kali upaya keluar dari fokus layar/tab peramban selama ujian berlangsung.`}
            </p>
          </div>

          {/* Actions: Print and Return */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <button
              id="btn-print-result"
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan Bukti Nilai</span>
            </button>

            <button
              id="btn-return-home"
              type="button"
              onClick={onReturnHome}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Halaman Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
