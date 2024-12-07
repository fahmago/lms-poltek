import { Head, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';

const Absen = () => {
    const { kelas, mahasiswa, jadwals } = usePage().props;

    const absensiHeaders = jadwals.map((jadwal, index) => `P${index + 1}`);
    const absensiTitle = "Absensi Perkuliahan";

    console.log("Data Mahasiswa:", mahasiswa);
    console.log("Data Jadwals:", jadwals);

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
                                        <th colSpan={2} className="border px-4 py-2 text-left font-semibold"></th>
                                        <th colSpan={absensiHeaders.length} className="border px-4 py-2 text-center font-semibold">
                                            {absensiTitle}
                                        </th>
                                    </tr>
                                    {/* Baris untuk header tabel */}
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-center w-12">No</th>
                                        <th className="border px-4 py-2 text-left">Mahasiswa</th>
                                        {jadwals.map((jadwal, index) => (
                                            <th
                                                key={index}
                                                className="border px-4 py-2 text-center font-semibold"
                                            >
                                                {`P${index + 1}`}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mahasiswa && mahasiswa.length > 0 ? (
                                        Object.values(mahasiswa).map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2 text-left font-medium">
                                                    {index + 1}.
                                                </td>
                                                <td className="border px-4 py-2 text-left font-medium">
                                                    {item.mahasiswa?.user?.name || "Nama tidak tersedia"}
                                                </td>
                                                {jadwals.map((jadwal, idx) => (
                                                    <td
                                                        key={idx}
                                                        className="border px-4 py-2 text-center"
                                                    >
                                                        {jadwal.absensi[item.mahasiswa?.id] || "A"}
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
