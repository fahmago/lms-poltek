import React, { useState, useEffect, useCallback } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import AttendanceDatesModal from './Komponen/AttendanceDatesModal';
import StudentRecapTable from './Komponen/StudentRecapTable';
import FilterControls2 from './Komponen/FilterControls2';
import OverallAttendanceStats from './Komponen/OverallAttendanceStats';
import { createWatermarkPlugin } from '../../../../Utilities/createWatermarkPlugin ';
import hasAnyPermission from '../../../../Utilities/Permissions';
import OverallSklStats from '../Skl/OverallSklStats';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend, ChartDataLabels);

const customWatermark = createWatermarkPlugin({
    // text: 'lms.politeknikidn.id',
    text: 'www.febryann.my.id',
    rotate: -90, // untuk teks vertikal
    position: 'right-center', // di pinggir kanan tengah
    fontRatio: 40,
});

// Komponen Utama Halaman Grafik
export default function Index() {
    // ✅ PERUBAHAN: Ganti 'prodis' menjadi 'kategoriList'
    const { kategoriList, angkatans } = usePage().props;

    const [chartData, setChartData] = useState(null);
    const [studentRecap, setStudentRecap] = useState(null);
    const [overallStats, setOverallStats] = useState(null);
    const [dateRange, setDateRange] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State dan handler untuk Modal
    const [modalState, setModalState] = useState({ isOpen: false, title: '', dates: null });
    const handleOpenModal = (title, datesString) => setModalState({ isOpen: true, title, dates: datesString });
    const handleCloseModal = () => setModalState({ isOpen: false, title: '', dates: null });

    const handleFetchRequest = useCallback((params) => {
        setIsLoading(true);
        setChartData(null);
        setStudentRecap(null);
        setOverallStats(null);
        axios.get(route('my.grafik.kelas_harian.attendance_data'), { params })
            .then(response => {
                setChartData(response.data.chartData);
                setStudentRecap(response.data.studentRecap);
                setOverallStats(response.data.overallStats);
                setDateRange(response.data.dateRange);
            })
            .catch(error => console.error("Gagal mengambil data:", error))
            .finally(() => setIsLoading(false));
    }, []);

    // ... (chartOptions tetap sama) ...
    // const chartOptions = {
    //     responsive: true, maintainAspectRatio: false,
    //     plugins: {
    //         legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } },
    //         title: { display: true, text: `Perbandingan Kehadiran Antar Kelas`, font: { size: 18 } },
    //         subtitle: {
    //             display: !!dateRange,
    //             text: `(${dateRange})`,
    //             font: { size: 14, weight: 'normal' },
    //             color: '#6b7280',
    //             padding: { bottom: 20 }
    //         },
    //         datalabels: {
    //             display: true, color: 'black', font: { weight: 'bold' },
    //             formatter: (value) => (value > 0 ? value : null),
    //             anchor: 'center', align: 'center', offset: 5
    //         }
    //     },
    //     scales: {
    //         x: { grid: { display: false }, ticks: { display: true } },
    //         y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
    //     },
    // };
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
                // UBAH: Judul diubah
                text: `PERSENTASE KEHADIRAN ANTAR KELAS`,
                font: { size: 18 }
            },
            subtitle: {
                display: !!dateRange,
                text: `(${dateRange})`,
                font: { size: 14, weight: 'normal' },
                color: '#6b7280',
                padding: { bottom: 20 }
            },
            // BARU: Tambahkan konfigurasi Tooltip
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            // Tampilkan 1 angka desimal dan tanda %
                            label += parseFloat(context.parsed.y.toFixed(1)) + '%';
                        }
                        return label;
                    }
                }
            },
            datalabels: {
                display: true, color: 'black', font: { weight: 'bold' },
                // UBAH: Formatter untuk menampilkan desimal dan %
                formatter: (value) => {
                    if (value > 0) {
                        // Tampilkan 1 angka desimal
                        return parseFloat(value.toFixed(1)) + '%';
                    }
                    return null; // Sembunyikan jika 0
                    _
                },
                anchor: 'center', align: 'center', offset: 5
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { display: true } },
            // UBAH: Konfigurasi sumbu Y
            y: {
                beginAtZero: true,
                grid: { color: '#e5e7eb' },
                // BARU: Batasi sumbu Y maksimal di 100%
                max: 100,
                // BARU: Tambahkan '%' pada label sumbu Y
                ticks: {
                    callback: function (value) {
                        return value + '%';
                    }
                }
            },
        },
    };

    const shouldHideWatermark = hasAnyPermission(['grafik.watermark']);

    return (
        <MyLayout>
            <Head title="Grafik per Kelas Harian" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800">Grafik Perbandingan Kehadiran Antar Kelas</h1>

                <FilterControls2
                    kategoriList={kategoriList}
                    angkatans={angkatans}
                    onFilterChange={handleFetchRequest}
                    isLoading={isLoading}
                />

                {overallStats && (
                    // <OverallAttendanceStats data={overallStats} />
                    <OverallSklStats data={overallStats} title='STATISTIK KEHADIRAN KESELURUHAN' />
                )}

                <div className="bg-white p-6 rounded-xl shadow-lg relative" style={{ height: '500px' }}>
                    {/* ... (Tampilan loading dan capibara tetap sama) ... */}
                    {isLoading && <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10"><i className="fas fa-spinner fa-spin fa-3x text-blue-500"></i></div>}
                    {!chartData && !isLoading &&
                        <div className="absolute inset-0 flex justify-center items-center text-center">
                            <div className="flex items-center space-x-6">
                                {/* Gambar Kucing Mengintip */}
                                <div className="relative w-32 h-32 overflow-hidden">
                                    {/* “Tembok” di kiri */}
                                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-white z-10"></div>
                                    <img
                                        src="/images/wait-cat.webp"
                                        alt="Kucing mengintip"
                                        className="absolute left-0 top-0 w-full h-full object-contain transform -translate-x-3"
                                    />
                                </div>

                                {/* Teks di sebelah kanan */}
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
                    {chartData && chartData.labels.length === 0 && !isLoading && <div className="absolute inset-0 flex justify-center items-center"><p className="text-gray-500">Tidak ada data kelas harian yang ditemukan.</p></div>}
                    {chartData && chartData.labels.length > 0 && <Bar options={chartOptions} data={chartData} plugins={
                        shouldHideWatermark
                            ? []
                            : [customWatermark]
                    } />}
                </div>

                {/* Tampilkan tabel rekap mahasiswa jika datanya ada */}
                {studentRecap && (
                    <StudentRecapTable
                        recapData={studentRecap}
                        isLoading={isLoading}
                        onOpenModal={handleOpenModal}
                    />
                )}
            </div>

            {/* Render Modal */}
            <AttendanceDatesModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                title={modalState.title}
                dates={modalState.dates}
            />
        </MyLayout>
    );
}