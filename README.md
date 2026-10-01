# Asisten Komunikasi Guru & Orang Tua

Generator pesan & laporan perkembangan siswa untuk guru SMA/SMK.
Stack: React + Vite + Tailwind, data & login di **Supabase**, hosting di **Vercel**.

## 1. Siapkan Supabase (sekali saja)

1. Buat project di https://supabase.com
2. Buka **SQL Editor → New query**, tempel isi `supabase/schema.sql`, klik **Run**.
3. Buka **Project Settings → API**, salin **Project URL** dan **anon public key**.
4. (Opsional, memudahkan) **Authentication → Providers → Email**: matikan
   *Confirm email* agar guru bisa langsung masuk setelah daftar.

## 2. Jalankan di VS Code

```bash
npm install
cp .env.example .env.local      # lalu isi URL & anon key Supabase
npm run dev                     # buka http://localhost:3000
```

Cek tipe kode: `npm run lint`

## 3. Deploy ke Vercel

1. Push proyek ke GitHub (`.env.local` sudah diabaikan oleh `.gitignore`).
2. Di https://vercel.com: **Add New → Project** → pilih repo. Preset *Vite* terdeteksi otomatis.
3. Di **Environment Variables** isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
4. Klik **Deploy**. Setiap `git push` berikutnya otomatis ter-deploy.
5. Di Supabase: **Authentication → URL Configuration**, isi *Site URL* dengan alamat Vercel Anda
   (diperlukan jika memakai konfirmasi email).

## Struktur data

| Tabel | Isi |
|---|---|
| `teacher_profiles` | profil guru + PIN kunci layar |
| `students` | bank data siswa |
| `messages` | riwayat pesan/laporan |

Semua tabel memakai Row Level Security: tiap akun hanya mengakses datanya sendiri.
Anon key aman berada di frontend karena perlindungan ada di RLS.

> PIN 4 digit adalah kunci privasi layar saja, bukan keamanan data.
> Keamanan data dijaga oleh login Supabase + RLS.
