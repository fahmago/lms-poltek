import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '@/Layouts/MyLayout';
import formatDate from '@/Utilities/formatDateTime';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '@/Shared/ToastNotification';
import YoutubeGalleryModal from '../../../../../Shared/YoutubeGalleryModal';

// Komponen untuk Statistik Keseluruhan
const RecapStats = ({ stats }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Rekapitulasi Pengumpulan</h2>
        <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-gray-600">Total Mahasiswa Mengumpulkan</span>
                <span className="text-gray-800">{stats.total_submissions} / {stats.total_students}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${stats.completion_percentage}%` }}></div></div>
            <div className="text-right text-lg font-bold text-blue-600">{stats.completion_percentage}% Selesai</div>
        </div>
    </div>
);

// Komponen untuk menampilkan Jawaban Mahasiswa
const AnswerContent = ({ submission, tugasPekanan }) => {
    // State untuk mengontrol modal galeri
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

    if (!submission) {
        return <span className="text-xs text-gray-400 italic">Belum mengumpulkan</span>;
    }
    
    // Helper untuk mendapatkan thumbnail YouTube
    const getYoutubeThumbnail = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    if (tugasPekanan.tipe_tugas === 'yt') { // Tipe 'yt'
        if (submission.jawaban.length === 1) { // Hanya satu video, tampilkan iframe langsung
            const videoId = submission.jawaban[0];
            return (
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md mt-2">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded YouTube Video"
                    ></iframe>
                    <a 
                        href={`https://www.youtube.com/watch?v=${videoId}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline text-sm flex items-center gap-2 mt-2"
                    >
                        <i className="fab fa-youtube text-red-500"></i> Buka di YouTube
                    </a>
                </div>
            );
        } else { // Banyak video, tampilkan thumbnail + tombol galeri
            return (
                <div className="flex flex-col items-start gap-2 mt-2">
                    <div className="relative w-48 h-28 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                        <img src={getYoutubeThumbnail(submission.jawaban[0])} alt="Playlist Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                            <span className="text-white text-sm font-bold bg-gray-800 bg-opacity-70 px-2 py-1 rounded">
                                +{submission.jawaban.length} Video
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-2"
                    >
                        <i className="fab fa-youtube"></i> Tonton Semua
                    </button>

                    {/* Modal Galeri Video */}
                    <YoutubeGalleryModal 
                        isOpen={isGalleryModalOpen} 
                        onClose={() => setIsGalleryModalOpen(false)} 
                        videoIds={submission.jawaban} 
                        title={`Video Playlist - ${tugasPekanan.judul}`}
                    />
                </div>
            );
        }
    }
    
    // Tipe 'other'
    return (
        <a href={submission.jawaban} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-2 mt-2">
            <i className="fa fa-link text-gray-400"></i> Lihat Link Jawaban
        </a>
    );
};

