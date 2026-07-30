import React, { useState, useEffect, useCallback } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import { createWatermarkPlugin } from '../../../../Utilities/createWatermarkPlugin ';
import hasAnyPermission from '../../../../Utilities/Permissions';
// Sesuaikan path ke komponen Anda
import FilterControlsIbadah from './FilterControlsIbadah';
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
    const { kategoriList, angkatans } = usePage().props;

    // State (Sama)
    const [chartData, setChartData] = useState(null);
    const [studentRecap, setStudentRecap] = useState(null);
    const [overallStats, setOverallStats] = useState(null);
    const [dateRange, setDateRange] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasFemale, setHasFemale] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // State dan handler untuk Modal (Sama)
    const [modalState, setModalState] = useState({ isOpen: false, title: '', data: null });
    const handleOpenModal = (namaMahasiswa, data) => {
        setModalState({
            isOpen: true,
            title: `Daftar Laporan: ${namaMahasiswa}`,
            data: data
        });
    };
    const handleCloseModal = () => setModalState({ isOpen: false, title: '', data: null });

    // Fetch Request (Diperbarui)
    const handleFetchRequest = useCallback((params) => {
        setIsLoading(true);
        setChartData(null);
        setStudentRecap(null);
        setOverallStats(null);
        setHasFemale(false);
        setStartDate(null);
        setEndDate(null);

        // --- ROUTE DIPERBARUI ---
        axios.get(route('my.grafik.laporan_ibadah.ibadah_score_data'), { params })
            .then(response => {
                setChartData(response.data.chartData);
                setStudentRecap(response.data.studentRecap);
                setOverallStats(response.data.overallStats);
                setDateRange(response.data.dateRange);
                setHasFemale(response.data.hasFemaleStudents);
                setStartDate(response.data.startDate);
                setEndDate(response.data.endDate);
            })
            .catch(error => console.error("Gagal mengambil data:", error))
            .finally(() => setIsLoading(false));
    }, []);

    // Opsi Chart (Diperbarui untuk Persentase)
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
                text: `GRAFIK PERSENTASE POIN IBADAH PER MAHASISWA`, // <-- Judul Diubah
                font: { size: 18 }
            },
            subtitle: {
                display: !!dateRange,
                text: `(${dateRange})`,
                font: { size: 14, weight: 'normal' },
                color: '#6b7280',
                padding: { bottom: 25 }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += parseFloat(context.parsed.y.toFixed(1)) + '%'; // <-- Tambah %
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                display: true, color: 'black', font: { weight: 'bold' },
                formatter: (value) => {
                    if (value > 0) {
                        return parseFloat(value.toFixed(1)) + '%'; // <-- Tambah %
                    }
                    return null;
                },
                anchor: 'end', // Di atas bar
                align: 'end',
                offset: -5,
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
                max: 100, // <-- BATASI MAKSIMAL 100%
                grid: { color: '#e5e7eb' },
                ticks: {
                    callback: function (value) {
                        return value + '%'; // <-- Tambah % di sumbu Y
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
                    // --- ROUTE BARU ---
                    // Gunakan route 'getClasses' dari controller SEBELUMNYA
                    getClassesRoute="my.grafik.kelas_harian.getClasses"
                />

                {/* Overall Stats */}
                {overallStats && (
                    <OverallIbadahStats data={overallStats} title='STATISTIK POIN KESELURUHAN' />
                )}

                {/* Tampilan Chart dan Kucing */}
                <div className="bg-white p-6 rounded-xl shadow-lg relative" style={{ minHeight: '500px' }}>
                    {isLoading && <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10"><i className="fas fa-spinner fa-spin fa-3x text-blue-500"></i></div>}
                    {!chartData && !isLoading &&
                        // ... (Kode Kucing Nunggu, sama seperti Anda) ...
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
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                    {chartData && chartData.labels.length === 0 && !isLoading && <div className="absolute inset-0 flex justify-center items-center"><p className="text-gray-500">Tidak ada data laporan ibadah ditemukan.</p></div>}

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
                        hasFemale={hasFemale}
                        startDate={startDate}
                        endDate={endDate}
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