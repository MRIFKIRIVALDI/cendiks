import { useEffect } from 'react';

export default function useLenis() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let lenis = null;
        let frame = null;
        let cancelled = false;

        import('lenis').then(({ default: Lenis }) => {
            if (cancelled) return;
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 2,
            });

            function raf(time) {
                lenis.raf(time);
                frame = requestAnimationFrame(raf);
            }
            frame = requestAnimationFrame(raf);
        });

        return () => {
            cancelled = true;
            if (frame) cancelAnimationFrame(frame);
            if (lenis) lenis.destroy();
        };
    }, []);
}
