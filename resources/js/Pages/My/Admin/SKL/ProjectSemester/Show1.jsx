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

// Komponen tetap bernama Index untuk meniru file Anda
const Index = () => {
    // GANTI: 'tugasPekanans' menjadi 'projectSemesters'
    const { prodi, projectSemesters, angkatans, currentFilters, flash } = usePage().props;
    
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

        // GANTI: route 'my.tweek.show' ke 'my.project_semester.show'
        Inertia.get(route('my.project_semester.show', { uuid: prodi.uuid }), newFilter, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSelectedTahun('');
        setSelectedSemester('');
        // GANTI: route 'my.tweek.show' ke 'my.project_semester.show'
        Inertia.get(route('my.project_semester.show', { uuid: prodi.uuid }), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // GANTI: Hapus 'Tipe' dari headers
    const headers = ["No.", "Judul Project", "Waktu Mulai", "Batas Waktu", "Jumlah Kelas", "Progress", "Aksi"];

    // GANTI: 'tugasPekanans' -> 'projectSemesters', 'tugas' -> 'project'
    const rows = projectSemesters.data.map((project, index) => [
        projectSemesters.from + index,
        project.judul,
        
        // HAPUS: Kolom 'Tipe' yang ada di TugasPekanan
        // <span className={`...`}>...</span>,

        formatDate(project.waktu_mulai, { includeTime: false }),
        formatDate(project.batas_waktu, { includeTime: false }),
        <span className="font-mono text-center block">{project.kelas_harians_count} Kelas</span>,
        (
            <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span>{project.progress.total_submissions}/{project.progress.total_students}</span>
                    <span className="font-medium text-gray-700">{project.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${project.progress.percentage >= 80 ? 'bg-green-500' : project.progress.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${project.progress.percentage}%` }}
                    ></div>
                </div>
            </div>
        ),
        (
            <div className="flex justify-center gap-2">
                {hasAnyPermission(['project.semester.show']) && (
                    <Link href={route('my.project_semester.detail', { projectSemester: project.uuid })} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5" title="Lihat Detail & Rekap">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {hasAnyPermission(['project.semester.edit']) && (
                    <Link href={route('my.project_semester.edit', { projectSemester: project.uuid })} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Project">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
                {hasAnyPermission(['project.semester.delete']) && (
                    <Delete URL={route('my.project_semester.destroy', { projectSemester: project.uuid })} id="" />
                )}
                {!hasAnyPermission(['project.semester.show', 'project.semester.edit', 'project.semester.delete']) && (
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
            <Head title={`Project Semester - ${prodi.nama_prodi}`} />

            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    {/* GANTI: teks */}
                    Project Semester: <span className="text-blue-600">{prodi.nama_prodi}</span>
                </h1>

                {/* GANTI: Komponen Filter */}
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
                    pagination={projectSemesters} 
                    // GANTI: icon & title
                    iconClass="fa fa-clipboard-list" 
                    title={`Daftar Project Semester`}
                />

                <div className="flex justify-between mt-4">
                    <Link
                        // GANTI: route
                        href={route('my.project_semester.index')}
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

// Komponen tetap diekspor sebagai 'Index'
export default Index;