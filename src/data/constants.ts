import {
  CommunicationCategory,
  AcademicLevel,
  AttitudeLevel,
  ActivityLevel,
  AssignmentLevel,
  ToneStyle,
  TeacherProfile,
  Student,
  ProgressFormData
} from '../types';

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  namaGuru: 'Sri Wahyuni',
  gelar: 'S.Pd., M.Pd.',
  nip: '19840512 200801 2 009',
  namaSekolah: 'SMA Negeri 1 Popayato',
  mataPelajaran: 'Bahasa Indonesia & Wali Kelas',
  kelasUtama: 'XI-F (Kurikulum Merdeka)',
  semester: 'Ganjil',
  tahunPelajaran: '2026/2027',
  namaWaliKelas: 'Sri Wahyuni, S.Pd., M.Pd.',
  nomorKomunikasi: '0812-3456-7890',
  alamatSekolah: 'Jl. Trans Sulawesi, Popayato, Kab. Pohuwato, Gorontalo',
  kotaSekolah: 'Popayato'
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    namaLengkap: 'Andi Pratama Putra',
    namaPanggilan: 'Andi',
    kelas: 'XI-F',
    nomorAbsen: 3,
    namaOrtu: 'Bapak Hartono & Ibu Dewi',
    nomorHpOrtu: '081345678901',
    catatanKhusus: 'Siswa aktif berorganisasi OSIS, potensi kepemimpinan tinggi.'
  },
  {
    id: 'std-2',
    namaLengkap: 'Siti Nurhaliza Rahman',
    namaPanggilan: 'Siti',
    kelas: 'XI-F',
    nomorAbsen: 28,
    namaOrtu: 'Ibu Rahmawati',
    nomorHpOrtu: '082198765432',
    catatanKhusus: 'Teliti dan berprestasi di bidang literasi dan karya tulis ilmiah.'
  },
  {
    id: 'std-3',
    namaLengkap: 'Budi Santoso',
    namaPanggilan: 'Budi',
    kelas: 'XI-F',
    nomorAbsen: 7,
    namaOrtu: 'Bapak Slamet Santoso',
    nomorHpOrtu: '085211223344',
    catatanKhusus: 'Gemari kegiatan praktik sains dan olahraga basket.'
  },
  {
    id: 'std-4',
    namaLengkap: 'Rina Maharani',
    namaPanggilan: 'Rina',
    kelas: 'XI-F',
    nomorAbsen: 24,
    namaOrtu: 'Bapak Hendra & Ibu Maya',
    nomorHpOrtu: '087855443322',
    catatanKhusus: 'Sangat sopan, tekun, dan menunjukkan peningkatan pemahaman materi.'
  },
  {
    id: 'std-5',
    namaLengkap: 'Muhammad Fajar Alfian',
    namaPanggilan: 'Fajar',
    kelas: 'XI-F',
    nomorAbsen: 18,
    namaOrtu: 'Bapak Rusdi Alfian',
    nomorHpOrtu: '081299887766',
    catatanKhusus: 'Kreatif dan mahir dalam presentasi dan desain multimedia.'
  }
];

export const COMMUNICATION_TYPES: { id: CommunicationCategory; label: string; desc: string }[] = [
  { id: 'kombinasi', label: 'Laporan Perkembangan Komprehensif', desc: 'Merangkum akademik, sikap, keaktifan, dan rekomendasi' },
  { id: 'akademik', label: 'Perkembangan Akademik', desc: 'Fokus pada capaian materi, pemahaman, dan nilai siswa' },
  { id: 'sikap', label: 'Perkembangan Sikap & Karakter', desc: 'Fokus pada profil karakter, kesopanan, dan budi pekerti' },
  { id: 'kehadiran', label: 'Kehadiran & Presensi', desc: 'Informasi jumlah hadir, izin, sakit, atau ketidakhadiran' },
  { id: 'kedisiplinan', label: 'Kedisiplinan Sekolah', desc: 'Ketepatan waktu datang, seragam, dan tata tertib' },
  { id: 'keaktifan', label: 'Keaktifan di Kelas', desc: 'Partisipasi dalam diskusi, bertanya, dan kolaborasi tim' },
  { id: 'tugas', label: 'Tugas dan Tanggung Jawab', desc: 'Konsistensi dan ketepatan penyelesaian tugas belajar' },
  { id: 'sosial', label: 'Perkembangan Sosial', desc: 'Hubungan pertemanan, empati, dan gotong royong' },
  { id: 'prestasi', label: 'Potensi & Prestasi Siswa', desc: 'Apresiasi keikutsertaan lomba atau bakat istimewa' },
  { id: 'perhatian', label: 'Hal Perlu Mendapat Perhatian', desc: 'Aspek yang memerlukan pendampingan bersama orang tua' },
  { id: 'apresiasi', label: 'Apresiasi Khusus kepada Siswa', desc: 'Pujian atas kemajuan dan kegigihan belajar' },
  { id: 'undangan', label: 'Undangan Komunikasi Orang Tua', desc: 'Ajakan konsultasi tatap muka atau pertemuan sekolah' },
  { id: 'laporan_berkala', label: 'Laporan Berkala Bulanan/Tengah Semester', desc: 'Rangkuman catatan berkala proses belajar' },
  { id: 'pesan_khusus', label: 'Pesan Khusus Wali Kelas / Guru', desc: 'Catatan personal edukatif langsung dari pengajar' }
];

