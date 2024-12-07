import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';

const Show = () => {
    const { mahasiswas } = usePage().props;

    // console.log(mahasiswas);
    
    const headers = ["No.", "Foto", "Nim", "Nama Mahasiswa", "Actions"];

    const rows = mahasiswas.data.map((mhs, index) => [
        index + 1 + (mahasiswas.current_page - 1) * mahasiswas.per_page,
        <img src={mhs.mahasiswa.image} className="rounded-lg w-20 h-auto mx-auto" />,
        mhs.mahasiswa.nim ? mhs.mahasiswa.nim : <><span className="text-red-500 font-semibold">Belum Ada</span></>,
        mhs.mahasiswa.user.name ? mhs.mahasiswa.user.name : 'Dihapus',
        (
            <div className="flex justify-center">
                {hasAnyPermission(['mahasiswas.edit', 'mahasiswas.delete']) ? (
                    <>
                        {hasAnyPermission(['mahasiswas.edit']) && (
                            <Link
                                href={`/my/mahasiswa/${mhs.uuid}/edit`}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                <i className="fa fa-pencil-alt"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['mahasiswas.delete']) && (
                            <Delete URL={'/my/mahasiswa'} id={mhs.uuid} />
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
        <Head title='eLearning - Data Mahasiswa' />
        <MyLayout>
            <div className="flex flex-col mt-5">
                <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['mahasiswas.create']) ? 'justify-between' : 'justify-center'}`}>
                    {hasAnyPermission(['mahasiswas.create']) && (
                        <Link href={route('my.mahasiswas.create')}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            <i className="fa fa-plus-circle mr-2"></i>
                            Mahasiswa
                        </Link>
                    )}
                    <div className="w-full md:w-3/4 lg:w-3/6">
                        <Search URL={'/my/mahasiswa'} />
                    </div>
                </div>
            </div>
            <DataTable
                headers={headers}
                rows={rows}
                pagination={mahasiswas}
                iconClass="fa fa-user-graduate"
                title="Data Mahasiswa"
            />
        </MyLayout>
    </>
  )
}

export default Show
