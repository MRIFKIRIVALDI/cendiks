import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    green: '#FF9933',
                    cyan: '#3399FF',
                    navy: '#0B0F19',
                    obsidian: '#111827',
                    glass: 'rgba(17, 24, 39, 0.7)',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
                heading: ['var(--font-space-grotesk)', ...defaultTheme.fontFamily.sans],
                mono: ['var(--font-jetbrains-mono)', ...defaultTheme.fontFamily.mono],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out infinite 2s',
                'glow': 'glow 3s ease-in-out infinite',
                'spin-slow': 'spin 12s linear infinite',
                'marquee': 'marquee 20s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.1)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
        },
    },
    plugins: [forms],
};
