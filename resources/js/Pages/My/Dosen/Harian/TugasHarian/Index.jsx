import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import ToastNotification from '../../../../../Shared/ToastNotification';
import FilterTahunSemester from '../../../../../Shared/FilterTahunSemester';

const Index = () => {

    // Ambil props availableYears dan filters dari Controller
    const { kelas, flash, availableYears, filters } = usePage().props;

    // --- FIX RULES OF HOOKS ---
    // Panggil permission di sini, jangan di dalam loop
    const canCreate = hasAnyPermission(['dsn.dh.tugas.create']);
    const canShow = hasAnyPermission(['dsn.dh.tugas.show']);
    // --------------------------

    const headers = ["No.", "Tahun", "Semester", "Kelas", "Tugas", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.semester,
        kls.nama_kelas,
        kls.tugas_harians_count,
        (
            <div className="flex justify-center">
                {/* {hasAnyPermission(['dsn.dh.tugas.show']) ? (
                    <>
                        {hasAnyPermission(['dsn.dh.tugas.show']) && (
                            <Link
                                href={route('dsn.dh.tugas.show', kls.uuid)}
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <i className="fa-regular fa-eye"></i>
                            </Link>
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )} */}
                {canShow ? (
                    <>
                        <Link
                            href={route('dsn.dh.tugas.show', kls.uuid)}
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

    useEffect(() => {
        if (flash?.success) {
            ToastNotification({
                icon: 'success',
                title: flash.success || 'Berhasil!',
                timer: 2000,
            });
        }
    }, [flash?.success]);

    return (
        <>
            <Head title="eLearning - Tugas Kelas Harian" />
            <MyLayout>
                <div className="flex flex-col">
                    {/* <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['dsn.dh.tugas.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['dsn.dh.tugas.create']) && (
                            <Link href={route('dsn.dh.tugas.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Tugas Harian
                            </Link>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/d/harian/tugas_harian'} placeholder="Keyword: [Kode Kelas] [Nama Kelas]" />
                        </div>
                    </div> */}
                    {/* Layout Header: Tombol Tambah, Filter, dan Search */}
                    <div className="w-full flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center mb-4">

                        {/* 1. Tombol Tambah (Kiri) */}
                        {canCreate && (
                            <div className="w-full xl:w-auto">
                                <Link
                                    href={route('dsn.dh.tugas.create')}
                                    className="block w-full text-center xl:inline-block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    <i className="fa fa-plus-circle mr-2"></i>
                                    Tugas Harian
                                </Link>
                            </div>
                        )}

                        {/* Group Filter dan Search (Kanan) */}
                        {/* PERBAIKAN DI SINI: */}
                        <div className={`
        w-full flex flex-col md:flex-row gap-4 
        ${canCreate ? 'xl:w-3/4 justify-between' : 'w-full justify-end'}
    `}>

                            {/* 2. Komponen Filter (Menggunakan flex-1 agar mengisi ruang yang tersedia) */}
                            <div className="w-full md:flex-1">
                                <FilterTahunSemester
                                    availableYears={availableYears}
                                    filters={filters}
                                    url={route('dsn.dh.tugas.index')}
                                />
                            </div>

                            {/* 3. Komponen Search (Menggunakan flex-1 agar mengisi ruang yang tersedia) */}
                            <div className="w-full md:flex-1">
                                <Search
                                    URL={'/my/d/harian/tugas_harian'}
                                    placeholder="Cari: [Kode] [Nama Kelas]"
                                />
                            </div>
                        </div>

                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-hand-holding-hand"
                    title="Tugas Kelas Harian"
                />
            </MyLayout>
        </>
    );
};

export default Index;


