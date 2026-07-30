import React, { useState, useCallback, useEffect } from 'react';
import MyLayout from '../../../../Layouts/MyLayout'; 
import { Head, usePage } from '@inertiajs/inertia-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import FilterControlsSkl from './FilterControlsSkl'; 
import OverallSklStats from './OverallSklStats'; 
import StudentSklDetailTable from './StudentSklDetailTable'; // <--- Import Component Baru
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
    const [overallData, setOverallData] = useState(null);
    const [studentDetails, setStudentDetails] = useState(null); // State untuk Tabel Baru
    const [isLoading, setIsLoading] = useState(false);

    // --- State & Logic untuk Tombol Back to Top ---
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    // LOGIC PERBAIKAN SCROLL
    useEffect(() => {
        // 1. Kita cari elemen 'main' (konten utama dashboard)
        // Jika tidak ketemu 'main', fallback ke 'window'
        const scrollableDiv = document.querySelector('main') || window;

        const handleScroll = () => {
            // 2. Ambil posisi scroll dari elemen tersebut
            const position = scrollableDiv.scrollTop || window.scrollY;
            
            // Debugging (bisa dihapus nanti)
            // console.log("Posisi Scroll:", position); 

            if (position > 300) {
                setShowScrollBtn(true);
            } else {
                setShowScrollBtn(false);
            }
        };

        // 3. Pasang event listener ke elemen tersebut, BUKAN window global
        scrollableDiv.addEventListener('scroll', handleScroll);
        
        // Cleanup saat pindah halaman
        return () => scrollableDiv.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        const scrollableDiv = document.querySelector('main') || window;
        scrollableDiv.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    // ----------------------------------------------

    // Fungsi fetch data
    const handleFetchRequest = useCallback((params) => {
        setIsLoading(true);
        setChartData(null);
        setOverallData(null);
        setStudentDetails(null);

        axios.get(route('my.grafik.skl.skl_data'), { params })
            .then(response => {
                setChartData(response.data.chartData);
                setOverallData(response.data.overallData);
                setStudentDetails(response.data.studentDetails); // Simpan data tabel
            })
            .catch(error => console.error("Gagal mengambil data SKL:", error))
            .finally(() => setIsLoading(false));
    }, []);

    // Opsi Chart
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } },
            title: { display: true, text: `PERSENTASE PENYELESAIAN SKL PER KELAS`, font: { size: 18 }, padding: { top: 10, bottom: 30 } },
            datalabels: {
                display: true, color: 'black', font: { weight: 'bold' },
                formatter: (value) => (value > 0 ? `${value}%` : null),
                anchor: 'center', align: 'center',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed.y !== null) { label += context.parsed.y + '%'; }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { display: true } },
            y: {
                beginAtZero: true,
                max: 100,
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

                {/* 1. FILTER */}
                <FilterControlsSkl
                    kategoriList={kategoriList}
                    angkatans={angkatans}
                    onFilterChange={handleFetchRequest}
                    isLoading={isLoading}
                />

                {/* 2. STATISTIK GLOBAL (REKAP) */}
                {overallData && !isLoading && (
                    <OverallSklStats data={overallData} />
                )}

                {/* 3. CHART GRAFIK UTAMA */}
                <div className="bg-white p-6 rounded-xl shadow-lg relative" style={{ height: '500px' }}>
                    {isLoading && <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10"><i className="fas fa-spinner fa-spin fa-3x text-blue-500"></i></div>}
                    
                    {!chartData && !isLoading &&
                        <div className="absolute inset-0 flex justify-center items-center text-center">
                            <div className="flex items-center space-x-6">
                                <div className="relative w-32 h-32 overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-white z-10"></div>
                                    <img src="/images/wait-cat.webp" alt="Kucing mengintip" className="absolute left-0 top-0 w-full h-full object-contain transform -translate-x-3" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-lg text-gray-700">Kucingnya Nunggu Kamu Nih 🐾</p>
                                    <p className="text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
                                        Pilih dulu filternya di atas, terus klik <span className="font-semibold text-blue-600">"Tampilkan Grafik"</span> ya~
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                    
                    {chartData && chartData.labels.length === 0 && !isLoading && <div className="absolute inset-0 flex justify-center items-center"><p className="text-gray-500">Tidak ada data kelas harian yang ditemukan.</p></div>}
                    
                    {chartData && chartData.labels.length > 0 && 
                        <Bar 
                            options={chartOptions} 
                            data={chartData} 
                            plugins={shouldHideWatermark ? [] : [customWatermark]} 
                        />
                    }
                </div>

                {/* 4. TABEL DETAIL MAHASISWA (BARU) */}
                {(studentDetails || isLoading) && (
                    <StudentSklDetailTable 
                        studentData={studentDetails} 
                        isLoading={isLoading} 
                    />
                )}

                {/* --- FLOATING BUTTON BACK TO TOP --- */}
                <button
                    onClick={scrollToTop}
                    className={`
                        fixed bottom-8 right-8 z-50 shadow-lg
                        flex items-center gap-2 px-4 py-2 
                        bg-blue-50 text-blue-700 text-sm font-medium 
                        rounded-lg border border-blue-200 
                        hover:bg-blue-100 
                        transition-all duration-300 ease-in-out
                        ${showScrollBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
                    `}
                    title="Kembali ke Atas"
                >
                    <i className="fas fa-arrow-up"></i>
                    {/* <span>Kembali ke Atas</span> */}
                </button>

            </div>
        </MyLayout>
    );
}