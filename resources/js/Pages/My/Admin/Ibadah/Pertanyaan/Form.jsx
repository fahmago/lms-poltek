import React, { useState, useEffect } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout'; // Sesuaikan path
import { Head, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SelectField2 from '../../../../../Shared/Fields/SelectField2'; // Sesuaikan path
import InputField from '../../../../../Shared/Fields/InputField'; // Sesuaikan path
import ButtonSave from '../../../../../Shared/ButtonSave'; // Sesuaikan path
import ToastNotification from '../../../../../Shared/ToastNotification'; // Sesuaikan path

export default function Form() {
    const { pertanyaan, errors, flash } = usePage().props;
    const isEdit = !!pertanyaan;

    // --- State untuk Form Pertanyaan ---
    const [teksPertanyaan, setTeksPertanyaan] = useState(pertanyaan?.teks_pertanyaan || '');
    const [tipePertanyaan, setTipePertanyaan] = useState(pertanyaan?.tipe_pertanyaan || 'pilihan_ganda');
    const [wajibDiisi, setWajibDiisi] = useState(pertanyaan?.wajib_diisi ?? true);
    const [urutan, setUrutan] = useState(pertanyaan?.urutan || 0);
    const [kategori, setKategori] = useState(pertanyaan?.kategori || 'umum'); // <-- STATE BARU
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [pilihanJawabans, setPilihanJawabans] = useState(pertanyaan?.pilihan_jawabans || []);

    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    const tipePertanyaanOptions = [
        { value: 'pilihan_ganda', label: 'Pilihan Ganda' },
        { value: 'teks', label: 'Teks' }
    ];

    // --- OPSI BARU UNTUK KATEGORI ---
    const kategoriOptions = [
        { value: 'umum', label: 'Umum (Laporan Sholat, dll)' },
        { value: 'haid', label: 'Haid (Laporan Amalan Lain)' }
    ];

    const genderOptions = [
        { value: '', label: 'Untuk Semua Gender' },
        { value: 'L', label: 'Khusus Laki-laki' },
        { value: 'P', label: 'Khusus Perempuan' }
    ];

    // --- Fungsi Helper Pilihan Jawaban (Tidak berubah) ---
    const addChoice = () => {
        setPilihanJawabans([
            ...pilihanJawabans,
            { 
                id: null,
                teks_jawaban: '', 
                poin: 0, 
                khusus_gender: '', 
                urutan: pilihanJawabans.length
            }
        ]);
    };

    const removeChoice = (index) => {
        setPilihanJawabans(pilihanJawabans.filter((_, i) => i !== index));
    };

    const handleChoiceChange = (index, field, value) => {
        const newChoices = [...pilihanJawabans];
        newChoices[index][field] = value;
        setPilihanJawabans(newChoices);
    };

    // --- Handle Submit Utama (DITAMBAH 'kategori') ---
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSend = {
            teks_pertanyaan: teksPertanyaan,
            tipe_pertanyaan: tipePertanyaan,
            wajib_diisi: wajibDiisi,
            urutan: urutan,
            kategori: kategori, // <-- KIRIM DATA KATEGORI
            pilihan_jawabans: tipePertanyaan === 'pilihan_ganda' ? pilihanJawabans : [],
        };

        if (isEdit) {
            Inertia.put(route('my.pertanyaan.ibadah.update', { pertanyaan: pertanyaan.uuid }), dataToSend, {
                onFinish: () => setIsSubmitting(false),
                preserveScroll: true,
            });
        } else {
            Inertia.post(route('my.pertanyaan.ibadah.store'), dataToSend, {
                onFinish: () => setIsSubmitting(false)
            });
        }
    };

    return (
        <MyLayout>
            <Head title={isEdit ? "Edit Pertanyaan Ibadah" : "Buat Pertanyaan Ibadah"} />
            
            <div className="mx-auto py-8">
                <div className="bg-white shadow-md rounded-lg">
                    <div className="bg-blue-600 p-4 rounded-t-lg">
                        <span className="font-bold text-white tracking-widest">
                            <i className="fa fa-question-circle mr-2"></i>
                            {isEdit ? "Edit Pertanyaan Ibadah" : "Buat Pertanyaan Ibadah Baru"}
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        
                        {/* --- Bagian 1: Detail Pertanyaan --- */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">1. Detail Pertanyaan</h2>
                            
                            {/* --- GRID DIPERBARUI (3 KOLOM) --- */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField 
                                    label="Nomor Urutan" 
                                    type="number" 
                                    value={urutan} 
                                    onChange={e => setUrutan(e.target.value)} 
                                    error={errors.urutan} 
                                    required 
                                />
                                <SelectField2 
                                    label="Tipe Pertanyaan" 
                                    value={tipePertanyaan} 
                                    onChange={e => setTipePertanyaan(e.target.value)} 
                                    placeholder="-- Pilih Tipe --" 
                                    options={tipePertanyaanOptions}
                                    error={errors.tipe_pertanyaan} 
                                    required 
                                />
                                {/* --- INPUT FIELD BARU UNTUK KATEGORI --- */}
                                <SelectField2 
                                    label="Kategori Pertanyaan" 
                                    value={kategori} 
                                    onChange={e => setKategori(e.target.value)} 
                                    placeholder="-- Pilih Kategori --" 
                                    options={kategoriOptions}
                                    error={errors.kategori} 
                                    required 
                                />
                            </div>
                            
                            {/* ReactQuill (Teks Pertanyaan) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teks Pertanyaan</label>
                                <ReactQuill 
                                    theme="snow" 
                                    value={teksPertanyaan} 
                                    onChange={setTeksPertanyaan} 
                                />
                                {errors.teks_pertanyaan && <p className="text-red-500 text-xs mt-1">{errors.teks_pertanyaan}</p>}
                            </div>

                            {/* Checkbox Wajib Diisi */}
                            <div>
                                <label className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-gray-700">
                                    <input 
                                        type="checkbox" 
                                        checked={wajibDiisi} 
                                        onChange={e => setWajibDiisi(e.target.checked)} 
                                        className="rounded text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span>Wajib Diisi</span>
                                </label>
                            </div>
                        </div>

                        {/* --- Bagian 2: Pilihan Jawaban (HANYA TAMPIL JIKA 'pilihan_ganda') --- */}
                        {tipePertanyaan === 'pilihan_ganda' && (
                            <div className="space-y-6 pt-6 border-t">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-700">2. Pilihan Jawaban</h2>
                                    <button
                                        type="button"
                                        onClick={addChoice}
                                        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
                                    >
                                        <i className="fa fa-plus-circle mr-2"></i>
                                        Tambah Pilihan
                                    </button>
                                </div>
                                {errors['pilihan_jawabans'] && <p className="text-red-500 text-xs mt-1">{errors['pilihan_jawabans']}</p>}

                                {/* Daftar Pilihan Jawaban Dinamis */}
                                <div className="space-y-4">
                                    {pilihanJawabans.map((choice, index) => (
                                        <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-50 items-start">
                                            <input type="hidden" value={choice.id || ''} />
                                            <div className="flex-1 space-y-4">
                                                <InputField
                                                    label={`Teks Jawaban ${index + 1}`}
                                                    type="text"
                                                    value={choice.teks_jawaban}
                                                    onChange={e => handleChoiceChange(index, 'teks_jawaban', e.target.value)}
                                                    error={errors[`pilihan_jawabans.${index}.teks_jawaban`]}
                                                    required
                                                />
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <InputField
                                                        label="Poin"
                                                        type="number"
                                                        value={choice.poin}
                                                        onChange={e => handleChoiceChange(index, 'poin', e.target.value)}
                                                        error={errors[`pilihan_jawabans.${index}.poin`]}
                                                        required
                                                    />
                                                    <InputField
                                                        label="Urutan"
                                                        type="number"
                                                        value={choice.urutan}
                                                        onChange={e => handleChoiceChange(index, 'urutan', e.target.value)}
                                                        error={errors[`pilihan_jawabans.${index}.urutan`]}
                                                        required
                                                    />
                                                    <SelectField2
                                                        label="Khusus Gender"
                                                        value={choice.khusus_gender}
                                                        onChange={e => handleChoiceChange(index, 'khusus_gender', e.target.value)}
                                                        options={genderOptions}
                                                        error={errors[`pilihan_jawabans.${index}.khusus_gender`]}
                                                    />
                                                </div>
                                            </div>
                                            {/* Tombol Hapus Baris */}
                                            <div className="md:mt-8">
                                                <button
                                                    type="button"
                                                    onClick={() => removeChoice(index)}
                                                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2"
                                                >
                                                    <i className="fa fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {pilihanJawabans.length === 0 && (
                                        <div className="text-center py-4 text-sm text-gray-500 border rounded-lg">
                                            Klik "Tambah Pilihan" untuk memulai.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tombol Submit Utama */}
                        <div className="flex justify-start pt-6 border-t">
                            <ButtonSave type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 
                                    <><i className="fa fa-spinner fa-spin mr-2"></i> Menyimpan...</> : 
                                    <><i className="fa fa-save mr-2"></i> {isEdit ? "Update Pertanyaan" : "Simpan Pertanyaan"}</>
                                }
                            </ButtonSave>
                        </div>
                    </form>
                </div>
            </div>
        </MyLayout>
    );
}