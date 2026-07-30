import React from 'react';

// TABEL REKAP MAHASISWA
const StudentRecapTable = ({ recapData, isLoading, onOpenModal }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
                <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-md w-full animate-pulse"></div>)}</div>
            </div>
        );
    }

    if (!recapData || recapData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak Ada Data</h3>
                <p className="mt-1 text-sm text-gray-500">Tidak ada mahasiswa yang absen pada periode ini.</p>
            </div>
        );
    }

    // Sel interaktif untuk menampilkan jumlah dan membuka modal
    const AbsensiCell = ({ count, onClick, colorClass }) => {
        if (count === 0) return <span className="text-gray-400">-</span>;
        return ( <button onClick={onClick} className="flex flex-col items-center w-full transition-transform transform hover:scale-110" title="Klik untuk lihat detail"><span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass.bg} ${colorClass.text}`}>{count} kali</span></button> );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase">Rekapitulasi Ketidakhadiran Mahasiswa</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">NIM</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Mahasiswa</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Kelas</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Pengajar</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-orange-600 uppercase tracking-wider">Sakit</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-600 uppercase tracking-wider">Izin</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-red-600 uppercase tracking-wider">Alpha</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recapData.map((mhs, index) => (
                            <tr key={mhs.nim + index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 text-center">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono text-center">{mhs.nim || '-'}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 text-left">{mhs.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 text-center">{mhs.nama_kelas}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 text-left">{mhs.nama_dosen}</td>
                                <td className="px-6 py-4 text-center text-sm"><AbsensiCell count={mhs.total_sakit} colorClass={{ bg: 'bg-orange-100', text: 'text-orange-800' }} onClick={() => onOpenModal(`Sakit: ${mhs.name} (${mhs.nama_kelas})`, mhs.dates_sakit)} /></td>
                                <td className="px-6 py-4 text-center text-sm"><AbsensiCell count={mhs.total_izin} colorClass={{ bg: 'bg-blue-100', text: 'text-blue-800' }} onClick={() => onOpenModal(`Izin: ${mhs.name} (${mhs.nama_kelas})`, mhs.dates_izin)} /></td>
                                <td className="px-6 py-4 text-center text-sm"><AbsensiCell count={mhs.total_alpha} colorClass={{ bg: 'bg-red-100', text: 'text-red-800' }} onClick={() => onOpenModal(`Alpha: ${mhs.name} (${mhs.nama_kelas})`, mhs.dates_alpha)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentRecapTable;