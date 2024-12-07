import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';

const Index = () => {

    const { kelas } = usePage().props;

    const headers = ["No.", "Tahun", "Semester", "Matkul", "Kelas", "Jadwal", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.matkul.semester,
        `${kls.matkul.nama_matkul}`,
        // `${kls.matkul.nama_matkul}(${kls.matkul.semester})`,
        kls.nama_kelas,
        `${kls.jadwals_count} Pertemuan`,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dsn.jdwl.show']) ? (
                    <>
                        {hasAnyPermission(['dsn.jdwl.show']) && (
                            <Link
                                // href={`/my/d/materi/${kls.uuid}/show`}
                                href={route('dsn.jdwl.show', kls.kode_kelas)}
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <i className="fa-regular fa-eye"></i>
                            </Link>
                        )}
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
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>                        
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/d/schedules/'} placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Mata Kuliah]"/>
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-calendar-check"
                    title="Jadwal Kelas Mata Kuliah"
                />
            </MyLayout>
        </>
    );
};

export default Index;


