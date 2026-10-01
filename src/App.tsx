/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import * as db from './lib/db';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MessageGeneratorView } from './components/MessageGeneratorView';
import { Quick10SecModal } from './components/Quick10SecModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { StudentBankModal } from './components/StudentBankModal';
import { ReportDocumentModal } from './components/ReportDocumentModal';
import { PinLockModal } from './components/PinLockModal';
import { PinLockScreen } from './components/PinLockScreen';
import { HistoryModal } from './components/HistoryModal';

import {
  DEFAULT_TEACHER_PROFILE,
  INITIAL_STUDENTS,
  DEFAULT_FORM_DATA
} from './data/constants';
import {
  TeacherProfile,
  Student,
  SavedMessage,
  ProgressFormData,
  FullReportSection
} from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  // 1. Auth & status
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const userId = session?.user.id ?? null;

  // 2. Data (dimuat dari Supabase setelah login)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(DEFAULT_TEACHER_PROFILE);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [history, setHistory] = useState<SavedMessage[]>([]);
  const [pin, setPin] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<ProgressFormData>(DEFAULT_FORM_DATA);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals
  const [isQuick10SecOpen, setIsQuick10SecOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStudentBankOpen, setIsStudentBankOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isReportDocOpen, setIsReportDocOpen] = useState(false);
  const [activeReportSections, setActiveReportSections] = useState<FullReportSection[]>([]);

  // 3. Pantau sesi login Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // 4. Muat data guru dari Supabase saat user login
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    if (!userId) {
      setDataReady(false);
      return;
    }
    let cancelled = false;
    setDataReady(false);
    setLoadError('');
    db.loadUserData(userId)
      .then((d) => {
        if (cancelled) return;
        setTeacherProfile(d.profile);
        setStudents(d.students);
        setHistory(d.history);
        setPin(d.pin);
        setIsLocked(!!d.pin);
        setDataReady(true);
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e?.message ?? String(e));
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  // Jalankan penyimpanan ke Supabase; tampilkan pesan jika gagal
  const persist = (task: Promise<void>) => {
    task
      .then(() => setSaveError(''))
      .catch((e) => {
        console.error(e);
        setSaveError('Gagal menyimpan ke Supabase: ' + (e?.message ?? e));
      });
  };

  // Handlers
  const handleSaveProfile = (updated: TeacherProfile) => {
    setTeacherProfile(updated);
    if (userId) persist(db.saveProfile(userId, updated));
  };

  const handleSaveStudents = (list: Student[]) => {
    setStudents(list);
    if (userId) persist(db.saveStudents(userId, list));
  };

  const handleSaveMessage = (newMsg: SavedMessage) => {
    setHistory((prev) => [newMsg, ...prev]);
    if (userId) persist(db.addMessage(userId, newMsg));
  };

  const handleDeleteMessage = (id: string) => {
    setHistory((prev) => prev.filter((m) => m.id !== id));
    if (userId) persist(db.deleteMessage(userId, id));
  };

  const handleSetPin = (newPin: string | null) => {
    setPin(newPin);
    if (userId) persist(db.savePin(userId, newPin));
  };

  const handleClearAllData = () => {
    setTeacherProfile(DEFAULT_TEACHER_PROFILE);
    setStudents(INITIAL_STUDENTS);
    setHistory([]);
    setPin(null);
    setIsLocked(false);
    setFormData(DEFAULT_FORM_DATA);
    if (userId) persist(db.clearUserData(userId));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsLocked(false);
    setFormData(DEFAULT_FORM_DATA);
    setActiveTab('dashboard');
  };

  const handleSelectStudentForForm = (student: Student) => {
    setFormData((prev) => ({
      ...prev,
      siswaId: student.id,
      namaSiswa: student.namaLengkap,
      namaPanggilan: student.namaPanggilan,
      kelas: student.kelas,
      nomorAbsen: student.nomorAbsen,
      namaOrtu: student.namaOrtu,
      nomorHpOrtu: student.nomorHpOrtu
    }));
    setActiveTab('generator');
  };

  const handleOpenFullReportModal = (sections: FullReportSection[]) => {
    setActiveReportSections(sections);
    setIsReportDocOpen(true);
  };

  // Layar status sebelum aplikasi utama tampil
  const centered = (children: React.ReactNode) => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center text-sm text-slate-600 space-y-3">{children}</div>
    </div>
  );

  if (!isSupabaseConfigured) {
    return centered(
      <>
        <h1 className="text-lg font-bold text-slate-800">Supabase belum dikonfigurasi</h1>
        <p>
          Salin <code>.env.example</code> menjadi <code>.env.local</code>, isi{' '}
          <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>, lalu jalankan ulang{' '}
          <code>npm run dev</code>. Di Vercel, isi keduanya di Settings → Environment Variables.
        </p>
      </>
    );
  }

  if (!authReady) {
    return centered(<Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-600" />);
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (loadError) {
    return centered(
      <>
        <h1 className="text-lg font-bold text-slate-800">Gagal memuat data</h1>
        <p className="text-red-600">{loadError}</p>
        <p className="text-xs text-slate-500">
          Pastikan <code>supabase/schema.sql</code> sudah dijalankan di Supabase.
        </p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => setReloadKey((k) => k + 1)} className="px-3 py-1.5 bg-teal-600 text-white rounded-md cursor-pointer">
            Coba lagi
          </button>
          <button onClick={handleSignOut} className="px-3 py-1.5 border border-slate-300 rounded-md cursor-pointer">
            Keluar
          </button>
        </div>
      </>
    );
  }

  if (!dataReady) {
    return centered(
      <>
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-600" />
        <p>Memuat data dari Supabase…</p>
      </>
    );
  }

  // If app is PIN-locked
  if (isLocked && pin) {
    return (
      <PinLockScreen
        correctPin={pin}
        onUnlock={() => setIsLocked(false)}
        teacherName={teacherProfile.namaGuru}
        schoolName={teacherProfile.namaSekolah}
      />
    );
  }

  return (
    <div className="app-ambient min-h-screen flex flex-col text-slate-800 lg:pl-74 print:pl-0">
      
      {/* Sidebar kiri (kaca) */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'students') {
            setIsStudentBankOpen(true);
          } else if (tab === 'history') {
            setIsHistoryModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        openQuick10Sec={() => setIsQuick10SecOpen(true)}
        openProfileModal={() => setIsProfileOpen(true)}
        openPinModal={() => setIsPinModalOpen(true)}
        hasPin={!!pin}
        isLocked={isLocked}
        teacherName={teacherProfile.namaGuru}
        schoolName={teacherProfile.namaSekolah}
        userEmail={session.user.email ?? undefined}
        onLock={() => setIsLocked(true)}
        onSignOut={handleSignOut}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {saveError && (
          <div className="no-print mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {saveError}
          </div>
        )}

        {/* Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            students={students}
            history={history}
            teacherProfile={teacherProfile}
            onNavigateTab={(tab) => {
              if (tab === 'students') {
                setIsStudentBankOpen(true);
              } else if (tab === 'history') {
                setIsHistoryModalOpen(true);
              } else {
                setActiveTab(tab);
              }
            }}
            openQuick10Sec={() => setIsQuick10SecOpen(true)}
            openProfileModal={() => setIsProfileOpen(true)}
          />
        )}

        {activeTab === 'generator' && (
          <MessageGeneratorView
            formData={formData}
            setFormData={setFormData}
            students={students}
            teacherProfile={teacherProfile}
            onSaveMessage={handleSaveMessage}
            onOpenFullReportModal={handleOpenFullReportModal}
          />
        )}

      </main>

      {/* Modals */}
      <Quick10SecModal
        isOpen={isQuick10SecOpen}
        onClose={() => setIsQuick10SecOpen(false)}
        students={students}
        teacherProfile={teacherProfile}
        onApplyToFullGenerator={(newForm) => {
          setFormData(newForm);
          setActiveTab('generator');
        }}
      />

      <TeacherProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={teacherProfile}
        onSave={handleSaveProfile}
      />

      <StudentBankModal
        isOpen={isStudentBankOpen}
        onClose={() => setIsStudentBankOpen(false)}
        students={students}
        onSaveStudents={handleSaveStudents}
        onSelectStudent={handleSelectStudentForForm}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onDeleteMessage={handleDeleteMessage}
        onLoadIntoForm={(loadedForm) => {
          setFormData(loadedForm);
          setActiveTab('generator');
        }}
      />

      <ReportDocumentModal
        isOpen={isReportDocOpen}
        onClose={() => setIsReportDocOpen(false)}
        sections={activeReportSections}
        profile={teacherProfile}
        studentName={formData.namaSiswa}
        studentNick={formData.namaPanggilan}
        kelas={formData.kelas}
        periode={formData.periodeLaporan}
      />

      <PinLockModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        savedPin={pin}
        onSetPin={handleSetPin}
        onClearAllData={handleClearAllData}
      />

      {/* Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800">
              Asisten Komunikasi Guru &amp; Orang Tua
            </span>
            <span>·</span>
            <span>Dirancang untuk Guru &amp; Wali Kelas SMA/SMK Indonesia</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Mendukung Prinsip Pendidikan Ki Hadjar Dewantara &amp; Kurikulum Merdeka</span>
          </div>
        </div>
      </footer>

    </div>
  );
}