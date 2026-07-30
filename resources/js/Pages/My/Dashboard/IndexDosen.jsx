import React, { useState, useEffect } from 'react';
import MyLayout from '../../../Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import greeting from '../../../Utilities/Greeting';
import ToastNotification from '../../../Shared/ToastNotification';
import hasAnyPermission from '../../../Utilities/Permissions'; // Utility untuk cek permission
import SimplePagination from '../../../Shared/SimplePagination';   // Komponen paginasi kustom
import CurrentTime from '../../../Utilities/CurrentTime';

// WIDGET UNTUK MENAMPILKAN JADWAL MENGAJAR HARI INI
const JadwalHariIniWidget = ({ jadwalHariIni }) => {
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

    const handleCopyToClipboard = (kode) => {
        navigator.clipboard.writeText(kode).then(() => {
            ToastNotification({ icon: 'success', title: 'Kode berhasil disalin!' });
        }).catch(() => {
            ToastNotification({ icon: 'error', title: 'Gagal menyalin kode.' });
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-center mb-4 gap-2">
                {/* Bagian Judul (Kiri) */}
                <h2 className="text-xl font-bold text-gray-800">
                    <i className="fa fa-users-rectangle text-green-500 mr-2"></i>
                    Jadwal Mengajar Hari Ini
                </h2>

                {/* Bagian Waktu (Kanan) */}
                <div className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
                    {/* {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} */}
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
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{jadwal.kelas_harian.nama_kelas}</p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <i className="far fa-clock mr-2"></i>
                                            {jadwal.kelas_harian.jam_mulai.slice(0, 5)} - {jamSelesai} WIB
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-500">Kode Presensi:</span>
                                            <span className="font-mono text-base font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded">
                                                {jadwal.kode_unik}
                                            </span>
                                            <button onClick={() => handleCopyToClipboard(jadwal.kode_unik)} className="text-gray-500 hover:text-blue-600" title="Salin Kode">
                                                <i className="far fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                        {isActive && (
                                            <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full animate-pulse">
                                                LIVE
                                            </span>
                                        )}
                                        <div className="inline-flex shadow-sm rounded-md" role="group">
                                            <Link
                                                href={route('dsn.dh.jadwal.listJadwal', {
                                                    kode_kelas_harian: jadwal.kelas_harian.kode_kelas_harian,
                                                    month: getMonthParam(jadwal.tanggal)
                                                })}
                                                title="Lihat Semua Jadwal"
                                                // className="pl-3 pr-3.5 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-full hover:bg-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-500 border-l border-blue-500"
                                                className="pl-5 pr-2 py-2 text-sm font-medium text-white bg-blue-600 rounded-l-full hover:bg-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-500 border-l border-blue-500"
                                            >
                                                <i className="fa-regular fa-calendar-alt h-5 w-5"></i>
                                            </Link>
                                            <Link
                                                href={route('dsn.dh.jadwal.absenMhs', {
                                                    uuid_kelas_harian: jadwal.kelas_harian.uuid,
                                                    month: getMonthParam(jadwal.tanggal),
                                                })}
                                                title="Lihat Absensi"
                                                // className="pl-5 pr-2 py-2 text-sm font-medium text-white bg-blue-600 rounded-l-full hover:bg-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-500"
                                                className="pl-3 pr-3.5 py-2 text-sm font-medium text-white bg-gray-600 rounded-r-full hover:bg-gray-700 focus:z-10 focus:ring-2 focus:ring-gray-500"
                                            >
                                                <i className="fa-regular fa-clipboard h-5 w-5"></i>
                                            </Link>
                                        </div>
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
                    <p className="text-sm text-gray-500 mt-2">Selamat berlibur, semoga harimu menyenangkan!</p>
                </div>
            )}
        </div>
    );
};

// WIDGET UNTUK MENAMPILKAN PENGGUNA YANG SEDANG ONLINE
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
                <p className="text-gray-500 text-center italic">Tidak ada pengguna yang aktif dalam 30 menit terakhir.</p>
            )}
        </div>
    );
};


// HALAMAN UTAMA DASHBOARD DOSEN
export default function IndexDosen() {
    const { auth, jadwalHariIni, usersOnline } = usePage().props;

    // Cek apakah dosen memiliki izin. Ganti 'dashboard.view-online-users' dengan nama permission Anda.
    const canViewOnlineUsers = hasAnyPermission(['view-online-users']);

    return (
        <MyLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div className="text-2xl font-semibold text-gray-800">
                    {greeting(auth.user.name)}
                </div>

                {canViewOnlineUsers ? (
                    // Layout 2 Kolom jika punya izin
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="lg:sticky lg:top-0">
                                <JadwalHariIniWidget jadwalHariIni={jadwalHariIni} />
                            </div>
                        </div>
                        <div>
                            <UsersOnlineWidget usersOnline={usersOnline} />
                        </div>
                    </div>
                ) : (
                    // Layout 1 Kolom (full-width) jika tidak punya izin
                    <JadwalHariIniWidget jadwalHariIni={jadwalHariIni} />
                )}
            </div>
        </MyLayout>
    );
}