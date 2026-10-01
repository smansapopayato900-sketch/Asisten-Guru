import {
  ProgressFormData,
  TeacherProfile,
  FullReportSection,
  ToneStyle
} from '../types';
import { RECOMMENDATION_MAP } from '../data/constants';

/**
 * Filter out negative labels and ensure positive educational phrasing
 */
export function sanitizePedagogicalText(text: string): string {
  if (!text) return '';
  let cleaned = text;

  const replacements: [RegExp, string][] = [
    [/anak malas/gi, 'memerlukan dorongan konsistensi belajar'],
    [/malas belajar/gi, 'sedang membangun kebiasaan belajar yang teratur'],
    [/malas/gi, 'masih memerlukan penguatan motivasi'],
    [/anak nakal/gi, 'peserta didik yang aktif dan membutuhkan penyaluran energi positif'],
    [/nakal/gi, 'memerlukan pendampingan perilaku'],
    [/bodoh/gi, 'memerlukan bimbingan bertahap'],
    [/tidak mampu/gi, 'masih berproses memahami materi secara mandiri'],
    [/tidak punya motivasi/gi, 'memerlukan stimulasi minat belajar'],
    [/susah diatur/gi, 'memerlukan komunikasi yang lebih personal dan terarah'],
    [/suka membantah/gi, 'memiliki keberanian berpendapat yang perlu diarahkan secara santun'],
    [/tidak peduli/gi, 'sedang belajar membangun rasa empati dan kepedulian'],
    [/lambat sekali/gi, 'membutuhkan tempo belajar yang lebih bertahap'],
  ];

  for (const [pattern, replacement] of replacements) {
    cleaned = cleaned.replace(pattern, replacement);
  }

  return cleaned;
}

/**
 * Builds contextual recommendations for home and school collaboration
 */
export function buildRecommendations(formData: ProgressFormData): string[] {
  const recommendations: string[] = [];

  // Dari aspek yang perlu dikembangkan
  for (const item of formData.perluDikembangkanTerpilih) {
    if (RECOMMENDATION_MAP[item]) {
      recommendations.push(RECOMMENDATION_MAP[item]);
    }
  }

  // Dari keaktifan jika masih perlu didorong
  if (formData.keaktifanLevel === 'Masih perlu didorong' && !recommendations.some(r => r.includes('menceritakan'))) {
    recommendations.push('Orang tua dapat memberikan ruang aman di rumah bagi siswa untuk menceritakan gagasan pribadinya tanpa takut salah.');
  }

  // Dari tugas jika belum konsisten
  if (
    (formData.tugasLevel === 'Belum konsisten' || formData.tugasLevel === 'Masih perlu pendampingan') &&
    !recommendations.some(r => r.includes('jadwal'))
  ) {
    recommendations.push('Orang tua dapat membantu siswa menyusun pengingat atau checklist sederhana tugas sekolah sebelum istirahat malam.');
  }

  // Dari pemahaman akademik jika perlu bimbingan
  if (
    (formData.akademikLevel === 'Perlu bimbingan' || formData.akademikLevel === 'Perlu perhatian khusus') &&
    !recommendations.some(r => r.includes('latihan'))
  ) {
    recommendations.push('Siswa disarankan meluangkan waktu 15–20 menit setiap hari untuk mengulas ringkasan materi dan segera mengonfirmasi bagian yang sulit kepada guru.');
  }

  // Jika kondisi sangat baik
  if (
    (formData.akademikLevel === 'Sangat baik' || formData.akademikLevel === 'Baik') &&
    formData.perluDikembangkanTerpilih.length === 0
  ) {
    recommendations.push('Pertahankan kebiasaan belajar yang sudah sangat baik ini dan berikan apresiasi kepada siswa agar ia semakin termotivasi mengeksplorasi potensi dirinya.');
  }

  // Rekomendasi umum jika kosong
  if (recommendations.length === 0) {
    recommendations.push('Menjaga komunikasi hangat dan berkala antara orang tua dan wali kelas guna terus memantau kenyamanan dan perkembangan belajar siswa.');
  }

  return recommendations;
}

