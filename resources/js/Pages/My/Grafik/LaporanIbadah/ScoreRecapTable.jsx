import React, { useState } from 'react';

export default function ScoreRecapTable({
    recapData,
    isLoading,
    onOpenModal,
    hasFemale,
    startDate,
    endDate
}) {
    const [showModal, setShowModal] = useState(false);
    const [haidData, setHaidData] = useState({ nama: '', tanggal: [] });

    const openHaidModal = (nama, tanggalStr) => {
        const tanggalArray = tanggalStr ? tanggalStr.split(', ') : []; // Split by comma AND space
        setHaidData({ nama, tanggal: tanggalArray });
        setShowModal(true);
    };

    const closeHaidModal = () => {
        setShowModal(false);
    };

    // --- FUNGSI BARU UNTUK WARNA STATUS ---
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Optimal':
                return "bg-blue-100 text-blue-700";
            case 'Cukup':
                return "bg-green-100 text-green-700";
            case 'Kurang':
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    // --- AKHIR FUNGSI BARU ---

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
    // console.table(recapData);
    // console.log(recapData);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 uppercase">
                Tabel Rekap Persentase Mahasiswa
            </h3>
            <div className="overflow-x-auto relative rounded-lg border">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="py-3 px-6 text-center w-4">No</th>
                            {/* <th className="py-3 px-6 text-center">NIM</th> */}
                            <th className="px-4 py-3 text-center">Nama Mahasiswa</th>
                            <th className="px-4 py-3 text-center">Kelas</th>
                            <th className="py-3 px-6 text-center">Total Poin</th>
                            <th className="py-3 px-6 text-center">Standar</th>
                            <th className="py-3 px-6 text-center">Laporan</th>
                            {hasFemale && (
                                <th className="py-3 px-6 text-center min-w-20">Haid</th>
                            )}
                            <th className="py-3 px-6 text-center">Persen</th>
                            <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recapData.map((mhs, index) => (
                            <tr key={mhs.nim || index} className="bg-white border-b hover:bg-gray-50">
                                <td className="py-4 px-6 text-center font-bold">{index + 1}</td>
                                {/* <td className="py-4 px-6 text-center">{mhs.nim || '-'}</td> */}
                                <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-4">

                                        {/* KOLOM 1 — Nama + NIM */}
                                        <div>
                                            <a
                                                href={route('my.grafik.laporan_ibadah.student_detail_data', {
                                                    mahasiswaUuid: mhs.mhs_uuid || 0,
                                                    startDate: startDate || 0,
                                                    endDate: endDate || 0,
                                                    kelasUuid: mhs.kelas_harian_uuid || null
                                                })}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:no-underline cursor-pointer"
                                                title="Klik untuk lihat laporan detail skl mahasiswa"
                                            >
                                                {mhs.nama_mahasiswa}
                                            </a>

                                            {/* Tambahkan margin-top di sini */}
                                            <div className="text-xs text-gray-500 tracking-wide mt-1">
                                                {mhs.nim || '-'}
                                            </div>
                                        </div>

                                        {/* KOLOM 2 — Gender */}
                                        <div className='font-bold'>
                                            {mhs.gender === 'L' && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                    L
                                                </span>
                                            )}
                                            {mhs.gender === 'P' && (
                                                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-0.5 rounded">
                                                    P
                                                </span>
                                            )}
                                        </div>

                                    </div>
                                </td>
                                <td className="px-4 py-3 cursor-default">
                                    <div className="text-xs font-semibold text-gray-700 mb-[6px]">{mhs.nama_kelas}</div>
                                    <div className="text-xs text-gray-400 truncate w-24" title={mhs.nama_dosen}><i className="fas fa-chalkboard-teacher mr-1"></i>{mhs.nama_dosen}</div>
                                </td>
                                <td className="py-4 px-6 text-center font-bold text-blue-600">{mhs.total_poin}</td>
                                <td className="py-4 px-6 text-center text-gray-500">{mhs.poin_standar_individu}</td>
                                <td className="py-4 px-6 text-center">
                                    {mhs.total_laporan > 0 ? (
                                        <>
                                            <button
                                                onClick={() => onOpenModal(mhs.nama_mahasiswa, mhs.dates_and_uuids)}
                                                className="flex flex-col items-center w-full transition-transform transform hover:scale-110" title="Klik untuk lihat detail"
                                            >
                                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{mhs.total_laporan} kali</span>
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">0 kali</span>
                                    )}
                                </td>

                                {hasFemale && (
                                    <td className="py-4 px-6 text-center min-w-20">
                                        {mhs.gender === 'L' ? (
                                            <span className="text-gray-400">N/A</span>
                                        ) : mhs.total_haid > 0 ? (
                                            <button
                                                onClick={() => openHaidModal(mhs.nama_mahasiswa, mhs.dates_haid)}
                                                className="flex flex-col items-center w-full transition-transform transform hover:scale-110" title="Klik untuk lihat detail"
                                            >
                                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">{mhs.total_haid} hari</span>
                                            </button>
                                        ) : (
                                            <span className="text-gray-500">0 hari</span>
                                        )}
                                    </td>
                                )}

                                {/* --- KOLOM BARU DARI CONTROLLER --- */}
                                <td className="py-4 px-6 text-center font-bold text-lg text-gray-800">
                                    {mhs.persentase}%
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(mhs.status_standar)}`}>
                                        {mhs.status_standar}
                                    </span>
                                </td>
                                {/* --- AKHIR KOLOM BARU --- */}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Tanggal Haid (Sama) */}
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