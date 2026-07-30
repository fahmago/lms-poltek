import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
// import react from '@vitejs/plugin-react'; // <-- Jangan lupa tambahkan ini jika belum ada
import path from 'path'; // <-- 1. Import modul 'path'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        // react(),
    ],
    resolve: {
        alias: {
            // '@': '/resources/js',
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    
});
