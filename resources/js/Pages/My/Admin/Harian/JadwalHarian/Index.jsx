import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import ToastNotification from '../../../../../Shared/ToastNotification';

const Index = () => {

    const { jadwals, flash } = usePage().props;

    // console.log(jadwals);

    if (flash.success) {
        ToastNotification({
            icon: 'success',
            title: flash.success,
            timer: 2000
        });
    }

    const headers = ["No.", "Tahun", "Semester", "Kelas", "Hari", "Start", "End"];

    const rows = jadwals.data.map((jad, index) => [
        index + 1 + (jadwals.current_page - 1) * jadwals.per_page,
        jad.tahun,
        jad.kelas_harian.semester,
        jad.kelas_harian.nama_kelas,
        jad.tanggal,
        jad.kelas_harian.jam_mulai ? jad.kelas_harian.jam_mulai.split(':').slice(0, 2).join(':') : '',
        jad.jam_selesai,
    ]);

    return (
        <>
            <Head title='eLearning - Data Jadwal' />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['dh.jadwal.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['dh.jadwal.create']) && (
                            <>
                            <div className="flex items-center">
                                <Link href={route('my.dh.jadwal.create')}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                    <i className="fa fa-plus-circle mr-2"></i>
                                    Jadwal Harian
                                </Link>
                                <Link
                                    href={route('my.dh.jadwal.repairUuidAndKodeUnik')}
                                    method="post"
                                    as="button"
                                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none dark:focus:ring-green-700"
                                    onClick={(e) => {
                                        if (!confirm('Apakah kamu yakin ingin memperbarui UUID dan Kode Unik yang kosong?')) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <i className="fa fa-sync-alt mr-2"></i>
                                    Perbarui UUID & Kode Unik
                                </Link>
                            </div>
                            </>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/harian/jadwal_harian'} placeholder='Keyword: [Nama Kelas] [Tanggal: 2025-12-03]' />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={jadwals}
                    iconClass="fa fa-calendar-plus"
                    title="Data Jadwal Harian"
                />
            </MyLayout>
        </>
    )
}

export default Index;
