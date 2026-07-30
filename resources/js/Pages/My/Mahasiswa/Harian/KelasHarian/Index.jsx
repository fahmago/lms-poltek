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
    
    const headers = ["No.", "Tahun", "Semester", "Kode Kelas", "Kelas", "Pengajar"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.semester,
        kls.kode_kelas_harian,
        kls.nama_kelas,
        kls.dosen.user.name,
        // (
        //     <div className="flex justify-center">
        //         {hasAnyPermission(['kelas.edit', 'kelas.delete']) ? (
        //             <>
        //                 {hasAnyPermission(['kelas.edit']) && (
        //                     <Link
        //                         href={`/my/kelas/${kls.uuid}/edit`}
        //                         className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2">
        //                         <i className="fa fa-pencil-alt"></i>
        //                     </Link>
        //                 )}
        //             </>
        //         ) : (
        //             <span className="text-red-500 font-semibold">Minta Akses</span>
        //         )}
        //     </div>
        // )
    ]);

    return (
        <>
            <Head title='eLearning - Data Kelas' />
            <MyLayout>
                {/* <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/mhs/harian/kelas_harian'} 
                                placeholder="Keyword: [Kode Kelas] [Nama Kelas]"
                            />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-users-rectangle"
                    title="Data Kelas Harian"
                /> */}
                <div className="mb-8">
                    
                    {/* --- HEADER SECTION --- */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        
                        {/* BAGIAN KIRI: Judul & Ikon */}
                        <div className="flex items-center gap-5">
                            {/* Icon Box: fa-users-rectangle */}
                            <div className="w-14 h-14 rounded-xl bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white text-2xl">
                                <i className="fa fa-users-rectangle"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                                    Kelas Harian
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Daftar kelas yang Anda ambil saat ini.
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
                                    url={route('mhs.dh.kls.index')}
                                />
                            </div>

                            {/* Search */}
                            <div className="w-full md:w-64">
                                <Search 
                                    URL={'/my/mhs/harian/kelas_harian'} 
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
                        iconClass="fa fa-list-ul"
                        title={`Data Kelas Harian (${(filters.tahun && filters.tahun !== 'all') ? filters.tahun : 'Semua Tahun'})`}
                    />
                </div>
            </MyLayout>
        </>
    )
}

export default Index;
