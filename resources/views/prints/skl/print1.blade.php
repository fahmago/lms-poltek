<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>{{ $judul }}</title>
    <link rel="icon" href="{{ asset('images/favicons/favicon.ico') }}" sizes="any">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            margin: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 18px;
            text-transform: uppercase;
        }

        .header p {
            margin: 5px 0 0;
            font-size: 12px;
            color: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #333;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
        }

        .center {
            text-align: center;
        }

        .incomplete {
            color: red;
            font-weight: bold;
        }

        .complete {
            color: green;
        }

        .score-box {
            display: inline-block;
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 10px;
            border: 1px solid #ccc;
            min-width: 30px;
            text-align: center;
        }

        .score-red {
            background: #ffebeb;
            border-color: #ffcccc;
            color: #cc0000;
        }

        .score-green {
            background: #eaffea;
            border-color: #ccffcc;
            color: #008000;
        }

        .footer {
            margin-top: 20px;
            font-style: italic;
            font-size: 10px;
            text-align: right;
        }

        @media print {
            .no-print {
                display: none;
            }

            @page {
                margin: 1cm;
                size: A4 landscape;
            }
        }
    </style>
</head>

<body onload="window.print()">

    <div class="header">
        <h1>{{ $judul }}</h1>
        <p>Dicetak pada: {{ $tanggal }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="3%">No</th>
                <th width="10%">Nim</th>
                <th width="20%">Mahasiswa</th>
                <th width="10%">Kelas</th>
                <th width="10%">Tugas Pekanan</th>
                <th width="10%">Project Semester</th>
                <th width="10%">Portofolio</th>
                <th width="10%">Buku</th>
                <th width="10%">Sertifikat</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $index => $mhs)
            <tr>
                <td class="center">{{ $index + 1 }}</td>
                <td class="center">
                    {{ $mhs['nim'] ?? '-' }}
                </td>
                <td>
                    <strong>{{ $mhs['name'] }}</strong>
                    <!-- <small>{{ $mhs['nim'] }}</small> -->
                </td>
                <td>
                    {{ $mhs['nama_kelas'] }}<br>
                    ({{ $mhs['nama_dosen'] }})
                </td>

                @foreach(['pekanan', 'project', 'portofolio', 'buku', 'sertifikat'] as $key)
                @php
                $act = $mhs['scores'][$key]['actual'];
                $tgt = $mhs['scores'][$key]['target'];
                $isDone = $act >= $tgt;
                @endphp
                <td class="center">
                    @if($tgt > 0)
                    <span class="score-box {{ $isDone ? 'score-green' : 'score-red' }}">
                        {{ $act }} / {{ $tgt }}
                    </span>
                    @else
                    -
                    @endif
                </td>
                @endforeach
            </tr>
            @empty
            <tr>
                <td colspan="8" class="center">Tidak ada data ditampilkan.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <!-- <div class="footer">
        Dicetak oleh Sistem <img src="{{ asset('images/new-logo.svg') }}" alt="Logo Kampus">
        Dicetak oleh Sistem Akademik - {{ config('app.name') }}
    </div> -->
    <div class="footer">
        Dicetak oleh Sistem
        <img src="{{ asset('images/new-logo.svg') }}" alt="Logo Kampus" style="height: 15px; width: auto; vertical-align: middle; margin-top: -5px;">
    </div>

</body>

</html>