import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Cendiks" />

            <div className="mb-8 text-center">
                <h1 className="font-heading text-2xl font-bold text-white">Selamat Datang</h1>
                <p className="mt-2 text-sm text-gray-400">Masuk untuk melanjutkan belajar Python.</p>
            </div>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-brand-green">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2 ms-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        className="w-full rounded-2xl border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 focus:border-brand-green focus:ring-brand-green transition-all"
                        placeholder="nama@email.com"
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="username"
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2 ms-1">
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-brand-green hover:underline"
                            >
                                Lupa sandi?
                            </Link>
                        )}
                    </div>
                    <input
                        type="password"
                        value={data.password}
                        className="w-full rounded-2xl border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 focus:border-brand-green focus:ring-brand-green transition-all"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            className="rounded border-white/10 bg-white/5 text-brand-green focus:ring-brand-green"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-400 group-hover:text-gray-300 transition">Ingat saya</span>
                    </label>
                </div>

                <button
                    className="btn-primary w-full py-4 text-sm font-bold shadow-[0_0_30px_rgba(0,255,102,0.2)]"
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'Masuk Sekarang'}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
                Belum punya akun?{' '}
                <Link href={route('register')} className="text-brand-green font-semibold hover:underline">
                    Daftar Gratis
                </Link>
            </p>
        </GuestLayout>
    );
}
