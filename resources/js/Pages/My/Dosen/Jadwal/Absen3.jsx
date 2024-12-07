import { Head, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../Shared/ToastNotification';

const Absen = () => {
    const { kelas, mahasiswa, jadwals, flash} = usePage().props;

    const absensiHeaders = jadwals.map((jadwal, index) => `P${index + 1}`);
    const absensiTitle = "Absensi Perkuliahan";

    const handleUpdateStatus = (mahasiswaId, jadwalId, absensiId, newStatus) => {
        // console.log("Mahasiswa ID:", mahasiswaId);
        // console.log("Jadwal ID:", jadwalId);
        // console.log("Kode Kelas:", kelas.kode_kelas);
        // console.log("Absensi ID:", absensiId || null);
        // console.log("New Status:", newStatus);
        // if (!absensiId) {
        //     alert("Absensi ID tidak ditemukan!");
        //     return;
        // }

        // Kirim permintaan update ke server
        Inertia.post(route('dsn.jdwl.updateAbsensi'), {
            mahasiswa_id: mahasiswaId,
            jadwal_id: jadwalId,
            kode_kelas: kelas.kode_kelas,
            absensi_id: absensiId || null,
            status: newStatus,
        }, {
            preserveScroll: true,
            // onSuccess: () => alert('Status berhasil diperbarui!'),
            onSuccess: () => {
                ToastNotification({
                    icon: 'success',
                    title: flash?.success || 'Berhasil!',
                    timer: 2000,
                });
            },
        });
    };

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
                        <div className="p-4 -mb-5">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Tahun Semester</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.tahun} / {kelas.matkul.semester}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">SKS</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.matkul.sks}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Mata Kuliah</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_matkul} / {kelas.matkul.nama_matkul}</td>
                                        </tr>                                      
                                    </tbody>
                                </table>
                            </div>          
                        {/* Tabel */}
                        <div className="p-4 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    {/* Baris untuk judul absensi */}
                                    <tr className="bg-gray-200">
                                        <th
                                            colSpan={3}
                                            className="border px-4 py-2 text-left font-semibold"
                                        ></th>
                                        <th
                                            colSpan={absensiHeaders.length}
                                            className="border px-4 py-2 text-center font-semibold"
                                        >
                                            {absensiTitle}
                                        </th>
                                    </tr>
                                    {/* Baris untuk header tabel */}
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-center font-semibold">
                                            No
                                        </th>
                                        <th className="border px-4 py-2 text-center font-semibold">
                                            Nim
                                        </th>
                                        <th className="border px-4 py-5 text-center font-semibold w-80 !min-w-[300px]">
                                            Nama Mahasiswa
                                        </th>
                                        {jadwals.map((jadwal, index) => (
                                            <th
                                                key={index}
                                                className="border px-4 py-2 text-center font-semibold"
                                            >
                                                {`P${index + 1}`}
                                                <br />
                                                <span className="text-xs">
                                                    {jadwal.tanggal}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mahasiswa.length > 0 ? (
                                        mahasiswa.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2 text-left">
                                                    {index + 1}
                                                </td>
                                                <td className="border px-4 py-2 text-left">
                                                    {item.mahasiswa.nim || (
                                                        <span className="text-red-500">
                                                            Belum Ada
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="border px-4 py-2 text-left w-80 !min-w-[300px]">
                                                    {item.mahasiswa.user.name}
                                                </td>
                                                {jadwals.map((jadwal, idx) => {
                                                    const absensi = jadwal.absensi[item.mahasiswa.id] || {};
                                                    return (
                                                        <td
                                                            key={idx}
                                                            className="border px-4 py-2 text-center"
                                                        >
                                                            <select
                                                                value={absensi.status || "-"}
                                                                onChange={(e) =>
                                                                    handleUpdateStatus(
                                                                        item.mahasiswa.id,
                                                                        jadwal.id,
                                                                        absensi.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="border p-1 rounded"
                                                            >
                                                                <option value="-">-</option>
                                                                <option value="H">Hadir</option>
                                                                <option value="I">Izin</option>
                                                                <option value="S">Sakit</option>
                                                                <option value="A">Alpha</option>
                                                            </select>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                className="border px-4 py-2 text-center"
                                                colSpan={3 + jadwals.length}
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
