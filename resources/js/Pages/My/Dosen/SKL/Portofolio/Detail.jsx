import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '@/Layouts/MyLayout';
import formatDateTime from '@/Utilities/formatDateTime';
import ToastNotification from '@/Shared/ToastNotification';
import RecapStats from '../../../Admin/Pekanan/TugasPekanan/KomponenPekanan/RecapStats';
import AnswerContent from '../Komponen/AnswerContent';

// Komponen GradeSubmissionModal tetap sama strukturnya
const GradeSubmissionModalInternal = ({ isOpen, onClose, onSubmit, submission, errors, isSubmitting }) => {
    const [nilai, setNilai] = useState(submission?.nilai || '');
    const [feedback, setFeedback] = useState(submission?.feedback_dosen || '');
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nilai, feedback, submissionId: submission.uuid });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-white/20 p-6 relative animate-fade-in"
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 text-2xl hover:text-gray-700"
                >
                    &times;
                </button>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fa fa-star text-yellow-500"></i> Beri Nilai Mahasiswa
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nilai (0–100)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={nilai}
                            onChange={(e) => setNilai(e.target.value)}
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                        />
                        {errors.nilai && <p className="text-xs text-red-500">{errors.nilai}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Dosen</label>
                        <textarea
                            rows="3"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow transition"
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Nilai'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function Detail() {
    // GANTI: 'projectSemester' -> 'portofolio'
    const { portofolio, kelasHarian, mahasiswaData, stats, errors } = usePage().props;
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [currentSubmissionToGrade, setCurrentSubmissionToGrade] = useState(null);
    const [isGrading, setIsGrading] = useState(false);

    const handleOpenGradeModal = (submission) => {
        setCurrentSubmissionToGrade(submission);
        setIsGradeModalOpen(true);
    };
    const handleCloseGradeModal = () => {
        setIsGradeModalOpen(false);
        setCurrentSubmissionToGrade(null);
    };
    const handleSubmitGrade = ({ nilai, feedback, submissionId }) => {
        setIsGrading(true);
        Inertia.put(
            // GANTI: route & parameter
            route('dsn.portofolio.submit_grade', { pengumpulanPortofolio: submissionId }),
            { nilai, feedback_dosen: feedback },
            {
                preserveScroll: true,
                onSuccess: () => {
                    handleCloseGradeModal();
                    ToastNotification({ icon: 'success', title: 'Nilai berhasil disimpan!' });
                },
                onFinish: () => setIsGrading(false),
            }
        );
    };

    return (
        <MyLayout>
            {/* GANTI: title & 'portofolio' -> 'portofolio' */}
            <Head title={`Detail Portofolio - ${portofolio.judul}`} />
            <div className="space-y-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Kolom Kiri */}
                    <div className="space-y-6">
                        <RecapStats stats={stats} />
                        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-md p-6 border border-white/20 hover:shadow-xl transition-all duration-300">

                            <div className="flex justify-between items-center border-b pb-3">
                                <Link
                                    // GANTI: route
                                    href={route('dsn.portofolio.show', { kelasHarian: kelasHarian.uuid })}
                                    className="text-sm text-blue-600 hover:no-underline flex items-center gap-2"
                                >
                                    <i className="fa fa-arrow-left"></i> Kembali
                                </Link>
                                
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 py-3">
                                {/* GANTI: 'portofolio' -> 'portofolio' */}
                                <h1 className="text-2xl font-bold text-gray-900">{portofolio.judul}</h1>
                                <span
                                    className="px-2.5 py-1 text-xs font-semibold uppercase rounded-full bg-indigo-100 text-indigo-800 w-fit"
                                    title={kelasHarian.nama_kelas}
                                >
                                    untuk kelas ({kelasHarian.nama_kelas})
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                                    <p className="text-blue-700 font-semibold">Waktu Mulai</p>
                                    <p className="text-gray-800 mt-1">
                                         {/* GANTI: 'portofolio' -> 'portofolio' */}
                                        {formatDateTime(portofolio.waktu_mulai, { includeTime: true })}
                                    </p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-3 text-sm">
                                    <p className="text-red-700 font-semibold">Batas Waktu</p>
                                    <p className="text-gray-800 mt-1">
                                         {/* GANTI: 'portofolio' -> 'portofolio' */}
                                        {formatDateTime(portofolio.batas_waktu, { includeTime: true })}
                                    </p>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div
                                className="prose prose-gray max-w-none prose-sm text-gray-800 mt-4
                                prose-headings:text-gray-900
                                prose-strong:text-gray-900
                                prose-li:marker:text-indigo-600
                                prose-ul:list-disc prose-ol:list-decimal"
                                dangerouslySetInnerHTML={{ __html: portofolio.deskripsi }}
                            ></div>

                             {/* HAPUS: Blok Catatan (karena tidak ada di Portofolio) */}
                            
                        </div>
                    </div>

                    {/* Kolom Kanan */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-white/20 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
                            <i className="fa fa-users text-indigo-600"></i> Daftar Pengumpulan
                        </h2>
                        <div className="overflow-x-auto">
                            <div className="space-y-4">
                                {mahasiswaData.map((mhs) => (
                                    <div
                                        key={mhs.id}
                                        className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        {/* Kiri: Info Mahasiswa */}
                                        <div className="flex items-start sm:items-center gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold rounded-full">
                                                {mhs.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{mhs.name}</p>
                                                <p className="text-xs text-gray-500">{mhs.nim || '-'}</p>
                                                <div className="mt-1">
                                                    {/* GANTI: prop ke AnswerContent */}
                                                    <AnswerContent submission={mhs.submission} portofolio={portofolio} nameMhs={mhs.name} />
                                                </div>

                                                {/* Tampilkan tanggal pengumpulan */}
                                                {mhs.submission && (
                                                    <p className="mt-4 text-xs text-gray-400">
                                                        <span className="px-2.5 py-1 text-xs font-semibold uppercase rounded-full bg-indigo-100 text-indigo-800">
                                                            {new Date(mhs.submission.created_at).toLocaleString('id-ID', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short',
                                                            })}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Kanan: Status & Tombol */}
                                        <div className="mt-3 sm:mt-0 flex sm:flex-col items-center sm:items-end gap-2">
                                            {mhs.submission ? (
                                                <>
                                                    <span
                                                        className={`text-xs font-medium px-2 py-1 rounded-full ${mhs.submission.nilai !== null
                                                                ? 'text-green-600 bg-green-50'
                                                                : 'text-indigo-600 bg-indigo-50'
                                                            }`}
                                                    >
                                                        {mhs.submission.nilai !== null ? 'Sudah Dinilai' : 'Terkumpul'}
                                                    </span>
                                                    <button
                                                        onClick={() => handleOpenGradeModal(mhs.submission)}
                                                        className={`px-3 py-1.5 text-xs text-white rounded-md shadow transition ${mhs.submission.nilai !== null
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-indigo-600 hover:bg-indigo-700'
                                                            }`}
                                                    >
                                                        {mhs.submission.nilai !== null ? 'Edit Nilai' : 'Beri Nilai'}
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Belum Mengumpulkan</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {currentSubmissionToGrade && (
                    <GradeSubmissionModalInternal // Ganti nama agar tidak konflik
                        isOpen={isGradeModalOpen}
                        onClose={handleCloseGradeModal}
                        onSubmit={handleSubmitGrade}
                        submission={currentSubmissionToGrade}
                        errors={errors}
                        isSubmitting={isGrading}
                    />
                )}
            </div>
        </MyLayout>
    );
}