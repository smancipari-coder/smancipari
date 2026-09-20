import { ExamSession } from '../types';

export type ExamScheduleStatus = 'RUNNING' | 'UPCOMING' | 'EXPIRED' | 'INACTIVE';

export interface ExamScheduleDetails {
  status: ExamScheduleStatus;
  isRunning: boolean;
  isUpcoming: boolean;
  isExpired: boolean;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  message: string;
  startDateTime: Date;
  endDateTime: Date;
  formattedDate: string;
  formattedTimeRange: string;
  remainingMinutes?: number;
}

const INDONESIAN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

const INDONESIAN_DAYS = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

/**
 * Parse date and time into local Date object safely
 */
export function parseScheduleDateTime(dateStr: string, timeStr: string): Date {
  const cleanDate = (dateStr || '').trim().split('T')[0];
  const parts = cleanDate.split('-').map(Number);
  const year = parts[0] || new Date().getFullYear();
  const month = (parts[1] || 1) - 1;
  const day = parts[2] || 1;

  const [hours, minutes] = (timeStr || '00:00').split(':').map(Number);
  return new Date(year, month, day, hours || 0, minutes || 0, 0);
}

/**
 * Format date nicely in Indonesian (e.g. "Sabtu, 19 Sep 2026")
 */
export function formatIndonesianDate(date: Date): string {
  const dayName = INDONESIAN_DAYS[date.getDay()] || '';
  const dayNum = date.getDate();
  const monthName = INDONESIAN_MONTHS[date.getMonth()] || '';
  const year = date.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Get comprehensive schedule details and determine if the exam is currently running
 */
export function getExamScheduleDetails(exam: ExamSession, referenceTime: Date = new Date()): ExamScheduleDetails {
  const startDateTime = parseScheduleDateTime(exam.startDate, exam.startTime);
  let endDateTime = parseScheduleDateTime(exam.startDate, exam.endTime);

  // If endTime is earlier than startTime (e.g. overnight exam 23:00 to 01:00), end date is next day
  if (endDateTime.getTime() <= startDateTime.getTime()) {
    endDateTime = new Date(endDateTime.getTime() + 24 * 60 * 60 * 1000);
  }

  const nowMs = referenceTime.getTime();
  const startMs = startDateTime.getTime();
  const endMs = endDateTime.getTime();

  const formattedDate = formatIndonesianDate(startDateTime);
  const formattedTimeRange = `${exam.startTime} - ${exam.endTime} WIB`;

  // 1. If admin manually marked exam as DRAFT or FINISHED
  if (exam.status === 'DRAFT') {
    return {
      status: 'INACTIVE',
      isRunning: false,
      isUpcoming: false,
      isExpired: false,
      label: 'Non-Aktif (Draft)',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      badgeBorder: 'border-slate-300',
      message: 'Sesi ujian ini masih berstatus Draft dan belum diaktifkan oleh pengawas.',
      startDateTime,
      endDateTime,
      formattedDate,
      formattedTimeRange,
    };
  }

  if (exam.status === 'FINISHED') {
    return {
      status: 'EXPIRED',
      isRunning: false,
      isUpcoming: false,
      isExpired: true,
      label: 'Telah Selesai (Arsip)',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-600',
      badgeBorder: 'border-slate-200',
      message: 'Sesi ujian ini telah ditutup/selesai oleh administrator.',
      startDateTime,
      endDateTime,
      formattedDate,
      formattedTimeRange,
    };
  }

  // 2. Schedule comparison against current real-time
  if (nowMs < startMs) {
    const minutesToStart = Math.ceil((startMs - nowMs) / (60 * 1000));
    return {
      status: 'UPCOMING',
      isRunning: false,
      isUpcoming: true,
      isExpired: false,
      label: 'Belum Dimulai',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300',
      message: `Jadwal ujian belum dimulai. Pelaksanaan: ${formattedDate} pukul ${formattedTimeRange}.`,
      startDateTime,
      endDateTime,
      formattedDate,
      formattedTimeRange,
      remainingMinutes: minutesToStart,
    };
  }

  if (nowMs > endMs) {
    return {
      status: 'EXPIRED',
      isRunning: false,
      isUpcoming: false,
      isExpired: true,
      label: 'Telah Berakhir',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      badgeBorder: 'border-rose-300',
      message: `Jadwal pelaksanaan ujian telah berakhir pada ${formattedDate} pukul ${exam.endTime} WIB.`,
      startDateTime,
      endDateTime,
      formattedDate,
      formattedTimeRange,
    };
  }

  // 3. Exam is currently within schedule!
  const remainingMinutes = Math.max(0, Math.floor((endMs - nowMs) / (60 * 1000)));
  return {
    status: 'RUNNING',
    isRunning: true,
    isUpcoming: false,
    isExpired: false,
    label: 'Sedang Berjalan',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    message: `Sesi ujian sedang berlangsung hingga pukul ${exam.endTime} WIB (${remainingMinutes} menit tersisa).`,
    startDateTime,
    endDateTime,
    formattedDate,
    formattedTimeRange,
    remainingMinutes,
  };
}

/**
 * Check if an exam is specifically running right now
 */
export function isExamRunning(exam: ExamSession, referenceTime: Date = new Date()): boolean {
  return getExamScheduleDetails(exam, referenceTime).isRunning;
}

/**
 * Check if an exam is targeted for a specific student class
 */
export function isExamTargetingClass(exam: ExamSession, studentClass?: string): boolean {
  if (!studentClass) return true;
  if (!exam.targetClasses || exam.targetClasses === 'ALL') return true;
  if (Array.isArray(exam.targetClasses)) {
    return exam.targetClasses.includes(studentClass as any);
  }
  return true;
}
