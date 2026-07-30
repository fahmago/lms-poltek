import React, { useState, useEffect } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import axios from 'axios';

// Helper untuk format deadline dinamis
const formatDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffTime < 0) return { text: "Telah berakhir", color: "text-red-600" };
    if (diffDays <= 1) return diffHours > 1 ? { text: `Berakhir dalam ${diffHours} jam`, color: "text-orange-600" } : { text: "Berakhir hari ini", color: "text-red-600" };
    if (diffDays <= 7) return { text: `Berakhir dalam ${diffDays} hari`, color: "text-yellow-600" };
    return { text: deadlineDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }), color: "text-gray-500" };
};

// Komponen Badge Status
const StatusBadge = ({ status }) => {
    const styles = {
        'Belum Dikerjakan': { style: 'bg-blue-100 text-blue-800', icon: 'far fa-hourglass' },
        'Sudah Dikumpulkan': { style: 'bg-teal-100 text-teal-800', icon: 'fa fa-check' },
        'Sudah Dinilai': { style: 'bg-green-100 text-green-800', icon: 'fa fa-check-double' },
        'Terlambat': { style: 'bg-red-100 text-red-800', icon: 'fa fa-exclamation-triangle' },
    };
    const { style, icon } = styles[status] || { style: 'bg-gray-100', icon: 'fa fa-question-circle' };
    return (<span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${style}`}><i className={`${icon} mr-1.5`}></i>{status}</span>);
};

// Komponen Kartu Tugas
const TugasCard = ({ tugas }) => {
    const deadline = formatDeadline(tugas.batas_waktu);
    return (
        <Link href={route('mhs.tweek.show', { tugasPekanan: tugas.uuid })} className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start"><p className="text-sm font-medium text-blue-600">{tugas.nama_kelas}</p><StatusBadge status={tugas.status} /></div>
                <h3 className="mt-2 text-lg font-bold text-gray-900 leading-tight">{tugas.judul}</h3>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t"><div className="flex items-center gap-2 text-sm"><i className={`far fa-calendar-alt ${deadline.color}`}></i><span className={`font-semibold ${deadline.color}`}>{deadline.text}</span></div></div>
        </Link>
    );
};

// Komponen Skeleton Loading untuk kartu
const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="flex justify-between items-start"><div className="h-4 bg-gray-200 rounded w-1/3"></div><div className="h-5 bg-gray-200 rounded-full w-24"></div></div>
        <div className="mt-3 h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="mt-6 border-t pt-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
    </div>
);

// Komponen Filter
const FilterTabs = ({ counts, activeFilter, onFilterChange, isLoading }) => {
    const filterOptions = ['Semua', 'Belum Dikerjakan', 'Selesai', 'Terlambat'];
    return (
        <div className="bg-white p-2 rounded-lg shadow-sm flex flex-wrap items-center gap-2">
            {filterOptions.map(option => (
                <button key={option} onClick={() => onFilterChange(option)} disabled={isLoading} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait ${activeFilter === option ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {option}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === option ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-700'}`}>{counts[option] || 0}</span>
                </button>
            ))}
        </div>
    );
};

// Paginasi Kustom untuk Axios
const AxiosPagination = ({ data, onPageChange, isLoading }) => {
    // Tampilkan hanya jika ada lebih dari satu halaman
    if (!data || data.last_page <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button onClick={() => onPageChange(data.current_page - 1)} disabled={!data.prev_page_url || isLoading} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">« Sebelumnya</button>
            <span className="text-sm text-gray-600">Halaman {data.current_page} dari {data.last_page}</span>
            <button onClick={() => onPageChange(data.current_page + 1)} disabled={!data.next_page_url || isLoading} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Berikutnya »</button>
        </div>
    );
};

// Halaman Utama Daftar Tugas
export default function Index() {
    const { filters, statusCounts } = usePage().props;
    
    // State untuk data utama
    const [tugasData, setTugasData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(filters.status || 'Semua');

    // Fungsi pusat untuk mengambil data dan memanipulasi history
    const fetchTugas = (page = 1, status = '') => {
        setIsLoading(true);
        
        const params = {
            page,
            status: status === 'Semua' ? '' : status,
        };

        axios.get(route('mhs.tweek.index'), {
            params,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => {
            setTugasData(response.data);

            // --- INI KUNCINYA ---
            // Buat URL baru dengan parameter yang benar
            const newUrl = route('mhs.tweek.index') + `?page=${page}&status=${params.status}`;
            
            // Ganti URL di browser tanpa me-refresh halaman
            window.history.pushState({ path: newUrl }, '', newUrl);
        })
        .catch(error => console.error("Gagal memuat data tugas:", error))
        .finally(() => setIsLoading(false));
    };

    // Efek untuk memuat data pertama kali (saat mount atau refresh)
    useEffect(() => {
        // Baca parameter dari URL saat ini
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get('page') || 1;
        const status = queryParams.get('status') || 'Semua';

        setActiveFilter(status);
        fetchTugas(page, status); // Muat data berdasarkan URL
    }, []); // Array dependensi kosong, hanya berjalan sekali

    // Handler untuk mengubah filter
    const handleFilterChange = (status) => {
        setActiveFilter(status);
        fetchTugas(1, status); // Selalu kembali ke halaman 1 saat filter berubah
    };

    // Handler untuk mengubah halaman
    const handlePageChange = (newPage) => {
        fetchTugas(newPage, activeFilter);
    };

    const renderContent = () => {
        if (isLoading) {
            return ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">{[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}</div> );
        }
        if (tugasData && tugasData.data.length > 0) {
            return (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">{tugasData.data.map(tugas => <TugasCard key={tugas.id} tugas={tugas} />)}</div>
                    <AxiosPagination data={tugasData} onPageChange={handlePageChange} isLoading={isLoading} />
                </>
            );
        }
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-md mt-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Yey, Semua Tugas Selesai!</h3>
                <p className="mt-1 text-sm text-gray-500">Tidak ada tugas yang sesuai dengan filter ini.</p>
            </div>
        );
    };

    return (
        <MyLayout>
            <Head title="Daftar Tugas Pekanan" />
            <div className="py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Tugas Pekanan Saya</h1>
                    <p className="mt-1 text-gray-600">Daftar semua tugas yang perlu Anda kerjakan dan yang sudah selesai.</p>
                </div>
                <FilterTabs counts={statusCounts} activeFilter={activeFilter} onFilterChange={handleFilterChange} isLoading={isLoading} />
                {renderContent()}
            </div>
        </MyLayout>
    );
}