import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable'; // Pastikan komponen ini ada
import ToastNotification from '@/Shared/ToastNotification'; // Pastikan komponen ini ada
import { formatDateID } from '@/Utilities/formatDateID'; // Pastikan path ini benar

export default function Index() {
    // 1. GANTI PROPS: Ambil 'laporanStatuses' dari controller
    const { laporanStatuses, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    // Tombol "Isi Laporan" selalu aktif (logika ini tidak berubah)
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

    // 2. FUNGSI BARU: Helper untuk render badge status
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Terkirim':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"><i className="fa fa-check mr-1"></i> Terkirim</span>;
            case 'Haid':
                // Jika status 'Haid', gunakan badge pink
                return <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"><i className="fa fa-droplet mr-1"></i> Haid</span>;
            case 'Belum Mengisi':
                // Jika 'Belum Mengisi', gunakan badge kuning/merah
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"><i className="fa fa-exclamation-triangle mr-1"></i> Belum Mengisi</span>;
            default:
                return null;
        }
    };

    // 3. MODIFIKASI: Sesuaikan headers dan rows
    const headers = ["No.", "Tanggal Laporan", "Status"];
    
    // Gunakan 'laporanStatuses' (array) bukan 'laporans.data' (paginator)
    const rows = laporanStatuses.map((laporan, index) => [
        index + 1, // Nomor urut sederhana
        formatDateID(laporan.tanggal), 
        renderStatusBadge(laporan.status) 
    ]);

    return (
        <>
            <Head title="Riwayat Laporan Ibadah" />
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