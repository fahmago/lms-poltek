import React from 'react';
import { Head, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../../Layouts/MyLayout';

const Show = () => {
    const { kelasHarian, jadwalByMonth } = usePage().props;

    return (
        <>
            <Head title={`Jadwal Harian - ${kelasHarian.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <h1 className="text-2xl font-bold">Jadwal Kelas: {kelasHarian.nama_kelas}</h1>
                    {Object.keys(jadwalByMonth).map((month, index) => (
                        <div key={index} className="mt-4">
                            <h2 className="text-lg font-semibold">{month}</h2>
                            <ul className="list-disc pl-5">
                                {jadwalByMonth[month].map((jadwal, i) => (
                                    <li key={i}>
                                        Tanggal: {jadwal.tanggal}, Waktu Isi Absen: {jadwal.waktu_isi_absen}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </MyLayout>
        </>
    );
};

export default Show;
