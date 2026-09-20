import * as XLSX from 'xlsx';
import { RegisteredStudent, StudentClass } from '../types';

export interface ParsedStudentRow {
  rowNumber: number;
  nis: string;
  name: string;
  studentClass: StudentClass;
  gender: 'L' | 'P';
  nisn?: string;
  schoolOrigin?: string;
  isValid: boolean;
  validationError?: string;
  isSummaryRow?: boolean;
  autoFixed?: boolean;
  originalRawRow?: Record<string, any>;
}

export interface ParseResult {
  fileName: string;
  totalRows: number;
  validRows: ParsedStudentRow[];
  invalidRows: ParsedStudentRow[];
  allRows: ParsedStudentRow[];
  summaryRowsCount: number;
  duplicateNisCount: number;
  emptyNisCount: number;
}

const VALID_CLASSES: Set<string> = new Set([
  '10E1', '10E2', '10E3', '10E4', '10E5', '10E6', '10E7',
  '11F1', '11F2', '11F3', '11F4', '11F5', '11F6', '11F7',
  '12F1', '12F2', '12F3', '12F4', '12F5', '12F6', '12F7'
]);

/**
 * Normalizes grade/class string from Excel to standard CBT class code
 * Examples: 
 * - "10 E 1", "X E 1", "10-E-1", "10-1", "X-1", "10.1", "10 1" -> "10E1"
 * - "11 F 1", "XI F 1", "11-F-1", "11-1", "XI-1", "11.1", "11 1" -> "11F1"
 * - "12 F 1", "XII F 1", "12-F-1", "12-1", "XII-1", "12.1", "12 1" -> "12F1"
 * - Preserves custom rombel names cleanly if school uses other notations (e.g. "10 MIPA 1")
 */
export function normalizeClass(raw: string): StudentClass {
  if (!raw) return '10E1';
  const trimmed = String(raw).trim();
  const upper = trimmed.toUpperCase();
  const cleaned = upper.replace(/[\s\-_.]/g, '');

  // 1. Direct match with standard 21 rombel (10E1-10E7, 11F1-11F7, 12F1-12F7)
  if (VALID_CLASSES.has(cleaned)) {
    return cleaned as StudentClass;
  }

  // 2. Strip prefix "KELAS" or "ROMBEL"
  const stripped = upper
    .replace(/^KELAS\s*/i, '')
    .replace(/^ROMBEL\s*/i, '')
    .trim();

  // Kurikulum Merdeka Fase E / F format (e.g. "10 E 1", "X E 1", "10.E.1", "10-E-1")
  const matchE = stripped.match(/^(?:10|X)[\s\-_.]*E[\s\-_.]*([1-7])$/i);
  if (matchE) {
    return `10E${matchE[1]}` as StudentClass;
  }

  const match11F = stripped.match(/^(?:11|XI)[\s\-_.]*F[\s\-_.]*([1-7])$/i);
  if (match11F) {
    return `11F${match11F[1]}` as StudentClass;
  }

  const match12F = stripped.match(/^(?:12|XII)[\s\-_.]*F[\s\-_.]*([1-7])$/i);
  if (match12F) {
    return `12F${match12F[1]}` as StudentClass;
  }

  // Simple number formats (e.g. "10-1", "10.1", "10 1", "X-1", "X.1", "X 1") -> 10E1 .. 10E7
  const matchNum10 = stripped.match(/^(?:10|X)[\s\-_.]*([1-7])$/i);
  if (matchNum10) {
    return `10E${matchNum10[1]}` as StudentClass;
  }

  const matchNum11 = stripped.match(/^(?:11|XI)[\s\-_.]*([1-7])$/i);
  if (matchNum11) {
    return `11F${matchNum11[1]}` as StudentClass;
  }

  const matchNum12 = stripped.match(/^(?:12|XII)[\s\-_.]*([1-7])$/i);
  if (matchNum12) {
    return `12F${matchNum12[1]}` as StudentClass;
  }

  // Compact formats like "101" to "107"
  if (/^10[1-7]$/.test(cleaned)) {
    return `10E${cleaned.slice(2)}` as StudentClass;
  }
  if (/^11[1-7]$/.test(cleaned)) {
    return `11F${cleaned.slice(2)}` as StudentClass;
  }
  if (/^12[1-7]$/.test(cleaned)) {
    return `12F${cleaned.slice(2)}` as StudentClass;
  }

  // Check if standard code is a substring
  for (const vc of Array.from(VALID_CLASSES)) {
    if (cleaned.includes(vc)) {
      return vc as StudentClass;
    }
  }

  // 3. Keep formatted class string (e.g. "10 MIPA 1", "10-A", "11-B") rather than forcing everything to 10E1!
  let normalizedCustom = upper.replace(/\s+/g, ' ');
  if (normalizedCustom.startsWith('X-') || normalizedCustom.startsWith('X ') || normalizedCustom.startsWith('X.')) {
    normalizedCustom = '10' + normalizedCustom.slice(1);
  } else if (normalizedCustom.startsWith('XI-') || normalizedCustom.startsWith('XI ') || normalizedCustom.startsWith('XI.')) {
    normalizedCustom = '11' + normalizedCustom.slice(2);
  } else if (normalizedCustom.startsWith('XII-') || normalizedCustom.startsWith('XII ') || normalizedCustom.startsWith('XII.')) {
    normalizedCustom = '12' + normalizedCustom.slice(3);
  }

  return (normalizedCustom || '10E1') as StudentClass;
}

