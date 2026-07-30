import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';

const Index = () => {

    const { kelas } = usePage().props;
    
    const headers = ["No.", "Tahun", "Kelas", "Semester", "Matkul", "Pertemuan", "Actions"];

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.nama_kelas,
        kls.matkul.semester,
        <>{kls.matkul.nama_matkul}</>,
        <>{kls.jadwals_count} Pertemuan</>,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['mhs.abs.presence']) ? (
                    <>
                        {hasAnyPermission(['mhs.abs.presence']) && (
                            <Link
                                href={route('mhs.abs.showPresence', kls.kode_kelas)}
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2">
                                Presence
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
            <Head title='eLearning - Data Kelas' />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/mhs/absensi'} 
                                placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Mata Kuliah]"
                            />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-clipboard-check"
                    title="Absensi Kelas"
                />
            </MyLayout>
        </>
    )
}

export default Index;
