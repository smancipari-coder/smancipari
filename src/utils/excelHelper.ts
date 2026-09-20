import * as XLSX from 'xlsx';
import { Question, ExamSubmission } from '../types';

export interface ExcelQuestionRow {
  no?: number | string;
  pertanyaan: string;
  gambar_url?: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e?: string;
  kunci: string;
  poin?: number | string;
  pembahasan?: string;
}

export function generateExcelTemplate(): void {
  const sampleData: ExcelQuestionRow[] = [
    {
      no: 1,
      pertanyaan: 'Ibukota negara Indonesia yang baru sesuai UU IKN adalah...',
      gambar_url: '',
      opsi_a: 'Jakarta',
      opsi_b: 'Surabaya',
      opsi_c: 'Nusantara',
      opsi_d: 'Balikpapan',
      opsi_e: 'Samarinda',
      kunci: 'C',
      poin: 5,
      pembahasan: 'Ibu Kota Nusantara (IKN) terletak di Kalimantan Timur.'
    },
    {
      no: 2,
      pertanyaan: 'Proses perubahan wujud zat dari padat langsung menjadi gas tanpa melalui fase cair disebut...',
      gambar_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      opsi_a: 'Mencair',
      opsi_b: 'Menyublim',
      opsi_c: 'Mengembun',
      opsi_d: 'Membeku',
      opsi_e: 'Menguap',
      kunci: 'B',
      poin: 5,
      pembahasan: 'Sublimasi adalah perubahan wujud dari padat langsung ke gas.'
    },
    {
      no: 3,
      pertanyaan: 'Berapakah hasil dari operasi hitung 15 + (4 x 6) - 10?',
      gambar_url: '',
      opsi_a: '25',
      opsi_b: '29',
      opsi_c: '34',
      opsi_d: '39',
      opsi_e: '45',
      kunci: 'B',
      poin: 5,
      pembahasan: 'Perkalian dihitung terlebih dahulu: 4 x 6 = 24. Lalu 15 + 24 - 10 = 29.'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 6 },  // no
    { wch: 50 }, // pertanyaan
    { wch: 35 }, // gambar_url
    { wch: 25 }, // opsi_a
    { wch: 25 }, // opsi_b
    { wch: 25 }, // opsi_c
    { wch: 25 }, // opsi_d
    { wch: 25 }, // opsi_e
    { wch: 10 }, // kunci
    { wch: 8 },  // poin
    { wch: 40 }, // pembahasan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Format_Soal_CBT');
  XLSX.writeFile(workbook, 'Template_Upload_Soal_CBT.xlsx');
}

export async function parseExcelQuestions(file: File, examId: string, currentTotal: number = 0): Promise<Question[]> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert sheet to JSON array
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
  if (!rawRows || rawRows.length === 0) {
    throw new Error('File Excel kosong atau format tabel tidak ditemukan.');
  }

  const parsedQuestions: Question[] = [];

  rawRows.forEach((row, idx) => {
    // Check fields flexibly
    const pertanyaan = String(row['pertanyaan'] || row['Pertanyaan'] || row['soal'] || row['Soal'] || '').trim();
    if (!pertanyaan) return; // skip empty rows

    const gambarUrl = String(row['gambar_url'] || row['gambar'] || row['Gambar'] || '').trim();
    const optA = String(row['opsi_a'] || row['Opsi A'] || row['pilihan_a'] || row['A'] || '').trim();
    const optB = String(row['opsi_b'] || row['Opsi B'] || row['pilihan_b'] || row['B'] || '').trim();
    const optC = String(row['opsi_c'] || row['Opsi C'] || row['pilihan_c'] || row['C'] || '').trim();
    const optD = String(row['opsi_d'] || row['Opsi D'] || row['pilihan_d'] || row['D'] || '').trim();
    const optE = String(row['opsi_e'] || row['Opsi E'] || row['pilihan_e'] || row['E'] || '').trim();

    const rawKunci = String(row['kunci'] || row['Kunci'] || row['jawaban'] || row['Jawaban'] || 'A').toUpperCase().trim();
    const validKey = (['A', 'B', 'C', 'D', 'E'].includes(rawKunci) ? rawKunci : 'A') as 'A' | 'B' | 'C' | 'D' | 'E';

    const rawPoin = parseFloat(row['poin'] || row['Poin'] || row['bobot'] || '4');
    const points = isNaN(rawPoin) || rawPoin <= 0 ? 4 : rawPoin;
    const pembahasan = String(row['pembahasan'] || row['Pembahasan'] || row['penjelasan'] || '').trim();

    const options: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[] = [
      { key: 'A', text: optA || 'Opsi A' },
      { key: 'B', text: optB || 'Opsi B' },
      { key: 'C', text: optC || 'Opsi C' },
      { key: 'D', text: optD || 'Opsi D' },
    ];
    if (optE) {
      options.push({ key: 'E', text: optE });
    }

    parsedQuestions.push({
      id: `q-excel-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      examId,
      number: currentTotal + idx + 1,
      text: pertanyaan,
      image: gambarUrl || undefined,
      options,
      correctAnswer: validKey,
      points,
      explanation: pembahasan || undefined
    });
  });

  if (parsedQuestions.length === 0) {
    throw new Error('Tidak ada baris soal valid yang dapat diproses. Pastikan kolom "pertanyaan", "opsi_a", "opsi_b", "opsi_c", "opsi_d", dan "kunci" tersedia.');
  }

  return parsedQuestions;
}

export function exportSubmissionsToExcel(submissions: ExamSubmission[], examTitle: string): void {
  const exportRows = submissions.map((sub, index) => {
    return {
      'No': index + 1,
      'NISN': sub.studentNisn,
      'Nama Siswa': sub.studentName,
      'Kelas': sub.studentClass,
      'Mata Pelajaran': sub.subject,
      'Nilai Akhir (0-100)': Number(sub.score.toFixed(1)),
      'Poin Diperoleh': sub.totalPointsEarned,
      'Maksimal Poin': sub.maxTotalPoints,
      'Jawaban Benar': sub.totalCorrect,
      'Jawaban Salah': sub.totalIncorrect,
      'Tidak Dijawab': sub.totalUnanswered,
      'Status': sub.isPassed ? 'LULUS (Memenuhi KKM)' : 'REMEDIAL',
      'Pelanggaran Anti-Curang': `${sub.violationCount} Kali`,
      'Catatan Status': sub.status,
      'Waktu Selesai': new Date(sub.submittedAt).toLocaleString('id-ID'),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  worksheet['!cols'] = [
    { wch: 5 },  // No
    { wch: 15 }, // NISN
    { wch: 28 }, // Nama Siswa
    { wch: 10 }, // Kelas
    { wch: 22 }, // Mata Pelajaran
    { wch: 18 }, // Nilai Akhir
    { wch: 14 }, // Poin
    { wch: 14 }, // Maks Poin
    { wch: 14 }, // Benar
    { wch: 14 }, // Salah
    { wch: 14 }, // Kosong
    { wch: 22 }, // Status
    { wch: 22 }, // Pelanggaran
    { wch: 24 }, // Catatan
    { wch: 22 }, // Waktu
  ];

  const workbook = XLSX.utils.book_new();
  const safeSheetTitle = (examTitle.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25)) || 'Rekap_Nilai';
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetTitle);

  const filename = `Rekap_Nilai_CBT_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
