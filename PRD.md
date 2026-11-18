# Product Requirement Document (PRD) - Cendiks v2.0

## 1. Ringkasan Proyek
**Cendiks** adalah platform edukasi interaktif modern untuk mempelajari pemrograman Python. Proyek ini dibangun dengan **Laravel 12 + Inertia.js + React**, berfokus pada antarmuka *immersive*, kaya animasi, dan pengalaman pengguna dinamis.

---

## 2. Visi & Tujuan
- **Visi**: Platform belajar Python terkemuka dengan estetika visual modern, gamifikasi, dan efisiensi pembelajaran.
- **Tujuan Utama**:
  - Alur belajar Python terstruktur (40 modul).
  - Pengalaman belajar interaktif dengan animasi halus.
  - Sistem ujian sertifikasi dengan generator sertifikat PDF otomatis.

---

## 4. Fitur Utama

### 4.1. Landing Page Modern
- **Dark/Light Mode**: Toggle tema otomatis/manual.
- **Multi-bahasa**: Toggle teks ID/EN.
- **Animasi**: Framer Motion & GSAP untuk *smooth scroll* & *page transitions*.
- **Responsive SVG**: Penggunaan aset SVG kustom untuk ikonografi.

### 4.2. Manajemen Kursus & Modul
- **40 Modul**: Materi dari dasar hingga mahir (OOP, API, Testing, Deployment).
- **Progress Tracking**: Status selesai tiap modul.

### 4.3. Exam Engine & Sertifikasi
- **Sistem Ujian**: Timer otomatis, auto-submit, penilaian instan.
- **Sertifikasi**: PDF generator (dompdf).

### 4.4. Fitur Baru (Pengembangan)
1. **Global Leaderboard**: Menampilkan user dengan progress/skor tertinggi.
2. **Code Playground (IDE)**: Editor kode terintegrasi untuk mencoba langsung materi (Monaco Editor).
3. **AI Mentor Chat**: Chatbot berbasis AI untuk bantuan materi 24/7.

---

## 5. Arsitektur & Teknologi
| Layer | Teknologi |
|---|---|
| **Backend** | Laravel 12 (PHP 8.3+) |
| **Frontend** | Inertia.js + React 18 |
| **Styling** | Tailwind CSS v3 |
| **Animation** | GSAP, Framer Motion, Lenis.js |
| **Database** | SQLite (Production/Dev) |

---

## 7. Roadmap Terbaru
1. **Fase 1 (Selesai)**: Setup core, migration, seeding 40 modul.
2. **Fase 2 (Selesai)**: Landing page animasi, UI modern, Dark/Light mode, i18n.
3. **Fase 3 (Aktif)**: Integrasi PDF Generator & Sertifikat.
4. **Fase 4 (Backlog)**: Integrasi AI Mentor & Code Playground.
