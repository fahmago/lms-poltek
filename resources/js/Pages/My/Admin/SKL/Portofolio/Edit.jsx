import React, { useState, useEffect } from 'react';
// Mengganti alias '@' dengan path relatif
import MyLayout from '@/Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Mengganti alias '@' dengan path relatif
import SelectField2 from '@/Shared/Fields/SelectField2';
import InputField from '@/Shared/Fields/InputField';
import ButtonSave from '@/Shared/ButtonSave';
import { toLocalDatetime } from '../../../../../Utilities/datetimeHelper';

export default function Edit() {
    // GANTI: 'projectSemester' -> 'portofolio'
    const { portofolio, angkatans, prodis, initialFilters, errors } = usePage().props;

    // State untuk filter (diisi dengan data awal dari controller dan tidak bisa diubah)
    const [selectedAngkatan, setSelectedAngkatan] = useState(initialFilters.tahun_angkatan);
    const [selectedProdi, setSelectedProdi] = useState(initialFilters.kode_prodi);
    const [selectedSemester, setSelectedSemester] = useState(initialFilters.semester);

    // State untuk data dinamis
    const [kelasHarianList, setKelasHarianList] = useState([]);
    const [isLoadingClasses, setIsLoadingClasses] = useState(true); // Mulai dengan true

    // State untuk data form (diisi dengan data portofolio yang sudah ada)
    // GANTI: 'portofolio' -> 'portofolio'
    const [judul, setJudul] = useState(portofolio.judul);
    const [deskripsi, setDeskripsi] = useState(portofolio.deskripsi);
    // HAPUS: 'catatan' dihapus
    // const [waktuMulai, setWaktuMulai] = useState(portofolio.waktu_mulai.slice(0, 16));
    // const [batasWaktu, setBatasWaktu] = useState(portofolio.batas_waktu.slice(0, 16));
    const [waktuMulai, setWaktuMulai] = useState(toLocalDatetime(portofolio.waktu_mulai));
    const [batasWaktu, setBatasWaktu] = useState(toLocalDatetime(portofolio.batas_waktu));
    const [selectedClasses, setSelectedClasses] = useState(portofolio.kelas_harians.map(k => k.id));
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Efek untuk mengambil data kelas harian saat halaman dimuat
    useEffect(() => {
        if (selectedAngkatan && selectedProdi && selectedSemester) {
            setIsLoadingClasses(true);
            // GANTI: route 'my.project_semester.getClasses' -> 'my.portofolio.getClasses'
            axios.get(route('my.portofolio.getClasses'), {
                params: { tahun_angkatan: selectedAngkatan, kode_prodi: selectedProdi, semester: selectedSemester }
            })
                .then(response => setKelasHarianList(response.data))
                .catch(error => console.error("Gagal mengambil data kelas:", error))
                .finally(() => setIsLoadingClasses(false));
        }
    }, [selectedAngkatan, selectedProdi, selectedSemester]);

    const handleCheckboxChange = (e) => {
        const classId = parseInt(e.target.value);
        setSelectedClasses(prev => e.target.checked ? [...prev, classId] : prev.filter(id => id !== classId));
    };

    const handleSelectAllClasses = (e) => {
        setSelectedClasses(e.target.checked ? kelasHarianList.map(k => k.id) : []);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const dataToSend = {
            judul,
            deskripsi,
            // HAPUS: 'catatan'
            waktu_mulai: waktuMulai,
            batas_waktu: batasWaktu,
            kode_prodi: selectedProdi,
            kelas_harian_ids: selectedClasses,
        };
        // Gunakan Inertia.put untuk method UPDATE
        // GANTI: route 'my.project_semester.update' -> 'my.portofolio.update' & param
        Inertia.put(route('my.portofolio.update', portofolio.uuid), dataToSend, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    const isAllSelected = kelasHarianList.length > 0 && selectedClasses.length === kelasHarianList.length;

    return (
        <MyLayout>
            {/* GANTI: title & 'portofolio' -> 'portofolio' */}
            <Head title={`Edit Portofolio - ${portofolio.judul}`} />
            <div className="mx-auto py-8">
                <div className="bg-white shadow-md rounded-lg">
                    <div className="bg-green-600 p-4 rounded-t-lg">
                        {/* GANTI: teks & icon */}
                        <span className="font-bold text-white tracking-widest"><i className="fa fa-id-card mr-2"></i>Edit Portofolio</span>
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
                            <h2 className="text-lg font-semibold text-gray-700">2. Detail Portofolio</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {/* GANTI: teks */}
                                <InputField label="Judul Portofolio" type="text" value={judul} onChange={e => setJudul(e.target.value)} error={errors.judul} required />
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

                            {/* HAPUS: Input untuk Catatan dihapus */}

                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-between items-center pt-6 border-t">
                            {/* GANTI: route & 'portofolio' -> 'portofolio' */}
                            {/* <Link href={route('my.portofolio.show', portofolio.prodi.uuid)} className="text-sm text-gray-600 hover:underline">
                                &larr; Batal
                            </Link> */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.history.length > 1) {
                                        window.history.back();
                                    } else {
                                        Inertia.visit(route('my.portofolio.show', portofolio.prodi.uuid));
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