import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Show({ auth, course, completedModuleIds, progress }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('courses.index')} className="text-sm text-brand-green hover:underline">
                        ← Kembali ke Daftar Kursus
                    </Link>
                </div>
            }
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Header Banner */}
                    <div className="glass-strong rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-3">
                                <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-semibold text-brand-green">
                                    {course.level}
                                </span>
                                <h1 className="font-heading text-3xl font-bold text-white">
                                    {course.title}
                                </h1>
                                <p className="text-gray-400 max-w-2xl">
                                    {course.description}
                                </p>
                            </div>

                            {/* Progress bar */}
                            <div className="glass rounded-2xl p-6 min-w-[240px]">
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-300">Progress Belajar</span>
                                    <span className="text-brand-green">{progress}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-brand-green transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modules List */}
                    <div className="glass rounded-3xl p-8">
                        <h3 className="font-heading text-xl font-bold text-white mb-6">
                            Modul Pembelajaran
                        </h3>

                        <div className="space-y-4">
                            {course.modules.map((module, i) => {
                                const isCompleted = completedModuleIds.includes(module.id);
                                return (
                                    <motion.div
                                        key={module.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass flex items-center justify-between rounded-2xl p-5 hover:border-brand-green/40 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`grid h-10 w-10 place-items-center rounded-xl font-bold text-sm ${
                                                isCompleted ? 'bg-brand-green/20 text-brand-green' : 'bg-white/5 text-gray-400'
                                            }`}>
                                                {isCompleted ? '✓' : i + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-heading font-semibold text-white">
                                                    {module.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    ⏱️ {module.duration_minutes || 15} Menit
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            href={route('courses.module', [course.slug, module.slug])}
                                            className="btn-ghost px-4 py-2 text-xs"
                                        >
                                            {isCompleted ? 'Pelajari Ulang' : 'Mulai Modul'}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
