import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap, 
  Hash, 
  CheckCircle2, 
  Database, 
  Plus, 
  X,
  School,
  Sparkles,
  Copy,
  Check,
  UploadCloud,
  FileSpreadsheet,
  Download,
  Trash2,
  Edit2,
  AlertTriangle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Layers
} from 'lucide-react';
import { RegisteredStudent, StudentClass, AdminUser } from '../../types';
import { 
  getStoredRegisteredStudents, 
  saveRegisteredStudent, 
  updateRegisteredStudent,
  deleteRegisteredStudent,
  clearAllRegisteredStudents,
  CBT_EVENT_STATE_UPDATE 
} from '../../utils/storage';
import { UploadStudentsModal } from './UploadStudentsModal';
import { downloadStudentTemplateXls } from '../../utils/studentExcelHelper';

interface StudentsDatabaseTabProps {
  currentAdmin: AdminUser;
}

export const StudentsDatabaseTab: React.FC<StudentsDatabaseTabProps> = ({ currentAdmin }) => {
  const [students, setStudents] = useState<RegisteredStudent[]>(getStoredRegisteredStudents());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('ALL');
  const [copiedNis, setCopiedNis] = useState<string | null>(null);

  // Modal State for Upload Excel
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Modal State for adding custom student
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newNis, setNewNis] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newClass, setNewClass] = useState<StudentClass>('10E1');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newNisn, setNewNisn] = useState<string>('');
  const [newSchoolOrigin, setNewSchoolOrigin] = useState<string>('SMA Negeri 1 Cipari');
  const [addError, setAddError] = useState<string>('');
  const [addSuccess, setAddSuccess] = useState<string>('');

  // Modal State for editing single student
  const [editingStudent, setEditingStudent] = useState<RegisteredStudent | null>(null);
  const [editNis, setEditNis] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editClass, setEditClass] = useState<StudentClass>('10E1');
  const [editGender, setEditGender] = useState<'L' | 'P'>('L');
  const [editNisn, setEditNisn] = useState<string>('');
  const [editSchoolOrigin, setEditSchoolOrigin] = useState<string>('');
  const [editError, setEditError] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Modal State for deleting single student
  const [deletingStudent, setDeletingStudent] = useState<RegisteredStudent | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Modal State for clearing all students
  const [showClearModal, setShowClearModal] = useState<boolean>(false);
  const [isClearing, setIsClearing] = useState<boolean>(false);

  // Rekap Data Siswa: Tampilan per 100, kelipatannya (200, 300, 400, 500), atau seluruh siswa
  const [pageSize, setPageSize] = useState<string>('100');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const allClasses: StudentClass[] = [
    '10E1', '10E2', '10E3', '10E4', '10E5', '10E6', '10E7',
    '11F1', '11F2', '11F3', '11F4', '11F5', '11F6', '11F7',
    '12F1', '12F2', '12F3', '12F4', '12F5', '12F6', '12F7',
  ];

  // Refresh students on event update
  useEffect(() => {
    const handleUpdate = () => {
      setStudents(getStoredRegisteredStudents());
    };
    window.addEventListener(CBT_EVENT_STATE_UPDATE, handleUpdate);
    return () => {
      window.removeEventListener(CBT_EVENT_STATE_UPDATE, handleUpdate);
    };
  }, []);

  // Reset page to 1 on filter or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClassFilter, selectedGenderFilter, pageSize]);

  // Cakupan Rombel: Rincian jumlah kelas 10, 11, dan 12
  const classStats = useMemo(() => {
    const classes10 = new Set<string>();
    const classes11 = new Set<string>();
    const classes12 = new Set<string>();
    let students10 = 0;
    let students11 = 0;
    let students12 = 0;

    students.forEach((s) => {
      const cls = (s.studentClass || '').trim();
      const upper = cls.toUpperCase();
      if (cls.startsWith('10') || upper.startsWith('X-') || upper.startsWith('X ') || upper.startsWith('X.') || upper === 'X' || upper.startsWith('XE') || upper.startsWith('10E')) {
        classes10.add(cls);
        students10++;
      } else if (cls.startsWith('11') || upper.startsWith('XI-') || upper.startsWith('XI ') || upper.startsWith('XI.') || upper === 'XI' || upper.startsWith('XIF') || upper.startsWith('11F')) {
        classes11.add(cls);
        students11++;
      } else if (cls.startsWith('12') || upper.startsWith('XII-') || upper.startsWith('XII ') || upper.startsWith('XII.') || upper === 'XII' || upper.startsWith('XIIF') || upper.startsWith('12F')) {
        classes12.add(cls);
        students12++;
      } else if (upper.includes('10') || upper.includes('E')) {
        classes10.add(cls);
        students10++;
      } else if (upper.includes('11')) {
        classes11.add(cls);
        students11++;
      } else if (upper.includes('12')) {
        classes12.add(cls);
        students12++;
      }
    });

    const totalRombel = new Set(students.map((s) => s.studentClass)).size;

    return {
      totalRombel,
      rombel10: classes10.size,
      students10,
      rombel11: classes11.size,
      students11,
      rombel12: classes12.size,
      students12,
    };
  }, [students]);

  // Available classes list from current database
  const availableClasses = useMemo(() => {
    const set = new Set<string>(allClasses);
    students.forEach((s) => {
      if (s.studentClass) set.add(s.studentClass);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        s.nis.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.nisn && s.nisn.toLowerCase().includes(q)) ||
        (s.schoolOrigin && s.schoolOrigin.toLowerCase().includes(q)) ||
        (s.altNis && s.altNis.some((a) => a.toLowerCase().includes(q)))
      );

      const matchesClass = selectedClassFilter === 'ALL' || s.studentClass === selectedClassFilter;
      const matchesGender = selectedGenderFilter === 'ALL' || s.gender === selectedGenderFilter;

      return matchesSearch && matchesClass && matchesGender;
    });
  }, [students, searchQuery, selectedClassFilter, selectedGenderFilter]);

  // Pagination calculations
  const totalItems = filteredStudents.length;
  const isShowAll = pageSize === 'ALL';
  const numericPageSize = isShowAll ? (totalItems || 1) : parseInt(pageSize, 10);
  const totalPages = isShowAll || totalItems === 0 ? 1 : Math.ceil(totalItems / numericPageSize);
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedStudents = useMemo(() => {
    if (isShowAll) return filteredStudents;
    const start = (validCurrentPage - 1) * numericPageSize;
    return filteredStudents.slice(start, start + numericPageSize);
  }, [filteredStudents, isShowAll, validCurrentPage, numericPageSize]);

  const startIndex = isShowAll ? 0 : (validCurrentPage - 1) * numericPageSize;
  const endIndex = isShowAll ? totalItems : Math.min(startIndex + numericPageSize, totalItems);

  // Copy NIS to clipboard
  const handleCopy = (nis: string) => {
    navigator.clipboard?.writeText(nis);
    setCopiedNis(nis);
    setTimeout(() => setCopiedNis(null), 2000);
  };

  // Add new student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    const cleanNis = newNis.replace(/\D/g, '').slice(0, 4);
    const cleanName = newName.trim().toUpperCase();

    if (!cleanNis || cleanNis.length < 1 || cleanNis.length > 4) {
      setAddError('NIS wajib diisi 1 sampai 4 digit angka.');
      return;
    }
    if (!cleanName || cleanName.length < 3) {
      setAddError('Nama lengkap siswa minimal 3 karakter.');
      return;
    }

    const existing = students.find((s) => s.nis === cleanNis || s.nis.padStart(4, '0') === cleanNis.padStart(4, '0'));
    if (existing) {
      setAddError(`NIS ${cleanNis} sudah terdaftar atas nama ${existing.name} (${existing.studentClass}).`);
      return;
    }

    const studentObj: RegisteredStudent = {
      id: `student-custom-${cleanNis}-${Date.now()}`,
      nis: cleanNis,
      name: cleanName,
      studentClass: newClass,
      gender: newGender,
      nisn: newNisn.trim() || undefined,
      altNis: [cleanNis, cleanNis.padStart(4, '0'), String(parseInt(cleanNis, 10))],
      schoolOrigin: newSchoolOrigin.trim() || undefined,
    };

    await saveRegisteredStudent(studentObj);
    setStudents(getStoredRegisteredStudents());
    setAddSuccess(`Siswa ${cleanName} (NIS: ${cleanNis}) berhasil disimpan ke database online!`);
    
    // Reset form
    setNewNis('');
    setNewName('');
    setNewNisn('');
    setTimeout(() => {
      setShowAddModal(false);
      setAddSuccess('');
    }, 1500);
  };

  // Open Edit Student Modal
  const handleStartEdit = (student: RegisteredStudent) => {
    setEditingStudent(student);
    setEditNis(student.nis);
    setEditName(student.name);
    setEditClass(student.studentClass);
    setEditGender(student.gender);
    setEditNisn(student.nisn || '');
    setEditSchoolOrigin(student.schoolOrigin || 'SMA Negeri 1 Cipari');
    setEditError('');
  };

  // Save Student Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setEditError('');

    const cleanNis = editNis.replace(/\D/g, '').slice(0, 4);
    const cleanName = editName.trim().toUpperCase();

    if (!cleanNis || cleanNis.length < 1 || cleanNis.length > 4) {
      setEditError('NIS wajib diisi 1 sampai 4 digit angka.');
      return;
    }
    if (!cleanName || cleanName.length < 3) {
      setEditError('Nama lengkap siswa minimal 3 karakter.');
      return;
    }

    // Check duplicate NIS excluding currently edited student
    const duplicate = students.find((s) => s.id !== editingStudent.id && (
      s.nis === cleanNis || s.nis.padStart(4, '0') === cleanNis.padStart(4, '0')
    ));
    if (duplicate) {
      setEditError(`NIS ${cleanNis} sudah digunakan oleh siswa lain: ${duplicate.name} (${duplicate.studentClass}).`);
      return;
    }

    setIsUpdating(true);
    try {
      const altNisSet = new Set<string>([cleanNis, cleanNis.padStart(4, '0'), String(parseInt(cleanNis, 10))]);
      const updatedObj: RegisteredStudent = {
        ...editingStudent,
        nis: cleanNis,
        name: cleanName,
        studentClass: editClass,
        gender: editGender,
        nisn: editNisn.trim() || undefined,
        altNis: Array.from(altNisSet),
        schoolOrigin: editSchoolOrigin.trim() || 'SMA Negeri 1 Cipari'
      };

      await updateRegisteredStudent(updatedObj);
      setStudents(getStoredRegisteredStudents());
      setEditingStudent(null);
      setImportNotification(`Data siswa ${cleanName} (NIS: ${cleanNis}) berhasil diperbarui.`);
      setTimeout(() => setImportNotification(null), 6000);
    } catch (err: any) {
      setEditError(err.message || 'Gagal menyimpan perubahan siswa.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Confirm Single Delete
  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await deleteRegisteredStudent(deletingStudent.id);
      const remaining = getStoredRegisteredStudents();
      setStudents(remaining);
      setImportNotification(`Siswa ${deletingStudent.name} (NIS: ${deletingStudent.nis}) berhasil dihapus.`);
      setDeletingStudent(null);
      setTimeout(() => setImportNotification(null), 6000);
    } catch (err: any) {
      alert('Gagal menghapus siswa: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Confirm Clear All Students
  const handleConfirmClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllRegisteredStudents();
      setStudents([]);
      setShowClearModal(false);
      setImportNotification('Seluruh data siswa berhasil dikosongkan (0 siswa terdaftar). Anda dapat mengunggah file Excel baru kapan saja.');
      setTimeout(() => setImportNotification(null), 8000);
    } catch (err: any) {
      alert('Gagal mengosongkan data siswa: ' + err.message);
    } finally {
      setIsClearing(false);
    }
  };

  const handleUploadSuccess = (count: number) => {
    setStudents(getStoredRegisteredStudents());
    setImportNotification(`Berhasil mengimpor data siswa! Saat ini total ${count} siswa terdaftar di database CBT.`);
    setTimeout(() => {
      setImportNotification(null);
    }, 8000);
  };

  const uniqueClassesCount = useMemo(() => {
    return new Set(students.map((s) => s.studentClass)).size;
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Import Notification Banner */}
      {importNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold leading-relaxed">{importNotification}</span>
          </div>
          <button
            onClick={() => setImportNotification(null)}
            className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100/80 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Siswa Terdaftar: Data Upload & Input Sebelumnya */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Siswa Terdaftar</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{students.length} Siswa</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1">
            <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Data terupload (Excel) & input manual sebelumnya</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Database CBT Online Sinkron
            </span>
          </div>
        </div>

        {/* Cakupan Rombel Kelas: Jumlah Kelas 10, 11, dan 12 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cakupan Rombel Kelas</span>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{classStats.totalRombel} Rombel</div>
            </div>
          </div>
          {/* Rincian Rombel Kelas 10, 11, dan 12 */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center">
            <div className="p-1.5 rounded-xl bg-blue-50/80 border border-blue-100">
              <div className="text-[10px] font-bold text-blue-800 uppercase">Kelas 10</div>
              <div className="text-xs font-black text-blue-900">{classStats.rombel10} Rombel</div>
              <div className="text-[10px] text-blue-600 font-medium">{classStats.students10} Siswa</div>
            </div>
            <div className="p-1.5 rounded-xl bg-indigo-50/80 border border-indigo-100">
              <div className="text-[10px] font-bold text-indigo-800 uppercase">Kelas 11</div>
              <div className="text-xs font-black text-indigo-900">{classStats.rombel11} Rombel</div>
              <div className="text-[10px] text-indigo-600 font-medium">{classStats.students11} Siswa</div>
            </div>
            <div className="p-1.5 rounded-xl bg-purple-50/80 border border-purple-100">
              <div className="text-[10px] font-bold text-purple-800 uppercase">Kelas 12</div>
              <div className="text-xs font-black text-purple-900">{classStats.rombel12} Rombel</div>
              <div className="text-[10px] text-purple-600 font-medium">{classStats.students12} Siswa</div>
            </div>
          </div>
        </div>

        {/* Format Login Siswa */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format Login Siswa</span>
              <div className="text-base font-black text-slate-900 mt-0.5">NIS (Maks. 4 Digit)</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Auto-Fill Nama Lengkap
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Login Siswa: <strong>Hanya NIS</strong></span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Tanpa Password
            </span>
          </div>
        </div>
      </div>

      {/* Action Toolbar Card: Upload Excel, Download Template XLS, Add Manual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Pengelolaan & Impor Data Siswa
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unduh template format Excel (.xls/.xlsx) atau unggah data massal siswa ke sistem CBT
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Download Template Button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="btn-download-student-template-xls"
              onClick={() => downloadStudentTemplateXls('xlsx')}
              className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-2xs group"
              title="Download Template Format Excel (.xlsx)"
            >
              <Download className="w-4 h-4 text-emerald-600 group-hover:-translate-y-0.5 transition-transform" />
              <span>Unduh Template XLS</span>
            </button>
            <button
              type="button"
              id="btn-download-student-template-legacy-xls"
              onClick={() => downloadStudentTemplateXls('xls')}
              className="px-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-[10px] font-bold transition cursor-pointer"
              title="Download format .XLS (Excel 97-2003)"
            >
              .XLS
            </button>
          </div>

          {/* Upload Data Siswa Button */}
          {(currentAdmin.role === 'SUPER_ADMIN' || currentAdmin.role === 'GURU_MAPEL') && (
            <button
              type="button"
              id="btn-open-upload-student-modal"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Data Siswa</span>
            </button>
          )}

          {/* Add Student Manual (Super Admin) */}
          {currentAdmin.role === 'SUPER_ADMIN' && (
            <button
              type="button"
              id="btn-add-student-manual"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Manual</span>
            </button>
          )}

          {/* Kosongkan Data Siswa / Reset (Super Admin & Guru) */}
          {(currentAdmin.role === 'SUPER_ADMIN' || currentAdmin.role === 'GURU_MAPEL') && (
            <button
              type="button"
              id="btn-clear-students-data"
              onClick={() => setShowClearModal(true)}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-[0.99]"
              title="Kosongkan seluruh data siswa dari database CBT"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Kosongkan Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card: Rekap Data Siswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Title & Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Rekap Data Siswa
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {filteredStudents.length} dari {students.length} Siswa
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar siswa terdaftar hasil upload file Excel dan input manual sistem CBT
              </p>
            </div>

            {/* Menu Tampilan Siswa per 100, kelipatannya, atau seluruh siswa */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white px-3 py-1.5 border border-slate-300 rounded-xl shadow-2xs">
                <Eye className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="font-bold text-slate-500">Tampilan:</span>
                <select
                  id="select-student-page-size"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent font-black text-indigo-700 focus:outline-none cursor-pointer"
                  title="Pilih jumlah tampilan siswa per halaman atau seluruh siswa"
                >
                  <option value="100">100 Siswa / Halaman</option>
                  <option value="200">200 Siswa / Halaman</option>
                  <option value="300">300 Siswa / Halaman</option>
                  <option value="400">400 Siswa / Halaman</option>
                  <option value="500">500 Siswa / Halaman</option>
                  <option value="ALL">Tampilkan Seluruh Siswa ({filteredStudents.length})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-1">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari NIS, Nama Siswa, atau Asal..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Kelas:</span>
              </div>
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-[220px]"
              >
                <option value="ALL">Semua Kelas ({students.length})</option>
                {availableClasses.map((cls) => {
                  const count = students.filter((s) => s.studentClass === cls).length;
                  return (
                    <option key={cls} value={cls}>
                      Kelas {cls} ({count} siswa)
                    </option>
                  );
                })}
              </select>

              <select
                value={selectedGenderFilter}
                onChange={(e) => setSelectedGenderFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="ALL">Semua Gender</option>
                <option value="L">Laki-Laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">NIS (Maks. 4 Digit)</th>
                <th className="py-3 px-4">Nama Lengkap Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4 text-center">L/P</th>
                <th className="py-3 px-4">NISN</th>
                <th className="py-3 px-4">Asal Sekolah</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    {students.length === 0 ? (
                      <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Database Siswa Kosong</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Belum ada data siswa yang terdaftar. Silakan unggah file Excel data siswa atau tambah siswa secara manual.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowUploadModal(true)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Upload Excel</span>
                          </button>
                          {(currentAdmin.role === 'SUPER_ADMIN' || currentAdmin.role === 'GURU_MAPEL') && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewNis('');
                                setNewName('');
                                setNewClass('10E1');
                                setNewGender('L');
                                setNewNisn('');
                                setNewSchoolOrigin('');
                                setShowAddModal(true);
                              }}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah Manual</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span>Tidak ditemukan data siswa yang cocok dengan kriteria pencarian "{searchQuery}".</span>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => {
                  const itemNumber = startIndex + idx + 1;
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition group">
                      <td className="py-3 px-4 text-slate-400 font-mono font-medium">{itemNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-black text-sm text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                          {student.nis}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 uppercase">
                        {student.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {student.studentClass}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {student.gender}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {student.nisn || '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">
                        {student.schoolOrigin || 'SMA Negeri 1 Cipari'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Salin NIS */}
                          <button
                            type="button"
                            onClick={() => handleCopy(student.nis)}
                            className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                            title="Salin NIS untuk login siswa"
                          >
                            {copiedNis === student.nis ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Tersalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>

                          {/* Edit Siswa */}
                          {(currentAdmin.role === 'SUPER_ADMIN' || currentAdmin.role === 'GURU_MAPEL') && (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(student)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs transition cursor-pointer"
                              title={`Edit data siswa: ${student.name}`}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                            </button>
                          )}

                          {/* Hapus Siswa */}
                          {(currentAdmin.role === 'SUPER_ADMIN' || currentAdmin.role === 'GURU_MAPEL') && (
                            <button
                              type="button"
                              onClick={() => setDeletingStudent(student)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs transition cursor-pointer"
                              title={`Hapus data siswa: ${student.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info & Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Left: Summary Count */}
          <div className="flex items-center gap-2 text-slate-600">
            <span>
              Menampilkan <strong className="text-slate-900">{totalItems === 0 ? 0 : startIndex + 1} - {endIndex}</strong> dari <strong className="text-slate-900">{totalItems}</strong> siswa
              {totalItems !== students.length && (
                <span className="text-slate-400"> (Total database: {students.length} siswa)</span>
              )}
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-slate-500 font-medium">
              {isShowAll ? (
                <span className="text-indigo-600 font-bold">Mode Seluruh Siswa</span>
              ) : (
                <span>Halaman {validCurrentPage} dari {totalPages} ({pageSize} / hal)</span>
              )}
            </span>
          </div>

          {/* Right: Pagination Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Page Size Toggle in footer as well */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mr-1">
              <span>Per hal:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="ALL">Semua ({filteredStudents.length})</option>
              </select>
            </div>

            {!isShowAll && totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  disabled={validCurrentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Halaman Pertama"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>

                {/* Previous Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page Number Chips */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show current page, first, last, and immediate neighbors
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - validCurrentPage) <= 1
                    );
                  })
                  .map((page, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const hasGap = prevPage && page - prevPage > 1;
                    return (
                      <React.Fragment key={page}>
                        {hasGap && <span className="px-1 text-slate-400">...</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[28px] h-7 px-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                            page === validCurrentPage
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

                {/* Next Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Last Page */}
                <button
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={validCurrentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Halaman Terakhir"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: ADD STUDENT (SUPER ADMIN) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                  +
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Tambah Siswa ke Database
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {addError}
              </div>
            )}
            {addSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{addSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Nomor Induk Siswa (NIS) <span className="text-rose-500">* (Maks. 4 Digit)</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={newNis}
                  onChange={(e) => setNewNis(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Contoh: 6999"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value.toUpperCase())}
                  placeholder="CONTOH: BUDI SANTOSO"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Rombel / Kelas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value as StudentClass)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {allClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        Kelas {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  NISN (Opsional)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={newNisn}
                  onChange={(e) => setNewNisn(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Contoh: 0103644066 (10 digit)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Asal Sekolah / SMP
                </label>
                <input
                  type="text"
                  value={newSchoolOrigin}
                  onChange={(e) => setNewSchoolOrigin(e.target.value)}
                  placeholder="Contoh: SMP NEGERI 1 CIPARI"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-100 transition cursor-pointer"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT STUDENT */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Edit Data Siswa
                  </h3>
                  <p className="text-[11px] text-slate-500">Perbarui rincian siswa di database CBT</p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Nomor Induk Siswa (NIS) <span className="text-rose-500">* (Maks. 4 Digit)</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={editNis}
                  onChange={(e) => setEditNis(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="Contoh: 6999"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Digunakan oleh siswa saat login portal ujian</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Nama Lengkap Siswa <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value.toUpperCase())}
                  placeholder="CONTOH: BUDI SANTOSO"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Rombel / Kelas <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value as StudentClass)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    {allClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        Kelas {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                    Jenis Kelamin <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  NISN (Opsional)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={editNisn}
                  onChange={(e) => setEditNisn(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Contoh: 0103644066 (10 digit)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wide">
                  Asal Sekolah / SMP
                </label>
                <input
                  type="text"
                  value={editSchoolOrigin}
                  onChange={(e) => setEditSchoolOrigin(e.target.value)}
                  placeholder="Contoh: SMP NEGERI 1 CIPARI"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-100 transition cursor-pointer flex items-center gap-1.5"
                >
                  {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE STUDENT CONFIRMATION */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Hapus Data Siswa
                </h3>
                <p className="text-xs text-slate-500">Konfirmasi penghapusan siswa dari database</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nama Siswa:</span>
                <span className="font-black text-slate-900 uppercase">{deletingStudent.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">NIS Login:</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {deletingStudent.nis}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Kelas:</span>
                <span className="font-bold text-slate-800">{deletingStudent.studentClass}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Jenis Kelamin:</span>
                <span className="font-bold text-slate-800">{deletingStudent.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus data siswa ini? Siswa ini tidak akan dapat login lagi menggunakan NIS <strong>{deletingStudent.nis}</strong> pada ujian CBT.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md shadow-rose-100 transition cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Siswa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KOSONGKAN DATA SISWA (CLEAR ALL) */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">
                  Kosongkan Database Siswa
                </h3>
                <p className="text-xs text-slate-500">Tindakan pengelolaan database online CBT</p>
              </div>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                Peringatan: Seluruh data siswa akan dihapus
              </p>
              <p className="text-rose-700">
                Saat ini terdapat <strong>{students.length} siswa</strong> terdaftar di sistem CBT. Mengosongkan data akan menghapus semua siswa tersebut dari sistem, sehingga tidak ada siswa yang dapat login ujian sampai data baru diunggah melalui menu <strong>Upload Data Siswa</strong>.
              </p>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleConfirmClearAll}
                disabled={isClearing}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isClearing ? 'Memproses...' : `Ya, Kosongkan Semua Data (${students.length} Siswa)`}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition cursor-pointer text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Students Excel Modal */}
      <UploadStudentsModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
        existingCount={students.length}
      />
    </div>
  );
};
