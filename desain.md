# Dokumen Desain & Animasi (desain.md) - Cendiks v2.0

## 1. Konsep Visual & Identitas Merek

### 1.1. Tema Visual
**Cyber Academic / Dark Futuristic Glassmorphism** — Latar belakang gelap futuristik dengan elemen kaca (*glassmorphism*) memberikan kesan canggih dan interaktif.

### 1.2. Palet Warna

| Elemen | Warna | Kode Hex | Penggunaan |
|---|---|---|---|
| **Primary Accent** | Cyber Neon Green | `#00FF66` | Tombol CTA, indikator aktif, glow elemen |
| **Secondary Accent** | Electric Cyan | `#00E5FF` | Highlight kode, efek hover, gradien |
| **Background Dark** | Deep Space Navy | `#0B0F19` | Latar belakang utama |
| **Glass Surface** | Glass Black | `rgba(17, 24, 39, 0.6)` | Panel card, modal, navbar |
| **Text Primary** | Ice White | `#F9FAFB` | Heading, teks utama |
| **Text Secondary** | Muted Slate | `#9CA3AF` | Subtitle, deskripsi |

### 1.3. Tipografi
- **Heading**: `Space Grotesk`
- **Body / UI**: `Inter`
- **Code**: `JetBrains Mono` / `Fira Code`

---

## 2. Animasi & Interaktivitas

### 2.1. Stack Animasi
1. **Lenis.js** — Smooth scrolling global.
2. **GSAP + ScrollTrigger** — Timeline animasi berbasis posisi scroll.
3. **Framer Motion** — Page transitions, mount/unmount, mikro-interaksi.
4. **Tailwind CSS** — Utility-first styling + custom dark mode tokens.

### 2.2. Efek Animasi Implementasi

#### Landing Page
- **Hero Section**: Fade-up teks, glow background, hover tombol dengan shadow neon.
- **Dark/Light Mode**: Toggle ☀️/🌙 di kanan atas, disimpan ke `localStorage`.
- **Language Toggle**: 🌐 ID/EN di kiri atas, teks berubah langsung (i18n sederhana).
- **Stats Section**: Angka besar (10K+, 50+, 12+, 4.5K+) dengan efek reveal saat scroll.
- **Feature Cards**: Grid 3 kolom, hover border hijau, lift efek.

#### Course Pages
- **Course List**: Grid kartu dengan progres dan status selesai.
- **Module Page**: Konten markdown, code example, tombol tandai selesai.
- **Exam Engine**: Full-screen focus mode, timer hitung mundur, navigasi soal, hasil ujian.

### 2.3. Reduksi Motion
CSS `prefers-reduced-motion` disupport — animasi dinonaktifkan jika OS pengguna mengaktifkan mode ini.

---

## 3. Komponen UI Utama

| Komponen | Deskripsi |
|---|---|
| **Navbar** | Floating glassmorphism dengan logo SVG, link navigasi, status user |
| **Landing Hero** | Judul besar, deskripsi, CTA tombol mulai belajar |
| **Course Grid** | Kartu kursus dengan thumbnail, judul, durasi, progres |
| **Module Sidebar** | Daftar modul dengan indikator lock/selesai |
| **Exam Interface** | Timer, grid nomor soal, status terjawab/belum |
| **Result Page** | Skor, status pass/failed, sertifikat siap unduh (PDF) |

---

## 4. Rekomendasi Fitur Baru (Backlog)

Berdasarkan kondisi saat ini, berikut fitur yang direkomendasikan untuk dikembangkan:

1. **PDF Certificate Generator** (`dompdf/dompdf`)
   - Unduh sertifikat resmi setelah lulus ujian.
   - Nomor sertifikat unik (`CEN-XXXXXXXX`).

2. **Global Leaderboard**
   - Halaman peringkat pengguna berdasarkan progress dan skor ujian.
   - Filter: mingguan, bulanan, all-time.

3. **Code Playground (IDE Inline)**
   - Editor kode di dalam halaman modul (Monaco Editor).
   - Jalankan kode Python langsung di browser.

4. **AI Mentor Chat**
   - Chatbot berbasis LLM untuk menjawab pertanyaan materi Python 24/7.
   - Integrasi dengan konteks modul yang sedang dibaca.

5. **Sertifikat Gallery di Dashboard**
   - Galeri sertifikat yang pernah diraih dengan preview dan unduh PDF.

6. **Quiz Per Modul (Micro-Quiz)**
   - Ujian kecil di akhir setiap modul sebelum membuka modul berikutnya.

---

## 5. Catatan Implementasi
- **Three.js / React Three Fiber** di-*remove* karena crash runtime di React 18 (R3F butuh React 19). Digantikan dengan SVG + CSS + Framer Motion agar stabil.
- **SQLite** digunakan untuk development cepat; mudah dialihkan ke PostgreSQL/MySQL untuk production.
- **Seeding**: `php artisan db:seed --class=CendiksSeeder --force` untuk memuat 40 modul + 1 ujian.