// Komponen Modal untuk memberi nilai
const GradeSubmissionModal = ({ isOpen, onClose, onSubmit, submission, errors, isSubmitting }) => {
    const [nilai, setNilai] = useState(submission?.nilai || '');
    const [feedback, setFeedback] = useState(submission?.feedback_dosen || '');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nilai, feedback, submissionId: submission.uuid });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Beri Nilai Tugas</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="nilai" className="block text-sm font-medium text-gray-700 mb-1">Nilai (0-100)</label>
                            <input type="number" id="nilai" value={nilai} onChange={e => setNilai(e.target.value)} min="0" max="100" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            {errors.nilai && <p className="text-red-500 text-xs mt-1">{errors.nilai}</p>}
                        </div>
                        <div>
                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">Feedback Dosen (Opsional)</label>
                            <textarea id="feedback" value={feedback} onChange={e => setFeedback(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                            {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 mr-2">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Menilai...' : 'Simpan Nilai'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- KOMPONEN UTAMA HALAMAN DETAIL ---
export default function Detail() {
    const { tugasPekanan, rekapPerKelas, stats, errors } = usePage().props;
    
    const [openKelasId, setOpenKelasId] = useState(rekapPerKelas[0]?.id || null);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [currentSubmissionToGrade, setCurrentSubmissionToGrade] = useState(null);
    const [isGrading, setIsGrading] = useState(false);

    const toggleAccordion = (kelasId) => {
        setOpenKelasId(openKelasId === kelasId ? null : kelasId);
    };

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
        // Pastikan Anda sudah membuat rute ini
        Inertia.post(route('my.tweek.submit_grade', { pengumpulanTugasPekanan: submissionId }), {
            nilai: nilai,
            feedback_dosen: feedback,
        }, {
            onSuccess: () => {
                handleCloseGradeModal();
                ToastNotification({ icon: 'success', title: 'Nilai berhasil disimpan!' });
            },
            onError: (err) => ToastNotification({ icon: 'error', title: 'Gagal menyimpan nilai.' }),
            onFinish: () => setIsGrading(false),
        });
    };

    return (
        <MyLayout>
            <Head title={`Detail Tugas - ${tugasPekanan.judul}`} />
            
            <div className="max-w-4xl mx-auto py-8 space-y-6">
                {/* Kartu Header (bisa disamakan juga jika mau) */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Link href={route('my.tweek.show', tugasPekanan.prodi.uuid)} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2 mb-4">
                        <i className="fa fa-arrow-left"></i>
                        Kembali ke Daftar Tugas
                    </Link>
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{tugasPekanan.judul}</h1>
                        <span 
                            className="px-2.5 py-1 text-xs font-semibold uppercase rounded-full bg-indigo-100 text-indigo-800"
                            title={tugasPekanan.prodi.nama_prodi}
                        >{tugasPekanan.prodi.nama_prodi}
                        </span>
                    </div>
                </div>

                {/* --- KARTU DETAIL TUGAS DENGAN DESAIN BARU --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">Detail Tugas</h2>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${tugasPekanan.tipe_tugas === 'yt' ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            {tugasPekanan.tipe_tugas === 'yt' ? 'Video YouTube' : 'Link Umum'}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-xs font-semibold text-blue-700 flex items-center"><i className="far fa-play-circle mr-2"></i>WAKTU MULAI</p>
                            <p className="text-sm font-medium text-gray-800 mt-1">{formatDate(tugasPekanan.waktu_mulai, { includeTime: true })}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-xs font-semibold text-red-700 flex items-center"><i className="fa fa-flag-checkered mr-2"></i>BATAS WAKTU</p>
                            <p className="text-sm font-medium text-gray-800 mt-1">{formatDate(tugasPekanan.batas_waktu, { includeTime: true })}</p>
                        </div>
                    </div>
                    <div className="prose max-w-none prose-sm sm:prose-base text-gray-700" dangerouslySetInnerHTML={{ __html: tugasPekanan.deskripsi }}></div>
                </div>

                {/* Kartu Rekapitulasi Keseluruhan */}
                <RecapStats stats={stats} />

                {/* AKORDEON REKAP PER KELAS */}
                <div className="space-y-3">
                    <h2 className="text-xl font-bold text-gray-800">Rekapitulasi per Kelas</h2>
                    {rekapPerKelas.map(kelas => (
                        <div key={kelas.id} className="border rounded-lg bg-white shadow-sm overflow-hidden">
                            <button onClick={() => toggleAccordion(kelas.id)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{kelas.nama_kelas}</h3>
                                    <span className="text-sm text-gray-500">{kelas.stats.submission_count} dari {kelas.stats.total_students} mhs ({kelas.stats.completion_percentage}%)</span>
                                </div>
                                <i className={`fa fa-chevron-down transition-transform ${openKelasId === kelas.id ? 'rotate-180' : ''}`}></i>
                            </button>
                            {openKelasId === kelas.id && (
                                <div className="p-4 border-t bg-gray-50">
                                    <table className="min-w-full">
                                        <thead className="sr-only"><tr><th>Mahasiswa</th><th>Jawaban</th><th>Aksi</th></tr></thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {kelas.mahasiswas.map(mhs => (
                                                <tr key={mhs.id}>
                                                    <td className="py-3 pr-4">
                                                        <p className="font-medium text-gray-900">{mhs.name}</p>
                                                        <p className="text-sm text-gray-500 font-mono">{mhs.nim || '-'}</p>
                                                    </td>
                                                    <td className="py-3 px-4"><AnswerContent submission={mhs.submission} tugasPekanan={tugasPekanan}/></td>
                                                    <td className="py-3 pl-4 text-right">
                                                        {mhs.submission ? (
                                                            <button onClick={() => handleOpenGradeModal(mhs.submission)} className={`px-3 py-1.5 text-xs font-medium text-white rounded-md hover:bg-blue-700 ${mhs.submission.nilai !== null ? 'bg-green-600' : 'bg-blue-600'}`}>
                                                                {mhs.submission.nilai !== null ? 'Edit Nilai' : 'Beri Nilai'}
                                                            </button>
                                                        ) : <span className="text-xs font-medium text-gray-400">Belum Ada</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {currentSubmissionToGrade && (
                <GradeSubmissionModal 
                    isOpen={isGradeModalOpen}
                    onClose={handleCloseGradeModal}
                    onSubmit={handleSubmitGrade}
                    submission={currentSubmissionToGrade}
                    errors={errors}
                    isSubmitting={isGrading}
                />
            )}
        </MyLayout>
    );
};