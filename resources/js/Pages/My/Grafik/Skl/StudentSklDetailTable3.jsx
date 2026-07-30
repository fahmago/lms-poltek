import React, { useState } from 'react';

const StudentSklDetailTable = ({ studentData, isLoading, currentParams }) => {
    const [filterIncompleteOnly, setFilterIncompleteOnly] = useState(false);
    const handlePrint = () => {
        if (!currentParams) return;

        const printParams = {
            ...currentParams,
            // Ubah judul sesuai filter
            judul_laporan: filterIncompleteOnly 
                ? 'Laporan Mahasiswa Yang Belum Tuntas SKL' 
                : 'Rekapitulasi Capaian SKL Mahasiswa',
            // Kirim status filter ke backend (1 = ya, 0 = tidak)
            only_incomplete: filterIncompleteOnly ? 1 : 0 
        };

        const url = route('my.grafik.skl.skl_data.print', printParams);
        window.open(url, '_blank');
    };

    // Skeleton Loading State
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
                <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded-md w-full animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!studentData || studentData.length === 0) return null;

    // Filter Logic
    const displayedData = filterIncompleteOnly 
        ? studentData.filter(mhs => mhs.is_incomplete) 
        : studentData;

    // Komponen Kecil untuk Sel Nilai (Actual / Target)
    // const ScoreCell = ({ actual, target }) => {
    //     if (target === 0) return <span className="text-gray-300 text-xs">-</span>;
        
    //     const isComplete = actual >= target;
    //     const colorClass = isComplete 
    //         ? 'bg-green-100 text-green-800 border-green-200 font-bold' 
    //         : 'bg-red-100 text-red-800 border-red-200 font-bold';

    //     return (
    //         <span title={`Menyelesaikan ${actual} dari ${target} tugas`} className={`px-2 py-1 inline-flex text-xs leading-5 rounded-md border ${colorClass} cursor-help`}>
    //             {actual} / {target}
    //         </span>
    //     );
    // };
    const ScoreCell = ({ actual, target }) => {
        if (target === 0) return <span className="text-gray-300 text-xs">-</span>;
        
        let colorClass = '';
        let titleText = '';

        if (actual >= target) {
            // KONDISI 1: SUDAH SELESAI (Hijau)
            colorClass = 'bg-green-100 text-green-800 border-green-200 font-bold';
            titleText = 'Sudah Selesai';
        } else if (actual > 0) {
            // KONDISI 2: SEDANG PROSES (Kuning/Orange)
            colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200 font-bold';
            titleText = `Menyelesaikan ${actual} dari ${target} tugas`;
        } else {
            // KONDISI 3: BELUM MENGERJAKAN (Merah)
            colorClass = 'bg-red-100 text-red-800 border-red-200 font-bold';
            titleText = 'Belum Mengerjakan';
        }

        return (
            <span 
                title={titleText} 
                className={`px-2 py-1 inline-flex text-xs leading-5 rounded-md border ${colorClass} cursor-help`}
            >
                {actual} / {target}
            </span>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 uppercase">Detail Pencapaian SKL Mahasiswa</h3>
                    {/* <p className="text-sm text-gray-500">Daftar kelengkapan tugas per individu</p> */}
                </div>
                
                {/* Toggle Filter Checkbox */}
                {/* <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 mt-4 md:mt-0">
                    <input 
                        type="checkbox" 
                        id="filterIncomplete" 
                        checked={filterIncompleteOnly}
                        onChange={(e) => setFilterIncompleteOnly(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="filterIncomplete" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Hanya tampilkan yang <span className="text-red-600 font-bold">Belum Tuntas</span>
                    </label>
                </div> */}
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    {/* TOMBOL PRINT BARU */}
                    <button
                        onClick={handlePrint}
                        disabled={!currentParams}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fas fa-print"></i>
                        <span>Cetak Laporan</span>
                    </button>

                    {/* Filter Checkbox (Yg lama) */}
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        <input 
                            type="checkbox" 
                            id="filterIncomplete" 
                            checked={filterIncompleteOnly}
                            onChange={(e) => setFilterIncompleteOnly(e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                        />
                        <label htmlFor="filterIncomplete" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                            Hanya tampilkan yang <span className="text-red-600 font-bold">Belum Tuntas</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider w-12">No</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Mahasiswa</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Kelas</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-red-600 uppercase tracking-wider">Tugas Pekanan</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-blue-600 uppercase tracking-wider">Project Semester</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-yellow-600 uppercase tracking-wider">Portofolio</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-teal-600 uppercase tracking-wider">Buku / Cv</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-purple-600 uppercase tracking-wider">Sertifikat</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedData.length > 0 ? (
                            displayedData.map((mhs, index) => (
                                <tr key={index} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-500 text-center">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-bold text-gray-800 mb-[6px]">{mhs.name}</div>
                                        <div className="text-xs text-gray-500 tracking-wide">{mhs.nim}</div>
                                    </td>
                                    <td className="px-4 py-3 cursor-default">
                                        <div className="text-xs font-semibold text-gray-700 mb-[6px]">{mhs.nama_kelas}</div>
                                        <div className="text-xs text-gray-400 truncate w-32" title={mhs.nama_dosen}>
                                            <i className="fas fa-chalkboard-teacher mr-1"></i>
                                            {mhs.nama_dosen}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center bg-red-50/30">
                                        <ScoreCell actual={mhs.scores.pekanan.actual} target={mhs.scores.pekanan.target} />
                                    </td>
                                    <td className="px-4 py-3 text-center bg-blue-50/30">
                                        <ScoreCell actual={mhs.scores.project.actual} target={mhs.scores.project.target} />
                                    </td>
                                    <td className="px-4 py-3 text-center bg-yellow-50/30">
                                        <ScoreCell actual={mhs.scores.portofolio.actual} target={mhs.scores.portofolio.target} />
                                    </td>
                                    <td className="px-4 py-3 text-center bg-teal-50/30">
                                        <ScoreCell actual={mhs.scores.buku.actual} target={mhs.scores.buku.target} />
                                    </td>
                                    <td className="px-4 py-3 text-center bg-purple-50/30">
                                        <ScoreCell actual={mhs.scores.sertifikat.actual} target={mhs.scores.sertifikat.target} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500 flex flex-col items-center justify-center">
                                    <i className="fas fa-check-circle text-green-500 text-4xl mb-3"></i>
                                    <span>Tidak ada data mahasiswa yang sesuai filter ini.</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* <div className="mt-4 text-xs text-gray-400 italic text-right">
                * Angka <span className="text-red-500 font-bold">MERAH</span> menandakan jumlah pengumpulan masih di bawah target.
            </div> */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap justify-end items-center gap-3 md:gap-6">
                <span className="italic text-gray-400">Keterangan:</span>
                
                {/* Legend Merah */}
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200 block"></span>
                    <span>Belum Mengerjakan</span>
                </div>

                {/* Legend Kuning */}
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200 block"></span>
                    <span>Sedang Proses</span>
                </div>

                {/* Legend Hijau */}
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 block"></span>
                    <span>Sudah Selesai</span>
                </div>
            </div>
        </div>
    );
};

export default StudentSklDetailTable;