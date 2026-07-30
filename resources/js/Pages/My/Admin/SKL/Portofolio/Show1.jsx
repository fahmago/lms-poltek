import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import formatDate from '@/Utilities/formatDate';
import hasAnyPermission from '@/Utilities/Permissions';
import ToastNotification from '@/Shared/ToastNotification';
import Delete from '../../../../../Shared/Delete';
import FilterTahunSemesterTugasPekanan from '../../Pekanan/TugasPekanan/KomponenPekanan/FilterTahunSemesterTugasPekanan';

// Komponen ini menampilkan daftar Portofolio untuk SATU prodi
const Show = () => {
    // GANTI: 'projectSemesters' menjadi 'portofolios'
    const { prodi, portofolios, angkatans, currentFilters, flash } = usePage().props;
    
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

        // GANTI: route 'my.project_semester.show' ke 'my.portofolio.show'
        Inertia.get(route('my.portofolio.show', { uuid: prodi.uuid }), newFilter, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSelectedTahun('');
        setSelectedSemester('');
        // GANTI: route 'my.project_semester.show' ke 'my.portofolio.show'
        Inertia.get(route('my.portofolio.show', { uuid: prodi.uuid }), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // GANTI: "Judul Project"
    const headers = ["No.", "Judul Portofolio", "Waktu Mulai", "Batas Waktu", "Jumlah Kelas", "Progress", "Aksi"];

    // GANTI: 'portofolios' -> 'portofolios', 'project' -> 'portofolio'
    const rows = portofolios.data.map((portofolio, index) => [
        portofolios.from + index,
        portofolio.judul,
        
        // Kolom 'Tipe' tidak ada, sesuai migrasi

        formatDate(portofolio.waktu_mulai, { includeTime: false }),
        formatDate(portofolio.batas_waktu, { includeTime: false }),
        <span className="font-mono text-center block">{portofolio.kelas_harians_count} Kelas</span>,
        (
            <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span>{portofolio.progress.total_submissions}/{portofolio.progress.total_students}</span>
                    <span className="font-medium text-gray-700">{portofolio.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${portofolio.progress.percentage >= 80 ? 'bg-green-500' : portofolio.progress.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${portofolio.progress.percentage}%` }}
                    ></div>
                </div>
            </div>
        ),
        (
            <div className="flex justify-center gap-2">
                {/* GANTI: permission 'project.semester.show' -> 'portofolio.show' */}
                {hasAnyPermission(['portofolio.show']) && (
                    // GANTI: route 'my.project_semester.detail' & param 'projectSemester' -> 'portofolio'
                    <Link href={route('my.portofolio.detail', { portofolio: portofolio.uuid })} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5" title="Lihat Detail & Rekap">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {/* GANTI: permission 'project.semester.edit' -> 'portofolio.edit' */}
                {hasAnyPermission(['portofolio.edit']) && (
                    // GANTI: route 'my.project_semester.edit' & param 'projectSemester' -> 'portofolio'
                    <Link href={route('my.portofolio.edit', { portofolio: portofolio.uuid })} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Portofolio">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
                {/* GANTI: permission 'project.semester.delete' -> 'portofolio.delete' */}
                {hasAnyPermission(['portofolio.delete']) && (
                    // GANTI: route 'my.project_semester.destroy' & param 'projectSemester' -> 'portofolio'
                    <Delete URL={route('my.portofolio.destroy', { portofolio: portofolio.uuid })} id="" />
                )}
                {!hasAnyPermission(['portofolio.show', 'portofolio.edit', 'portofolio.delete']) && (
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
            <Head title={`Portofolio - ${prodi.nama_prodi}`} />

            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    {/* GANTI: teks */}
                    Portofolio: <span className="text-blue-600">{prodi.nama_prodi}</span>
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
                    pagination={portofolios} 
                    // GANTI: icon & title
                    iconClass="fa fa-id-card" 
                    title={`Daftar Portofolio`}
                />

                <div className="flex justify-between mt-4">
                    <Link
                        // GANTI: route
                        href={route('my.portofolio.index')}
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