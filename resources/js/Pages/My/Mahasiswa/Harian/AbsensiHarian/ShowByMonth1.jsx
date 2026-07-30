import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';

const ShowByMonth = () => {
    const { kelasHarian, months } = usePage().props;

    const headers = ["No.", "Tahun", "Bulan", "Jadwal", "Actions"];

    const rows = months.map((month, index) => [
        index + 1,
        month.tahun,
        month.bulan,
        `${month.count} Hari`,
        (
            <div className="flex justify-center">
                <Link
                    href={route('mhs.dh.abs.listJadwal', {
                        kode_kelas_harian: kelasHarian.kode_kelas_harian,
                        month: `${month.tahun}-${month.bulan}`
                    })}
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Presence
                </Link>
            </div>
        ),
    ]);

    return (
        <>
            <Head title={`Jadwal Kelas - ${kelasHarian.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <h1 className="text-2xl font-bold mb-4">Jadwal Kelas: {kelasHarian.nama_kelas}</h1>
                    <DataTable
                        headers={headers}
                        rows={rows}
                        iconClass="fa fa-calendar-alt"
                        title="Jadwal Berdasarkan Bulan"
                    />
                </div>
            </MyLayout>
        </>
    );
};

export default ShowByMonth;
