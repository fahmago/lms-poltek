<table border="1">
    <thead>
        <tr>
            <th>No.</th>
            <th>NIM</th>
            <th>Nama Mahasiswa</th>
            @foreach ($jadwals as $jadwal)
                <th>
                    <!-- {{ \Illuminate\Support\Str::substr(\Carbon\Carbon::parse($jadwal['tanggal'])->translatedFormat('l'), 0, 3) }}
                    {{ \Carbon\Carbon::parse($jadwal['tanggal'])->format('d') }} -->
                    {{ \Carbon\Carbon::parse($jadwal['tanggal'])->format('d/m') }}
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
                <td>{{ $item->mahasiswa->user->name }}</td>
                @foreach ($jadwals as $jadwal)
                    <td>{{ $jadwal['absensi'][$item->mahasiswa->id]['status'] ?? '-' }}</td>
                @endforeach
            </tr>
        @endforeach
    </tbody>
</table>
