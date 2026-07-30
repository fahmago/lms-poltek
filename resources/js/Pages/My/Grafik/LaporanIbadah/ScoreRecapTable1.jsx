import React, { useState } from 'react';

export default function ScoreRecapTable({
    recapData,
    isLoading,
    onOpenModal,
    hasFemale
}) {
    const [showModal, setShowModal] = useState(false);
    const [haidData, setHaidData] = useState({ nama: '', tanggal: [] });

    const openHaidModal = (nama, tanggalStr) => {
        const tanggalArray = tanggalStr ? tanggalStr.split(',') : [];
        setHaidData({ nama, tanggal: tanggalArray });
        setShowModal(true);
    };

    const closeHaidModal = () => {
        setShowModal(false);
    };

    if (isLoading && !recapData) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <i className="fas fa-spinner fa-spin fa-2x text-blue-500"></i>
                <p className="mt-2 text-gray-600">Memuat rekap skor...</p>
            </div>
        );
    }

    if (!recapData || recapData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-gray-500">Tidak ada data rekap skor untuk ditampilkan.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 uppercase">
                Tabel Rekap Total Poin Mahasiswa
            </h3>
            <div className="overflow-x-auto relative rounded-lg border">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-center w-12">No</th>
                            <th className="py-3 px-6 text-center">NIM</th>
                            <th className="py-3 px-6 text-center">Nama Mahasiswa</th>
                            <th className="py-3 px-6 text-center">Total Poin</th>
                            <th className="py-3 px-6 text-center">Total Laporan</th>
                            <th className="py-3 px-6 text-center">Status Standar</th>
                            {hasFemale && (
                                <th className="py-3 px-6 text-center">Durasi Haid</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {recapData.map((mhs, index) => (
                            <tr key={mhs.nim || index} className="bg-white border-b hover:bg-gray-50">
                                <td className="py-4 px-6 text-center">{index + 1}</td>
                                <td className="py-4 px-6 text-center">{mhs.nim || '-'}</td>
                                <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                                    {mhs.nama_mahasiswa}
                                    {mhs.gender === 'L' && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">L</span>}
                                    {mhs.gender === 'P' && <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded">P</span>}
                                </td>
                                <td className="py-4 px-6 text-center font-bold text-blue-600">{mhs.total_poin}</td>
                                <td className="py-4 px-6 text-center">
                                    {mhs.total_laporan > 0 ? (
                                        <button
                                            onClick={() => onOpenModal(mhs.nama_mahasiswa, mhs.dates_and_uuids)}
                                            className="text-blue-600 font-bold hover:text-blue-800 hover:underline"
                                        >
                                            {mhs.total_laporan} kali
                                            <i className="fas fa-eye fa-xs ml-2"></i>
                                        </button>
                                    ) : (
                                        <span className="text-gray-500">0 kali</span>
                                    )}
                                </td>

                                <td className="py-4 px-6 text-center">
                                    {(() => {
                                        const PASSING = 80;
                                        const PERFECT = 100;

                                        if (mhs.poin_standar_individu === 0) {
                                            if (mhs.total_poin === 0)
                                                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">N/A</span>;
                                            return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Invalid</span>;
                                        }

                                        const percentage = (mhs.total_poin / mhs.poin_standar_individu) * 100;
                                        if (percentage >= PERFECT)
                                            return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Sangat Baik ({percentage.toFixed(1)}%)</span>;
                                        if (percentage >= PASSING)
                                            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Baik ({percentage.toFixed(1)}%)</span>;
                                        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">Belum ({percentage.toFixed(1)}%)</span>;
                                    })()}
                                </td>

                                {hasFemale && (
                                    <td className="py-4 px-6 text-center">
                                        {mhs.gender === 'L' ? (
                                            <span className="text-gray-400">N/A</span>
                                        ) : mhs.total_haid > 0 ? (
                                            <button
                                                onClick={() => openHaidModal(mhs.nama_mahasiswa, mhs.dates_haid)}
                                                className="text-pink-600 font-bold hover:text-pink-800 hover:underline"
                                            >
                                                {mhs.total_haid} hari
                                                <i className="fas fa-eye fa-xs ml-2"></i>
                                            </button>
                                        ) : (
                                            <span className="text-gray-500">0 hari</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Tanggal Haid */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
                    <div className="bg-gradient-to-b from-white to-pink-50 shadow-2xl rounded-2xl p-6 w-[90%] max-w-md transform animate-slideUp">
                        <h4 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                            🩸 Tanggal Haid – <span className="text-pink-600">{haidData.nama}</span>
                        </h4>

                        {haidData.tanggal.length > 0 ? (
                            <div className="max-h-56 overflow-y-auto pr-2">
                                <ul className="grid grid-cols-2 gap-2">
                                    {haidData.tanggal.map((tgl, i) => (
                                        <li
                                            key={i}
                                            className="bg-pink-100 text-pink-800 text-sm font-medium px-3 py-2 rounded-lg text-center shadow-sm hover:bg-pink-200 transition"
                                        >
                                            {tgl}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Tidak ada tanggal haid tercatat.
                            </p>
                        )}

                        <div className="mt-6 text-right">
                            <button
                                onClick={closeHaidModal}
                                className="bg-pink-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
