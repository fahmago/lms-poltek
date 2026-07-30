import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';

const Show2 = () => {
    const { kelas, mahasiswa } = usePage().props;

    const headers = ["No.", "Foto", "NIM", "Nama Mahasiswa", "Actions"];

    const rows = mahasiswa.data.map((item, index) => [
        index + 1 + (mahasiswa.current_page - 1) * mahasiswa.per_page,
        <img
            src={item.mahasiswa.image}
            alt={`Foto ${item.mahasiswa.user.name}`}
            className="rounded-lg w-20 h-auto mx-auto"
        />,
        item.mahasiswa.nim ? item.mahasiswa.nim : <><span className="text-red-500 font-semibold">Belum Ada</span></>,
        item.mahasiswa.user.name,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dsn.dh.kelas.view']) ? (                    
                    <Link
                        href={route('dsn.dh.kelas.viewMhs', item.mahasiswa.uuid)}
                        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <i className="fa fa-eye"></i>
                    </Link>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title={`eLearning - Detail Mahasiswa Kelas ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-info-circle mr-2"></i> Detail Kelas: {kelas.nama_kelas} ({kelas.kode_kelas_harian})
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Enroll</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_enroll}</td>
                                        </tr>

                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_kelas_harian}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Tahun Semester</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.tahun} / {kelas.semester}</td>
                                        </tr> 
                                    </tbody>
                                </table>
                            </div>
                            <Search 
                                URL={`/my/d/harian/kelas_harian/${kelas.uuid}/mhsList`} 
                                placeholder="Keyword: [Nim] [Nama Mahasiswa]"
                            />
                            <DataTable
                                headers={headers}
                                rows={rows}
                                pagination={mahasiswa}
                                iconClass="fa fa-user-graduate"
                                title={`Daftar Mahasiswa Kelas ${kelas.nama_kelas}`}
                            />
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Show2;
