import React, { useState, useEffect } from 'react';
import MyLayout from '../../../Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import greeting from '../../../Utilities/Greeting';
import SimplePagination from '../../../Shared/SimplePagination';
import hasAnyPermission from '../../../Utilities/Permissions';
import CurrentTime from '../../../Utilities/CurrentTime';

// --- WIDGET COMPONENTS ---

const JadwalItem = ({ jadwal, currentTime }) => {
    const calculateJamSelesai = (jamMulai, durasi) => {
        const [hour, minute] = jamMulai.split(':').map(Number);
        const startTime = new Date(); startTime.setHours(hour, minute, 0, 0);
        startTime.setMinutes(startTime.getMinutes() + durasi);
        return startTime.toTimeString().slice(0, 5);
    };
    const getMonthParamForPrint = (tanggal) => {
        const date = new Date(tanggal);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Format '10' bukan '1'
        return `${year}-${month}`;
    };
    const isJadwalAktif = () => {
        const startDateTime = new Date(`${jadwal.tanggal}T${jadwal.kelas_harian.jam_mulai}`);
        const endDateTime = new Date(startDateTime.getTime() + jadwal.kelas_harian.durasi * 60000);
        return currentTime >= startDateTime && currentTime <= endDateTime;
    };
    const isActive = isJadwalAktif();
    const jamSelesai = calculateJamSelesai(jadwal.kelas_harian.jam_mulai, jadwal.kelas_harian.durasi);
    return (
        <div className={`flex justify-between items-center p-3 rounded-md transition-all ${isActive ? 'bg-green-100' : 'bg-white'}`}>
            <div>
                <p className="font-medium text-gray-800">{jadwal.kelas_harian.nama_kelas}</p>
                <p className="text-sm text-gray-500">
                    <i className="far fa-clock mr-2"></i>
                    {jadwal.kelas_harian.jam_mulai.slice(0, 5)} - {jamSelesai} WIB
                </p>
            </div>
            <div className="flex items-center gap-3">
                {isActive && <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full animate-pulse">LIVE</span>}

                {/* --- TOMBOL CETAK BARU --- */}
                {/* Kita gunakan tag `a` biasa dengan `target="_blank"` */}
                <a
                    href={route('my.dh.kelas.printAbsensiKelas', {
                        uuid: jadwal.kelas_harian.uuid,
                        month: getMonthParamForPrint(jadwal.tanggal)
                    })}
                    target="_blank"
                    rel="noopener noreferrer" // Praktik keamanan untuk target="_blank"
                    className="text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors duration-200"
                    title="Cetak Absensi Bulan Ini"
                >
                    <i className="fa fa-print"></i>
                </a>
            </div>
        </div>
    );
};

const JadwalDosenWidget = ({ jadwalPerDosen }) => {
    const [activeTab, setActiveTab] = useState('live');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const isDosenLiveNow = (jadwalDosen) => {
        return jadwalDosen.some(jadwal => {
            const startDateTime = new Date(`${jadwal.tanggal}T${jadwal.kelas_harian.jam_mulai}`);
            const endDateTime = new Date(startDateTime.getTime() + jadwal.kelas_harian.durasi * 60000);
            return currentTime >= startDateTime && currentTime <= endDateTime;
        });
    };

    const daftarDosen = Object.entries(jadwalPerDosen);
    const dosenLive = daftarDosen.filter(([namaDosen, jadwalDosen]) => isDosenLiveNow(jadwalDosen));

    const renderDosenList = (list) => {
        if (list.length === 0) {
            return (
                <div className="text-center py-12">
                    <img
                        src={`/images/cat2.png`}
                        alt="Tidak ada jadwal"
                        className="mx-auto w-52 h-auto mb-4 text-gray-400 rounded-full"
                    />
                    <p className="font-bold text-lg text-gray-700">Tidak Ada Jadwal Hari Ini</p>
                    <p className="text-sm text-gray-500">Semua dosen tampaknya sedang tidak ada jadwal mengajar.</p>
                </div>
            );
        }

        // --- PERUBAHAN UTAMA DIMULAI DI SINI ---

        // 1. Bagi daftar dosen menjadi dua array terpisah: satu untuk kolom kiri, satu untuk kanan.
        const leftColumn = list.filter((_, index) => index % 2 === 0);
        const rightColumn = list.filter((_, index) => index % 2 !== 0);

        return (
            // 2. Buat grid container utama dengan dua kolom.
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                {/* Kolom Kiri: Render semua dosen dengan indeks genap */}
                <div className="flex flex-col gap-6">
                    {leftColumn.map(([namaDosen, jadwalDosen]) => (
                        <div key={namaDosen} className={`border p-4 rounded-lg transition-all h-fit ${isDosenLiveNow(jadwalDosen) ? 'bg-green-50 border-green-300' : 'bg-gray-50'}`}>
                            <h3 className="font-bold text-lg mb-3 text-gray-700">{namaDosen}</h3>
                            <ul className="space-y-2">
                                {jadwalDosen.map((jadwal) => (<li key={jadwal.id}><JadwalItem jadwal={jadwal} currentTime={currentTime} /></li>))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Kolom Kanan: Render semua dosen dengan indeks ganjil */}
                <div className="flex flex-col gap-6">
                    {rightColumn.map(([namaDosen, jadwalDosen]) => (
                        <div key={namaDosen} className={`border p-4 rounded-lg transition-all h-fit ${isDosenLiveNow(jadwalDosen) ? 'bg-green-50 border-green-300' : 'bg-gray-50'}`}>
                            <h3 className="font-bold text-lg mb-3 text-gray-700">{namaDosen}</h3>
                            <ul className="space-y-2">
                                {jadwalDosen.map((jadwal) => (<li key={jadwal.id}><JadwalItem jadwal={jadwal} currentTime={currentTime} /></li>))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <div className="flex flex-col sm:flex-row sm:justify-between items-center sm:items-center mb-4 gap-2">
                {/* Bagian Judul (Kiri) */}
                <h2 className="text-xl font-bold text-gray-800 self-start sm:self-auto">
                    <i className="fas fa-users-rectangle text-green-500 mr-2"></i>
                    Jadwal Mengajar Dosen Hari Ini
                </h2>

                {/* Bagian Waktu (Kanan) */}
                <div className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full w-fit">
                    <CurrentTime color='text-green-600' />
                </div>
            </div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('live')} className={`${activeTab === 'live' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} py-4 px-1 border-b-2 font-medium text-sm`}>Sedang Mengajar ({dosenLive.length})</button>
                    <button onClick={() => setActiveTab('all')} className={`${activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'} py-4 px-1 border-b-2 font-medium text-sm`}>Semua Jadwal ({daftarDosen.length})</button>
                </nav>
            </div>
            {activeTab === 'live' ? renderDosenList(dosenLive) : renderDosenList(daftarDosen)}
        </div>
    );
};

const UsersOnlineWidget = ({ usersOnline }) => {
    const timeAgo = (timestamp) => {
        const now = Math.floor(Date.now() / 1000);
        const seconds = now - timestamp;
        if (seconds < 60) return `${seconds} dtk lalu`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes} mnt lalu`;
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800"><i className="fa fa-users text-blue-500 mr-2"></i>Pengguna Aktif ({usersOnline.total})</h2>
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
                                        <p className="text-xs text-gray-500">IP: {user.ip_address}</p>
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
            ) : (<p className="text-gray-500 text-center italic">Tidak ada pengguna yang aktif selama 60 menit.</p>)}
        </div>
    );
};

const SystemHealthWidget = ({ healthData }) => {
    const StatusIndicator = ({ status, okText = 'OK', errorText = 'Error' }) => {
        const isOk = status === okText || (typeof status === 'number' && status === 0);
        return (<span className={`font-bold ${isOk ? 'text-green-600' : 'text-red-600'}`}>{status}</span>);
    };
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4 text-gray-800"><i className="fa fa-heartbeat text-red-500 mr-2"></i>Kesehatan Sistem</h2>
            <div className="border-b border-gray-200 mb-4"></div>
            <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center"><span className="text-gray-600">Database</span><StatusIndicator status={healthData.database} okText="Connected" /></li>
                {/* <li className="flex justify-between items-center"><span className="text-gray-600">Pekerjaan Antrean</span><StatusIndicator status={healthData.queue_size} /></li>
                <li className="flex justify-between items-center"><span className="text-gray-600">Pekerjaan Gagal</span><StatusIndicator status={healthData.failed_jobs} errorText={healthData.failed_jobs > 0 ? `${healthData.failed_jobs} Gagal` : 'OK'} /></li> */}
                {/* // <-- TAMBAHAN BARU (1) --> */}
                <li className="flex justify-between items-center">
                    <span className="text-gray-600">Tabel</span>
                    <span className="font-bold text-gray-800">{healthData.table_count}</span>
                </li>                

                {/* // <-- TAMBAHAN BARU (2) --> */}
                <li className="flex justify-between items-center">
                    <span className="text-gray-600">Total Data</span>
                    <span className="font-bold text-gray-800">
                        {/* Ini memformat angka besar seperti 1000000 menjadi 1.000.000 */}
                        {healthData.total_rows !== 'N/A'
                            ? healthData.total_rows.toLocaleString('id-ID')
                            : 'N/A'}
                    </span>
                </li>  

                <li className="flex justify-between items-center">
                    <span className="text-gray-600">Data Masuk Hari Ini</span>
                    <span className="font-bold text-gray-800">
                        {healthData.today_rows !== 'N/A'
                            ? healthData.today_rows.toLocaleString('id-ID')
                            : 'N/A'}
                    </span>
                </li>             

                <li className="flex flex-col pt-2">
                    <div className="flex justify-between items-center mb-1"><span className="text-gray-600">Penggunaan Disk</span><span className="font-medium text-gray-800">{healthData.disk.used_percentage}% dari {healthData.disk.total}</span></div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${healthData.disk.used_percentage > 85 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${healthData.disk.used_percentage}%` }}></div></div>
                </li>
                <li className="pt-3 border-t mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>Env: <span className="font-semibold">{healthData.environment.app_env}</span></span>
                    <span>PHP: <span className="font-semibold">{healthData.environment.php_version}</span></span>
                    <span>Laravel: <span className="font-semibold">{healthData.environment.laravel_version}</span></span>
                </li>
            </ul>
        </div>
    );
};

// --- HALAMAN UTAMA DASHBOARD ADMIN (DENGAN LOGIKA LAYOUT BARU) ---
export default function IndexAdmin() {
    const { auth, jadwalPerDosen, usersOnline, systemHealth } = usePage().props;

    // 1. Cek semua permission yang relevan di awal
    // Ganti nama permission ini sesuai dengan yang ada di sistem Anda
    const canViewSystemHealth = hasAnyPermission(['view-system-health']);
    const canViewOnlineUsers = hasAnyPermission(['view-online-users']);

    // 2. Buat variabel boolean untuk menentukan apakah sidebar harus ditampilkan
    const showSidebar = canViewSystemHealth || canViewOnlineUsers;

    return (
        <MyLayout>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div className="text-2xl font-semibold text-gray-800">{greeting(auth.user.name)}</div>

                {/* 3. Gunakan `showSidebar` untuk mengatur grid secara dinamis */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Kolom Utama (Jadwal Dosen) */}
                    <div className={showSidebar ? "lg:col-span-2" : "lg:col-span-3"}>
                        <div className="lg:sticky lg:top-0">
                            <JadwalDosenWidget jadwalPerDosen={jadwalPerDosen} />
                        </div>
                    </div>

                    {/* Kolom Samping (Sidebar) */}
                    {/* Hanya render sidebar jika ada setidaknya satu widget yang boleh ditampilkan */}
                    {showSidebar && (
                        <div className="flex flex-col gap-6">
                            {/* Tampilkan widget Kesehatan Sistem jika punya izin */}
                            {canViewSystemHealth && <SystemHealthWidget healthData={systemHealth} />}

                            {/* Tampilkan widget Pengguna Aktif jika punya izin */}
                            {canViewOnlineUsers && <UsersOnlineWidget usersOnline={usersOnline} />}
                        </div>
                    )}
                </div>
            </div>
        </MyLayout>
    );
}