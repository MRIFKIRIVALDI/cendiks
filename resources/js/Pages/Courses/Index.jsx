import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ auth, courses }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col gap-2">
                    <h2 className="font-heading text-xl font-semibold leading-tight text-white">
                        Eksplorasi Kursus Python
                    </h2>
                    <p className="text-sm text-gray-400">
                        Pilih modul belajar yang sesuai dengan tingkat keahlian Anda.
                    </p>
                </div>
            }
        >
            <Head title="Kursus Belajar Python" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course, i) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group glass-strong relative overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:glow-border"
                            >
                                <Link href={route('courses.show', course.slug)} className="block h-full bg-brand-obsidian/40 rounded-[22px] p-6">
                                    {/* Icon / Accent indicator */}
                                    <div className="mb-6 flex items-start justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-2xl">
                                            {course.icon || '🐍'}
                                        </div>
                                        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-green">
                                            {course.level}
                                        </span>
                                    </div>

                                    <h3 className="font-heading text-xl font-bold text-white group-hover:text-brand-green transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                                        {course.description}
                                    </p>

                                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                📚 {course.modules_count} Modul
                                            </span>
                                            <span className="flex items-center gap-1">
                                                ⏱️ {course.duration_minutes} Menit
                                            </span>
                                        </div>
                                        <div className="h-8 w-8 rounded-full border border-white/10 grid place-items-center transition group-hover:bg-brand-green group-hover:text-brand-navy">
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {courses.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-500">Belum ada kursus yang diterbitkan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
