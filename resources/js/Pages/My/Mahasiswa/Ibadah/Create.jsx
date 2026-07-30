import React, { useState, useEffect } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import ButtonSave from '@/Shared/ButtonSave';
import ToastNotification from '@/Shared/ToastNotification';
import InputField from '@/Shared/Fields/InputField';
import HaditsCard from '../../../../Shared/HaditsCard';

export default function Create() {
    // Controller sekarang mengirim object { umum: [], haid: [] }
    const { pertanyaans, mahasiswa, errors, flash } = usePage().props;

    // --- State untuk Form ---
    const [tanggalLaporan, setTanggalLaporan] = useState('');
    const [isHaid, setIsHaid] = useState(false); // State baru untuk haid
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Tentukan Tanggal Min dan Max ---
    const getFormattedDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const maxDate = getFormattedDate(new Date());
    const minDate = getFormattedDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));

    // --- Inisialisasi State Jawaban ---
    // Inisialisasi SEMUA pertanyaan (umum & haid)
    function initializeAnswers() {
        const initialAnswers = {};
        // Gabungkan kedua array pertanyaan
        const allQuestions = [...pertanyaans.umum, ...pertanyaans.haid];

        allQuestions.forEach(p => {
            initialAnswers[p.id] = {
                pertanyaan_id: p.id,
                type: p.tipe_pertanyaan,
                value: '',
                wajib: p.wajib_diisi,
            };
        });
        return initialAnswers;
    };
    const [answers, setAnswers] = useState(initializeAnswers());

    // Efek untuk notifikasi
    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
        // Tampilkan error validasi dari backend
        if (errors.tanggal_laporan) ToastNotification({ icon: 'error', title: errors.tanggal_laporan });
        if (errors.is_haid) ToastNotification({ icon: 'error', title: errors.is_haid });
    }, [flash, errors]);

    // Handle perubahan jawaban
    const handleAnswerChange = (pertanyaanId, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [pertanyaanId]: {
                ...prevAnswers[pertanyaanId],
                value: value
            }
        }));
    };

    // Handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Tentukan pertanyaan mana yang relevan
        const relevantQuestions = isHaid ? pertanyaans.haid : pertanyaans.umum;

        // 2. Validasi frontend
        if (!tanggalLaporan) {
            ToastNotification({ icon: 'error', title: 'Harap pilih tanggal laporan.' });
            return;
        }

        // Cek apakah pertanyaan wajib diisi
        for (const pertanyaan of relevantQuestions) {
            const answer = answers[pertanyaan.id];
            if (answer.wajib && !answer.value) {
                ToastNotification({ icon: 'error', title: 'Harap isi semua pertanyaan wajib.' });
                document.getElementById(`pertanyaan-${pertanyaan.id}`)?.focus();
                return;
            }
        }

        // 3. Filter 'answers' untuk dikirim ke backend
        const answersToSubmit = {};
        relevantQuestions.forEach(p => {
            // Hanya kirim jawaban dari pertanyaan yang relevan
            answersToSubmit[p.id] = answers[p.id];
        });

        setIsSubmitting(true);
        Inertia.post(route('mhs.laporan-ibadah.store'), {
            tanggal_laporan: tanggalLaporan,
            is_haid: isHaid, // Kirim status haid
            answers: answersToSubmit, // Kirim jawaban yang relevan
        }, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    // Tentukan list pertanyaan yang akan di-render di Card 2
    const questionsToRender = isHaid ? pertanyaans.haid : pertanyaans.umum;

    return (
        <MyLayout>
            <Head title="Laporan Ibadah Harian" />

            <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
                <div className="space-y-6">
                    {/* Grid 2 Kolom */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">

                        {/* --- CARD 1: PILIH TANGGAL & STATUS --- */}
                        {/* <div className="bg-white shadow-md rounded-lg overflow-hidden h-fit space-y-2 mb-8"> */}
                            {/* <div className="bg-white shadow-md rounded-lg overflow-hidden h-fit space-y-2 mb-8 sticky top-0 self-start"> */}
                            <div className="bg-white shadow-md rounded-lg overflow-hidden h-fit space-y-2 mb-8 lg:sticky lg:top-0 lg:self-start">

                            {/* Bagian Tanggal */}
                            <div>
                                <div className="bg-blue-600 p-4 rounded-t-lg">
                                    <span className="font-bold text-white tracking-widest">
                                        <i className="fa fa-calendar-alt mr-2"></i>
                                        {mahasiswa.gender === 'P' ? '1. PILIH TANGGAL & STATUS' : '1. PILIH TANGGAL LAPORAN'}
                                    </span>
                                </div>
                                <div className="p-8">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Anda dapat mengisi laporan untuk <strong className='text-black-500 italic'>Tujuh Hari Terakhir</strong>.
                                    </p>
                                    <InputField
                                        label="Tanggal Laporan"
                                        type="date"
                                        value={tanggalLaporan}
                                        onChange={e => setTanggalLaporan(e.target.value)}
                                        error={errors.tanggal_laporan}
                                        required
                                        min={minDate}
                                        max={maxDate}
                                    />
                                </div>
                            </div>

                            {/* Bagian Pertanyaan Haid (Hanya untuk wanita) */}
                            {mahasiswa.gender === 'P' && (
                                <div className="border-t">
                                    <div className="p-8 space-y-3">
                                        <label className="block text-base font-semibold text-gray-800">
                                            Apakah Anda sedang Haid/Nifas?
                                            <span className="text-red-600 ml-1">*</span>
                                        </label>

                                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status_haid"
                                                value="tidak"
                                                checked={!isHaid}
                                                onChange={() => setIsHaid(false)}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Tidak, saya Suci (Laporan Sholat)</span>
                                        </label>
                                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status_haid"
                                                value="ya"
                                                checked={isHaid}
                                                onChange={() => setIsHaid(true)}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Ya, saya Haid/Nifas (Laporan Amalan Lain)</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            <HaditsCard />
                        </div>

                        {/* --- CARD 2 & TOMBOL SUBMIT (Kolom Kanan) --- */}
                        <div className="space-y-8"> {/* Wrapper untuk Card 2 dan Tombol */}
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <div className="bg-blue-600 p-4 rounded-t-lg">
                                    <span className="font-bold text-white tracking-widest">
                                        <i className="fa fa-check-circle mr-2"></i>
                                        2. ISI LAPORAN AMALAN
                                    </span>
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-800 flex flex-col items-center">
                                        <b className="text-3xl">ﷲ  &nbsp; ﷴ</b>
                                        <b className="my-1 text-lg">Ikrar Kejujuran</b>
                                        <span className="text-center mt-2">
                                            "Bismillah, Demi Allah, saya berjanji akan mengisi formulir ini dengan jujur dan tidak akan memanipulasi."
                                        </span>
                                    </div>

                                    {/* Daftar Pertanyaan (Dinamis) */}
                                    <div className="space-y-6">
                                        {questionsToRender.length > 0 ? (
                                            questionsToRender.map((pertanyaan, index) => (
                                                <div key={pertanyaan.id} className="pt-6 border-t first:border-t-0 first:pt-0">
                                                    <label className="block text-base font-semibold text-gray-800 mb-4">
                                                        <div className='flex items-start gap-x-2'>
                                                            <span>{pertanyaan.urutan}.</span>

                                                            {/* 1. Buat grup baru untuk Teks + Bintang */}
                                                            <div className="flex items-start">
                                                                <span
                                                                    className="[&_p]:inline [&_p]:m-0"
                                                                    dangerouslySetInnerHTML={{ __html: pertanyaan.teks_pertanyaan }}
                                                                />
                                                                {/* 2. Bintang sekarang ada di dalam grup,
                                                                       dengan margin kecil (ml-1) agar pas */}
                                                                {pertanyaan.wajib_diisi && <span className="text-red-600 ml-1">*</span>}
                                                            </div>
                                                        </div>
                                                    </label>

                                                    {/* Pilihan Ganda */}
                                                    {pertanyaan.tipe_pertanyaan === 'pilihan_ganda' && (
                                                        <div className="space-y-3">
                                                            {pertanyaan.pilihan_jawabans.map(pilihan => (
                                                                <label key={pilihan.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        id={`pertanyaan-${pertanyaan.id}`}
                                                                        name={`pertanyaan-${pertanyaan.id}`}
                                                                        value={pilihan.id}
                                                                        checked={answers[pertanyaan.id].value == pilihan.id}
                                                                        onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <span className="text-sm font-medium text-gray-700">{pilihan.teks_jawaban}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Teks */}
                                                    {pertanyaan.tipe_pertanyaan === 'teks' && (
                                                        <div>
                                                            <textarea
                                                                id={`pertanyaan-${pertanyaan.id}`}
                                                                rows="4"
                                                                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 placeholder-gray-400"
                                                                value={answers[pertanyaan.id].value}
                                                                onChange={(e) => handleAnswerChange(pertanyaan.id, e.target.value)}
                                                                placeholder="✏️ Tuliskan jawaban Anda di sini..."
                                                            ></textarea>

                                                        </div>
                                                    )}

                                                    {errors[`answers.${pertanyaan.id}.value`] && <p className="text-red-500 text-xs mt-1">{errors[`answers.${pertanyaan.id}.value`]}</p>}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-gray-500">
                                                {isHaid ?
                                                    "Admin belum menambahkan pertanyaan untuk status Haid." :
                                                    "Admin belum menambahkan pertanyaan untuk status Suci."
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Submit (di bawah Card 2) */}
                            <div className="flex justify-start">
                                <ButtonSave type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <><i className="fa fa-spinner fa-spin mr-2"></i> Mengirim...</>
                                    ) : (
                                        <><i className="fa fa-check-circle mr-2"></i> Kirim Laporan</>
                                    )}
                                </ButtonSave>
                            </div>
                        </div> {/* --- Akhir wrapper Card 2 + Tombol --- */}

                    </div> {/* --- Akhir dari Grid Container --- */}
                </div> {/* --- Akhir dari wrapper utama --- */}
            </form>
        </MyLayout>
    );
}