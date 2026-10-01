export interface TeacherProfile {
  namaGuru: string;
  gelar: string;
  nip: string;
  namaSekolah: string;
  mataPelajaran: string;
  kelasUtama: string;
  semester: string;
  tahunPelajaran: string;
  namaWaliKelas: string;
  nomorKomunikasi: string;
  alamatSekolah?: string;
  kotaSekolah?: string;
}

export interface Student {
  id: string;
  namaLengkap: string;
  namaPanggilan: string;
  kelas: string;
  nomorAbsen: number;
  namaOrtu: string;
  nomorHpOrtu: string;
  catatanKhusus?: string;
}

export type CommunicationCategory =
  | 'akademik'
  | 'sikap'
  | 'kehadiran'
  | 'kedisiplinan'
  | 'keaktifan'
  | 'tugas'
  | 'sosial'
  | 'prestasi'
  | 'perhatian'
  | 'apresiasi'
  | 'undangan'
  | 'laporan_berkala'
  | 'pesan_khusus'
  | 'kombinasi';

export type AcademicLevel =
  | 'Sangat baik'
  | 'Baik'
  | 'Berkembang sesuai harapan'
  | 'Perlu bimbingan'
  | 'Perlu perhatian khusus';

export type AttitudeLevel =
  | 'Sangat baik'
  | 'Baik'
  | 'Cukup'
  | 'Perlu penguatan';

export type ActivityLevel =
  | 'Sangat aktif'
  | 'Aktif'
  | 'Cukup aktif'
  | 'Masih perlu didorong';

export type AssignmentLevel =
  | 'Selalu mengumpulkan tepat waktu'
  | 'Umumnya tepat waktu'
  | 'Beberapa kali terlambat'
  | 'Masih perlu pendampingan'
  | 'Belum konsisten';

export type ToneStyle =
  | 'formal'
  | 'formal-hangat'
  | 'ramah-komunikatif'
  | 'singkat-langsung'
  | 'ringkas-wa'
  | 'laporan-resmi';

export type MessageLength = 'singkat' | 'sedang' | 'lengkap';

export interface AttendanceData {
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  keterangan: string;
}

export interface ProgressFormData {
  // Siswa
  siswaId: string;
  namaSiswa: string;
  namaPanggilan: string;
  kelas: string;
  nomorAbsen: number | string;
  namaOrtu: string;
  nomorHpOrtu: string;
  periodeLaporan: string;
  tanggalKomunikasi: string;

  // Jenis
  jenisKomunikasi: CommunicationCategory;

  // Akademik
  akademikLevel: AcademicLevel;
  mataPelajaranTopik: string;
  nilaiPencapaian: string;
  kekuatanAkademik: string;
  kesulitanDitemukan: string;
  perkembanganSebelumnya: string;

  // Sikap & Perilaku
  sikapLevel: AttitudeLevel;
  aspekSikapTerpilih: string[];

  // Kehadiran
  kehadiran: AttendanceData;

  // Keaktifan
  keaktifanLevel: ActivityLevel;
  aspekKeaktifanTerpilih: string[];

  // Tugas
  tugasLevel: AssignmentLevel;

  // Kekuatan & Potensi
  kekuatanTerpilih: string[];
  kekuatanLain: string;

  // Hal yang perlu dikembangkan
  perluDikembangkanTerpilih: string[];
  catatanGuru: string;

  // Undangan / Khusus
  keperluanUndangan?: string;
  waktuUndangan?: string;
  tempatUndangan?: string;

  // Format
  gayaBahasa: ToneStyle;
  panjangPesan: MessageLength;

  // Perbandingan (opsional)
  modePerbandingan: boolean;
  periodeLalu: string;
  catatanPerkembanganLalu: string;
}

export interface SavedMessage {
  id: string;
  timestamp: string;
  tanggal: string;
  siswaNama: string;
  siswaId?: string;
  kelas: string;
  namaOrtu: string;
  nomorHpOrtu: string;
  jenisKomunikasi: CommunicationCategory;
  gayaBahasa: ToneStyle;
  panjangPesan: MessageLength;
  isiNarasi: string;
  rekomendasi: string[];
  formData: ProgressFormData;
}

export interface FullReportSection {
  title: string;
  code: string;
  content: string | string[];
}
