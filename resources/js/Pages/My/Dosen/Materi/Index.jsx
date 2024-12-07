import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';

const Index = () => {

    const { kelas } = usePage().props;

    const headers = ["No.", "Tahun", "Matkul", "Kelas", "Materi", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        `${kls.matkul.nama_matkul}(${kls.matkul.semester})`,
        kls.nama_kelas,
        kls.materis_count,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dsn.mtr.show']) ? (
                    <>
                        {hasAnyPermission(['dsn.mtr.show']) && (
                            <Link
                                // href={`/my/d/materi/${kls.uuid}/show`}
                                href={route('dsn.materi.show', kls.uuid)}
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
            <Head title="eLearning - Materi Kelas Mata Kuliah" />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['dsn.mtr.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['dsn.mtr.create']) && (
                            <Link href={route('dsn.materi.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Materi
                            </Link>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/d/materi'} placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Mata Kuliah]"/>
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-chalkboard"
                    title="Materi Kelas Mata Kuliah"
                />
            </MyLayout>
        </>
    );
};

export default Index;


