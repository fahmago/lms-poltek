import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const SimplePagination = ({ data }) => {
    const { url } = usePage(); // Mendapatkan path URL dasar, misal: /my/dashboard

    // Jika tidak ada data atau hanya ada satu halaman, jangan tampilkan apa-apa
    if (!data || data.total === 0 || data.total <= data.per_page) {
        return null;
    }

    const currentPage = data.current_page;
    const lastPage = data.last_page;

    /**
     * Fungsi untuk navigasi ke halaman tertentu sambil menjaga URL tetap bersih
     * dan mempertahankan parameter filter/pencarian yang sudah ada.
     */
    const handleNavigate = (page) => {
        if (!page || page < 1 || page > lastPage) return;

        // Ambil semua query parameter yang ada di URL saat ini (misal: ?q=... )
        const queryParams = Object.fromEntries(new URLSearchParams(window.location.search));

        // Lakukan kunjungan Inertia secara manual
        Inertia.get(
            url, // URL dasar tanpa parameter
            {
                ...queryParams, // Sertakan kembali semua parameter yang sudah ada
                page: page,     // Tambahkan atau ganti parameter 'page'
            },
            {
                preserveScroll: true,
                replace: true, // <-- Kunci utama: Ganti state history, jangan buat baru
            }
        );
    };

    return (
        <div className="flex items-center justify-between mt-4">
            {/* Tombol Sebelumnya */}
            <button
                onClick={() => handleNavigate(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <i className="fa fa-arrow-left"></i>
            </button>

            {/* Informasi Halaman */}
            <span className="text-xs text-gray-600">
                Hal {currentPage} dari {lastPage}
            </span>

            {/* Tombol Berikutnya */}
            <button
                onClick={() => handleNavigate(currentPage + 1)}
                disabled={currentPage >= lastPage}
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <i className="fa fa-arrow-right"></i>
            </button>
        </div>
    );
};

export default SimplePagination;