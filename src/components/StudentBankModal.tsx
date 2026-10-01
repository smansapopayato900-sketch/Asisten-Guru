import React, { useState } from 'react';
import { Student } from '../types';
import { X, Plus, Trash2, Edit2, Download, Upload, UserCheck, Search } from 'lucide-react';

interface StudentBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSaveStudents: (list: Student[]) => void;
  onSelectStudent: (student: Student) => void;
}

export const StudentBankModal: React.FC<StudentBankModalProps> = ({
  isOpen,
  onClose,
  students,
  onSaveStudents,
  onSelectStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState('');

  // Form state for add/edit
  const [namaLengkap, setNamaLengkap] = useState('');
  const [namaPanggilan, setNamaPanggilan] = useState('');
  const [kelas, setKelas] = useState('XI-F');
  const [nomorAbsen, setNomorAbsen] = useState<number | string>(1);
  const [namaOrtu, setNamaOrtu] = useState('');
  const [nomorHpOrtu, setNomorHpOrtu] = useState('');
  const [catatanKhusus, setCatatanKhusus] = useState('');

  if (!isOpen) return null;

  const startEdit = (st: Student) => {
    setEditingStudent(st);
    setIsAdding(false);
    setNamaLengkap(st.namaLengkap);
    setNamaPanggilan(st.namaPanggilan);
    setKelas(st.kelas);
    setNomorAbsen(st.nomorAbsen);
    setNamaOrtu(st.namaOrtu);
    setNomorHpOrtu(st.nomorHpOrtu);
    setCatatanKhusus(st.catatanKhusus || '');
  };

  const startAdd = () => {
    setEditingStudent(null);
    setIsAdding(true);
    setNamaLengkap('');
    setNamaPanggilan('');
    setKelas(students[0]?.kelas || 'XI-F');
    setNomorAbsen(students.length + 1);
    setNamaOrtu('');
    setNomorHpOrtu('');
    setCatatanKhusus('');
  };

  const cancelForm = () => {
    setEditingStudent(null);
    setIsAdding(false);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) return;

    if (editingStudent) {
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              namaLengkap,
              namaPanggilan: namaPanggilan || namaLengkap.split(' ')[0],
              kelas,
              nomorAbsen: Number(nomorAbsen) || 1,
              namaOrtu,
              nomorHpOrtu,
              catatanKhusus
            }
          : s
      );
      onSaveStudents(updated);
    } else {
      const newStudent: Student = {
        id: 'std-' + Date.now(),
        namaLengkap,
        namaPanggilan: namaPanggilan || namaLengkap.split(' ')[0],
        kelas,
        nomorAbsen: Number(nomorAbsen) || students.length + 1,
        namaOrtu,
        nomorHpOrtu,
        catatanKhusus
      };
      onSaveStudents([...students, newStudent]);
    }

    cancelForm();
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus data siswa "${name}" dari daftar?`)) {
      onSaveStudents(students.filter((s) => s.id !== id));
      if (editingStudent?.id === id) cancelForm();
    }
  };

  const handleBatchImport = () => {
    if (!importText.trim()) return;
    const lines = importText.split('\n').filter((l) => l.trim().length > 0);
    const newStudents: Student[] = [];

    lines.forEach((line, idx) => {
      // Format: Nama Lengkap, Nama Panggilan, Kelas, No Absen, Nama Ortu, No HP
      const parts = line.split(',').map((p) => p.trim());
      if (parts[0]) {
        newStudents.push({
          id: 'std-' + Date.now() + '-' + idx,
          namaLengkap: parts[0],
          namaPanggilan: parts[1] || parts[0].split(' ')[0],
          kelas: parts[2] || 'XI-F',
          nomorAbsen: Number(parts[3]) || idx + 1,
          namaOrtu: parts[4] || '',
          nomorHpOrtu: parts[5] || '',
          catatanKhusus: ''
        });
      }
    });

    if (newStudents.length > 0) {
      onSaveStudents([...students, ...newStudents]);
      setImportMode(false);
      setImportText('');
      alert(`Berhasil menambahkan ${newStudents.length} siswa baru!`);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.namaPanggilan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Data Peserta Didik (Bank Siswa)
            </h2>
            <p className="text-xs text-slate-500">
              Total {students.length} siswa tersimpan. Pilih siswa untuk langsung mengisi formulir komunikasi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
          
          {/* Left: Students List & Actions */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama atau kelas siswa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={startAdd}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Siswa
                </button>
                <button
                  onClick={() => setImportMode(!importMode)}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Impor banyak siswa sekaligus"
                >
                  <Upload className="w-3.5 h-3.5 inline mr-1" />
                  Impor
                </button>
              </div>
            </div>

            {/* Import Mode Panel */}
            {importMode && (
              <div className="mb-4 p-4 border border-teal-200 bg-teal-50/50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-teal-900">
                    Impor Data Siswa Sekaligus (Format CSV/Teks)
                  </span>
                  <button
                    onClick={() => setImportMode(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Tutup
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  Ketik/tempel 1 baris per siswa dengan pemisah tanda koma:<br />
                  <code className="text-teal-800 bg-white px-1 py-0.5 rounded">
                    Nama Lengkap, Nama Panggilan, Kelas, No Absen, Nama Ortu, No HP
                  </code>
                </p>
                <textarea
                  rows={4}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Ahmad Fauzi, Fauzi, XI-F, 1, Bapak Hasan, 08123456789&#10;Citra Lestari, Citra, XI-F, 2, Ibu Suryani, 08129876543"
                  className="w-full text-xs font-mono p-2 border border-slate-300 rounded bg-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleBatchImport}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors"
                  >
                    Mulai Impor Siswa
                  </button>
                </div>
              </div>
            )}

            {/* Students Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden flex-1 overflow-y-auto max-h-[360px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <tr>
                    <th className="py-2 px-3 w-10">No</th>
                    <th className="py-2 px-3">Nama Siswa</th>
                    <th className="py-2 px-3">Kelas</th>
                    <th className="py-2 px-3">Orang Tua / Kontak</th>
                    <th className="py-2 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Tidak ada siswa yang sesuai pencarian
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr
                        key={st.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="py-2 px-3 text-slate-500 font-mono">
                          {st.nomorAbsen}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-slate-800 block">
                            {st.namaLengkap}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Panggilan: {st.namaPanggilan}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {st.kelas}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          <span className="block truncate max-w-[140px]">
                            {st.namaOrtu || '-'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {st.nomorHpOrtu || '-'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                onSelectStudent(st);
                                onClose();
                              }}
                              className="px-2 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded font-medium transition-colors"
                              title="Pilih untuk buat narasi"
                            >
                              <UserCheck className="w-3.5 h-3.5 inline mr-1" />
                              Pilih
                            </button>
                            <button
                              onClick={() => startEdit(st)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                              title="Edit Siswa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(st.id, st.namaLengkap)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Right: Add/Edit Form */}
          {(isAdding || editingStudent) && (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>{editingStudent ? 'Edit Siswa' : 'Tambah Siswa Baru'}</span>
                <button
                  onClick={cancelForm}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Batal
                </button>
              </h3>

              <form onSubmit={handleSaveStudent} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                    placeholder="Contoh: Muhammad Rizky Pratama"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Panggilan
                    </label>
                    <input
                      type="text"
                      value={namaPanggilan}
                      onChange={(e) => setNamaPanggilan(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                      placeholder="Rizky"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nomor Absen
                    </label>
                    <input
                      type="number"
                      value={nomorAbsen}
                      onChange={(e) => setNomorAbsen(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kelas / Rombel
                  </label>
                  <input
                    type="text"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                    placeholder="XI-F"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={namaOrtu}
                    onChange={(e) => setNamaOrtu(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                    placeholder="Bapak/Ibu ..."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    No. WhatsApp Orang Tua
                  </label>
                  <input
                    type="text"
                    value={nomorHpOrtu}
                    onChange={(e) => setNomorHpOrtu(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                    placeholder="0812xxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Catatan Khusus (Internal Guru)
                  </label>
                  <textarea
                    rows={2}
                    value={catatanKhusus}
                    onChange={(e) => setCatatanKhusus(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                    placeholder="Misal: Minat tinggi di sains..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors shadow-xs"
                  >
                    {editingStudent ? 'Simpan Perubahan' : 'Tambah Siswa'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Data disimpan di peramban (LocalStorage) aman secara privat.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
