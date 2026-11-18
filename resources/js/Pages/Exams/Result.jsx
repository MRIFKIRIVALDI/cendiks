import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Result({ auth, result }) {
    const percentage = result.total_score > 0
        ? Math.round((result.score / result.total_score) * 100)
        : 0;

    const passed = result.status === 'passed';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-heading text-xl font-semibold leading-tight text-white">
                    Hasil Ujian
                </h2>
            }
        >
            <Head title="Hasil Ujian Sertifikasi" />

            <div className="py-12">
                <div className="mx-auto max-w-md sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-strong rounded-[2rem] p-8 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-green/10 via-transparent to-brand-cyan/10 -z-10" />

                        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-brand-green/20 ring-offset-8">
                            <div
                                className="w-full h-full rounded-full border-4 border-brand-green/20 border-t-brand-green animate-spin relative"
                            />
                            {passed ? (
                                <span className="absolute inset-0 flex items-center justify-center text-3xl text-brand-green">
                                    🏆
                                </span>
                            ) : (
                                <span className="absolute inset-0 flex items-center justify-center text-3xl text-red-400">
                                    ❌
                                </span>
                            )}
                        </div>

                        <h1 className="font-heading text-3xl font-bold text-white mb-2">
                            {passed ? 'Selamat!' : 'Lain Kali'}
                        </h1>
                        <p className={passed ? 'text-brand-green text-lg mb-6' : 'text-red-400 text-lg mb-6'}>
                            {passed
                                ? 'Anda lulus sertifikasi!'
                                : 'Skor Anda belum mencukupi passing score.'}
                        </p>

                        {/* Score card */}
                        <div className="glass rounded-2xl p-6 mb-8">
                            <h3 className="font-heading text-sm font-semibold text-gray-400 uppercase tracking-tighter mb-4">
                                Nilai Anda
                            </h3>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="font-heading text-6xl font-bold text-white">
                                    {result.score}
                                </span>
                                <span className="text-lg font-medium text-brand-cyan">
                                    /
                                </span>
                                <span className="font-heading text-2xl font-bold text-white">
                                    {result.total_score}
                                </span>
                            </div>
                            <p className="mt-4 text-sm text-gray-400">
                                Persentase: <strong className="text-white">{percentage}%</strong>
                            </p>
                            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-brand-green to-brand-cyan"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Result actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {passed && result.certificate_number && (
                                <button
                                    className="btn-primary rounded-xl px-6 py-3 text-sm font-medium"
                                >
                                    📜 Download Sertifikat
                                </button>
                            )}
                            <button
                                className="btn-ghost rounded-xl px-6 py-3 text-sm font-medium"
                            >
                                Kembali ke Daftar Ujian
                            </button>
                        </div>

                        <div className="mt-8 text-xs text-gray-500">
                            Nomor Sertifikat:{' '}
                            <span className="font-mono text-brand-green">
                                {result.certificate_number || '—'}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