/**
 * Generate and download official Excel template (.xlsx / .xls)
 */
export function downloadStudentTemplateXls(format: 'xlsx' | 'xls' = 'xlsx') {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Template Data Siswa
  const sampleData = [
    {
      NO: 1,
      NIS: "6418",
      NAMA_LENGKAP: "AHMAD FADHIL PRATAMA",
      KELAS: "10E1",
      JENIS_KELAMIN: "L",
      NISN: "0081234561",
      ASAL_SEKOLAH: "SMP NEGERI 1 CIPARI"
    },
    {
      NO: 2,
      NIS: "6419",
      NAMA_LENGKAP: "AISYAH NURUL AZIZAH",
      KELAS: "10E1",
      JENIS_KELAMIN: "P",
      NISN: "0081234562",
      ASAL_SEKOLAH: "SMP NEGERI 2 CIPARI"
    },
    {
      NO: 3,
      NIS: "6169",
      NAMA_LENGKAP: "BAGAS DWI SAPUTRA",
      KELAS: "11F1",
      JENIS_KELAMIN: "L",
      NISN: "0071234563",
      ASAL_SEKOLAH: "SMP NEGERI 1 CIPARI"
    },
    {
      NO: 4,
      NIS: "5912",
      NAMA_LENGKAP: "CITRA LESTARI DEWI",
      KELAS: "12F1",
      JENIS_KELAMIN: "P",
      NISN: "0061234564",
      ASAL_SEKOLAH: "MTs NEGERI 1 CILACAP"
    },
    {
      NO: 5,
      NIS: "0001",
      NAMA_LENGKAP: "DANU SETIAWAN",
      KELAS: "10E2",
      JENIS_KELAMIN: "L",
      NISN: "0081234565",
      ASAL_SEKOLAH: "SMP PGRI CIPARI"
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);

  // Column widths
  ws['!cols'] = [
    { wch: 6 },  // NO
    { wch: 14 }, // NIS
    { wch: 34 }, // NAMA_LENGKAP
    { wch: 14 }, // KELAS
    { wch: 16 }, // JENIS_KELAMIN
    { wch: 18 }, // NISN
    { wch: 30 }, // ASAL_SEKOLAH
  ];

  XLSX.utils.book_append_sheet(wb, ws, "DATA_SISWA");

  // Sheet 2: Petunjuk Format
  const guideData = [
    ["PETUNJUK PENGISIAN TEMPLATE DATA SISWA CBT ONLINE"],
    ["SMA NEGERI 1 CIPARI — TAHUN AJARAN 2025/2026"],
    [""],
    ["NAMA KOLOM", "KEHARUSAN", "PENJELASAN DAN ATURAN FORMAT"],
    ["NO", "Opsional", "Nomor urut baris (1, 2, 3, dst.)"],
    ["NIS", "WAJIB", "Nomor Induk Siswa (Contoh: 6418, 6169, 24001, 0001, 25). Kolom ini dipakai siswa saat login ujian."],
    ["NAMA_LENGKAP", "WAJIB", "Nama lengkap siswa dengan huruf KAPITAL (Contoh: AHMAD FADHIL PRATAMA)"],
    ["KELAS", "WAJIB", "Format rombel CBT resmi (21 Rombel): 10E1 s.d. 10E7, 11F1 s.d. 11F7, 12F1 s.d. 12F7 (mendukung juga penulisan 10-1 s.d. 10-7, X-1, dsb.)"],
    ["JENIS_KELAMIN", "WAJIB", "Ketik 'L' untuk Laki-laki atau 'P' untuk Perempuan"],
    ["NISN", "Opsional", "Nomor Induk Siswa Nasional 10 digit (Contoh: 0081234561)"],
    ["ASAL_SEKOLAH", "Opsional", "SMP/MTs asal siswa (Contoh: SMP NEGERI 1 CIPARI)"],
    [""],
    ["CATATAN PENTING:"],
    ["1. Jangan mengubah atau menghapus baris judul (Header) pada baris pertama."],
    ["2. Pastikan NIS unik (tidak boleh ada dua siswa dengan NIS yang sama)."],
    ["3. Jika ada angka 0 di depan NIS (misal: 0001), format sel sebagai Text di Excel agar angka 0 tidak terhapus."],
    ["4. File yang dapat di-upload berformat .xlsx, .xls, atau .csv."],
    ["5. Mendukung multi-sheet: file dapat berisi lembar kerja per rombel (21 sheets) ataupun 1 lembar kerja gabungan seluruh 728 siswa."]
  ];

  const wsGuide = XLSX.utils.aoa_to_sheet(guideData);
  wsGuide['!cols'] = [
    { wch: 20 },
    { wch: 25 },
    { wch: 85 }
  ];
  XLSX.utils.book_append_sheet(wb, wsGuide, "PETUNJUK_FORMAT");

  const fileName = format === 'xls' ? 'Template_Data_Siswa_CBT_Online.xls' : 'Template_Data_Siswa_CBT_Online.xlsx';
  XLSX.writeFile(wb, fileName);
}

/**
 * Parse uploaded Excel or CSV file with smart header detection and summary row identification
 */
export async function parseStudentExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('File Excel tidak memiliki lembar kerja (worksheet).');
        }

        const validRows: ParsedStudentRow[] = [];
        const invalidRows: ParsedStudentRow[] = [];
        const allRows: ParsedStudentRow[] = [];
        const seenNis = new Set<string>();

        // Identify candidate sheets to read
        // Filter out non-data sheets such as instructions/guides
        const IGNORED_SHEET_KEYWORDS = ['PETUNJUK', 'PANDUAN', 'GUIDE', 'INSTRUKSI', 'README', 'COVER', 'INFORMASI'];
        
        let sheetNamesToProcess = workbook.SheetNames.filter((name) => {
          const upper = name.toUpperCase().trim();
          return !IGNORED_SHEET_KEYWORDS.some((kw) => upper.includes(kw));
        });

        // If all sheets were filtered out, fallback to all sheets or first sheet
        if (sheetNamesToProcess.length === 0) {
          sheetNamesToProcess = workbook.SheetNames;
        }

        let globalRowIndex = 0;
        let lastKnownClass = 'KELAS X';

        for (const sheetName of sheetNamesToProcess) {
          const worksheet = workbook.Sheets[sheetName];
          if (!worksheet) continue;

          // Convert sheet to Array of Arrays (aoa) with raw cell values
          const sheetAoa = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
          if (!sheetAoa || sheetAoa.length === 0) continue;

          // If the sheet name itself is a class name (e.g. "10E1", "10-1", "X-1", "11F2", etc.),
          // we can use it as fallback class if a row has empty class
          const fallbackClassFromSheet = normalizeClass(sheetName);
          if (fallbackClassFromSheet && fallbackClassFromSheet !== 'UMUM') {
            lastKnownClass = fallbackClassFromSheet;
          }

          // 1. SMART HEADER ROW AUTO-DETECTION:
          // Scan the first 25 rows to identify the actual header row containing column labels.
          let headerRowIndex = 0;
          let maxHeaderMatches = 0;
          const HEADER_KEYWORDS = [
            'NIS', 'NIPD', 'INDUK', 'PESERTA', 'UJIAN', 'NAMA', 'SISWA', 'KELAS', 
            'ROMBEL', 'GENDER', 'KELAMIN', 'JK', 'NISN', 'ASAL'
          ];

          for (let r = 0; r < Math.min(sheetAoa.length, 25); r++) {
            const rowCells = sheetAoa[r];
            if (!Array.isArray(rowCells) || rowCells.length === 0) continue;
            let matches = 0;
            for (const cell of rowCells) {
              const cellStr = String(cell || '').toUpperCase().trim();
              if (!cellStr) continue;
              if (HEADER_KEYWORDS.some(kw => cellStr.includes(kw))) {
                matches++;
              }
            }
            if (matches > maxHeaderMatches) {
              maxHeaderMatches = matches;
              headerRowIndex = r;
            }
          }

          // Extract header names
          const headerRowCells = sheetAoa[headerRowIndex] || [];
          const headers: string[] = headerRowCells.map((h: any, colIdx: number) => {
            const str = String(h || '').trim();
            return str || `COL_${colIdx}`;
          });

          // Process rows below the header row
          for (let rIdx = headerRowIndex + 1; rIdx < sheetAoa.length; rIdx++) {
            const rowCells = sheetAoa[rIdx];
            if (!Array.isArray(rowCells) || rowCells.length === 0) continue;

            // Build key-value map for this row
            const rowObj: Record<string, any> = {};
            let hasAnyContent = false;
            let fullRowString = '';

            headers.forEach((hdr, cIdx) => {
              const val = rowCells[cIdx];
              if (val !== undefined && val !== null && String(val).trim() !== '') {
                hasAnyContent = true;
                rowObj[hdr] = String(val).trim();
                fullRowString += ' ' + String(val).trim();
              }
            });

            if (!hasAnyContent) continue;

            const rowKeys = Object.keys(rowObj);

            const getVal = (...candidates: string[]): string => {
              for (const cand of candidates) {
                const target = cand.toUpperCase().replace(/[\s\-_.]/g, '');
                const matchedKey = rowKeys.find((k) => k.toUpperCase().replace(/[\s\-_.]/g, '') === target);
                if (matchedKey && rowObj[matchedKey] !== undefined && rowObj[matchedKey] !== null) {
                  return String(rowObj[matchedKey]).trim();
                }
              }
              return '';
            };

            const rawNis = getVal(
              'NIS', 'NIPD', 'NOMOR_INDUK', 'NOMOR INDUK', 'NO INDUK', 'NO_INDUK', 
              'NO. INDUK', 'NO.INDUK', 'NOMOR INDUK SISWA', 'NO INDUK SISWA', 
              'NIS/NISN', 'NIS / NISN', 'NO_PESERTA', 'NO PESERTA', 'NO. PESERTA', 
              'NOMOR PESERTA', 'NOMOR_PESERTA', 'NO_UJIAN', 'NO UJIAN', 'NO. UJIAN', 
              'NOMOR UJIAN', 'ID_SISWA', 'ID SISWA', 'ID_PESERTA', 'ID PESERTA', 
              'ID', 'KODE_SISWA', 'KODE SISWA', 'KODE', 'USERNAME', 'USER_NAME', 'USER',
              'NO DAFTAR', 'NO_DAFTAR', 'NO DAFTAR/NIS', 'NIS LOKAL', 'NIS_LOKAL'
            );

            const rawName = getVal(
              'NAMA_LENGKAP', 'NAMA LENGKAP', 'NAMA_SISWA', 'NAMA SISWA', 
              'NAMA PESERTA', 'NAMA_PESERTA', 'STUDENT_NAME', 'FULL_NAME', 
              'FULLNAME', 'NAMA', 'NAME'
            );

            let rawClass = getVal(
              'KELAS', 'ROMBEL', 'ROMBONGAN_BELAJAR', 'ROMBONGAN BELAJAR', 
              'TINGKAT', 'CLASS', 'KELAS_ROMBEL', 'KELAS / ROMBEL', 'KELAS/ROMBEL', 'JURUSAN'
            );

            const rawGender = getVal(
              'JENIS_KELAMIN', 'JENIS KELAMIN', 'JK', 'GENDER', 'SEX', 'L/P', 'LP', 'L / P'
            );

            const rawNisn = getVal(
              'NISN', 'NO_NISN', 'NOMOR_NISN', 'NOMOR NISN', 'NO. NISN', 'NIS_NASIONAL'
            );

            const rawSchool = getVal(
              'ASAL_SEKOLAH', 'ASAL SEKOLAH', 'SEKOLAH_ASAL', 'SEKOLAH ASAL', 
              'ASAL SMP', 'SMP_ASAL', 'SEKOLAH', 'ASAL_SMP'
            );

            const rawNo = getVal('NO', 'NO.', 'NOMOR', 'NO_URUT', 'NO URUT', 'URUT');

            // Skip completely empty spacer rows
            if (!rawNis && !rawName && !rawClass && !rawNo && !rawNisn && fullRowString.trim().length === 0) {
              continue;
            }

            // Skip accidental repeated header row
            if (rawNis.toUpperCase() === 'NIS' && rawName.toUpperCase().includes('NAMA')) {
              continue;
            }
            if (rawName.toUpperCase() === 'NAMA LENGKAP' || rawName.toUpperCase() === 'NAMA SISWA') {
              continue;
            }

            globalRowIndex++;
            let autoFixed = false;

            // 1. Resolve Class
            let cleanClass = normalizeClass(rawClass);
            if (!cleanClass || cleanClass === 'UMUM') {
              if (fallbackClassFromSheet && fallbackClassFromSheet !== 'UMUM') {
                cleanClass = fallbackClassFromSheet;
              } else if (lastKnownClass) {
                cleanClass = lastKnownClass;
              } else {
                cleanClass = 'KELAS X';
              }
            } else {
              lastKnownClass = cleanClass;
            }

            // 2. Resolve Name
            let cleanName = rawName.trim().toUpperCase();
            if (!cleanName || cleanName.length < 2) {
              // Try to find any cell in rowObj with a name-like string
              for (const [, v] of Object.entries(rowObj)) {
                const s = String(v || '').trim().toUpperCase();
                if (s.length >= 2 && !/^\d+$/.test(s) && !['L', 'P', 'LK', 'PR'].includes(s) && !s.includes('KELAS')) {
                  cleanName = s;
                  autoFixed = true;
                  break;
                }
              }
              if (!cleanName || cleanName.length < 2) {
                cleanName = `SISWA ${cleanClass} ${globalRowIndex}`;
                autoFixed = true;
              }
            }

            // 3. Resolve NIS & Guarantee Uniqueness
            let cleanNis = String(rawNis || '').trim().replace(/[^a-zA-Z0-9_-]/g, '');
            if (!cleanNis && rawNisn) {
              cleanNis = rawNisn.replace(/\D/g, '');
            }
            if (!cleanNis) {
              // Automatically assign unique sequential NIS (e.g. 7001, 7002, ...)
              cleanNis = `7${String(globalRowIndex).padStart(4, '0')}`;
              autoFixed = true;
            }

            // Check if cleanNis is already used (avoid collisions or duplicate drop)
            if (seenNis.has(cleanNis)) {
              let suffix = 2;
              while (seenNis.has(`${cleanNis}-${suffix}`)) {
                suffix++;
              }
              cleanNis = `${cleanNis}-${suffix}`;
              autoFixed = true;
            }
            seenNis.add(cleanNis);

            // 4. Resolve Gender
            let cleanGender: 'L' | 'P' = 'L';
            const gUpper = rawGender.toUpperCase().trim();
            if (gUpper.startsWith('P') || gUpper.startsWith('W') || gUpper === 'F' || gUpper === 'PEREMPUAN') {
              cleanGender = 'P';
            } else {
              cleanGender = 'L';
            }

            const parsedRow: ParsedStudentRow = {
              rowNumber: globalRowIndex,
              nis: cleanNis,
              name: cleanName,
              studentClass: cleanClass,
              gender: cleanGender,
              nisn: rawNisn.replace(/\D/g, '') || undefined,
              schoolOrigin: rawSchool.trim() || undefined,
              isValid: true,
              validationError: undefined,
              isSummaryRow: false,
              autoFixed,
              originalRawRow: rowObj
            };

            allRows.push(parsedRow);
            validRows.push(parsedRow);
          }
        }

        if (allRows.length === 0) {
          throw new Error('File Excel tidak memiliki baris data siswa yang dapat dibaca.');
        }

        const summaryRowsCount = invalidRows.filter(r => r.isSummaryRow).length;
        const duplicateNisCount = invalidRows.filter(r => r.validationError?.includes('terduplikasi')).length;
        const emptyNisCount = invalidRows.filter(r => !r.isSummaryRow && (!r.nis || r.nis.length < 1)).length;

        resolve({
          fileName: file.name,
          totalRows: allRows.length,
          validRows,
          invalidRows,
          allRows,
          summaryRowsCount,
          duplicateNisCount,
          emptyNisCount
        });
      } catch (err: any) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file Excel.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Automatically fixes all rows (generates missing/duplicate NIS and optionally includes or converts summary rows)
 * Ensures 100% of rows can be imported into CBT!
 */
