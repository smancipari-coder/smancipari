import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RefreshCw, 
  Layers, 
  AlertTriangle,
  FileCheck,
  ArrowRight,
  Info,
  Wand2,
  Check,
  Edit2
} from 'lucide-react';
import { 
  downloadStudentTemplateXls, 
  parseStudentExcelFile, 
  convertParsedRowsToStudents,
  autoFixAllRows,
  ParseResult,
  ParsedStudentRow
} from '../../utils/studentExcelHelper';
import { saveBulkRegisteredStudents } from '../../utils/storage';

interface UploadStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
  existingCount: number;
}

export const UploadStudentsModal: React.FC<UploadStudentsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingCount
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [autoFixNotice, setAutoFixNotice] = useState<string>('');
  const [importMode, setImportMode] = useState<'MERGE' | 'REPLACE'>(
    existingCount === 0 ? 'REPLACE' : 'MERGE'
  );
  const [downloadingFormat, setDownloadingFormat] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'ALL' | 'VALID' | 'ERROR'>('ALL');
  const [editingRowNis, setEditingRowNis] = useState<{ [rowNumber: number]: string }>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = (format: 'xlsx' | 'xls' = 'xlsx') => {
    setDownloadingFormat(true);
    try {
      downloadStudentTemplateXls(format);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloadingFormat(false), 800);
    }
  };

  const handleFileProcess = async (selectedFile: File) => {
    setErrorMessage('');
    setAutoFixNotice('');
    setPreviewTab('ALL');
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const lowerName = selectedFile.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => lowerName.endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Format file harus berformat Excel (.xlsx, .xls) atau .csv.');
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);

    try {
      const result = await parseStudentExcelFile(selectedFile);
      setParseResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memproses file Excel.');
      setFile(null);
      setParseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleResetFile = () => {
    setFile(null);
    setParseResult(null);
    setErrorMessage('');
    setAutoFixNotice('');
    setPreviewTab('ALL');
    setEditingRowNis({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAutoFixAll = (includeSummary: boolean = true) => {
    if (!parseResult) return;
    const result = autoFixAllRows(parseResult.allRows, { includeSummaryRows: includeSummary });
    const updatedValidRows = result.fixedRows.filter(r => r.isValid);
    const updatedInvalidRows = result.fixedRows.filter(r => !r.isValid);
    setParseResult({
      ...parseResult,
      totalRows: result.fixedRows.length,
      validRows: updatedValidRows,
      invalidRows: updatedInvalidRows,
      allRows: result.fixedRows,
      summaryRowsCount: 0,
      duplicateNisCount: 0,
      emptyNisCount: 0
    });
    setAutoFixNotice(`✨ Berhasil memperbaiki otomatis! Semua ${updatedValidRows.length} data siswa kini berstatus VALID dan siap diimpor ke database.`);
    setPreviewTab('VALID');
  };

  const handleFixSingleRow = (rowNumber: number, customNis?: string) => {
    if (!parseResult) return;
    const updatedAll = parseResult.allRows.map((r) => {
      if (r.rowNumber === rowNumber) {
        const newNis = customNis ? customNis.trim() : (r.nis || `7${String(r.rowNumber).padStart(3, '0')}`);
        return {
          ...r,
          nis: newNis,
          isValid: true,
          validationError: undefined,
          autoFixed: true
        };
      }
      return r;
    });
    const updatedValid = updatedAll.filter(r => r.isValid);
    const updatedInvalid = updatedAll.filter(r => !r.isValid);
    setParseResult({
      ...parseResult,
      validRows: updatedValid,
      invalidRows: updatedInvalid,
      allRows: updatedAll
    });
  };

  const handleConfirmImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) {
      setErrorMessage('Tidak ada data siswa yang valid untuk diimpor.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const studentObjs = convertParsedRowsToStudents(parseResult.validRows);
      const totalSaved = await saveBulkRegisteredStudents(studentObjs, importMode === 'REPLACE');
      
      onSuccess(totalSaved);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan data siswa ke database.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                Upload Data Siswa (.xls / .xlsx)
              </h3>
              <p className="text-xs text-slate-500">
                Impor massal daftar siswa dari spreadsheet Excel langsung ke database CBT online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Scrollable */}
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Template Download Prompt Banner */}
          <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs border border-emerald-100">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 block">
                  Template Resmi Excel CBT (.xls / .xlsx)
                </span>
                <span className="text-[11px] text-slate-600 block mt-0.5 leading-relaxed">
                  Download format tabel resmi: NIS (Nomor Induk Siswa), Nama Lengkap, Kelas, Gender (L/P), NISN, dan Asal Sekolah. Mendukung multi-sheet (per rombel atau gabungan).
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                id="btn-download-template-xlsx"
                onClick={() => handleDownloadTemplate('xlsx')}
                disabled={downloadingFormat}
                className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Template (.xlsx)</span>
              </button>
              <button
                type="button"
                id="btn-download-template-xls"
                onClick={() => handleDownloadTemplate('xls')}
                disabled={downloadingFormat}
                title="Format Excel 97-2003 (.xls)"
                className="px-2.5 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>.XLS</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Area (If no file selected) */}
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' 
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-800">
                  Klik untuk pilih file atau tarik file ke sini
                </p>
                <p className="text-xs text-slate-500">
                  Mendukung file spreadsheet Microsoft Excel (<strong>.xlsx</strong>, <strong>.xls</strong>) atau <strong>.csv</strong>
                </p>
              </div>
              <div className="pt-2">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-indigo-600 shadow-2xs">
                  Pilih File Dari Komputer
                </span>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-600">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-xs font-bold">Membaca dan memvalidasi lembar data Excel...</p>
            </div>
          )}

          {/* Parsed Results Preview */}
          {parseResult && !isLoading && (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-black text-slate-900 block truncate">
                      {parseResult.fileName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Total baris: {parseResult.totalRows} data siswa
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetFile}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition cursor-pointer shrink-0"
                >
                  Ganti File
                </button>
              </div>

              {/* Auto Fix Notification */}
              {autoFixNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-bold flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{autoFixNotice}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAutoFixNotice('')} 
                    className="p-1 hover:bg-emerald-100 rounded text-emerald-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 100% Valid Success Banner */}
              {parseResult.invalidRows.length === 0 && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-emerald-950 block">
                        ✨ Seluruh {parseResult.validRows.length} Data Siswa Valid (0 Eror)
                      </span>
                      <p className="text-[11px] text-emerald-800">
                        Terverifikasi {new Set(parseResult.validRows.map((r) => r.studentClass)).size} rombel kelas. Seluruh data siap langsung dimasukkan ke database CBT.
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0">
                    100% Siap Impor
                  </span>
                </div>
              )}

              {/* Diagnostic Banner if there are invalid/skipped rows */}
              {parseResult.invalidRows.length > 0 && (
                <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-extrabold text-xs text-amber-950 block">
                        Penjelasan: Mengapa {parseResult.invalidRows.length} Baris Dilewati?
                      </span>
                      <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                        Dari total <strong>{parseResult.totalRows} baris</strong> di file Excel Anda, sebanyak <strong>{parseResult.validRows.length} siswa valid</strong> dan <strong>{parseResult.invalidRows.length} baris</strong> terdeteksi memiliki catatan:
                      </p>
                      <ul className="list-disc list-inside text-[11px] text-amber-900 font-medium mt-1 space-y-0.5">
                        {parseResult.summaryRowsCount > 0 && (
                          <li>
                            <strong>{parseResult.summaryRowsCount} baris</strong> rekapitulasi/total di Excel (misal: "JUMLAH SISWA", "WALI KELAS", atau footer).
                          </li>
                        )}
                        {parseResult.emptyNisCount > 0 && (
                          <li>
                            <strong>{parseResult.emptyNisCount} baris</strong> kolom NIS kosong / belum terisi.
                          </li>
                        )}
                        {parseResult.duplicateNisCount > 0 && (
                          <li>
                            <strong>{parseResult.duplicateNisCount} baris</strong> NIS kembar / terduplikasi.
                          </li>
                        )}
                        {parseResult.summaryRowsCount === 0 && parseResult.emptyNisCount === 0 && parseResult.duplicateNisCount === 0 && (
                          <li>
                            <strong>{parseResult.invalidRows.length} baris</strong> format nama atau nomor induk belum lengkap.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Quick Auto Fix or Review Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/80">
                    <button
                      type="button"
                      id="btn-autofix-all-students"
                      onClick={() => handleAutoFixAll(true)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-xs shadow-indigo-200"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>✨ Perbaiki Otomatis & Masukkan Seluruh {parseResult.totalRows} Siswa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewTab('ERROR')}
                      className="px-3 py-2 bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Lihat {parseResult.invalidRows.length} Baris Dilewati</span>
                    </button>

                    {parseResult.validRows.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleAutoFixAll(false)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        title="Hapus baris rekapitulasi Excel dan jadikan seluruh siswa asli valid"
                      >
                        <span>Abaikan Rekapitulasi Saja</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Validation Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div 
                  onClick={() => setPreviewTab('VALID')}
                  className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 cursor-pointer hover:bg-emerald-100/50 transition"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block">Baris Valid & Rombel</span>
                    <span className="text-base font-black text-emerald-950">
                      {parseResult.validRows.length} Siswa
                      <span className="text-xs font-bold text-emerald-700 block">
                        ({new Set(parseResult.validRows.map((r) => r.studentClass)).size} Rombel Terdeteksi)
                      </span>
                    </span>
                  </div>
                </div>

                <div 
                  onClick={() => setPreviewTab('ERROR')}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition ${
                    parseResult.invalidRows.length > 0 
                      ? 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100/60' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 shrink-0 ${parseResult.invalidRows.length > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-[10px] font-bold uppercase block">Baris Dilewati / Error</span>
                    <span className="text-base font-black">{parseResult.invalidRows.length} Baris</span>
                    <span className="text-[10px] block opacity-80">Klik untuk periksa detail</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <Layers className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-700 block">Database Saat Ini</span>
                    <span className="text-base font-black text-indigo-950">{existingCount} Siswa</span>
                    <span className="text-[10px] text-slate-500 block">
                      {existingCount === 0 ? '(Database kosong, siap diimpor)' : '(Tersimpan di CBT)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Import Mode Radio Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  Pilih Cara Penggabungan Data:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label 
                    onClick={() => setImportMode('MERGE')}
                    className={`p-3 rounded-xl border-2 flex items-start gap-2.5 cursor-pointer transition ${
                      importMode === 'MERGE' 
                        ? 'bg-white border-indigo-600 shadow-xs' 
                        : 'border-slate-200 hover:bg-white/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="import-mode"
                      checked={importMode === 'MERGE'}
                      onChange={() => setImportMode('MERGE')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <span className="font-extrabold text-slate-900 block">
                        Gabung & Perbarui (Disarankan)
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Menambahkan siswa baru atau memperbarui data siswa jika NIS sudah ada. Data siswa lama tetap utuh.
                      </span>
                    </div>
                  </label>

                  <label 
                    onClick={() => setImportMode('REPLACE')}
                    className={`p-3 rounded-xl border-2 flex items-start gap-2.5 cursor-pointer transition ${
                      importMode === 'REPLACE' 
                        ? 'bg-white border-rose-600 shadow-xs' 
                        : 'border-slate-200 hover:bg-white/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="import-mode"
                      checked={importMode === 'REPLACE'}
                      onChange={() => setImportMode('REPLACE')}
                      className="mt-0.5 text-rose-600"
                    />
                    <div>
                      <span className="font-extrabold text-rose-900 block flex items-center gap-1">
                        Timpa Seluruh Database
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Menghapus data siswa yang lama dan menggantinya sepenuhnya hanya dengan data dari file Excel ini.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data Preview Table with Filter Tabs */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-slate-100/90 px-3.5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewTab === 'ALL' 
                          ? 'bg-white text-indigo-700 shadow-xs border border-slate-200' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Semua Data ({parseResult.allRows.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('VALID')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewTab === 'VALID' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Valid ({parseResult.validRows.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('ERROR')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewTab === 'ERROR' 
                          ? 'bg-rose-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-rose-700'
                      }`}
                    >
                      Perlu Diperbaiki / Dilewati ({parseResult.invalidRows.length})
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Menampilkan {
                      previewTab === 'VALID' 
                        ? `${Math.min(parseResult.validRows.length, 100)} siswa valid`
                        : previewTab === 'ERROR'
                        ? `${parseResult.invalidRows.length} baris dilewati`
                        : `${Math.min(parseResult.allRows.length, 100)} dari ${parseResult.allRows.length} baris`
                    }
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[9px] border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">No. Excel</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">NIS</th>
                        <th className="py-2 px-3">Nama Siswa / Baris</th>
                        <th className="py-2 px-3">Kelas</th>
                        <th className="py-2 px-3 text-center">L/P</th>
                        <th className="py-2 px-3">Keterangan / Masalah</th>
                        <th className="py-2 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(previewTab === 'VALID' 
                        ? parseResult.validRows 
                        : previewTab === 'ERROR' 
                        ? parseResult.invalidRows 
                        : parseResult.allRows
                      ).slice(0, 100).map((row) => {
                        const isEditingThis = editingRowNis[row.rowNumber] !== undefined;
                        const currentInputNis = isEditingThis ? editingRowNis[row.rowNumber] : row.nis;

                        return (
                          <tr 
                            key={row.rowNumber} 
                            className={row.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/50 hover:bg-rose-50'}
                          >
                            <td className="py-2 px-3 text-slate-400 font-mono text-center">
                              {row.rowNumber}
                            </td>
                            <td className="py-2 px-3">
                              {row.isValid ? (
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[9px] flex items-center gap-1 w-fit">
                                  <Check className="w-2.5 h-2.5" />
                                  {row.autoFixed ? 'DIPERBAIKI' : 'VALID'}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-black text-[9px] flex items-center gap-1 w-fit">
                                  <AlertCircle className="w-2.5 h-2.5" />
                                  DILEWATI
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              {!row.isValid ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={currentInputNis}
                                    placeholder="Isi NIS"
                                    onChange={(e) => {
                                      setEditingRowNis({
                                        ...editingRowNis,
                                        [row.rowNumber]: e.target.value
                                      });
                                    }}
                                    className="w-20 px-1.5 py-0.5 text-xs font-mono font-black border border-rose-300 rounded bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleFixSingleRow(row.rowNumber, currentInputNis)}
                                    title="Terapkan NIS ini"
                                    className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <span className="font-mono font-black text-indigo-700">
                                  {row.nis || '-'}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900 uppercase truncate max-w-[170px]">
                              {row.name || <span className="text-rose-500 italic">Nama kosong</span>}
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-700">
                              {row.studentClass}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-slate-600">
                              {row.gender}
                            </td>
                            <td className="py-2 px-3 text-[10px] text-slate-600">
                              {row.isValid ? (
                                <span className="text-emerald-700 font-medium">Siap diimpor</span>
                              ) : (
                                <span className="text-rose-700 font-semibold" title={row.validationError}>
                                  {row.validationError}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {!row.isValid ? (
                                <button
                                  type="button"
                                  onClick={() => handleFixSingleRow(row.rowNumber)}
                                  className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold cursor-pointer transition whitespace-nowrap"
                                >
                                  Jadikan Valid
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[10px]">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Tutup
          </button>

          {parseResult && parseResult.validRows.length > 0 && (
            <button
              type="button"
              id="btn-confirm-import-students"
              onClick={handleConfirmImport}
              disabled={isSaving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md shadow-indigo-200 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <span>Impor {parseResult.validRows.length} Siswa ({new Set(parseResult.validRows.map((r) => r.studentClass)).size} Rombel) Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
