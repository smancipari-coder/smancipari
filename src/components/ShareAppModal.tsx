import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Smartphone, 
  ShieldCheck, 
  MessageSquareText, 
  Cloud, 
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Info
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'SHARE' | 'GUIDE' | 'PWA'>('SHARE');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedAnnouncement, setCopiedAnnouncement] = useState<boolean>(false);

  if (!isOpen) return null;

  // Compute live accessible URL (or fallback to shared run app)
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://ais-pre-bvfsoy4ely42uiqcdgr4lx-899815772093.asia-east1.run.app';

  const announcementMessage = `📢 *PEMBERITAHUAN PELAKSANAAN UJIAN ONLINE (CBT)*

Yth. Seluruh Siswa/i Peserta Ujian,
Berikut adalah tautan resmi untuk masuk ke ruang ujian online:

🔗 *Tautan Ujian Online:*
${currentUrl}

📋 *Petunjuk Masuk Ujian:*
1. Buka tautan di atas melalui browser HP (Google Chrome / Safari) atau Komputer/Laptop.
2. Masukkan NISN Anda (8-12 digit).
3. Masukkan Nama Lengkap sesuai daftar hadir (huruf kapital).
4. Pilih Rombongan Belajar (Kelas) dan Mata Pelajaran Ujian yang dijadwalkan.
5. Masukkan Token Ujian yang diberikan oleh Pengawas Ruangan.
6. Patuhi tata tertib: dilarang berpindah aplikasi atau membuka tab baru selama ujian berlangsung.

Selamat mengerjakan dan junjung tinggi integritas serta kejujuran!`;

  const handleCopyLink = async () => {
    await copyToClipboard(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyAnnouncement = async () => {
    await copyToClipboard(announcementMessage);
    setCopiedAnnouncement(true);
    setTimeout(() => setCopiedAnnouncement(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">
                  Publikasi & Bagikan Ujian Online
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  100% Gratis Online
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Panduan lengkap dan tautan langsung agar aplikasi CBT ini dapat dibuka bebas oleh seluruh siswa.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('SHARE')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'SHARE'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Tautan & Pesan WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GUIDE')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'GUIDE'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Cara Publikasi Gratis (Solusi Deploy)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PWA')}
            className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'PWA'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pasang di HP Siswa (PWA)</span>
          </button>
        </div>

        {/* Tab 1: Share Link & WhatsApp */}
        {activeTab === 'SHARE' && (
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
            {/* Realtime Cloud Sync Status Banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <div className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                    <span>Database Cloud Firestore Aktif Realtime</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-200 text-emerald-800 rounded">LIVE</span>
                  </div>
                  <div className="text-[11px] text-emerald-800/80">
                    Setiap soal baru, token ujian, atau jawaban siswa tersinkronisasi otomatis antar-perangkat di internet.
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Exam Link Card */}
            <div className="p-4 bg-indigo-50/70 border-2 border-indigo-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <span>Tautan Langsung Ujian Siswa (Online Link)</span>
                </label>
                <span className="text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-md">
                  Aktif & Siap Dibagikan
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-indigo-300 rounded-xl font-mono text-xs text-indigo-950 font-bold focus:outline-none select-all"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Tautan Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Tautan</span>
                      </>
                    )}
                  </button>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl transition flex items-center justify-center gap-1 font-bold"
                    title="Buka di tab baru"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">Buka</span>
                  </a>
                </div>
              </div>
              <p className="text-[11px] text-indigo-900/85 leading-relaxed">
                💡 Tautan ini dapat langsung dibuka di browser HP siswa (Google Chrome, Safari) tanpa perlu login akun Google atau memasang aplikasi lain.
              </p>
            </div>

            {/* Ready Announcement Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <MessageSquareText className="w-4 h-4 text-emerald-600" />
                  <span>Format Pesan Pengumuman (WhatsApp / Telegram / Kelas)</span>
                </label>
                <button
                  type="button"
                  onClick={handleCopyAnnouncement}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1 text-[11px] cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedAnnouncement ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Pesan Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Pesan WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 font-sans text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-44 overflow-y-auto select-all">
                {announcementMessage}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Free Deployment & Publish Guide */}
        {activeTab === 'GUIDE' && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
            {/* Why Deploy asks for billing */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-extrabold text-amber-900 text-xs">
                  Mengapa Tombol "Deploy" di Atas Meminta Akun Google Cloud Billing?
                </div>
                <p className="text-amber-800/90 leading-relaxed text-[11px]">
                  Tombol <strong>"Deploy"</strong> di pojok kanan atas Google AI Studio ditujukan untuk infrastruktur berbayar <em>Google Cloud Run Enterprise</em> yang mewajibkan kartu kredit. 
                  <strong> Anda TIDAK PERLU membayar atau memasukkan kartu kredit.</strong> Gunakan alternatif 100% gratis berikut:
                </p>
              </div>
            </div>

            {/* Free Method 1: AI Studio "Share" (Zero Effort) */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                    1
                  </span>
                  <span className="font-black text-slate-900 text-xs">
                    Gunakan Tombol "Share" di AI Studio (Gratis & Langsung Aktif)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">
                  Paling Mudah
                </span>
              </div>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>Klik tombol <strong>"Share"</strong> (di samping tombol Deploy, pojok kanan atas).</li>
                <li>Pilih opsi visibilitas <strong>"Anyone with the link"</strong> atau <strong>"Public"</strong>.</li>
                <li>Salin link yang muncul. Link tersebut sudah online 24 jam dan bisa diakses gratis oleh siswa tanpa login Google!</li>
              </ol>
            </div>

            {/* Free Method 2: Vercel / Netlify Free Hosting (Zero Config) */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-xs">
                    2
                  </span>
                  <span className="font-black text-slate-900 text-xs">
                    Hosting Gratis Selamanya di Vercel atau Netlify
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                  Domain Sendiri
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Proyek ini sudah dilengkapi file konfigurasi resmi <code>vercel.json</code>, <code>netlify.toml</code>, dan <code>_redirects</code>.
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>Buka menu <strong>Settings</strong> di AI Studio &gt; pilih <strong>"Download ZIP"</strong> atau <strong>"Export to GitHub"</strong>.</li>
                <li>Buka situs gratis <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline">Vercel.com</a> atau <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold underline">Netlify.com/drop</a>.</li>
                <li>Hubungkan repositori atau tarik folder <strong>dist</strong> ke Netlify Drop. Aplikasi Anda langsung tayang dengan domain gratis selamanya (misal: <code>cbt-sekolah.vercel.app</code>).</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 3: PWA & Student Mobile Experience */}
        {activeTab === 'PWA' && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
              <div className="font-extrabold text-purple-950 text-xs flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-purple-700" />
                <span>Aplikasi Siap Dipasang Sebagai Web App (PWA) di HP Siswa</span>
              </div>
              <p className="text-purple-900/80 text-[11px] leading-relaxed">
                Aplikasi ini sudah dilengkapi <strong>Web App Manifest</strong>. Siswa tidak perlu mengunduh APK atau mencari di Google Play Store.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>Di HP Android (Chrome):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Buka link ujian di Chrome.</li>
                  <li>Tekan menu titik tiga (⋮) di pojok kanan atas browser.</li>
                  <li>Pilih <strong>"Tambahkan ke Layar Utama"</strong> (<em>Add to Home Screen</em>) atau <strong>"Instal Aplikasi"</strong>.</li>
                  <li>Ikon CBT akan otomatis muncul di layar HP siswa seperti aplikasi biasa.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Di iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li>Buka link ujian di browser Safari.</li>
                  <li>Tekan tombol <strong>Share</strong> (ikon kotak dengan panah ke atas) di bagian bawah.</li>
                  <li>Pilih <strong>"Add to Home Screen"</strong> (Tambahkan ke Layar Utama).</li>
                  <li>Siswa dapat membukanya langsung dengan tampilan layar penuh.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Siap Ujian Mandiri & Anti-Curang</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
