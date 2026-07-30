import React from 'react';
import { Head, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';

const List = () => {
    const { kelasHarian, jadwal, month } = usePage().props;

    const headers = ["No.", "Tanggal", "Waktu Isi Absen"];

    const rows = jadwal.map((item, index) => [
        index + 1,
        item.tanggal,
        item.waktu_isi_absen || "Belum Ditentukan",
    ]);

    return (
        <>
            <Head title={`Jadwal Bulan ${month}`} />
            <MyLayout>
                <div className="mt-5">
                    <h1 className="text-2xl font-bold mb-4">
                        Jadwal Bulan {month} - {kelasHarian.nama_kelas}
                    </h1>
                    <DataTable
                        headers={headers}
                        rows={rows}
                        iconClass="fa fa-calendar-day"
                        title={`Jadwal Bulan ${month}`}
                    />
                </div>
            </MyLayout>
        </>
    );
};

export default List;
