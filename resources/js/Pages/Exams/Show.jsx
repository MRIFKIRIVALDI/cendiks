import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Show({ auth, exam, lastResult }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <Link href={route('exams.index')} className="text-sm text-brand-cyan hover:underline">
                    ← Kembali ke Pusat Sertifikasi
                </Link>
            }
        >
            <Head title={exam.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-strong rounded-3xl p-8 relative overflow-hidden"
                    >
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <span className="rounded-full bg-brand-cyan/20 px-3 py-1 text-xs font-semibold text-brand-cyan">
                                {exam.level}
                            </span>
                            <h1 className="font-heading text-3xl font-bold text-white mt-4">
                                {exam.title}
                            </h1>
                            <p className="text-gray-400 mt-3">
                                {exam.description}
                            </p>

                            {/* Exam facts */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="glass rounded-2xl p-4 text-center">
                                    <p className="font-heading text-2xl font-bold text-brand-cyan">
                                        {exam.questions_count}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Soal</p>
                                </div>
                                <div className="glass rounded-2xl p-4 text-center">
                                    <p className="font-heading text-2xl font-bold text-brand-green">
                                        {exam.time_limit_minutes}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Menit</p>
                                </div>
                                <div className="glass rounded-2xl p-4 text-center">
                                    <p className="font-heading text-2xl font-bold text-white">
                                        {exam.passing_score}%
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Passing</p>
                                </div>
                            </div>

                            {/* Rules */}
                            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                                <h3 className="font-heading font-semibold text-white mb-3">
                                    📋 Peraturan Ujian
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li>• Ujian terdiri dari {exam.questions_count} soal pilihan ganda.</li>
                                    <li>• Waktu pengerjaan {exam.time_limit_minutes} menit dan akan berakhir otomatis.</li>
                                    <li>• Skor minimal {exam.passing_score}% untuk lulus sertifikasi.</li>
                                    <li>• Anda dapat menavigasi soal bebas sebelum submit.</li>
                                    <li>• Sertifikat PDF akan tersedia jika lulus.</li>
                                </ul>
                            </div>

                            {/* Last result */}
                            {lastResult && (
                                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-400">
                                        Hasil terakhir:{' '}
                                        <span className={lastResult.status === 'passed' ? 'text-brand-green font-semibold' : 'text-red-400 font-semibold'}>
                                            {lastResult.status === 'passed' ? 'LULUS' : 'BELUM LULUS'}
                                        </span>
                                    </div>
                                    <Link
                                        href={route('exams.result', lastResult.id)}
                                        className="text-xs text-brand-cyan hover:underline"
                                    >
                                        Lihat Hasil
                                    </Link>
                                </div>
                            )}

                            <div className="mt-8 flex gap-4">
                                <Link
                                    href={route('exams.take', exam.slug)}
                                    className="btn-primary rounded-xl px-8 py-3"
                                >
                                    Mulai Ujian Sekarang
                                </Link>
                                <Link
                                    href={route('exams.index')}
                                    className="btn-ghost rounded-xl px-8 py-3"
                                >
                                    Batal
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
