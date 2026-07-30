import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import formatDate from '@/Utilities/formatDateTime';
import Delete from '@/Shared/Delete';
import hasAnyPermission from '@/Utilities/Permissions';

export default function Show() {
    // GANTI: 'bukus' -> 'sertifikats'
    const { kelasHarian, sertifikats } = usePage().props;

    // GANTI: "Judul Buku" -> "Judul Sertifikat"
    const headers = ["No.", "Judul Sertifikat", "Mulai", "Deadline", "Progress", "Aksi"];

    // GANTI: 'sertifikats' -> 'sertifikats', 'buku' -> 'sertifikat'
    const rows = sertifikats.data.map((sertifikat, index) => [
        sertifikats.from + index,
        sertifikat.judul,
        
        formatDate(sertifikat.waktu_mulai, { includeTime: true }),
        formatDate(sertifikat.batas_waktu, { includeTime: true }),
        <div className="w-full">
            <div className="flex items-center justify-between text-xs mb-1">
                {/* GANTI: 'sertifikat' -> 'sertifikat' */}
                <span>{sertifikat.progress.total_submissions}/{sertifikat.progress.total_students}</span>
                <span className="font-medium text-gray-700">{sertifikat.progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${sertifikat.progress.percentage >= 80
                            ? 'bg-green-500'
                            : sertifikat.progress.percentage >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                        }`}
                    style={{ width: `${sertifikat.progress.percentage}%` }}
                ></div>
            </div>
        </div>,
        (
            <div className="flex justify-center gap-2">
                {/* GANTI: permission, route, dan parameter */}
                {hasAnyPermission(['dsn.sertifikat.show']) && (
                    <Link href={route('dsn.sertifikat.detail', [kelasHarian.uuid, sertifikat.uuid])} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-4 py-2" title="Lihat Detail & Rekap Pengumpulan">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {/* GANTI: permission, route, dan parameter */}
                {hasAnyPermission(['sertifikat.edit']) && ( // Asumsi permission admin = 'sertifikat.edit'
                    <Link href={route('my.sertifikat.edit', {sertifikat: sertifikat.uuid})} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Tugas Sertifikat (Admin)">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
            </div>
        )
    ]);

    return (
        <MyLayout>
            {/* GANTI: Head title */}
            <Head title={`Tugas Sertifikat - ${kelasHarian.nama_kelas}`} />
            <div className="flex justify-between items-center mt-5 mb-4">
                {/* GANTI: Teks h1 */}
                <h1 className="text-2xl font-bold text-gray-800">Tugas Sertifikat: <span className="text-blue-600">{kelasHarian.nama_kelas}</span></h1>
                {/* GANTI: route */}
                <Link href={route('dsn.sertifikat.index')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"><i className="fa fa-arrow-left mr-2"></i>Kembali ke Daftar Kelas</Link>
            </div>
            {/* GANTI: pagination, icon, title */}
            <DataTable 
                headers={headers} 
                rows={rows} 
                pagination={sertifikats} 
                iconClass="fa fa-certificate" // Ganti icon
                title="Daftar Tugas Sertifikat" // Ganti title
            />
        </MyLayout>
    );
}