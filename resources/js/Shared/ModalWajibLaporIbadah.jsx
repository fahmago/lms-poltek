import React from "react";
import { Link } from "@inertiajs/inertia-react";

export default function ModalWajibLaporIbadah({ isOpen, tanggalKosong = [], onClose }) {
    if (!isOpen) return null;

    const oldestMissingDate = tanggalKosong.length > 0 ? tanggalKosong[0] : null;

    // Format tanggal: "Rabu, 12 November 2025"
    const formatTanggal = (dateString) => {
        try {
            const date = new Date(dateString + "T00:00:00");
            return date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="font-poppins fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-3xl shadow-2xl 
                            border border-gray-100 dark:border-gray-700 w-full max-w-lg transform transition-all 
                            duration-300 scale-100 animate-modal-pop p-8">
                
                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    aria-label="Tutup"
                >
                    <i className="fa fa-times text-xl"></i>
                </button>

                {/* Header Icon */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-500 to-pink-400 
                                    flex items-center justify-center shadow-lg animate-bounce-slow">
                        <i className="fa fa-exclamation-circle text-white text-4xl"></i>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-center mt-6 text-2xl font-bold tracking-tight">
                    ⚠️ Laporan Ibadah Terlewat
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                    Beberapa tanggal belum diisi laporan ibadah harian.  
                    Mohon segera dilengkapi agar laporan Anda tetap konsisten.
                </p>

                {/* Daftar Tanggal */}
                <div className="mt-6 bg-gradient-to-br from-red-50 to-white dark:from-red-900/30 dark:to-gray-900 
                                border border-red-100 dark:border-red-800/50 rounded-2xl p-5 max-h-56 overflow-y-auto shadow-inner">
                    {tanggalKosong.length > 0 ? (
                        <ul className="divide-y divide-red-100 dark:divide-red-800/50">
                            {tanggalKosong.map((tgl, idx) => (
                                <li key={idx} className="py-2 flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full flex-shrink-0"></div>
                                    <span className="font-medium capitalize">{formatTanggal(tgl)}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 italic text-sm">
                            Tidak ada tanggal yang terlewat 🎉
                        </p>
                    )}
                </div>

                {/* Tombol Aksi */}
                {oldestMissingDate && (
                    <div className="mt-8">
                        <Link
                            as="button"
                            href={route("mhs.laporan-ibadah.create", { tanggal: oldestMissingDate })}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                                       text-white font-semibold py-3 px-6 rounded-xl shadow-md
                                       transition-transform duration-300 transform hover:scale-[1.02]
                                       focus:outline-none focus:ring-4 focus:ring-red-300/60"
                        >
                            <i className="fa fa-pen mr-2"></i>
                            Isi Laporan Sekarang
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes modal-pop {
                    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modal-pop {
                    animation: modal-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite;
                }
            `}</style>
        </div>
    );
}
