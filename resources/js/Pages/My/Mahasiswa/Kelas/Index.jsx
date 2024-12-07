import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';

const Index = () => {

    const { kelas } = usePage().props;
    
    const headers = ["No.", "Tahun", "Kode", "Kelas", "Semester", "Matkul", "Pengajar"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.kode_kelas,
        kls.nama_kelas,
        kls.matkul.semester,
        <>{kls.matkul.nama_matkul}</>,
        kls.dosen.user.name,
        // (
        //     <div className="flex justify-center">
        //         {hasAnyPermission(['kelas.edit', 'kelas.delete']) ? (
        //             <>
        //                 {hasAnyPermission(['kelas.edit']) && (
        //                     <Link
        //                         href={`/my/kelas/${kls.uuid}/edit`}
        //                         className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
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
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/mhs/kelas'} 
                                placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Mata Kuliah]"
                            />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-users-rectangle"
                    title="Data Kelas"
                />
            </MyLayout>
        </>
    )
}

export default Index;
