import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

// Aset SVG / logo dari folder images
const cendiksLogo = '/images/cendiks-logo.png';
const pythonLogo = '/images/logo-python.png';
const pythonAltLogo = '/images/logo-python-alt.png';
const sertifikasiLogo = '/images/logo-sertifikasi.png';
const windowsLogo = '/images/logo-windows.png';
const macosLogo = '/images/logo-macos.png';
const linuxLogo = '/images/logo-linux.png';
const mascotLogo = '/images/mascot-more.png';

export default function Landing({ auth }) {
    const [theme, setTheme] = useState(
        typeof window !== 'undefined' && localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
    );
    const [language, setLanguage] = useState('id');

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
    };

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'id' ? 'en' : 'id'));
    };

    const t = {
        id: {
            title: 'Belajar Python Interaktif',
            subtitle: 'Masa Depan',
            cta: 'Mulai Belajar Sekarang',
            stats: ['10K+', '50+', '12+', '4.5K+'],
            labels: ['Pelajar Aktif', 'Modul Python', 'Ujian Sertifikasi', 'Alumni Lulus'],
            features: [
                { title: 'Editor Interaktif', desc: 'Tulis dan jalankan kode Python langsung di browser tanpa instalasi.' },
                { title: 'Modul Bertingkat', desc: 'Materi terstruktur dari dasar hingga mahir, lengkap dengan contoh kode.' },
                { title: 'Sertifikat Resmi', desc: 'Lulus ujian sertifikasi dan unduh sertifikat PDF untuk portofolio.' },
            ],
            about: 'Cendiks Academy adalah platform belajar Python terkemuka yang menyediakan pengalaman pembelajaran interaktif, modul terstruktur, dan sertifikasi resmi.',
            ready: 'Siap Memulai Perjalanan Anda?',
            readyDesc: 'Gabung ribuan pelajar yang sudah menguasai Python melalui platform kami.',
            btnMulaiShort: 'Mulai Belajar',
            navMasuk: 'Masuk',
            navDaftar: 'Daftar',
            navDashboard: 'Dashboard',
            langShort: 'ID',
            langFull: 'Bahasa Indonesia',
        },
        en: {
            title: 'Interactive Python Learning',
            subtitle: 'The Future',
            cta: 'Start Learning Now',
            stats: ['10K+', '50+', '12+', '4.5K+'],
            labels: ['Active Students', 'Python Modules', 'Certification Exams', 'Graduates'],
            features: [
                { title: 'Interactive Editor', desc: 'Write and run Python code directly in the browser without installation.' },
                { title: 'Tiered Modules', desc: 'Structured materials from basics to advanced, complete with code examples.' },
                { title: 'Official Certificate', desc: 'Pass certification exams and download PDF certificate for your portfolio.' },
            ],
            about: 'Cendiks Academy is the leading Python learning platform providing interactive learning experiences.',
            ready: 'Ready to Start Your Journey?',
            readyDesc: 'Join thousands of students who have mastered Python through our platform.',
            btnMulaiShort: 'Start Learning',
            navMasuk: 'Login',
            navDaftar: 'Register',
            navDashboard: 'Dashboard',
            langShort: 'EN',
            langFull: 'English',
        },
    };

    const cur = t[language];

    return (
        <div className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 ${
            theme === 'dark' ? 'bg-brand-navy text-white' : 'bg-gray-50 text-gray-900'
        }`}>
            <Head title={`Cendiks - ${cur.title}`} />

            {/* Navbar controls */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
                <button
                    onClick={toggleLanguage}
                    className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold hover:bg-white/20 transition shadow-sm border border-white/10"
                >
                    🌐 {cur.langShort}
                </button>
            </div>

            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition shadow-sm border border-white/10"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

            {/* Navbar menu */}
            <nav className="fixed inset-x-0 top-6 z-40 mx-auto max-w-5xl px-6">
                <div className="flex h-16 items-center justify-between rounded-2xl bg-white/10 backdrop-blur-xl px-6 border border-white/10 shadow-lg">
                    <Link href="/" className="flex items-center gap-2">
                        <img src={cendiksLogo} alt="Cendiks Logo" className="h-8 w-auto" />
                    </Link>
                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link href="/dashboard" className="px-5 py-2 rounded-xl bg-brand-green text-navy font-semibold text-sm hover:bg-brand-cyan transition">
                                {cur.navDashboard}
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium hover:text-brand-cyan transition">
                                    {cur.navMasuk}
                                </Link>
                                <Link href="/register" className="px-5 py-2 rounded-xl bg-brand-green text-navy font-semibold text-sm hover:bg-brand-cyan transition">
                                    {cur.navDaftar}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative flex min-h-screen items-center justify-center pt-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-green/10 blur-[140px]" />
                    <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[140px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <img src={pythonLogo} alt="Python Logo" className="h-8 w-auto" />
                            <span className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/10 px-4 py-1.5 text-xs font-semibold text-brand-cyan">
                                Platform Belajar Python Teraktif
                            </span>
                        </div>

                        <h1 className="mt-4 font-heading text-5xl font-extrabold tracking-tight md:text-8xl">
                            {cur.title}
                            <br />
                            <span className="bg-gradient-to-r from-brand-green to-brand-cyan bg-clip-text text-transparent italic">{cur.subtitle}.</span>
                        </h1>

                        <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 md:text-xl leading-relaxed">
                            {cur.readyDesc}
                        </p>

                        <div className="mt-10 flex items-center justify-center gap-4">
                            <Link
                                href="/kursus"
                                className="px-8 py-4 rounded-2xl bg-brand-green text-navy font-bold text-lg hover:bg-brand-cyan transition shadow-[0_0_30px_rgba(255,153,51,0.3)]"
                            >
                                {cur.cta}
                            </Link>
                        </div>

                        {/* Platform support */}
                        <div className="mt-14 flex items-center justify-center gap-6 opacity-50 md:opacity-80">
                            {[windowsLogo, macosLogo, linuxLogo].map((logo, i) => (
                                <img key={i} src={logo} alt={`OS ${i}`} className="h-10 w-auto grayscale hover:grayscale-0 transition" />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 border-y border-white/5">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {cur.stats.map((s, i) => (
                            <div key={i} className="text-center">
                                <p className="font-heading text-4xl font-bold">{s}</p>
                                <p className="mt-2 text-sm uppercase tracking-widest text-gray-500">{cur.labels[i]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-32">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl font-bold md:text-4xl">{cur.title === 'Interactive Python Learning' ? 'Key Features' : 'Fitur Unggulan'}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {cur.features.map((f, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-green/50 transition">
                                <div className="text-3xl mb-4 flex items-center gap-3 justify-center">
                                    {i === 0 && <img src={pythonAltLogo} alt="Python" className="h-8 w-auto" />}
                                    {i === 1 && <img src={sertifikasiLogo} alt="Sertifikat" className="h-8 w-auto" />}
                                    <span>{i === 0 ? '💻' : i === 1 ? '🏆' : '📚'}</span>
                                </div>
                                <h3 className="font-heading text-xl font-bold mb-2">{f.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / Mascot */}
            <section className="relative py-32 bg-gray-50 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-heading text-3xl font-bold mb-4 text-navy dark:text-white">Tentang Cendiks</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{cur.about}</p>
                            <div className="mt-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Link
                                        href="/kursus"
                                        className="px-6 py-3 rounded-xl bg-brand-green text-navy font-semibold text-sm hover:bg-brand-cyan transition"
                                    >
                                        {cur.btnMulaiShort}
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                        <div className="relative flex justify-center">
                            <img
                                src={mascotLogo}
                                alt="Cendiks Mascot"
                                className="max-w-lg h-auto rounded-3xl shadow-[0_0_40px_rgba(255,153,51,0.3)]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-32 bg-gradient-to-b from-brand-green/10 to-brand-cyan/10">
                <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring" }}
                    >
                        <div className="glass-strong rounded-3xl p-12 text-center">
                            <h2 className="font-heading text-3xl font-bold mb-4">{cur.ready}</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">{cur.readyDesc}</p>
                            <div>
                                <Link
                                    href="/kursus"
                                    className="px-8 py-4 rounded-2xl bg-brand-green text-navy font-bold text-lg hover:bg-brand-cyan transition shadow-[0_0_30px_rgba(255,153,51,0.3)]"
                                >
                                    {cur.cta}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="py-12 border-t border-white/5 text-center text-sm">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <img src={cendiksLogo} alt="Cendiks Logo" className="h-6 w-auto" />
                    <span className="font-bold">Cendiks Academy</span>
                </div>
                <p className="text-gray-500">
                    © {new Date().getFullYear()} Cendiks Academy. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
