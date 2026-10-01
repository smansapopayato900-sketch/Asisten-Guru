import React, { useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Sparkles,
  Users,
  Clock,
  Settings,
  Shield,
  ShieldCheck,
  Zap,
  Lock,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openQuick10Sec: () => void;
  openProfileModal: () => void;
  openPinModal: () => void;
  hasPin: boolean;
  isLocked: boolean;
  teacherName: string;
  schoolName: string;
  userEmail?: string;
  onLock?: () => void;
  onSignOut?: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'generator', label: 'Buat Pesan & Laporan', icon: Sparkles },
  { id: 'students', label: 'Data Siswa', icon: Users },
  { id: 'history', label: 'Riwayat', icon: Clock }
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openQuick10Sec,
  openProfileModal,
  openPinModal,
  hasPin,
  teacherName,
  schoolName,
  userEmail,
  onLock,
  onSignOut
}) => {
  const [open, setOpen] = useState(false);

  // Tutup laci (mobile) setiap kali satu menu dipilih
  const run = (fn?: () => void) => () => {
    setOpen(false);
    fn?.();
  };

  const rowClass =
    'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-colors cursor-pointer text-left';

  return (
    <>
      {/* Bar atas khusus mobile */}
      <div className="no-print lg:hidden sticky top-0 z-30 glass !rounded-none !border-x-0 !border-t-0 px-4 h-14 flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-white/60 cursor-pointer"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button onClick={run(() => setActiveTab('dashboard'))} className="flex items-center gap-2 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </span>
          <span className="text-sm font-bold text-slate-900 truncate">Asisten Komunikasi Guru</span>
        </button>
      </div>

      {/* Latar gelap saat laci mobile terbuka */}
      {open && (
        <div
          className="no-print lg:hidden fixed inset-0 z-30 bg-slate-900/25 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar kiri */}
      <aside
        className={`no-print glass fixed z-40 top-3 bottom-3 left-3 w-[272px] rounded-[28px] p-3 flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)] lg:translate-x-0'
        }`}
        aria-label="Menu utama"
      >
        {/* Merek */}
        <div className="flex items-start justify-between gap-2 px-1 pt-1 pb-3">
          <button
            onClick={run(() => setActiveTab('dashboard'))}
            className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
          >
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold text-slate-900 leading-tight tracking-tight">
                Asisten Komunikasi Guru
              </span>
              <span className="block text-xs text-slate-500 truncate">{schoolName || 'SMA/SMK Indonesia'}</span>
            </span>
          </button>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-white/60 cursor-pointer"
            aria-label="Tutup menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={run(() => setActiveTab(id))}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors cursor-pointer text-left ${
                  active
                    ? 'glass-active text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/45'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-teal-700' : 'text-slate-400'}`} />
                {label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={run(openQuick10Sec)}
          className="mt-3 flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold text-white bg-teal-600/90 hover:bg-teal-600 shadow-[0_4px_14px_rgba(13,148,136,0.35),inset_0_1px_0_rgba(255,255,255,0.35)] transition-colors cursor-pointer"
          title="Buat narasi kilat dalam 10 detik"
        >
          <Zap className="w-4 h-4" />
          Kilat 10 Detik
        </button>

        <div className="flex-1" />

        {/* Pengaturan & akun */}
        <div className="border-t border-white/60 pt-2 flex flex-col gap-0.5">
          <button onClick={run(openProfileModal)} className={rowClass}>
            <Settings className="w-4 h-4 text-slate-400" />
            Profil guru &amp; sekolah
          </button>
          <button onClick={run(openPinModal)} className={rowClass}>
            {hasPin ? (
              <ShieldCheck className="w-4 h-4 text-teal-700" />
            ) : (
              <Shield className="w-4 h-4 text-slate-400" />
            )}
            {hasPin ? 'PIN aktif' : 'Atur PIN'}
          </button>
          {hasPin && onLock && (
            <button onClick={run(onLock)} className={rowClass}>
              <Lock className="w-4 h-4 text-slate-400" />
              Kunci layar
            </button>
          )}
          {onSignOut && (
            <button onClick={run(onSignOut)} className={rowClass}>
              <LogOut className="w-4 h-4 text-slate-400" />
              Keluar
            </button>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2.5 px-2 py-2 rounded-2xl bg-white/40">
          <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 text-sm font-bold flex items-center justify-center shrink-0">
            {(teacherName || '?').charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-slate-800 truncate">{teacherName}</span>
            {userEmail && <span className="block text-[11px] text-slate-500 truncate">{userEmail}</span>}
          </span>
        </div>
      </aside>
    </>
  );
};