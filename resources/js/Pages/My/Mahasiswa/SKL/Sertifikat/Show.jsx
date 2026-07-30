import React, { useState, useEffect } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import formatDate from '@/Utilities/formatDateTime';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ToastNotification from '@/Shared/ToastNotification';
// GANTI: Path ke folder KomponenSertifikat
import Countdown from '../../Pekanan/Atom/Countdown'; // Path ini diasumsikan masih valid
import SubmittedView from './SubmittedView';
import SubmissionForm from './SubmissionForm';

// Komponen Utama Halaman Detail
export default function Show() {
    // GANTI: 'buku' -> 'sertifikat'
    const { sertifikat, submission, status, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    // Definisikan semua variabel waktu di awal
    // GANTI: 'sertifikat' -> 'sertifikat'
    const startTime = new Date(sertifikat.waktu_mulai);
    const deadline = new Date(sertifikat.batas_waktu);
    const now = new Date();

    // Buat flag kondisi yang jelas (Logika ini tetap sama)
    const hasStarted = now >= startTime;
    const hasEnded = now > deadline;
    const isGraded = status === 'Sudah Dinilai';
    const canEdit = submission && !hasEnded && !isGraded;

    return (
        <MyLayout>
            {/* GANTI: 'sertifikat' -> 'sertifikat' */}
            <Head title={sertifikat.judul} />

            {/* === WRAPPER === */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                    {/* === CARD DETAIL TUGAS SERTIFIKAT === */}
                    <div className="bg-white p-6 rounded-xl shadow-lg h-fit">
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            {/* GANTI: 'sertifikat' -> 'sertifikat' */}
                            <h2 className="text-xl font-bold text-gray-800">{sertifikat.judul}</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 border-b pb-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-xs font-semibold text-blue-700 flex items-center">
                                    <i className="far fa-play-circle mr-2"></i>WAKTU MULAI
                                </p>
                                <p className="text-sm font-medium text-gray-800 mt-1">
                                    {/* GANTI: 'sertifikat' -> 'sertifikat' */}
                                    {formatDate(sertifikat.waktu_mulai, { includeTime: true })}
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-xs font-semibold text-red-700 flex items-center">
                                    <i className="fa fa-flag-checkered mr-2"></i>BATAS WAKTU
                                </p>
                                <p className="text-sm font-medium text-gray-800 mt-1">
                                    {/* GANTI: 'sertifikat' -> 'sertifikat' */}
                                    {formatDate(sertifikat.batas_waktu, { includeTime: true })}
                                </p>
                            </div>
                        </div>

                        {/* Blok Deskripsi */}
                        <div
                            className="prose prose-gray max-w-none prose-sm text-gray-800 mt-4
                                prose-headings:text-gray-900
                                prose-strong:text-gray-900
                                prose-li:marker:text-indigo-600
                                prose-ul:list-disc prose-ol:list-decimal"
                            dangerouslySetInnerHTML={{
                                // GANTI: 'sertifikat' -> 'sertifikat'
                                __html: sertifikat.deskripsi,
                            }}
                        ></div>

                        {/* Blok Catatan (Tidak ada) */}

                    </div>

                    {/* === CARD AREA PENGUMPULAN / STATUS === */}
                    <div className="bg-white p-6 rounded-xl shadow-lg h-fit">
                        {(() => {
                            if (isGraded) {
                                return (
                                    <div className="space-y-6">
                                        <SubmittedView
                                            submission={submission}
                                            // GANTI: 'tugas' -> 'sertifikat'
                                            tugas={sertifikat}
                                        />
                                        <div className="mt-6 pt-6 border-t">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                Hasil Penilaian
                                            </h3>
                                            <div className="mt-4 space-y-4">
                                                <div className="flex justify-between p-4 bg-green-50 rounded-lg items-center">
                                                    <span className="font-medium text-green-800">
                                                        Nilai Anda
                                                    </span>
                                                    <span className="font-bold text-3xl text-green-800">
                                                        {submission.nilai}
                                                    </span>
                                                </div>
                                                {submission.feedback_dosen && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-700">
                                                            Feedback dari Dosen:
                                                        </h4>
                                                        <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-600 border">
                                                            {submission.feedback_dosen}
                                                        </div>
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
                                        <h3 className="text-lg font-semibold text-blue-700">
                                            {/* GANTI: Teks */}
                                            Tugas Sertifikat Belum Dimulai
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 mb-6">
                                            {/* GANTI: Teks */}
                                            Anda dapat mulai mengirimkan sertifikat anda dalam:
                                        </p>
                                        {/* GANTI: 'sertifikat' -> 'sertifikat' */}
                                        <Countdown targetDate={sertifikat.waktu_mulai} />
                                    </div>
                                );
                            }
                            if (hasEnded && !submission) {
                                return (
                                    <div className="text-center py-8">
                                        <i className="far fa-times-circle fa-2x text-red-400 mb-3"></i>
                                        <h3 className="text-lg font-semibold text-red-700">
                                            Waktu Pengumpulan Telah Berakhir
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {/* GANTI: Teks */}
                                            Anda tidak mengumpulkan jawaban untuk tugas sertifikat ini.
                                        </p>
                                    </div>
                                );
                            }
                            return (
                                <div className="space-y-6">
                                    {submission && (
                                        <SubmittedView
                                            submission={submission}
                                            // GANTI: 'tugas' -> 'sertifikat'
                                            tugas={sertifikat}
                                        />
                                    )}

                                    {/* Tampilkan form hanya jika belum melewati batas waktu */}
                                    {!hasEnded && (
                                        <SubmissionForm
                                            // GANTI: 'tugas' -> 'sertifikat'
                                            tugas={sertifikat}
                                            submission={submission}
                                        />
                                    )}

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
            </div>
        </MyLayout>

    );
}