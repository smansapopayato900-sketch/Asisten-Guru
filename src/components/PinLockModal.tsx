import React, { useState } from 'react';
import { X, Shield, Lock, Unlock, Trash2, AlertTriangle, Check } from 'lucide-react';

interface PinLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPin: string | null;
  onSetPin: (pin: string | null) => void;
  onClearAllData: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  onClose,
  savedPin,
  onSetPin,
  onClearAllData
}) => {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentEnteredPin, setCurrentEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (savedPin && currentEnteredPin !== savedPin) {
      setErrorMessage('PIN saat ini salah.');
      return;
    }

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setErrorMessage('PIN harus terdiri dari 4 digit angka.');
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMessage('Konfirmasi PIN tidak cocok.');
      return;
    }

    onSetPin(newPin);
    setSuccessMessage('PIN keamanan berhasil disimpan!');
    setNewPin('');
    setConfirmPin('');
    setCurrentEnteredPin('');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  const handleRemovePin = () => {
    if (savedPin && currentEnteredPin !== savedPin) {
      setErrorMessage('Masukkan PIN saat ini untuk menonaktifkan pengunci.');
      return;
    }
    onSetPin(null);
    setSuccessMessage('Kunci PIN dinonaktifkan.');
    setCurrentEnteredPin('');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  const handleClearAll = () => {
    onClearAllData();
    setShowClearConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800 text-white rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Keamanan &amp; Privasi Data Guru
              </h2>
              <p className="text-xs text-slate-500">
                Penyimpanan lokal 100% offline &amp; opsi PIN privasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
            <span className="font-semibold block mb-0.5">Komitmen Privasi:</span>
            Seluruh data siswa dan profil sekolah Anda disimpan secara lokal di dalam peramban perangkat ini. Tidak ada data yang diunggah ke pihak ketiga tanpa seizin Anda.
          </div>

          {/* Form PIN */}
          <form onSubmit={handleSaveNewPin} className="space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-700" />
              {savedPin ? 'Ubah atau Hapus PIN Pengunci' : 'Aktifkan Kunci PIN 4 Digit'}
            </h3>
            <p className="text-slate-500 text-[11px]">
              Kunci layar aplikasi ketika perangkat sedang dipinjam rekan atau siswa di kelas.
            </p>

            {savedPin && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  PIN Saat Ini
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={currentEnteredPin}
                  onChange={(e) => setCurrentEnteredPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-center tracking-widest text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                  placeholder="••••"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  PIN Baru (4 Digit)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-center tracking-widest text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                  placeholder="••••"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ulangi PIN Baru
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-center tracking-widest text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                  placeholder="••••"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-600 font-semibold">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="text-teal-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {successMessage}
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                {savedPin ? 'Perbarui PIN' : 'Simpan PIN'}
              </button>
              {savedPin && (
                <button
                  type="button"
                  onClick={handleRemovePin}
                  className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                >
                  Nonaktifkan PIN
                </button>
              )}
            </div>
          </form>

          {/* Section: Hapus Data Bersih */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-red-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              Pembersihan Data
            </h3>
            <p className="text-slate-500 text-[11px] mb-2">
              Hapus seluruh riwayat pesan, draft, dan daftar siswa dari perangkat ini setelah selesai periode pelaporan.
            </p>

            {!showClearConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 text-xs font-medium text-red-700 border border-red-300 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Seluruh Data Tersimpan
              </button>
            ) : (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
                <p className="font-bold text-red-900 text-[11px]">
                  Konfirmasi: Apakah Anda yakin ingin menghapus seluruh data siswa dan riwayat pesan di perangkat ini? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                  >
                    Ya, Hapus Semuanya
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
