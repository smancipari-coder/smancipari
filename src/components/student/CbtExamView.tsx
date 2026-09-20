import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Send, 
  CheckCircle, 
  ZoomIn, 
  X,
  AlertTriangle,
  Maximize2,
  Minimize2,
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  HelpCircle,
  Award,
  Loader2
} from 'lucide-react';
import { 
  Student, 
  ExamSession, 
  Question, 
  StudentAnswer, 
  ExamSubmission, 
  ViolationEvent 
} from '../../types';
import { 
  recordViolation, 
  updateActiveStudentExam, 
  removeActiveStudentExam,
  getQuestionsByExamId,
  getStoredQuestions,
  saveSubmission
} from '../../utils/storage';
import { AntiCheatModal } from '../AntiCheatModal';

interface CbtExamViewProps {
  student: Student;
  exam: ExamSession;
  questions?: Question[];
  onSubmitExam?: (submission: ExamSubmission) => void;
  onFinishExam?: (submission: ExamSubmission) => void;
}

export const CbtExamView: React.FC<CbtExamViewProps> = ({
  student,
  exam,
  questions: questionsProp,
  onSubmitExam,
  onFinishExam,
}) => {
  // Safe Questions Loading: Ensure array is never empty so app never crashes
  const initialQuestions = React.useMemo(() => {
    if (questionsProp && questionsProp.length > 0) return questionsProp;
    const fromStorage = getQuestionsByExamId(exam.id);
    if (fromStorage.length > 0) return fromStorage;
    const fallbackAll = getStoredQuestions();
    return fallbackAll.length > 0 ? fallbackAll.slice(0, 6) : [];
  }, [questionsProp, exam.id]);

  const [questions] = useState<Question[]>(initialQuestions);

  // Navigation & Answers State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Timer State (in seconds)
  const initialDuration = exam.durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const startTimeRef = useRef<number>(Date.now());

  // Image Modal Lightbox
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);

  // Submit Modal Confirmation
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Anti-Cheat State
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [activeViolationAlert, setActiveViolationAlert] = useState<ViolationEvent | null>(null);
  const [showViolationModal, setShowViolationModal] = useState<boolean>(false);
  const [isDisqualified, setIsDisqualified] = useState<boolean>(false);
  const [isFullscreenActive, setIsFullscreenActive] = useState<boolean>(!!document.fullscreenElement);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<string>('');

  // Robust Anti-Cheat Synchronous Guards
  const isModalOpenRef = useRef<boolean>(false);
  const isDisqualifiedRef = useRef<boolean>(false);
  const lastViolationTimeRef = useRef<number>(0);
  const examReadyRef = useRef<boolean>(false);
  const hasEnteredFullscreenRef = useRef<boolean>(false);

  // Sync refs with state
  useEffect(() => {
    isModalOpenRef.current = showViolationModal;
  }, [showViolationModal]);

  useEffect(() => {
    isDisqualifiedRef.current = isDisqualified;
  }, [isDisqualified]);

  // Grace Period: give student 2.5 seconds on mount before anti-cheat triggers activate
  useEffect(() => {
    const readyTimer = setTimeout(() => {
      examReadyRef.current = true;
    }, 2500);
    return () => clearTimeout(readyTimer);
  }, []);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Request fullscreen safely & track active state
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement && document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            hasEnteredFullscreenRef.current = true;
            setIsFullscreenActive(true);
          })
          .catch((err) => {
            console.info('Fullscreen request prevented by environment:', err);
          });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Attempt initial fullscreen safely
  useEffect(() => {
    if (document.fullscreenElement) {
      hasEnteredFullscreenRef.current = true;
      setIsFullscreenActive(true);
    }

    // Register active student session in storage for proctor monitoring
    updateActiveStudentExam({
      nisn: student.nisn,
      name: student.name,
      studentClass: student.studentClass,
      examId: exam.id,
      startedAt: startTimeRef.current,
      currentQuestionIndex: 0,
      answers: {},
      violations: [],
      isLocked: false,
      lastActive: Date.now(),
    });

    return () => {
      removeActiveStudentExam(student.nisn, exam.id);
    };
  }, [student, exam]);

  // Compute final submission helper
  const finalizeSubmission = useCallback(async (status: ExamSubmission['status']) => {
    setIsSubmitting(true);
    setSubmitFeedback('Memproses lembar jawaban dan menghitung skor...');

    const durationSpent = Math.min(
      initialDuration,
      Math.round((Date.now() - startTimeRef.current) / 1000)
    );

    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnanswered = 0;
    let totalPointsEarned = 0;
    let maxTotalPoints = 0;

    const evaluatedAnswers: Record<string, StudentAnswer> = {};

    questions.forEach((q) => {
      maxTotalPoints += q.points;
      const ans = answers[q.id];
      if (!ans || !ans.selectedOption) {
        totalUnanswered += 1;
        evaluatedAnswers[q.id] = {
          questionId: q.id,
          selectedOption: null,
          isDoubtful: ans?.isDoubtful || false,
          isCorrect: false,
          pointsEarned: 0,
        };
      } else {
        const isCorrect = ans.selectedOption === q.correctAnswer;
        if (isCorrect) {
          totalCorrect += 1;
          totalPointsEarned += q.points;
        } else {
          totalIncorrect += 1;
        }
        evaluatedAnswers[q.id] = {
          ...ans,
          isCorrect,
          pointsEarned: isCorrect ? q.points : 0,
        };
      }
    });

    const calculatedScore = maxTotalPoints > 0 ? (totalPointsEarned / maxTotalPoints) * 100 : 0;
    const isPassed = calculatedScore >= exam.kkm;

    const submission: ExamSubmission = {
      id: `sub-${student.nisn}-${exam.id}-${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      studentNisn: student.nisn,
      studentName: student.name,
      studentClass: student.studentClass,
      startedAt: new Date(startTimeRef.current).toISOString(),
      submittedAt: new Date().toISOString(),
      durationSpentSeconds: durationSpent,
      answers: evaluatedAnswers,
      totalCorrect,
      totalIncorrect,
      totalUnanswered,
      score: calculatedScore,
      totalPointsEarned,
      maxTotalPoints,
      isPassed,
      violationCount: violations.length,
      violations,
      status,
    };

    setSubmitFeedback('Mengirim hasil ujian ke Cloud Server CBT online...');

    try {
      const syncResult = await saveSubmission(submission);
      if (syncResult.cloudSynced) {
        setSubmitFeedback('Tersimpan di Cloud Server CBT! Menyiapkan tanda terima...');
      } else {
        setSubmitFeedback('Tersimpan di penyimpanan lokal perangkat. Menyiapkan tanda terima...');
      }
    } catch (e) {
      console.warn('saveSubmission catch error:', e);
      setSubmitFeedback('Menyimpan hasil...');
    }

    // Brief smooth transition for user reassurance
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    const callback = onFinishExam || onSubmitExam;
    if (callback) {
      callback(submission);
    }
  }, [answers, exam, initialDuration, onSubmitExam, onFinishExam, questions, student, violations]);

  // Handle Cheating Violation Trigger with Debounce & Guard
  const triggerViolation = useCallback((type: ViolationEvent['type'], description: string) => {
    // 1. Check if exam is ready (grace period)
    if (!examReadyRef.current) return;

    // 2. Prevent stacking duplicate alerts if modal is open or disqualified
    if (isModalOpenRef.current || isDisqualifiedRef.current) return;

    // 3. Debounce: ignore events within 2.5 seconds of previous violation
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 2500) return;
    lastViolationTimeRef.current = now;

    // Set synchronous guard immediately
    isModalOpenRef.current = true;

    const newViolation: ViolationEvent = {
      id: `viol-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      studentNisn: student.nisn,
      studentName: student.name,
      studentClass: student.studentClass,
      examId: exam.id,
      timestamp: new Date().toISOString(),
      type,
      description,
    };

    // Record violation to state & storage
    const updatedViolations = [...violations, newViolation];
    setViolations(updatedViolations);
    setActiveViolationAlert(newViolation);
    setShowViolationModal(true);

    recordViolation(newViolation);

    // Check if maximum tolerance exceeded
    if (updatedViolations.length >= exam.maxViolations) {
      setIsDisqualified(true);
      isDisqualifiedRef.current = true;
    }
  }, [exam, student, violations]);

  // Anti-Cheat Event Listeners (Tab switch, Blur, Fullscreen exit, Key shortcuts, Right-click)
  useEffect(() => {
    // 1. Visibility change (Switch tab / minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation(
          'TAB_SWITCH',
          'Siswa terdeteksi beralih tab peramban atau meminimalkan jendela ujian.'
        );
      }
    };

    // 2. Window Blur (Alt+Tab, clicking outside or opening other app)
    const handleBlur = () => {
      // In preview iframe mode, don't trigger if user is clicking inside an active modal
      if (isModalOpenRef.current || isDisqualifiedRef.current) return;
      if (!examReadyRef.current) return;

      // If document is visible and user didn't hide the tab, verify focus
      if (!document.hidden && document.hasFocus && document.hasFocus()) {
        return;
      }

      triggerViolation(
        'WINDOW_BLUR',
        'Fokus jendela ujian hilang (Siswa terdeteksi membuka aplikasi lain atau menekan Alt+Tab).'
      );
    };

    // 3. Fullscreen exit detection
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreenActive(active);

      if (active) {
        hasEnteredFullscreenRef.current = true;
      } else if (hasEnteredFullscreenRef.current) {
        // Only trigger exit violation if user had actually entered fullscreen previously
        triggerViolation(
          'FULLSCREEN_EXIT',
          'Siswa keluar dari mode layar penuh (Fullscreen) yang diwajibkan selama tes.'
        );
      }
    };

    // 4. Keyboard Shortcuts Blocker (F12, Ctrl+Shift+I, Ctrl+C, Ctrl+V, PrintScreen, Alt+Tab)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12 / Devtools
      if (e.key === 'F12') {
        e.preventDefault();
        triggerViolation('DEVTOOLS_SHORTCUT', 'Upaya menekan tombol fungsi F12 (Developer Tools).');
        return;
      }

      // Prevent Ctrl+Shift+I / Ctrl+Shift+C / Ctrl+Shift+J / Ctrl+U
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c' || e.key === 'J' || e.key === 'j' || e.key === 'U' || e.key === 'u')
      ) {
        e.preventDefault();
        triggerViolation('DEVTOOLS_SHORTCUT', 'Upaya membuka inspeksi kode peramban.');
        return;
      }

      // Prevent Copy / Paste (Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'p' || e.key === 'C' || e.key === 'V' || e.key === 'X' || e.key === 'P')
      ) {
        e.preventDefault();
        triggerViolation('KEY_COPY_PASTE', 'Upaya melakukan salin/tempel (Copy/Paste/Print) selama tes.');
        return;
      }

      // Prevent PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        triggerViolation('DEVTOOLS_SHORTCUT', 'Upaya mengambil tangkapan layar (PrintScreen).');
        return;
      }
    };

    // 5. Context Menu Blocker (Right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [triggerViolation]);

  // Countdown Timer Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finalizeSubmission('AUTO_SUBMITTED_TIMEOUT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finalizeSubmission]);

  // Sync active exam progress to storage periodically
  useEffect(() => {
    updateActiveStudentExam({
      nisn: student.nisn,
      name: student.name,
      studentClass: student.studentClass,
      examId: exam.id,
      startedAt: startTimeRef.current,
      currentQuestionIndex: currentIndex,
      answers,
      violations,
      isLocked: isDisqualified,
      lastActive: Date.now(),
    });
  }, [currentIndex, answers, violations, isDisqualified, student, exam]);

  // Format Timer HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Option select handler
  const handleSelectOption = (questionId: string, optionKey: 'A' | 'B' | 'C' | 'D' | 'E') => {
    setAnswers((prev) => {
      const existing = prev[questionId] || {
        questionId,
        selectedOption: null,
        isDoubtful: false,
      };
      return {
        ...prev,
        [questionId]: {
          ...existing,
          selectedOption: optionKey,
        },
      };
    });
  };

  // Toggle Ragu-ragu (Doubt) handler
  const handleToggleDoubt = (questionId?: string) => {
    if (!questionId) return;
    setAnswers((prev) => {
      const existing = prev[questionId] || {
        questionId,
        selectedOption: null,
        isDoubtful: false,
      };
      return {
        ...prev,
        [questionId]: {
          ...existing,
          isDoubtful: !existing.isDoubtful,
        },
      };
    });
  };

  // Acknowledge anti-cheat alert
  const handleAcknowledgeAlert = () => {
    setShowViolationModal(false);
    isModalOpenRef.current = false;
    lastViolationTimeRef.current = Date.now() + 1500; // Extra 1.5s immunity period after acknowledging

    if (isDisqualified) {
      finalizeSubmission('AUTO_SUBMITTED_VIOLATION');
    } else {
      // Re-enter fullscreen safely if supported
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    }
  };

  // Question navigation counts
  const totalCount = questions.length;
  const answerList = Object.values(answers) as StudentAnswer[];
  const answeredCount = answerList.filter((a) => a.selectedOption !== null).length;
  const doubtfulCount = answerList.filter((a) => a.isDoubtful).length;
  const unansweredCount = Math.max(0, totalCount - answeredCount);

  // Font size classes
  const fontClass =
    fontSize === 'xlarge'
      ? 'text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm leading-normal';

  // Fallback for empty question bank
  if (totalCount === 0 || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Belum Ada Soal Untuk Sesi Ini</h2>
          <p className="text-xs text-slate-500">
            Sesi ujian {exam.subject} belum memiliki butir soal aktif. Silakan hubungi admin atau pengawas untuk mengunggah soal.
          </p>
          <button
            onClick={() => finalizeSubmission('SUBMITTED')}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Kembali ke Halaman Depan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 cbt-unselectable select-none">
      {/* SECURE CBT TOPBAR */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-30">
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Left: Exam and Student Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-black text-white shadow-sm">
              CBT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white truncate max-w-[180px] sm:max-w-xs">
                  {exam.subject}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {student.studentClass}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-sm">
                {student.name} • <span className="font-mono">NIS: {student.nis || student.nisn}</span>
              </p>
            </div>
          </div>

          {/* Center: Anti-cheat Live Badge & Fullscreen Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
              {violations.length === 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-300 font-medium">Layar Terkunci & Anti-Cheat Aktif</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-300 font-bold">
                    {violations.length} Pelanggaran ({violations.length}/{exam.maxViolations})
                  </span>
                </>
              )}
            </div>

            {/* Manual Fullscreen Toggle Button */}
            <button
              onClick={handleToggleFullscreen}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                isFullscreenActive
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
              }`}
              title={isFullscreenActive ? 'Mode Layar Penuh Aktif' : 'Klik untuk masuk mode layar penuh'}
            >
              {isFullscreenActive ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreenActive ? 'Layar Penuh' : 'Aktifkan Fullscreen'}</span>
            </button>
          </div>

          {/* Right: Countdown Timer & Selesai Button */}
          <div className="flex items-center gap-3">
            {/* TIMER COUNTDOWN DI POJOK KANAN */}
            <div 
              id="cbt-timer-box"
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl font-mono font-black text-sm sm:text-base border transition-colors ${
                timeLeft <= 300
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse'
                  : timeLeft <= 600
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                  : 'bg-slate-800 text-emerald-400 border-slate-700'
              }`}
            >
              <Clock className={`w-4 h-4 ${timeLeft <= 300 ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {/* Tombol Submit Cepat di Header */}
            <button
              id="cbt-header-submit-btn"
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kumpulkan</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUBHEADER: QUESTION NUMBER BREADCRUMB & FONT CONTROLS */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Soal No. {currentIndex + 1}</span>
          <span>dari {totalCount} Soal</span>
          <span className="h-3 w-px bg-slate-300 mx-1" />
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-200">
            Bobot: {currentQuestion?.points || 4} Poin
          </span>
        </div>

        {/* Font size control */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold px-1.5">Ukuran Teks:</span>
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              fontSize === 'normal' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2 py-0.5 rounded text-xs font-bold ${
              fontSize === 'large' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            A+
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={`px-2 py-0.5 rounded text-sm font-bold ${
              fontSize === 'xlarge' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            A++
          </button>
        </div>
      </div>

      {/* MAIN EXAM WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* LEFT / CENTER: QUESTION AREA (3 COLUMNS ON DESKTOP) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7 space-y-6">
            {/* Question Text Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span className="px-3 py-1 bg-slate-900 text-white font-extrabold text-xs rounded-lg">
                  SOAL #{currentIndex + 1}
                </span>
                {answers[currentQuestion?.id]?.isDoubtful && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-lg border border-amber-300 flex items-center gap-1">
                    <Flag className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Ditandai Ragu-Ragu</span>
                  </span>
                )}
              </div>

              {/* Text content */}
              <p className={`text-slate-900 font-medium whitespace-pre-line ${fontClass}`}>
                {currentQuestion?.text}
              </p>

              {/* Optional Question Image */}
              {currentQuestion?.image && (
                <div className="mt-4 rounded-xl border border-slate-200 p-2 bg-slate-50 max-w-lg">
                  <div className="relative group cursor-pointer" onClick={() => setZoomImageUrl(currentQuestion.image || null)}>
                    <img
                      src={currentQuestion.image}
                      alt="Ilustrasi Soal"
                      className="rounded-lg max-h-64 object-contain mx-auto transition-transform group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                      <ZoomIn className="w-4 h-4" />
                      <span>Klik untuk memperbesar gambar</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Multiple Choice Options (A, B, C, D, E) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Pilih Jawaban Anda:
              </label>

              {(currentQuestion?.options || []).map((opt) => {
                const isSelected = answers[currentQuestion.id]?.selectedOption === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, opt.key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {/* Key badge */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {opt.key}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1">
                      <span className={`text-slate-900 font-medium ${fontClass}`}>
                        {opt.text}
                      </span>
                    </div>

                    {/* Check indicator */}
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM CONTROLS: PREVIOUS, RAGU-RAGU, NEXT */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Previous button */}
            <button
              id="cbt-btn-prev"
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition ${
                currentIndex === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Ragu-ragu checkbox button */}
            <button
              id="cbt-btn-doubt"
              type="button"
              onClick={() => handleToggleDoubt(currentQuestion?.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border transition cursor-pointer ${
                answers[currentQuestion?.id]?.isDoubtful
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              <Flag className={`w-4 h-4 ${answers[currentQuestion?.id]?.isDoubtful ? 'fill-white' : ''}`} />
              <span>{answers[currentQuestion?.id]?.isDoubtful ? 'Batal Ragu-Ragu' : 'Ragu-Ragu'}</span>
            </button>

            {/* Next or Finish Button */}
            {currentIndex < totalCount - 1 ? (
              <button
                id="cbt-btn-next"
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="cbt-btn-finish"
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Selesai & Kumpulkan</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: QUESTION NUMBER NAVIGATION GRID (1 COLUMN) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>Navigasi Nomor Soal</span>
              <span className="text-xs font-normal text-slate-400">{answeredCount}/{totalCount} Terjawab</span>
            </h3>

            {/* Summary badges */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-1.5">
                <span className="block text-xs">{answeredCount}</span>
                <span>Dijawab</span>
              </div>
              <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-lg p-1.5">
                <span className="block text-xs">{doubtfulCount}</span>
                <span>Ragu-Ragu</span>
              </div>
              <div className="bg-slate-100 text-slate-700 border border-slate-200 rounded-lg p-1.5">
                <span className="block text-xs">{unansweredCount}</span>
                <span>Belum</span>
              </div>
            </div>

            {/* Grid of buttons 1..N */}
            <div className="grid grid-cols-5 gap-2 pt-1 max-h-[380px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const ans = answers[q.id];
                const isCurrent = idx === currentIndex;
                const isAnswered = ans && ans.selectedOption !== null;
                const isDoubt = ans && ans.isDoubtful;

                let btnBg = 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
                if (isDoubt) {
                  btnBg = 'bg-amber-500 text-white border-amber-600 font-bold';
                } else if (isAnswered) {
                  btnBg = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-11 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center relative cursor-pointer ${btnBg} ${
                      isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isAnswered && (
                      <span className="text-[9px] font-mono leading-none opacity-90">
                        {ans.selectedOption}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend info */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-600" />
                <span>Soal sudah dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-amber-500" />
                <span>Soal ragu-ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-white border border-slate-300" />
                <span>Belum dijawab</span>
              </div>
            </div>

            {/* Large Final Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                id="cbt-sidebar-submit-btn"
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-200 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kumpulkan Ujian</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: SUBMISSION CONFIRMATION */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 ring-8 ring-emerald-50">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Konfirmasi Kumpulkan Ujian</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin mengakhiri dan mengumpulkan lembar jawaban ujian <strong>{exam.subject}</strong>?
              </p>
            </div>

            {/* Status Checklist Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-700 font-semibold">
                <span>Soal Terjawab:</span>
                <span className="font-bold text-emerald-600">{answeredCount} dari {totalCount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-semibold">
                <span>Soal Belum Dijawab:</span>
                <span className={`font-bold ${unansweredCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                  {unansweredCount} Soal
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-700 font-semibold">
                <span>Soal Masih Ragu-Ragu:</span>
                <span className={`font-bold ${doubtfulCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {doubtfulCount} Soal
                </span>
              </div>
              {unansweredCount > 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                  Masih terdapat soal yang belum dijawab. Poin untuk soal kosong adalah 0.
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowSubmitModal(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                id="btn-confirm-final-submit"
                disabled={isSubmitting}
                onClick={async () => {
                  setShowSubmitModal(false);
                  await finalizeSubmission('SUBMITTED');
                }}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Ya, Kumpulkan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION PROGRESS OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-base text-slate-900">Mengumpulkan Lembar Ujian</h3>
              <p className="text-xs text-slate-600 font-medium">{submitFeedback}</p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full animate-pulse w-full" />
            </div>
            <p className="text-[11px] text-slate-400">Harap jangan menutup browser selama pengiriman ke server CBT.</p>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR QUESTION IMAGE ZOOM */}
      {zoomImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setZoomImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setZoomImageUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImageUrl}
              alt="Perbesaran Gambar Soal"
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      {/* ANTI-CHEAT WARNING & LOCKOUT MODAL */}
      <AntiCheatModal
        isOpen={showViolationModal}
        violation={activeViolationAlert}
        violationCount={violations.length}
        maxViolations={exam.maxViolations}
        onAcknowledge={handleAcknowledgeAlert}
        isDisqualified={isDisqualified}
      />
    </div>
  );
};
