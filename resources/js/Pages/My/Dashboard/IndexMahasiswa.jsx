import React, { useState, useEffect } from 'react';
import MyLayout from '../../../Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import greeting from '../../../Utilities/Greeting';
import CurrentTime from '../../../Utilities/CurrentTime';
import SimplePagination from '../../../Shared/SimplePagination';
import hasAnyPermission from '../../../Utilities/Permissions';

const UsersOnlineWidget = ({ usersOnline }) => {
    const timeAgo = (timestamp) => {
        const now = Math.floor(Date.now() / 1000);
        const seconds = now - timestamp;
        if (seconds < 60) return `${seconds} dtk lalu`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} mnt lalu`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                <i className="fa fa-users text-blue-500 mr-2"></i>
                Pengguna Aktif ({usersOnline.total})
            </h2>
            <div className="border-b border-gray-200 mb-4"></div>

            {usersOnline.data.length > 0 ? (
                <>
                    <ul className="space-y-3">
                        {usersOnline.data.map((user, index) => (
                            <li key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                                <div className="flex items-center">
                                    <span className="relative flex h-3 w-3 mr-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-700">{user.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {user.browser} on {user.platform} ({user.device})
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">{timeAgo(user.last_activity)}</span>
                            </li>
                        ))}
                    </ul>

                    <SimplePagination data={usersOnline} />
                </>
            ) : (
                <p className="text-gray-500 text-center italic">
                    Tidak ada pengguna yang aktif dalam 30 menit terakhir.
                </p>
            )}
        </div>
    );
};

// Widget untuk menampilkan jadwal kelas mahasiswa hari ini
const JadwalMahasiswaWidget = ({ jadwalHariIni }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const calculateJamSelesai = (jamMulai, durasi) => {
        const [hour, minute] = jamMulai.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(hour, minute, 0, 0);
        startTime.setMinutes(startTime.getMinutes() + durasi);
        return startTime.toTimeString().slice(0, 5);
    };

    const isJadwalAktif = (jadwal) => {
        const startDateTime = new Date(`${jadwal.tanggal}T${jadwal.kelas_harian.jam_mulai}`);
        const endDateTime = new Date(startDateTime.getTime() + jadwal.kelas_harian.durasi * 60000);
        return currentTime >= startDateTime && currentTime <= endDateTime;
    };

    const getMonthParam = (tanggal) => {
        const date = new Date(tanggal);
        const year = date.getFullYear();
        const monthName = date.toLocaleString('en-US', { month: 'long' });
        return `${year}-${monthName}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-center mb-4 gap-2">
                {/* Bagian Judul (Kiri) */}
                <h2 className="text-xl font-bold text-gray-800">
                    <i className="fas fa-users-rectangle text-green-500 mr-2"></i>
                    Jadwal Kelas Hari Ini
                </h2>

                {/* Bagian Waktu (Kanan) */}
                <div className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
                    <CurrentTime color='text-green-600' />
                </div>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            {jadwalHariIni.length > 0 ? (
                <ul className="space-y-4">
                    {jadwalHariIni.map((jadwal) => {
                        const isActive = isJadwalAktif(jadwal);
                        const jamSelesai = calculateJamSelesai(jadwal.kelas_harian.jam_mulai, jadwal.kelas_harian.durasi);

                        return (
                            <li key={jadwal.id} className={`p-4 border rounded-lg transition-all duration-300 ${isActive ? 'bg-green-50 border-green-300' : 'border-gray-200'}`}>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{jadwal.kelas_harian.nama_kelas}</p>
                                        <p className="text-sm text-gray-600">
                                            <i className="far fa-clock mr-2"></i>
                                            {jadwal.kelas_harian.jam_mulai.slice(0, 5)} - {jamSelesai} WIB
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            <i className="far fa-user mr-2"></i>
                                            {jadwal.kelas_harian.dosen?.user?.name ?? 'Dosen belum diatur'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                        {isActive && (
                                            <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full animate-pulse">
                                                LIVE
                                            </span>
                                        )}
                                        <Link
                                            href={route('mhs.dh.abs.listJadwal', {
                                                kode_kelas_harian: jadwal.kelas_harian.kode_kelas_harian,
                                                month: getMonthParam(jadwal.tanggal),
                                            })}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 w-full sm:w-auto text-center"
                                        >
                                            <i className="fas fa-list mr-2"></i>
                                            Lihat Jadwal
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-center py-12">
                    <img
                        src={`/images/cat2.png`}
                        alt="Tidak ada jadwal"
                        className="mx-auto w-52 h-auto mb-4 text-gray-400 rounded-full"
                    />
                    <p className="font-bold text-lg text-gray-700">Tidak Ada Jadwal Hari Ini</p>
                    <p className="text-sm text-gray-500 mt-2">Tapi ingat, kamu mungkin memiliki tugas yang belum selesai.</p>
                </div>
            )}
        </div>
    );
};

// Komponen Halaman Utama Dashboard Mahasiswa
export default function IndexMahasiswa() {
    const { auth, jadwalHariIni, usersOnline } = usePage().props;
    const canViewOnlineUsersMhsAndDosen = hasAnyPermission(['mhs.view-online-users']);
    return (
        <MyLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div className="text-2xl font-semibold text-gray-800">
                    {greeting(auth.user.name)}
                </div>

                {/* Tampilkan widget jadwal */}
                {/* <JadwalMahasiswaWidget jadwalHariIni={jadwalHariIni} /> */}
                {/* Anda bisa tambahkan widget lain untuk mahasiswa (seperti Deadline Tugas) di bawah sini */}
                
                {canViewOnlineUsersMhsAndDosen ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-0">
                                <JadwalMahasiswaWidget jadwalHariIni={jadwalHariIni} />
                            </div>
                        </div>
                        <div>
                            <UsersOnlineWidget usersOnline={usersOnline} />
                        </div>
                    </div>
                ) : (
                    <JadwalMahasiswaWidget jadwalHariIni={jadwalHariIni} />
                )}

                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <JadwalMahasiswaWidget jadwalHariIni={jadwalHariIni} />
                    </div>

                    <div>
                        <UsersOnlineWidget usersOnline={usersOnline} />
                    </div>
                </div> */}
            </div>
        </MyLayout>
    );
}