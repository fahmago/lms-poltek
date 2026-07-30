import React from 'react';

// Fungsi helper untuk mem-parsing string data (misal: "01-11-2025:uuid-abc;02-11-2025:uuid-xyz")
function parseDateUuid(dataString) {
    if (!dataString || dataString.trim() === "") {
        return [];
    }
    return dataString.split(';').map(item => {
        const parts = item.split(':');
        return {
            date: parts[0],
            uuid: parts[1],
            poin: parts[2] !== undefined ? parts[2] : 'N/A'
        };
    });
}

export default function LaporanDatesModal({ isOpen, onClose, title, data }) {
    if (!isOpen) return null;

    // 'data' di sini adalah string 'dates_and_uuids' dari controller
    const reportList = parseDateUuid(data);

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {reportList.length > 0 ? (
                        <ul className="space-y-3">
                            {reportList.map((item, index) => (
                                <li key={index} className="flex items-center justify-between text-gray-700 p-2 border rounded-md">
                                    <span className='flex items-center justify-evenly'>
                                        <i className="fas fa-calendar-check fa-fw text-green-500 mr-3"></i>
                                        <span>{item.date}</span>
                                        <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                            {item.poin} Poin
                                        </span>
                                    </span>
                                    
                                    {/* Tombol Link ke Halaman Blade (buka tab baru) */}
                                    <a
                                        href={route('my.grafik.laporan_ibadah.show_detail', { uuid: item.uuid })}
                                        target="_blank" // Buka di tab baru
                                        rel="noopener noreferrer" // Keamanan
                                        className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-md hover:bg-blue-600"
                                    >
                                        Lihat Jawaban
                                        <i className="fas fa-external-link-alt fa-xs ml-2"></i>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">Tidak ada data tanggal laporan.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 text-right rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}