export const ACADEMIC_LEVELS: AcademicLevel[] = [
  'Sangat baik',
  'Baik',
  'Berkembang sesuai harapan',
  'Perlu bimbingan',
  'Perlu perhatian khusus'
];

export const ATTITUDE_LEVELS: AttitudeLevel[] = [
  'Sangat baik',
  'Baik',
  'Cukup',
  'Perlu penguatan'
];

export const ATTITUDE_ASPECTS: string[] = [
  'Tanggung jawab',
  'Kejujuran',
  'Kedisiplinan',
  'Kesopanan',
  'Kerja sama',
  'Kemandirian',
  'Kepedulian'
];

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  'Sangat aktif',
  'Aktif',
  'Cukup aktif',
  'Masih perlu didorong'
];

export const ACTIVITY_ASPECTS: string[] = [
  'Bertanya',
  'Menjawab',
  'Diskusi',
  'Presentasi',
  'Kerja kelompok',
  'Praktik'
];

export const ASSIGNMENT_LEVELS: AssignmentLevel[] = [
  'Selalu mengumpulkan tepat waktu',
  'Umumnya tepat waktu',
  'Beberapa kali terlambat',
  'Masih perlu pendampingan',
  'Belum konsisten'
];

export const STRENGTH_OPTIONS: string[] = [
  'Cepat memahami materi',
  'Teliti',
  'Kreatif',
  'Aktif bertanya',
  'Mampu bekerja sama',
  'Mandiri',
  'Bertanggung jawab',
  'Memiliki kemampuan komunikasi yang baik',
  'Memiliki kemampuan memecahkan masalah',
  'Memiliki potensi akademik',
  'Memiliki potensi nonakademik',
  'Menunjukkan perkembangan positif'
];

export const AREAS_TO_DEVELOP: string[] = [
  'Konsentrasi belajar',
  'Kedisiplinan',
  'Pengumpulan tugas',
  'Keaktifan',
  'Pemahaman materi',
  'Manajemen waktu',
  'Kepercayaan diri',
  'Kerja sama',
  'Kemandirian',
  'Kehadiran',
  'Tanggung jawab'
];

export const TONE_STYLES: { id: ToneStyle; label: string; desc: string }[] = [
  { id: 'formal-hangat', label: 'Formal tetapi Hangat', desc: 'Rekomendasi terbaik: sopan, profesional, dan menaruh perhatian' },
  { id: 'formal', label: 'Formal Resmi', desc: 'Gaya dinas/kedinasan yang tertib dan baku' },
  { id: 'ramah-komunikatif', label: 'Ramah & Komunikatif', desc: 'Pendekatan luwes, bersahabat, dan membumi' },
  { id: 'singkat-langsung', label: 'Singkat & Langsung', desc: 'To-the-point, jelas tanpa berbasa-basi panjang' },
  { id: 'ringkas-wa', label: 'Sangat Ringkas untuk WhatsApp', desc: 'Format khusus pesan instan WA yang padat makna' },
  { id: 'laporan-resmi', label: 'Narasi Laporan Resmi', desc: 'Gaya deskripsi rapor/catatan perkembangan kurikulum' }
];