/**
 * Primary Generator function creating narrative and report sections
 */
export function generateNarrative(
  formData: ProgressFormData,
  profile: TeacherProfile
): {
  text: string;
  waText: string;
  recommendations: string[];
  reportSections: FullReportSection[];
} {
  const pName = formData.namaPanggilan || formData.namaSiswa.split(' ')[0] || 'Ananda';
  const fName = formData.namaSiswa;
  const ortu = formData.namaOrtu ? `Bapak/Ibu Orang Tua/Wali dari ${pName}` : `Bapak/Ibu Orang Tua/Wali ${pName}`;
  const recommendations = buildRecommendations(formData);

  // Kumpulan kekuatan
  const allStrengths = [...formData.kekuatanTerpilih];
  if (formData.kekuatanLain.trim()) {
    allStrengths.push(sanitizePedagogicalText(formData.kekuatanLain.trim()));
  }
  const strengthStr = allStrengths.length > 0
    ? allStrengths.slice(0, 3).join(', ')
    : 'menunjukkan semangat dan itikad belajar yang positif';

  // Kumpulan area berkembang
  const needDevelopStr = formData.perluDikembangkanTerpilih.length > 0
    ? formData.perluDikembangkanTerpilih.join(' dan ')
    : 'konsistensi dalam mempertahankan ritme belajar';

  // Subjek / Topik
  const topikStr = formData.mataPelajaranTopik ? ` pada mata pelajaran ${formData.mataPelajaranTopik}` : '';
  const nilaiStr = formData.nilaiPencapaian ? ` dengan capaian ${formData.nilaiPencapaian}` : '';

  // 1. SALAM PEMBUKA
  let salamPembuka = '';
  let salamPenutup = '';

  switch (formData.gayaBahasa) {
    case 'formal':
      salamPembuka = `Dengan hormat,\nKepada ${ortu},\nDi Tempat.`;
      salamPenutup = `Demikian pemberitahuan perkembangan ini kami sampaikan. Atas perhatian dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih.\n\nHormat kami,\n${profile.namaGuru}${profile.gelar ? ', ' + profile.gelar : ''}\n${profile.mataPelajaran ? profile.mataPelajaran + ' - ' : ''}${profile.namaSekolah}`;
      break;
    case 'ramah-komunikatif':
      salamPembuka = `Salam hangat dan salam sejahtera untuk ${ortu} di rumah.`;
      salamPenutup = `Terima kasih banyak atas ketulusan Bapak/Ibu mendampingi ${pName}. Semoga ${pName} senantiasa senang dan bersemangat menjalani hari-harinya di sekolah.\n\nSalam hangat dari kami,\nIbu/Bapak ${profile.namaGuru}\n${profile.namaSekolah}`;
      break;
    case 'singkat-langsung':
      salamPembuka = `Yth. ${ortu},`;
      salamPenutup = `Terima kasih atas perhatian dan kerja sama Bapak/Ibu.\n\nSalam,\n${profile.namaGuru} (${profile.namaSekolah})`;
      break;
    case 'ringkas-wa':
      salamPembuka = `Assalamu’alaikum Warahmatullahi Wabarakatuh / Salam Sejahtera,\n*Yth. ${ortu}*`;
      salamPenutup = `Terima kasih atas sinergi dan pendampingan Bapak/Ibu di rumah demi keberhasilan belajar *${pName}*.\n\nSalam hormat,\n*${profile.namaGuru}*\n${profile.namaSekolah}`;
      break;
    case 'laporan-resmi':
      salamPembuka = `CATATAN PERKEMBANGAN PESERTA DIDIK\nPeriode: ${formData.periodeLaporan}\nNama Siswa: ${fName} (Kelas ${formData.kelas})`;
      salamPenutup = `Laporan ini disusun sebagai wujud akuntabilitas dan kemitraan pendidikan antara pihak sekolah dan orang tua.\n\n${profile.kotaSekolah || 'Sekolah'}, ${formData.tanggalKomunikasi}\nGuru Pembimbing / Wali Kelas,\n\n(${profile.namaGuru}${profile.gelar ? ', ' + profile.gelar : ''})\nNIP: ${profile.nip || '-'}`;
      break;
    case 'formal-hangat':
    default:
      salamPembuka = `Assalamu’alaikum Warahmatullahi Wabarakatuh dan Salam Sejahtera,\nBapak/Ibu Orang Tua/Wali dari ${pName} yang kami hormati,`;
      salamPenutup = `Terima kasih atas kerja sama dan kepercayaan Bapak/Ibu dalam mendampingi tumbuh kembang serta proses belajar ${pName}. Semoga sinergi antara sekolah dan keluarga terus terjalin harmonis.\n\nSalam takzim,\n${profile.namaGuru}${profile.gelar ? ', ' + profile.gelar : ''}\n${profile.mataPelajaran || 'Wali Kelas'} - ${profile.namaSekolah}`;
      break;
  }

  // 2. PARAGRAF PERKEMBANGAN UMUM & IDENTITAS
  let paragrafUmum = '';
  if (formData.modePerbandingan && formData.periodeLalu) {
    paragrafUmum = `Melalui pesan ini, kami ingin menyampaikan laporan perkembangan belajar ${pName} selama periode ${formData.periodeLaporan}. Dibandingkan dengan periode sebelumnya (${formData.periodeLalu}), ${pName} menunjukkan perkembangan yang membanggakan, khususnya dalam hal kemauan belajar dan keterbukaan dalam berinteraksi.`;
    if (formData.catatanPerkembanganLalu) {
      paragrafUmum += ` Sebagai catatan evaluatif terdahulu, ${sanitizePedagogicalText(formData.catatanPerkembanganLalu)}, dan kini mulai memperlihatkan perbaikan yang nyata.`;
    }
  } else {
    paragrafUmum = `Melalui catatan ini, kami ingin berbagi informasi mengenai perkembangan ananda ${pName} selama periode ${formData.periodeLaporan}. Secara keseluruhan, ${pName} menunjukkan proses adaptasi dan pembelajaran yang baik di kelas. ${pName} adalah peserta didik yang ${strengthStr}.`;
  }

  // 3. PARAGRAF AKADEMIK & KEAKTIFAN
  let paragrafAkademik = '';
  const akademikTeks = {
    'Sangat baik': `menunjukkan penguasaan materi yang sangat memuaskan serta daya nalar kritis yang tinggi${topikStr}${nilaiStr}`,
    'Baik': `mampu memahami materi pembelajaran dengan baik dan mengikuti rangkaian pembelajaran secara runtut${topikStr}${nilaiStr}`,
    'Berkembang sesuai harapan': `telah mencapai kompetensi dasar yang ditargetkan dengan kemajuan yang stabil${topikStr}${nilaiStr}`,
    'Perlu bimbingan': `sedang terus berproses memahami konsep-konsep inti${topikStr} dan membutuhkan pendampingan terarah untuk memantapkan pemahaman`,
    'Perlu perhatian khusus': `memerlukan perhatian bersama secara intensif agar materi pembelajaran pokok${topikStr} dapat dipahami secara bertahap dan tidak tertinggal`
  }[formData.akademikLevel];

  const keaktifanTeks = {
    'Sangat aktif': `Di dalam kelas, ${pName} sangat aktif dalam ${formData.aspekKeaktifanTerpilih.join(', ') || 'berpartisipasi dan bertanya'}, serta kerap menjadi penggerak positif dalam kelompoknya.`,
    'Aktif': `Dalam keseharian di kelas, ${pName} tergolong aktif dalam ${formData.aspekKeaktifanTerpilih.join(', ') || 'kegiatan diskusi'}, mampu menyampaikan ide dengan percaya diri.`,
    'Cukup aktif': `Dalam kegiatan belajar, ${pName} cukup aktif mengikuti arahan serta kooperatif saat bekerja bersama teman-temannya.`,
    'Masih perlu didorong': `Dalam dinamika kelas, ${pName} masih memerlukan sedikit dorongan agar lebih percaya diri untuk mengemukakan pendapat dan bertanya ketika menghadapi hal yang belum dipahami.`
  }[formData.keaktifanLevel];

  paragrafAkademik = `Dalam aspek akademik, ${pName} ${akademikTeks}. ${keaktifanTeks}`;

  if (formData.kekuatanAkademik) {
    paragrafAkademik += ` Salah satu keunggulan ${pName} terlihat pada kemampuannya dalam ${sanitizePedagogicalText(formData.kekuatanAkademik)}.`;
  }

  // 4. PARAGRAF TUGAS & SIKAP & DISIPLIN
  let paragrafSikap = '';
  const tugasTeks = {
    'Selalu mengumpulkan tepat waktu': `memiliki tanggung jawab luar biasa dengan selalu menuntaskan dan mengumpulkan tugas tepat waktu`,
    'Umumnya tepat waktu': `pada umumnya menyelesaikan tugas pembelajaran dengan tertib dan tepat waktu`,
    'Beberapa kali terlambat': `sudah berusaha menuntaskan tugas, meskipun sesekali masih memerlukan pengingat terkait batas waktu pengumpulan`,
    'Masih perlu pendampingan': `masih memerlukan pendampingan agar ritme penyelesaian tugas belajar dapat lebih teratur`,
    'Belum konsisten': `sedang dalam proses membiasakan diri untuk lebih konsisten dalam menyelesaikan kewajiban tugas belajar`
  }[formData.tugasLevel];

  paragrafSikap = `Terkait sikap dan tanggung jawab, ${pName} ${tugasTeks}. Sikap ${formData.aspekSikapTerpilih.join(', ') || 'kesantunan dan kerja sama'} yang ditunjukkan ${pName} sehari-hari mencerminkan budi pekerti yang baik di lingkungan sekolah.`;

  // 5. PARAGRAF HAL YANG PERLU DIKEMBANGKAN & REKOMENDASI KERJA SAMA
  let paragrafPerkembangan = '';
  if (formData.perluDikembangkanTerpilih.length > 0) {
    paragrafPerkembangan = `Adapun aspek yang saat ini masih perlu kita kembangkan bersama adalah dalam hal ${needDevelopStr}. Kami meyakini dengan potensi yang dimiliki ${pName}, hal ini dapat ditingkatkan melalui pembiasaan yang berkelanjutan.`;
  } else {
    paragrafPerkembangan = `Untuk ke depannya, fokus kita adalah terus mengasah dan menjaga konsistensi prestasi serta kenyamanan belajar ${pName}.`;
  }

  // Tambahkan rekomendasi konkret
  if (recommendations.length > 0) {
    paragrafPerkembangan += ` Sebagai langkah pendampingan yang dapat dilakukan di rumah, ${recommendations[0].toLowerCase().startsWith('orang') ? recommendations[0] : 'kami menyarankan ' + recommendations[0]}`;
  }

  // Tambahkan catatan guru jika ada
  if (formData.catatanGuru.trim()) {
    paragrafPerkembangan += ` Catatan kami selaku pengajar: "${sanitizePedagogicalText(formData.catatanGuru.trim())}".`;
  }

  // Susun berdasarkan PANJANG PESAN
  let fullNarrative = '';

  if (formData.panjangPesan === 'singkat') {
    // 3-5 Kalimat
    fullNarrative = `${salamPembuka}\n\nKami menyampaikan perkembangan ${pName} selama periode ${formData.periodeLaporan}. Secara umum, ${pName} ${akademikTeks} dan ${formData.keaktifanLevel === 'Masih perlu didorong' ? 'sedang kita dorong untuk lebih aktif bertanya' : 'menunjukkan keaktifan yang baik di kelas'}.\n\nAspek yang masih perlu didampingi bersama adalah ${needDevelopStr}. ${recommendations[0] || 'Dukungan dari Bapak/Ibu di rumah sangat berarti bagi perkembangan ananda.'}\n\n${salamPenutup}`;
  } else if (formData.panjangPesan === 'sedang') {
    // 1-2 Paragraf
    fullNarrative = `${salamPembuka}\n\n${paragrafUmum} ${paragrafAkademik}\n\n${paragrafSikap} ${paragrafPerkembangan}\n\n${salamPenutup}`;
  } else {
    // Lengkap (3-5 paragraf)
    fullNarrative = `${salamPembuka}\n\n${paragrafUmum}\n\n${paragrafAkademik}\n\n${paragrafSikap}\n\n${paragrafPerkembangan}\n\nKami sangat mengapresiasi setiap langkah kemajuan yang dicapai oleh ${pName}. Mari bersama-sama kita berikan motivasi terbaik agar ${pName} tumbuh menjadi pribadi yang berilmu, mandiri, dan berkarakter mulia.\n\n${salamPenutup}`;
  }

  // Format khusus WhatsApp dengan tata letak visual rapi
  const waRekomenList = recommendations.slice(0, 3).map((r, i) => `  ${i + 1}. ${r}`).join('\n');
  const waStrengthsList = allStrengths.slice(0, 3).map(s => `  • ${s}`).join('\n');
  const waNeedList = formData.perluDikembangkanTerpilih.map(n => `  • ${n}`).join('\n') || '  • Mempertahankan konsistensi capaian';

  const waText = `*KOMUNIKASI PERKEMBANGAN SISWA*
${profile.namaSekolah}
----------------------------------------
${salamPembuka}

Semoga Bapak/Ibu dan keluarga senantiasa dalam keadaan sehat walafiat. 

Berikut ringkasan perkembangan belajar ananda selama periode *${formData.periodeLaporan}*:

👤 *Identitas Siswa:*
• Nama: *${fName}* (${pName})
• Kelas: ${formData.kelas} | No. Absen: ${formData.nomorAbsen}

🌟 *Potensi & Kekuatan:*
${waStrengthsList}

📊 *Perkembangan Belajar:*
• Akademik: *${formData.akademikLevel}* (${formData.mataPelajaranTopik || 'Mata Pelajaran'})
• Keaktifan Kelas: *${formData.keaktifanLevel}*
• Sikap & Tanggung Jawab: *${formData.sikapLevel}* (${formData.tugasLevel})
• Kehadiran: Hadir ${formData.kehadiran.hadir} hari${formData.kehadiran.sakit ? `, Sakit ${formData.kehadiran.sakit}` : ''}${formData.kehadiran.izin ? `, Izin ${formData.kehadiran.izin}` : ''}

🌱 *Fokus Pendampingan Bersama:*
${waNeedList}

💡 *Saran Kolaborasi di Rumah:*
${waRekomenList}
${formData.catatanGuru ? `\n📝 *Catatan Wali Kelas/Guru:*\n"${sanitizePedagogicalText(formData.catatanGuru)}"\n` : ''}
${salamPenutup}`;

  // 11. LAPORAN PERKEMBANGAN LENGKAP (Bagian A - K)
  const reportSections: FullReportSection[] = [
    {
      code: 'A',
      title: 'Identitas Siswa',
      content: [
        `Nama Lengkap: ${fName}`,
        `Nama Panggilan: ${pName}`,
        `Kelas: ${formData.kelas}`,
        `Nomor Absen: ${formData.nomorAbsen}`,
        `Orang Tua/Wali: ${formData.namaOrtu || '-'}`,
        `Periode Laporan: ${formData.periodeLaporan}`,
        `Tanggal Evaluasi: ${formData.tanggalKomunikasi}`
      ]
    },
    {
      code: 'B',
      title: 'Perkembangan Akademik',
      content: `Kategori Capaian: ${formData.akademikLevel}. Pada mata pelajaran/topik "${formData.mataPelajaranTopik || 'Umum'}", siswa memperoleh capaian ${formData.nilaiPencapaian || 'sesuai target'}. ${formData.kekuatanAkademik ? 'Keunggulan spesifik: ' + formData.kekuatanAkademik + '.' : ''} ${formData.kesulitanDitemukan ? 'Tantangan belajar: ' + sanitizePedagogicalText(formData.kesulitanDitemukan) + '.' : ''}`
    },
    {
      code: 'C',
      title: 'Sikap dan Karakter',
      content: `Kategori Sikap: ${formData.sikapLevel}. Siswa menunjukkan pembiasaan karakter yang baik terutama dalam aspek: ${formData.aspekSikapTerpilih.join(', ') || 'sopan santun dan kepedulian'}.`
    },
    {
      code: 'D',
      title: 'Kehadiran dan Presensi',
      content: `Hadir: ${formData.kehadiran.hadir} hari | Sakit: ${formData.kehadiran.sakit} hari | Izin: ${formData.kehadiran.izin} hari | Tanpa Keterangan: ${formData.kehadiran.alpa} hari. ${formData.kehadiran.keterangan ? 'Catatan Presensi: ' + formData.kehadiran.keterangan : ''}`
    },
    {
      code: 'E',
      title: 'Keaktifan di Kelas',
      content: `Predikat Keaktifan: ${formData.keaktifanLevel}. Partisipasi teramati dalam kegiatan: ${formData.aspekKeaktifanTerpilih.join(', ') || 'diskusi dan tanya jawab'}.`
    },
    {
      code: 'F',
      title: 'Tugas dan Tanggung Jawab',
      content: `Kategori Pengumpulan Tugas: ${formData.tugasLevel}. Menunjukkan komitmen dalam menuntaskan instruksi pembelajaran yang diberikan guru.`
    },
    {
      code: 'G',
      title: 'Kekuatan dan Potensi Siswa',
      content: allStrengths.length > 0 ? allStrengths : ['Menunjukkan motivasi belajar yang positif dan kooperatif']
    },
    {
      code: 'H',
      title: 'Aspek yang Perlu Dikembangkan',
      content: formData.perluDikembangkanTerpilih.length > 0 ? formData.perluDikembangkanTerpilih : ['Pemeliharaan konsistensi prestasi dan disiplin belajar']
    },
    {
      code: 'I',
      title: 'Rekomendasi Tindak Lanjut',
      content: recommendations
    },
    {
      code: 'J',
      title: 'Catatan Guru / Wali Kelas',
      content: sanitizePedagogicalText(formData.catatanGuru) || 'Siswa memiliki modal kepribadian dan potensi belajar yang baik untuk terus dikembangkan pada tahapan berikutnya.'
    },
    {
      code: 'K',
      title: 'Pesan Kemitraan untuk Orang Tua',
      content: 'Dukungan, apresiasi berkala, dan pendampingan santun di lingkungan keluarga merupakan pilar terpenting dalam menyukseskan pembelajaran ananda di sekolah.'
    }
  ];

  return {
    text: fullNarrative,
    waText,
    recommendations,
    reportSections
  };
}

