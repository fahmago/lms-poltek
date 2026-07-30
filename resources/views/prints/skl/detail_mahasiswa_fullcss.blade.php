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

        /* --- HEADER --- */
        .header {
            text-align: center;
            border-bottom: 4px double #000;
            padding-bottom: 20px;
            margin-top: -10px;
            margin-bottom: 35px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .header img {
            height: 65px;
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
            background: linear-gradient(to right, rgba(37, 99, 235, 0.08), rgba(37, 99, 235, 0));
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

        /* --- CHART WRAPPER --- */
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

        .badge-status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            text-align: center;
        }

        .bg-biru {
            background: #dbeafe;
            color: #1d4ed8;
            border: 1px solid #e5e7eb;
        }

        .bg-hijau {
            background: #dcfce7;
            color: #15803d;
            border: 1px solid #e5e7eb;
        }

        .bg-merah {
            background: #fee2e2;
            color: #b91c1c;
            border: 1px solid #e5e7eb;
        }

        .bg-green {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .bg-yellow {
            background: #fef9c3;
            color: #854d0e;
            border: 1px solid #fde047;
        }

        .bg-red {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        /* --- FOOTER TTD --- */
        .footer-ttd {
            margin-top: -20px;
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
            margin-top: -20px;
            font-weight: 700;
            text-decoration: underline;
            font-size: 13px;
            position: relative;
            z-index: 1;
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
                /* border: none !important; */
                border: 1px solid #e5e7eb !important;
                border-radius: 8px;
                /* Opsional: Tetap melengkung */
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
                @if($avatar['canSeePhoto'])
                <img
                    src="{{ $mahasiswa->image }}"
                    alt="{{ $mahasiswa->user->name }}"
                    class="bio-photo">
                @else
                <img
                    src="https://api.dicebear.com/9.x/{{ $avatar['randomStyle'] }}/svg?seed={{ $avatar['seed'] }}"
                    alt="{{ $mahasiswa->user->name }}"
                    class="bio-photo">
                <p style=" font-size: 11px; margin-top: 6px; color: #6b7280; font-style: italic; text-align: center;">
                    Penayangan foto asli dibatasi sesuai kebijakan privasi sistem.
                </p>
                @endif
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
                    <tr>
                        <td class="bio-label">Email</td>
                        <td>:</td>
                        <td class="bio-val">{{ $mahasiswa->user->email ?? '-' }}</td>
                    </tr>
                </table>
            </div>
        </div>

        <div class="section-title">II. Capaian Ibadah Mahasiswa</div>

        <div style="margin-bottom: 10px; padding: 0 5px;">

            <div style="display: flex; justify-content: space-between; font-size: 11px; align-items: center;">

                <span style="color: #555;">
                    <strong style="text-transform: uppercase; color: #000;">Periode:</strong> {{ $ibadahSummary['periode'] }}
                    ({{ $ibadahSummary['total_hari'] }} Hari)

                    @if($mahasiswa->gender == 'P')
                    <span style="color: #d946ef; margin-left: 5px; font-weight: 600;">
                        (Haid: {{ $ibadahSummary['total_haid'] }} Hari)
                    </span>
                    @endif
                </span>

                <div style="text-align: right;">
                    <span style="text-transform: uppercase;">
                        <strong style="color: #000;">Status : </strong>
                        @if($ibadahSummary['persentase'] >= 100)
                        <span class="badge-status bg-biru">Optimal</span>
                        <!-- <span class="badge bg-biru">Optimal ({{ $ibadahSummary['persentase'] }}%)</span> -->
                        @elseif($ibadahSummary['persentase'] >= 80)
                        <span class="badge-status bg-hijau">Cukup</span>
                        <!-- <span class="badge bg-hijau">Cukup ({{ $ibadahSummary['persentase'] }}%)</span> -->
                        @else
                        <span class="badge-status bg-merah">Kurang</span>
                        <!-- <span class="badge bg-merah">Kurang ({{ $ibadahSummary['persentase'] }}%)</span> -->
                        @endif
                    </span>
                    <div style="text-align: right; font-size: 9px; color: #666; margin-top: 6px; font-style: italic;">
                        *Keterangan: Optimal (100%), Cukup (≥ 80%), Kurang (< 80%)
                            </div>
                    </div>
                </div>



            </div>

            <div class="chart-wrapper" style="height: 160px;">
                <canvas id="ibadahChart"></canvas>
            </div>

            <!-- <div style="text-align: right; font-size: 9px; color: #666; margin-top: -20px; margin-bottom: 30px; font-style: italic;">
            *Keterangan: Optimal (100%), Cukup (≥ 80%), Kurang (< 80%)
        </div> -->

            <div class="section-title">III. Grafik Progres SKL</div>
            <div class="chart-wrapper">
                <canvas id="sklChart"></canvas>
            </div>

            <div class="section-title">IV. Rincian Capaian SKL</div>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th width="5%">No</th>
                        <th width="40%">Aspek Penilaian</th>
                        <th width="15%">Target</th>
                        <th width="15%">Aktual</th>
                        <th width="25%">Status</th>
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
                        <td class="text-center">{{ $index + 1 }}</td>
                        <td><strong>{{ $label }}</strong></td>
                        <td class="text-center">{{ $target }}</td>
                        <td class="text-center">{{ $actual }}</td>
                        <td class="text-center">
                            @if($target == 0) <span style="color: #999;">-</span>
                            @elseif($actual >= $target) <span class="badge bg-green">Selesai</span>
                            @elseif($actual > 0) <span class="badge bg-yellow">Proses ({{ $percentage }}%)</span>
                            @else <span class="badge bg-red">Belum</span>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="section-title">V. Grafik Kehadiran (Semua Kelas)</div>
            <div class="chart-wrapper">
                <canvas id="attendanceChart"></canvas>
            </div>

            <div class="section-title">VI. Rincian Kehadiran (Semua Kelas)</div>
            <table class="detail-table">
                <thead>
                    <tr class="text-center">
                        <!-- <th width="5%">No</th>
                        <th width="25%">Nama Kelas</th>
                        <th width="25%">Periode</th>
                        <th width="10%">Hadir</th>
                        <th width="10%">Sakit</th>
                        <th width="10%">Izin</th>
                        <th width="10%">Alpha</th>
                        <th width="10%">Tidak Hadir</th> -->
                        <th width="5%">No</th>
                        <th>Nama Kelas</th>
                        <th>Periode</th>
                        <th>Hadir</th>
                        <th>Sakit</th>
                        <th>Izin</th>
                        <th>Alpha</th>
                        <th>Tidak Hadir</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($attendanceTable as $att)
                    <tr class="text-center" style="text-transform: uppercase;">
                        <td>{{ $loop->iteration }}</td>
                        <td style="text-align: left;"><strong>{{ $att['kelas'] }}</strong> <span style="font-size: 10px; color: #666;">({{ $att['tahun'] }} - {{ $att['semester'] }})</span></td>
                        <td>{{ $att['periode'] }}</td>
                        <td style="background: #ecfeff;">{{ $att['hadir'] }}</td>
                        <td style="background: #fffbeb;">{{ $att['sakit'] }}</td>
                        <td style="background: #eff6ff;">{{ $att['izin'] }}</td>
                        <td style="background: #fef2f2;">{{ $att['alpha'] }}</td>
                        <td class="font-bold">{{ $att['total_absen'] }}</td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="8" class="text-center">Belum ada data absensi.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>

            <div class="section-title">VII. Detail Kelas</div>
            @if(isset($history) && $history->count() > 0)
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
            @else
            <p style="text-align: center; font-style: italic; color: #666; padding: 10px; border: 1px solid #ddd;">Tidak ada riwayat kelas lain.</p>
            @endif

            <div class="footer-ttd">
                <div class="ttd-box">
                    <p>Bogor, {{ $tanggal }}</p>
                    <p>Pengajar,</p>
                    <div style="
                position: relative;
                z-index: 10;
                width: 120px;
                height: 120px;
                background-image: url('<?= asset("images/stempel_trpl.png"); ?>');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                margin-top: -30px;
                margin-left: -18px;
                opacity: 0.85;
                transform: rotate(-12deg);
                pointer-events: none;"></div>
                    <p class="ttd-name">{{ $kelas->dosen->user->name ?? '....................................' }}</p>
                    <!-- <p style="font-size: 11px;">NIP/NIDN. ..........................</p> -->
                </div>
            </div>

        </div>

        <script>
            document.addEventListener("DOMContentLoaded", function() {

                const legendMargin = {
                    id: 'legendMargin',
                    beforeInit(chart) {
                        const originalFit = chart.legend.fit;
                        chart.legend.fit = function() {
                            originalFit.bind(chart.legend)();
                            this.height += 22; // ⬅️ Tambah jarak legend ke bawah
                        };
                    }
                };
                const legendHorizontalSpacing = {
                    id: 'legendHorizontalSpacing',
                    beforeLayout(chart) {
                        const legend = chart.legend;

                        if (legend && legend.options && legend.options.labels) {
                            // Tambah jarak antar legend item secara horizontal
                            legend.options.labels.boxWidth = 14;
                            legend.options.labels.padding = 14; // Jarak horizontal antar legend
                        }
                    }
                };

                // ==========================================
                // 1. CHART SKL (SIDE-BY-SIDE BAR)
                // ==========================================
                const ctxSkl = document.getElementById('sklChart').getContext('2d');
                // Menggunakan PHP echo json_encode agar aman dari syntax error Blade
                const dataSkl = <?php echo json_encode($chartData); ?>;

                const bgSkl = dataSkl.actuals.map((val, i) => {
                    const tgt = dataSkl.targets[i];
                    // Logic Warna: Hijau (Tuntas), Kuning (Proses), Merah (Belum)
                    return (tgt > 0 && val >= tgt) ? '#10b981' : (val > 0 ? '#f59e0b' : '#ef4444');
                });

                new Chart(ctxSkl, {
                    type: 'bar',
                    data: {
                        labels: dataSkl.labels,
                        datasets: [{
                                label: 'TARGET',
                                data: dataSkl.targets,
                                backgroundColor: '#e2e8f0', // Abu-abu Kebiruan
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
                                    font: {
                                        size: 11,
                                        family: "'Inter', sans-serif",
                                        weight: '700'
                                    },
                                    color: '#000000',
                                    // padding: 20 // Jarak antar item legend
                                }
                            },
                            datalabels: {
                                anchor: 'end',
                                align: 'top',
                                offset: -2,
                                font: {
                                    weight: 'bold',
                                    size: 11
                                },
                                color: '#1f2937',
                                formatter: (v) => v > 0 ? v : ''
                            }
                        },
                        // layout: {
                        //     padding: {
                        //         top: 25 // Jarak tambahan dari atas kanvas
                        //     }
                        // },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'JUMLAH  SKL',
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif" // Jenis Font (Opsional)
                                    },
                                    color: '#000',
                                },
                                ticks: {
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif"
                                    },
                                    color: '#000' // Warna Teks Hitam Pekat
                                },
                                grid: {
                                    color: '#f3f4f6',
                                    borderDash: [5, 5]
                                },
                                border: {
                                    display: false
                                },
                                // [FIX] Tambah ruang kosong di atas batang agar tidak mepet
                                grace: '10%'
                            },
                            x: {
                                grid: {
                                    display: false
                                },
                                border: {
                                    display: false
                                },
                                ticks: {
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif"
                                    },
                                    color: '#000' // Warna Teks Hitam Pekat
                                }
                            }
                        },
                        animation: {
                            duration: 0
                        }
                    },
                    plugins: [ChartDataLabels, legendMargin, legendHorizontalSpacing]
                });


                // ==========================================
                // 2. CHART ABSENSI (GROUPED BAR)
                // ==========================================
                const ctxAtt = document.getElementById('attendanceChart').getContext('2d');
                const dataAtt = <?php echo json_encode($attendanceChart ?? ['labels' => [], 'sakit' => [], 'izin' => [], 'alpha' => []]); ?>;

                new Chart(ctxAtt, {
                    type: 'bar',
                    data: {
                        labels: dataAtt.labels,
                        datasets: [{
                                label: 'SAKIT',
                                data: dataAtt.sakit,
                                backgroundColor: '#eab308', // Kuning
                                borderColor: '#eab308',
                                borderWidth: 1,
                                barPercentage: 0.6,
                                categoryPercentage: 0.8,
                                borderRadius: 4,
                            },
                            {
                                label: 'IZIN',
                                data: dataAtt.izin,
                                backgroundColor: '#3b82f6', // Biru
                                borderColor: '#3b82f6',
                                borderWidth: 1,
                                barPercentage: 0.6,
                                categoryPercentage: 0.8,
                                borderRadius: 4,
                            },
                            {
                                label: 'ALPHA',
                                data: dataAtt.alpha,
                                backgroundColor: '#ef4444', // Merah
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

                        // 1. Layout Padding: Jarak global dari tepi kanvas


                        plugins: {
                            legend: {
                                position: 'top',
                                align: 'end',
                                labels: {
                                    usePointStyle: true,
                                    boxWidth: 8,
                                    font: {
                                        size: 11,
                                        family: "'Inter', sans-serif",
                                        weight: 'bold'
                                    },
                                    color: '#000000',

                                    // 2. Legend Padding: Memberi jarak vertikal di bawah teks legend
                                    // padding: 25 
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
                                font: {
                                    weight: 'bold',
                                    size: 10
                                },
                                formatter: (value) => value > 0 ? value : ''
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'JUMLAH  KETIDAKHADIRAN',
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif" // Jenis Font (Opsional)
                                    },
                                    color: '#000',
                                },
                                grid: {
                                    color: '#f3f4f6'
                                },
                                ticks: {
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif"
                                    },
                                    color: '#000' // Warna Teks Hitam Pekat
                                },
                                grace: '20%'
                            },
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif"
                                    },
                                    color: '#000' // Warna Teks Hitam Pekat
                                }
                            }
                        },
                        animation: {
                            duration: 0
                        }
                    },
                    plugins: [ChartDataLabels, legendMargin, legendHorizontalSpacing]
                });

                const ctxIbadah = document.getElementById('ibadahChart').getContext('2d');
                const dataIbadah = <?php echo json_encode($ibadahSummary); ?>;

                // --- DEFINISI WARNA MENYALA ---
                const colorBlue = '#3b82f6';
                const colorGreen = '#22c55e';
                const colorRed = '#ef4444';

                // --- LOGIKA PENENTUAN WARNA ---
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

                                // --- BENTUK BATANG ---
                                barPercentage: 0.8,
                                categoryPercentage: 0.9,
                                borderRadius: 4, // Agar ujung batang tumpul/bulat sedikit

                                order: 1
                            },
                            {
                                label: 'POIN MAHASISWA',
                                data: [dataIbadah.capaian_poin],

                                backgroundColor: finalColor,
                                borderColor: finalColor,
                                borderWidth: 1,

                                // --- BENTUK BATANG ---
                                barPercentage: 0.8,
                                categoryPercentage: 0.9,
                                borderRadius: 4, // Agar ujung batang tumpul/bulat sedikit

                                order: 0
                            }
                        ]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                top: 10,
                                right: 50
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom',
                                align: 'start',
                                labels: {
                                    // --- MEMBUAT LEGEND MENJADI BULAT ---
                                    usePointStyle: true, // Aktifkan mode simbol
                                    pointStyle: 'circle', // Ubah bentuk jadi lingkaran (bulat)
                                    boxWidth: 8, // Ukuran lingkaran
                                    padding: 20, // Jarak antar keterangan
                                    color: '#000000',
                                    font: {
                                        size: 11,
                                        family: "'Inter', sans-serif",
                                        weight: 'bold'
                                    }
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
                                font: {
                                    weight: 'bold',
                                    size: 12
                                },
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
                                grid: {
                                    color: '#f3f4f6'
                                },
                                title: {
                                    display: true,
                                    text: 'JUMLAH POIN',
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif" // Jenis Font (Opsional)
                                    },
                                    color: '#000',
                                },
                                ticks: {
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif"
                                    },
                                    color: '#000' // Warna Teks Hitam Pekat
                                }
                            },
                            y: {
                                grid: {
                                    display: false
                                },
                                // --- PENGATURAN FONT BOLD DISINI ---
                                ticks: {
                                    font: {
                                        weight: 'bold', // Membuat Teks Tebal
                                        size: 11, // Ukuran Font (Opsional)
                                        family: "'Inter', sans-serif"
                                    },
                                    color: '#000' // Warna Teks Hitam Pekat
                                }
                                // ------------------------------------
                            }
                        },
                        animation: {
                            duration: 0
                        }
                    },
                    plugins: [ChartDataLabels, legendHorizontalSpacing]
                });
            });
        </script>
</body>

</html>