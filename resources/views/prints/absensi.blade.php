<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Absensi - {{ $kelas->nama_kelas }}</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        /* General Styling */
        body {
            font-family: 'Times New Roman', serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            background-color: #fff;
        }

        .no-print {
            display: none;
        }

        /* Header Styling */
        .header {
            text-align: left;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 2rem;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .header p {
            font-size: 1rem;
            margin: 5px 0;
            color: #333;
        }

        /* Table Styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 1rem;
            color: #333;
        }

        th, td {
            padding: 10px;
            border: 1px solid #000;
            text-align: left;
        }

        th {
            background-color: #f7f7f7;
            font-weight: bold;
        }

        td {
            text-align: left;
        }

        /* Footer Styling */
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.875rem;
            color: #333;
            font-style: italic;
        }

        @media print {
            @page {
                size: A4 landscape;
                /* margin: 10mm; */
            }
            
        }

    </style>
</head>
<body class="bg-white">

    <!-- Header Section -->
    <div class="header">
        <h1 style="text-align: center;">Absensi Perkuliahan</h1>
        <p><strong>Kelas:</strong> {{ $kelas->nama_kelas }}</p>
        <p><strong>Mata Kuliah:</strong> {{ $kelas->matkul->nama_matkul }}</p>
        <p><strong>Dosen Pengampu:</strong> {{ $kelas->dosen->user->name }}</p>
    </div>

    <!-- Table Section -->
    <table>
        <thead>
            <tr>
                <th class="text-center w-12">No</th>
                <th class="text-center w-12">Nim</th>
                <th class="text-left">Nama Mahasiswa</th>
                @php $index = 1; $a = 1;@endphp
                @foreach ($jadwals as $jadwal)
                    <th class="text-center">
                        P{{$index++}}
                    </th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach ($mahasiswa as $index => $item)
                <tr>
                    <!-- <td class="text-center">{{ $index + 1 }}</td> -->
                    <td class="text-center">{{$a++}}</td>
                    <td class="text-center">13020180047</td>
                    <td>{{ $item->mahasiswa->user->name }}</td>
                    @foreach ($jadwals as $jadwal)
                        <td class="text-center">
                            {{ $jadwal['absensi'][$item->mahasiswa->id] ?? 'A' }}
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- Footer Section -->
    <div class="footer no-print">
        <p>Dicetak pada: <span class="font-semibold">{{ now()->format('d M Y') }}</span></p>
        <p class="text-sm text-gray-600">Mohon untuk memeriksa kehadiran dengan seksama.</p>
    </div>

    <!-- Print Button (only visible in screen view) -->
    <div class="no-print text-center mt-5">
        <button onclick="window.print()" class="px-6 py-2 bg-blue-600 text-white rounded-lg">Cetak Absensi</button>
    </div>
</body>
</html>
