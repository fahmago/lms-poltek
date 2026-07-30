import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../../Layouts/MyLayout';
// 1. Impor komponen baru
import DataTableJadwal from '../../../../../Shared/DataTableJadwal';

const ShowByMonth = () => {
    const { kelasHarian, months } = usePage().props;

    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthName = monthNames[now.getMonth()];

    const headers = ["No.", "Tahun", "Bulan", "Jadwal", "Actions"];

    // Logika ini sudah benar untuk komponen baru
    const rows = months.map((month, index) => {
        const isCurrentMonth = month.tahun == currentYear && month.bulan == currentMonthName;

        return {
            className: isCurrentMonth ? 'bg-green-100 font-bold text-green-900 text-xl hover:bg-green-100' : '',
            data: [
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
                            className={`focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5 ${isCurrentMonth ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-blue-700 hover:bg-blue-800'}`}
                        >
                            Presence
                        </Link>
                    </div>
                ),
            ]
        };
    });

    return (
        <>
            <Head title={`Jadwal Kelas - ${kelasHarian.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <h1 className="text-2xl font-bold mb-4">Jadwal Kelas: {kelasHarian.nama_kelas}</h1>
                    {/* 2. Gunakan komponen DataTableJadwal di sini */}
                    <DataTableJadwal
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