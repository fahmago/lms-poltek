import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';

const ShowByMonth = () => {
    const { kelasHarian, months } = usePage().props;

    const headers = ["No.", "Tahun", "Bulan", "Jadwal", "Actions"];

    const monthMapping = {
        January: '01',
        February: '02',
        March: '03',
        April: '04',
        May: '05',
        June: '06',
        July: '07',
        August: '08',
        September: '09',
        October: '10',
        November: '11',
        December: '12'
    };

    const rows = months.map((month, index) => [
        index + 1,
        month.tahun,
        month.bulan,
        `${month.count} Hari`,
        (
            <div className="flex justify-center gap-2">
                <Link
                    href={route('dsn.dh.jadwal.listJadwal', {
                        kode_kelas_harian: kelasHarian.kode_kelas_harian,
                        month: `${month.tahun}-${month.bulan}`
                    })}
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <i className='fa-regular fa-eye mr-1'></i>
                    {/* Jadwal */}
                </Link>
                <a
                    href={route('my.dh.kelas.printAbsensiKelas', { uuid: kelasHarian.uuid, month: `${month.tahun}-${monthMapping[month.bulan]}` })}
                    target='_blank'
                    className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                    <i className="fa fa-print mr-1"></i>
                    {/* Cetak */}
                </a>
                <a
                    href={route('my.dh.kelas.exportAbsensiKelas', { uuid: kelasHarian.uuid, month: `${month.tahun}-${monthMapping[month.bulan]}` })}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    <i className="fa fa-file-excel mr-1"></i>
                    {/* Export */}
                </a>
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
