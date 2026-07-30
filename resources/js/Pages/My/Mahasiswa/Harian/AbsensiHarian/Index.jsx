import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import FilterTahunSemester from '../../../../../Shared/FilterTahunSemester';
import Delete from '../../../../../Shared/Delete';

const Index = () => {

    const { kelas, availableYears, filters } = usePage().props;

    const canDoPresence = hasAnyPermission(['mhs.abs.presence']);
    
    const headers = ["No.", "Tahun", "Semester", "Kode Kelas", "Kelas", "Pengajar", "Pertemuan", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.semester,
        kls.kode_kelas_harian,
        kls.nama_kelas,
        kls.dosen.user.name,
        <>{kls.jadwal_harians_count} Pertemuan</>,
        (
            <div className="flex justify-center">
                {/* {hasAnyPermission(['mhs.abs.presence']) ? (
                    <>
                        {hasAnyPermission(['mhs.abs.presence']) && (
                            <Link
                                href={route('mhs.dh.abs.showJadwal', kls.kode_kelas_harian)}
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Lihat Jadwal
                            </Link>
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )} */}
                {canDoPresence ? (
                    <Link
                        href={route('mhs.dh.abs.showJadwal', kls.kode_kelas_harian)}
                        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Lihat Jadwal
                    </Link>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title='eLearning - Data Kelas' />
            <MyLayout>
                {/* <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/mhs/harian/absensi_harian'} 
                                placeholder="Keyword: [Kode Kelas] [Nama Kelas]"
                            />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-clipboard-check"
                    title="Absensi Kelas Harian"
                /> */}
                <div className="mb-8">
                    
                    {/* --- HEADER SECTION --- */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        
                        {/* BAGIAN KIRI: Judul & Ikon */}
                        <div className="flex items-center gap-5">
                            {/* Icon Box: fa-clipboard-check */}
                            <div className="w-14 h-14 rounded-xl bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center text-white text-2xl">
                                <i className="fa fa-clipboard-check"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                                    Absensi Harian
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Lakukan absensi sesuai jadwal kelas Anda.
                                </p>
                            </div>
                        </div>

                        {/* BAGIAN KANAN: Filter & Search */}
                        <div className="w-full xl:w-3/4 flex flex-col md:flex-row gap-3 justify-end">
                            
                            {/* Filter */}
                            <div className="w-full md:w-[440px]">
                                <FilterTahunSemester
                                    availableYears={availableYears}
                                    filters={filters}
                                    url={route('mhs.dh.abs.index')}
                                />
                            </div>

                            {/* Search */}
                            <div className="w-full md:w-64">
                                <Search 
                                    URL={'/my/mhs/harian/absensi_harian'} 
                                    placeholder="Cari: [Kode] [Nama Kelas]"
                                />
                            </div>
                        </div>

                    </div>
                    {/* ---------------------- */}

                    {/* DATATABLE */}
                    <DataTable
                        headers={headers}
                        rows={rows}
                        pagination={kelas}
                        iconClass="fa fa-list-check"
                        title={`Absensi Kelas Harian (${(filters.tahun && filters.tahun !== 'all') ? filters.tahun : 'Semua Tahun'})`}
                    />
                </div>
            </MyLayout>
        </>
    )
}

export default Index;
