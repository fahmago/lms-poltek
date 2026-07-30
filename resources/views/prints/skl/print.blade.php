<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>{{ $judul }}</title>
    <link rel="icon" href="{{ asset('images/favicons/favicon.ico') }}" sizes="any">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        /* --- RESET & BASIC CONFIG --- */
        body {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            color: #111;
            margin: 0;
            padding: 40px;
            background-color: #f3f4f6;
        }

        .page-container {
            background: white;
            max-width: 297mm;
            margin: 0 auto;
            padding: 10mm 15mm;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            min-height: 210mm;
            position: relative;
            /* Untuk positioning absolute jika perlu */
        }

        /* --- HEADER --- */
        .header {
            border-bottom: 4px double #000;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }

        .header-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .header img {
            height: 65px;
            width: auto;
            object-fit: contain;
        }

        .header-text {
            text-align: center;
        }

        .header-text h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #000;
            line-height: 1.2;
        }

        .header-text p {
            margin: 5px 0 0;
            font-size: 13px;
            color: #444;
            font-weight: 500;
        }

        /* --- TABLE --- */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 8px 6px;
            vertical-align: middle;
            text-transform: uppercase;
        }

        th {
            background-color: #eee;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
        }

        .center {
            text-align: center;
        }

        .font-mono {
            font-family: 'Courier New', Courier, monospace;
        }

        /* --- SCORE BOX --- */
        .score-box {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            min-width: 45px;
            text-align: center;
            border: 1px solid #999;
        }

        .score-red {
            background: #fee2e2;
            border-color: #ef4444;
            color: #b91c1c;
        }

        .score-yellow {
            background: #fef9c3;
            border-color: #eab308;
            color: #854d0e;
        }

        .score-green {
            background: #dcfce7;
            border-color: #22c55e;
            color: #15803d;
        }

        /* --- LEGEND --- */
        .legend-container {
            margin-top: 15px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 15px;
            font-size: 10px;
            border: 1px dashed #ccc;
            padding: 8px 15px;
            border-radius: 6px;
            width: fit-content;
            margin-left: auto;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .legend-box {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            border: 1px solid #ccc;
        }

        /* --- FOOTER UPDATE --- */
        .footer {
            margin-top: 30px;
            border-top: 1px solid #eee;
            /* Garis tipis pemisah footer */
            padding-top: 10px;
            font-size: 10px;
            color: #555;

            /* Flexbox Space Between: Kiri Developer, Kanan Sistem */
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .footer-left {
            font-style: normal;
            color: #888;
        }

        .footer-left a {
            color: #555;
            text-decoration: none;
            font-weight: 600;
        }

        .footer-right {
            font-style: italic;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        /* --- BUTTON FAB --- */
        .fab-print-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
        }

        .btn-fab {
            background-color: #2563eb;
            color: white;
            border: none;
            height: 50px;
            padding: 0 20px;
            border-radius: 25px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-fab svg {
            width: 18px;
            height: 18px;
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
                margin: 0;
                padding: 0;
                box-shadow: none;
                border: none;
            }

            .no-print {
                display: none !important;
            }

            @page {
                margin: 1cm;
                size: A4 landscape;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .no-print-link {
                color: inherit !important;
                text-decoration: none !important;
                pointer-events: none !important;
                cursor: default !important;
            }

            .no-print-link[href]:after {
                content: "" !important;
            }
        }
    </style>
</head>

<body>

    <div class="fab-print-container no-print">
        <button onclick="window.print()" class="btn-fab">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak
        </button>
    </div>

    <div class="page-container">

        <div class="header">
            <div class="header-content">
                <img src="{{ asset('images/lms-new-logo-brand.png') }}" alt="LMS eLearning">
                <div class="header-text">
                    <h1>{{ $judul }}</h1>
                    <p>Dicetak pada: {{ $tanggal }}</p>
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="4%">No</th>
                    <th width="10%">NIM</th>
                    <th width="20%">Mahasiswa</th>
                    <th width="12%">Kelas</th>
                    <th width="10%">Tugas<br>Pekanan</th>
                    <th width="10%">Project<br>Semester</th>
                    <th width="10%">Portofolio</th>
                    <th width="10%">Buku / Cv</th>
                    <th width="10%">Sertifikat</th>
                </tr>
            </thead>
            <tbody>
                @forelse($data as $index => $mhs)
                <tr>
                    <td class="center">{{ $loop->iteration }}</td>
                    <td class="center">{{ $mhs['nim'] ?? '-' }}</td>
                    <!-- <td class="center font-mono">{{ $mhs['nim'] ?? '-' }}</td> -->
                    <td>
                        <a
                            class="no-print-link"
                            title="Detail {{ $mhs['name'] }}"
                            style="color: inherit; text-decoration: none;"
                            href="{{ route('my.detail.skl.detail_mahasiswa', ['mahasiswaUuid' => $mhs['mhs_uuid'], 'kelasUuid' => $mhs['kelas_harian_uuid']]) }}" class="link" title="Detail {{ $mhs['name'] }}" target="_blank" rel="noopener noreferrer">
                            {{ $mhs['name'] }}
                        </a>
                    </td>
                    <td>
                        {{ $mhs['nama_kelas'] }}<br>
                        <span style="font-size: 9px; font-style: italic;">({{ $mhs['nama_dosen'] }})</span>
                    </td>

                    @foreach(['pekanan', 'project', 'portofolio', 'buku', 'sertifikat'] as $key)
                    @php
                    $act = $mhs['scores'][$key]['actual'];
                    $tgt = $mhs['scores'][$key]['target'];
                    @endphp
                    <td class="center">
                        @if($tgt > 0)
                        @php
                        $class = 'score-red';
                        if ($act >= $tgt) { $class = 'score-green'; }
                        elseif ($act > 0) { $class = 'score-yellow'; }
                        @endphp
                        <span class="score-box {{ $class }}">
                            {{ $act }} / {{ $tgt }}
                        </span>
                        @else
                        <span style="color: #ccc;">-</span>
                        @endif
                    </td>
                    @endforeach
                </tr>
                @empty
                <tr>
                    <td colspan="9" class="center" style="padding: 30px;">Data tidak ditemukan.</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="legend-container">
            <strong>Keterangan:</strong>
            <div class="legend-item">
                <div class="legend-box score-red"></div><span>Belum Mengerjakan</span>
            </div>
            <div class="legend-item">
                <div class="legend-box score-yellow"></div><span>Sedang Proses</span>
            </div>
            <div class="legend-item">
                <div class="legend-box score-green"></div><span>Sudah Selesai</span>
            </div>
        </div>

        <div class="footer">
            <div class="footer-left">
                Developed by <a href="https://febryann.my.id/" target="_blank">Febryan</a>
            </div>

            <div class="footer-right">
                <span>Dicetak oleh Sistem</span>
                <img src="{{ asset('images/lms-new-logo-brand.png') }}" alt="LMS eLearning" style="height: 14px; width: auto; vertical-align: middle; margin-top: -3px;">
            </div>
        </div>

    </div>

</body>

</html>