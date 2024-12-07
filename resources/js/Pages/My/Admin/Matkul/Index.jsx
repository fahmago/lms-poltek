import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';

const Index = () => {

    const { matkuls } = usePage().props;
    
    const headers = ["No.", "Prodi", "Kode", "Mata Kuliah", "Sks", "Semester", "Rps", "Actions"];

    const rows = matkuls.data.map((mk, index) => [
        index + 1 + (matkuls.current_page - 1) * matkuls.per_page,
        // mk.prodi.kode_prodi,
        mk.kode_prodi,
        mk.kode_matkul,
        mk.nama_matkul,
        mk.sks,
        mk.semester,   
        <>
            <a
                href={mk.rps}
                target="_blank"
                title={`Link Rps Mata Kuliah ${mk.nama_matkul}`}
                className="text-blue-600 hover:text-blue-800">
                <i className="fa fa-link"></i>
            </a>
        </>, 
        (
            <div className="flex justify-center">
                {hasAnyPermission(['matkuls.edit', 'matkuls.delete']) ? (
                    <>
                        {hasAnyPermission(['matkuls.edit']) && (
                            <Link
                                href={`/my/matkul/${mk.uuid}/edit`}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                <i className="fa fa-pencil-alt"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['matkuls.delete']) && (
                            <Delete URL={'/my/matkul'} id={mk.uuid} />
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
        <Head title='eLearning - Data Mata Kuliah' />
        <MyLayout>
            <div className="flex flex-col mt-5">
                <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['matkuls.create']) ? 'justify-between' : 'justify-center'}`}>
                    <div className="mb-3 md:mb-0 lg:mb-0">
                        {hasAnyPermission(['matkuls.create']) && (
                            <Link href={route('my.matkuls.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Mata Kuliah
                            </Link>
                        )}
                        {hasAnyPermission(['matkuls.excel']) && (
                            <Link href={route('my.matkuls.matkul.excel')}
                                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-normal rounded-lg text-base px-6 py-3 me-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                                type="button">
                                <i className="fa fa-file-excel mr-2"></i>
                                Mata Kuliah
                            </Link>
                        )}
                    </div>
                    <div className="w-full md:w-3/4 lg:w-3/6">
                        <Search URL={'/my/matkul'} />
                    </div>
                </div>
            </div>
            <DataTable
                headers={headers}
                rows={rows}
                pagination={matkuls}
                iconClass="fa fa-book"
                title="Data Mata Kuliah"
            />
        </MyLayout>
    </>
  )
}

export default Index
