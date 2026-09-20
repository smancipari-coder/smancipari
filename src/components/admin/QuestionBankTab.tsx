import React, { useState, useRef, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  X, 
  BookOpen, 
  HelpCircle,
  Eye,
  FileCheck,
  KeyRound,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  GraduationCap,
  Clock,
  ArrowRight,
  Layers,
  FolderPlus
} from 'lucide-react';
import { ExamSession, Question, StudentClass, ALL_CLASSES, AdminUser } from '../../types';
import { 
  getStoredQuestions, 
  saveQuestions, 
  getStoredExams, 
  saveExams, 
  addActivityLog 
} from '../../utils/storage';
import { generateExcelTemplate, parseExcelQuestions } from '../../utils/excelHelper';
import { copyToClipboard } from '../../utils/clipboard';

interface QuestionBankTabProps {
  exams: ExamSession[];
  onExamsUpdated: (exams: ExamSession[]) => void;
  currentAdmin?: AdminUser;
}

export const QuestionBankTab: React.FC<QuestionBankTabProps> = ({ exams, onExamsUpdated, currentAdmin }) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || '');
  const [questions, setQuestions] = useState<Question[]>(getStoredQuestions());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<ExamSession | null>(null);

  // Keep selected exam valid when exams array changes
  useEffect(() => {
    if (exams.length > 0) {
      if (!exams.some((e) => e.id === selectedExamId)) {
        setSelectedExamId(exams[0].id);
      }
    } else {
      setSelectedExamId('');
    }
  }, [exams, selectedExamId]);

  // Modal State for New Subject / Mapel
  const [isNewSubjectModalOpen, setIsNewSubjectModalOpen] = useState<boolean>(false);
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [newExamTitle, setNewExamTitle] = useState<string>('Penilaian Akhir Semester');
  const [newTargetType, setNewTargetType] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [newSelectedClasses, setNewSelectedClasses] = useState<StudentClass[]>(['10E1', '10E2', '10E3']);
  const [newDurationMinutes, setNewDurationMinutes] = useState<number>(60);
  const [newKkm, setNewKkm] = useState<number>(75);
  const [newMaxViolations, setNewMaxViolations] = useState<number>(3);
  const [newToken, setNewToken] = useState<string>('');
  const [newSubjectError, setNewSubjectError] = useState<string>('');

  // Modal State for Manual Question
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Manual Form Fields
  const [text, setText] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [optA, setOptA] = useState<string>('');
  const [optB, setOptB] = useState<string>('');
  const [optC, setOptC] = useState<string>('');
  const [optD, setOptD] = useState<string>('');
  const [optE, setOptE] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [points, setPoints] = useState<number>(4);
  const [explanation, setExplanation] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string>('');

  // Filtered Questions by Exam
  const examQuestions = questions
    .filter((q) => q.examId === selectedExamId)
    .sort((a, b) => a.number - b.number);

  const totalPoints = examQuestions.reduce((acc, q) => acc + q.points, 0);
  const currentExam = exams.find((e) => e.id === selectedExamId) || exams[0];

  const generateRandomToken = (prefix: string = 'MAP') => {
    const cleanPrefix = prefix.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'MAP';
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `${cleanPrefix}${rand}`;
  };

  const openNewSubjectModal = () => {
    setNewSubjectName('');
    setNewExamTitle('Penilaian Sumatif Semester');
    setNewTargetType('ALL');
    setNewSelectedClasses(['10E1', '10E2', '10E3']);
    setNewDurationMinutes(60);
    setNewKkm(75);
    setNewMaxViolations(3);
    setNewToken(generateRandomToken('MAP'));
    setNewSubjectError('');
    setIsNewSubjectModalOpen(true);
  };

  const handleSaveNewSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setNewSubjectError('');

    if (!newSubjectName.trim()) {
      setNewSubjectError('Nama mata pelajaran wajib diisi.');
      return;
    }
    if (!newExamTitle.trim()) {
      setNewSubjectError('Judul atau topik ujian wajib diisi.');
      return;
    }
    if (newDurationMinutes <= 0) {
      setNewSubjectError('Durasi ujian harus lebih dari 0 menit.');
      return;
    }

    const assignedToken = newToken.trim().toUpperCase() || generateRandomToken(newSubjectName);
    const newExamId = `exam-${Date.now()}`;

    const gradeLevels: ('10' | '11' | '12')[] = 
      newTargetType === 'ALL' 
        ? ['10', '11', '12'] 
        : Array.from(new Set(newSelectedClasses.map(c => c.slice(0, 2) as '10' | '11' | '12')));

    const newExam: ExamSession = {
      id: newExamId,
      title: newExamTitle.trim(),
      subject: newSubjectName.trim(),
      gradeLevels: gradeLevels.length > 0 ? gradeLevels : ['10'],
      targetClasses: newTargetType === 'ALL' ? 'ALL' : newSelectedClasses,
      startDate: new Date().toISOString().split('T')[0],
      startTime: '07:30',
      endTime: '15:00',
      durationMinutes: Number(newDurationMinutes) || 60,
      token: assignedToken,
      totalQuestions: 0,
      totalPoints: 0,
      kkm: Number(newKkm) || 75,
      maxViolations: Number(newMaxViolations) || 3,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: currentAdmin?.name || 'Super Admin Pusat',
      creatorUsername: currentAdmin?.username || 'admin',
      creatorRole: currentAdmin?.role || 'SUPER_ADMIN',
    };

    const updatedExams = [newExam, ...exams];
    saveExams(updatedExams);
    onExamsUpdated(updatedExams);
    setSelectedExamId(newExamId);
    setIsNewSubjectModalOpen(false);

    addActivityLog({
      actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
      role: currentAdmin?.role || 'SUPER_ADMIN',
      action: 'CREATE_EXAM',
      target: newExam.subject,
      details: `Membuat mata pelajaran baru: ${newExam.subject} (${newExam.title}) dengan Token ${newExam.token}. Dibuat oleh ${currentAdmin?.name || 'Admin'} [${currentAdmin?.role || 'SUPER_ADMIN'}].`,
      level: 'info'
    });
  };

  const handleOpenDeleteSubjectModal = () => {
    if (!currentExam) return;
    setSubjectToDelete(currentExam);
  };

  const handleConfirmDeleteSubject = () => {
    if (!subjectToDelete) return;

    const targetId = subjectToDelete.id;
    const targetSubject = subjectToDelete.subject;
    const targetTitle = subjectToDelete.title;

    // Filter out deleted exam from exams list
    const remainingExams = exams.filter((e) => e.id !== targetId);
    saveExams(remainingExams);
    onExamsUpdated(remainingExams);

    // Filter out all questions associated with this exam
    const remainingQuestions = questions.filter((q) => q.examId !== targetId);
    setQuestions(remainingQuestions);
    saveQuestions(remainingQuestions);

    // Select the next available exam if any
    if (remainingExams.length > 0) {
      setSelectedExamId(remainingExams[0].id);
    } else {
      setSelectedExamId('');
    }

    addActivityLog({
      actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
      role: currentAdmin?.role || 'SUPER_ADMIN',
      action: 'DELETE_EXAM',
      target: targetSubject,
      details: `Menghapus mata pelajaran aktif: ${targetSubject} (${targetTitle}) beserta seluruh butir soal di dalamnya. Dihapus oleh ${currentAdmin?.name || 'Admin'}.`,
      level: 'danger'
    });

    setSubjectToDelete(null);
  };

  const handleCopyToken = async (tok: string) => {
    await copyToClipboard(tok);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Sync questions with exams total count
  const syncExamTotals = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    saveQuestions(newQuestions);

    const updatedExams = exams.map((ex) => {
      const qList = newQuestions.filter((q) => q.examId === ex.id);
      return {
        ...ex,
        totalQuestions: qList.length,
        totalPoints: qList.reduce((acc, cur) => acc + cur.points, 0),
      };
    });
    saveExams(updatedExams);
    onExamsUpdated(updatedExams);
  };

  const openManualModal = (qToEdit?: Question) => {
    if (qToEdit) {
      setEditingQuestion(qToEdit);
      setText(qToEdit.text);
      setImageUrl(qToEdit.image || '');
      setOptA(qToEdit.options.find((o) => o.key === 'A')?.text || '');
      setOptB(qToEdit.options.find((o) => o.key === 'B')?.text || '');
      setOptC(qToEdit.options.find((o) => o.key === 'C')?.text || '');
      setOptD(qToEdit.options.find((o) => o.key === 'D')?.text || '');
      setOptE(qToEdit.options.find((o) => o.key === 'E')?.text || '');
      setCorrectAnswer(qToEdit.correctAnswer);
      setPoints(qToEdit.points);
      setExplanation(qToEdit.explanation || '');
    } else {
      setEditingQuestion(null);
      setText('');
      setImageUrl('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setOptE('');
      setCorrectAnswer('A');
      setPoints(4);
      setExplanation('');
    }
    setFormError('');
    setIsManualModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!text.trim()) {
      setFormError('Teks pertanyaan wajib diisi.');
      return;
    }
    if (!optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      setFormError('Minimal 4 pilihan jawaban (A, B, C, D) harus diisi.');
      return;
    }

    const options: Question['options'] = [
      { key: 'A', text: optA.trim() },
      { key: 'B', text: optB.trim() },
      { key: 'C', text: optC.trim() },
      { key: 'D', text: optD.trim() },
    ];
    if (optE.trim()) {
      options.push({ key: 'E', text: optE.trim() });
    }

    if (editingQuestion) {
      const updated = questions.map((q) =>
        q.id === editingQuestion.id
          ? {
              ...q,
              text: text.trim(),
              image: imageUrl.trim() || undefined,
              options,
              correctAnswer,
              points,
              explanation: explanation.trim() || undefined,
            }
          : q
      );
      syncExamTotals(updated);

      addActivityLog({
        actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
        role: currentAdmin?.role || 'SUPER_ADMIN',
        action: 'UPDATE_QUESTION',
        target: `Soal #${editingQuestion.number}`,
        details: `Memperbarui butir soal nomor ${editingQuestion.number}. Poin: ${points}. Diperbarui oleh ${currentAdmin?.name || 'Admin'}.`,
        level: 'info'
      });
    } else {
      const newNumber = examQuestions.length + 1;
      const newQuestion: Question = {
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        examId: selectedExamId,
        number: newNumber,
        text: text.trim(),
        image: imageUrl.trim() || undefined,
        options,
        correctAnswer,
        points,
        explanation: explanation.trim() || undefined,
        createdBy: currentAdmin?.name || 'Super Admin Pusat',
        creatorUsername: currentAdmin?.username || 'admin',
        creatorRole: currentAdmin?.role || 'SUPER_ADMIN',
      };

      const updated = [...questions, newQuestion];
      syncExamTotals(updated);

      addActivityLog({
        actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
        role: currentAdmin?.role || 'SUPER_ADMIN',
        action: 'CREATE_QUESTION',
        target: `Soal #${newNumber}`,
        details: `Menambahkan butir soal baru ke ujian ${selectedExamId}. Kunci: ${correctAnswer}, Poin: ${points}. Ditambahkan oleh ${currentAdmin?.name || 'Admin'} [${currentAdmin?.role || 'SUPER_ADMIN'}].`,
        level: 'info'
      });
    }

    setIsManualModalOpen(false);
  };

  const handleConfirmDeleteQuestion = () => {
    if (!questionToDelete) return;
    const q = questionToDelete;
    const filtered = questions.filter((item) => item.id !== q.id);
    // Re-number questions for this exam
    const renumbered = filtered.map((item) => {
      if (item.examId === selectedExamId && item.number > q.number) {
        return { ...item, number: item.number - 1 };
      }
      return item;
    });
    syncExamTotals(renumbered);

    addActivityLog({
      actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
      role: currentAdmin?.role || 'SUPER_ADMIN',
      action: 'DELETE_QUESTION',
      target: `Soal #${q.number}`,
      details: `Menghapus butir soal nomor ${q.number} dari bank soal. Dihapus oleh ${currentAdmin?.name || 'Admin'}.`,
      level: 'warning'
    });

    setQuestionToDelete(null);
  };

  // Handle Excel Upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadErrorMsg('');
    setUploadSuccessMsg('');

    try {
      const parsed = await parseExcelQuestions(file, selectedExamId, examQuestions.length);
      const taggedQuestions: Question[] = parsed.map((item) => ({
        ...item,
        createdBy: currentAdmin?.name || 'Super Admin Pusat',
        creatorUsername: currentAdmin?.username || 'admin',
        creatorRole: currentAdmin?.role || 'SUPER_ADMIN',
      }));
      const updated = [...questions, ...taggedQuestions];
      syncExamTotals(updated);

      const targetExam = exams.find((ex) => ex.id === selectedExamId);
      const successText = `Berhasil mengimpor ${parsed.length} butir soal dari file "${file.name}" ke ujian "${targetExam?.title || selectedExamId}".`;
      setUploadSuccessMsg(successText);

      addActivityLog({
        actor: currentAdmin ? `${currentAdmin.name} (@${currentAdmin.username})` : 'Administrator',
        role: currentAdmin?.role || 'SUPER_ADMIN',
        action: 'IMPORT_QUESTIONS',
        target: targetExam?.title || selectedExamId,
        details: `${successText} Diunggah oleh ${currentAdmin?.name || 'Admin'} [${currentAdmin?.role || 'SUPER_ADMIN'}].`,
        level: 'info'
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setUploadErrorMsg(err.message || 'Gagal memproses file Excel. Pastikan format kolom sesuai template.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDisplayQuestions = examQuestions.filter((q) => {
    if (!searchQuery.trim()) return true;
    return (
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.options.some((o) => o.text.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Exam Selector & Action Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="font-extrabold text-slate-900 text-lg">
                Bank Soal & Manajemen Mata Pelajaran (Mapel)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tambahkan mata pelajaran baru, atur token sesi, lalu tambahkan butir soal melalui upload file Excel massal atau input manual.
            </p>
          </div>

          {/* Subject / Exam Selector and Add / Delete Mapel Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 shrink-0">Mapel Aktif:</span>
              <select
                id="select-subject-exam"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={exams.length === 0}
                className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50"
              >
                {exams.length === 0 ? (
                  <option value="">Belum ada mata pelajaran</option>
                ) : (
                  exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.subject} — {ex.title} ({ex.token})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* "+ Tambah Mapel Baru" Button */}
            <button
              id="btn-add-new-subject"
              type="button"
              onClick={openNewSubjectModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ Tambah Mapel Baru</span>
            </button>

            {/* "Hapus Mapel Aktif" Button */}
            <button
              id="btn-delete-active-subject"
              type="button"
              disabled={!currentExam}
              onClick={handleOpenDeleteSubjectModal}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              title={currentExam ? `Hapus mata pelajaran aktif (${currentExam.subject}) beserta seluruh butir soalnya` : 'Pilih mata pelajaran terlebih dahulu'}
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Hapus Mapel Aktif</span>
            </button>
          </div>
        </div>

        {/* Empty state if no exams exist */}
        {!currentExam && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs space-y-2 mt-4">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">Belum Ada Mata Pelajaran Aktif</p>
            <p className="text-slate-500">
              Semua mata pelajaran telah dihapus atau belum dibuat. Silakan klik tombol <strong>"+ Tambah Mapel Baru"</strong> di atas untuk membuat mata pelajaran pertama.
            </p>
          </div>
        )}

        {/* Workflow Overview: 2 Clear Steps before Upload/Input */}
        {currentExam && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 border-t border-slate-100">
            {/* Step 1: Active Subject & Secret Token Info */}
            <div className="md:col-span-6 bg-linear-to-br from-slate-50 to-slate-100/70 p-4 rounded-xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">1</span>
                  Mata Pelajaran & Sesi Terpilih
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                  currentExam.status === 'ACTIVE' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {currentExam.status === 'ACTIVE' ? 'Sesi Aktif' : 'Draft'}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {currentExam.subject}
                </h3>
                <p className="text-xs text-slate-600">
                  {currentExam.title} • {currentExam.durationMinutes} Menit • KKM {currentExam.kkm}
                </p>
              </div>

              {/* Secret Admin Token Card */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                      <span>Token Ujian (Rahasia Admin)</span>
                    </div>
                    <span className="font-mono font-black text-sm tracking-wider text-slate-900">
                      {currentExam.token}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyToken(currentExam.token)}
                    className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition flex items-center gap-1 cursor-pointer"
                    title="Salin Token untuk diberikan kepada siswa saat ujian dimulai"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 text-[11px]">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px]">Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-amber-700 font-medium">
                * Token ini hanya tampil di menu admin dan setiap sesi ujian memiliki token yang berbeda.
              </p>
            </div>

            {/* Step 2: Question Addition Methods */}
            <div className="md:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">2</span>
                  Tambah Butir Soal ({examQuestions.length} Soal • Total {totalPoints} Poin)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Method A: Excel Upload */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Upload Massal Excel</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Unggah puluhan butir soal sekaligus dengan format .xlsx
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={generateExcelTemplate}
                      className="w-full py-1 px-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Unduh Template</span>
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleExcelUpload}
                      accept=".xlsx, .xls, .csv"
                      className="hidden"
                    />
                    <button
                      id="btn-upload-excel-questions"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Mengunggah...' : 'Pilih File Excel'}</span>
                    </button>
                  </div>
                </div>

                {/* Method B: Manual Question */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Edit3 className="w-4 h-4 text-indigo-600" />
                      <span>Input Soal Manual</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Buat butir soal satu per satu dengan teks, gambar, pilihan A-E, dan poin.
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      id="btn-add-manual-question"
                      type="button"
                      onClick={() => openManualModal()}
                      className="w-full py-2 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Input Soal Manual</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Notifications */}
        {uploadSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccessMsg}</span>
            </div>
            <button onClick={() => setUploadSuccessMsg('')} className="p-1 hover:text-emerald-950">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {uploadErrorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{uploadErrorMsg}</span>
            </div>
            <button onClick={() => setUploadErrorMsg('')} className="p-1 hover:text-rose-950">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari teks soal atau pilihan jawaban..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredDisplayQuestions.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-600">Belum ada butir soal pada sesi ujian ini.</p>
            <p>Klik "Tambah Soal Manual" atau "Upload Massal Excel" untuk mulai menambahkan soal.</p>
          </div>
        ) : (
          filteredDisplayQuestions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                    {q.number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                    {q.points} Poin
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Kunci: Opsi {q.correctAnswer}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openManualModal(q)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                    title="Edit Soal"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setQuestionToDelete(q)}
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    title="Hapus Soal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-xs sm:text-sm text-slate-900 font-medium whitespace-pre-line leading-relaxed">
                {q.text}
              </p>

              {/* Question Image Preview */}
              {q.image && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl max-w-sm">
                  <img
                    src={q.image}
                    alt={`Gambar Soal #${q.number}`}
                    className="rounded-lg max-h-48 object-contain mx-auto"
                  />
                </div>
              )}

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {q.options.map((opt) => {
                  const isCorrectKey = opt.key === q.correctAnswer;
                  return (
                    <div
                      key={opt.key}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                        isCorrectKey
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCorrectKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.key}
                      </div>
                      <span className="flex-1 truncate">{opt.text}</span>
                      {isCorrectKey && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800">Pembahasan: </span>
                  {q.explanation}
                </div>
              )}

              {/* Creator Metadata */}
              {q.createdBy && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Ditambahkan oleh:</span>
                  <span className="font-semibold text-slate-700">{q.createdBy}</span>
                  {q.creatorRole && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      q.creatorRole === 'GURU_MAPEL' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {q.creatorRole === 'GURU_MAPEL' ? 'Guru Mapel' : 'Super Admin'}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* DELETE ACTIVE SUBJECT CONFIRMATION MODAL */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base">
                Hapus Mata Pelajaran Aktif?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda akan menghapus mata pelajaran <strong className="text-rose-700 font-bold">{subjectToDelete.subject}</strong> ({subjectToDelete.title}).
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-800">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Dampak Penghapusan:</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-800/90">
                  <li>Seluruh <strong>{questions.filter(q => q.examId === subjectToDelete.id).length} butir soal</strong> pada mata pelajaran ini akan dihapus permanen.</li>
                  <li>Sesi ujian tidak akan lagi muncul di pilihan portal login siswa.</li>
                  <li>Token ujian <strong>{subjectToDelete.token}</strong> otomatis dinonaktifkan.</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSubjectToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                id="btn-confirm-delete-subject"
                type="button"
                onClick={handleConfirmDeleteSubject}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Ya, Hapus Mapel & Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE QUESTION CONFIRMATION MODAL */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">Hapus Soal #{questionToDelete.number}?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus butir soal nomor {questionToDelete.number}? Butir soal lainnya pada sesi ini akan otomatis diurutkan ulang.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteQuestion}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
              >
                Ya, Hapus Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL QUESTION MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {editingQuestion ? `Edit Soal #${editingQuestion.number}` : 'Input Soal Manual Baru'}
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Question Text */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Teks Pertanyaan / Butir Soal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tuliskan narasi atau soal ujian..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              {/* Question Image (URL or File Upload) */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Gambar / Ilustrasi Soal (Opsional)</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL Gambar (misal: https://...)"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                  <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 font-bold cursor-pointer text-center">
                    <span>Pilih File Gambar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageUrl && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 text-center">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-36 mx-auto rounded object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="mt-1 text-[11px] text-rose-600 hover:underline"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                )}
              </div>

              {/* Options A to E */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-700 uppercase tracking-wide">
                  Pilihan Ganda (A s.d. E):
                </label>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center">A</span>
                    <input
                      type="text"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Teks Pilihan A"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center">B</span>
                    <input
                      type="text"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Teks Pilihan B"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center">C</span>
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Teks Pilihan C"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center">D</span>
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Teks Pilihan D"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center">E</span>
                    <input
                      type="text"
                      value={optE}
                      onChange={(e) => setOptE(e.target.value)}
                      placeholder="Teks Pilihan E (Opsional)"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Correct Answer & Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Kunci Jawaban Benar <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="A">Opsi A</option>
                    <option value="B">Opsi B</option>
                    <option value="C">Opsi C</option>
                    <option value="D">Opsi D</option>
                    {optE.trim() && <option value="E">Opsi E</option>}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Bobot Poin Soal
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Pembahasan / Catatan Kunci (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Penjelasan mengapa jawaban tersebut benar..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-question-submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-sm transition cursor-pointer"
                >
                  {editingQuestion ? 'Simpan Perubahan' : 'Tambahkan ke Bank Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Mata Pelajaran & Sesi Ujian Baru */}
      {isNewSubjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Tambah Mata Pelajaran & Sesi Ujian</h3>
                  <p className="text-xs text-slate-400">Siapkan sesi ujian baru sebelum mengunggah atau membuat soal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSubjectModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSubject} className="p-6 space-y-4">
              {newSubjectError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{newSubjectError}</span>
                </div>
              )}

              {/* Subject Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nama Mata Pelajaran (Mapel) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fisika, Biologi, Kimia, Matematika..."
                  value={newSubjectName}
                  onChange={(e) => {
                    setNewSubjectName(e.target.value);
                    if (e.target.value.trim() && !newToken) {
                      setNewToken(generateRandomToken(e.target.value));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Exam Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Judul / Topik Ujian *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penilaian Akhir Semester (PAS) Ganjil"
                  value={newExamTitle}
                  onChange={(e) => setNewExamTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Duration & KKM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Durasi (Menit) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max="300"
                      required
                      value={newDurationMinutes}
                      onChange={(e) => setNewDurationMinutes(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    KKM Kelulusan
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newKkm}
                    onChange={(e) => setNewKkm(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Maks Toleransi Curang
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newMaxViolations}
                    onChange={(e) => setNewMaxViolations(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Target Class Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Target Peserta Siswa
                </label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="targetClasses"
                      checked={newTargetType === 'ALL'}
                      onChange={() => setNewTargetType('ALL')}
                      className="accent-indigo-600"
                    />
                    <span>Semua Kelas (10E1-E7, 11F1-F7, 12F1-F7)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="targetClasses"
                      checked={newTargetType === 'SPECIFIC'}
                      onChange={() => setNewTargetType('SPECIFIC')}
                      className="accent-indigo-600"
                    />
                    <span>Pilih Kelas Spesifik</span>
                  </label>
                </div>

                {newTargetType === 'SPECIFIC' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-36 overflow-y-auto flex flex-wrap gap-1.5">
                    {ALL_CLASSES.map((cls) => {
                      const isSelected = newSelectedClasses.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (newSelectedClasses.length > 1) {
                                setNewSelectedClasses(newSelectedClasses.filter(c => c !== cls));
                              }
                            } else {
                              setNewSelectedClasses([...newSelectedClasses, cls]);
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Secret Exam Token */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>Token Sesi Ujian (Khusus Admin / Pengawas)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewToken(generateRandomToken(newSubjectName || 'MAP'))}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                    title="Buat kode token unik baru"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Acak Ulang Token</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newToken}
                    onChange={(e) => setNewToken(e.target.value.toUpperCase())}
                    placeholder="Contoh: FIS8921"
                    className="w-full px-3.5 py-2 font-mono font-black text-sm tracking-widest bg-white border border-amber-300 rounded-lg text-slate-900 uppercase focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  🔒 Token ini hanya tampil di menu admin dan setiap sesi ujian berbeda. Siswa tidak dapat melihat atau menebak token di portal login.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewSubjectModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="btn-save-new-subject"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Simpan & Lanjut Tambah Soal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
