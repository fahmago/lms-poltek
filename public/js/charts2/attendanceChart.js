document.addEventListener("DOMContentLoaded", function() {

    const dataAtt = window.chartData.attendance;
    const ctxAtt = document.getElementById('attendanceChart').getContext('2d');

    // --- Plugin: Margin Legend ---
    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart) {
            const originalFit = chart.legend.fit;
            chart.legend.fit = function() {
                originalFit.bind(chart.legend)();
                this.height += 10; // Jarak legend ke chart
            };
        }
    };

    // --- Plugin: Spacing Legend ---
    const legendHorizontalSpacing = {
        id: 'legendHorizontalSpacing',
        beforeLayout(chart) {
            const legend = chart.legend;
            if (legend && legend.options && legend.options.labels) {
                legend.options.labels.boxWidth = 12;
                legend.options.labels.padding = 20; // Jarak antar item legend
            }
        }
    };

    new Chart(ctxAtt, {
        type: 'bar',
        data: {
            labels: dataAtt.labels,
            datasets: [{
                    label: 'SAKIT',
                    data: dataAtt.sakit,
                    backgroundColor: '#fbbf24', // Amber yang lebih cerah
                    borderColor: '#d97706', // Border lebih gelap agar tegas
                    borderWidth: 1,
                    borderRadius: 6, // Sudut membulat (Modern look)
                    barPercentage: 0.6,
                },
                {
                    label: 'IZIN',
                    data: dataAtt.izin,
                    backgroundColor: '#60a5fa', // Blue yang lebih fresh
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    borderRadius: 6,
                    barPercentage: 0.6,
                },
                {
                    label: 'ALPHA',
                    data: dataAtt.alpha,
                    backgroundColor: '#f87171', // Red yang tidak terlalu gelap
                    borderColor: '#dc2626',
                    borderWidth: 1,
                    borderRadius: 6,
                    barPercentage: 0.6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // --- ANIMASI KEREN ---
            animation: {
                y: {
                    duration: 2000,
                    easing: 'easeOutQuart' // Gerakan halus melambat di akhir
                },
                delay: (context) => {
                    let delay = 0;
                    // Animasi muncul bergantian (wave effect)
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rectRounded', // Ikon legend kotak tumpul
                        font: {
                            size: 11,
                            family: "'Inter', sans-serif",
                            weight: 'bold'
                        },
                        color: '#000000' // Teks Legend Hitam Pekat
                    }
                },
                // --- PENGATURAN LABEL ANGKA ---
                datalabels: {
                    anchor: 'end', // Posisi jangkar di ujung bar
                    align: 'top', // Teks ditaruh di atas jangkar
                    offset: -2, // Sedikit jarak dari bar
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    color: '#000000', // Angka Hitam Pekat
                    formatter: (value) => {
                        // Logika: Hanya tampilkan angka jika nilai > 0
                        // Jika 0, return string kosong ''
                        // return value > 0 ? value : '';
                        return value;
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { weight: 'bold' },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false, // Hilangkan kotak warna di tooltip biar bersih
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grace: '1', // Memberi ruang kosong 10% di atap chart agar angka tidak kepotong
                    // grace: '10%', // Memberi ruang kosong 10% di atap chart agar angka tidak kepotong
                    border: { display: false },
                    grid: {
                        color: '#e5e7eb', // Garis grid abu-abu tipis
                        borderDash: [5, 5] // Garis putus-putus (estetik)
                    },
                    ticks: {
                        font: {
                            weight: 'bold',
                            size: 11,
                            family: "'Inter', sans-serif"
                        },
                        color: '#000000', // Teks Sumbu Y Hitam
                        stepSize: 1, // Agar sumbu Y angkanya bulat (1, 2, 3) bukan desimal
                        precision: 0
                    },
                    title: {
                        display: true,
                        text: 'JUMLAH KETIDAKHADIRAN',
                        font: { weight: 'bold', size: 11 },
                        color: '#000000'
                    }
                },
                x: {
                    grid: { display: false }, // Hilangkan grid vertikal biar bersih
                    border: { display: false },
                    ticks: {
                        font: {
                            weight: 'bold',
                            size: 11,
                            family: "'Inter', sans-serif"
                        },
                        color: '#000000' // Teks Sumbu X Hitam
                    }
                }
            }
        },
        plugins: [ChartDataLabels, legendMargin, legendHorizontalSpacing]
    });

});

// document.addEventListener("DOMContentLoaded", function () {

//     const dataAtt = window.chartData.attendance;
//     const ctxAtt = document.getElementById('attendanceChart').getContext('2d');

//     const legendMargin = {
//         id: 'legendMargin',
//         beforeInit(chart) {
//             const originalFit = chart.legend.fit;
//             chart.legend.fit = function () {
//                 originalFit.bind(chart.legend)();
//                 this.height += 22;
//             };
//         }
//     };

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

//     new Chart(ctxAtt, {
//         type: 'bar',
//         data: {
//             labels: dataAtt.labels,
//             datasets: [
//                 { label: 'SAKIT', data: dataAtt.sakit, backgroundColor: '#eab308', borderColor: '#eab308', borderWidth: 1 },
//                 { label: 'IZIN', data: dataAtt.izin, backgroundColor: '#3b82f6', borderColor: '#3b82f6', borderWidth: 1 },
//                 { label: 'ALPHA', data: dataAtt.alpha, backgroundColor: '#ef4444', borderColor: '#ef4444', borderWidth: 1 }
//             ]
//         },
//         options: { responsive: true, maintainAspectRatio: false },
//         plugins: [ChartDataLabels, legendMargin, legendHorizontalSpacing]
//     });

// });
