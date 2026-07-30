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

// Komponen ini menampilkan daftar Buku untuk SATU prodi
const Show = () => {
    // GANTI: 'portofolios' menjadi 'bukus'
    const { prodi, bukus, angkatans, currentFilters, flash } = usePage().props;
    
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

        // GANTI: route 'my.portofolio.show' ke 'my.buku.show'
        Inertia.get(route('my.buku.show', { uuid: prodi.uuid }), newFilter, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSelectedTahun('');
        setSelectedSemester('');
        // GANTI: route 'my.portofolio.show' ke 'my.buku.show'
        Inertia.get(route('my.buku.show', { uuid: prodi.uuid }), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // GANTI: "Judul Portofolio"
    const headers = ["No.", "Judul Buku", "Waktu Mulai", "Batas Waktu", "Jumlah Kelas", "Progress", "Aksi"];

    // GANTI: 'bukus' -> 'bukus', 'portofolio' -> 'buku'
    const rows = bukus.data.map((buku, index) => [
        bukus.from + index,
        buku.judul,
        
        formatDate(buku.waktu_mulai, { includeTime: false }),
        formatDate(buku.batas_waktu, { includeTime: false }),
        <span className="font-mono text-center block">{buku.kelas_harians_count} Kelas</span>,
        (
            <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span>{buku.progress.total_submissions}/{buku.progress.total_students}</span>
                    <span className="font-medium text-gray-700">{buku.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${buku.progress.percentage >= 80 ? 'bg-green-500' : buku.progress.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${buku.progress.percentage}%` }}
                    ></div>
                </div>
            </div>
        ),
        (
            <div className="flex justify-center gap-2">
                {/* GANTI: permission 'portofolio.show' -> 'buku.show' */}
                {hasAnyPermission(['buku.show']) && (
                    // GANTI: route 'my.portofolio.detail' & param 'portofolio' -> 'buku'
                    <Link href={route('my.buku.detail', { buku: buku.uuid })} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5" title="Lihat Detail & Rekap">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {/* GANTI: permission 'portofolio.edit' -> 'buku.edit' */}
                {hasAnyPermission(['buku.edit']) && (
                    // GANTI: route 'my.portofolio.edit' & param 'portofolio' -> 'buku'
                    <Link href={route('my.buku.edit', { buku: buku.uuid })} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Tugas Buku">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
                {/* GANTI: permission 'portofolio.delete' -> 'buku.delete' */}
                {hasAnyPermission(['buku.delete']) && (
                    // GANTI: route 'my.portofolio.destroy' & param 'portofolio' -> 'buku'
                    <Delete URL={route('my.buku.destroy', { buku: buku.uuid })} id="" />
                )}
                {!hasAnyPermission(['buku.show', 'buku.edit', 'buku.delete']) && (
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
            <Head title={`Tugas Buku - ${prodi.nama_prodi}`} />

            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    {/* GANTI: teks */}
                    Tugas Buku: <span className="text-blue-600">{prodi.nama_prodi}</span>
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
                    pagination={bukus} 
                    // GANTI: icon & title
                    iconClass="fa fa-book" 
                    title={`Daftar Tugas Buku`}
                />

                <div className="flex justify-between mt-4">
                    <Link
                        // GANTI: route
                        href={route('my.buku.index')}
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