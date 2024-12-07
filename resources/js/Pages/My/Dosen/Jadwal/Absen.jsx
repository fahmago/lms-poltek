import { Head, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';

const Absen = () => {
    const { kelas, mahasiswa } = usePage().props;

    // Simulasi absensi (contoh data absensi P1 hingga P6)
    const absensiHeaders = ["P1", "P2", "P3", "P4", "P5", "P6"];
    const absensiTitle = "Absensi Bulan November";

    return (
        <>
            <Head title={`Absensi - ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className="bg-white shadow-md rounded-md">
                        {/* Header */}
                        <div className="bg-blue-700 p-4 rounded-t-md">
                            <span className="text-white font-bold tracking-wider">
                                <i className="fa fa-user-graduate mr-2"></i>
                                Absensi Mahasiswa - {kelas.nama_kelas}
                            </span>
                        </div>
                        {/* Tabel */}
                        <div className="p-4 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    {/* Baris untuk judul absensi */}
                                    <tr className="bg-gray-200">
                                        <th
                                            colSpan={2}
                                            className="border px-4 py-2 text-left font-semibold"
                                        >
                                        </th>
                                        <th
                                            colSpan={absensiHeaders.length}
                                            className="border px-4 py-2 text-center font-semibold"
                                        >
                                            {absensiTitle}
                                        </th>
                                    </tr>
                                    {/* Baris untuk header tabel */}
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-center w-12">No</th>
                                        <th className="border px-4 py-2 text-left">Nama Mahasiswa</th>
                                        {absensiHeaders.map((header, index) => (
                                            <th
                                                key={index}
                                                className="border px-4 py-2 text-center"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mahasiswa.length > 0 ? (
                                        mahasiswa.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2 text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {item.mahasiswa.user.name}
                                                </td>
                                                {absensiHeaders.map((_, idx) => (
                                                    <td
                                                        key={idx}
                                                        className="border px-4 py-2 text-center"
                                                    >
                                                        {/* Isi data absensi dinamis, gunakan logika untuk hadir/tidak */}
                                                        <span className="text-green-600 font-bold">
                                                            H
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                className="border px-4 py-2 text-center"
                                                colSpan={2 + absensiHeaders.length}
                                            >
                                                Tidak ada mahasiswa terdaftar.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Absen;
