<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Laporan SKL - {{ $mahasiswa->user->name ?? 'Mahasiswa' }}</title>
    <link rel="icon" href="{{ asset('images/favicons/favicon.ico') }}" sizes="any">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        /* --- GLOBAL RESET --- */
        body {
            font-family: 'Inter', sans-serif;
            background-color: #525659;
            margin: 0;
            padding: 40px 0;
            color: #1f2937;
        }

        .page-container {
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 15mm 20mm;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        /* --- HEADER / KOP SURAT (VERTIKAL STYLE) --- */
        .header {
            text-align: center;
            /* Rata Tengah */
            border-bottom: 4px double #000;
            padding-bottom: 20px;
            margin-bottom: 35px;
            display: flex;
            flex-direction: column;
            /* Menurun */
            align-items: center;
            gap: 15px;
            /* Jarak Logo ke Teks */
        }

        .header img {
            height: 65px;
            /* Logo diperbesar sedikit */
            width: auto;
        }

        .header-text h1 {
            margin: 0;
            font-size: 20px;
            text-transform: uppercase;
            font-weight: 800;
            color: #000;
            letter-spacing: 1px;
        }

        .header-text p {
            margin: 5px 0 0;
            font-size: 13px;
            color: #444;
            font-weight: 500;
        }

        .header-text .sub-addr {
            font-size: 11px;
            color: #666;
            margin-top: 4px;
        }

        /* --- TITLES --- */
        .section-title {
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            border-left: 5px solid #2563eb;
            padding-left: 10px;
            margin-bottom: 15px;
            color: #111;
            background: #f9fafb;
            padding: 8px 10px;
            border-radius: 0 4px 4px 0;
        }

        /* --- BIODATA --- */
        .bio-container {
            display: flex;
            gap: 25px;
            margin-bottom: 35px;
        }

        .bio-photo-box {
            width: 130px;
            height: 160px;
            border: 1px solid #e5e7eb;
            padding: 4px;
            border-radius: 4px;
            flex-shrink: 0;
        }

        .bio-photo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            background-color: #f3f4f6;
        }

        .bio-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .bio-table td {
            padding: 6px 0;
            vertical-align: top;
        }

        .bio-label {
            width: 140px;
            color: #6b7280;
            font-weight: 500;
        }

        .bio-val {
            font-weight: 600;
            color: #111;
        }

        /* --- GRAFIK --- */
        .chart-wrapper {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            height: 280px;
            margin-bottom: 35px;
        }

        /* --- TABLE STYLES --- */
        .detail-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 30px;
        }

        .detail-table th,
        .detail-table td {
            border: 1px solid #374151;
            padding: 8px 12px;
        }

        .detail-table th {
            background-color: #f3f4f6;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            color: #111;
        }

        .text-center {
            text-align: center;
        }

        /* BADGES */
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            min-width: 80px;
            text-align: center;
        }

        .badge-green {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .badge-yellow {
            background: #fef9c3;
            color: #854d0e;
            border: 1px solid #fde047;
        }

        .badge-red {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        /* --- FOOTER TTD --- */
        .footer-ttd {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            page-break-inside: avoid;
        }

        .ttd-box {
            text-align: center;
            width: 250px;
        }

        .ttd-space {
            height: 70px;
        }

        .ttd-name {
            font-weight: 700;
            text-decoration: underline;
            font-size: 13px;
        }

        /* --- FAB PRINT --- */
        .fab-print {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 50px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
        }

        .fab-print:hover {
            background-color: #1d4ed8;
            transform: translateY(-3px);
        }

        @media print {
            body {
                background: none;
                padding: 0;
                margin: 0;
            }

            .page-container {
                width: 100%;
                max-width: none;
                box-shadow: none;
                margin: 0;
                padding: 0;
                border: none;
            }

            .no-print {
                display: none !important;
            }

            .chart-wrapper {
                border: none !important;
            }

            @page {
                size: A4 portrait;
                margin: 10mm 15mm;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
</head>

<body>

    <button onclick="window.print()" class="fab-print no-print">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Cetak
    </button>

    <div class="page-container">

        <div class="header">
            <img src="{{ asset('images/lms-new-logo-brand.png') }}" alt="Logo">
            <div class="header-text">
                <h1>Laporan Pencapaian Standar Kompetensi Lulusan (SKL)</h1>
                <p>Politeknik IDN Bogor - Program Studi Teknologi Rekayasa Perangkat Lunak</p>
                <div class="sub-addr">Jl. Raya Dayeuh, Sukanegara, Kec. Jonggol, Kabupaten Bogor, Jawa Barat 16830</div>
            </div>
        </div>

        <div class="section-title">I. Biodata Mahasiswa</div>
        <div class="bio-container">
            <div class="bio-photo-box">
                <img
                    src="{{ $mahasiswa->image ?? 'https://ui-avatars.com/api/?name='.urlencode($mahasiswa->user->name).'&background=random&size=200' }}"
                    alt="Foto Mahasiswa" class="bio-photo">
            </div>
            <div style="flex: 1;">
                <table class="bio-table">
                    <tr>
                        <td class="bio-label">NIM</td>
                        <td>:</td>
                        <td class="bio-val" style="text-transform: uppercase;">{{ $mahasiswa->nim ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="bio-label">Nama Lengkap</td>
                        <td width="10">:</td>
                        <td class="bio-val">{{ $mahasiswa->user->name ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="bio-label">Jenis Kelamin</td>
                        <td width="10">:</td>
                        <td class="bio-val">{{ $mahasiswa->gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                    </tr>

                    <tr>
                        <td class="bio-label">TTL</td>
                        <td>:</td>
                        <td class="bio-val">
                            {{ ucwords(strtolower($mahasiswa->tempat_lahir ?? '...')) }},
                            {{ \Carbon\Carbon::parse($mahasiswa->tanggal_lahir)->translatedFormat('d F Y') ?? '...' }}
                        </td>
                    </tr>
                    <tr>
                        <td class="bio-label">Umur</td>
                        <td>:</td>
                        <td class="bio-val">
                            <!-- {{ \Carbon\Carbon::parse($mahasiswa->tanggal_lahir)->age }} Tahun -->
                            @php
                            $tglLahir = \Carbon\Carbon::parse($mahasiswa->tanggal_lahir);
                            $usia = $tglLahir->diff(\Carbon\Carbon::now());
                            @endphp
                            {{ $usia->y }} Tahun, {{ $usia->m }} Bulan, {{ $usia->d }} Hari
                        </td>
                    </tr>

                    <tr>
                        <td class="bio-label">Kelas IT</td>
                        <td>:</td>
                        <td class="bio-val">{{ $kelas->nama_kelas }}</td>
                    </tr>
                    <!-- <tr><td class="bio-label">Dosen Pembimbing</td><td>:</td><td class="bio-val">{{ $kelas->dosen->user->name ?? '-' }}</td></tr> -->
                    <tr>
                        <td class="bio-label">Email</td>
                        <td>:</td>
                        <td class="bio-val">{{ $mahasiswa->user->email ?? '-' }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="section-title">II. Grafik Progres SKL</div>
        <div class="chart-wrapper">
            <canvas id="sklChart"></canvas>
        </div>

        <div class="section-title">III. Rincian Capaian</div>
        <table class="detail-table">
            <thead>
                <tr>
                    <th class="text-center" width="5%">No</th>
                    <th class="text-center" width="40%">Aspek Penilaian</th>
                    <th class="text-center" width="15%">Target</th>
                    <th class="text-center" width="15%">Aktual</th>
                    <th class="text-center" width="25%">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($chartData['labels'] as $index => $label)
                @php
                $target = $chartData['targets'][$index];
                $actual = $chartData['actuals'][$index];
                $percentage = $target > 0 ? round(($actual / $target) * 100) : 0;
                @endphp
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td><strong>{{ $label }}</strong></td>
                    <td class="text-center">{{ $target }}</td>
                    <td class="text-center">{{ $actual }}</td>
                    <td class="text-center">
                        @if($target == 0)
                        <span style="color: #999;">-</span>
                        @elseif($actual >= $target)
                        <span class="badge badge-green">Selesai</span>
                        @elseif($actual > 0)
                        <span class="badge badge-yellow">Proses ({{ $percentage }}%)</span>
                        @else
                        <span class="badge badge-red">Belum</span>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        @if(isset($history) && $history->count() > 0)
        <div class="section-title">IV. Data Kelas</div>
        <table class="detail-table">
            <thead>
                <tr>
                    <th class="text-center" width="5%">No</th>
                    <th class="text-center" width="30%">Nama Kelas</th>
                    <th class="text-center" width="15%">Tahun</th>
                    <th class="text-center" width="15%">Semester</th>
                    <th class="text-center" width="35%">Pengajar</th>
                </tr>
            </thead>
            <tbody style="text-transform: uppercase;">
                @foreach($history as $h)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td><strong>{{ $h->nama_kelas }}</strong></td>
                    <td class="text-center">{{ $h->tahun }}</td>
                    <td class="text-center">{{ $h->semester }}</td>
                    <td>{{ $h->dosen->user->name ?? '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <div class="footer-ttd">
            <div class="ttd-box">
                <p>Bogor, {{ $tanggal }}</p>
                <p>Pengajar,</p>
                <div class="ttd-space"></div>
                <p class="ttd-name">{{ $kelas->dosen->user->name ?? '....................................' }}</p>
                <p style="font-size: 11px;">NIP/NIDN. ..........................</p>
            </div>
        </div>

    </div>

    <!-- <script>
        document.addEventListener("DOMContentLoaded", function() {
            const ctx = document.getElementById('sklChart').getContext('2d');
            const data = <?php echo json_encode($chartData); ?>;

            const bgColors = data.actuals.map((val, i) => {
                const target = data.targets[i];
                if (target > 0 && val >= target) return 'rgba(34, 197, 94, 0.7)';
                if (val > 0) return 'rgba(234, 179, 8, 0.7)';
                return 'rgba(239, 68, 68, 0.7)';
            });

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                            label: 'TARGET',
                            data: data.targets,
                            backgroundColor: 'rgba(54, 162, 235, 0.15)', // Biru muda soft
                            borderColor: 'rgba(54, 162, 235, 0.8)',
                            borderWidth: 1,
                            barPercentage: 0.6,
                            categoryPercentage: 0.7
                        },
                        {
                            label: 'CAPAIAN AKTUAL',
                            data: data.actuals,
                            backgroundColor: bgColors,
                            borderColor: bgColors.map(c => c.replace('0.7', '1')),
                            borderWidth: 1,
                            barPercentage: 0.6,
                            categoryPercentage: 0.7
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            align: 'end'
                        },
                        datalabels: {
                            color: '#000',
                            anchor: 'end',
                            align: 'top',
                            font: {
                                weight: 'bold'
                            },
                            offset: -2,
                            formatter: (value) => value > 0 ? value : ''
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    animation: {
                        duration: 0
                    }
                },
                plugins: [ChartDataLabels]
            });
        });
    </script> -->

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const ctx = document.getElementById('sklChart').getContext('2d');
            const data = <?php echo json_encode($chartData); ?>;

            // Logic Warna: Merah (Belum), Kuning (Proses), Hijau (Tuntas)
            // Menggunakan warna solid agar tajam di kertas putih
            const bgColors = data.actuals.map((val, i) => {
                const target = data.targets[i];
                if (target > 0 && val >= target) return '#10b981'; // Emerald (Hijau)
                if (val > 0) return '#f59e0b'; // Amber (Kuning)
                return '#ef4444'; // Red (Merah)
            });

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [
                        // DATASET 1: TARGET (Kiri)
                        {
                            label: 'TARGET',
                            data: data.targets,
                            // Warna Abu-abu Kebiruan (Cool Gray) - Terlihat profesional & netral
                            backgroundColor: '#e2e8f0', 
                            borderColor: '#94a3b8',
                            borderWidth: 1,
                            // Pengaturan Lebar
                            barPercentage: 0.7,
                            categoryPercentage: 0.8
                        },
                        // DATASET 2: AKTUAL (Kanan)
                        {
                            label: 'CAPAIAN AKTUAL',
                            data: data.actuals,
                            // Warna Dinamis
                            backgroundColor: bgColors,
                            // Border warna yang sama tapi lebih gelap sedikit (opsional)
                            borderColor: bgColors, 
                            borderWidth: 1,
                            // Pengaturan Lebar (Sama dengan Target agar seimbang)
                            barPercentage: 0.7,
                            categoryPercentage: 0.8
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                font: { size: 11, family: "'Inter', sans-serif", weight: '600' },
                                color: '#374151'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            padding: 10,
                            titleFont: { size: 13 },
                            bodyFont: { size: 12 },
                            displayColors: false, // Hilangkan kotak warna di tooltip biar bersih
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.raw + ' Item';
                                }
                            }
                        },
                        datalabels: {
                            color: '#1f2937', // Warna teks angka (Dark Gray)
                            anchor: 'end',
                            align: 'top',
                            offset: -2,
                            font: { weight: 'bold', size: 11 },
                            formatter: (value) => value > 0 ? value : ''
                        }
                    },
                    layout: {
                        padding: {
                            top: 20 // Tambah padding atas supaya angka label tidak terpotong
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#f3f4f6', // Grid sangat tipis
                                borderDash: [5, 5]
                            },
                            ticks: {
                                precision: 0,
                                font: { size: 10 },
                                color: '#6b7280'
                            },
                            border: { display: false }
                        },
                        x: {
                            grid: { display: false },
                            ticks: {
                                font: { size: 11, weight: '600' },
                                color: '#374151'
                            },
                            border: { display: false }
                        }
                    },
                    animation: {
                        duration: 0 // Matikan animasi untuk print
                    }
                },
                plugins: [ChartDataLabels]
            });
        });
    </script>
</body>

</html>