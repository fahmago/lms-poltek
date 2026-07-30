import React, { useEffect, useState, useMemo } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import formatDate from '@/Utilities/formatDate';
import hasAnyPermission from '@/Utilities/Permissions';
import ToastNotification from '@/Shared/ToastNotification';
import BulkUpdateModal from '@/Shared/BulkUpdateModal'; // Menggunakan path Components sesuai file yang dibuat sebelumnya
import Delete from '@/Shared/Delete';
import FilterTahunSemesterTugasPekanan from '../../Pekanan/TugasPekanan/KomponenPekanan/FilterTahunSemesterTugasPekanan';

const Index = () => {
    const { prodi, projectSemesters, angkatans, currentFilters, flash } = usePage().props;

    // --- STATE & FILTER ---
    const [selectedTahun, setSelectedTahun] = useState(currentFilters.tahun || '');
    const [selectedSemester, setSelectedSemester] = useState(currentFilters.semester || '');
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- INERTIA FORM ---
    const { data, setData, post, processing, reset } = useForm({
        ids: [],
        batas_waktu: '',
    });

    // --- PERMISSIONS ---
    // Menggunakan permission Project Semester
    const canShow = hasAnyPermission(['project.semester.show']);
    const canEdit = hasAnyPermission(['project.semester.edit']);
    const canDelete = hasAnyPermission(['project.semester.delete']);

    // --- EFFECTS ---
    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    // --- HANDLERS ---
    const handleFilterChange = (key, value) => {
        const newFilter = {
            tahun: key === 'tahun' ? value : selectedTahun,
            semester: key === 'semester' ? value : selectedSemester,
        };
        if (key === 'tahun') setSelectedTahun(value);
        if (key === 'semester') setSelectedSemester(value);
        Inertia.get(route('my.project_semester.show', { uuid: prodi.uuid }), newFilter, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleResetFilter = () => {
        setSelectedTahun('');
        setSelectedSemester('');
        Inertia.get(route('my.project_semester.show', { uuid: prodi.uuid }), {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(projectSemesters.data.map(p => p.uuid));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (uuid) => {
        if (selectedIds.includes(uuid)) {
            setSelectedIds(selectedIds.filter(id => id !== uuid));
        } else {
            setSelectedIds([...selectedIds, uuid]);
        }
    };

    const openModal = () => {
        setData('ids', selectedIds);
        setIsModalOpen(true);
    };

    const handleSubmitBulk = () => {
        post(route('my.project_semester.bulk_update_deadline'), {
            onSuccess: () => {
                setIsModalOpen(false);
                setSelectedIds([]);
                reset();
            }
        });
    };

    // --- STATS CALCULATION ---
    const stats = useMemo(() => {
        const total = projectSemesters.data.length;
        if (total === 0) return null;
        const totalAvgProgress = projectSemesters.data.reduce((acc, curr) => acc + curr.progress.percentage, 0) / total;
        return { count: total, avg: Number(totalAvgProgress.toFixed(1))  };
    }, [projectSemesters.data]);

    // --- TABLE CONFIGURATION ---
    const headers = [
        <div className="flex justify-center" key="check-head">
            <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={projectSemesters.data.length > 0 && selectedIds.length === projectSemesters.data.length}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
        </div>,
        "JUDUL PROJECT & KELAS", 
        // "TIPE", // Project Semester biasanya tidak ada tipe YT/Link
        "JADWAL PENGERJAAN", 
        "PROGRESS", 
        "AKSI"
    ];

    const rows = projectSemesters.data.map((project, index) => {
        const isExpired = new Date(project.batas_waktu) < new Date();
        
        // LOGIKA PENGAMBILAN SEMESTER:
        // Kita ambil dari array `kelas_harians` yang dikirim dari controller (camelCase di PHP jadi snake_case di JSON)
        // Kita ambil semester dari kelas pertama yang ditemukan.
        const semester = project.kelas_harians && project.kelas_harians.length > 0 
            ? project.kelas_harians[0].semester 
            : null;

        return [
            // 1. Checkbox
            <div className="flex justify-center" key={`check-${project.uuid}`}>
                <input
                    type="checkbox"
                    checked={selectedIds.includes(project.uuid)}
                    onChange={() => handleSelectRow(project.uuid)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
            </div>,

            // 2. Judul & Kelas
            <div className="flex flex-col max-w-sm py-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200">
                        #{projectSemesters.from + index}
                    </span>
                    
                    {/* ORNAMEN SEMESTER */}
                    {semester && (
                        <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-200" title={`Semester ${semester}`}>
                            Sem. {semester}
                        </span>
                    )}
                </div>
                <Link 
                    href={route('my.project_semester.detail', { projectSemester: project.uuid })}
                    className="text-base font-bold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-2 leading-tight"
                    title={project.judul}
                >
                    {project.judul}
                </Link>
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <i className="fa fa-users mr-1.5 text-gray-500"></i> 
                        {project.kelas_harians_count} Kelas
                    </span>
                </div>
            </div>,
            
            // 3. JADWAL (Timeline Style)
            <div className="flex flex-col min-w-[220px]">
                {/* Waktu Mulai */}
                <div className="flex items-center gap-2 group">
                    <div className="flex flex-col items-center">
                         <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-100"></div>
                         <div className="h-4 w-px bg-gray-200 my-0.5 group-hover:bg-emerald-200 transition-colors"></div>
                    </div>
                    <div className="flex flex-col pb-2">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none">Mulai</span>
                        <span className="text-xs text-gray-600 font-medium font-mono">
                           {project.formatted_waktu_mulai}
                        </span>
                    </div>
                </div>

                {/* Batas Waktu */}
                <div className="flex items-center gap-2">
                     <div className="flex flex-col items-center">
                         <div className={`w-2 h-2 rounded-full ring-2 ${isExpired ? 'bg-red-500 ring-red-100' : 'bg-indigo-500 ring-indigo-100'}`}></div>
                     </div>
                     <div className="flex flex-col">
                        <span className={`text-[10px] uppercase font-bold tracking-wider leading-none ${isExpired ? 'text-red-400' : 'text-indigo-400'}`}>
                            Deadline
                        </span>
                        <span className={`text-sm font-bold font-mono ${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
                           {project.formatted_batas_waktu}
                        </span>
                        {isExpired && (
                            <span className="text-[9px] text-white bg-red-500 px-1.5 rounded-sm w-max mt-0.5 font-bold animate-pulse">
                                SUDAH BERAKHIR
                            </span>
                        )}
                    </div>
                </div>
            </div>,

            // 4. Progress Bar
            <div className="w-full min-w-[160px] px-2">
                <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-gray-600">Progress</span>
                    <span className="font-bold text-gray-800 bg-gray-100 px-1.5 rounded">
                        {project.progress.total_submissions} / {project.progress.total_students}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                        className={`h-3 rounded-full transition-all duration-700 ease-out shadow-sm ${
                            project.progress.percentage >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                            project.progress.percentage >= 50 ? 'bg-gradient-to-r from-amber-300 to-amber-500' : 
                            'bg-gradient-to-r from-rose-400 to-rose-600'
                        }`}
                        style={{ width: `${project.progress.percentage}%` }}
                    ></div>
                </div>
                <div className="text-right mt-1">
                     <span className={`text-xs font-bold ${
                         project.progress.percentage >= 80 ? 'text-emerald-700' : 
                         project.progress.percentage >= 50 ? 'text-amber-700' : 'text-rose-700'
                     }`}>
                         {Math.round(project.progress.percentage)}% Selesai
                     </span>
                </div>
            </div>,

            // 5. Aksi
            <div className="flex items-center justify-center gap-2">
                {canShow && (
                    <Link 
                        href={route('my.project_semester.detail', { projectSemester: project.uuid })} 
                        className="flex items-center justify-center w-8 h-8 bg-gray-700 hover:bg-gray-800 text-white rounded-md shadow-sm transition-all transform hover:-translate-y-0.5"
                        title="Lihat Detail & Rekap"
                    >
                        <i className="fa fa-eye text-xs"></i>
                    </Link>
                )}
                {canEdit && (
                    <Link 
                        href={route('my.project_semester.edit', { projectSemester: project.uuid })} 
                        className="flex items-center justify-center w-8 h-8 bg-green-700 hover:bg-green-800 text-white rounded-md shadow-sm transition-all transform hover:-translate-y-0.5"
                        title="Edit Project"
                    >
                        <i className="fa fa-edit text-xs"></i>
                    </Link>
                )}
                {canDelete && (
                    <div 
                        className="[&>button]:text-xs [&>button]:w-8 [&>button]:h-8 [&>button]:p-0 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:bg-red-700 [&>button]:hover:bg-red-800 [&>button]:text-white [&>button]:rounded-md [&>button]:shadow-sm [&>button]:transition-all [&>button]:transform [&>button]:hover:-translate-y-0.5"
                        title="Hapus Project"
                    >
                         <Delete URL={route('my.project_semester.destroy', { projectSemester: project.uuid })} id="" />
                    </div>
                )}
                 {!canShow && !canEdit && !canDelete && (
                    <span className="flex items-center justify-center w-8 h-8 bg-gray-400 text-white rounded-md cursor-not-allowed">
                        <i className="fa fa-lock text-xs"></i>
                    </span>
                )}
            </div>
        ];
    });

    return (
        <MyLayout>
            <Head title={`Project Semester - ${prodi.nama_prodi}`} />

            <BulkUpdateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitBulk}
                processing={processing}
                data={data} // Mengoper data
                setData={setData} // Mengoper fungsi setData
                title="Update Deadline Massal"
            >
                <div className="p-1">
                    <label htmlFor="batas_waktu" className="block text-sm font-bold text-gray-700 mb-2">
                        Batas Waktu Baru <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa fa-calendar text-gray-400"></i>
                        </div>
                        <input 
                            id="batas_waktu"
                            type="datetime-local" 
                            className="block w-full pl-10 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 bg-gray-50"
                            value={data.batas_waktu}
                            onChange={e => setData('batas_waktu', e.target.value)}
                        />
                    </div>
                    {!data.batas_waktu && (
                        <p className="mt-2 text-xs text-amber-600 font-medium bg-amber-50 p-2 rounded border border-amber-100 inline-block">
                            <i className="fa fa-info-circle mr-1"></i> Wajib diisi sebelum menyimpan.
                        </p>
                    )}
                </div>
            </BulkUpdateModal>

            <div className="space-y-6 pb-12">
                {/* Header & Stats Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center text-sm text-gray-500 mb-2 font-medium">
                             <Link href={route('my.project_semester.index')} className="hover:text-indigo-600 transition-colors">
                                <i className="fa fa-folder-open-o mr-1"></i> Project Semester
                             </Link>
                             <i className="fa fa-angle-right text-gray-300 mx-2"></i>
                             <span className="text-gray-800">Detail Prodi</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {prodi.nama_prodi}
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm max-w-2xl">
                            Kelola daftar project semester, pantau progress mahasiswa, dan sesuaikan tenggat waktu.
                        </p>
                    </div>
                    
                    {/* Stats */}
                    {stats && (
                        <div className="flex gap-4 min-w-max">
                            <div className="flex flex-col items-center justify-center px-6 py-3 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-3xl font-extrabold text-indigo-600">{stats.count}</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Total Project</span>
                            </div>
                            <div className="flex flex-col items-center justify-center px-6 py-3 bg-white border border-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <span className="text-3xl font-extrabold text-emerald-600">{stats.avg}%</span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Rata-rata</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter & Actions */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="w-full md:w-auto flex-grow">
                             <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Filter Data</h3>
                             <FilterTahunSemesterTugasPekanan
                                selectedTahun={selectedTahun}
                                selectedSemester={selectedSemester}
                                angkatans={angkatans}
                                onFilterChange={handleFilterChange}
                                onReset={handleResetFilter}
                            />
                        </div>
                        
                        {selectedIds.length > 0 && canEdit && (
                            <div className="w-full md:w-auto animate-bounce-in">
                                <button
                                    onClick={openModal}
                                    className="w-full md:w-auto px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    <i className="fa fa-calendar-check-o text-lg"></i>
                                    <span>Update Deadline ({selectedIds.length} Project)</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={projectSemesters}
                    iconClass="fa fa-clipboard-list"
                    title="Daftar Project Semester"
                />
                
                {/* Footer */}
                <div className="pt-2">
                     <Link
                        href={route('my.project_semester.index')}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm"
                    >
                        <i className="fa fa-arrow-left mr-2"></i>
                        Kembali
                    </Link>
                </div>
            </div>
        </MyLayout>
    );
};

export default Index;