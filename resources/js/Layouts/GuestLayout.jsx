import { Link } from '@inertiajs/react';
const cendiksLogo = '/images/cendiks-logo.png';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-navy p-6">
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-brand-green/10 blur-[120px]" />
                <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-brand-cyan/10 blur-[120px]" />
            </div>

            <div className="relative z-10 w-full sm:max-w-md">
                <Link href="/" className="mb-8 flex justify-center">
                    <img src={cendiksLogo} alt="Cendiks Logo" className="h-20 w-auto" />
                </Link>

                <div className="glass-strong w-full overflow-hidden rounded-3xl p-8 shadow-2xl">
                    {children}
                </div>
            </div>
        </div>
    );
}