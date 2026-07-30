document.addEventListener("DOMContentLoaded", function () {

    const dataIbadah = window.chartData.ibadah;
    const ctxIbadah = document.getElementById('ibadahChart').getContext('2d');

    // --- 1. Palet Warna Baru (Senada dengan Chart Absensi) ---
    // Biru (Excellent/100%)
    const colorBlue = '#60a5fa'; 
    const borderBlue = '#2563eb';
    
    // Hijau (Good/>80%)
    const colorGreen = '#4ade80'; 
    const borderGreen = '#16a34a';
    
    // Merah (Low)
    const colorRed = '#f87171'; 
    const borderRed = '#dc2626';

    // --- 2. Logika Penentuan Warna ---
    let finalBg = colorRed;
    let finalBorder = borderRed;

    // Pastikan dataIbadah.persentase diperlakukan sebagai angka
    const persentase = parseFloat(dataIbadah.persentase);

    if (persentase >= 100) {
        finalBg = colorBlue;
        finalBorder = borderBlue;
    } else if (persentase >= 80) {
        finalBg = colorGreen;
        finalBorder = borderGreen;
    }

    // --- 3. Plugin Spacing Legend ---
    const legendHorizontalSpacing = {
        id: 'legendHorizontalSpacing',
        beforeLayout(chart) {
            const legend = chart.legend;
            if (legend && legend.options && legend.options.labels) {
                legend.options.labels.boxWidth = 12;
                legend.options.labels.padding = 20;
            }
        }
    };

    new Chart(ctxIbadah, {
        type: 'bar',
        data: {
            labels: ['TOTAL POIN IBADAH'],
            datasets: [
                { 
                    label: 'POIN STANDAR', 
                    data: [dataIbadah.target_poin], 
                    backgroundColor: '#e5e7eb', // Abu-abu terang
                    borderColor: '#9ca3af',     // Abu-abu border
                    borderWidth: 1, 
                    barPercentage: 0.7, 
                    categoryPercentage: 0.8, 
                    borderRadius: 6, // Sudut membulat
                    order: 1 // Layer di belakang
                },
                { 
                    label: 'POIN MAHASISWA', 
                    data: [dataIbadah.capaian_poin], 
                    backgroundColor: finalBg, 
                    borderColor: finalBorder, 
                    borderWidth: 1, 
                    barPercentage: 0.7, 
                    categoryPercentage: 0.8, 
                    borderRadius: 6,
                    order: 0 // Layer di depan
                }
            ]
        },
        options: {
            indexAxis: 'y', // CHART HORIZONTAL
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    right: 50 // Tambah ruang di kanan agar label angka tidak kepotong
                }
            },
            // --- ANIMASI ---
            animation: {
                x: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                delay: (context) => {
                    // Animasi delay sedikit untuk dataset kedua
                    return context.datasetIndex * 300;
                }
            },
            plugins: {
                legend: {
                    position: 'bottom', // Legend di bawah lebih rapi untuk single bar
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rectRounded',
                        font: { size: 11, family: "'Inter', sans-serif", weight: 'bold' },
                        color: '#000000'
                    }
                },
                datalabels: {
                    anchor: 'end', // Jangkar di ujung bar
                    align: 'end',  // Teks di sebelah kanan jangkar
                    offset: 4,     // Jarak teks dari bar
                    font: { weight: 'bold', size: 12 },
                    color: '#000000', // Hitam Pekat
                    formatter: (value, ctx) => {
                        // Sembunyikan 0 jika diinginkan, atau tampilkan format
                        // if (value <= 0) return '';
                        
                        // Tambahkan detail persentase hanya pada bar Mahasiswa (index 1)
                        if (ctx.datasetIndex === 1) {
                            return `${value} (${dataIbadah.persentase}%)`;
                        }
                        return value;
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { weight: 'bold' },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.raw} Poin`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb',
                        borderDash: [5, 5]
                    },
                    border: { display: false },
                    title: {
                        display: true,
                        text: 'JUMLAH POIN',
                        font: { weight: 'bold', size: 11 },
                        color: '#000000'
                    },
                    ticks: {
                        font: { weight: 'bold', size: 11 },
                        color: '#000000'
                    },
                    // Memberi ruang ekstra di sumbu X (kanan)
                    grace: '15%' 
                },
                y: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        font: { weight: 'bold', size: 11 },
                        color: '#000000'
                    }
                }
            }
        },
        plugins: [ChartDataLabels, legendHorizontalSpacing]
    });

});

// document.addEventListener("DOMContentLoaded", function () {

//     const dataIbadah = window.chartData.ibadah;
//     const ctxIbadah = document.getElementById('ibadahChart').getContext('2d');

//     const colorBlue = '#3b82f6';
//     const colorGreen = '#22c55e';
//     const colorRed = '#ef4444';

//     let finalColor = colorRed;

//     if (dataIbadah.persentase >= 100) {
//         finalColor = colorBlue;
//     } else if (dataIbadah.persentase >= 80) {
//         finalColor = colorGreen;
//     }

//     const legendHorizontalSpacing = {
//         id: 'legendHorizontalSpacing',
//         beforeLayout(chart) {
//             const legend = chart.legend;
//             if (legend && legend.options && legend.options.labels) {
//                 legend.options.labels.boxWidth = 14;
//                 legend.options.labels.padding = 14;
//             }
//         }
//     };

//     new Chart(ctxIbadah, {
//         type: 'bar',
//         data: {
//             labels: ['TOTAL POIN IBADAH'],
//             datasets: [
//                 { label: 'POIN STANDAR', data: [dataIbadah.target_poin], backgroundColor: '#e2e8f0', borderColor: '#9ca3af', borderWidth: 1, barPercentage: 0.8, categoryPercentage: 0.9, borderRadius: 4 },
//                 { label: 'POIN MAHASISWA', data: [dataIbadah.capaian_poin], backgroundColor: finalColor, borderColor: finalColor, borderWidth: 1, barPercentage: 0.8, categoryPercentage: 0.9, borderRadius: 4 }
//             ]
//         },
//         options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false },
//         plugins: [ChartDataLabels, legendHorizontalSpacing]
//     });

// });


