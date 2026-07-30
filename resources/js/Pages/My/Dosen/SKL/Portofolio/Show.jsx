import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import formatDate from '@/Utilities/formatDateTime';
import Delete from '@/Shared/Delete';
import hasAnyPermission from '@/Utilities/Permissions';

export default function Show() {
    // GANTI: 'projectSemesters' -> 'portofolios'
    const { kelasHarian, portofolios } = usePage().props;

    // GANTI: "Judul Project" -> "Judul Portofolio"
    const headers = ["No.", "Judul Portofolio", "Mulai", "Deadline", "Progress", "Aksi"];

    // GANTI: 'portofolios' -> 'portofolios', 'project' -> 'portofolio'
    const rows = portofolios.data.map((portofolio, index) => [
        portofolios.from + index,
        portofolio.judul,
        
        // HAPUS: Kolom Tipe Tugas (sudah tidak ada di file Anda)
        
        formatDate(portofolio.waktu_mulai, { includeTime: true }),
        formatDate(portofolio.batas_waktu, { includeTime: true }),
        <div className="w-full">
            <div className="flex items-center justify-between text-xs mb-1">
                {/* GANTI: 'portofolio' -> 'portofolio' */}
                <span>{portofolio.progress.total_submissions}/{portofolio.progress.total_students}</span>
                <span className="font-medium text-gray-700">{portofolio.progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${portofolio.progress.percentage >= 80
                            ? 'bg-green-500'
                            : portofolio.progress.percentage >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                        }`}
                    style={{ width: `${portofolio.progress.percentage}%` }}
                ></div>
            </div>
        </div>,
        (
            <div className="flex justify-center gap-2">
                {/* GANTI: permission, route, dan parameter */}
                {hasAnyPermission(['dsn.portofolio.show']) && (
                    <Link href={route('dsn.portofolio.detail', [kelasHarian.uuid, portofolio.uuid])} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-4 py-2" title="Lihat Detail & Rekap Pengumpulan">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {/* GANTI: permission, route, dan parameter (mengikuti pola Anda ke rute Admin) */}
                {hasAnyPermission(['portofolio.edit']) && ( // Asumsi permission admin = 'portofolio.edit'
                    <Link href={route('my.portofolio.edit', [portofolio.uuid])} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Portofolio (Admin)">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
            </div>
        )
    ]);

    return (
        <MyLayout>
            {/* GANTI: Head title */}
            <Head title={`Portofolio - ${kelasHarian.nama_kelas}`} />
            <div className="flex justify-between items-center mt-5 mb-4">
                {/* GANTI: Teks h1 */}
                <h1 className="text-2xl font-bold text-gray-800">Portofolio: <span className="text-blue-600">{kelasHarian.nama_kelas}</span></h1>
                {/* GANTI: route */}
                <Link href={route('dsn.portofolio.index')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"><i className="fa fa-arrow-left mr-2"></i>Kembali ke Daftar Kelas</Link>
            </div>
            {/* GANTI: pagination, icon, title */}
            <DataTable 
                headers={headers} 
                rows={rows} 
                pagination={portofolios} 
                iconClass="fa fa-id-card" // Ganti icon
                title="Daftar Portofolio" // Ganti title
            />
        </MyLayout>
    );
}
