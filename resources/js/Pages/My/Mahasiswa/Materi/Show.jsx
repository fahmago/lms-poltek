import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';
// import hasAnyPermission from '../../../../Utilities/Permissions';

const Show = () => {
    const { kelas, materis } = usePage().props;

    const headers = ["No.", "Judul Materi", "Deskripsi", "Link Modul"];

    const rows = materis.data.map((materi, index) => [
        index + 1 + (materis.current_page - 1) * materis.per_page,
        // materi.judul,
        <div
            className='text-left'
            style={{ maxHeight: '100px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: materi.judul }}></div>,
        <div 
            className='text-left'
            style={{ maxHeight: '100px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: materi.deskripsi }}></div>,
        <>
            {materi.file ? (
                <a
                    href={materi.file}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800">
                    <i className="fa fa-link"></i>
                </a>
            ) : (
                <span
                    className="text-red-600 cursor-not-allowed"
                    title="Link tidak tersedia">
                    <i className="fa fa-link"></i>
                </span>
            )}
        </>,
        // (
        //     <div className="flex justify-center">
        //         {hasAnyPermission(['dsn.mtr.edit', 'dsn.mtr.delete']) ? (
        //             <>
        //                 {hasAnyPermission(['dsn.mtr.edit']) && (
        //                     <button
        //                         onClick={() => openModal(materi)}  // Call openModal to edit materi
        //                         className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        //                     >
        //                         <i className="fa fa-pencil-alt"></i>
        //                     </button>
        //                 )}
        //                 {hasAnyPermission(['dsn.mtr.delete']) && (
        //                     <Delete URL={'/my/d/materi'} id={materi.uuid} />
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
            <Head title={`eLearning - Materi Kelas ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-info-circle mr-2"></i> Detail Kelas: {kelas.nama_kelas} ({kelas.kode_kelas})
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Tahun Semester</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.tahun} / {kelas.matkul.semester}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">SKS</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.matkul.sks}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Mata Kuliah</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.matkul.kode_matkul} / {kelas.matkul.nama_matkul}</td>
                                        </tr>    
                                    </tbody>
                                </table>
                            </div>

                            <DataTable
                                headers={headers}
                                rows={rows}
                                pagination={materis}
                                iconClass="fa fa-chalkboard"
                                title={`Materi Kelas ${kelas.nama_kelas}`}
                            />
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Show;
