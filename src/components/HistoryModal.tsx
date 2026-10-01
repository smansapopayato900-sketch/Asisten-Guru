import React, { useState } from 'react';
import { SavedMessage, ProgressFormData } from '../types';
import { X, Search, Copy, Check, Send, Trash2, ArrowUpRight, Clock } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedMessage[];
  onDeleteMessage: (id: string) => void;
  onLoadIntoForm: (formData: ProgressFormData) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onDeleteMessage,
  onLoadIntoForm
}) => {
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<SavedMessage | null>(
    history[0] || null
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filtered = history.filter(
    (h) =>
      h.siswaNama.toLowerCase().includes(search.toLowerCase()) ||
      h.kelas.toLowerCase().includes(search.toLowerCase()) ||
      h.tanggal.includes(search)
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openWhatsApp = (msg: SavedMessage) => {
    const phone = msg.nomorHpOrtu ? msg.nomorHpOrtu.replace(/\D/g, '') : '';
    const cleanPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg.isiNarasi)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg.isiNarasi)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Riwayat Pesan &amp; Draft Laporan
            </h2>
            <p className="text-xs text-slate-500">
              Total {history.length} pesan tersimpan di perangkat ini.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
          
          {/* List panel */}
          <div className="w-full md:w-80 flex flex-col">
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa atau tanggal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[400px]">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada riwayat komunikasi
                </div>
              ) : (
                filtered.map((item) => {
                  const active = selectedMessage?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMessage(item)}
                      className={`p-3 cursor-pointer transition-colors ${
                        active ? 'bg-teal-50/70 border-l-4 border-l-teal-700' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-900">
                          {item.siswaNama}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.tanggal}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span>{item.kelas}</span>
                        <span>·</span>
                        <span className="capitalize">{item.jenisKomunikasi}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Details / Preview Panel */}
          <div className="flex-1 flex flex-col border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            {selectedMessage ? (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {selectedMessage.siswaNama} ({selectedMessage.kelas})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Dibuat pada: {selectedMessage.timestamp} · Ortu: {selectedMessage.namaOrtu || '-'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(selectedMessage.isiNarasi)}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 hover:bg-slate-50 rounded font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Tersalin' : 'Salin'}
                    </button>
                    <button
                      onClick={() => openWhatsApp(selectedMessage)}
                      className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Kirim WA
                    </button>
                    <button
                      onClick={() => {
                        onLoadIntoForm(selectedMessage.formData);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs bg-teal-700 hover:bg-teal-800 text-white rounded font-medium flex items-center gap-1 cursor-pointer"
                      title="Edit ulang di generator"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Buka di Editor
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Hapus pesan ini dari riwayat?')) {
                          onDeleteMessage(selectedMessage.id);
                          setSelectedMessage(null);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed overflow-y-auto max-h-[350px] whitespace-pre-wrap flex-1">
                  {selectedMessage.isiNarasi}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                Pilih pesan dari daftar di samping untuk melihat pratinjau lengkap
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
