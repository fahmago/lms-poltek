import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';

const Index = () => {

    const { jadwals } = usePage().props;
    
    const headers = ["No.", "Tahun", "Semester", "Kelas", "Hari", "Ruang", "Start", "End"];

    const rows = jadwals.data.map((jad, index) => [
        index + 1 + (jadwals.current_page - 1) * jadwals.per_page,
        jad.tahun,
        jad.semester,
        jad.kelas.nama_kelas,
        jad.tanggal,
        jad.ruangan,
        jad.jam_mulai,
        jad.jam_selesai,
        // (
        //     <div className="flex justify-center">
        //         {hasAnyPermission(['kelas.edit', 'kelas.delete']) ? (
        //             <>
        //                 {hasAnyPermission(['kelas.edit']) && (
        //                     <Link
        //                         href={`/my/kelas/${jad.uuid}/edit`}
        //                         className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
        //                         <i className="fa fa-pencil-alt"></i>
        //                     </Link>
        //                 )}
        //                 {hasAnyPermission(['kelas.delete']) && (
        //                     <Delete URL={'/my/kelas'} id={jad.uuid} />
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
            <Head title='eLearning - Data Jadwal' />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['jadwal.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['jadwal.create']) && (
                            <Link href={route('my.jadwal.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Jadwal
                            </Link>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/jadwal'} />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={jadwals}
                    iconClass="fa fa-calendar-plus"
                    title="Data Jadwal"
                />
            </MyLayout>
        </>
    )
}

export default Index;
