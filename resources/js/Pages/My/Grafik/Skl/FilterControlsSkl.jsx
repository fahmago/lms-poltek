import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SelectField2 from '../../../../Shared/Fields/SelectField2';

// Komponen filter baru, TANPA tanggal
export default function FilterControlsSkl({ kategoriList, angkatans, onFilterChange, isLoading }) {
    
    // State untuk filter
    const [selectedAngkatan, setSelectedAngkatan] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    
    // State untuk data dinamis
    const [kelasHarianList, setKelasHarianList] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);

    // Ambil daftar kelas saat filter (Tahun, Kategori, Semester) berubah
    useEffect(() => {
        if (selectedAngkatan && selectedKategori && selectedSemester) {
            setIsLoadingClasses(true);
            axios.get(route('my.grafik.skl.getClasses'), { // Ganti route ke getClasses
                params: { 
                    tahun_angkatan: selectedAngkatan, 
                    kategori_id: selectedKategori, 
                    semester: selectedSemester 
                }
            })
            .then(response => {
                setKelasHarianList(response.data);
                setSelectedClasses([]); // Reset pilihan kelas
            })
            .catch(error => console.error("Gagal mengambil data kelas:", error))
            .finally(() => setIsLoadingClasses(false));
        } else {
            setKelasHarianList([]);
            setSelectedClasses([]);
        }
    }, [selectedAngkatan, selectedKategori, selectedSemester]);

    // Handler untuk checkbox kelas
    const handleCheckboxChange = (e) => {
        const classId = parseInt(e.target.value);
        setSelectedClasses(prev => 
            e.target.checked ? [...prev, classId] : prev.filter(id => id !== classId)
        );
    };

    // Handler untuk "Pilih Semua" kelas
    const handleSelectAllClasses = (e) => {
        setSelectedClasses(e.target.checked ? kelasHarianList.map(k => k.id) : []);
    };

    // Handler saat tombol "Tampilkan Grafik" diklik
    const handleFilterClick = () => {
        if (selectedClasses.length === 0) {
            alert('Silakan pilih setidaknya satu kelas harian.');
            return;
        }
        // Kirim HANYA kelas_harian_ids
        onFilterChange({ 
            kelas_harian_ids: selectedClasses 
        });
    };

    const isAllSelected = kelasHarianList.length > 0 && selectedClasses.length === kelasHarianList.length;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SelectField2
                    label="Tahun"
                    value={selectedAngkatan}
                    onChange={e => setSelectedAngkatan(e.target.value)}
                    options={angkatans.map(a => ({ value: a.tahun_angkatan, label: a.tahun_angkatan }))}
                    placeholder="-- Pilih --"
                />
                <SelectField2
                    label="Kategori Kelas"
                    value={selectedKategori}
                    onChange={e => setSelectedKategori(e.target.value)}
                    options={kategoriList.map(k => ({ value: k.id, label: k.nama_kategori }))}
                    placeholder="-- Pilih Kategori --"
                />
                <SelectField2
                    label="Semester"
                    value={selectedSemester}
                    onChange={e => setSelectedSemester(e.target.value)}
                    options={[...Array(8)].map((_, i) => ({ value: i + 1, label: `Semester ${i + 1}` }))}
                    placeholder="-- Pilih Semester --"
                />
            </div>

            {/* HAPUS: Filter Tanggal & Range dihapus */}

            {/* Bagian Pilihan Kelas */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Pilih Kelas Harian</label>
                    {kelasHarianList.length > 0 && (
                        <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                            <input type="checkbox" onChange={handleSelectAllClasses} checked={isAllSelected} className="rounded text-blue-600" />
                            <span>Pilih Semua</span>
                        </label>
                    )}
                </div>
                {isLoadingClasses ? (
                    <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50"><i className="fas fa-spinner fa-spin mr-2"></i> Memuat kelas...</div>
                ) : kelasHarianList.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                        {kelasHarianList.map(kelas => (
                            <label key={kelas.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
                                <input type="checkbox" value={kelas.id} checked={selectedClasses.includes(kelas.id)} onChange={handleCheckboxChange} className="rounded text-blue-600" />
                                <div>
                                    <span className="text-sm font-medium text-gray-800">{kelas.nama_kelas}</span>
                                    <span className="block text-xs text-gray-500">Oleh: {kelas.nama_dosen}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-sm text-gray-500 border rounded-lg">{selectedSemester ? 'Tidak ada kelas ditemukan.' : 'Pilih filter di atas untuk memuat daftar kelas.'}</div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleFilterClick}
                    disabled={isLoading || selectedClasses.length === 0}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Memuat...</> : <><i className="fa fa-chart-bar mr-2"></i> Tampilkan Grafik</>}
                </button>
            </div>
        </div>
    );
}