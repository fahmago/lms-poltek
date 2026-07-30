import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable'; // Pastikan komponen ini ada
import ToastNotification from '@/Shared/ToastNotification'; // Pastikan komponen ini ada
import { formatDateID } from '@/Utilities/formatDateID';
import ModalWajibLaporIbadah from '@/Shared/ModalWajibLaporIbadah';

export default function Index() {
    // Ambil 'laporanStatuses' dan 'flash' dari props
    const { laporanStatuses, flash } = usePage().props;

    // 2. Buat state untuk mengontrol modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tanggalKosongModal, setTanggalKosongModal] = useState([]);

    // 3. Gunakan useEffect untuk mengecek data flash
    useEffect(() => {
        // Logika untuk Toast (notifikasi sukses/error biasa)
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });

        const dataKosong = flash?.tanggal_kosong;
        let listTanggal = [];

        if (Array.isArray(dataKosong)) {
            listTanggal = dataKosong;
        } else if (typeof dataKosong === 'object' && dataKosong !== null) {
            listTanggal = Object.values(dataKosong);
        }

        if (listTanggal.length > 0) {
            setTanggalKosongModal(listTanggal);
            setIsModalOpen(true);
        }

    }, [flash]); // PENTING: Jalankan effect ini setiap kali 'flash' berubah

    // Tombol "Isi Laporan" selalu aktif
    const renderCreateButton = () => {
        return (
            <Link
                href={route('mhs.laporan-ibadah.create')} // Link ke halaman create
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 shadow-lg"
            >
                <i className="fa fa-plus-circle mr-2"></i>
                Isi Laporan Ibadah
            </Link>
        );
    };

    // Helper untuk render badge status
    const renderStatusBadge1 = (status) => {
        switch (status) {
            case 'Terkirim':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"><i className="fa fa-check mr-1"></i> Terkirim</span>;
            case 'Haid':
                return <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"><i className="fa fa-droplet mr-1"></i> Haid</span>;
            case 'Belum Mengisi':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"><i className="fa fa-exclamation-triangle mr-1"></i> Belum Mengisi</span>;
            default:
                return null;
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {

            case 'Terkirim':
                return (
                    <span
                        title="Terkirim"
                        // className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium cursor-default"
                    >
                        <i className="fa fa-check lg:mr-2 md:mr-2"></i>
                        <span className="hidden sm:inline">Terkirim</span>
                    </span>
                );

            case 'Haid':
                return (
                    <span
                        title="Haid"
                        // className="flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                        className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium cursor-default"
                    >
                        <i className="fa fa-droplet lg:mr-2 md:mr-2"></i>
                        <span className="hidden sm:inline">Haid</span>
                    </span>
                );

            case 'Belum Mengisi':
                return (
                    <span
                        title="Belum Mengisi"
                        // className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium cursor-default"
                    >
                        <i className="fa fa-exclamation-triangle lg:mr-2 md:mr-2"></i>
                        <span className="hidden sm:inline">Belum Mengisi</span>
                    </span>
                );

            default:
                return null;
        }
    };


    // Sesuaikan headers dan rows
    const headers = ["No.", "Tanggal Laporan", "Status", "Dikirim Pada"];

    const rows = laporanStatuses.map((laporan, index) => [
        index + 1, // Nomor urut sederhana
        formatDateID(laporan.tanggal),
        renderStatusBadge(laporan.status),
        // laporan.diisi_pada,
        <>
            {laporan.diisi_pada ? (
                <span>{laporan.diisi_pada}</span>
            ) : (
                <span title={'Belum Mengisi'} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium cursor-default">
                    <i className="fa fa-exclamation-triangle lg:mr-2 md:mr-2"></i>
                    <span className="hidden sm:inline">Belum Mengisi</span>
                </span>
            )}
        </>
    ]);

    return (
        <>
            <Head title="Riwayat Laporan Ibadah" />

            {/* 4. Render Modal di sini */}
            {/* Modal akan otomatis tampil jika isModalOpen=true */}
            <ModalWajibLaporIbadah
                isOpen={isModalOpen}
                tanggalKosong={tanggalKosongModal}
                onClose={() => setIsModalOpen(false)} // Opsional: jika Anda ingin modal bisa ditutup
            />

            <MyLayout>
                <div className="flex flex-col gap-4">

                    <div className="w-full flex justify-start">
                        {renderCreateButton()}
                    </div>

                    <DataTable
                        headers={headers}
                        rows={rows}
                        iconClass="fa fa-history"
                        title="Riwayat Laporan Ibadah (15 Hari Terakhir)"
                    />
                </div>
            </MyLayout>
        </>
    );
}