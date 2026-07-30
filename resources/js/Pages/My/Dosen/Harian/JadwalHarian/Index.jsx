import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import FilterTahunSemester from '../../../../../Shared/FilterTahunSemester';

const Index = () => {

    // Ambil props baru
    const { kelas, availableYears, filters } = usePage().props;

    // --- FIX RULES OF HOOKS ---
    // Panggil di top level
    const canShowJadwal = hasAnyPermission(['dsn.dh.jadwal.showJadwal']);
    // --------------------------

    const headers = ["No.", "Tahun", "Semester", "Kode Kelas", "Kelas", "Pertemuan", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.semester,
        kls.kode_kelas_harian,
        kls.nama_kelas,
        `${kls.jadwal_harians_count} Pertemuan`,
        (
            <div className="flex justify-center">
                {/* {hasAnyPermission(['dsn.dh.jadwal.showJadwal']) ? (
                    <>
                        {hasAnyPermission(['dsn.dh.jadwal.showJadwal']) && (
                            <Link
                                href={route('dsn.dh.jadwal.showJadwal', kls.kode_kelas_harian)}
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <i className="fa-regular fa-eye"></i>
                            </Link>
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )} */}
                {canShowJadwal ? (
                    <>
                        <Link
                            href={route('dsn.dh.jadwal.showJadwal', kls.kode_kelas_harian)}
                            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <i className="fa-regular fa-eye"></i>
                        </Link>
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title="eLearning - Jadwal Kelas" />
            <MyLayout>
                <div className="flex flex-col">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-between`}>   
                        <div className="w-full md:w-2/6">
                            <FilterTahunSemester 
                                availableYears={availableYears}
                                filters={filters}
                                url={route('dsn.dh.jadwal.index')}
                            />
                        </div>                     
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/d/harian/jadwal_harian'} placeholder="Cari: [Kode Kelas] [Nama Kelas]"/>
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-calendar-check"
                    title="Jadwal Kelas Harian"
                />
            </MyLayout>
        </>
    );
};

export default Index;


