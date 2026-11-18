import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Module({ auth, course, module, modules, completedModuleIds, isCompleted, previous, next }) {
    const user = usePage().props.auth.user;

    const isLast = module.order === modules.reduce((max, m) => Math.max(max, m.order), 0);

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <div className="flex flex-col gap-2">
                    <h2 className="font-heading text-xl font-semibold leading-tight text-white">
                        {module.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                        Modul {module.order} dari {modules.length}
                    </p>
                </div>
            }
        >
            <Head title={`${module.title} - ${course.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-8">
                    {/* Breadcrumb / Navigasi */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Link
                                href={route('courses.show', course.slug)}
                                className="hover:text-brand-green transition"
                            >
                                {course.title}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-300">{module.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {previous && (
                                <Link
                                    href={route('courses.module', [course.slug, previous.slug])}
                                    className="rounded-lg p-2 text-gray-300 hover:bg-white/5 hover:text-white transition"
                                    aria-label="Modul sebelumnya"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                            )}
                            {next && (
                                <Link
                                    href={route('courses.module', [course.slug, next.slug])}
                                    className="rounded-lg p-2 text-gray-300 hover:bg-white/5 hover:text-white transition"
                                    aria-label="Modul berikutnya"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Konten modul */}
                    <div className="glass-strong rounded-3xl p-8 overflow-hidden">
                        {/* Header modul */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                            <div>
                                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-green">
                                    Modul {module.order}
                                </span>
                                <h1 className="font-heading text-3xl font-bold text-white mt-2">
                                    {module.title}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    isCompleted ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' : 'bg-white/5 text-gray-400'
                                }`}>
                                    {isCompleted ? 'Selesai ✓' : 'Belum Selesai'}
                                </span>
                                {!isCompleted && (
                                    <button
                                        onClick={() => {
                                            router.post(
                                                route('courses.module.complete', [
                                                    course.slug,
                                                    module.slug,
                                                ]),
                                                {
                                                    preserveScroll: true,
                                                    onSuccess: () =>
                                                        window.location.reload(),
                                                }
                                            );
                                        }}
                                        className="btn-ghost px-5 py-2 text-sm font-medium"
                                    >
                                        Tandai Selesai
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Teks konten */}
                        <div className="prose prose-invert max-w-none mb-8">
                            <p className="mb-4 text-gray-300 leading-relaxed">
                                {module.description || 'Tidak ada deskripsi modul.'}
                            </p>

                            {module.content && (
                                <div className="bg-brand-navy p-6 rounded-2xl border border-white/10 mb-8">
                                    <div className="flex justify-between mb-3">
                                        <span className="text-xs font-medium text-gray-400">Konten Materi</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">PYTHON</span>
                                    </div>
                                    <div className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                                        {module.content}
                                    </div>
                                </div>
                            )}

                            {module.code_example && (
                                <div className="relative group">
                                    <div className="flex justify-between mb-3 items-center">
                                        <span className="text-xs font-medium text-gray-400">Contoh Kode</span>
                                        <button
                                            className="text-xs font-medium text-brand-green hover:text-white transition opacity-0 group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigator.clipboard.writeText(module.code_example);
                                            }
                                        }
                                        >
                                            Salin
                                        </button>
                                    </div>
                                    <div className="bg-[#0d1117] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                                        <div className="flex items-center gap-2 bg-[#21262d] px-4 py-2 border-b border-white/5">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-2 w-2 rounded-full bg-red-500/60" />
                                            ))}
                                        </div>
                                        <pre className="font-mono text-sm text-gray-300 p-4 overflow-x-auto whitespace-pre-wrap">
                                            {module.code_example}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigasi lanjutan di bawah */}
                    <div className="glass rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm">
                            <span className="text-gray-500">Skor progres: </span>
                            <span className="font-semibold text-white">
                                {completedModuleIds.length}/{modules.length} modul selesai
                            </span>
                        </div>
                        {next && (
                            <Link
                                href={route('courses.module', [course.slug, next.slug])}
                                className="btn-primary rounded-xl px-6 py-3 text-sm font-medium"
                            >
                                Modul Selanjutnya →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
