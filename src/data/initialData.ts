import { AdminUser, ExamSession, Question, ActivityLog, ExamSubmission } from '../types';

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Budi Santoso, M.Pd (Koordinator CBT)',
    role: 'SUPER_ADMIN',
    createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
  },
  {
    id: 'admin-2',
    username: 'pengawas1',
    password: 'pengawas123',
    name: 'Siti Rahmawati, S.Kom (Pengawas Ujian)',
    role: 'PENGAWAS',
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
  },
  {
    id: 'admin-3',
    username: 'guru_matematika',
    password: 'guru123',
    name: 'Dra. Hj. Nurul Hidayah (Guru Matematika)',
    role: 'GURU_MAPEL',
    subject: 'Matematika Wajib',
    createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  }
];

export const INITIAL_EXAMS: ExamSession[] = [
  {
    id: 'exam-mat-1',
    title: 'Penilaian Tengah Semester (PTS) Matematika Wajib',
    subject: 'Matematika Wajib',
    gradeLevels: ['10', '11', '12'],
    targetClasses: 'ALL',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '07:30',
    endTime: '16:30',
    durationMinutes: 45,
    token: 'MAT2026',
    totalQuestions: 6,
    totalPoints: 24,
    kkm: 75,
    maxViolations: 3,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    createdBy: 'Budi Santoso, M.Pd',
    creatorUsername: 'admin',
    creatorRole: 'SUPER_ADMIN',
  },
  {
    id: 'exam-bio-1',
    title: 'Asesmen Sumatif Biologi & Ekosistem Alam',
    subject: 'Biologi',
    gradeLevels: ['11', '12'],
    targetClasses: ['11F1', '11F2', '11F3', '11F4', '11F5', '11F6', '11F7', '12F1', '12F2', '12F3', '12F4', '12F5', '12F6', '12F7'],
    startDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '17:00',
    durationMinutes: 40,
    token: 'BIO2026',
    totalQuestions: 5,
    totalPoints: 20,
    kkm: 75,
    maxViolations: 3,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    createdBy: 'Dra. Hj. Nurul Hidayah',
    creatorUsername: 'guru_matematika',
    creatorRole: 'GURU_MAPEL',
  },
  {
    id: 'exam-eng-1',
    title: 'English Literacy & Reading Comprehension Test',
    subject: 'Bahasa Inggris',
    gradeLevels: ['10'],
    targetClasses: ['10E1', '10E2', '10E3', '10E4', '10E5', '10E6', '10E7'],
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '15:00',
    durationMinutes: 30,
    token: 'ENG2026',
    totalQuestions: 4,
    totalPoints: 16,
    kkm: 70,
    maxViolations: 2,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    createdBy: 'Budi Santoso, M.Pd',
    creatorUsername: 'admin',
    creatorRole: 'SUPER_ADMIN',
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Soal Matematika
  {
    id: 'q-mat-1',
    examId: 'exam-mat-1',
    number: 1,
    text: 'Diketahui fungsi kuadrat f(x) = x² - 6x + 8. Koordinat titik balik minimum dari grafik fungsi tersebut adalah...',
    points: 4,
    correctAnswer: 'B',
    explanation: 'Titik puncak x = -b/(2a) = 6/2 = 3. Nilai y = 3² - 6(3) + 8 = 9 - 18 + 8 = -1. Jadi titik balik adalah (3, -1).',
    options: [
      { key: 'A', text: '(3, 1)' },
      { key: 'B', text: '(3, -1)' },
      { key: 'C', text: '(-3, 1)' },
      { key: 'D', text: '(-3, -1)' },
      { key: 'E', text: '(4, 2)' },
    ]
  },
  {
    id: 'q-mat-2',
    examId: 'exam-mat-1',
    number: 2,
    text: 'Perhatikan diagram kartesius dan segitiga siku-siku berikut. Jika panjang alas adalah 12 cm dan tinggi adalah 5 cm, berapakah panjang sisi miring (hipotenusa)?',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    points: 4,
    correctAnswer: 'C',
    explanation: 'Menggunakan teorema Pythagoras: c = √(12² + 5²) = √(144 + 25) = √169 = 13 cm.',
    options: [
      { key: 'A', text: '11 cm' },
      { key: 'B', text: '12,5 cm' },
      { key: 'C', text: '13 cm' },
      { key: 'D', text: '15 cm' },
      { key: 'E', text: '17 cm' },
    ]
  },
  {
    id: 'q-mat-3',
    examId: 'exam-mat-1',
    number: 3,
    text: 'Nilai dari logaritma ²log 16 + ³log 27 - ⁵log 125 adalah...',
    points: 4,
    correctAnswer: 'B',
    explanation: '²log 16 = 4, ³log 27 = 3, ⁵log 125 = 3. Maka: 4 + 3 - 3 = 4.',
    options: [
      { key: 'A', text: '2' },
      { key: 'B', text: '4' },
      { key: 'C', text: '5' },
      { key: 'D', text: '6' },
      { key: 'E', text: '8' },
    ]
  },
  {
    id: 'q-mat-4',
    examId: 'exam-mat-1',
    number: 4,
    text: 'Suatu barisan aritmatika memiliki suku pertama a = 5 dan beda b = 3. Tentukan nilai suku ke-20 (U₂₀)!',
    points: 4,
    correctAnswer: 'D',
    explanation: 'U₂₀ = a + (20 - 1)b = 5 + 19(3) = 5 + 57 = 62.',
    options: [
      { key: 'A', text: '58' },
      { key: 'B', text: '60' },
      { key: 'C', text: '61' },
      { key: 'D', text: '62' },
      { key: 'E', text: '65' },
    ]
  },
  {
    id: 'q-mat-5',
    examId: 'exam-mat-1',
    number: 5,
    text: 'Perhatikan grafik penyebaran data berikut ini. Manakah kesimpulan yang paling tepat mengenai korelasi antar variabel yang ditampilkan?',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    points: 4,
    correctAnswer: 'A',
    explanation: 'Grafik menunjukkan tren naik linear yang mengindikasikan korelasi positif kuat antara variabel X dan Y.',
    options: [
      { key: 'A', text: 'Terdapat korelasi positif kuat antara variabel X dan variabel Y' },
      { key: 'B', text: 'Terdapat korelasi negatif yang signifikan' },
      { key: 'C', text: 'Tidak ada hubungan atau tren statistik yang dapat disimpulkan' },
      { key: 'D', text: 'Data berfluktuasi secara acak tanpa pola teratur' },
      { key: 'E', text: 'Nilai variabel Y selalu konstan terhadap penambahan variabel X' },
    ]
  },
  {
    id: 'q-mat-6',
    examId: 'exam-mat-1',
    number: 6,
    text: 'Jika matriks A = [[2, 3], [1, 4]], maka nilai determinan dari matriks A adalah...',
    points: 4,
    correctAnswer: 'A',
    explanation: 'Det(A) = (ad - bc) = (2 * 4) - (3 * 1) = 8 - 3 = 5.',
    options: [
      { key: 'A', text: '5' },
      { key: 'B', text: '8' },
      { key: 'C', text: '11' },
      { key: 'D', text: '-5' },
      { key: 'E', text: '1' },
    ]
  },

  // Soal Biologi
  {
    id: 'q-bio-1',
    examId: 'exam-bio-1',
    number: 1,
    text: 'Organel sel yang sering disebut sebagai "the powerhouse of cell" dan berfungsi sebagai tempat respirasi seluler serta pembentukan ATP adalah...',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    points: 4,
    correctAnswer: 'B',
    explanation: 'Mitokondria bertanggung jawab memproduksi adenosin trifosfat (ATP) melalui respirasi aerobik.',
    options: [
      { key: 'A', text: 'Ribosom' },
      { key: 'B', text: 'Mitokondria' },
      { key: 'C', text: 'Badan Golgi' },
      { key: 'D', text: 'Retikulum Endoplasma' },
      { key: 'E', text: 'Lisosom' },
    ]
  },
  {
    id: 'q-bio-2',
    examId: 'exam-bio-1',
    number: 2,
    text: 'Dalam proses fotosintesis tumbuhan hijau, reaksi terang terjadi pada bagian...',
    points: 4,
    correctAnswer: 'C',
    explanation: 'Reaksi terang fotosintesis terjadi di membran tilakoid (grana), sedangkan reaksi gelap terjadi di stroma kloroplas.',
    options: [
      { key: 'A', text: 'Stroma kloroplas' },
      { key: 'B', text: 'Membran luar kloroplas' },
      { key: 'C', text: 'Tilakoid / Grana' },
      { key: 'D', text: 'Sitoplasma daun' },
      { key: 'E', text: 'Vakuola tengah' },
    ]
  },
  {
    id: 'q-bio-3',
    examId: 'exam-bio-1',
    number: 3,
    text: 'Hubungan simbiosis antara jamur mikoriza dengan akar tanaman pinus tergolong sebagai...',
    points: 4,
    correctAnswer: 'A',
    explanation: 'Mikoriza membantu tanaman menyerap air dan mineral, sedangkan tanaman memberi nutrisi hasil fotosintesis ke jamur (mutualisme).',
    options: [
      { key: 'A', text: 'Mutualisme' },
      { key: 'B', text: 'Komensalisme' },
      { key: 'C', text: 'Parasitisme' },
      { key: 'D', text: 'Amensalisme' },
      { key: 'E', text: 'Netralisme' },
    ]
  },
  {
    id: 'q-bio-4',
    examId: 'exam-bio-1',
    number: 4,
    text: 'Perhatikan foto preparat mikroskopis sel daun berikut. Struktur stomata yang bertindak sebagai jalur pertukaran gas dikelilingi oleh sepasang sel khusus yang disebut...',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80',
    points: 4,
    correctAnswer: 'C',
    explanation: 'Stomata diapit oleh sepasang sel penjaga (guard cells) yang mengatur membuka dan menutupnya celah stomata.',
    options: [
      { key: 'A', text: 'Sel palisade' },
      { key: 'B', text: 'Sel spons' },
      { key: 'C', text: 'Sel penjaga (Guard cells)' },
      { key: 'D', text: 'Sel kambium' },
      { key: 'E', text: 'Sel xilem' },
    ]
  },
  {
    id: 'q-bio-5',
    examId: 'exam-bio-1',
    number: 5,
    text: 'Enzim yang berperan memecah amilum menjadi maltosa pada saluran pencernaan manusia adalah...',
    points: 4,
    correctAnswer: 'D',
    explanation: 'Enzim ptialin (amilase) diproduksi oleh kelenjar ludah untuk mencerna karbohidrat amilum menjadi maltosa.',
    options: [
      { key: 'A', text: 'Pepsin' },
      { key: 'B', text: 'Renin' },
      { key: 'C', text: 'Tripsin' },
      { key: 'D', text: 'Ptialin (Amilase)' },
      { key: 'E', text: 'Lipase' },
    ]
  },

  // Soal Bahasa Inggris
  {
    id: 'q-eng-1',
    examId: 'exam-eng-1',
    number: 1,
    text: 'Complete the sentence: "If she _______ harder yesterday, she would have passed the examination with flying colors."',
    points: 4,
    correctAnswer: 'C',
    explanation: 'Conditional Type 3: If + Subject + had + V3, Subject + would + have + V3.',
    options: [
      { key: 'A', text: 'studied' },
      { key: 'B', text: 'studies' },
      { key: 'C', text: 'had studied' },
      { key: 'D', text: 'would study' },
      { key: 'E', text: 'is studying' },
    ]
  },
  {
    id: 'q-eng-2',
    examId: 'exam-eng-1',
    number: 2,
    text: 'Read the announcement: "Attention all students! The library will be closed this Friday for annual book inventory." What is the purpose of this text?',
    points: 4,
    correctAnswer: 'A',
    explanation: 'The text aims to notify students about the library closure due to inventory.',
    options: [
      { key: 'A', text: 'To inform students about the temporary closure of the library' },
      { key: 'B', text: 'To invite students to borrow books this Friday' },
      { key: 'C', text: 'To recruit student volunteers for book inventory' },
      { key: 'D', text: 'To advertise new book arrivals in the school library' },
      { key: 'E', text: 'To remind students to return overdue books' },
    ]
  },
  {
    id: 'q-eng-3',
    examId: 'exam-eng-1',
    number: 3,
    text: 'Choose the correct synonym of the underlined word: "The scientist delivered a very **meticulous** explanation regarding the solar eclipse."',
    points: 4,
    correctAnswer: 'D',
    explanation: '"Meticulous" means showing great attention to detail; very careful and precise (thorough/careful).',
    options: [
      { key: 'A', text: 'Hasty' },
      { key: 'B', text: 'Vague' },
      { key: 'C', text: 'Complicated' },
      { key: 'D', text: 'Thorough and precise' },
      { key: 'E', text: 'Boring' },
    ]
  },
  {
    id: 'q-eng-4',
    examId: 'exam-eng-1',
    number: 4,
    text: 'Identify the passive voice form of: "The committee evaluates student project proposals every month."',
    points: 4,
    correctAnswer: 'B',
    explanation: 'Passive present simple: Object + are/is + V3 + by subject -> "Student project proposals are evaluated by the committee every month."',
    options: [
      { key: 'A', text: 'Student project proposals were evaluated by the committee every month.' },
      { key: 'B', text: 'Student project proposals are evaluated by the committee every month.' },
      { key: 'C', text: 'Student project proposals have been evaluated by the committee.' },
      { key: 'D', text: 'The committee has evaluated the student project proposals.' },
      { key: 'E', text: 'Student project proposals will be evaluated by the committee.' },
    ]
  }
];

export const INITIAL_SUBMISSIONS: ExamSubmission[] = [
  {
    id: 'sub-sample-1',
    examId: 'exam-mat-1',
    examTitle: 'Penilaian Tengah Semester (PTS) Matematika Wajib',
    subject: 'Matematika Wajib',
    studentNisn: '0061234567',
    studentName: 'Ahmad Fadhil Pratama',
    studentClass: '10E1',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    submittedAt: new Date(Date.now() - 1200000).toISOString(),
    durationSpentSeconds: 2400,
    answers: {
      'q-mat-1': { questionId: 'q-mat-1', selectedOption: 'B', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-2': { questionId: 'q-mat-2', selectedOption: 'C', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-3': { questionId: 'q-mat-3', selectedOption: 'B', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-4': { questionId: 'q-mat-4', selectedOption: 'D', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-5': { questionId: 'q-mat-5', selectedOption: 'A', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-6': { questionId: 'q-mat-6', selectedOption: 'A', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
    },
    totalCorrect: 6,
    totalIncorrect: 0,
    totalUnanswered: 0,
    score: 100,
    totalPointsEarned: 24,
    maxTotalPoints: 24,
    isPassed: true,
    violationCount: 0,
    violations: [],
    status: 'SUBMITTED',
  },
  {
    id: 'sub-sample-2',
    examId: 'exam-mat-1',
    examTitle: 'Penilaian Tengah Semester (PTS) Matematika Wajib',
    subject: 'Matematika Wajib',
    studentNisn: '0067654321',
    studentName: 'Clara Anindya Putri',
    studentClass: '10E2',
    startedAt: new Date(Date.now() - 2500000).toISOString(),
    submittedAt: new Date(Date.now() - 500000).toISOString(),
    durationSpentSeconds: 2000,
    answers: {
      'q-mat-1': { questionId: 'q-mat-1', selectedOption: 'B', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-2': { questionId: 'q-mat-2', selectedOption: 'A', isDoubtful: false, isCorrect: false, pointsEarned: 0 },
      'q-mat-3': { questionId: 'q-mat-3', selectedOption: 'B', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-4': { questionId: 'q-mat-4', selectedOption: 'D', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-5': { questionId: 'q-mat-5', selectedOption: 'A', isDoubtful: false, isCorrect: true, pointsEarned: 4 },
      'q-mat-6': { questionId: 'q-mat-6', selectedOption: 'B', isDoubtful: false, isCorrect: false, pointsEarned: 0 },
    },
    totalCorrect: 4,
    totalIncorrect: 2,
    totalUnanswered: 0,
    score: 66.7,
    totalPointsEarned: 16,
    maxTotalPoints: 24,
    isPassed: false,
    violationCount: 1,
    violations: [
      {
        id: 'viol-sample-1',
        studentNisn: '0067654321',
        studentName: 'Clara Anindya Putri',
        studentClass: '10E2',
        examId: 'exam-mat-1',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        type: 'TAB_SWITCH',
        description: 'Siswa berpindah tab / jendela peramban selama ujian berlangsung'
      }
    ],
    status: 'SUBMITTED',
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    actor: 'Budi Santoso, M.Pd (@admin)',
    role: 'SUPER_ADMIN',
    action: 'CREATE_EXAM',
    target: 'PTS Matematika Wajib',
    details: 'Menambahkan jadwal ujian baru (Token: MAT2026, Durasi: 45 Menit).',
    level: 'info'
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    actor: 'Dra. Hj. Nurul Hidayah (@guru_matematika)',
    role: 'GURU_MAPEL',
    action: 'CREATE_QUESTION',
    target: 'Soal #1 (PTS Matematika Wajib)',
    details: 'Menambahkan butir soal fungsi kuadrat dengan kunci B dan bobot 4 poin.',
    level: 'info'
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    actor: 'Dra. Hj. Nurul Hidayah (@guru_matematika)',
    role: 'GURU_MAPEL',
    action: 'IMPORT_QUESTIONS',
    target: 'Asesmen Sumatif Biologi & Ekosistem Alam',
    details: 'Mengimpor 5 butir butir soal dari file Excel bank soal mata pelajaran.',
    level: 'info'
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1.2 * 3600000).toISOString(),
    actor: 'Siti Rahmawati, S.Kom (@pengawas1)',
    role: 'PENGAWAS',
    action: 'MONITOR_EXAM',
    target: 'PTS Matematika Wajib',
    details: 'Membuka ruang pengawasan aktif dan memantau jalannya ujian serta kehadiran siswa.',
    level: 'info'
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    actor: 'Detektor Anti-Curang',
    role: 'SYSTEM',
    action: 'CHEATING_ALERT',
    target: 'Clara Anindya Putri (NISN: 0067654321)',
    details: 'Peringatan pelanggaran: Terdeteksi perpindahan tab (TAB_SWITCH) pada sesi PTS Matematika.',
    level: 'danger'
  },
  {
    id: 'log-6',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    actor: 'Ahmad Fadhil Pratama',
    role: 'STUDENT',
    action: 'STUDENT_SUBMIT',
    target: 'PTS Matematika Wajib',
    details: 'Menyelesaikan ujian dengan nilai 100/100 tanpa catatan pelanggaran kecurangan.',
    level: 'info'
  }
];
