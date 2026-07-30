document.addEventListener("DOMContentLoaded", function() {
    // --- Plugins Definition (Local Scope) ---
    // Didefinisikan ulang disini agar file ini bisa berdiri sendiri (independent)
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
    const ctxAtt = document.getElementById('attendanceChart').getContext('2d');
    const dataAtt = window.dataAtt; // Ambil dari Global Variable

    new Chart(ctxAtt, {
        type: 'bar',
        data: {
            labels: dataAtt.labels,
            datasets: [{
                    label: 'SAKIT',
                    data: dataAtt.sakit,
                    backgroundColor: '#eab308',
                    borderColor: '#eab308',
                    borderWidth: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                    borderRadius: 4,
                },
                {
                    label: 'IZIN',
                    data: dataAtt.izin,
                    backgroundColor: '#3b82f6',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8,
                    borderRadius: 4,
                },
                {
                    label: 'ALPHA',
                    data: dataAtt.alpha,
                    backgroundColor: '#ef4444',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    barPercentage: 0.6,
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
                        font: { size: 11, family: "'Inter', sans-serif", weight: 'bold' },
                        color: '#000000',
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw;
                        }
                    }
                },
                datalabels: {
                    color: '#000',
                    anchor: 'end',
                    align: 'top',
                    offset: -4,
                    font: { weight: 'bold', size: 10 },
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'JUMLAH  KETIDAKHADIRAN',
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000',
                    },
                    grid: { color: '#f3f4f6' },
                    ticks: {
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000'
                    },
                    grace: '20%'
                },
                x: {
                    grid: { display: false },
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