export const RECOMMENDATION_MAP: Record<string, string> = {
  'Keaktifan': 'Orang tua dapat memberikan kesempatan kepada siswa untuk menceritakan kembali hal menarik atau materi yang dipelajari di sekolah saat berada di rumah.',
  'Pengumpulan tugas': 'Orang tua dapat membantu siswa membuat jadwal sederhana di rumah untuk menyelesaikan tugas serta menyiapkan perlengkapan belajar sebelum hari pembelajaran.',
  'Pemahaman materi': 'Siswa disarankan melakukan latihan terbimbing secara bertahap dan tidak ragu untuk bertanya langsung kepada guru apabila menemukan materi yang belum dipahami.',
  'Konsentrasi belajar': 'Orang tua disarankan menciptakan suasana belajar yang kondusif di rumah dengan membatasi distraksi gawai saat jam belajar berlangsung.',
  'Kedisiplinan': 'Pihak keluarga dan sekolah dapat bersama-sama membiasakan siswa menepati jadwal tidur dan bangun pagi secara teratur demi kesiapan fisik di sekolah.',
  'Manajemen waktu': 'Siswa dibimbing membuat catatan agenda harian sederhana guna membagi porsi antara kegiatan sekolah, istirahat, dan hobi.',
  'Kepercayaan diri': 'Memberikan apresiasi terhadap setiap usaha kecil siswa agar ia semakin berani mengekspresikan gagasan dan bertanya di depan kelas.',
  'Kerja sama': 'Mendorong siswa untuk saling berbagi pendapat dengan teman kelompok dan belajar mendengarkan sudut pandang orang lain secara positif.',
  'Kemandirian': 'Memberikan tanggung jawab bertahap dalam mengelola buku pelajaran dan perlengkapan sekolah tanpa harus selalu diingatkan secara penuh.',
  'Kehadiran': 'Mendorong komitmen kehadiran tepat waktu dan segera menyampaikan pemberitahuan resmi kepada pihak sekolah apabila ada hal mendesak.',
  'Tanggung jawab': 'Membiasakan siswa untuk menuntaskan amanah belajar hingga tuntas sebelum beralih ke aktivitas rekreatif.'
};

export const DEFAULT_FORM_DATA: ProgressFormData = {
  siswaId: 'std-1',
  namaSiswa: 'Andi Pratama Putra',
  namaPanggilan: 'Andi',
  kelas: 'XI-F',
  nomorAbsen: 3,
  namaOrtu: 'Bapak Hartono & Ibu Dewi',
  nomorHpOrtu: '081345678901',
  periodeLaporan: 'September 2026',
  tanggalKomunikasi: new Date().toISOString().split('T')[0],

  jenisKomunikasi: 'kombinasi',

  akademikLevel: 'Baik',
  mataPelajaranTopik: 'Bahasa Indonesia (Teks Argumentasi & Kolaborasi)',
  nilaiPencapaian: '85 (Tuntas & Melampaui Kriteria)',
  kekuatanAkademik: 'Mampu menyusun gagasan terstruktur dan analitis',
  kesulitanDitemukan: '',
  perkembanganSebelumnya: 'Nilai dan pemahaman terus menunjukkan kurva peningkatan',

  sikapLevel: 'Baik',
  aspekSikapTerpilih: ['Tanggung jawab', 'Kesopanan', 'Kerja sama'],

  kehadiran: {
    hadir: 20,
    sakit: 0,
    izin: 1,
    alpa: 0,
    keterangan: 'Tingkat kehadiran 95%, sangat teratur'
  },

  keaktifanLevel: 'Aktif',
  aspekKeaktifanTerpilih: ['Bertanya', 'Diskusi', 'Kerja kelompok'],

  tugasLevel: 'Umumnya tepat waktu',

  kekuatanTerpilih: ['Aktif bertanya', 'Mampu bekerja sama', 'Menunjukkan perkembangan positif'],
  kekuatanLain: 'Memiliki kepedulian tinggi terhadap dinamika kerja kelompok',

  perluDikembangkanTerpilih: ['Pengumpulan tugas'],
  catatanGuru: 'Andi memiliki potensi belajar yang sangat baik dan selalu menunjukkan itikad positif dalam setiap pertemuan.',

  keperluanUndangan: 'Konsultasi berkala perkembangan belajar dan persiapan program magang/proyek',
  waktuUndangan: 'Senin, 05 Oktober 2026 pukul 09.30 WIB',
  tempatUndangan: 'Ruang Guru / BK SMAN 1 Popayato',

  gayaBahasa: 'formal-hangat',
  panjangPesan: 'sedang',

  modePerbandingan: false,
  periodeLalu: 'Agustus 2026',
  catatanPerkembanganLalu: 'Saat itu masih sering ragu untuk mengemukakan pendapat di hadapan forum kelas.'
};
