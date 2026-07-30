<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Laporan SKL - {{ $mahasiswa->user->name ?? 'Mahasiswa' }}</title>
    <link rel="icon" href="{{ asset('images/favicons/favicon.ico') }}" sizes="any">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/style_detail_mahasiswa.css')}}">
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
    window.dataSkl = <?php echo json_encode($chartData); ?>;
    window.dataAtt = <?php echo json_encode($attendanceChart ?? ['labels' => [], 'sakit' => [], 'izin' => [], 'alpha' => []]); ?>;
    window.dataIbadah = <?php echo json_encode($ibadahSummary); ?>;
</script>

<!-- <script src="/js/charts/sklChart.js"></script>
<script src="/js/charts/attendanceChart.js"></script>
<script src="/js/charts/ibadahChart.js"></script> -->

        <!-- <script>
            window.chartData = {
                skl: <?= json_encode($chartData); ?>,
                attendance: <?= json_encode($attendanceChart ?? ['labels' => [], 'sakit' => [], 'izin' => [], 'alpha' => []]); ?>,
                ibadah: <?= json_encode($ibadahSummary); ?>
            };
        </script>
        <script src="/js/charts/sklChart.js"></script>
<script src="/js/charts/attendanceChart.js"></script>
<script src="/js/charts/ibadahChart.js"></script> -->
        @vite(['public/js/charts/sklChart.js', 'public/js/charts/attendanceChart.js', 'public/js/charts/ibadahChart.js'])

</body>

</html>