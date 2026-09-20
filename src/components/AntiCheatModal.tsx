import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { ViolationEvent } from '../types';

interface AntiCheatModalProps {
  isOpen: boolean;
  violation: ViolationEvent | null;
  violationCount: number;
  maxViolations: number;
  onAcknowledge: () => void;
  isDisqualified: boolean;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({
  isOpen,
  violation,
  violationCount,
  maxViolations,
  onAcknowledge,
  isDisqualified
}) => {
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (isOpen) {
      setCountdown(isDisqualified ? 0 : 3);
      if (!isDisqualified) {
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [isOpen, isDisqualified]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="anti-cheat-alert-dialog"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden transform transition-all"
      >
        {/* Header Ribbon */}
        <div className={`p-6 text-center ${isDisqualified ? 'bg-rose-700 text-white' : 'bg-rose-600 text-white'}`}>
          <div className="mx-auto w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mb-3 ring-8 ring-white/10 animate-pulse">
            {isDisqualified ? (
              <Lock className="w-8 h-8 text-white" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-xl font-black tracking-tight">
            {isDisqualified ? 'UJIAN DIKUNCI / DISKUALIFIKASI' : 'PERINGATAN ANTI-CURANG TERDETEKSI!'}
          </h2>
          <p className="text-xs text-rose-100 mt-1 font-medium">
            {isDisqualified 
              ? 'Batas maksimal pelanggaran telah terlampaui. Ujian Anda otomatis dihentikan.'
              : 'Sistem mendeteksi aktivitas mencurigakan yang melanggar integritas ujian online.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Violation Details Box */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-rose-900">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Jenis Pelanggaran:
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 uppercase tracking-wider text-[11px]">
                {violation?.type || 'ACTIVITY_SUSPICIOUS'}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {violation?.description || 'Terdeteksi upaya berpindah tab, meminimalkan browser, atau keluar dari mode layar penuh.'}
            </p>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-rose-200/60 flex justify-between">
              <span>Waktu Deteksi: {violation?.timestamp ? new Date(violation.timestamp).toLocaleTimeString('id-ID') : 'Baru saja'}</span>
              <span className="font-semibold text-rose-700">Dilaporkan ke Pengawas</span>
            </div>
          </div>

          {/* Violation Meter */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-slate-700">Akumulasi Pelanggaran:</span>
              <span className="font-bold text-sm text-rose-600">
                {violationCount} / {maxViolations} Toleransi
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  violationCount >= maxViolations 
                    ? 'bg-rose-600' 
                    : violationCount > 1 
                    ? 'bg-amber-500' 
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (violationCount / maxViolations) * 100)}%` }}
              />
            </div>
            
            <p className="text-[11px] text-slate-500 mt-2">
              {isDisqualified 
                ? 'Seluruh lembar jawaban Anda telah tersimpan secara otomatis dan ditandai oleh sistem pengawas.'
                : `Peringatan: Jika Anda mencapai ${maxViolations} pelanggaran, sistem akan otomatis mengakhiri dan mengunci ujian Anda.`}
            </p>
          </div>

          {/* Warning Points */}
          {!isDisqualified && (
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside bg-amber-50/70 p-3 rounded-lg border border-amber-200/70">
              <li>Pertahankan browser dalam mode <strong>Layar Penuh (Fullscreen)</strong>.</li>
              <li>Jangan menekan tombol <strong>Alt+Tab, Windows Key, atau F12</strong>.</li>
              <li>Jangan membuka tab pencarian lain atau aplikasi catatan.</li>
            </ul>
          )}

          {/* Action Buttons */}
          <div className="pt-2">
            {isDisqualified ? (
              <button
                id="btn-anti-cheat-disqualified-submit"
                onClick={onAcknowledge}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat Hasil & Keterangan Pengawas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-anti-cheat-acknowledge"
                disabled={countdown > 0}
                onClick={onAcknowledge}
                className={`w-full py-3 px-4 text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  countdown > 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                }`}
              >
                {countdown > 0 ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Tunggu {countdown} detik sebelum kembali...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Saya Mengerti & Kembali ke Mode Ujian</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
