import React from 'react';
import {
  BookOpen,
  Sparkles,
  Users,
  Clock,
  Settings,
  Shield,
  ShieldCheck,
  Zap
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
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openQuick10Sec,
  openProfileModal,
  openPinModal,
  hasPin,
  isLocked,
  teacherName,
  schoolName
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                  Asisten Komunikasi Guru
                </span>
                <span className="text-xs text-slate-500 hidden sm:block">
                  {schoolName || 'SMA/SMK Indonesia'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'generator'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Buat Pesan &amp; Laporan
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'students'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Data Siswa
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Riwayat
            </button>
          </nav>

          {/* Zone 3: Primary Action and Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={openQuick10Sec}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors whitespace-nowrap cursor-pointer"
              title="Buat narasi kilat dalam 10 detik"
            >
              <Zap className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden sm:inline">Kilat 10 Detik</span>
            </button>

            <button
              onClick={openProfileModal}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Profil Guru &amp; Sekolah"
              aria-label="Profil Guru dan Sekolah"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={openPinModal}
              className={`p-2 rounded-lg transition-colors ${
                hasPin
                  ? 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={hasPin ? 'Privasi PIN aktif' : 'Atur PIN Pengunci'}
              aria-label="Kunci Privasi"
            >
              {hasPin ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden border-t border-slate-200 px-4 py-2 flex items-center justify-around text-xs font-medium text-slate-600 bg-slate-50">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`py-1 px-2 rounded ${activeTab === 'dashboard' ? 'text-teal-800 font-bold' : ''}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('generator')}
          className={`py-1 px-2 rounded ${activeTab === 'generator' ? 'text-teal-800 font-bold' : ''}`}
        >
          Generator
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`py-1 px-2 rounded ${activeTab === 'students' ? 'text-teal-800 font-bold' : ''}`}
        >
          Siswa
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-1 px-2 rounded ${activeTab === 'history' ? 'text-teal-800 font-bold' : ''}`}
        >
          Riwayat
        </button>
      </div>
    </header>
  );
};
