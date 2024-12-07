import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';

const Index = () => {
    const { kelas } = usePage().props;

    const headers = ["No.", "Tahun", "Kelas", "Semester", "Matkul", "Materi", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        // Kolom Nomor
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        // Kolom Tahun
        kls.tahun,
        // Kolom Nama Kelas
        kls.nama_kelas,
        // Kolom Semester
        kls.matkul.semester,
        // Kolom Nama Mata Kuliah
        <>{kls.matkul.nama_matkul}</>,
        // Kolom Daftar Tugas
        // <span>{kls.tugas.length}</span>,
        kls.materis_count,
        // <ul>
        //     {kls.tugas.map((tugas) => (
        //         <li key={tugas.id}>
        //             <p>
        //                 <strong>{tugas.judul}</strong>
        //                 <br />
        //                 Deadline: {new Date(tugas.tanggal_deadline).toLocaleDateString()}
        //             </p>
        //         </li>
        //     ))}
        // </ul>,
        // Kolom Actions
        (
            <div className="flex justify-center">
                {hasAnyPermission(['mhs.mtr.show']) ? (
                    <Link
                        href={route('mhs.mtr.show', kls.kode_kelas)}
                        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <i className="fa-regular fa-eye"></i>
                    </Link>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title="eLearning - Data Kelas" />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search
                                URL={'/my/mhs/tugas'}
                                placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Mata Kuliah]"
                            />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-person-chalkboard"
                    title="Materi Kelas"
                />
            </MyLayout>
        </>
    );
};

export default Index;
