import React from 'react';
import { FullReportSection, TeacherProfile, Student } from '../types';
import { generateWordDocument } from '../utils/narrativeEngine';
import { X, Printer, Download, Copy, Check, FileText } from 'lucide-react';

interface ReportDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: FullReportSection[];
  profile: TeacherProfile;
  studentName: string;
  studentNick: string;
  kelas: string;
  periode: string;
}

export const ReportDocumentModal: React.FC<ReportDocumentModalProps> = ({
  isOpen,
  onClose,
  sections,
  profile,
  studentName,
  studentNick,
  kelas,
  periode
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    const blob = generateWordDocument(
      `Laporan_Perkembangan_${studentNick}_${periode.replace(/\s+/g, '_')}`,
      sections,
      profile,
      studentName,
      kelas
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Perkembangan_${studentNick}_${periode.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const fullText = sections
      .map((sec) => {
        const body = Array.isArray(sec.content)
          ? sec.content.map((c) => `• ${c}`).join('\n')
          : sec.content;
        return `${sec.code}. ${sec.title.toUpperCase()}\n${body}\n`;
      })
      .join('\n');

    const header = `LAPORAN PERKEMBANGAN PESERTA DIDIK\n${profile.namaSekolah}\nPeriode: ${periode}\nNama: ${studentName} (${kelas})\n${'='.repeat(40)}\n\n`;

    navigator.clipboard.writeText(header + fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Modal Controls Header (Hidden in print) */}
        <div className="no-print px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-700 text-white rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Laporan Perkembangan Lengkap (Bagian A–K)
              </h2>
              <p className="text-xs text-slate-500">
                Format resmi terstruktur siap cetak fisik, simpan PDF, atau unduh Word (.doc).
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin' : 'Salin Laporan'}
            </button>
            <button
              onClick={handleDownloadWord}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="Unduh format Microsoft Word"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Word (.doc)
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Cetak atau Simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Sheet Area */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900">
          
          {/* KOP SURAT SEKOLAH RESMI */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-950">
              {profile.namaSekolah}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {profile.alamatSekolah || 'Jalan Pendidikan'}{' '}
              {profile.nomorKomunikasi ? `• Telp/WA: ${profile.nomorKomunikasi}` : ''}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-700 mt-1">
              <span>Tahun Pelajaran: {profile.tahunPelajaran}</span>
              <span>•</span>
              <span>Semester: {profile.semester}</span>
            </div>
          </div>

          {/* JUDUL LAPORAN */}
          <div className="text-center mb-6">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider underline">
              Laporan Perkembangan dan Komunikasi Peserta Didik
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Periode Evaluasi: {periode}
            </p>
          </div>

          {/* TABEL DATA IDENTITAS UTAMA */}
          <div className="mb-6 border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-1/3 py-2 px-3 font-semibold bg-slate-50 text-slate-700 border-r border-slate-200">
                    Nama Peserta Didik
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {studentName} ({studentNick})
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-semibold bg-slate-50 text-slate-700 border-r border-slate-200">
                    Kelas / Rombel
                  </td>
                  <td className="py-2 px-3 text-slate-800">
                    {kelas}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-2 px-3 font-semibold bg-slate-50 text-slate-700 border-r border-slate-200">
                    Guru Pengampu / Wali Kelas
                  </td>
                  <td className="py-2 px-3 text-slate-800">
                    {profile.namaGuru}{profile.gelar ? ', ' + profile.gelar : ''} ({profile.mataPelajaran})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECTIONS A - K */}
          <div className="space-y-4 text-xs leading-relaxed">
            {sections.map((section) => (
              <div key={section.code} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3.5 py-1.5 font-bold text-slate-800 border-b border-slate-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-800 text-white inline-flex items-center justify-center text-[10px]">
                    {section.code}
                  </span>
                  <span>{section.title}</span>
                </div>
                <div className="p-3 bg-white text-slate-800">
                  {Array.isArray(section.content) ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {section.content.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="whitespace-pre-line">{section.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TANDA TANGAN (KEMITRAAN SEKOLAH & KELUARGA) */}
          <div className="mt-10 pt-6 grid grid-cols-2 text-xs text-center border-t border-slate-200">
            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-semibold text-slate-800">Orang Tua / Wali Murid</p>
              <div className="h-20" />
              <p className="font-medium text-slate-800">( .................................................. )</p>
            </div>
            <div>
              <p className="text-slate-600">
                {profile.kotaSekolah || 'Sekolah'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="font-semibold text-slate-800">Guru Mata Pelajaran / Wali Kelas</p>
              <div className="h-20 flex items-center justify-center">
                <span className="text-[10px] text-slate-300 italic no-print">[Tanda tangan digital/basah]</span>
              </div>
              <p className="font-bold text-slate-900 underline">
                {profile.namaGuru}{profile.gelar ? ', ' + profile.gelar : ''}
              </p>
              <p className="text-[11px] text-slate-500">NIP: {profile.nip || '-'}</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="no-print px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Tip: Untuk menyimpan sebagai PDF, klik tombol Cetak lalu pilih &quot;Save as PDF / Simpan sebagai PDF&quot;.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