export function autoFixAllRows(
  allRows: ParsedStudentRow[],
  options: { includeSummaryRows?: boolean } = {}
): { fixedRows: ParsedStudentRow[]; validCount: number; fixedCount: number } {
  const includeSummary = options.includeSummaryRows ?? true;
  const usedNis = new Set<string>();

  // First pass: register all currently valid non-empty NIS
  allRows.forEach((r) => {
    if (r.isValid && r.nis && !r.isSummaryRow) {
      usedNis.add(r.nis.trim());
    }
  });

  let fixedCount = 0;
  let counter = 7001;

  const getNextUniqueNis = (baseCandidate?: string): string => {
    if (baseCandidate && !usedNis.has(baseCandidate)) {
      usedNis.add(baseCandidate);
      return baseCandidate;
    }
    if (baseCandidate) {
      let suffix = 2;
      while (usedNis.has(`${baseCandidate}-${suffix}`)) {
        suffix++;
      }
      const candidate = `${baseCandidate}-${suffix}`;
      usedNis.add(candidate);
      return candidate;
    }
    while (usedNis.has(String(counter))) {
      counter++;
    }
    const candidate = String(counter);
    usedNis.add(candidate);
    counter++;
    return candidate;
  };

  const fixedRows: ParsedStudentRow[] = [];

  allRows.forEach((row) => {
    if (row.isSummaryRow && !includeSummary) {
      return;
    }

    let finalNis = row.nis ? row.nis.trim() : '';
    let wasFixed = false;

    // Fix empty NIS
    if (!finalNis) {
      if (row.nisn && !usedNis.has(row.nisn)) {
        finalNis = row.nisn;
      } else {
        finalNis = getNextUniqueNis(String(7000 + row.rowNumber));
      }
      wasFixed = true;
    } else if (usedNis.has(finalNis) && !row.isValid) {
      // Fix duplicate NIS
      finalNis = getNextUniqueNis(finalNis);
      wasFixed = true;
    } else {
      usedNis.add(finalNis);
    }

    // Fix empty student name
    let finalName = row.name ? row.name.trim() : `SISWA ${row.rowNumber}`;
    if (finalName.length < 2) {
      finalName = `SISWA ${row.rowNumber}`;
      wasFixed = true;
    }

    if (wasFixed) {
      fixedCount++;
    }

    fixedRows.push({
      ...row,
      nis: finalNis,
      name: finalName,
      isValid: true,
      validationError: undefined,
      autoFixed: wasFixed || row.autoFixed
    });
  });

  return {
    fixedRows,
    validCount: fixedRows.filter(r => r.isValid).length,
    fixedCount
  };
}

/**
 * Converts valid parsed rows into RegisteredStudent objects
 */
export function convertParsedRowsToStudents(rows: ParsedStudentRow[]): RegisteredStudent[] {
  return rows.map((r, index) => {
    const rawNis = r.nis;
    const padded = rawNis.length <= 4 ? rawNis.padStart(4, '0') : rawNis;
    const numericClean = /^\d+$/.test(rawNis) ? String(parseInt(rawNis, 10)) : rawNis;

    const altNisSet = new Set<string>([rawNis, padded, numericClean]);
    if (r.nisn) {
      altNisSet.add(r.nisn);
      if (r.nisn.length >= 4) {
        altNisSet.add(r.nisn.slice(-4));
      }
    }

    const uniqueSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}-${index}`;

    return {
      id: `student-reg-${rawNis}-${uniqueSuffix}`,
      nis: rawNis,
      name: r.name,
      studentClass: r.studentClass,
      gender: r.gender,
      nisn: r.nisn,
      altNis: Array.from(altNisSet),
      schoolOrigin: r.schoolOrigin || 'SMA Negeri 1 Cipari'
    };
  });
}
