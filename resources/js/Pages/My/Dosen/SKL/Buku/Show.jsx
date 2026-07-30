import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import formatDate from '@/Utilities/formatDateTime';
import Delete from '@/Shared/Delete';
import hasAnyPermission from '@/Utilities/Permissions';

export default function Show() {
    // GANTI: 'portofolios' -> 'bukus'
    const { kelasHarian, bukus } = usePage().props;

    // GANTI: "Judul Portofolio" -> "Judul Buku"
    const headers = ["No.", "Judul Buku", "Mulai", "Deadline", "Progress", "Aksi"];

    // GANTI: 'bukus' -> 'bukus', 'portofolio' -> 'buku'
    const rows = bukus.data.map((buku, index) => [
        bukus.from + index,
        buku.judul,
        
        formatDate(buku.waktu_mulai, { includeTime: true }),
        formatDate(buku.batas_waktu, { includeTime: true }),
        <div className="w-full">
            <div className="flex items-center justify-between text-xs mb-1">
                {/* GANTI: 'buku' -> 'buku' */}
                <span>{buku.progress.total_submissions}/{buku.progress.total_students}</span>
                <span className="font-medium text-gray-700">{buku.progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${buku.progress.percentage >= 80
                            ? 'bg-green-500'
                            : buku.progress.percentage >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                        }`}
                    style={{ width: `${buku.progress.percentage}%` }}
                ></div>
            </div>
        </div>,
        (
            <div className="flex justify-center gap-2">
                {/* GANTI: permission, route, dan parameter */}
                {hasAnyPermission(['dsn.buku.show']) && (
                    <Link href={route('dsn.buku.detail', [kelasHarian.uuid, buku.uuid])} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-4 py-2" title="Lihat Detail & Rekap Pengumpulan">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {/* GANTI: permission, route, dan parameter */}
                {hasAnyPermission(['buku.edit']) && ( // Asumsi permission admin = 'buku.edit'
                    <Link href={route('my.buku.edit', {buku: buku.uuid})} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Tugas Buku (Admin)">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
            </div>
        )
    ]);

    return (
        <MyLayout>
            {/* GANTI: Head title */}
            <Head title={`Tugas Buku - ${kelasHarian.nama_kelas}`} />
            <div className="flex justify-between items-center mt-5 mb-4">
                {/* GANTI: Teks h1 */}
                <h1 className="text-2xl font-bold text-gray-800">Tugas Buku: <span className="text-blue-600">{kelasHarian.nama_kelas}</span></h1>
                {/* GANTI: route */}
                <Link href={route('dsn.buku.index')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"><i className="fa fa-arrow-left mr-2"></i>Kembali ke Daftar Kelas</Link>
            </div>
            {/* GANTI: pagination, icon, title */}
            <DataTable 
                headers={headers} 
                rows={rows} 
                pagination={bukus} 
                iconClass="fa fa-book" // Ganti icon
                title="Daftar Tugas Buku" // Ganti title
            />
        </MyLayout>
    );
}