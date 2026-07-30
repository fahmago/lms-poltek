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

        #page-khs {
            font-family: Tahoma, Arial, Helvetica, sans-serif;
            font-size: 11px;
            padding: 1.0cm;
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
            margin-top: 20px;
            padding-bottom: 20px;
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

        /* Tabel kecil (keterangan ketidakhadiran) */
        .table-keterangan {
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 11px;
            width: auto;
            min-width: 30%;
        }

        .table-keterangan th,
        .table-keterangan td {
            border: 1px solid #000;
            padding: 5px 8px;
            text-align: center;
        }

        /* Kolom No */
        .table-keterangan th:nth-child(1),
        .table-keterangan td:nth-child(1) {
            width: 10px;
            /* lebih kecil */
        }

        /* Kolom Nama Mahasiswa */
        .table-keterangan th:nth-child(2),
        .table-keterangan td:nth-child(2) {
            text-align: left;
            width: 100px;
            /* panjang utama */
            white-space: nowrap;
        }

        /* Kolom Alpha, Izin, Sakit */
        .table-keterangan th:nth-child(3),
        .table-keterangan th:nth-child(4),
        .table-keterangan th:nth-child(5),
        .table-keterangan td:nth-child(3),
        .table-keterangan td:nth-child(4),
        .table-keterangan td:nth-child(5) {
            width: 25px;
            /* kecil tapi muat */
        }

        /* Kolom Total */
        .table-keterangan th:nth-child(6),
        .table-keterangan td:nth-child(6) {
            width: 45px;
            /* sedikit lebih besar */
        }

        .table-keterangan th {
            background-color: #f7f7f7;
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
            }

            /* body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            } */
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
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
            <h3>{{ $kelas->dosen->prodi->nama_prodi }}</h3>
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
                    @foreach ($jadwals as $jadwal)
                    <th>
                        {{ \Illuminate\Support\Str::substr(\Carbon\Carbon::parse($jadwal['tanggal'])->translatedFormat('l'), 0, 3) }}
                        {{ \Carbon\Carbon::parse($jadwal['tanggal'])->format('d') }}
                    </th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @php $a = 1; @endphp
                @foreach ($mahasiswa as $item)
                <tr>
                    <td>{{ $a++ }}</td>
                    <td>{{ $item->mahasiswa->nim ?? '-' }}</td>
                    <td style="text-align: left !important;">{{ $item->mahasiswa->user->name }}</td>
                    @foreach ($jadwals as $jadwal)
                    <td>{{ $jadwal['absensi'][$item->mahasiswa->id]['status'] ?? '-' }}</td>
                    @endforeach
                </tr>
                @endforeach
            </tbody>
        </table>

        @php
        $showKeterangan = false; // default: tidak tampil
        foreach ($mahasiswa as $mhs) {
        $alpha = $izin = $sakit = 0;
        foreach ($jadwals as $jadwal) {
        $status = $jadwal['absensi'][$mhs->mahasiswa->id]['status'] ?? '-';
        if ($status === 'A') $alpha++;
        elseif ($status === 'I') $izin++;
        elseif ($status === 'S') $sakit++;
        }
        $total = $alpha + $izin + $sakit;
        if ($total > 0) {
        $showKeterangan = true;
        break; // langsung keluar jika sudah ada yang tidak hadir
        }
        }
        @endphp

        @if ($showKeterangan)
        <table class="table-keterangan" style="border-collapse: collapse; width: auto; font-size: 11px;">
            <thead>
                <tr>
                    <th colspan="6"
                        style="padding-bottom: 8px; padding-left: 0px; text-align: left; border-top: none; border-left: none; border-right: none; border-bottom: 1px solid #000; font-weight: bold; background-color: #ffffff;">
                        RINGKASAN :
                    </th>
                </tr>
                <tr>
                    <th style="border: 1px solid #000; width: 25px;">No</th>
                    <th style="border: 1px solid #000; text-align: center; width: 180px;">Nama Mahasiswa</th>
                    <th style="border: 1px solid #000; width: 35px;">A</th>
                    <th style="border: 1px solid #000; width: 35px;">I</th>
                    <th style="border: 1px solid #000; width: 35px;">S</th>
                    <th style="border: 1px solid #000; width: 45px;">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                @php $no = 1; @endphp
                @foreach ($mahasiswa as $mhs)
                @php
                $alpha = $izin = $sakit = 0;
                foreach ($jadwals as $jadwal) {
                $status = $jadwal['absensi'][$mhs->mahasiswa->id]['status'] ?? '-';
                if ($status === 'A') $alpha++;
                elseif ($status === 'I') $izin++;
                elseif ($status === 'S') $sakit++;
                }
                $total = $alpha + $izin + $sakit;
                @endphp
                @if ($total > 0)
                <tr>
                    <td style="border: 1px solid #000; text-align: center;">{{ $no++ }}</td>
                    <td style="border: 1px solid #000; text-align: left;">{{ $mhs->mahasiswa->user->name }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $alpha }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $izin }}</td>
                    <td style="border: 1px solid #000; text-align: center;">{{ $sakit }}</td>
                    <td style="border: 1px solid #000; text-align: center; font-weight: bold;">{{ $total }}</td>
                </tr>
                @endif
                @endforeach
            </tbody>
        </table>
        @endif

        @endif

        <!-- Signature -->
        <!-- <div class="signature">
            @php
            $akhirBulanRekap = \Carbon\Carbon::createFromFormat('Y-m', $month)->endOfMonth();
            $tanggalCetak = now()->greaterThan($akhirBulanRekap) ? $akhirBulanRekap : now();
            @endphp
            <p>Bogor, {{ $tanggalCetak->translatedFormat('d F Y') }}</p>
            <p>Mengetahui,</p>
            <p class="name">{{ $kelas->dosen->user->name }}</p>
        </div> -->
        @php
        use Carbon\Carbon;

        // Ambil akhir bulan dari $month (format Y-m)
        $akhirBulanRekap = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        // Tentukan tanggal cetak: kalau belum lewat akhir bulan, pakai hari ini; kalau sudah, pakai akhir bulan
        $tanggalCetak = now()->greaterThan($akhirBulanRekap) ? $akhirBulanRekap : now();

        // Jika tanggal jatuh pada Sabtu (6) atau Minggu (0), mundurkan ke Jumat (5)
        if ($tanggalCetak->isSaturday()) {
        $tanggalCetak->subDay(); // Sabtu → Jumat
        } elseif ($tanggalCetak->isSunday()) {
        $tanggalCetak->subDays(2); // Minggu → Jumat
        }

        $stempel = match ($kelas->dosen->prodi->nama_prodi) {
        'Teknologi Rekayasa Perangkat Lunak' => 'stempel_trpl.png',
        'Teknologi Rekayasa Komputer Jaringan' => 'stempel_trkj.png',
        default => 'stempel_trmg.png',
        };
        @endphp

        <div class="signature">
            <p>Bogor, {{ $tanggalCetak->translatedFormat('d F Y') }}</p>
            <p>Mengetahui,</p>
            <div style="
                    position: relative;
                    z-index: 10;
                    width: 120px;
                    height: 120px;
                    background-image: url('<?= asset("images/$stempel"); ?>');
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    opacity: 0.85;
                    margin-bottom: -85px;
                    margin-left: -60px;
                    transform: rotate(-12deg);
                    pointer-events: none;">
            </div>
            <p class="name">{{ $kelas->dosen->user->name }}</p>
        </div>
    </div>

    <div class="watermark-container" id="watermark"></div>
    <?php
    $email = Illuminate\Support\Facades\Auth::user()->email ?? 'https://febryann.my.id';
    ?>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const watermarkContainer = document.getElementById("watermark");
            const email = <?= json_encode($email); ?>;
            const now = new Date();
            const pad = (n) => n.toString().padStart(2, '0');
            const formattedDate = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`;
            const text = `${email} • ${formattedDate}`;
            const cols = 6,
                rows = 10;
            const xSpacing = window.innerWidth / cols;
            const ySpacing = window.innerHeight / rows;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const span = document.createElement('span');
                    span.className = 'watermark-text';
                    span.textContent = text;
                    span.style.top = `${i * ySpacing + (j % 2 === 0 ? 25 : 0)}px`;
                    span.style.left = `${j * xSpacing}px`;
                    watermarkContainer.appendChild(span);
                }
            }
        });

        function prints() {
            document.getElementById('btnPrint').style.display = "none";
            window.print();
            window.onafterprint = () => document.getElementById('btnPrint').style.display = "inline";
        }
    </script>
</body>

</html>