/**
 * Quick revision tool that modifies the current narrative in-place
 */
export function modifyNarrative(
  currentText: string,
  action:
    | 'perbaiki_bahasa'
    | 'lebih_singkat'
    | 'lebih_formal'
    | 'lebih_ramah'
    | 'lebih_positif'
    | 'versi_wa'
    | 'versi_laporan'
    | 'regenerasi',
  formData: ProgressFormData,
  profile: TeacherProfile
): string {
  // Regenerasi langsung menghasilkan variasi baru dari engine
  if (action === 'regenerasi') {
    return generateNarrative(formData, profile).text;
  }

  if (action === 'versi_wa') {
    return generateNarrative(formData, profile).waText;
  }

  if (action === 'versi_laporan') {
    const updatedForm = { ...formData, gayaBahasa: 'laporan-resmi' as ToneStyle, panjangPesan: 'lengkap' as const };
    return generateNarrative(updatedForm, profile).text;
  }

  if (action === 'lebih_singkat') {
    const updatedForm = { ...formData, panjangPesan: 'singkat' as const };
    return generateNarrative(updatedForm, profile).text;
  }

  if (action === 'lebih_formal') {
    const updatedForm = { ...formData, gayaBahasa: 'formal' as ToneStyle };
    return generateNarrative(updatedForm, profile).text;
  }

  if (action === 'lebih_ramah') {
    const updatedForm = { ...formData, gayaBahasa: 'ramah-komunikatif' as ToneStyle };
    return generateNarrative(updatedForm, profile).text;
  }

  if (action === 'perbaiki_bahasa') {
    return sanitizePedagogicalText(currentText)
      .replace(/\s+/g, ' ')
      .replace(/\s([.,!?:;])/g, '$1')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  if (action === 'lebih_positif') {
    let positiveText = sanitizePedagogicalText(currentText);
    positiveText = positiveText.replace(/masih kurang/gi, 'sedang bertumbuh');
    positiveText = positiveText.replace(/belum bisa/gi, 'sedang belajar menguasai');
    positiveText = positiveText.replace(/sulit/gi, 'memerlukan latihan bertahap');
    return positiveText;
  }

  return currentText;
}

/**
 * Creates exportable HTML for Word (.doc) download
 */
export function generateWordDocument(
  title: string,
  sections: FullReportSection[],
  profile: TeacherProfile,
  studentName: string,
  kelas: string
): Blob {
  const contentHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #222; margin: 40px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
        .school-name { font-size: 16pt; font-weight: bold; text-transform: uppercase; color: #1e3a8a; }
        .school-addr { font-size: 10pt; color: #555; }
        .report-title { font-size: 14pt; font-weight: bold; text-align: center; margin: 20px 0; text-decoration: underline; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; vertical-align: top; }
        th { background-color: #f1f5f9; font-weight: bold; width: 30%; }
        .section-header { background-color: #e2e8f0; font-weight: bold; font-size: 11pt; padding: 6px 10px; margin-top: 15px; border-left: 4px solid #1e3a8a; }
        .signature-table { width: 100%; margin-top: 40px; border: none; }
        .signature-table td { border: none; width: 50%; text-align: center; padding: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-name">${profile.namaSekolah}</div>
        <div class="school-addr">${profile.alamatSekolah || ''} ${profile.nomorKomunikasi ? '• Telp: ' + profile.nomorKomunikasi : ''}</div>
        <div style="font-size: 10pt; margin-top: 4px;">Tahun Pelajaran ${profile.tahunPelajaran} • Semester ${profile.semester}</div>
      </div>

      <div class="report-title">LAPORAN PERKEMBANGAN DAN KOMUNIKASI PESERTA DIDIK</div>

      <table>
        <tr>
          <th>Nama Peserta Didik</th>
          <td><strong>${studentName}</strong></td>
        </tr>
        <tr>
          <th>Kelas / Rombel</th>
          <td>${kelas}</td>
        </tr>
        <tr>
          <th>Guru Pengampu / Wali Kelas</th>
          <td>${profile.namaGuru}${profile.gelar ? ', ' + profile.gelar : ''}</td>
        </tr>
      </table>

      ${sections.map(sec => {
        let bodyHtml = '';
        if (Array.isArray(sec.content)) {
          bodyHtml = `<ul>${sec.content.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else {
          bodyHtml = `<p>${sec.content}</p>`;
        }
        return `
          <div class="section-header">${sec.code}. ${sec.title}</div>
          <div style="padding: 6px 10px;">${bodyHtml}</div>
        `;
      }).join('')}

      <table class="signature-table">
        <tr>
          <td>
            Mengetahui,<br>
            Orang Tua / Wali Murid
            <br><br><br><br>
            ( .................................................. )
          </td>
          <td>
            ${profile.kotaSekolah || 'Sekolah'}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
            Guru Mata Pelajaran / Wali Kelas
            <br><br><br><br>
            <strong>(${profile.namaGuru}${profile.gelar ? ', ' + profile.gelar : ''})</strong><br>
            NIP: ${profile.nip || '-'}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return new Blob(['\ufeff', contentHtml], {
    type: 'application/msword'
  });
}
