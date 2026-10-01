import React from 'react';
import {
  MessageSquare,
  FileText,
  Users,
  Clock,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  HeartHandshake
} from 'lucide-react';
import { Student, SavedMessage, TeacherProfile } from '../types';

interface DashboardViewProps {
  students: Student[];
  history: SavedMessage[];
  teacherProfile: TeacherProfile;
  onNavigateTab: (tab: string) => void;
  openQuick10Sec: () => void;
  openProfileModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  history,
  teacherProfile,
  onNavigateTab,
  openQuick10Sec,
  openProfileModal
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const messagesToday = history.filter((h) => h.tanggal === todayStr).length;
  const totalReports = history.length;
  const uniqueStudentsReported = new Set(history.map((h) => h.siswaNama)).size;
  const draftCount = Math.max(0, history.filter((h) => h.gayaBahasa === 'laporan-resmi').length);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <HeartHandshake className="w-4 h-4" />
            <span>Kemitraan Guru &amp; Orang Tua Siswa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Selamat Bertugas, {teacherProfile.namaGuru}{teacherProfile.gelar ? ', ' + teacherProfile.gelar : ''}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Susun pesan evaluasi, kabar perkembangan, dan catatan rapor siswa di {teacherProfile.namaSekolah} secara santun, objektif, dan tanpa label negatif. Menghemat waktu Anda hingga 80%.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('generator')}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-teal-300 hover:bg-teal-200 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-teal-950" />
              Buat Pesan &amp; Laporan Baru
            </button>
            <button
              onClick={openQuick10Sec}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Generator Kilat 10 Detik
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-teal-500/10 skew-x-12 translate-x-12 pointer-events-none" />
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pesan Dibuat Hari Ini</span>
            <MessageSquare className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {messagesToday}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Komunikasi tanggal {todayStr}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Riwayat Pesan</span>
            <FileText className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalReports}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Tersimpan aman di peramban
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Siswa Dilaporkan</span>
            <Users className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {uniqueStudentsReported} <span className="text-sm font-normal text-slate-400">/ {students.length}</span>
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {Math.round((uniqueStudentsReported / (students.length || 1)) * 100)}% dari daftar kelas
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Laporan Resmi Rapor</span>
            <Clock className="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {draftCount}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Format kedinasan (A–K)
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Quick Nav + Pedagogical Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Nav Actions (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Aksi Cepat Menu Guru</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <button
              onClick={() => onNavigateTab('generator')}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-start justify-between group cursor-pointer"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-1">
                  1. Form Generator Pesan Lengkap
                </span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Pilih kategori (akademik, sikap, tugas, keaktifan), gaya bahasa, dan rekomendasi tindak lanjut.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors shrink-0 ml-2" />
            </button>

            <button
              onClick={openQuick10Sec}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-start justify-between group cursor-pointer"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-1 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  2. Buat Narasi Kilat 10 Detik
                </span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Hanya 5 klik: nama, capaian, kekuatan, aspek perbaikan, dan pesan WA langsung jadi.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors shrink-0 ml-2" />
            </button>

            <button
              onClick={() => onNavigateTab('students')}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-start justify-between group cursor-pointer"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-1">
                  3. Kelola Data Siswa ({students.length})
                </span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Kelola daftar siswa kelas Anda, nomor presensi, serta nomor kontak WhatsApp wali murid.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors shrink-0 ml-2" />
            </button>

            <button
              onClick={openProfileModal}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-xs transition-all text-left flex items-start justify-between group cursor-pointer"
            >
              <div>
                <span className="font-bold text-xs text-slate-900 block mb-1">
                  4. Profil Guru &amp; Sekolah
                </span>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Atur NIP, nama sekolah, semester, tahun ajaran, dan kop dinas untuk cetak laporan resmi.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors shrink-0 ml-2" />
            </button>

          </div>

          {/* Recent Communications */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900">
                Pesan Terakhir Dibuat
              </h3>
              <button
                onClick={() => onNavigateTab('history')}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
              >
                Lihat Semua ({history.length}) →
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Belum ada pesan yang dibuat hari ini. Klik &quot;Buat Pesan Baru&quot; untuk memulai.
              </p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {item.siswaNama} ({item.kelas})
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {item.tanggal} · Gaya: {item.gayaBahasa}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigateTab('history')}
                      className="px-2.5 py-1 text-[11px] font-medium text-teal-700 bg-white border border-slate-200 rounded hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                      Buka
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pedagogical Principles Card (Col 3) */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-3">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              Prinsip Penulisan Narasi Edukatif
            </h3>
            
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-teal-700 font-bold">•</span>
                <span>
                  <strong>Bebas Label Negatif:</strong> Sistem otomatis mengubah istilah merendahkan (seperti <em>&quot;malas&quot;</em> atau <em>&quot;susah diatur&quot;</em>) menjadi narasi konstruktif.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 font-bold">•</span>
                <span>
                  <strong>Fokus pada Perkembangan:</strong> Menekankan potensi dan kemajuan bertahap daripada sekadar kekurangan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 font-bold">•</span>
                <span>
                  <strong>Kemitraan Hangat:</strong> Mengajak orang tua berkolaborasi di rumah tanpa merasa dihakimi atau disalahkan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-700 font-bold">•</span>
                <span>
                  <strong>Objektif &amp; Faktual:</strong> Menghindari prasangka atau diagnosis medis/psikologis sepihak.
                </span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                Standar Kurikulum Merdeka
              </span>
              <span>Kompak &amp; Bersahabat</span>
            </div>
          </div>

          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs">
            <span className="font-bold block mb-1">Butuh Kirim Cepat ke WhatsApp?</span>
            Gunakan tombol <strong>&quot;Salin untuk WhatsApp&quot;</strong> atau <strong>&quot;Kirim WA&quot;</strong> yang sudah otomatis merapikan format tulisan tebal dan poin-poin agar nyaman dibaca orang tua di ponsel pintar.
          </div>
        </div>

      </div>

    </div>
  );
};
