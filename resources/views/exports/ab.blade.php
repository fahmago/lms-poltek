<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <!-- Judul -->
    <h2 style="text-align: center;">REKAP PRESENSI</h2>

    <!-- Metadata Kelas -->
    <table>
        <tr>
            <td><strong>Kode Kelas</strong></td>
            <td>: {{ $kelas->kode_kelas_harian }}</td>
        </tr>
        <tr>
            <td><strong>Nama Kelas</strong></td>
            <td>: {{ $kelas->nama_kelas }}</td>
        </tr>
        <tr>
            <td><strong>Semester / Tahun</strong></td>
            <td>: {{ $kelas->semester }} / {{ $kelas->tahun }}</td>
        </tr>
        <tr>
            <td><strong>Dosen Pengampu</strong></td>
            <td>: {{ $kelas->dosen->user->name }}</td>
        </tr>
        <tr>
            <td><strong>Rekap Absensi</strong></td>
            <td>: {{ \Carbon\Carbon::parse($month)->translatedFormat('F Y') }}</td>
        </tr>
    </table>

    <br>

    <!-- Tabel Absensi -->
    <table border="1">
        <thead>
            <tr>
                <th style="background: #f8f9fa; font-weight: bold;">No.</th>
                <th style="background: #f8f9fa; font-weight: bold;">NIM</th>
                <th style="background: #f8f9fa; font-weight: bold;">Nama Mahasiswa</th>
                @foreach ($jadwals as $jadwal)
                    <th style="background: #f8f9fa; font-weight: bold;">
                        {{ \Carbon\Carbon::parse($jadwal['tanggal'])->format('d') }}
                    </th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach ($mahasiswa as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $item->mahasiswa->nim ?? '-' }}</td>
                    <td>{{ $item->mahasiswa->user->name }}</td>
                    @foreach ($jadwals as $jadwal)
                        <td>{{ $jadwal['absensi'][$item->mahasiswa->id]['status'] ?? '-' }}</td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <br>

    <!-- Tanda Tangan -->
    <p style="text-align: right;">Bogor, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}</p>
    <p style="text-align: right;">Mengetahui,</p>
    <br>
    <br>
    <br>
    <p style="text-align: right; font-weight: bold; text-decoration: underline;">
        {{ $kelas->dosen->user->name }}
    </p>
</body>
</html>
