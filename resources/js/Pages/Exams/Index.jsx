import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ auth, exams }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col gap-2">
                    <h2 className="font-heading text-xl font-semibold leading-tight text-white">
                        Pusat Sertifikasi
                    </h2>
                    <p className="text-sm text-gray-400">
                        Uji kemampuan Anda dan raih sertifikat resmi Cendiks.
                    </p>
                </div>
            }
        >
            <Head title="Ujian Sertifikasi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {exams.map((exam, i) => (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group glass-strong relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:glow-border"
                            >
                                <div className="mb-6 flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cyan/10 text-2xl">
                                        🏆
                                    </div>
                                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                                        {exam.level}
                                    </span>
                                </div>

                                <h3 className="font-heading text-xl font-bold text-white group-hover:text-brand-cyan transition-colors">
                                    {exam.title}
                                </h3>
                                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                                    {exam.description}
                                </p>

                                <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-gray-400 mb-6">
                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                        <span>❓</span> {exam.questions_count} Soal
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                                        <span>⏱️</span> {exam.time_limit_minutes} Menit
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 col-span-2">
                                        <span>🎯</span> Passing Score: {exam.passing_score}%
                                    </div>
                                </div>

                                <Link
                                    href={route('exams.show', exam.slug)}
                                    className="btn-primary w-full justify-center rounded-xl px-6 py-3 text-sm"
                                >
                                    Lihat Detail
                                </Link>
                            </motion.div>
                        ))}

                        {exams.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-500">Belum ada ujian sertifikasi yang tersedia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
