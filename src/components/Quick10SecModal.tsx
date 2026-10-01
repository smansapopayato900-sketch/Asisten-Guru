import React, { useState } from 'react';
import { Student, TeacherProfile, ProgressFormData } from '../types';
import { generateNarrative } from '../utils/narrativeEngine';
import { Zap, X, Copy, Check, Send, Sparkles } from 'lucide-react';

interface Quick10SecModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  teacherProfile: TeacherProfile;
  onApplyToFullGenerator: (formData: ProgressFormData) => void;
}

export const Quick10SecModal: React.FC<Quick10SecModalProps> = ({
  isOpen,
  onClose,
  students,
  teacherProfile,
  onApplyToFullGenerator
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [customName, setCustomName] = useState('');
  const [generalProgress, setGeneralProgress] = useState<'Sangat baik' | 'Baik' | 'Berkembang sesuai harapan' | 'Perlu bimbingan'>('Baik');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>(['Aktif bertanya', 'Mampu bekerja sama']);
  const [selectedArea, setSelectedArea] = useState<string>('Pengumpulan tugas');
  const [actionPlan, setActionPlan] = useState<string>('Jadwal belajar sederhana di rumah');

  const [generatedOutput, setGeneratedOutput] = useState<{ text: string; waText: string } | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const activeName = currentStudent ? currentStudent.namaLengkap : (customName || 'Andi');
  const activeNick = currentStudent ? currentStudent.namaPanggilan : (customName.split(' ')[0] || 'Andi');

  const quickStrengths = [
    'Cepat memahami materi',
    'Teliti & rapi',
    'Aktif bertanya',
    'Mampu bekerja sama',
    'Mandiri',
    'Bertanggung jawab',
    'Sopan dan santun'
  ];

  const quickAreas = [
    'Pengumpulan tugas',
    'Konsentrasi belajar',
    'Keaktifan di kelas',
    'Manajemen waktu',
    'Pemahaman materi',
    'Kehadiran'
  ];

  const toggleStrength = (s: string) => {
    if (selectedStrengths.includes(s)) {
      setSelectedStrengths(selectedStrengths.filter((item) => item !== s));
    } else {
      setSelectedStrengths([...selectedStrengths, s]);
    }
  };

  const handleGenerate = () => {
    // Susun ProgressFormData ringkas
    const quickForm: ProgressFormData = {
      siswaId: currentStudent?.id || 'quick-temp',
      namaSiswa: activeName,
      namaPanggilan: activeNick,
      kelas: currentStudent?.kelas || teacherProfile.kelasUtama || 'XI',
      nomorAbsen: currentStudent?.nomorAbsen || 1,
      namaOrtu: currentStudent?.namaOrtu || 'Bapak/Ibu Orang Tua/Wali',
      nomorHpOrtu: currentStudent?.nomorHpOrtu || '',
      periodeLaporan: 'Bulan Ini (' + new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) + ')',
      tanggalKomunikasi: new Date().toISOString().split('T')[0],

      jenisKomunikasi: 'kombinasi',
      akademikLevel: generalProgress,
      mataPelajaranTopik: teacherProfile.mataPelajaran || 'Mata Pelajaran',
      nilaiPencapaian: generalProgress === 'Sangat baik' ? 'Sangat Memuaskan' : 'Tuntas',
      kekuatanAkademik: selectedStrengths.join(', '),
      kesulitanDitemukan: '',
      perkembanganSebelumnya: '',

      sikapLevel: generalProgress === 'Perlu bimbingan' ? 'Cukup' : 'Baik',
      aspekSikapTerpilih: ['Tanggung jawab', 'Kesopanan'],

      kehadiran: { hadir: 20, sakit: 0, izin: 0, alpa: 0, keterangan: 'Hadir teratur' },
      keaktifanLevel: selectedStrengths.includes('Aktif bertanya') ? 'Aktif' : 'Cukup aktif',
      aspekKeaktifanTerpilih: ['Bertanya', 'Diskusi'],
      tugasLevel: selectedArea === 'Pengumpulan tugas' ? 'Beberapa kali terlambat' : 'Umumnya tepat waktu',

      kekuatanTerpilih: selectedStrengths,
      kekuatanLain: '',
      perluDikembangkanTerpilih: [selectedArea],
      catatanGuru: `Menunjukkan motivasi belajar yang baik dan siap berkembang lebih pesat melalui ${actionPlan.toLowerCase()}.`,

      gayaBahasa: 'formal-hangat',
      panjangPesan: 'singkat',
      modePerbandingan: false,
      periodeLalu: '',
      catatanPerkembanganLalu: ''
    };

    const res = generateNarrative(quickForm, teacherProfile);
    setGeneratedOutput({
      text: res.text,
      waText: res.waText
    });
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const openWhatsAppDirect = () => {
    if (!generatedOutput) return;
    const phone = currentStudent?.nomorHpOrtu ? currentStudent.nomorHpOrtu.replace(/\D/g, '') : '';
    const cleanPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(generatedOutput.waText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedOutput.waText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-teal-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-700 text-white rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Generator Kilat 10 Detik
              </h2>
              <p className="text-xs text-slate-600">
                Cukup 5 klik sederhana, sistem menyusun pesan komunikasi santun &amp; siap kirim.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Step 1: Siswa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Pilih Siswa
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  if (e.target.value) setCustomName('');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nomorAbsen}. {s.namaLengkap} ({s.kelas})
                  </option>
                ))}
                <option value="">+ Ketik Nama Siswa Lain</option>
              </select>

              {!selectedStudentId && (
                <input
                  type="text"
                  placeholder="Ketik Nama Siswa Lengkap..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              )}
            </div>
          </div>

          {/* Step 2: Perkembangan Umum */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Capaian Perkembangan Umum
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Sangat baik', 'Baik', 'Berkembang sesuai harapan', 'Perlu bimbingan'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setGeneralProgress(lvl)}
                  className={`px-3 py-2 text-xs rounded-lg font-medium border text-center transition-colors cursor-pointer ${
                    generalProgress === lvl
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Kekuatan Siswa */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. Kekuatan / Karakter Positif (Pilih 1–3 aspek)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickStrengths.map((str) => {
                const active = selectedStrengths.includes(str);
                return (
                  <button
                    key={str}
                    type="button"
                    onClick={() => toggleStrength(str)}
                    className={`px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                      active
                        ? 'bg-teal-100 text-teal-900 border border-teal-300 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}{str}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Hal yang Perlu Dikembangkan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              4. Hal yang Perlu Didampingi Bersama Orang Tua
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-2 text-xs rounded-lg font-medium border text-left transition-colors cursor-pointer ${
                    selectedArea === area
                      ? 'bg-amber-50 text-amber-900 border-amber-400 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {selectedArea === area ? '● ' : '○ '}{area}
                </button>
              ))}
            </div>
          </div>

          {/* Step 5: Tindak Lanjut */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              5. Saran Tindak Lanjut
            </label>
            <select
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="Jadwal belajar sederhana di rumah">Membantu pembuatan jadwal belajar sederhana di rumah</option>
              <option value="Menceritakan materi yang dipelajari di sekolah">Memberikan ruang menceritakan kembali hal menarik dari sekolah</option>
              <option value="Latihan bertahap 15 menit per hari">Mendampingi latihan bertahap 15 menit per hari</option>
              <option value="Apresiasi kemandirian dan motivasi">Memberi apresiasi atas kegigihan dan mempertahankan ritme baik</option>
              <option value="Pengurangan distraksi gawai">Membatasi distraksi gawai saat jam belajar malam</option>
            </select>
          </div>

          {/* Action Generate Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              GENERATE PESAN KILAT (10 DETIK)
            </button>
          </div>

          {/* Results Output */}
          {generatedOutput && (
            <div className="mt-4 p-4 border border-teal-200 bg-teal-50/40 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900">
                  Hasil Narasi Siap Kirim ({activeNick})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyToClipboard(generatedOutput.text, 'pesan')}
                    className="px-2.5 py-1 text-xs bg-white border border-slate-300 hover:bg-slate-50 rounded-md font-medium text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedType === 'pesan' ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedType === 'pesan' ? 'Tersalin' : 'Salin Pesan'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(generatedOutput.waText, 'wa')}
                    className="px-2.5 py-1 text-xs bg-teal-700 hover:bg-teal-800 text-white rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedType === 'wa' ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    {copiedType === 'wa' ? 'Tersalin WA' : 'Salin WhatsApp'}
                  </button>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
                {generatedOutput.text}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Ingin opsi lebih detail? Buka di formulir lengkap.</span>
                <button
                  onClick={() => {
                    handleGenerate();
                    onClose();
                  }}
                  className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer underline"
                >
                  Buka di Generator Lengkap →
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
