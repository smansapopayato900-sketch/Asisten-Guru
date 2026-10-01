import React, { useState, useEffect } from 'react';
import {
  Student,
  TeacherProfile,
  ProgressFormData,
  CommunicationCategory,
  AcademicLevel,
  AttitudeLevel,
  ActivityLevel,
  AssignmentLevel,
  ToneStyle,
  MessageLength,
  SavedMessage,
  FullReportSection
} from '../types';
import {
  COMMUNICATION_TYPES,
  ACADEMIC_LEVELS,
  ATTITUDE_LEVELS,
  ATTITUDE_ASPECTS,
  ACTIVITY_LEVELS,
  ACTIVITY_ASPECTS,
  ASSIGNMENT_LEVELS,
  STRENGTH_OPTIONS,
  AREAS_TO_DEVELOP,
  TONE_STYLES,
  DEFAULT_FORM_DATA
} from '../data/constants';
import {
  generateNarrative,
  modifyNarrative,
  generateWordDocument,
  sanitizePedagogicalText
} from '../utils/narrativeEngine';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  Printer,
  Download,
  RotateCcw,
  Sliders,
  BookmarkPlus,
  ArrowRightLeft,
  Calendar,
  User,
  GraduationCap,
  Heart,
  Clock,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface MessageGeneratorViewProps {
  formData: ProgressFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProgressFormData>>;
  students: Student[];
  teacherProfile: TeacherProfile;
  onSaveMessage: (msg: SavedMessage) => void;
  onOpenFullReportModal: (sections: FullReportSection[]) => void;
}

