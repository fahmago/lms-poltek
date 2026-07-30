document.addEventListener("DOMContentLoaded", function () {

    const dataSkl = window.chartData.skl;
    const ctxSkl = document.getElementById('sklChart').getContext('2d');

    // --- 1. Plugin Styling Legend ---
    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart) {
            const originalFit = chart.legend.fit;
            chart.legend.fit = function () {
                originalFit.bind(chart.legend)();
                this.height += 0; 
            };
        }
    };

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

    // --- 2. Logika Warna Dinamis ---
    const bgSkl = dataSkl.actuals.map((val, i) => {
        const tgt = dataSkl.targets[i];
        
        // Hijau (Tuntas)
        if (tgt > 0 && val >= tgt) return '#22c55e'; 
        // Kuning (Proses)
        if (val > 0) return '#f59e0b'; 
        // Merah (Belum)
        return '#ef4444'; 
    });

    const borderSkl = bgSkl; 

    new Chart(ctxSkl, {
        type: 'bar',
        data: {
            labels: dataSkl.labels,
            datasets: [
                { 
                    label: 'TARGET', 
                    data: dataSkl.targets, 
                    backgroundColor: '#e5e7eb', 
                    borderColor: '#9ca3af', 
                    borderWidth: 1, 
                    barPercentage: 0.7, 
                    categoryPercentage: 0.8, 
                    borderRadius: 6,
                    // [PERUBAHAN DISINI]: Order 0 agar posisinya di KIRI (Pertama)
                    order: 0 
                },
                { 
                    label: 'CAPAIAN AKTUAL', 
                    data: dataSkl.actuals, 
                    backgroundColor: bgSkl, 
                    borderColor: borderSkl, 
                    borderWidth: 1, 
                    barPercentage: 0.7, 
                    categoryPercentage: 0.8, 
                    borderRadius: 6, 
                    // [PERUBAHAN DISINI]: Order 1 agar posisinya di KANAN (Kedua)
                    order: 1 
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            // --- ANIMASI WAVE ---
            animation: {
                y: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                delay: (context) => {
                    return context.dataIndex * 150 + context.datasetIndex * 100;
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'rectRounded',
                        font: { size: 11, family: "'Inter', sans-serif", weight: 'bold' },
                        color: '#000000'
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    offset: -2,
                    font: { weight: 'bold', size: 11 },
                    color: '#000000',
                    formatter: (value) => {
                        // return value > 0 ? value : '';
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
                            return ` ${context.dataset.label}: ${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grace: '1',
                    grid: {
                        color: '#e5e7eb',
                        borderDash: [5, 5]
                    },
                    border: { display: false },
                    title: {
                        display: true,
                        text: 'JUMLAH SKL',
                        font: { weight: 'bold', size: 11 },
                        color: '#000000'
                    },
                    ticks: {
                        font: { weight: 'bold', size: 11 },
                        color: '#000000',
                        stepSize: 1,
                        precision: 0
                    }
                },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        font: { weight: 'bold', size: 11 },
                        color: '#000000'
                    }
                }
            }
        },
        plugins: [ChartDataLabels, legendMargin, legendHorizontalSpacing]
    });
});

// document.addEventListener("DOMContentLoaded", function () {

//     const dataSkl = window.chartData.skl;
//     const ctxSkl = document.getElementById('sklChart').getContext('2d');

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

//     const bgSkl = dataSkl.actuals.map((val, i) => {
//         const tgt = dataSkl.targets[i];
//         return (tgt > 0 && val >= tgt) ? '#10b981' :
//                (val > 0 ? '#f59e0b' : '#ef4444');
//     });

//     new Chart(ctxSkl, {
//         type: 'bar',
//         data: {
//             labels: dataSkl.labels,
//             datasets: [
//                 { label: 'TARGET', data: dataSkl.targets, backgroundColor: '#e2e8f0', borderColor: '#94a3b8', borderWidth: 1, barPercentage: 0.7, categoryPercentage: 0.8, borderRadius: 4 },
//                 { label: 'CAPAIAN AKTUAL', data: dataSkl.actuals, backgroundColor: bgSkl, borderColor: bgSkl, borderWidth: 1, barPercentage: 0.7, categoryPercentage: 0.8, borderRadius: 4 }
//             ]
//         },
//         options: { responsive: true, maintainAspectRatio: false },
//         plugins: [ChartDataLabels, legendMargin, legendHorizontalSpacing]
//     });
// });
