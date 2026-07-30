document.addEventListener("DOMContentLoaded", function() {
    // --- Plugins Definition (Local Scope) ---
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
    const ctxIbadah = document.getElementById('ibadahChart').getContext('2d');
    const dataIbadah = window.dataIbadah; // Ambil dari Global Variable

    const colorBlue = '#3b82f6';
    const colorGreen = '#22c55e';
    const colorRed = '#ef4444';

    let finalColor = colorRed;
    if (dataIbadah.persentase >= 100) {
        finalColor = colorBlue;
    } else if (dataIbadah.persentase >= 80) {
        finalColor = colorGreen;
    }

    new Chart(ctxIbadah, {
        type: 'bar',
        data: {
            labels: ['TOTAL POIN IBADAH'],
            datasets: [{
                    label: 'POIN STANDAR',
                    data: [dataIbadah.target_poin],
                    backgroundColor: '#e2e8f0',
                    borderColor: '#9ca3af',
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.9,
                    borderRadius: 4,
                    order: 1
                },
                {
                    label: 'POIN MAHASISWA',
                    data: [dataIbadah.capaian_poin],
                    backgroundColor: finalColor,
                    borderColor: finalColor,
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.9,
                    borderRadius: 4,
                    order: 0
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 10, right: 50 } },
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        padding: 20,
                        color: '#000000',
                        font: { size: 11, family: "'Inter', sans-serif", weight: 'bold' }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + ' Poin';
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    font: { weight: 'bold', size: 12 },
                    color: '#1f2937',
                    formatter: (value, ctx) => {
                        if (ctx.datasetIndex === 1) {
                            return value + ' (' + dataIbadah.persentase + '%)';
                        }
                        return value;
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6' },
                    title: {
                        display: true,
                        text: 'JUMLAH POIN',
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000',
                    },
                    ticks: {
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000'
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { weight: 'bold', size: 11, family: "'Inter', sans-serif" },
                        color: '#000'
                    }
                }
            },
            animation: { duration: 0 }
        },
        plugins: [ChartDataLabels, legendHorizontalSpacing]
    });
});