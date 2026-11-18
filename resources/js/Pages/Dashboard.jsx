import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth, stats, examResults }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-heading text-xl font-semibold leading-tight text-white">
                    Dashboard Cendiks
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Welcome Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass relative overflow-hidden rounded-3xl p-8 shadow-2xl"
                    >
                        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                            <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-semibold text-brand-green">
                                Selamat Datang Kembali 👋
                            </span>
                            <h3 className="mt-4 font-heading text-3xl font-bold text-white">
                                Halo, {auth.user.name}!
                            </h3>
                            <p className="mt-2 text-gray-400">
                                Lanjutkan perjalanan belajar Python Anda hari ini. Cek progress dan sertifikat yang telah diraih.
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: 'Modul Selesai', value: stats.completed_modules, icon: '📚' },
                            { label: 'Ujian Diikuti', value: stats.total_exams, icon: '✍️' },
                            { label: 'Ujian Lulus', value: stats.passed_exams, icon: '🎯' },
                            { label: 'Sertifikat', value: stats.certificates_earned, icon: '🏆' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass rounded-2xl p-6 transition-all duration-300 hover:border-brand-green/40 hover:shadow-[0_0_20px_rgba(0,255,102,0.15)]"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">{stat.icon}</span>
                                    <span className="font-heading text-3xl font-bold text-gradient">
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm font-medium text-gray-400">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Exam Results & Certificates Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass rounded-3xl p-8"
                    >
                        <h4 className="font-heading text-xl font-bold text-white mb-6">
                            Riwayat Sertifikasi & Ujian
                        </h4>

                        {examResults.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-gray-400">Belum ada riwayat ujian sertifikasi.</p>
                                <Link
                                    href="/ujian-sertifikasi"
                                    className="btn-primary mt-4 inline-block text-sm"
                                >
                                    Ambil Ujian Sekarang
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/10">
                                {examResults.map((result) => (
                                    <div key={result.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <h5 className="font-heading font-semibold text-white">
                                                {result.certification_exam.title}
                                            </h5>
                                            <p className="text-xs text-gray-400">
                                                Skor: {result.score} / {result.total_score}
                                            </p>
                                        </div>
                                        <div>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    result.status === 'passed'
                                                        ? 'bg-brand-green/20 text-brand-green'
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}
                                            >
                                                {result.status === 'passed' ? 'Lulus 🏆' : 'Belum Lulus'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
