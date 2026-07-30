import React, { useState, useEffect } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
// import formatDate from '@/Utilities/formatDate';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ToastNotification from '@/Shared/ToastNotification';
import InputField from '@/Shared/Fields/InputField'; 

const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    
    const options = {
        weekday: 'short', // "Jum"
        day: 'numeric',   // "25"
        month: 'short',   // "Okt"
        year: 'numeric',  // "2025"
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,    // Gunakan format 24 jam
    };

    // Format tanggal dan ganti pemisah
    let formatted = new Intl.DateTimeFormat('id-ID', options).format(date);
    // Hasil dari Intl bisa '25 Okt 2025, 09.00', kita ganti menjadi format yang diinginkan
    formatted = formatted.replace(/, /g, ' ').replace(/\./g, ':');
    
    return `${formatted} WIB`; // Tambahkan WIB
};

// --- KOMPONEN LENGKAP UNTUK FORM PENGUMPULAN ---
const SubmissionForm = ({ tugas, submission }) => {
    const { errors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [jawaban, setJawaban] = useState(() => {
        if (tugas.tipe_tugas === 'yt') {
            return submission?.jawaban && Array.isArray(submission.jawaban) ? submission.jawaban : [''];
        }
        return submission?.jawaban || '';
    });
    
    const [duplicateErrors, setDuplicateErrors] = useState({});

    const checkForDuplicates = (ids) => {
        const newErrors = {};
        const seen = new Set();
        let hasDuplicates = false;
        ids.forEach((id, index) => {
            const trimmedId = id.trim();
            if (trimmedId === '') return;
            if (seen.has(trimmedId)) {
                hasDuplicates = true;
                ids.forEach((innerId, innerIndex) => {
                    if (innerId.trim() === trimmedId) {
                        newErrors[innerIndex] = 'Video ID ini sudah digunakan di dalam form ini.';
                    }
                });
            }
            seen.add(trimmedId);
        });
        setDuplicateErrors(newErrors);
        return hasDuplicates;
    };

    const handleYoutubeIdChange = (index, value) => {
        const newIds = [...jawaban];
        newIds[index] = value;
        setJawaban(newIds);
        checkForDuplicates(newIds);
    };

    const addVideoIdField = () => setJawaban([...jawaban, '']);
    const removeVideoIdField = (index) => {
        const newIds = jawaban.filter((_, i) => i !== index);
        setJawaban(newIds);
        checkForDuplicates(newIds);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (tugas.tipe_tugas === 'yt' && checkForDuplicates(jawaban)) {
            ToastNotification({ icon: 'error', title: 'Terdapat Video ID yang sama.' });
            return;
        }
        setIsSubmitting(true);
        const dataToSend = {
            jawaban: tugas.tipe_tugas === 'yt' ? jawaban.filter(id => id.trim() !== '') : jawaban,
        };
        Inertia.post(route('mhs.tweek.submit', { tugasPekanan: tugas.uuid }), dataToSend, {
            onFinish: () => setIsSubmitting(false),
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{submission ? 'Perbarui Jawaban Anda' : 'Kirim Jawaban Anda'}</h3>
            {tugas.tipe_tugas === 'yt' ? (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Video ID YouTube</label>
                    {jawaban.map((videoId, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-center gap-2">
                                {/* Menggunakan InputField */}
                                <InputField 
                                    type="text" 
                                    value={videoId} 
                                    onChange={e => handleYoutubeIdChange(index, e.target.value)} 
                                    placeholder="Contoh: dQw4w9WgXcQ" 
                                    className={`flex-grow ${duplicateErrors[index] ? 'border-red-500 ring-red-500' : ''}`} // Styling error
                                    error={duplicateErrors[index]} // Meneruskan error ke InputField
                                    hideLabel={true} // Sembunyikan label bawaan InputField
                                />
                                {jawaban.length > 1 && <button type="button" onClick={() => removeVideoIdField(index)} className="px-3 py-2 -mt-2 text-sm text-red-600 hover:bg-red-50 rounded-md"><i className="fa fa-trash-alt"></i></button>}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addVideoIdField} className="text-sm text-blue-600 hover:underline">+ Tambah Video (untuk playlist)</button>
                </div>
            ) : (
                <div>
                    {/* Menggunakan InputField */}
                    <InputField 
                        label="Link Jawaban" 
                        type="url" 
                        value={jawaban} 
                        onChange={e => setJawaban(e.target.value)} 
                        placeholder="https://..." 
                        error={errors.jawaban} 
                        required 
                    />
                </div>
            )}
            {/* Menampilkan error dari backend */}
            {Object.keys(errors).map(key => key.startsWith('jawaban.') && <p key={key} className="text-red-500 text-xs mt-1">{errors[key]}</p>)}
            
            <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting || Object.keys(duplicateErrors).length > 0} className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Mengirim...' : (submission ? 'Perbarui Jawaban' : 'Kirim Jawaban')}
                </button>
            </div>
        </form>
    );
};

// --- KOMPONEN LENGKAP UNTUK MENAMPILKAN JAWABAN YANG SUDAH DIKUMPULKAN ---
const SubmittedView = ({ submission, tugas }) => {
    if (!submission || !submission.jawaban) return null;

    const [playingVideoId, setPlayingVideoId] = useState(null);
    const closeModal = () => setPlayingVideoId(null);
    const getYoutubeThumbnail = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    const getGridColsClass = (count) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 md:grid-cols-2';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'; 
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Jawaban Terkirim</h3>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-inner">
                <p className="text-sm text-gray-500 mb-4 font-mono">
                    Dikumpulkan pada: {formatDate(submission.created_at)}
                </p>
                {tugas.tipe_tugas === 'yt' ? (
                    <div className={`grid ${getGridColsClass(submission.jawaban.length)} gap-4`}>
                        {submission.jawaban.map((videoId, i) => (
                            <div key={i} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700 group">
                                <img src={getYoutubeThumbnail(videoId)} alt={`YouTube Thumbnail ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => setPlayingVideoId(videoId)}
                                        className="text-white bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        title={`Tonton Video ${i+1}`}
                                    >
                                        <i className="fab fa-youtube fa-2x"></i>
                                    </button>
                                </div>
                                <a 
                                    href={`https://www.youtube.com/watch?v=${videoId}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="absolute bottom-2 left-2 text-white text-xs bg-gray-800 bg-opacity-70 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-900 transition-colors"
                                    title="Buka di YouTube"
                                >
                                    <i className="fa fa-external-link-alt"></i>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <a 
                        href={submission.jawaban} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                        <i className="fa fa-link fa-lg text-blue-600"></i> 
                        <span className="text-sm text-gray-800 truncate font-medium">{submission.jawaban}</span>
                        <i className="fa fa-external-link-alt text-gray-400 ml-auto"></i>
                    </a>
                )}
            </div>

            {/* Modal untuk memutar video YouTube */}
            {playingVideoId && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded YouTube Video"
                        ></iframe>
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white text-3xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black focus:outline-none focus:ring-2 focus:ring-white z-10">&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
};


// Komponen Utama Halaman Detail Tugas
const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div className="flex justify-center gap-4 text-center">
            {Object.keys(timeLeft).length > 0 ? (
                Object.entries(timeLeft).map(([interval, value]) => (
                    <div key={interval} className="p-3 bg-blue-50 rounded-lg w-20">
                        <div className="text-2xl font-bold text-blue-600">{value}</div>
                        <div className="text-xs text-blue-500 uppercase">{interval}</div>
                    </div>
                ))
            ) : (
                <span className="text-green-600 font-semibold">Tugas sudah dimulai!</span>
            )}
        </div>
    );
};


// Komponen Utama Halaman Detail
export default function Show() {
    const { tugasPekanan, submission, status, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    // Definisikan semua variabel waktu di awal
    const startTime = new Date(tugasPekanan.waktu_mulai);
    const deadline = new Date(tugasPekanan.batas_waktu);
    const now = new Date();

    // Buat flag kondisi yang jelas
    const hasStarted = now >= startTime;
    const hasEnded = now > deadline;
    const isGraded = status === 'Sudah Dinilai';
    const canEdit = submission && !hasEnded && !isGraded;


    return (
        <MyLayout>
            <Head title={tugasPekanan.judul} />
            <div className="max-w-4xl mx-auto py-8 space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Link href={route('mhs.tweek.index')} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-2 mb-4">
                        <i className="fa fa-arrow-left"></i>
                        Kembali ke Daftar Tugas
                    </Link>
                    <div className="flex items-center justify-between gap-3">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">{tugasPekanan.judul}</h1>
                        <span 
                            className="px-2.5 py-1 text-xs font-semibold uppercase rounded-full bg-indigo-100 text-indigo-800"
                            title={tugasPekanan.prodi.nama_prodi}
                        >{tugasPekanan.prodi.nama_prodi}
                        </span>
                    </div>
                </div>

                {/* Detail Tugas */}
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
                            <p className="text-sm font-medium text-gray-800 mt-1">{formatDate(tugasPekanan.waktu_mulai)}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-xs font-semibold text-red-700 flex items-center"><i className="fa fa-flag-checkered mr-2"></i>BATAS WAKTU</p>
                            <p className="text-sm font-medium text-gray-800 mt-1">{formatDate(tugasPekanan.batas_waktu)}</p>
                        </div>
                    </div>
                    
                    <div className="prose prose-gray max-w-none prose-sm text-gray-800 mt-4
             prose-headings:text-gray-900
             prose-strong:text-gray-900
             prose-li:marker:text-indigo-600
             prose-ul:list-disc prose-ol:list-decimal" dangerouslySetInnerHTML={{ __html: tugasPekanan.deskripsi }}></div>
                </div>

                {/* Area Pengumpulan atau Status */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    {(() => {
                        if (isGraded) {
                            return (
                                <div className="space-y-6">
                                    <SubmittedView submission={submission} tugas={tugasPekanan} />
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="text-lg font-semibold text-gray-800">Hasil Penilaian</h3>
                                        <div className="mt-4 space-y-4">
                                            <div className="flex justify-between p-4 bg-green-50 rounded-lg items-center">
                                                <span className="font-medium text-green-800">Nilai Anda</span>
                                                <span className="font-bold text-3xl text-green-800">{submission.nilai}</span>
                                            </div>
                                            {submission.feedback_dosen && (
                                                <div>
                                                    <h4 className="font-medium text-gray-700">Feedback dari Dosen:</h4>
                                                    <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-600 border">{submission.feedback_dosen}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        if (!hasStarted) {
                            return (
                                <div className="text-center py-8">
                                    <i className="far fa-clock fa-2x text-blue-400 mb-4"></i>
                                    <h3 className="text-lg font-semibold text-blue-700">Tugas Belum Dimulai</h3>
                                    <p className="text-sm text-gray-500 mt-1 mb-6">Anda dapat mulai mengirimkan tugas anda dalam:</p>
                                    <Countdown targetDate={tugasPekanan.waktu_mulai} />
                                </div>
                            );
                        }
                        if (hasEnded && !submission) {
                            return (
                                <div className="text-center py-8">
                                    <i className="far fa-times-circle fa-2x text-red-400 mb-3"></i>
                                    <h3 className="text-lg font-semibold text-red-700">Waktu Pengumpulan Telah Berakhir</h3>
                                    <p className="text-sm text-gray-500 mt-1">Anda tidak mengumpulkan jawaban untuk tugas ini.</p>
                                </div>
                            );
                        }
                        // Jika sudah mulai, belum berakhir, atau sudah submit (bisa diedit)
                        return (
                            <div className="space-y-6">
                                {submission && <SubmittedView submission={submission} tugas={tugasPekanan} />}
                                <SubmissionForm tugas={tugasPekanan} submission={submission} />
                                {hasEnded && submission && (
                                    <p className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-md">
                                        <i className="fa fa-exclamation-triangle mr-2"></i>
                                        Waktu pengumpulan telah berakhir, Anda tidak dapat mengubah jawaban lagi.
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </MyLayout>
    );
}