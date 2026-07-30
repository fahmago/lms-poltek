import React, { useState, useEffect } from 'react';
import MyLayout from '@/Layouts/MyLayout';
import { Head, usePage, Link } from '@inertiajs/inertia-react';
import axios from 'axios';

// Helper untuk format deadline dinamis (Reusable)
const formatDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffTime < 0) return { text: "Telah berakhir", color: "text-red-600" };
    if (diffDays <= 1) return diffHours > 1 ? { text: `Berakhir dalam ${diffHours} jam`, color: "text-orange-600" } : { text: "Berakhir hari ini", color: "text-red-600" };
    if (diffDays <= 7) return { text: `Berakhir dalam ${diffDays} hari`, color: "text-yellow-600" };

    const formattedDate = deadlineDate.toLocaleString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace('.', ':');

    return { 
        text: `${formattedDate} WIB`,
        color: "text-gray-500" 
    };
};

// Komponen Badge Status (Reusable)
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

// HAPUS: Komponen TypeBadge (tidak relevan untuk project semester)

// --- GANTI NAMA KOMPONEN & PROP ---
const ProjectCard = ({ project }) => { // Ganti nama & prop
    const deadline = formatDeadline(project.batas_waktu);
    return (
        // GANTI: route 'mhs.tweek.show' -> 'mhs.tsem.show' & param
        <Link href={route('mhs.tsem.show', { projectSemester: project.uuid })} className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-blue-600">{project.nama_kelas}</p>
                        {/* HAPUS: TypeBadge dihapus */}
                    </div>
                    <StatusBadge status={project.status} />
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-900 leading-tight">{project.judul}</h3>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t">
                <div className="flex items-center gap-2 text-sm">
                    <i className={`far fa-calendar-alt ${deadline.color}`}></i>
                    <span className={`font-semibold ${deadline.color}`}>{deadline.text}</span>
                </div>
            </div>
        </Link>
    );
};

// Komponen Skeleton Loading untuk kartu (Reusable)
const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="flex justify-between items-start"><div className="h-4 bg-gray-200 rounded w-1/3"></div><div className="h-5 bg-gray-200 rounded-full w-24"></div></div>
        <div className="mt-3 h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="mt-6 border-t pt-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
    </div>
);

// Komponen Filter (Reusable)
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

// Paginasi Kustom untuk Axios (Reusable)
const AxiosPagination = ({ data, onPageChange, isLoading }) => {
    if (!data || data.last_page <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button onClick={() => onPageChange(data.current_page - 1)} disabled={!data.prev_page_url || isLoading} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">« Sebelumnya</button>
            <span className="text-sm text-gray-600">Halaman {data.current_page} dari {data.last_page}</span>
            <button onClick={() => onPageChange(data.current_page + 1)} disabled={!data.next_page_url || isLoading} className="px-4 py-2 text-sm bg-white border rounded-md disabled:opacity-50 disabled:cursor-not-allowed">Berikutnya »</button>
        </div>
    );
};

// Halaman Utama Daftar Project
export default function Index() {
    const { filters, statusCounts } = usePage().props;
    
    // GANTI: 'tugasData' -> 'projectData'
    const [projectData, setProjectData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(filters.status || 'Semua');

    // GANTI: 'fetchTugas' -> 'fetchProjects'
    const fetchProjects = (page = 1, status = '') => {
        setIsLoading(true);
        // GANTI: route 'mhs.tweek.index' -> 'mhs.tsem.index'
        axios.get(route('mhs.tsem.index'), {
            params: { page, status: status === 'Semua' ? '' : status },
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(response => {
            setProjectData(response.data); // GANTI VARIABEL
        })
        .catch(error => console.error("Gagal memuat data project:", error)) // GANTI TEKS
        .finally(() => setIsLoading(false));
    };

    // Efek untuk memuat data pertama kali
    useEffect(() => {
        fetchProjects(1, activeFilter); // GANTI FUNGSI
    }, []);

    // Handler untuk mengubah filter
    const handleFilterChange = (status) => {
        setActiveFilter(status);
        fetchProjects(1, status); // GANTI FUNGSI
    };

    // Handler untuk mengubah halaman
    const handlePageChange = (newPage) => {
        fetchProjects(newPage, activeFilter); // GANTI FUNGSI
    };

    // Konten yang akan ditampilkan
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            );
        }

        // GANTI: 'tugasData' -> 'projectData'
        if (projectData && projectData.data.length > 0) {
            return (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {/* GANTI: 'projectData' -> 'ProjectCard' */}
                        {projectData.data.map(project => <ProjectCard key={project.id} project={project} />)}
                    </div>
                    <AxiosPagination data={projectData} onPageChange={handlePageChange} isLoading={isLoading} />
                </>
            );
        }

        // GANTI: Teks pesan kosong
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow-md mt-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Yey, Semua Project Selesai!</h3>
                <p className="mt-1 text-sm text-gray-500">Tidak ada project yang sesuai dengan filter ini.</p>
            </div>
        );
    };

    return (
        <MyLayout>
            {/* GANTI: Head title */}
            <Head title="Daftar Project Semester" />
            <div className="space-y-6">
                <div className="mb-6">
                    {/* GANTI: Teks Header */}
                    <div className="text-2xl font-semibold text-gray-800">Project Semester Saya</div>
                    <p className="mt-1 text-gray-600">Daftar semua project yang perlu Anda kerjakan dan yang sudah selesai.</p>
                </div>

                <FilterTabs counts={statusCounts} activeFilter={activeFilter} onFilterChange={handleFilterChange} isLoading={isLoading} />

                {renderContent()}

            </div>
        </MyLayout>
    );
}