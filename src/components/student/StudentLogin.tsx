import React, { useState, useEffect, useMemo } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  Hash, 
  BookOpen, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  Info,
  CheckCircle2,
  Lock,
  Clock,
  Calendar
} from 'lucide-react';
import { Student, StudentClass, ExamSession, RegisteredStudent } from '../../types';
import { getStoredExams, CBT_EVENT_STATE_UPDATE, findRegisteredStudent } from '../../utils/storage';
import { 
  getExamScheduleDetails, 
  isExamRunning, 
  isExamTargetingClass 
} from '../../utils/examScheduleHelper';

interface StudentLoginProps {
  exams?: ExamSession[];
  onLoginSuccess?: (student: Student, exam: ExamSession) => void;
  onProceedToVerify?: (student: Student, selectedExamId: string) => void;
  onGoToAdmin?: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ 
  exams: examsProp, 
  onLoginSuccess, 
  onProceedToVerify,
  onGoToAdmin 
}) => {
  const [examList, setExamList] = useState<ExamSession[]>(examsProp || getStoredExams());
  const [nis, setNis] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<StudentClass>('');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [examToken, setExamToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [matchedStudent, setMatchedStudent] = useState<RegisteredStudent | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Keep live clock updated every 10 seconds so exam schedules transition automatically in real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Refresh exams from storage if prop not provided or on state updates
  useEffect(() => {
    const refresh = () => {
      const stored = getStoredExams();
      setExamList(stored);
    };

    if (!examsProp) {
      refresh();
      window.addEventListener(CBT_EVENT_STATE_UPDATE, refresh);
      return () => {
        window.removeEventListener(CBT_EVENT_STATE_UPDATE, refresh);
      };
    } else {
      setExamList(examsProp);
    }
  }, [examsProp]);

  // Categorize exams by schedule and student class target
  const categorizedExams = useMemo(() => {
    return examList.map((exam) => {
      const schedule = getExamScheduleDetails(exam, currentTime);
      const isTarget = isExamTargetingClass(exam, matchedStudent?.studentClass);
      return {
        exam,
        schedule,
        isTarget,
      };
    });
  }, [examList, currentTime, matchedStudent?.studentClass]);

  const runningExams = useMemo(() => {
    return categorizedExams.filter((item) => item.schedule.isRunning && item.isTarget);
  }, [categorizedExams]);

  const upcomingExams = useMemo(() => {
    return categorizedExams.filter((item) => item.schedule.isUpcoming && item.isTarget);
  }, [categorizedExams]);

  const expiredExams = useMemo(() => {
    return categorizedExams.filter(
      (item) => (item.schedule.isExpired || item.schedule.status === 'INACTIVE') && item.isTarget
    );
  }, [categorizedExams]);

  // Auto-select first running exam if none selected or if current selection is invalid
  useEffect(() => {
    if (runningExams.length > 0) {
      const isStillRunning = runningExams.some((r) => r.exam.id === selectedExamId);
      if (!isStillRunning) {
        setSelectedExamId(runningExams[0].exam.id);
        setExamToken('');
      }
    } else {
      // If no exams running, don't leave a non-running exam actively selected
      if (selectedExamId) {
        const isRunning = examList.some(
          (e) => e.id === selectedExamId && isExamRunning(e, currentTime)
        );
        if (!isRunning) {
          setSelectedExamId('');
          setExamToken('');
        }
      }
    }
  }, [runningExams, selectedExamId, examList, currentTime]);

  const currentSelectedExam = useMemo(() => {
    if (!selectedExamId) return null;
    return examList.find((e) => e.id === selectedExamId) || null;
  }, [selectedExamId, examList]);

  const currentExamSchedule = useMemo(() => {
    if (!currentSelectedExam) return null;
    return getExamScheduleDetails(currentSelectedExam, currentTime);
  }, [currentSelectedExam, currentTime]);

  const isExamActiveNow = Boolean(currentExamSchedule && currentExamSchedule.isRunning);
  // Alur validasi: Siswa WAJIB menginputkan NIS valid terlebih dahulu sebelum Mapel & Token aktif
  const hasValidStudentNis = Boolean(matchedStudent && nis.trim().length > 0);
  const isExamSelectActive = Boolean(hasValidStudentNis);
  const isTokenActive = Boolean(hasValidStudentNis && currentSelectedExam && isExamActiveNow);

  // Handle Exam Selection Change
  const handleExamChange = (newExamId: string) => {
    setSelectedExamId(newExamId);
    setExamToken(''); // Reset token input when switching exam
    setErrorMessage('');

    if (newExamId) {
      const targetExam = examList.find((e) => e.id === newExamId);
      if (targetExam) {
        const sched = getExamScheduleDetails(targetExam, currentTime);
        if (!sched.isRunning) {
          setErrorMessage(sched.message);
        }
      }
    }
  };

  // Real-time NIS input handler (NIS tidak ke lock, nama & kelas otomatis terkunci dari database)
  const handleNisChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setNis(cleaned);
    setErrorMessage('');

    if (cleaned.length > 0) {
      const found = findRegisteredStudent(cleaned);
      if (found) {
        setMatchedStudent(found);
        setName(found.name);
        setSelectedClass(found.studentClass);
      } else {
        setMatchedStudent(null);
        setName('');
        setSelectedClass('');
      }
    } else {
      setMatchedStudent(null);
      setName('');
      setSelectedClass('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNis = nis.trim();
    const cleanToken = examToken.trim().toUpperCase();

    if (!cleanNis) {
      setErrorMessage('Nomor Induk Siswa (NIS) wajib diisi.');
      return;
    }
    if (!/^\d+$/.test(cleanNis)) {
      setErrorMessage('Format NIS tidak valid. NIS hanya terdiri dari angka.');
      return;
    }
    if (!matchedStudent) {
      setErrorMessage(
        `NIS ${cleanNis} tidak ditemukan di database siswa CBT. Pastikan NIS Anda sudah benar atau tanyakan kepada proktor/admin sekolah.`
      );
      return;
    }

    const cleanName = matchedStudent.name.trim().toUpperCase();
    const cleanClass = matchedStudent.studentClass;

    if (!cleanName) {
      setErrorMessage('Data nama siswa tidak valid.');
      return;
    }
    if (!cleanClass) {
      setErrorMessage('Data rombel / kelas siswa tidak valid.');
      return;
    }

    if (!selectedExamId || !currentSelectedExam) {
      setErrorMessage('Silakan pilih mata pelajaran / sesi ujian yang sedang berjalan.');
      return;
    }

    // MANDATORY SCHEDULE CHECK: Only exams currently running can be taken
    const freshSchedule = getExamScheduleDetails(currentSelectedExam, new Date());
    if (!freshSchedule.isRunning) {
      setErrorMessage(
        `Mata pelajaran ${currentSelectedExam.subject} tidak sedang aktif berjalan. ${freshSchedule.message}`
      );
      return;
    }

    // MANDATORY TOKEN CHECK: Token is only valid when exam is actively running
    if (!isTokenActive) {
      setErrorMessage(
        `Token ujian tidak aktif karena jadwal untuk mata pelajaran ${currentSelectedExam.subject} belum dimulai atau telah berakhir.`
      );
      return;
    }

    if (!cleanToken) {
      setErrorMessage(
        `Token ujian wajib diisi. Silakan masukkan token untuk mata pelajaran ${currentSelectedExam.subject} dari pengawas ruangan.`
      );
      return;
    }

    if (cleanToken !== currentSelectedExam.token.trim().toUpperCase()) {
      setErrorMessage(
        `Token ujian tidak valid untuk mata pelajaran ${currentSelectedExam.subject}. Setiap sesi ujian memiliki kode token unik yang berbeda. Silakan tanyakan token resmi kepada pengawas ruangan Anda.`
      );
      return;
    }

    const studentData: Student = {
      nisn: matchedStudent.nisn || cleanNis,
      nis: cleanNis,
      name: cleanName,
      studentClass: cleanClass,
      gender: matchedStudent.gender || 'L'
    };

    if (onLoginSuccess) {
      onLoginSuccess(studentData, currentSelectedExam);
    } else if (onProceedToVerify) {
      onProceedToVerify(studentData, currentSelectedExam.id);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 overflow-hidden">
        {/* Top Banner Ribbon */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-2.5 text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
            <span>Portal Siswa Terproteksi CBT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Masuk Ujian Online
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 max-w-md">
            Ketikkan Nomor Induk Siswa (NIS) Anda untuk memuat nama lengkap dan rombel kelas resmi dari database online, lalu masukkan token ujian.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Nomor Induk Siswa (NIS) - Bebas diketik, TIDAK TERKUNCI */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="student-nis-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Nomor Induk Siswa (NIS) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                Ketikkan NIS Anda
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4 text-indigo-500" />
              </div>
              <input
                id="student-nis-input"
                type="text"
                inputMode="numeric"
                maxLength={10}
                value={nis}
                onChange={(e) => handleNisChange(e.target.value)}
                placeholder="Ketikkan nomor NIS Anda..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-indigo-200 focus:border-indigo-600 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono font-bold tracking-widest shadow-2xs"
                required
                autoFocus
              />
            </div>

            {/* Auto-fill verified status indicator */}
            {matchedStudent ? (
              <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-950 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-black text-xs text-emerald-900 uppercase tracking-wide">
                      {matchedStudent.name}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Kelas: <span className="font-bold text-emerald-900">{matchedStudent.studentClass}</span>
                      {matchedStudent.schoolOrigin ? ` • Asal: ${matchedStudent.schoolOrigin}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 bg-emerald-200/90 text-emerald-900 rounded-md border border-emerald-300 shrink-0">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>Data Ditemukan</span>
                </div>
              </div>
            ) : nis.length > 0 ? (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>NIS <strong>{nis}</strong> tidak ditemukan di database siswa. Pastikan nomor sudah tepat atau hubungi pengawas.</span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1.5">
                Ketikkan NIS Anda, nama lengkap dan rombel kelas akan otomatis termuat dan terkunci dari database sekolah.
              </p>
            )}
          </div>

          {/* Nama Lengkap Siswa (AUTO LOCK DARI DATABASE) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="student-name-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <span>Nama Lengkap Siswa</span>
                <span className="text-rose-500">*</span>
              </label>
              {matchedStudent ? (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  Auto-Lock Database
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Terkunci Otomatis
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <input
                id="student-name-input"
                type="text"
                readOnly
                tabIndex={-1}
                value={matchedStudent ? matchedStudent.name : ''}
                placeholder="Nama otomatis terkunci dari database setelah NIS diketik..."
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all cursor-not-allowed select-none ${
                  matchedStudent 
                    ? 'bg-slate-100/90 border-2 border-emerald-300 text-slate-900 shadow-2xs' 
                    : 'bg-slate-100/60 border border-slate-200 text-slate-400 placeholder:text-slate-400 placeholder:normal-case placeholder:font-normal'
                }`}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${matchedStudent ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Nama siswa terkunci otomatis dari database sekolah dan tidak dapat diedit secara manual.</span>
            </p>
          </div>

          {/* Pilihan Rombel / Kelas (AUTO LOCK DARI DATABASE) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="student-class-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <span>Rombel / Kelas</span>
                <span className="text-rose-500">*</span>
              </label>
              {matchedStudent ? (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  Auto-Lock Database
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Terkunci Otomatis
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
              </div>
              <input
                id="student-class-input"
                type="text"
                readOnly
                tabIndex={-1}
                value={matchedStudent ? `Kelas ${matchedStudent.studentClass}` : ''}
                placeholder="Kelas otomatis terkunci dari database setelah NIS diketik..."
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm font-black transition-all cursor-not-allowed select-none ${
                  matchedStudent 
                    ? 'bg-slate-100/90 border-2 border-emerald-300 text-slate-900 shadow-2xs' 
                    : 'bg-slate-100/60 border border-slate-200 text-slate-400 placeholder:text-slate-400 placeholder:font-normal'
                }`}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <Lock className={`w-4 h-4 ${matchedStudent ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Rombongan belajar terkunci otomatis sesuai pembagian kelas resmi di sistem CBT.</span>
            </p>
          </div>

          {/* Pilihan Sesi Ujian (HANYA AKTIF JIKA NIS SUDAH DIINPUT DAN JADWAL SEDANG BERJALAN) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="student-exam-select" className={`block text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
                isExamSelectActive ? 'text-slate-700' : 'text-slate-400'
              }`}>
                <BookOpen className={`w-4 h-4 ${isExamSelectActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Mata Pelajaran / Sesi Ujian</span>
                <span className="text-rose-500">*</span>
              </label>

              {!hasValidStudentNis ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 border border-slate-300 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Menunggu Input NIS
                </span>
              ) : runningExams.length > 0 ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  {runningExams.length} Sesi Sedang Berjalan
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-700" />
                  Belum Ada Jadwal Aktif
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <BookOpen className={`w-4 h-4 ${isExamActiveNow && isExamSelectActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              </div>
              <select
                id="student-exam-select"
                disabled={!isExamSelectActive}
                value={isExamSelectActive ? selectedExamId : ''}
                onChange={(e) => handleExamChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all font-semibold ${
                  !isExamSelectActive
                    ? 'bg-slate-200/60 border border-slate-300 text-slate-400 cursor-not-allowed select-none'
                    : isExamActiveNow
                    ? 'bg-emerald-50/40 border-2 border-emerald-400 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer'
                    : 'bg-slate-50 border border-slate-300 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500'
                }`}
              >
                {!hasValidStudentNis ? (
                  <option value="" disabled>
                    -- 🔒 Silakan Masukkan NIS Siswa Terlebih Dahulu --
                  </option>
                ) : runningExams.length === 0 ? (
                  <option value="" disabled>
                    -- 🚫 Tidak Ada Sesi Ujian yang Sedang Berjalan Saat Ini --
                  </option>
                ) : null}

                {/* 1. Sesi Ujian yang Sedang Berjalan (AKTIF & BISA DIAKSES) */}
                {hasValidStudentNis && runningExams.length > 0 && (
                  <optgroup label="🟢 JADWAL SEDANG BERJALAN (AKTIF & DAPAT DIIKUTI)">
                    {runningExams.map(({ exam, schedule }) => (
                      <option key={exam.id} value={exam.id}>
                        {exam.subject} — {exam.title} (Aktif s/d {exam.endTime} WIB)
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* 2. Sesi Ujian yang Belum Dimulai (TERKUNCI / DISABLED) */}
                {hasValidStudentNis && upcomingExams.length > 0 && (
                  <optgroup label="⏳ JADWAL BELUM DIMULAI (TERKUNCI)">
                    {upcomingExams.map(({ exam, schedule }) => (
                      <option key={exam.id} value={exam.id} disabled className="text-slate-400">
                        🔒 [BELUM DIMULAI] {exam.subject} — {schedule.formattedDate} ({schedule.formattedTimeRange})
                      </option>
                    ))}
                  </optgroup>
                )}

                {/* 3. Sesi Ujian yang Telah Berakhir (TERKUNCI / DISABLED) */}
                {hasValidStudentNis && expiredExams.length > 0 && (
                  <optgroup label="🚫 JADWAL TELAH BERAKHIR (TERKUNCI)">
                    {expiredExams.map(({ exam }) => (
                      <option key={exam.id} value={exam.id} disabled className="text-slate-400">
                        🔒 [TELAH BERAKHIR] {exam.subject} — Berakhir Pukul {exam.endTime} WIB
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Schedule Status Banner under select */}
            {!hasValidStudentNis ? (
              <div className="mt-2 p-2.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-600">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Ketikkan nomor NIS yang terdaftar di atas untuk membuka pilihan mata pelajaran ujian.</span>
              </div>
            ) : isExamActiveNow && currentSelectedExam && currentExamSchedule ? (
              <div className="mt-2 p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </span>
                  <span className="font-bold">
                    Jadwal Sedang Berjalan: Pukul {currentSelectedExam.startTime} - {currentSelectedExam.endTime} WIB
                  </span>
                </div>
                <span className="text-[11px] font-black bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-md">
                  {currentExamSchedule.remainingMinutes !== undefined ? `${currentExamSchedule.remainingMinutes} Menit Tersisa` : 'Aktif'}
                </span>
              </div>
            ) : runningExams.length === 0 ? (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-950">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Tidak Ada Ujian yang Sedang Berjalan</span>
                  <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                    Sesi ujian hanya terbuka dan dapat dipilih pada jam pelaksanaan yang telah disetting oleh proktor/pengawas.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* INPUT TOKEN UJIAN (HANYA AKTIF SAAT NIS VALID & JADWAL SEDANG BERJALAN) */}
          <div className={`rounded-2xl p-4 sm:p-5 space-y-3 transition-all ${
            isTokenActive 
              ? 'bg-indigo-50/80 border-2 border-indigo-300 shadow-xs' 
              : 'bg-slate-100/90 border-2 border-slate-200/90'
          }`}>
            <div className="flex items-center justify-between">
              <label htmlFor="student-exam-token-input" className={`block text-xs font-black uppercase tracking-wide flex items-center gap-1.5 ${
                isTokenActive ? 'text-indigo-950' : 'text-slate-500'
              }`}>
                {isTokenActive ? (
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
                <span>Token Ujian (Dari Pengawas Ruangan)</span>
                <span className="text-rose-500">*</span>
              </label>

              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                isTokenActive 
                  ? 'text-emerald-800 bg-emerald-100 border border-emerald-300' 
                  : 'text-slate-600 bg-slate-200 border border-slate-300'
              }`}>
                {isTokenActive ? '🟢 Token Aktif' : '🔒 Token Dinonaktifkan'}
              </span>
            </div>

            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${
                isTokenActive ? 'text-indigo-500' : 'text-slate-400'
              }`}>
                {isTokenActive ? <KeyRound className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <input
                id="student-exam-token-input"
                type="text"
                disabled={!isTokenActive}
                value={examToken}
                onChange={(e) => setExamToken(e.target.value.toUpperCase().replace(/\s/g, ''))}
                placeholder={
                  !hasValidStudentNis
                    ? 'Token dinonaktifkan (Masukkan NIS siswa terlebih dahulu)'
                    : !currentSelectedExam
                    ? 'Token dinonaktifkan (Pilih jadwal ujian terlebih dahulu)'
                    : !isTokenActive
                    ? currentExamSchedule?.isUpcoming
                      ? `Token terkunci (Ujian baru dimulai pukul ${currentSelectedExam.startTime} WIB)`
                      : `Token tidak aktif (Jadwal ujian telah berakhir pukul ${currentSelectedExam.endTime})`
                    : 'Masukkan kode token dari pengawas ruangan'
                }
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-base transition-all font-mono font-black tracking-widest uppercase ${
                  isTokenActive
                    ? 'bg-white border-2 border-indigo-400 text-indigo-950 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 shadow-2xs'
                    : 'bg-slate-200/70 border-2 border-slate-300 text-slate-400 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal placeholder:text-xs cursor-not-allowed select-none'
                }`}
                required
              />
            </div>

            {/* Explanatory notes about token status */}
            {!hasValidStudentNis ? (
              <div className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span>
                    <strong>Token Dinonaktifkan:</strong> Kolom token dan pemilihan mapel terkunci sampai nomor NIS siswa yang valid diinputkan.
                  </span>
                </div>
              </div>
            ) : isTokenActive && currentSelectedExam ? (
              <div className="flex items-start gap-2 text-[11px] text-indigo-950/90 leading-relaxed bg-white/90 p-2.5 rounded-xl border border-indigo-200/70 shadow-2xs">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span>
                    <strong>Sesi {currentSelectedExam.subject} Sedang Berjalan:</strong> Kolom token terbuka. Silakan tanyakan kode token kepada pengawas yang bertugas di ruangan ujian Anda.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-[11px] text-amber-950 leading-relaxed bg-amber-50/90 p-2.5 rounded-xl border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span>
                    <strong>Token Belum / Tidak Aktif:</strong> Token ujian hanya akan aktif apabila Anda memilih mata pelajaran yang jadwalnya sedang berjalan di jam saat ini.
                    {currentExamSchedule?.isUpcoming && (
                      <span className="block font-bold text-amber-900 mt-0.5">
                        Jadwal ujian: {currentExamSchedule.formattedDate} pukul {currentSelectedExam?.startTime} - {currentSelectedExam?.endTime} WIB.
                      </span>
                    )}
                    {currentExamSchedule?.isExpired && (
                      <span className="block font-bold text-rose-800 mt-0.5">
                        Jadwal ujian ini telah berakhir pada pukul {currentSelectedExam?.endTime} WIB.
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="student-login-submit-btn"
              disabled={!isTokenActive}
              className={`w-full py-3.5 px-4 font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                isTokenActive
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-300 text-slate-500 shadow-slate-200 cursor-not-allowed'
              }`}
            >
              {isTokenActive ? (
                <>
                  <span>Verifikasi Token & Lanjut Cek Data</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {!hasValidStudentNis
                      ? 'Masukkan NIS Siswa Terlebih Dahulu'
                      : currentExamSchedule?.isUpcoming
                      ? `Menunggu Jadwal Dimulai (${currentSelectedExam?.startTime} WIB)`
                      : 'Jadwal Ujian Tidak Sedang Berjalan'}
                  </span>
                </>
              )}
            </button>
          </div>

          {onGoToAdmin && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                id="btn-switch-to-admin-portal"
                onClick={onGoToAdmin}
                className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-slate-300 border border-transparent shadow-2xs group"
              >
                <UserCheck className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
                <span>Portal Khusus Pengawas & Administrator</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

