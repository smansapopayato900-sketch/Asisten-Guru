import React, { useState } from 'react';
import { Lock, Unlock, AlertCircle } from 'lucide-react';

interface PinLockScreenProps {
  correctPin: string;
  onUnlock: () => void;
  teacherName: string;
  schoolName: string;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin,
  onUnlock,
  teacherName,
  schoolName
}) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      setError(false);

      if (next.length === 4) {
        if (next === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => setPinInput(''), 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 w-full max-w-sm text-center shadow-2xl">
        
        <div className="w-14 h-14 bg-teal-600/20 text-teal-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-lg font-bold text-white mb-1">
          Layar Terkunci
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {teacherName || 'Bapak/Ibu Guru'} · {schoolName || 'Asisten Komunikasi Guru'}
        </p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pinInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  error
                    ? 'bg-red-500 scale-110'
                    : filled
                    ? 'bg-teal-400 scale-110'
                    : 'bg-slate-600'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-red-400 font-semibold mb-4 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> PIN salah, silakan coba lagi
          </p>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="w-14 h-14 rounded-full bg-slate-700/80 hover:bg-slate-600 text-white font-bold text-lg transition-colors flex items-center justify-center mx-auto cursor-pointer"
            >
              {num}
            </button>
          ))}
          <div className="w-14 h-14" />
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="w-14 h-14 rounded-full bg-slate-700/80 hover:bg-slate-600 text-white font-bold text-lg transition-colors flex items-center justify-center mx-auto cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-14 h-14 rounded-full bg-slate-700/40 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center mx-auto cursor-pointer"
          >
            Hapus
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Lindungi kerahasiaan data siswa saat perangkat berada di area umum.
        </p>

      </div>
    </div>
  );
};
