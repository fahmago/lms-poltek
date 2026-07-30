import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useEffect } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../../Shared/ToastNotification';
import convertMonthToIndonesian from '../../../../../Utilities/ConvertMonthToIndonesian';
import hasAnyPermission from '../../../../../Utilities/Permissions';

const Absen = () => {
    const { kelas, mahasiswa, jadwals, monthNum, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            ToastNotification({ icon: 'success', title: flash.success });
        }
    }, [flash]);
    
    const absensiTitle = `Absensi Perkuliahan Bulan ${convertMonthToIndonesian(monthNum)} ${kelas.tahun}`;

    const handleUpdateStatus = (mahasiswaId, jadwalId, absensiId, newStatus) => {
        Inertia.post(route('dsn.dh.jadwal.updateAbsensi'), {
            mahasiswa_id: mahasiswaId,
            jadwal_harian_id: jadwalId,
            kelas_harian_id: kelas.id,
            kode_kelas_harian: kelas.kode_kelas_harian,
            absensi_id: absensiId || null,
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                ToastNotification({ icon: 'success', title: 'Status diperbarui!' });
            },
        });
    };

    const handleSetHadirSemua = (jadwalId) => {
        Inertia.post(route('dsn.dh.jadwal.setHadirSemua'), {
            jadwal_harian_id: jadwalId,
            kelas_harian_id: kelas.id,
            kode_kelas_harian: kelas.kode_kelas_harian,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                ToastNotification({ icon: 'success', title: flash?.success || 'Berhasil!' });
            },
            onError: () => {
                 ToastNotification({ icon: 'error', title: 'Terjadi kesalahan!' });
            }
        });
    };

    return (
        <>
            <Head title={`Absensi - ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className="bg-white shadow-md rounded-md">
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
                                        <td className="py-1 pl-3 w-3/4">: {kelas.kode_kelas_harian}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 font-semibold pr-3 w-1/5">Kelas</td>
                                        <td className="py-1 pl-3 w-3/4">: {kelas.nama_kelas}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 font-semibold pr-3 w-1/5">Tahun Semester</td>
                                        <td className="py-1 pl-3 w-3/4">: {kelas.tahun} / {kelas.semester}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1 font-semibold pr-3 w-1/5">Rekap Absensi</td>
                                        <td className="py-1 pl-3 w-3/4">: {convertMonthToIndonesian(monthNum)} {kelas.tahun}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th colSpan={3} className="border px-4 py-2 text-left font-semibold"></th>
                                        <th colSpan={jadwals.length} className="border px-4 py-2 text-center font-semibold">
                                            {absensiTitle}
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <th className="border px-4 py-2 text-center font-semibold">No</th>
                                        <th className="border px-4 py-2 text-center font-semibold">Nim</th>
                                        <th className="border px-4 py-5 text-center font-semibold w-80 !min-w-[300px]">Nama Mahasiswa</th>
                                        {jadwals.map((jadwal, index) => (
                                            <th key={index} className="border px-4 py-2 text-center font-semibold align-top min-w-28">
                                                <div>{jadwal.hari}</div>
                                                <div className="text-xs">{jadwal.tanggal}</div>
                                                <>
                                                    {hasAnyPermission(['dsn.dh.jadwal.setHadirSemua']) && (
                                                        <button
                                                            onClick={() => handleSetHadirSemua(jadwal.id)}
                                                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                            title={`Set Hadir Semua pada ${jadwal.tanggal}`}
                                                        >
                                                            <i className="fa fa-user-check mr-1"></i>
                                                            Hadir
                                                        </button>
                                                    )}
                                                </>                                                    
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {mahasiswa.length > 0 ? (
                                        mahasiswa.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border px-4 py-2 text-left">{index + 1}</td>
                                                <td className="border px-4 py-2 text-left">{item.mahasiswa.nim || <span className="text-red-500">Belum Ada</span>}</td>
                                                <td className="border px-4 py-2 text-left w-80 !min-w-[300px]">{item.mahasiswa.user.name}</td>
                                                {jadwals.map((jadwal, idx) => {
                                                    const absensi = jadwal.absensi[item.mahasiswa.id] || {};
                                                    return (
                                                        <td key={idx} className="border px-4 py-2 text-center">
                                                            <select
                                                                value={absensi.status || "-"}
                                                                onChange={(e) => handleUpdateStatus(item.mahasiswa.id, jadwal.id, absensi.id, e.target.value)}
                                                                className="border p-1 rounded w-full"
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
                                            <td className="border px-4 py-2 text-center" colSpan={3 + jadwals.length}>
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