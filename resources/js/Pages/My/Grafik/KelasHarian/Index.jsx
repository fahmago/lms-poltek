import React, { useState, useEffect, useCallback } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import { Head, usePage } from '@inertiajs/inertia-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import FilterControls from './Komponen/FilterControls';
import AttendanceDatesModal from './Komponen/AttendanceDatesModal';
import StudentRecapTable from './Komponen/StudentRecapTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend, ChartDataLabels);

// Komponen Utama Halaman Grafik
export default function Index() {
    const { prodis, angkatans } = usePage().props;

    const [chartData, setChartData] = useState(null);
    const [studentRecap, setStudentRecap] = useState(null); // State baru
    const [dateRange, setDateRange] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State dan handler untuk Modal
    const [modalState, setModalState] = useState({ isOpen: false, title: '', dates: null });
    const handleOpenModal = (title, datesString) => setModalState({ isOpen: true, title, dates: datesString });
    const handleCloseModal = () => setModalState({ isOpen: false, title: '', dates: null });

    const handleFetchRequest = useCallback((params) => {
        setIsLoading(true);
        setChartData(null); // Kosongkan data sebelumnya
        setStudentRecap(null);
        axios.get(route('my.grafik.kelas_harian.attendance_data'), { params })
            .then(response => {
                setChartData(response.data.chartData);
                setStudentRecap(response.data.studentRecap); // Simpan data rekap
                setDateRange(response.data.dateRange);
            })
            .catch(error => console.error("Gagal mengambil data:", error))
            .finally(() => setIsLoading(false));
    }, []);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } },
            title: { display: true, text: `Perbandingan Kehadiran Antar Kelas`, font: { size: 18 } },
            subtitle: {
                display: !!dateRange,
                text: `(${dateRange})`,
                font: { size: 14, weight: 'normal' },
                color: '#6b7280',
                padding: { bottom: 20 }
            },
            datalabels: {
                display: true, color: 'black', font: { weight: 'bold' },
                formatter: (value) => (value > 0 ? value : null),
                anchor: 'center', align: 'center', offset: 5
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { display: true } },
            y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
        },
    };

    return (
        <MyLayout>
            <Head title="Grafik per Kelas Harian" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800">Grafik Perbandingan Kehadiran Antar Kelas</h1>
                <FilterControls
                    prodis={prodis}
                    angkatans={angkatans}
                    onFilterChange={handleFetchRequest}
                    isLoading={isLoading}
                />

                <div className="bg-white p-6 rounded-xl shadow-lg relative" style={{ height: '500px' }}>
                    {isLoading && <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10"><i className="fas fa-spinner fa-spin fa-3x text-blue-500"></i></div>}
                    {!chartData && !isLoading &&
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                            <img
                                src={`/images/capibara.png`}
                                alt="Capibara siap bantu"
                                className="w-48 h-auto mb-4 opacity-90"
                            />
                            <p className="font-bold text-lg text-gray-700">Capibara Masih Santai Nih</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Pilih dulu filternya di atas, terus klik <span className="font-semibold text-blue-600">"Tampilkan Grafik"</span> ya~
                                Capibara siap munculin datanya buat kamu!
                            </p>
                        </div>
                    }
                    {chartData && chartData.labels.length === 0 && !isLoading && <div className="absolute inset-0 flex justify-center items-center"><p className="text-gray-500">Tidak ada data kelas harian yang ditemukan.</p></div>}
                    {chartData && chartData.labels.length > 0 && <Bar options={chartOptions} data={chartData} />}
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