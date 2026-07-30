import React, { useState, useEffect, useCallback } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import { createWatermarkPlugin } from '../../../../Utilities/createWatermarkPlugin ';
import hasAnyPermission from '../../../../Utilities/Permissions';
import FilterControlsIbadah from './FilterControlsIbadah';
// import OverallSklStats from '../Skl/OverallSklStats.jsx'; // Tidak terpakai
import OverallIbadahStats from './OverallIbadahStats.jsx';
import LaporanDatesModal from './LaporanDatesModal.jsx';
import ScoreRecapTable from './ScoreRecapTable.jsx';

// Registrasi ChartJS (Sama)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend, ChartDataLabels);

// Watermark (Sama)
const customWatermark = createWatermarkPlugin({
    text: 'www.febryann.my.id',
    rotate: -90, 
    position: 'right-center',
    fontRatio: 40,
});

// Komponen Utama Halaman Grafik
export default function Index() {
    // Props dari controller (Sama)
    const { kategoriList, angkatans } = usePage().props;

    // State (Sama)
    const [chartData, setChartData] = useState(null);
    const [studentRecap, setStudentRecap] = useState(null);
    const [overallStats, setOverallStats] = useState(null);
    const [dateRange, setDateRange] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- STATE DIPERBARUI ---
    const [hasFemale, setHasFemale] = useState(false);
    // const [standardPoin, setStandardPoin] = useState(0); // Dihapus karena tidak perlu
    // --- AKHIR STATE ---

    // --- State dan handler untuk Modal ---
    const [modalState, setModalState] = useState({ isOpen: false, title: '', data: null });
    
    const handleOpenModal = (namaMahasiswa, data) => {
        setModalState({ 
            isOpen: true, 
            title: `Daftar Laporan: ${namaMahasiswa}`, 
            data: data // data adalah string dates_and_uuids
        });
    };
    const handleCloseModal = () => setModalState({ isOpen: false, title: '', data: null });
    // --- AKHIR BARU ---

    const handleFetchRequest = useCallback((params) => {
        setIsLoading(true);
        setChartData(null);
        setStudentRecap(null);
        setOverallStats(null);
        setHasFemale(false); // Reset
        
        axios.get(route('my.grafik.laporan_ibadah.ibadah_score_data'), { params })
            .then(response => {
                setChartData(response.data.chartData);
                setStudentRecap(response.data.studentRecap);
                setOverallStats(response.data.overallStats);
                setDateRange(response.data.dateRange);
                setHasFemale(response.data.hasFemaleStudents); // Simpan status 'hasFemale'
            })
            .catch(error => console.error("Gagal mengambil data:", error))
            .finally(() => setIsLoading(false));
    }, []);

    // ... (chartOptions dan shouldHideWatermark tidak berubah) ...
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { usePointStyle: true, boxWidth: 8, padding: 20 }
            },
            title: {
                display: true,
                text: `GRAFIK TOTAL POIN IBADAH PER MAHASISWA`,
                font: { size: 18 }
            },
            subtitle: {
                display: !!dateRange,
                text: `(${dateRange})`,
                font: { size: 14, weight: 'normal' },
                color: '#6b7280',
                padding: { bottom: 20 }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                display: true, color: 'black', font: { weight: 'bold' },
                formatter: (value) => {
                    if (value > 0) {
                        return value;
                    }
                    return null;
                },
                anchor: 'center', align: 'center', offset: 5
            }
        },
        scales: {
            x: { 
                grid: { display: false }, 
                ticks: { 
                    display: true,
                    autoSkip: false, 
                    maxRotation: 90, 
                    minRotation: 45 
                } 
            },
            y: {
                beginAtZero: true,
                grid: { color: '#e5e7eb' },
                ticks: {
                    callback: function (value) {
                        return value;
                    }
                }
            },
        },
    };

    const shouldHideWatermark = hasAnyPermission(['grafik.watermark']);

    return (
        <MyLayout>
            <Head title="Grafik Laporan Ibadah" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800">Grafik Poin Ibadah per Mahasiswa</h1>

                {/* Filter */}
                <FilterControlsIbadah
                    kategoriList={kategoriList}
                    angkatans={angkatans}
                    onFilterChange={handleFetchRequest}
                    isLoading={isLoading}
                    getClassesRoute="my.grafik.laporan_ibadah.getClasses"
                />

                {/* Overall Stats */}
                {overallStats && (
                    <OverallIbadahStats data={overallStats} title='STATISTIK POIN KESELURUHAN' />
                )}

                {/* Tampilan Chart dan Kucing */}
                <div className="bg-white p-6 rounded-xl shadow-lg relative" style={{ minHeight: '500px' }}>
                    {isLoading && <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10"><i className="fas fa-spinner fa-spin fa-3x text-blue-500"></i></div>}
                    {!chartData && !isLoading &&
                        <div className="absolute inset-0 flex justify-center items-center text-center">
                            <div className="flex items-center space-x-6">
                                <div className="relative w-32 h-32 overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-white z-10"></div>
                                    <img
                                        src="/images/wait-cat.webp"
                                        alt="Kucing mengintip"
                                        className="absolute left-0 top-0 w-full h-full object-contain transform -translate-x-3"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg text-gray-700">Kucingnya Nunggu Kamu Nih 🐾</p>
                                    <p className="text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
                                        Pilih dulu filternya di atas, terus klik{" "}
                                        <span className="font-semibold text-blue-600">"Tampilkan Grafik"</span> ya~
                                        Kucing siap munculin datanya buat kamu!
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                    {chartData && chartData.labels.length === 0 && !isLoading && <div className="absolute inset-0 flex justify-center items-center"><p className="text-gray-500">Tidak ada data laporan ibadah yang ditemukan.</p></div>}
                    
                    {/* Render Chart */}
                    {chartData && chartData.labels.length > 0 && 
                        <div style={{ height: '500px' }}> 
                            <Bar 
                                options={chartOptions} 
                                data={chartData} 
                                plugins={shouldHideWatermark ? [] : [customWatermark]}
                            />
                        </div>
                    }
                </div>

                {/* Tabel Rekap */}
                {studentRecap && (
                    <ScoreRecapTable
                        recapData={studentRecap}
                        isLoading={isLoading}
                        onOpenModal={handleOpenModal}
                        hasFemale={hasFemale} // <-- Prop 'hasFemale'
                        // 'standardPoin' tidak lagi diperlukan
                    />
                )}
            </div>

            {/* Render Modal */}
            <LaporanDatesModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                title={modalState.title}
                data={modalState.data}
            />
        </MyLayout>
    );
}