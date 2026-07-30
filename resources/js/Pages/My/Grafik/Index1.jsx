import React, { useState, useEffect, useRef } from 'react';
import MyLayout from '../../../Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

// --- KOMPONEN-KOMPONEN WIDGET ---

// MODAL UNTUK MENAMPILKAN DETAIL TANGGAL
const AttendanceDatesModal = ({ isOpen, onClose, title, dates }) => {
    if (!isOpen) return null;

    // Ubah string tanggal menjadi array objek { date, className }
    const dateList = dates ? dates.split('|').map(item => {
        const [date, className] = item.split(':');
        return { date, className };
    }) : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                    {dateList.length > 0 ? (
                        <div className="border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kelas</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {dateList.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-800 font-mono">{item.date}</td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-600">{item.className}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-500 text-center">Tidak ada data tanggal.</p>}
                </div>
                <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300">Tutup</button>
                </div>
            </div>
        </div>
    );
};

// PANEL KONTROL FILTER
const FilterControls = ({ prodis, onFilterChange }) => {
    const [activeProdi, setActiveProdi] = useState(null);
    const [activeRange, setActiveRange] = useState(7);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [gender, setGender] = useState('');

    useEffect(() => {
        let params = { prodi: activeProdi, gender: gender };
        if (activeRange === 'custom') {
            if (startDate && endDate && new Date(startDate) <= new Date(endDate)) {
                params.start_date = startDate;
                params.end_date = endDate;
                onFilterChange(params);
            }
        } else {
            params.range = activeRange;
            onFilterChange(params);
        }
    }, [activeProdi, activeRange, startDate, endDate, gender]);

    const abbreviateProdi = (fullName) => {
        const abbreviations = {
            'Teknologi Rekayasa Perangkat Lunak': 'TRPL',
            'Teknologi Rekayasa Komputer Jaringan': 'TRKJ',
            'Teknologi Rekayasa Multimedia Grafis': 'TRMG',
        };
        return abbreviations[fullName] || fullName;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Program Studi</h3>
                <nav className="flex space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
                    <button onClick={() => setActiveProdi(null)} className={`${activeProdi === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap`}>Semua Prodi</button>
                    {prodis.map((prodi) => (
                        <button 
                            key={prodi.id} 
                            onClick={() => setActiveProdi(prodi.kode_prodi)} 
                            className={`${activeProdi === prodi.kode_prodi ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap`}
                            title={prodi.nama_prodi}
                        >
                            {abbreviateProdi(prodi.nama_prodi)}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500">Rentang Waktu</h3>
                    <div className="flex flex-wrap items-center gap-2">
                        {[7, 30, 90].map((range) => (<button key={range} onClick={() => setActiveRange(range)} className={`px-3 py-1.5 text-sm rounded-full ${activeRange === range ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{range} Hari</button>))}
                        <button onClick={() => setActiveRange('custom')} className={`px-3 py-1.5 text-sm rounded-full ${activeRange === 'custom' ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Kustom</button>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500">Gender</h3>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                        <button onClick={() => setGender('')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${gender === '' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-users mr-2"></i>Semua</button>
                        <button onClick={() => setGender('L')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${gender === 'L' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-male mr-2"></i>Pria</button>
                        <button onClick={() => setGender('P')} className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${gender === 'P' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}><i className="fas fa-female mr-2"></i>Wanita</button>
                    </div>
                </div>
                {activeRange === 'custom' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3 transition-all">
                        <h3 className="text-sm font-semibold text-blue-800">Tentukan Periode</h3>
                        <div className="space-y-2">
                            <div><label htmlFor="start-date" className="text-xs font-medium text-gray-600">Tanggal Mulai</label><input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm text-sm mt-1" /></div>
                            <div><label htmlFor="end-date" className="text-xs font-medium text-gray-600">Tanggal Selesai</label><input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm text-sm mt-1" /></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// TABEL REKAP MAHASISWA
const StudentRecapTable = ({ recapData, isLoading, onOpenModal }) => {
    if (isLoading) {
        return ( <div className="bg-white p-6 rounded-xl shadow-lg"><div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6 animate-pulse"></div><div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-md w-full animate-pulse"></div>)}</div></div> );
    }
    if (!recapData || recapData.length === 0) {
        return ( <div className="bg-white p-6 rounded-xl shadow-lg text-center py-16"><svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><h3 className="mt-2 text-sm font-medium text-gray-900">Tidak Ada Data</h3><p className="mt-1 text-sm text-gray-500">Tidak ada mahasiswa yang absen pada periode ini.</p></div> );
    }

    const abbreviateProdi = (fullName) => {
        const abbreviations = { 'Teknologi Rekayasa Perangkat Lunak': 'TRPL', 'Teknologi Rekayasa Komputer Jaringan': 'TRKJ', 'Teknologi Rekayasa Multimedia Grafis': 'TRMG' };
        return abbreviations[fullName] || fullName;
    };

    const AbsensiCell = ({ count, onClick, colorClass }) => {
        if (count === 0) return <span className="text-gray-400">-</span>;
        return ( <button onClick={onClick} className="flex flex-col items-center w-full transition-transform transform hover:scale-110" title="Klik untuk lihat detail"><span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass.bg} ${colorClass.text}`}>{count} kali</span></button> );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Rekapitulasi Ketidakhadiran Mahasiswa (Top 70)</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">No</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">NIM</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama Mahasiswa</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Prodi</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-orange-600 uppercase tracking-wider">Sakit</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-blue-600 uppercase tracking-wider">Izin</th>
                            <th className="px-6 py-3 text-center text-xs font-semibold text-red-600 uppercase tracking-wider">Alpha</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recapData.map((mhs, index) => (
                            <tr key={mhs.nim || index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500 text-center">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono text-center">{mhs.nim || '-'}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{mhs.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 text-center"><span title={mhs.nama_prodi}>{abbreviateProdi(mhs.nama_prodi)}</span></td>
                                <td className="px-6 py-4 text-center text-sm"><AbsensiCell count={mhs.total_sakit} colorClass={{ bg: 'bg-orange-100', text: 'text-orange-800' }} onClick={() => onOpenModal(`Tanggal Sakit - ${mhs.name}`, mhs.dates_sakit)} /></td>
                                <td className="px-6 py-4 text-center text-sm"><AbsensiCell count={mhs.total_izin} colorClass={{ bg: 'bg-blue-100', text: 'text-blue-800' }} onClick={() => onOpenModal(`Tanggal Izin - ${mhs.name}`, mhs.dates_izin)} /></td>
                                <td className="px-6 py-4 text-center text-sm"><AbsensiCell count={mhs.total_alpha} colorClass={{ bg: 'bg-red-100', text: 'text-red-800' }} onClick={() => onOpenModal(`Tanggal Alpha - ${mhs.name}`, mhs.dates_alpha)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- HALAMAN UTAMA ---
export default function Index() {
    const { prodis, initialChartData, initialStudentRecap } = usePage().props;
    const [chartData, setChartData] = useState(initialChartData);
    const [studentRecap, setStudentRecap] = useState(initialStudentRecap);
    const [isLoading, setIsLoading] = useState(false);
    const [currentFilters, setCurrentFilters] = useState({ prodi: null, gender: '', range: 7 });
    const filterRef = useRef(JSON.stringify(currentFilters));

    // State dan handler untuk Modal
    const [modalState, setModalState] = useState({ isOpen: false, title: '', dates: null });
    const handleOpenModal = (title, datesString) => setModalState({ isOpen: true, title, dates: datesString });
    const handleCloseModal = () => setModalState({ isOpen: false, title: '', dates: null });

    const handleFilterChange = (newFilters) => {
        if (JSON.stringify(newFilters) !== filterRef.current) {
            filterRef.current = JSON.stringify(newFilters);
            setCurrentFilters(newFilters);
        }
    };

    useEffect(() => {
        const fetchNewData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(route('my.grafik.attendance_data'), { params: currentFilters });
                setChartData(response.data.chartData);
                setStudentRecap(response.data.studentRecap);
            } catch (error) {
                console.error("Gagal mengambil data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (filterRef.current !== JSON.stringify({ prodi: null, gender: '', range: 7 })) {
            fetchNewData();
        }
    }, [currentFilters]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } },
            title: { display: true, text: `Rekapitulasi Kehadiran`, font: { size: 18 }, padding: { top: 10, bottom: 20 } },
            datalabels: {
                display: true,
                color: 'black',
                font: {
                    weight: 'bold',
                    size: 24,
                },
                formatter: (value) => {
                    return value > 0 ? value : null; // Sembunyikan jika nilainya 0
                },
                anchor: 'center', // Posisikan di tengah batang
                align: 'center',
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { display: false } },
            y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
        },
    };

    return (
        <MyLayout>
            <Head title="Grafik Kehadiran Mahasiswa" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800">Grafik Kehadiran Mahasiswa</h1>
                <FilterControls prodis={prodis} onFilterChange={handleFilterChange} />
                <div className="bg-white p-6 rounded-xl shadow-lg relative" style={{ height: '500px' }}>
                    {isLoading && <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10"><i className="fas fa-spinner fa-spin fa-3x text-blue-500"></i></div>}
                    <Bar options={chartOptions} data={chartData} />
                </div>
                <StudentRecapTable recapData={studentRecap} isLoading={isLoading} onOpenModal={handleOpenModal} />
            </div>
            <AttendanceDatesModal isOpen={modalState.isOpen} onClose={handleCloseModal} title={modalState.title} dates={modalState.dates} />
        </MyLayout>
    );
}