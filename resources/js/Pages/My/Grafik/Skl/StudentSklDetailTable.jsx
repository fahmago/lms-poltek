import React, { useState } from 'react';

const StudentSklDetailTable = ({ studentData, isLoading, currentParams }) => {
    // State Filter Tunggal (Values: 'all', 'not_started', 'in_progress', 'completed')
    const [activeFilter, setActiveFilter] = useState('all');

    const handlePrint = () => {
        if (!currentParams) return;

        // Tentukan Judul Berdasarkan Filter Aktif
        let judul = 'Rekapitulasi Capaian SKL Mahasiswa';
        if (activeFilter === 'not_started') judul = 'Laporan Mahasiswa Belum Mengerjakan Tugas';
        if (activeFilter === 'has_zero') judul = 'Laporan Mahasiswa Dengan Aspek Kosong';
        if (activeFilter === 'in_progress') judul = 'Laporan Mahasiswa Sedang Proses Pengerjaan';
        if (activeFilter === 'completed') judul = 'Laporan Mahasiswa Sudah Selesai SKL';

        const printParams = {
            ...currentParams,
            judul_laporan: judul,
            filter_status: activeFilter // Kita kirim status filter ini ke backend
        };

        const url = route('my.grafik.skl.skl_data.print', printParams);
        window.open(url, '_blank');
    };

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
                <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div>
                <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full animate-pulse"></div>)}</div>
            </div>
        );
    }

    if (!studentData || studentData.length === 0) return null;

    // --- LOGIKA FILTERING BARU ---
    const displayedData = studentData.filter(mhs => {
        const scores = Object.values(mhs.scores);

        switch (activeFilter) {
            case 'not_started':
                // LOGIKA BARU: Harus SEMUA aspek nilainya 0
                // .every() mengecek apakah SEMUA elemen memenuhi syarat
                return scores.every(s => s.actual === 0);

            case 'has_zero':
                // [BARU] Minimal ada SATU aspek yang nilainya 0
                return scores.some(s => s.target > 0 && s.actual === 0);

            case 'in_progress':
                // LOGIKA BARU: 
                // 1. Dia BELUM Selesai (is_incomplete = true)
                // 2. TAPI dia sudah ada angka > 0 (artinya bukan 'not_started')
                const isAllZero = scores.every(s => s.actual === 0);
                return mhs.is_incomplete && !isAllZero;

            case 'completed':
                // LOGIKA: Semua sudah selesai
                return !mhs.is_incomplete;

            default: // 'all'
                return true;
        }
    });

    const ScoreCell = ({ actual, target }) => {
        if (target === 0) return <span className="text-gray-300 text-xs">-</span>;

        let colorClass = '';
        let titleText = '';

        if (actual >= target) {
            colorClass = 'bg-green-100 text-green-800 border-green-200 font-bold';
            titleText = 'Sudah Selesai';
        } else if (actual > 0) {
            colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200 font-bold';
            titleText = `Proses: ${actual}/${target}`;
        } else {
            colorClass = 'bg-red-100 text-red-800 border-red-200 font-bold';
            titleText = 'Belum Mengerjakan';
        }

        return (
            <span title={titleText} className={`px-2 py-1 inline-flex text-xs leading-5 rounded-md border ${colorClass} cursor-help`}>
                {actual} / {target}
            </span>
        );
    };

    // Component Tombol Filter agar kodingan rapi
    const FilterButton = ({ id, label, icon, colorBase, title = '' }) => {
        const isActive = activeFilter === id;

        // Mapping warna tombol berdasarkan state active/inactive
        const styles = {
            red: isActive ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-600 border-red-200 hover:bg-red-50',
            orange: isActive ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50', // Warna baru untuk has_zero
            yellow: isActive ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50',
            green: isActive ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-200 hover:bg-green-50',
            gray: isActive ? 'bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
        };

        return (
            <button
                title={title}
                onClick={() => setActiveFilter(isActive ? 'all' : id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition shadow-sm ${styles[colorBase]}`}
            >
                <i className={`fas ${icon}`}></i>
                <span>{label}</span>
                {isActive && <i className="fas fa-check ml-1 text-[10px]"></i>}
            </button>
        );
    };

    const getEmptyMessage = () => {
        switch (activeFilter) {
            case 'not_started':
                return {
                    title: "Tidak Ada Mahasiswa 'Kosong Total'",
                    desc: "Semua mahasiswa setidaknya sudah mulai mengerjakan satu atau lebih tugas. Tidak ada yang kosong sama sekali."
                };
            case 'has_zero':
                return {
                    title: "Semua Aspek Terisi",
                    desc: "Luar biasa! Tidak ada mahasiswa yang memiliki progress yang kosong (0) pada aspek manapun."
                };
            case 'in_progress':
                return {
                    title: "Tidak Ada yang Sedang Proses",
                    desc: "Tidak ditemukan mahasiswa dengan status pengerjaan 'sedang berjalan'. Mahasiswa mungkin sudah selesai semua atau belum mulai sama sekali."
                };
            case 'completed':
                return {
                    title: "Belum Ada yang Selesai",
                    desc: "Saat ini belum ada mahasiswa yang menyelesaikan seluruh aspek penilaian SKL."
                };
            default: // 'all'
                return {
                    title: "Data Tidak Ditemukan",
                    desc: "Tidak ada data mahasiswa yang tersedia untuk kelas dan angkatan ini."
                };
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 uppercase">Detail Pencapaian SKL</h3>
                </div>

                {/* GROUP TOMBOL FILTER & PRINT */}
                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">

                    {/* 1. Tombol Cetak (Selalu Ada) */}
                    <button
                        onClick={handlePrint}
                        disabled={!currentParams}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg border border-slate-800 hover:bg-slate-700 transition shadow-sm mr-2"
                    >
                        <i className="fas fa-print"></i>
                        <span>Cetak</span>
                    </button>

                    <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>

                    {/* 2. Tombol Filter Seragam */}
                    <FilterButton id="not_started" label="Belum" icon="fa-times-circle" colorBase="red" title="Belum Mengerjakan" />
                    <FilterButton id="has_zero" label="Ada Kosong" icon="fa-exclamation-circle" colorBase="orange" title="Minimal ada satu aspek bernilai 0" />
                    <FilterButton id="in_progress" label="Proses" icon="fa-hourglass-half" colorBase="yellow" title="Sedang Proses" />
                    <FilterButton id="completed" label="Selesai" icon="fa-check-circle" colorBase="green" title="Sudah Selesai" />

                    {/* Tombol Reset (Muncul jika ada filter aktif) */}
                    {activeFilter !== 'all' && (
                        <button onClick={() => setActiveFilter('all')} className="text-xs text-gray-500 hover:text-gray-700 underline ml-1">
                            Reset
                        </button>
                    )}
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
                                        {/* <div className="text-sm font-bold text-gray-800 mb-[6px]">{mhs.name}</div> */}
                                        <a
                                            href={route('my.detail.skl.detail_mahasiswa', {
                                                mahasiswaUuid: mhs.mhs_uuid || 0,
                                                kelasUuid: mhs.kelas_harian_uuid || 0
                                            })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:no-underline mb-[6px] block cursor-pointer"
                                            title="Klik untuk lihat laporan detail skl mahasiswa"
                                        >
                                            {mhs.name}
                                        </a>
                                        <div className="text-xs text-gray-500 tracking-wide">{mhs.nim}</div>
                                    </td>
                                    <td className="px-4 py-3 cursor-default">
                                        <div className="text-xs font-semibold text-gray-700 mb-[6px]">{mhs.nama_kelas}</div>
                                        <div className="text-xs text-gray-400 truncate w-24" title={mhs.nama_dosen}><i className="fas fa-chalkboard-teacher mr-1"></i>{mhs.nama_dosen}</div>
                                    </td>
                                    <td className="px-4 py-3 text-center bg-red-50/30"><ScoreCell actual={mhs.scores.pekanan.actual} target={mhs.scores.pekanan.target} /></td>
                                    <td className="px-4 py-3 text-center bg-blue-50/30"><ScoreCell actual={mhs.scores.project.actual} target={mhs.scores.project.target} /></td>
                                    <td className="px-4 py-3 text-center bg-yellow-50/30"><ScoreCell actual={mhs.scores.portofolio.actual} target={mhs.scores.portofolio.target} /></td>
                                    <td className="px-4 py-3 text-center bg-teal-50/30"><ScoreCell actual={mhs.scores.buku.actual} target={mhs.scores.buku.target} /></td>
                                    <td className="px-4 py-3 text-center bg-purple-50/30"><ScoreCell actual={mhs.scores.sertifikat.actual} target={mhs.scores.sertifikat.target} /></td>
                                </tr>
                            ))
                        ) : (
                            // <tr>
                            //     <td colSpan="8" className="px-6 py-10">
                            //         <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl py-10 bg-gray-50/50">
                            //             <svg
                            //                 xmlns="http://www.w3.org/2000/svg"
                            //                 className="h-20 w-20 text-gray-300 mb-5"
                            //                 fill="none"
                            //                 viewBox="0 0 24 24"
                            //                 stroke="currentColor"
                            //                 strokeWidth={1.4}
                            //             >
                            //                 <path
                            //                     strokeLinecap="round"
                            //                     strokeLinejoin="round"
                            //                     d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                            //                 />
                            //             </svg>
                            //             <h3 className="text-xl font-semibold text-gray-700">Tidak Ada Data</h3>
                            //             <p className="text-sm text-gray-500 mt-2">
                            //                 Coba ubah filter atau cek kembali data yang tersedia.
                            //             </p>
                            //         </div>
                            //     </td>
                            // </tr>
                            <tr>
                                <td colSpan="8" className="px-6 py-12">
                                    <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl py-12 bg-gray-50/50">

                                        {/* Ikon Dinamis (Opsional, bisa diubah warna/icon sesuai filter) */}
                                        <div className={`p-4 rounded-full mb-4 ${activeFilter === 'completed' ? 'bg-green-100 text-green-500' :
                                                activeFilter === 'not_started' ? 'bg-red-100 text-red-500' :
                                                    'bg-gray-100 text-gray-400'
                                            }`}>
                                            {activeFilter === 'completed' ? (
                                                <i className="fas fa-medal text-3xl"></i>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Teks Dinamis dari Fungsi getEmptyMessage */}
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {getEmptyMessage().title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-2 max-w-md text-center leading-relaxed">
                                            {getEmptyMessage().desc}
                                        </p>

                                        {/* Tombol Reset Kecil jika bukan 'all' */}
                                        {activeFilter !== 'all' && (
                                            <button
                                                onClick={() => setActiveFilter('all')}
                                                className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                                            >
                                                <i className="fas fa-sync-alt"></i> Tampilkan Semua Data
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap justify-end items-center gap-3 md:gap-6">
                <span className="italic text-gray-400">Keterangan:</span>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-100 border border-red-200 block"></span><span>Belum Mengerjakan</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-100 border border-yellow-200 block"></span><span>Sedang Proses</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-100 border border-green-200 block"></span><span>Sudah Selesai</span></div>
            </div>
        </div>
    );
};

export default StudentSklDetailTable;
// StudentSklDetailTable3 ada backupannya