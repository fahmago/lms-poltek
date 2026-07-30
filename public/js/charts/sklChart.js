document.addEventListener("DOMContentLoaded", function() {
    // --- Plugins Definition (Local Scope) ---
    const legendMargin = {
        id: 'legendMargin',
        beforeInit(chart) {
            const originalFit = chart.legend.fit;
            chart.legend.fit = function() {
                originalFit.bind(chart.legend)();
                this.height += 22; 
            };
        }
    };
    const legendHorizontalSpacing = {
        id: 'legendHorizontalSpacing',
        beforeLayout(chart) {
            const legend = chart.legend;
            if (legend && legend.options && legend.options.labels) {
                legend.options.labels.boxWidth = 14;
                legend.options.labels.padding = 14; 
            }
        }
    };

    // --- CHART LOGIC ---
    const ctxSkl = document.getElementById('sklChart').getContext('2d');
    const dataSkl = window.dataSkl; // Ambil dari Global Variable

    const bgSkl = dataSkl.actuals.map((val, i) => {
        const tgt = dataSkl.targets[i];
        return (tgt > 0 && val >= tgt) ? '#10b981' : (val > 0 ? '#f59e0b' : '#ef4444');
    });

    new Chart(ctxSkl, {
        type: 'bar',
        data: {
            labels: dataSkl.labels,
            datasets: [{
                    label: 'TARGET',
                    data: dataSkl.targets,
                    backgroundColor: '#e2e8f0',
                    borderColor: '#94a3b8',
                    borderWidth: 1,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8,
                    borderRadius: 4,
                },
                {
                    label: 'CAPAIAN AKTUAL',
                    data: dataSkl.actuals,
                    backgroundColor: bgSkl,
                    borderColor: bgSkl,
                    borderWidth: 1,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8,
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        font: { size: 11, family: "'Inter', sans-serif", weight: '700' },
                        color: '#000000',
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    offset: -2,
                    font: { weight: 'bold', size: 11 },
                    color: '#1f2937',
                    formatter: (v) => v > 0 ? v : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'JUMLAH  SKL',
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000',
                    },
                    ticks: {
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000'
                    },
                    grid: { color: '#f3f4f6', borderDash: [5, 5] },
                    border: { display: false },
                    grace: '10%'
                },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000'
                    }
                }
            },
            animation: { duration: 0 }
        },
        plugins: [ChartDataLabels, legendMargin, legendHorizontalSpacing]
    });
});