export const MessageGeneratorView: React.FC<MessageGeneratorViewProps> = ({
  formData,
  setFormData,
  students,
  teacherProfile,
  onSaveMessage,
  onOpenFullReportModal
}) => {
  // Output state
  const [generatedText, setGeneratedText] = useState('');
  const [waFormattedText, setWaFormattedText] = useState('');
  const [currentRecommendations, setCurrentRecommendations] = useState<string[]>([]);
  const [reportSections, setReportSections] = useState<FullReportSection[]>([]);
  
  // UI Tabs for preview
  const [previewTab, setPreviewTab] = useState<'narasi' | 'wa' | 'rekomendasi' | 'laporan'>('narasi');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Accordion open tabs on the form side
  const [activeFormTab, setActiveFormTab] = useState<'siswa' | 'perkembangan' | 'potensi' | 'format'>('siswa');

  // Initial generation on first mount
  useEffect(() => {
    runGeneration();
  }, []);

  const handleStudentSelect = (studentId: string) => {
    const found = students.find((s) => s.id === studentId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        siswaId: found.id,
        namaSiswa: found.namaLengkap,
        namaPanggilan: found.namaPanggilan,
        kelas: found.kelas,
        nomorAbsen: found.nomorAbsen,
        namaOrtu: found.namaOrtu,
        nomorHpOrtu: found.nomorHpOrtu
      }));
    }
  };

  const toggleStrength = (item: string) => {
    setFormData((prev) => {
      const exists = prev.kekuatanTerpilih.includes(item);
      return {
        ...prev,
        kekuatanTerpilih: exists
          ? prev.kekuatanTerpilih.filter((k) => k !== item)
          : [...prev.kekuatanTerpilih, item]
      };
    });
  };

  const toggleArea = (item: string) => {
    setFormData((prev) => {
      const exists = prev.perluDikembangkanTerpilih.includes(item);
      return {
        ...prev,
        perluDikembangkanTerpilih: exists
          ? prev.perluDikembangkanTerpilih.filter((k) => k !== item)
          : [...prev.perluDikembangkanTerpilih, item]
      };
    });
  };

  const toggleAttitudeAspect = (aspect: string) => {
    setFormData((prev) => {
      const exists = prev.aspekSikapTerpilih.includes(aspect);
      return {
        ...prev,
        aspekSikapTerpilih: exists
          ? prev.aspekSikapTerpilih.filter((a) => a !== aspect)
          : [...prev.aspekSikapTerpilih, aspect]
      };
    });
  };

  const toggleActivityAspect = (aspect: string) => {
    setFormData((prev) => {
      const exists = prev.aspekKeaktifanTerpilih.includes(aspect);
      return {
        ...prev,
        aspekKeaktifanTerpilih: exists
          ? prev.aspekKeaktifanTerpilih.filter((a) => a !== aspect)
          : [...prev.aspekKeaktifanTerpilih, aspect]
      };
    });
  };

  const runGeneration = () => {
    setIsGenerating(true);
    const result = generateNarrative(formData, teacherProfile);
    setGeneratedText(result.text);
    setWaFormattedText(result.waText);
    setCurrentRecommendations(result.recommendations);
    setReportSections(result.reportSections);
    setIsGenerating(false);
  };

  // Modify polish handlers
  const handleModify = (
    action:
      | 'perbaiki_bahasa'
      | 'lebih_singkat'
      | 'lebih_formal'
      | 'lebih_ramah'
      | 'lebih_positif'
      | 'versi_wa'
      | 'versi_laporan'
      | 'regenerasi'
  ) => {
    const updated = modifyNarrative(generatedText, action, formData, teacherProfile);
    setGeneratedText(updated);
    if (action === 'versi_wa') {
      setPreviewTab('wa');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const openWhatsAppDirect = () => {
    const targetText = previewTab === 'wa' ? waFormattedText : generatedText;
    const phone = formData.nomorHpOrtu ? formData.nomorHpOrtu.replace(/\D/g, '') : '';
    const cleanPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(targetText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(targetText)}`;
    window.open(url, '_blank');
  };

  const handleSaveToHistory = () => {
    const newSaved: SavedMessage = {
      id: 'msg-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      tanggal: formData.tanggalKomunikasi,
      siswaNama: formData.namaSiswa,
      siswaId: formData.siswaId,
      kelas: formData.kelas,
      namaOrtu: formData.namaOrtu,
      nomorHpOrtu: formData.nomorHpOrtu,
      jenisKomunikasi: formData.jenisKomunikasi,
      gayaBahasa: formData.gayaBahasa,
      panjangPesan: formData.panjangPesan,
      isiNarasi: previewTab === 'wa' ? waFormattedText : generatedText,
      rekomendasi: currentRecommendations,
      formData: { ...formData }
    };

    onSaveMessage(newSaved);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDownloadWord = () => {
    const blob = generateWordDocument(
      `Laporan_${formData.namaPanggilan}_${formData.periodeLaporan}`,
      reportSections,
      teacherProfile,
      formData.namaSiswa,
      formData.kelas
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_${formData.namaPanggilan}_${formData.periodeLaporan.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Reset seluruh formulir ke pengaturan awal?')) {
      setFormData({
        ...DEFAULT_FORM_DATA,
        tanggalKomunikasi: new Date().toISOString().split('T')[0]
      });
      setTimeout(() => runGeneration(), 100);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Penyusun Pesan &amp; Laporan Perkembangan Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih data perkembangan ananda, lalu tekan &quot;GENERATE PESAN&quot; untuk menghasilkan narasi edukatif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset data formulir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={runGeneration}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            GENERATE PESAN
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Form (60%) / Right Output Preview (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT SIDE: FORM SECTIONS (Col 7) ================= */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Form Tabs Nav */}
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveFormTab('siswa')}
              className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeFormTab === 'siswa'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              1. Identitas &amp; Jenis Pesan
            </button>
            <button
              onClick={() => setActiveFormTab('perkembangan')}
              className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeFormTab === 'perkembangan'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              2. Capaian &amp; Perilaku
            </button>
            <button
              onClick={() => setActiveFormTab('potensi')}
              className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeFormTab === 'potensi'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              3. Kekuatan &amp; Evaluasi
            </button>
            <button
              onClick={() => setActiveFormTab('format')}
              className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeFormTab === 'format'
                  ? 'border-teal-700 text-teal-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              4. Gaya &amp; Perbandingan
            </button>
          </div>

          {/* TAB 1: DATA SISWA & JENIS KOMUNIKASI */}
          {activeFormTab === 'siswa' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-700" />
                  Identitas Siswa &amp; Orang Tua
                </span>
                <span className="text-[11px] text-slate-400">
                  Data otomatis mengisi salam pesan
                </span>
              </div>

              {/* Quick Pick From Student Bank */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Cepat dari Bank Siswa
                </label>
                <select
                  value={formData.siswaId}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-teal-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      Absen {s.nomorAbsen} - {s.namaLengkap} ({s.kelas})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    value={formData.namaSiswa}
                    onChange={(e) => setFormData({ ...formData, namaSiswa: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nama Panggilan (Digunakan dalam narasi) *
                  </label>
                  <input
                    type="text"
                    value={formData.namaPanggilan}
                    onChange={(e) => setFormData({ ...formData, namaPanggilan: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kelas / Rombel
                  </label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nomor Absen
                  </label>
                  <input
                    type="number"
                    value={formData.nomorAbsen}
                    onChange={(e) => setFormData({ ...formData, nomorAbsen: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={formData.namaOrtu}
                    onChange={(e) => setFormData({ ...formData, namaOrtu: e.target.value })}
                    placeholder="Bapak/Ibu ..."
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    No. WhatsApp Orang Tua
                  </label>
                  <input
                    type="text"
                    value={formData.nomorHpOrtu}
                    onChange={(e) => setFormData({ ...formData, nomorHpOrtu: e.target.value })}
                    placeholder="0812xxxxxxxx"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Periode Laporan *
                  </label>
                  <input
                    type="text"
                    value={formData.periodeLaporan}
                    onChange={(e) => setFormData({ ...formData, periodeLaporan: e.target.value })}
                    placeholder="Contoh: September 2026 / Tengah Semester Ganjil"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tanggal Komunikasi
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalKomunikasi}
                    onChange={(e) => setFormData({ ...formData, tanggalKomunikasi: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* 3. JENIS KOMUNIKASI */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Fokus Jenis Komunikasi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {COMMUNICATION_TYPES.map((type) => {
                    const active = formData.jenisKomunikasi === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, jenisKomunikasi: type.id })}
                        className={`p-2 rounded-lg border text-left transition-colors cursor-pointer text-xs ${
                          active
                            ? 'bg-teal-50/70 border-teal-700 text-teal-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block">{type.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal block truncate">
                          {type.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Jika jenis undangan */}
              {formData.jenisKomunikasi === 'undangan' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2 text-xs">
                  <span className="font-bold text-amber-900 block">Detail Undangan Komunikasi Tatap Muka:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-amber-800">Waktu &amp; Tanggal</label>
                      <input
                        type="text"
                        value={formData.waktuUndangan || ''}
                        onChange={(e) => setFormData({ ...formData, waktuUndangan: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-amber-800">Tempat</label>
                      <input
                        type="text"
                        value={formData.tempatUndangan || ''}
                        onChange={(e) => setFormData({ ...formData, tempatUndangan: e.target.value })}
                        className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('perkembangan')}
                  className="px-4 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                >
                  Lanjut ke Capaian &amp; Perilaku →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INPUT PERKEMBANGAN SISWA (Akademik, Sikap, Presensi, Keaktifan, Tugas) */}
          {activeFormTab === 'perkembangan' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
              
              {/* A. PERKEMBANGAN AKADEMIK */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-teal-700" />
                    A. Perkembangan Akademik
                  </span>
                  <span className="text-[11px] text-slate-400">Pencapaian belajar</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Capaian Tingkat Akademik:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {ACADEMIC_LEVELS.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, akademikLevel: lvl })}
                        className={`px-2.5 py-1.5 text-xs rounded border text-left transition-colors cursor-pointer ${
                          formData.akademikLevel === lvl
                            ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Mata Pelajaran / Topik Bahasan
                    </label>
                    <input
                      type="text"
                      value={formData.mataPelajaranTopik}
                      onChange={(e) => setFormData({ ...formData, mataPelajaranTopik: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Nilai / Kategori Nilai
                    </label>
                    <input
                      type="text"
                      value={formData.nilaiPencapaian}
                      onChange={(e) => setFormData({ ...formData, nilaiPencapaian: e.target.value })}
                      placeholder="Contoh: 85 (Tuntas) / Sangat Memuaskan"
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Kekuatan Akademik Siswa
                    </label>
                    <input
                      type="text"
                      value={formData.kekuatanAkademik}
                      onChange={(e) => setFormData({ ...formData, kekuatanAkademik: e.target.value })}
                      placeholder="Misal: Menyusun argumen terstruktur..."
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      Kesulitan yang Ditemukan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={formData.kesulitanDitemukan}
                      onChange={(e) => setFormData({ ...formData, kesulitanDitemukan: e.target.value })}
                      placeholder="Misal: Memerlukan waktu dalam analisis rumus..."
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* B. SIKAP DAN PERILAKU */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-teal-700" />
                    B. Sikap &amp; Profil Karakter
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tingkat Sikap Umum:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {ATTITUDE_LEVELS.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, sikapLevel: lvl })}
                        className={`px-2 py-1.5 text-xs rounded border text-center transition-colors cursor-pointer ${
                          formData.sikapLevel === lvl
                            ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Aspek Karakter yang Menonjol (Pilih beberapa):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ATTITUDE_ASPECTS.map((asp) => {
                      const active = formData.aspekSikapTerpilih.includes(asp);
                      return (
                        <button
                          key={asp}
                          type="button"
                          onClick={() => toggleAttitudeAspect(asp)}
                          className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                            active
                              ? 'bg-teal-100 text-teal-900 border border-teal-300 font-semibold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}{asp}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* C. KEHADIRAN */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-700" />
                    C. Kehadiran &amp; Presensi
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Hadir (Hari)</label>
                    <input
                      type="number"
                      value={formData.kehadiran.hadir}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kehadiran: { ...formData.kehadiran, hadir: Number(e.target.value) || 0 }
                        })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Sakit</label>
                    <input
                      type="number"
                      value={formData.kehadiran.sakit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kehadiran: { ...formData.kehadiran, sakit: Number(e.target.value) || 0 }
                        })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Izin</label>
                    <input
                      type="number"
                      value={formData.kehadiran.izin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kehadiran: { ...formData.kehadiran, izin: Number(e.target.value) || 0 }
                        })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 mb-0.5">Tanpa Keterangan</label>
                    <input
                      type="number"
                      value={formData.kehadiran.alpa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kehadiran: { ...formData.kehadiran, alpa: Number(e.target.value) || 0 }
                        })
                      }
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* D. KEAKTIFAN */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block">
                  D. Keaktifan di Kelas
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {ACTIVITY_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, keaktifanLevel: lvl })}
                      className={`px-2 py-1.5 text-xs rounded border text-center transition-colors cursor-pointer ${
                        formData.keaktifanLevel === lvl
                          ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Aktivitas yang Diikuti:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ACTIVITY_ASPECTS.map((asp) => {
                      const active = formData.aspekKeaktifanTerpilih.includes(asp);
                      return (
                        <button
                          key={asp}
                          type="button"
                          onClick={() => toggleActivityAspect(asp)}
                          className={`px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                            active
                              ? 'bg-teal-100 text-teal-900 border border-teal-300 font-semibold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}{asp}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* E. TUGAS */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block">
                  E. Konsistensi Pengumpulan Tugas
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {ASSIGNMENT_LEVELS.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, tugasLevel: lvl })}
                      className={`px-2.5 py-1.5 text-xs rounded border text-left transition-colors cursor-pointer ${
                        formData.tugasLevel === lvl
                          ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('siswa')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Kembali ke Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('potensi')}
                  className="px-4 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                >
                  Lanjut ke Kekuatan &amp; Catatan →
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: KEKUATAN & HAL YANG PERLU DIKEMBANGKAN */}
          {activeFormTab === 'potensi' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
              
              {/* 5. KEKUATAN DAN POTENSI SISWA */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    5. Kekuatan &amp; Potensi Siswa (Pilih beberapa)
                  </span>
                  <span className="text-[11px] text-teal-700 font-medium">
                    {formData.kekuatanTerpilih.length} dipilih
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {STRENGTH_OPTIONS.map((str) => {
                    const active = formData.kekuatanTerpilih.includes(str);
                    return (
                      <button
                        key={str}
                        type="button"
                        onClick={() => toggleStrength(str)}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                          active
                            ? 'bg-teal-100 text-teal-900 border border-teal-400 font-semibold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{str}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kekuatan atau Potensi Lain:
                  </label>
                  <input
                    type="text"
                    value={formData.kekuatanLain}
                    onChange={(e) => setFormData({ ...formData, kekuatanLain: e.target.value })}
                    placeholder="Contoh: Sangat berbakat dalam mendesain materi visual..."
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* 6. HAL YANG PERLU DIKEMBANGKAN */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    6. Hal yang Perlu Dikembangkan (Bahasa Membangun)
                  </span>
                  <span className="text-[11px] text-amber-700 font-medium">
                    {formData.perluDikembangkanTerpilih.length} dipilih
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3">
                  {AREAS_TO_DEVELOP.map((area) => {
                    const active = formData.perluDikembangkanTerpilih.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArea(area)}
                        className={`px-2 py-1.5 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                          active
                            ? 'bg-amber-50 text-amber-900 border-amber-400 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {active ? '● ' : '○ '}{area}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Catatan Personal Guru (Otomatis disanitasi dari kata merendahkan):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.catatanGuru}
                    onChange={(e) => setFormData({ ...formData, catatanGuru: e.target.value })}
                    placeholder="Contoh: Menunjukkan potensi yang baik dan selalu bersikap santun saat diajak berdiskusi..."
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('perkembangan')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Kembali ke Capaian
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('format')}
                  className="px-4 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                >
                  Lanjut ke Gaya &amp; Perbandingan →
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: GAYA BAHASA, PANJANG PESAN, & PERBANDINGAN PERKEMBANGAN */}
          {activeFormTab === 'format' && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
              
              {/* 8. PILIHAN GAYA BAHASA */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  8. Pilihan Gaya Bahasa Narasi
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TONE_STYLES.map((t) => {
                    const active = formData.gayaBahasa === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, gayaBahasa: t.id })}
                        className={`p-2 rounded-lg border text-left transition-colors cursor-pointer text-xs ${
                          active
                            ? 'bg-teal-50/80 border-teal-700 text-teal-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block">{t.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal block truncate">
                          {t.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 9. PANJANG PESAN */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  9. Panjang Pesan
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'singkat' as const, label: 'Singkat', desc: '3–5 kalimat' },
                    { id: 'sedang' as const, label: 'Sedang', desc: '1–2 paragraf' },
                    { id: 'lengkap' as const, label: 'Lengkap', desc: '3–5 paragraf' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, panjangPesan: p.id })}
                      className={`p-2 rounded-lg border text-center transition-colors cursor-pointer text-xs ${
                        formData.panjangPesan === p.id
                          ? 'bg-teal-700 text-white border-teal-700 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block font-semibold">{p.label}</span>
                      <span className="text-[10px] opacity-80 block">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 13. FITUR PERBANDINGAN PERKEMBANGAN */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-teal-700" />
                    13. Bandingkan Perkembangan (Periode Lalu vs Sekarang)
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.modePerbandingan}
                      onChange={(e) => setFormData({ ...formData, modePerbandingan: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-700" />
                  </label>
                </div>

                {formData.modePerbandingan && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Periode Sebelumnya
                      </label>
                      <input
                        type="text"
                        value={formData.periodeLalu}
                        onChange={(e) => setFormData({ ...formData, periodeLalu: e.target.value })}
                        placeholder="Contoh: Bulan Agustus 2026 / Semester Lalu"
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Kondisi / Catatan Evaluatif Lalu
                      </label>
                      <input
                        type="text"
                        value={formData.catatanPerkembanganLalu}
                        onChange={(e) => setFormData({ ...formData, catatanPerkembanganLalu: e.target.value })}
                        placeholder="Contoh: Masih sering ragu berpendapat di depan kelas..."
                        className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Big Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={runGeneration}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  GENERATE PESAN SEKARANG
                </button>
              </div>

            </div>
          )}

        </div>

        {/* ================= RIGHT SIDE: OUTPUT PREVIEW & POLISH (Col 5) ================= */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
            
            {/* Header Tabs for Output */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  onClick={() => setPreviewTab('narasi')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    previewTab === 'narasi'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pesan Siap Kirim
                </button>
                <button
                  onClick={() => setPreviewTab('wa')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    previewTab === 'wa'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Format WhatsApp
                </button>
                <button
                  onClick={() => setPreviewTab('rekomendasi')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    previewTab === 'rekomendasi'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Rekomendasi ({currentRecommendations.length})
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleModify('regenerasi')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                  title="Regenerasi Narasi"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Output Text Body */}
            <div className="p-4 flex-1">
              
              {previewTab === 'narasi' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Narasi untuk Orang Tua ({formData.namaPanggilan})</span>
                    <span>Teks dapat langsung diedit di bawah:</span>
                  </div>
                  <textarea
                    rows={12}
                    value={generatedText}
                    onChange={(e) => setGeneratedText(e.target.value)}
                    className="w-full text-xs text-slate-800 leading-relaxed p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:bg-white resize-y font-sans"
                  />
                </div>
              )}

              {previewTab === 'wa' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Format WhatsApp Khusus (*Tebal*, Poin Rapi)</span>
                    <span className="text-teal-700 font-medium">Siap disalin ke WA</span>
                  </div>
                  <textarea
                    rows={12}
                    value={waFormattedText}
                    onChange={(e) => setWaFormattedText(e.target.value)}
                    className="w-full text-xs text-slate-800 leading-relaxed p-3 bg-emerald-50/30 border border-emerald-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:bg-white resize-y font-sans"
                  />
                </div>
              )}

              {previewTab === 'rekomendasi' && (
                <div className="space-y-3 py-1">
                  <div className="text-xs font-bold text-slate-800">
                    12. Rekomendasi Tindak Lanjut Otomatis:
                  </div>
                  <div className="space-y-2">
                    {currentRecommendations.map((rek, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed flex items-start gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span>{rek}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Rekomendasi di atas telah disesuaikan secara otomatis berdasarkan aspek belajar siswa yang dipilih.
                  </p>
                </div>
              )}

            </div>

            {/* 14. FITUR REVISI NARASI (Quick Polish Buttons) */}
            <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                14. Fitur Revisi &amp; Penyesuaian Narasi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleModify('perbaiki_bahasa')}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Perbaiki Bahasa
                </button>
                <button
                  type="button"
                  onClick={() => handleModify('lebih_singkat')}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Lebih Singkat
                </button>
                <button
                  type="button"
                  onClick={() => handleModify('lebih_formal')}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Lebih Formal
                </button>
                <button
                  type="button"
                  onClick={() => handleModify('lebih_ramah')}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Lebih Ramah
                </button>
                <button
                  type="button"
                  onClick={() => handleModify('lebih_positif')}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Lebih Positif
                </button>
                <button
                  type="button"
                  onClick={() => handleModify('versi_wa')}
                  className="px-2 py-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Versi WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => handleModify('versi_laporan')}
                  className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Versi Laporan
                </button>
              </div>
            </div>

            {/* 16. FITUR EKSPOR ACTION BAR */}
            <div className="p-4 border-t border-slate-200 bg-white space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      previewTab === 'wa' ? waFormattedText : generatedText,
                      'pesan'
                    )
                  }
                  className="py-2 px-3 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedType === 'pesan' ? (
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedType === 'pesan' ? 'Tersalin!' : 'Salin Pesan'}
                </button>

                <button
                  type="button"
                  onClick={openWhatsAppDirect}
                  className="py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim via WhatsApp
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenFullReportModal(reportSections)}
                  className="py-1.5 px-2 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Lihat Laporan Lengkap Bagian A–K siap cetak"
                >
                  <Printer className="w-3 h-3" />
                  Cetak (A–K)
                </button>

                <button
                  type="button"
                  onClick={handleDownloadWord}
                  className="py-1.5 px-2 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Unduh berkas Word (.doc)"
                >
                  <Download className="w-3 h-3" />
                  Format Word
                </button>

                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  className="py-1.5 px-2 text-[11px] font-medium text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Simpan pesan ini ke riwayat"
                >
                  <BookmarkPlus className="w-3 h-3" />
                  {saveSuccess ? 'Tersimpan!' : 'Simpan Draft'}
                </button>
              </div>
            </div>

          </div>

          {/* Quick Guidance Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs">
            <span className="font-semibold text-slate-800 block mb-0.5">
              Prinsip Bahasa Berorientasi Solusi:
            </span>
            Setiap narasi dirancang tidak menghakimi siswa atau menyalahkan pihak keluarga. Anda dapat menyesuaikan teks langsung dalam kotak di atas sebelum disalin atau dikirimkan.
          </div>

        </div>

      </div>

    </div>
  );
};
