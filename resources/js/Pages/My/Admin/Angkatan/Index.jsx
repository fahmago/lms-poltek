import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';

const Index = () => {
    const { angkatans } = usePage().props;
    
    const headers = ["No.", "Tahun Angkatan", "Nama Angkatan", "Ketua Angkatan", "Jumlah Angkatan",  "Actions"];

    const rows = angkatans.data.map((angkatan, index) => [
        index + 1 + (angkatans.current_page - 1) * angkatans.per_page,
        angkatan.tahun_angkatan,
        angkatan.nama_angkatan,
        angkatan.ketua_angkatan,
        angkatan.mahasiswas_count,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['angkatans.edit', 'angkatans.delete']) ? (
                    <>
                        {hasAnyPermission(['angkatans.edit']) && (
                            <Link
                                href={`/my/angkatan/${angkatan.uuid}/edit`}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                <i className="fa fa-pencil-alt"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['angkatans.delete']) && (
                            <Delete URL={'/my/angkatan'} id={angkatan.uuid} />
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
        <Head title='eLearning - Data Angkatan' />
        <MyLayout>
            <div className="flex flex-col mt-5">
                <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['angkatans.create']) ? 'justify-between' : 'justify-center'}`}>
                    {hasAnyPermission(['angkatans.create']) && (
                        <Link href={route('my.angkatans.create')}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            <i className="fa fa-plus-circle mr-2"></i>
                            Angkatan
                        </Link>
                    )}
                    <div className="w-full md:w-3/4 lg:w-3/6">
                        <Search URL={'/my/angkatan'} />
                    </div>
                </div>
            </div>
            <DataTable
                headers={headers}
                rows={rows}
                pagination={angkatans}
                iconClass="fa fa-calendar-days"
                title="Data Angkatan"
            />
        </MyLayout>
    </>
  )
}

export default Index
