import React from 'react';

// MODAL UNTUK MENAMPILKAN DETAIL TANGGAL
const AttendanceDatesModal = ({ isOpen, onClose, title, dates }) => {
    if (!isOpen) return null;

    // String tanggal sekarang hanya berisi tanggal, dipisah koma
    const dateList = dates ? dates.split(', ') : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                    {dateList.length > 0 ? (
                        <ul className="space-y-2">
                            {dateList.map((date, index) => (
                                <li key={index} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-md">
                                    <i className="far fa-calendar-alt text-blue-500 mr-3"></i>
                                    <span className="font-mono">{date}</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500 text-center">Tidak ada data tanggal.</p>}
                </div>
                <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300">Tutup</button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDatesModal;