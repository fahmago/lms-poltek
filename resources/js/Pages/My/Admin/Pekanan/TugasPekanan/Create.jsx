import React, { useState, useEffect } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SelectField2 from '../../../../../Shared/Fields/SelectField2';
import InputField from '../../../../../Shared/Fields/InputField';
import ButtonSave from '../../../../../Shared/ButtonSave';

export default function Create() {
    const { angkatans, prodis, errors } = usePage().props;

    // State untuk filter
    const [selectedAngkatan, setSelectedAngkatan] = useState('');
    const [selectedProdi, setSelectedProdi] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    // State untuk data dinamis
    const [kelasHarianList, setKelasHarianList] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(false);
    
    // State untuk data form
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tipeTugas, setTipeTugas] = useState('');
    const [waktuMulai, setWaktuMulai] = useState('');
    const [batasWaktu, setBatasWaktu] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efek untuk mengambil data kelas harian
    useEffect(() => {
        if (selectedAngkatan && selectedProdi && selectedSemester) {
            setIsLoadingClasses(true);
            axios.get(route('my.tweek.getClasses'), {
                params: { tahun_angkatan: selectedAngkatan, kode_prodi: selectedProdi, semester: selectedSemester }
            })
            .then(response => {
                setKelasHarianList(response.data);
                setSelectedClasses([]);
            })
            .catch(error => console.error("Gagal mengambil data kelas:", error))
            .finally(() => setIsLoadingClasses(false));
        } else {
            setKelasHarianList([]);
        }
    }, [selectedAngkatan, selectedProdi, selectedSemester]);

    const handleCheckboxChange = (e) => {
        const classId = parseInt(e.target.value);
        setSelectedClasses(prev => e.target.checked ? [...prev, classId] : prev.filter(id => id !== classId));
    };

    // --- FUNGSI BARU UNTUK "PILIH SEMUA" ---
    const handleSelectAllClasses = (e) => {
        if (e.target.checked) {
            // Pilih semua ID dari daftar kelas yang ada
            const allClassIds = kelasHarianList.map(kelas => kelas.id);
            setSelectedClasses(allClassIds);
        } else {
            // Kosongkan pilihan
            setSelectedClasses([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const dataToSend = {
            judul, deskripsi, tipe_tugas: tipeTugas, waktu_mulai: waktuMulai, batas_waktu: batasWaktu,
            tahun_angkatan: selectedAngkatan, kode_prodi: selectedProdi, semester: selectedSemester,
            kelas_harian_ids: selectedClasses,
        };
        Inertia.post(route('my.tweek.store'), dataToSend, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    // Tentukan apakah semua checkbox terpilih
    const isAllSelected = kelasHarianList.length > 0 && selectedClasses.length === kelasHarianList.length;

    return (
        <MyLayout>
            <Head title="Buat Tugas Pekanan" />
            <div className="mx-auto py-8">
                <div className="bg-white shadow-md rounded-lg">
                    <div className="bg-blue-600 p-4 rounded-t-lg">
                        <span className="font-bold text-white tracking-widest"><i className="fa fa-hand-holding-hand mr-2"></i>Kirim Tugas Pekanan</span>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Bagian Filter */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">1. Tentukan Target Kelas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SelectField2 label="Tahun" value={selectedAngkatan} onChange={e => setSelectedAngkatan(e.target.value)} options={angkatans.map(a => ({ value: a.tahun_angkatan, label: `${a.tahun_angkatan}` }))} placeholder="-- Pilih Tahun --" error={errors.tahun_angkatan} required />
                                <SelectField2 label="Program Studi" value={selectedProdi} onChange={e => setSelectedProdi(e.target.value)} options={prodis.map(p => ({ value: p.kode_prodi, label: p.nama_prodi }))} placeholder="-- Pilih Prodi --" error={errors.kode_prodi} required />
                                <SelectField2 label="Semester" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)} options={[...Array(8)].map((_, i) => ({ value: i + 1, label: `Semester ${i + 1}` }))} placeholder="-- Pilih Semester --" error={errors.semester} required />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Pilih Kelas Harian</label>
                                    {/* --- CHECKBOX PILIH SEMUA --- */}
                                    {kelasHarianList.length > 0 && (
                                        <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-blue-600">
                                            <input type="checkbox" onChange={handleSelectAllClasses} checked={isAllSelected} className="rounded text-blue-600 focus:ring-blue-500" />
                                            <span>Pilih Semua</span>
                                        </label>
                                    )}
                                </div>
                                {isLoadingClasses ? (
                                    <div className="text-center py-4 text-gray-500 border rounded-lg bg-gray-50"><i className="fas fa-spinner fa-spin mr-2"></i> Memuat...</div>
                                ) : kelasHarianList.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                                        {kelasHarianList.map(kelas => (
                                            <label key={kelas.id} className="flex items-center space-x-2 cursor-pointer">
                                                <input type="checkbox" value={kelas.id} checked={selectedClasses.includes(kelas.id)} onChange={handleCheckboxChange} className="rounded text-blue-600 focus:ring-blue-500" />
                                                {/* <span className="text-sm">{kelas.nama_kelas}</span> */}
                                                <div>
                                                    <span className="text-sm font-medium text-gray-800">{kelas.nama_kelas}</span>
                                                    {/* --- PERUBAHAN TAMPILAN DOSEN DI SINI --- */}
                                                    <span className="block text-xs text-gray-500">Oleh: {kelas.nama_dosen}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500 border rounded-lg">{selectedSemester ? 'Tidak ada kelas ditemukan.' : 'Pilih filter di atas untuk memuat daftar kelas.'}</div>
                                )}
                                {errors.kelas_harian_ids && <p className="text-red-500 text-xs mt-1">{errors.kelas_harian_ids}</p>}
                            </div>
                        </div>

                        {/* Bagian Input Form Tugas */}
                        <div className="space-y-6 pt-6 border-t">
                            <h2 className="text-lg font-semibold text-gray-700">2. Detail Tugas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Judul Tugas" type="text" value={judul} onChange={e => setJudul(e.target.value)} error={errors.judul} required />
                                <SelectField2 
                                    label="Tipe Tugas" 
                                    value={tipeTugas} 
                                    onChange={e => setTipeTugas(e.target.value)} 
                                    placeholder="-- Pilih Tipe Tugas --"
                                    options={[
                                        { 
                                            value: 'yt', 
                                            label: 'Video Youtube' 
                                        }, 
                                        { 
                                            value: 'other', 
                                            label: 'Link Umum / Artikel / Blog' 
                                        }
                                    ]} 
                                    error={errors.tipe_tugas} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Waktu Mulai" type="datetime-local" value={waktuMulai} onChange={e => setWaktuMulai(e.target.value)} error={errors.waktu_mulai} required />
                                <InputField label="Batas Waktu" type="datetime-local" value={batasWaktu} onChange={e => setBatasWaktu(e.target.value)} error={errors.batas_waktu} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                                <ReactQuill theme="snow" value={deskripsi} onChange={setDeskripsi} />
                                {errors.deskripsi && <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>}
                            </div>
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-start pt-6 border-t">
                            <ButtonSave type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <><i className="fa fa-spinner fa-spin mr-2"></i> Mengirim...</> : <><i className="fa fa-save mr-2"></i> Kirim Tugas</>}
                            </ButtonSave>
                        </div>
                    </form>
                </div>
            </div>
        </MyLayout>
    );
}