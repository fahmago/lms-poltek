import React, { useState, useEffect } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SelectField2 from '@/Shared/Fields/SelectField2';
import InputField from '@/Shared/Fields/InputField';
import ButtonSave from '@/Shared/ButtonSave';
import { toLocalDatetime } from '../../../../../Utilities/datetimeHelper'; // Asumsi path ini benar

export default function Edit() {
    // GANTI: 'portofolio' -> 'sertifikat'
    const { sertifikat, angkatans, prodis, initialFilters, errors } = usePage().props;

    // State untuk filter (Sama)
    const [selectedAngkatan, setSelectedAngkatan] = useState(initialFilters.tahun_angkatan);
    const [selectedProdi, setSelectedProdi] = useState(initialFilters.kode_prodi);
    const [selectedSemester, setSelectedSemester] = useState(initialFilters.semester);

    // State untuk data dinamis (Sama)
    const [kelasHarianList, setKelasHarianList] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(true);

    // State untuk data form (Ganti 'sertifikat')
    const [judul, setJudul] = useState(sertifikat.judul);
    const [deskripsi, setDeskripsi] = useState(sertifikat.deskripsi);
    const [waktuMulai, setWaktuMulai] = useState(toLocalDatetime(sertifikat.waktu_mulai));
    const [batasWaktu, setBatasWaktu] = useState(toLocalDatetime(sertifikat.batas_waktu));
    const [selectedClasses, setSelectedClasses] = useState(sertifikat.kelas_harians.map(k => k.id));
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efek ambil kelas (Ganti route)
    useEffect(() => {
        if (selectedAngkatan && selectedProdi && selectedSemester) {
            setIsLoadingClasses(true);
            // GANTI: route 'my.portofolio.getClasses' -> 'my.sertifikat.getClasses'
            axios.get(route('my.sertifikat.getClasses'), {
                params: { tahun_angkatan: selectedAngkatan, kode_prodi: selectedProdi, semester: selectedSemester }
            })
                .then(response => setKelasHarianList(response.data))
                .catch(error => console.error("Gagal mengambil data kelas:", error))
                .finally(() => setIsLoadingClasses(false));
        }
    }, [selectedAngkatan, selectedProdi, selectedSemester]);

    // Handle checkbox (Sama)
    const handleCheckboxChange = (e) => {
        const classId = parseInt(e.target.value);
        setSelectedClasses(prev => e.target.checked ? [...prev, classId] : prev.filter(id => id !== classId));
    };

    // Handle select all (Sama)
    const handleSelectAllClasses = (e) => {
        setSelectedClasses(e.target.checked ? kelasHarianList.map(k => k.id) : []);
    };

    // Handle submit (Ganti route dan data)
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const dataToSend = {
            judul,
            deskripsi,
            waktu_mulai: waktuMulai,
            batas_waktu: batasWaktu,
            kode_prodi: selectedProdi,
            kelas_harian_ids: selectedClasses,
        };
        // GANTI: route 'my.portofolio.update' -> 'my.sertifikat.update' & param
        Inertia.put(route('my.sertifikat.update', {sertifikat: sertifikat.uuid}), dataToSend, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    const isAllSelected = kelasHarianList.length > 0 && selectedClasses.length === kelasHarianList.length;

    return (
        <MyLayout>
            {/* GANTI: title & 'sertifikat' -> 'sertifikat' */}
            <Head title={`Edit Tugas Sertifikat - ${sertifikat.judul}`} />
            <div className="mx-auto py-8">
                <div className="bg-white shadow-md rounded-lg">
                    <div className="bg-green-600 p-4 rounded-t-lg">
                        {/* GANTI: teks & icon */}
                        <span className="font-bold text-white tracking-widest"><i className="fa fa-certificate mr-2"></i>Edit Tugas Sertifikat</span>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Bagian Filter (disabled) */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">1. Target Kelas (Tidak dapat diubah)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SelectField2 label="Angkatan" value={selectedAngkatan} options={angkatans.map(a => ({ value: a.tahun_angkatan, label: `${a.nama_angkatan} (${a.tahun_angkatan})` }))} disabled />
                                <SelectField2 label="Program Studi" value={selectedProdi} options={prodis.map(p => ({ value: p.kode_prodi, label: p.nama_prodi }))} disabled />
                                <SelectField2 label="Semester" value={selectedSemester} options={[...Array(8)].map((_, i) => ({ value: i + 1, label: `Semester ${i + 1}` }))} disabled />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Pilih Kelas Harian</label>
                                    {kelasHarianList.length > 0 && (
                                        <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-blue-600">
                                            <input type="checkbox" onChange={handleSelectAllClasses} checked={isAllSelected} className="rounded text-blue-600" />
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
                                                <div>
                                                    <span className="text-sm font-medium text-gray-800">{kelas.nama_kelas}</span>
                                                    <span className="block text-xs text-gray-500">Oleh: {kelas.nama_dosen}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500 border rounded-lg">Tidak ada kelas ditemukan untuk filter ini.</div>
                                )}
                                {errors.kelas_harian_ids && <p className="text-red-500 text-xs mt-1">{errors.kelas_harian_ids}</p>}
                            </div>
                        </div>

                        {/* Bagian Input Form Tugas */}
                        <div className="space-y-6 pt-6 border-t">
                            {/* GANTI: teks */}
                            <h2 className="text-lg font-semibold text-gray-700">2. Detail Tugas Sertifikat</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {/* GANTI: teks */}
                                <InputField label="Judul Sertifikat" type="text" value={judul} onChange={e => setJudul(e.target.value)} error={errors.judul} required />
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

                        {/* Tombol Aksi */}
                        <div className="flex justify-between items-center pt-6 border-t">
                             {/* GANTI: route & 'sertifikat' -> 'sertifikat' */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        window.history.back();
                                    } else {
                                        Inertia.visit(route('my.sertifikat.show', {uuid: sertifikat.prodi.uuid}));
                                    }
                                }}
                                className="text-sm text-gray-600 hover:underline"
                            >
                                &larr; Batal
                            </button>
                            <ButtonSave type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <><i className="fa fa-spinner fa-spin mr-2"></i> Memperbarui...</> : <><i className="fa fa-save mr-2"></i> Simpan Perubahan</>}
                            </ButtonSave>
                        </div>
                    </form>
                </div>
            </div>
        </MyLayout>
    );
}