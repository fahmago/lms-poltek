import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';

const Index = () => {
    const { dosens } = usePage().props;

    // console.log(dosens);
    
    const headers = ["No.", "Foto", "Nidn", "Nama Pengajar", "Actions"];

    const rows = dosens.data.map((dsn, index) => [
        index + 1 + (dosens.current_page - 1) * dosens.per_page,
        <img src={dsn.image} className="rounded-lg w-20 h-auto mx-auto" />,
        dsn.nidn ? dsn.nidn : <><span className="text-red-500 font-semibold">Belum Ada</span></>,
        dsn.user.name ? dsn.user.name : 'Dihapus',
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dosens.edit', 'dosens.delete']) ? (
                    <>
                        {hasAnyPermission(['dosens.edit']) && (
                            <Link
                                href={`/my/dosen/${dsn.uuid}/edit`}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                <i className="fa fa-pencil-alt"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['dosens.delete']) && (
                            <Delete URL={'/my/dosen'} id={dsn.uuid} />
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
        <Head title='eLearning - Data Pengajar' />
        <MyLayout>
            <div className="flex flex-col mt-5">
                <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['dosens.create']) ? 'justify-between' : 'justify-center'}`}>
                    {hasAnyPermission(['dosens.create']) && (
                        <Link href={route('my.dosens.create')}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            <i className="fa fa-plus-circle mr-2"></i>
                            Pengajar
                        </Link>
                    )}
                    <div className="w-full md:w-3/4 lg:w-3/6">
                        <Search URL={'/my/dosen'} />
                    </div>
                </div>
            </div>
            <DataTable
                headers={headers}
                rows={rows}
                pagination={dosens}
                iconClass="fa fa-user-tie"
                title="Data Pengajar"
            />
        </MyLayout>
    </>
  )
}

export default Index
