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
            padding: 40px; /* Padding layar */
            background-color: #f3f4f6; /* Background abu-abu di layar agar kertas terlihat */
        }

        /* Simulasi Kertas A4 di Layar */
        .page-container {
            background: white;
            max-width: 297mm; /* Lebar A4 Landscape */
            margin: 0 auto;
            padding: 10mm 15mm;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            min-height: 210mm;
        }

        /* --- 1. HEADER / KOP SURAT YANG LEBIH BAGUS --- */
        .header {
            border-bottom: 4px double #000; /* Garis Ganda di bawah */
            padding-bottom: 20px;
            margin-bottom: 25px;
        }

        /* Container Flexbox diubah jadi COLUMN (Menurun) */
        .header-content {
            display: flex;
            flex-direction: column; /* <--- KUNCI: Membuat tumpukan vertikal */
            align-items: center;    /* Rata tengah horizontal */
            justify-content: center;
            gap: 10px;              /* Jarak antara Logo dan Teks */
        }

        .header img {
            height: 65px;           /* Logo diperbesar sedikit karena posisinya sendirian di atas */
            width: auto;
            object-fit: contain;
        }

        .header-text {
            text-align: center;     /* Teks rata tengah */
        }

        .header-text h1 {
            margin: 0;
            font-size: 20px;        /* Font Judul diperbesar sedikit agar seimbang dengan logo */
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
        
        .header-text .sub-info {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
        }

        /* --- TABLE STYLING --- */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            border: 1px solid #000; /* Border Hitam Tegas untuk Print */
            padding: 8px 6px;
            vertical-align: middle;
            text-transform: uppercase;
        }

        th {
            background-color: #eee; /* Abu-abu standar cetak */
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 10px;
        }

        .center { text-align: center; }
        /* .font-mono { font-family: 'Courier New', Courier, monospace; } */

        /* --- SCORE BADGES (KOTAK NILAI) --- */
        .score-box {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            min-width: 45px;
            text-align: center;
            border: 1px solid #999; /* Default border */
        }

        /* Warna Visual (Akan dicetak) */
        .score-red { background: #fee2e2; border-color: #ef4444; color: #b91c1c; } /* Merah */
        .score-yellow { background: #fef9c3; border-color: #eab308; color: #854d0e; } /* Kuning */
        .score-green { background: #dcfce7; border-color: #22c55e; color: #15803d; } /* Hijau */

        /* --- 2. LEGEND / KETERANGAN WARNA --- */
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
            margin-left: auto; /* Dorong ke kanan */
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

        /* --- FOOTER --- */
        .footer {
            margin-top: 30px;
            font-style: italic;
            font-size: 10px;
            text-align: right;
            color: #555;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
        }

        /* --- 3. TOMBOL PRINT (FLOATING STYLE) --- */
        .fab-print-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        }

        .btn-fab {
            background-color: #2563eb;
            color: white;
            border: none;
            height: 56px;
            padding: 0 24px;
            border-radius: 28px;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            transition: transform 0.2s, background-color 0.2s;
        }

        .btn-fab:hover {
            background-color: #1d4ed8;
            transform: translateY(-2px);
        }

        .btn-fab svg { width: 20px; height: 20px; }

        .print-tooltip {
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 11px;
            opacity: 0.8;
        }

        /* --- SETTINGAN KHUSUS SAAT PRINT (CTRL+P) --- */
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
            .no-print { display: none !important; }
            
            @page { margin: 1cm; size: A4 landscape; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
    </style>
</head>

<body>

    <div class="fab-print-container no-print">
        <!-- <div class="print-tooltip">Klik tombol di bawah untuk mencetak / simpan PDF</div> -->
        <button onclick="window.print()" class="btn-fab">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
             Print
        </button>
    </div>

    <div class="page-container">

        <div class="header">
            <div class="header-content">
                <img src="{{ asset('images/lms-new-logo-brand.png') }}" alt="LMS eLearning">
                <div class="header-text">
                    <h1>{{ $judul }}</h1>
                    <p>Dicetak pada: {{ $tanggal }}</p>
                    <!-- <div class="sub-info">Dicetak dari Sistem eLearning</div> -->
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
                    <td class="center font-mono">{{ $mhs['nim'] ?? '-' }}</td>
                    <td>
                        <!-- <div style="font-weight: 700;">{{ $mhs['name'] }}</div> -->
                         {{ $mhs['name'] }}
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
                                    $class = 'score-red'; // Default Merah (0)
                                    if ($act >= $tgt) {
                                        $class = 'score-green'; // Hijau (Selesai)
                                    } elseif ($act > 0) {
                                        $class = 'score-yellow'; // Kuning (Proses)
                                    }
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
                    <td colspan="9" class="center" style="padding: 30px;">
                        Data tidak ditemukan.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="legend-container">
            <strong>Keterangan:</strong>
            <div class="legend-item">
                <div class="legend-box score-red"></div>
                <span>Belum Mengerjakan</span>
            </div>
            <div class="legend-item">
                <div class="legend-box score-yellow"></div>
                <span>Sedang Proses</span>
            </div>
            <div class="legend-item">
                <div class="legend-box score-green"></div>
                <span>Sudah Selesai</span>
            </div>
        </div>

        <div class="footer">
            <span>Dicetak oleh Sistem</span>
            <img src="{{ asset('images/lms-new-logo-brand.png') }}" alt="LMS eLearning" style="height: 14px; width: auto; vertical-align: middle;">
            <!-- <img src="{{ asset('images/new-logo.svg') }}" alt="Logo" style="height: 14px; width: auto; vertical-align: middle;"> -->
        </div>
        
    </div> </body>
</html>