import React, { useState, useCallback } from 'react';
import MyLayout from '../../../../Layouts/MyLayout'; // Sesuaikan path jika perlu
import { Head, usePage } from '@inertiajs/inertia-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Ticks } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import FilterControlsSkl from './FilterControlsSkl'; // Filter BARU
import OverallSklStats from './OverallSklStats'; // Komponen Rekap BARU
import { createWatermarkPlugin } from '../../../../Utilities/createWatermarkPlugin ';
import hasAnyPermission from '../../../../Utilities/Permissions';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const customWatermark = createWatermarkPlugin({
    text: 'www.febryann.my.id',
    rotate: -90,
    position: 'right-center',
    fontRatio: 40,
});

export default function Index() {
    const { kategoriList, angkatans } = usePage().props;

    const [chartData, setChartData] = useState(null);
    const [overallData, setOverallData] = useState(null); // State baru untuk rekap
    const [isLoading, setIsLoading] = useState(false);

    // Fungsi fetch data baru
    const handleFetchRequest = useCallback((params) => {
        setIsLoading(true);
        setChartData(null);
        setOverallData(null); // Kosongkan rekap

        axios.get(route('my.grafik.skl.skl_data'), { params }) // Panggil route baru
            .then(response => {
                setChartData(response.data.chartData);
                setOverallData(response.data.overallData); // Simpan data rekap
            })
            .catch(error => console.error("Gagal mengambil data SKL:", error))
            .finally(() => setIsLoading(false));
    }, []);

    // Opsi Chart disesuaikan untuk Persentase
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } },
            title: { display: true, text: `PERSENTASE PENYELESAIAN SKL PER KELAS`, font: { size: 18 }, padding: { top: 10, bottom: 30 } },
            datalabels: {
                display: true, color: 'black', font: { weight: 'bold' },
                formatter: (value) => (value > 0 ? `${value}%` : null), // Tambah simbol %
                anchor: 'center', align: 'center',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y + '%'; // Tambah simbol % di tooltip
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { display: true } },
            y: {
                beginAtZero: true,
                max: 100, // Skala Y maks 100%
                grid: { color: '#e5e7eb' },
                title: { display: true, text: 'PERSENTASE PENYELESAIAN (%)' }
            },
        },
    };

    const shouldHideWatermark = hasAnyPermission(['grafik.watermark']);

    return (
        <MyLayout>
            <Head title="Grafik SKL per Kelas" />
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-800">Grafik Persentase Penyelesaian SKL</h1>

                {/* Gunakan Komponen Filter BARU (tanpa tanggal) */}
                <FilterControlsSkl
                    kategoriList={kategoriList}
                    angkatans={angkatans}
                    onFilterChange={handleFetchRequest}
                    isLoading={isLoading}
                />

                {/* Tampilkan Komponen Rekap BARU jika ada data */}
                {overallData && !isLoading && (
                    <OverallSklStats data={overallData} />
                )}

                <div className="bg-white p-6 rounded-xl shadow-lg relative" style={{ height: '500px' }}>
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
                            ? [] // Sembunyikan watermark jika user punya izin
                            : [customWatermark] // Tampilkan jika tidak punya izin
                    } />}
                </div>

                {/* Tidak ada lagi StudentRecapTable dan Modal */}
            </div>
        </MyLayout>
    );
}