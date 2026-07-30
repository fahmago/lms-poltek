import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import formatDate from '@/Utilities/formatDate';
import hasAnyPermission from '@/Utilities/Permissions';
import ToastNotification from '@/Shared/ToastNotification';
import Delete from '../../../../../Shared/Delete'; // Asumsi path ini benar
import FilterTahunSemesterTugasPekanan from '../../Pekanan/TugasPekanan/KomponenPekanan/FilterTahunSemesterTugasPekanan'; // Asumsi path ini benar

// Komponen ini menampilkan daftar Sertifikat untuk SATU prodi
const Show = () => {
    // GANTI: 'bukus' menjadi 'sertifikats'
    const { prodi, sertifikats, angkatans, currentFilters, flash } = usePage().props;
    
    const [selectedTahun, setSelectedTahun] = useState(currentFilters.tahun || '');
    const [selectedSemester, setSelectedSemester] = useState(currentFilters.semester || '');

    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    const handleFilterChange = (key, value) => {
        const newFilter = {
            tahun: key === 'tahun' ? value : selectedTahun,
            semester: key === 'semester' ? value : selectedSemester,
        };

        if (key === 'tahun') setSelectedTahun(value);
        if (key === 'semester') setSelectedSemester(value);

        // GANTI: route 'my.buku.show' ke 'my.sertifikat.show'
        Inertia.get(route('my.sertifikat.show', { uuid: prodi.uuid }), newFilter, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSelectedTahun('');
        setSelectedSemester('');
        // GANTI: route 'my.buku.show' ke 'my.sertifikat.show'
        Inertia.get(route('my.sertifikat.show', { uuid: prodi.uuid }), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // GANTI: "Judul Buku"
    const headers = ["No.", "Judul Sertifikat", "Waktu Mulai", "Batas Waktu", "Jumlah Kelas", "Progress", "Aksi"];

    // GANTI: 'sertifikats' -> 'sertifikats', 'buku' -> 'sertifikat'
    const rows = sertifikats.data.map((sertifikat, index) => [
        sertifikats.from + index,
        sertifikat.judul,
        
        formatDate(sertifikat.waktu_mulai, { includeTime: false }),
        formatDate(sertifikat.batas_waktu, { includeTime: false }),
        <span className="font-mono text-center block">{sertifikat.kelas_harians_count} Kelas</span>,
        (
            <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span>{sertifikat.progress.total_submissions}/{sertifikat.progress.total_students}</span>
                    <span className="font-medium text-gray-700">{sertifikat.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${sertifikat.progress.percentage >= 80 ? 'bg-green-500' : sertifikat.progress.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${sertifikat.progress.percentage}%` }}
                    ></div>
                </div>
            </div>
        ),
        (
            <div className="flex justify-center gap-2">
                {/* GANTI: permission 'buku.show' -> 'sertifikat.show' */}
                {hasAnyPermission(['sertifikat.show']) && (
                    // GANTI: route 'my.buku.detail' & param 'buku' -> 'sertifikat'
                    <Link href={route('my.sertifikat.detail', { sertifikat: sertifikat.uuid })} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 " title="Lihat Detail & Rekap">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {/* GANTI: permission 'buku.edit' -> 'sertifikat.edit' */}
                {hasAnyPermission(['sertifikat.edit']) && (
                    // GANTI: route 'my.buku.edit' & param 'buku' -> 'sertifikat'
                    <Link href={route('my.sertifikat.edit', { sertifikat: sertifikat.uuid })} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Tugas Sertifikat">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
                {/* GANTI: permission 'buku.delete' -> 'sertifikat.delete' */}
                {hasAnyPermission(['sertifikat.delete']) && (
                    // GANTI: route 'my.buku.destroy' & param 'buku' -> 'sertifikat'
                    <Delete URL={route('my.sertifikat.destroy', { sertifikat: sertifikat.uuid })} id="" />
                )}
                {!hasAnyPermission(['sertifikat.show', 'sertifikat.edit', 'sertifikat.delete']) && (
                    <span className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2">
                        <i className="fa fa-lock"></i>
                    </span>
                )}
            </div>
        )
    ]);

    return (
        <MyLayout>
            {/* GANTI: title */}
            <Head title={`Tugas Sertifikat - ${prodi.nama_prodi}`} />

            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    {/* GANTI: teks */}
                    Tugas Sertifikat: <span className="text-blue-600">{prodi.nama_prodi}</span>
                </h1>

                {/* Komponen Filter (Sama) */}
                <FilterTahunSemesterTugasPekanan
                    selectedTahun={selectedTahun}
                    selectedSemester={selectedSemester}
                    angkatans={angkatans}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilter}
                />

                <DataTable
                    headers={headers}
                    rows={rows}
                    // GANTI: pagination
                    pagination={sertifikats} 
                    // GANTI: icon & title
                    iconClass="fa fa-certificate" 
                    title={`Daftar Tugas Sertifikat`}
                />

                <div className="flex justify-between mt-4">
                    <Link
                        // GANTI: route
                        href={route('my.sertifikat.index')}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <i className="fa fa-arrow-left mr-2"></i>
                        Kembali ke Daftar Prodi
                    </Link>
                </div>
            </div>
        </MyLayout>
    );
};

export default Show;