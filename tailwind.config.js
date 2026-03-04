/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                studio: {
                    dark: '#0f1011',
                    gold: '#c5a059',
                    neutral: '#faf9f6',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
            },
            animation: {
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'slide-up': 'slide-up 0.8s ease-out forwards',
                'scale-in': 'scale-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
