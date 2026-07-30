<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.cdnfonts.com/css/bankgothic-md-bt" rel="stylesheet">
    <link rel="icon" href="{{ asset('images/favicons/favicon.ico') }}" sizes="any">
    <style>
        html,
        body {
            overflow: auto;
        }

        /* Common styles */
        #page-khs {
            /* font-family: Tahoma, Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 1.0cm;
            position: relative;
            min-height: 100vh; */
            font-family: Tahoma, Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 1.0cm;
        }

        .header-khs {
            margin-bottom: 10px;
        }

        .header-khs img {
            float: left;
            margin-right: 10px;
            width: 2cm;
        }

        .header-khs h1 {
            font-family: BankGothicMediumBT, sans-serif;
            text-transform: uppercase;
            font-size: 20px;
            padding-top: 10px;
            margin: 0;
        }

        .header-khs h3 {
            text-transform: uppercase;
            font-size: 12px;
            margin: 0;
        }

        h2 {
            font-size: 18px;
            text-align: center;
            margin: 20px 0;
        }

        .table-common {
            font-size: 11px;
            border-collapse: collapse;
            margin: 20px 0;
        }

        .table-common td {
            vertical-align: top;
            padding: 0px 15px 3px 0px;
        }

        .table-khs {
            border: 1px solid #000;
            font-size: 11px;
            border-collapse: collapse;
            width: 100%;
        }

        .table-khs th,
        .table-khs td {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }

        .table-khs th {
            background-color: #eee;
        }

        .no-data {
            text-align: center;
            font-weight: bold;
            color: red;
            margin: 20px 0;
        }

        .signature {
            position: absolute;
            /* bottom: 2cm; */
            margin-top: 40px;
            right: 2cm;
            text-align: center;
        }

        .signature p {
            margin: 0;
        }

        .signature .name {
            margin-top: 70px;
            font-weight: bold;
            text-decoration: underline;
        }

        /* Watermark */
        .watermark-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }

        .watermark-text {
            position: absolute;
            color: rgba(0, 0, 0, 0.07);
            font-size: 13px;
            font-family: 'Poppins', sans-serif;
            white-space: nowrap;
            transform: rotate(-30deg);
            user-select: none;
            line-height: 1.4;
        }

        @media print {
            @page {
                size: landscape;
                /* Mengatur orientasi halaman ke landscape */
                /* margin: 1cm;  Mengatur margin halaman */
            }

            body {
                -webkit-print-color-adjust: exact;
                /* Memastikan warna dicetak sesuai */
                color-adjust: exact;
                /* Alternatif untuk browser modern */
            }

             .watermark-container {
                position: fixed;
                z-index: 0 !important;
            }

            .watermark-text {
                color: rgba(0, 0, 0, 0.12);
            }
        }

        .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 28px;
            font-size: 16px;
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 45px;
            border: none;
            text-decoration: none;
            z-index: 9999;
        }
    </style>
</head>

<body>
    <button id="btnPrint" onclick="prints()" class="button">Print</button>
    <div id="page-khs">
        <!-- Header -->
        <div class="header-khs">
            <img src="{{ asset('images/poltek-idn.png') }}" alt="logo">
            <h1>Politeknik IDN Bogor</h1>
            <h3> {{ $kelas->dosen->prodi->nama_prodi }} </h3>
        </div>

        <h2>REKAP PRESENSI</h2>

        <table class="table-common">
            <tbody>
                <tr>
                    <td>Kode Kelas</td>
                    <td>:</td>
                    <td>{{ $kelas->kode_kelas_harian }}</td>
                </tr>
                <tr>
                    <td>Nama Kelas</td>
                    <td>:</td>
                    <td>{{ $kelas->nama_kelas }}</td>
                </tr>
                <tr>
                    <td>Semester / Tahun</td>
                    <td>:</td>
                    <td>{{ $kelas->semester }} / {{ $kelas->tahun }}</td>
                </tr>
                <tr>
                    <td>Dosen Pengampu</td>
                    <td>:</td>
                    <td>{{ $kelas->dosen->user->name }}</td>
                </tr>
                <tr>
                    <td>Rekap Absensi</td>
                    <td>:</td>
                    <td>{{ \Carbon\Carbon::parse($month)->translatedFormat('F Y') }}</td>
                </tr>
            </tbody>
        </table>

        @if ($mahasiswa->isEmpty())
        <p class="no-data">Belum ada data mahasiswa untuk kelas ini.</p>
        @elseif (empty($jadwals))
        <p class="no-data">Belum ada jadwal untuk bulan yang dipilih.</p>
        @else
        <table class="table-khs">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>NIM</th>
                    <th>Nama Mahasiswa</th>
                    @php $index = 1; @endphp
                    @foreach ($jadwals as $jadwal)
                    <th>
                        {{ \Illuminate\Support\Str::substr(\Carbon\Carbon::parse($jadwal['tanggal'])->translatedFormat('l'), 0, 3) }}
                        {{ \Carbon\Carbon::parse($jadwal['tanggal'])->format('d') }}
                        <!-- {{ \Carbon\Carbon::parse($jadwal['tanggal'])->format('d/m') }} -->
                    </th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @php $a = 1; @endphp
                @foreach ($mahasiswa as $item)
                <tr>
                    <td>{{$a++}}</td>
                    <td>{{ $item->mahasiswa->nim ?? '-' }}</td>
                    <td style="text-align: left !important;">{{ $item->mahasiswa->user->name }}</td>
                    @foreach ($jadwals as $jadwal)
                    <td>{{ $jadwal['absensi'][$item->mahasiswa->id]['status'] ?? '-' }}</td>
                    @endforeach
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif

        <div class="signature">
            @php
            $akhirBulanRekap = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth();
            $tanggalCetak = now()->greaterThan($akhirBulanRekap) ? $akhirBulanRekap : now();
            @endphp
            <p>Bogor, {{ $tanggalCetak->translatedFormat('d F Y') }}</p>

            <!-- <p>Bogor, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p> -->
            <p>Mengetahui,</p>
            <p class="name">{{ $kelas->dosen->user->name }}</p>
        </div>
    </div>

    <div class="watermark-container" id="watermark"></div>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        const watermarkContainer = document.getElementById("watermark");

        const email = @json(auth()->user()->email ?? 'https://febryann.my.id');

        const now = new Date();

        // Format tanggal ke: 21-10-2025 14.36.29
        const pad = (n) => n.toString().padStart(2, '0');
        const formattedDate = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`;

        const text = `${email} • ${formattedDate}`;

        // Jumlah watermark horizontal dan vertikal
        const cols = 6;
        const rows = 10;

        const xSpacing = window.innerWidth / cols;
        const ySpacing = window.innerHeight / rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const span = document.createElement('span');
                span.className = 'watermark-text';
                span.textContent = text;

                // Selang-seling biar watermark tidak sejajar kaku
                span.style.top = `${i * ySpacing + (j % 2 === 0 ? 25 : 0)}px`;
                span.style.left = `${j * xSpacing}px`;

                watermarkContainer.appendChild(span);
            }
        }
    });
</script>



    <script>
        function prints() {

            document.getElementById('btnPrint').style.display = "none";
            window.print();
            window.onafterprint = show();
        }

        function back() {
            window.location = 'report';
        }

        function show() {
            document.getElementById('btnBack').style.display = "inline";
            document.getElementById('btnPrint').style.display = "inline";
        }
    </script>
</body>

</html>