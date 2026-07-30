import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import SelectField2 from '../../../../../Shared/Fields/SelectField2'; // <-- Tidak terpakai di kodemu

// ✅ 1. TAMBAHKAN 'getClassesRoute' sebagai prop
export default function FilterControlsIbadah({ 
    kategoriList, 
    angkatans, 
    onFilterChange, 
    isLoading,
    getClassesRoute // <-- TAMBAHKAN INI
}) {

    // ✅ PERUBAHAN: Ganti state 'kode_prodi' menjadi 'kategori_id'
    const [filters, setFilters] = useState({
        tahun_angkatan: '',
        // kode_prodi: '', // ❌ Hapus
        kategori_id: '', // ✅ PERUBAHAN
        semester: '',
    });
    const [timeFilter, setTimeFilter] = useState({ range: 7, start_date: '', end_date: '' });
    const [activeRange, setActiveRange] = useState(7);

    const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Ambil daftar kelas saat filter utama berubah
    useEffect(() => {
        // ✅ PERUBAHAN: Gunakan 'kategori_id'
        const { tahun_angkatan, kategori_id, semester } = filters;

        // ✅ PERUBAHAN: Cek 'kategori_id'
        if (tahun_angkatan && kategori_id && semester) {
            setIsLoadingClasses(true);
            
            // ✅ 2. GUNAKAN 'getClassesRoute' dari prop
            axios.get(route(getClassesRoute), { params: filters })
                .then(response => setAvailableClasses(response.data))
                .catch(error => console.error("Gagal mengambil data kelas:", error))
                .finally(() => setIsLoadingClasses(false));
        } else {
            setAvailableClasses([]);
        }
        setSelectedClasses([]); // Reset pilihan kelas
    }, [filters, getClassesRoute]); // ✅ 3. TAMBAHKAN 'getClassesRoute' di dependency array

    // ... (Tidak ada perubahan di handleCheckboxChange, handleSelectAllClasses, handleSubmit) ...
    const handleCheckboxChange = (e) => {
        const classId = parseInt(e.target.value);
        setSelectedClasses(prev => e.target.checked ? [...prev, classId] : prev.filter(id => id !== classId));
    };

    const handleSelectAllClasses = (e) => {
        setSelectedClasses(e.target.checked ? availableClasses.map(k => k.id) : []);
    };

    const handleSubmit = () => {
        let timeParams = {};
        if (activeRange === 'custom') {
            timeParams = { start_date: timeFilter.start_date, end_date: timeFilter.end_date };
        } else {
            timeParams = { range: activeRange };
        }
        onFilterChange({
            kelas_harian_ids: selectedClasses,
            ...timeParams
        });
    };

    const isAllSelected = availableClasses.length > 0 && selectedClasses.length === availableClasses.length;
    const canSubmit = !isLoading && selectedClasses.length > 0 && (activeRange === 'custom' ? (timeFilter.start_date && timeFilter.end_date) : true);


    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">

            {/* --- LANGKAH 1: TENTUKAN KRITERIA --- */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">1</span>
                    Tentukan Kriteria Kelas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-11">
                    {/* Filter Angkatan (Tetap Sama) */}
                    <select name="tahun_angkatan" value={filters.tahun_angkatan} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">-- Pilih Tahun --</option>
                        {angkatans.map(a => <option key={a.id} value={a.tahun_angkatan}>{a.tahun_angkatan}</option>)}
                        {/* {angkatans.map(a => <option key={a.id} value={a.tahun_angkatan}>{a.nama_angkatan} ({a.tahun_angkatan})</option>)} */}
                    </select>

                    {/* ✅ PERUBAHAN: Ganti Dropdown Prodi menjadi Kategori */}
                    <select name="kategori_id" value={filters.kategori_id} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">-- Pilih Kategori --</option>
                        {kategoriList.map(k => <option key={k.id} value={k.id}>{k.nama_kategori}</option>)}
                    </select>

                    {/* Filter Semester (Tetap Sama) */}
                    <select name="semester" value={filters.semester} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="">-- Pilih Semester --</option>
                        {[...Array(8)].map((_, i) => <option key={i + 1} value={i + 1}>Semester {i + 1}</option>)}
                    </select>
                </div>
            </div>

            {/* --- LANGKAH 2: PILIH KELAS --- */}
            <div className="space-y-3 pt-6 border-t">
                {/* ... (Tidak ada perubahan di bagian ini) ... */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${filters.semester ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>2</span>
                        Pilih Kelas Harian
                    </h3>
                    {availableClasses.length > 0 && (
                        <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                            <input type="checkbox" onChange={handleSelectAllClasses} checked={isAllSelected} className="rounded text-blue-600 focus:ring-blue-500" />
                            <span>Pilih Semua</span>
                        </label>
                    )}
                </div>
                <div className="pl-11">
                    {isLoadingClasses ? (
                        <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50"><i className="fas fa-spinner fa-spin mr-2"></i> Memuat kelas...</div>
                    ) : availableClasses.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 p-4 border rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                            {availableClasses.map(kelas => (
                                <label key={kelas.id} className="flex items-start space-x-2.5 cursor-pointer p-2 rounded-md hover:bg-gray-100">
                                    <input type="checkbox" value={kelas.id} checked={selectedClasses.includes(kelas.id)} onChange={handleCheckboxChange} className="rounded text-blue-600 mt-1 focus:ring-blue-500" />
                                    <div>
                                        <span className="text-sm font-medium text-gray-900">{kelas.nama_kelas}</span>
                                        <span className="block text-xs text-gray-500">{kelas.nama_dosen}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center gap-6 py-12 border rounded-lg bg-gray-50">
                            <img
                                src={`/images/wait-cat.webp`}
                                alt="Kucing santai"
                                // ✅ Ukuran diubah & margin dihapus
                                className="w-28 h-auto opacity-90"
                            />
                            {/* ✅ Teks dibungkus dalam 1 div */}
                            <div>
                                <p className="font-bold text-lg text-gray-700">
                                    Kucingnya Nunggu Nih 🐾
                                </p>
                                <p className="text-sm text-gray-500 mt-1 max-w-md"> {/* Opsi: tambah max-w- agar rapi */}
                                    Belum ada kelas yang tampil. Coba pilih dulu kriterianya di atas,
                                    nanti kucing siap bantu tampilkan daftar kelasnya buat kamu~
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- LANGKAH 3: ATUR PERIODE & SUBMIT --- */}
            <div className="space-y-4 pt-6 border-t">
                {/* ... (Tidak ada perubahan di bagian ini) ... */}
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${selectedClasses.length > 0 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>3</span>
                    Atur Periode & Tampilkan
                </h3>
                <div className="pl-11 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-grow space-y-3 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                            {[7, 30, 90].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setActiveRange(range)}
                                    className={`px-3 py-1.5 text-sm rounded-full ${activeRange === range
                                        ? 'bg-blue-100 text-blue-800 font-bold'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {range} Hari
                                </button>
                            ))}
                            <button
                                onClick={() => setActiveRange('custom')}
                                className={`px-3 py-1.5 text-sm rounded-full ${activeRange === 'custom'
                                    ? 'bg-blue-100 text-blue-800 font-bold'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Kustom
                            </button>
                        </div>
                        {activeRange === 'custom' && (
                            <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">Dari</label>
                                        <input
                                            type="date"
                                            value={timeFilter.start_date}
                                            onChange={(e) =>
                                                setTimeFilter((p) => ({ ...p, start_date: e.target.value }))
                                            }
                                            onFocus={(e) => e.target.showPicker?.()}
                                            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">Sampai</label>
                                        <input
                                            type="date"
                                            value={timeFilter.end_date}
                                            onChange={(e) =>
                                                setTimeFilter((p) => ({ ...p, end_date: e.target.value }))
                                            }
                                            onFocus={(e) => e.target.showPicker?.()}
                                            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 
                                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!canSubmit}
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md 
                                        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <><i className="fas fa-spinner fa-spin"></i> Memuat...</>
                                        ) : (
                                            <><i className="fas fa-chart-bar"></i> Tampilkan Grafik</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {activeRange !== 'custom' && (
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="w-auto px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm 
                                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                        >
                            {isLoading ? (
                                <><i className="fas fa-spinner fa-spin"></i> Memuat...</>
                            ) : (
                                <><i className="fas fa-chart-bar text-base"></i> Tampilkan Grafik</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};