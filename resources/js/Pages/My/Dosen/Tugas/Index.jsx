import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';

const Index = () => {

    const { kelas } = usePage().props;

    const headers = ["No.", "Tahun", "Matkul", "Kelas", "Tugas", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        `${kls.matkul.nama_matkul}(${kls.matkul.semester})`,
        kls.nama_kelas,
        kls.tugas_count,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dsn.tgs.show']) ? (
                    <>
                        {hasAnyPermission(['dsn.tgs.show']) && (
                            <Link
                                href={route('dsn.tugas.show', kls.uuid)}
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
            <Head title="eLearning - Tugas Kelas Mata Kuliah" />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['dsn.tgs.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['dsn.tgs.create']) && (
                            <Link href={route('dsn.tugas.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Tugas
                            </Link>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/d/tugas'} placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Mata Kuliah]" />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-hand-holding-hand"
                    title="Tugas Kelas Mata Kuliah"
                />
            </MyLayout>
        </>
    );
};

export default Index;


