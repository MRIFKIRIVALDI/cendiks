import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Take({ auth, exam }) {
    const questions = exam.questions;
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({}); // question_id => option_id
    const [timeLeft, setTimeLeft] = useState(exam.time_limit_minutes * 60);
    const [showConfirm, setShowConfirm] = useState(false);
    const submittedRef = useRef(false);

    const question = questions[current];
    const answeredCount = Object.keys(answers).length;
    const isLast = current === questions.length - 1;

    // Countdown timer
    useEffect(() => {
        if (submittedRef.current) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    submitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const submitExam = () => {
        if (submittedRef.current) return;
        submittedRef.current = true;
        router.post(route('exams.submit', exam.slug), { answers });
    };

    const selectOption = (optionId) => {
        setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
    };

    const timeCritical = timeLeft < 300; // < 5 menit

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <span className="font-heading text-xl font-semibold text-white">
                        {exam.title}
                    </span>
                    <span
                        className={`font-mono text-lg font-bold px-4 py-1.5 rounded-xl ${
                            timeCritical
                                ? 'bg-red-500/20 text-red-400 animate-pulse'
                                : 'bg-brand-green/10 text-brand-green'
                        }`}
                    >
                        ⏱ {formatTime(timeLeft)}
                    </span>
                </div>
            }
        >
            <Head title={`${exam.title} - Ujian`} />

            {/* Full-screen focus mode */}
            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Question navigation grid */}
                    <div className="glass rounded-2xl p-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            {questions.map((q, i) => {
                                const answered = answers[q.id];
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrent(i)}
                                        className={`h-9 w-9 rounded-lg text-sm font-bold transition-all duration-200 ${
                                            i === current
                                                ? 'bg-brand-cyan text-brand-navy scale-110'
                                                : answered
                                                ? 'bg-brand-green/20 text-brand-green'
                                                : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                            Terjawab: {answeredCount} / {questions.length}
                        </p>
                    </div>

                    {/* Question card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3 }}
                            className="glass-strong rounded-3xl p-8"
                        >
                            <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-cyan">
                                Soal {current + 1} · {question.points} Poin
                            </span>

                            <h2 className="font-heading text-xl sm:text-2xl font-semibold text-white mt-4 mb-2">
                                {question.question_text}
                            </h2>

                            {question.code_snippet && (
                                <div className="bg-[#0d1117] rounded-xl border border-white/10 p-4 mb-6">
                                    <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">
                                        {question.code_snippet}
                                    </pre>
                                </div>
                            )}

                            {/* Options */}
                            <div className="space-y-3 mt-6">
                                {question.options.map((opt) => {
                                    const selected = answers[question.id] === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => selectOption(opt.id)}
                                            className={`w-full text-left rounded-2xl border p-4 flex items-center gap-4 transition-all duration-200 active:scale-[0.98] ${
                                                selected
                                                    ? 'border-brand-green bg-brand-green/10 shadow-[0_0_20px_rgba(0,255,102,0.15)]'
                                                    : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <span
                                                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
                                                    selected
                                                        ? 'border-brand-green bg-brand-green'
                                                        : 'border-white/25'
                                                }`}
                                            >
                                                {selected && (
                                                    <svg className="h-3.5 w-3.5 text-brand-navy" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className={`text-sm ${selected ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                {opt.option_text}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Navigation buttons */}
                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                                    disabled={current === 0}
                                    className="btn-ghost px-5 py-2.5 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    ← Sebelumnya
                                </button>

                                {isLast ? (
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        className="btn-primary px-6 py-2.5 text-sm"
                                    >
                                        Selesai &amp; Kirim Jawaban
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setCurrent((c) => c + 1)}
                                        className="btn-primary px-6 py-2.5 text-sm"
                                    >
                                        Selanjutnya →
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Confirm submit modal */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-sm px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-strong w-full max-w-md rounded-3xl p-8 text-center"
                        >
                            <div className="text-4xl mb-4">📤</div>
                            <h3 className="font-heading text-xl font-bold text-white">
                                Kirim Jawaban?
                            </h3>
                            <p className="mt-2 text-sm text-gray-400">
                                {answeredCount < questions.length
                                    ? `Masih ada ${questions.length - answeredCount} soal yang belum dijawab.`
                                    : 'Semua soal sudah terjawab.'}
                                {' '}Jawaban tidak bisa diubah setelah dikirim.
                            </p>

                            <div className="mt-6 flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="btn-ghost px-6 py-2.5 text-sm"
                                >
                                    Periksa Ulang
                                </button>
                                <button
                                    onClick={submitExam}
                                    className="btn-primary px-6 py-2.5 text-sm"
                                >
                                    Ya, Kirim
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
