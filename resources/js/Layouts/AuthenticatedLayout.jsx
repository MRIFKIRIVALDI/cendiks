import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
const cendiksLogo = '/images/cendiks-logo.png';
const sertifikasiLogo = '/images/logo-sertifikasi.png';

function NavItem({ href, active, children, icon }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                active
                    ? 'bg-brand-green/10 text-brand-green'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }`}
        >
            {icon && <img src={icon} alt="" className="h-4 w-4 object-contain" />}
            {children}
        </Link>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);
    const [menu, setMenu] = useState(false);
    const [theme, setTheme] = useState(
        typeof window !== 'undefined' && localStorage.getItem('theme') === 'light' ? 'light' : 'dark'
    );

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const nav = [
        { label: 'Dashboard', href: '/dashboard', active: route().current('dashboard') },
        { label: 'Kursus', href: '/kursus', active: route().current('courses.*') },
        { label: 'Sertifikasi', href: '/ujian-sertifikasi', active: route().current('exams.*'), icon: sertifikasiLogo },
    ];

    return (
        <div
            data-theme={theme}
            className={`relative min-h-screen transition-colors duration-300 ${
                theme === 'dark' ? 'bg-brand-navy text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}
        >
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="grid-bg radial-fade absolute inset-0 opacity-60" />
                <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-green/10 blur-[120px]" />
                <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[120px]" />
            </div>

            <nav className="sticky top-4 z-50 mx-4 mt-4 rounded-2xl glass-strong">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                        <button
                            onClick={toggleTheme}
                            className="relative hidden sm:flex p-2 rounded-xl bg-white/10 backdrop-blur-md text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                            <Link href="/" className="flex items-center gap-2">
                                <img src={cendiksLogo} alt="Cendiks Logo" className="h-9 w-auto" />
                                <span className="font-heading text-lg font-bold tracking-tight text-white">
                                    Cendiks
                                </span>
                            </Link>

                            <div className="hidden items-center gap-1 sm:flex">
                                {nav.map((item) => (
                                    <NavItem key={item.href} {...item}>
                                        {item.label}
                                    </NavItem>
                                ))}
                            </div>
                        </div>

                        {/* Desktop user menu */}
                        <div className="relative hidden sm:block">
                            <button
                                type="button"
                                onClick={() => setMenu((v) => !v)}
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-200 transition hover:border-brand-green/40"
                            >
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-green/20 text-xs font-bold text-brand-green">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                {user.name}
                                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            {menu && (
                                <div
                                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-brand-obsidian shadow-2xl"
                                    onMouseLeave={() => setMenu(false)}
                                >
                                    <div className="border-b border-white/10 px-4 py-3">
                                        <p className="text-sm font-semibold text-white">{user.name}</p>
                                        <p className="truncate text-xs text-gray-400">{user.email}</p>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                                    >
                                        Profil
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="block w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10"
                                    >
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setOpen((v) => !v)}
                            className="rounded-lg p-2 text-gray-300 hover:bg-white/5 sm:hidden"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {open && (
                    <div className="space-y-1 border-t border-white/10 px-4 py-3 sm:hidden">
                        {nav.map((item) => (
                            <NavItem key={item.href} {...item}>
                                {item.label}
                            </NavItem>
                        ))}
                        <div className="border-t border-white/10 pt-3">
                            <Link href={route('profile.edit')} className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">
                                Profil
                            </Link>
                            <Link href={route('logout')} method="post" as="button" className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10">
                                Keluar
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="relative z-10 mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    {header}
                </header>
            )}

            <main className="relative z-10">{children}</main>
        </div>
    );
}
