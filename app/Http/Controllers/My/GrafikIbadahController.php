<?php

namespace App\Http\Controllers\My;

use App\Helpers\AbsensiHelper;
use App\Helpers\AvatarHelper;
use App\Helpers\IbadahHelper;
use App\Helpers\SklHelper;
use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\KategoriKelasHarian;
use App\Models\Harian\KelasHarian;
use App\Models\Ibadah\LaporanIbadah;
use App\Models\Ibadah\Pertanyaan;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class GrafikIbadahController extends Controller
{
    public function index(Request $request)
    {
        $kategoriList = KategoriKelasHarian::where('jenis', 'IT')->orderBy('nama_kategori', 'asc')->get(['id', 'nama_kategori']);
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get(['id', 'tahun_angkatan', 'nama_angkatan']);

        return inertia('My/Grafik/LaporanIbadah/Index', [
            'kategoriList' => $kategoriList,
            'angkatans' => $angkatans,
        ]);
    }

    public function getClasses(Request $request)
    {
        $data = $request->validate([
            'tahun_angkatan' => 'required|exists:angkatans,tahun_angkatan',
            'kategori_id' => 'required|integer|exists:kategori_kelas_harians,id',
            'semester' => 'required|integer|between:1,8',
        ]);

        $classes = KelasHarian::where('tahun', $data['tahun_angkatan'])
            ->where('semester', $data['semester'])
            ->where('kategori_kelas_harian_id', $data['kategori_id'])
            ->with('dosen.user')
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $formattedClasses = $classes->map(function ($kelas) {
            return [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
                'nama_dosen' => $kelas->dosen->user->name ?? 'Dosen N/A',
            ];
        });

        return response()->json($formattedClasses);
    }

    public function getIbadahScoreData1(Request $request)
    {
        // 1. Validasi (Sama)
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
            'range' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // 2. Tentukan Rentang Tanggal (Sama)
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
        } else {
            $range = $request->query('range', 7);
            $startDate = Carbon::now()->subDays($range - 1)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
        }
        $dateRangeString = $startDate->isoFormat('D MMM YYYY') . ' - ' . $endDate->isoFormat('D MMM YYYY');
        $jumlahHari = (int) $startDate->diffInDays($endDate) + 1;

        // 3. Hitung Poin Standar Harian (Sama)
        $maxPoinHarian = Pertanyaan::where('kategori', 'umum')
            ->distinct('id')
            ->with('pilihanJawabans')
            ->get()
            ->sum(fn($pertanyaan) => $pertanyaan->pilihanJawabans->max('poin') ?? 0);
        $totalStandardPoin_Max = $maxPoinHarian * $jumlahHari;

        // 4. Dapatkan ID Mahasiswa (Sama)
        $mahasiswaIds = DB::table('kelas_harian_mahasiswas')
            ->whereIn('kelas_harian_id', $validated['kelas_harian_ids'])
            ->distinct()
            ->pluck('mahasiswa_id');

        // --- 5. PERSIAPAN SUBQUERY (BARU) ---
        // Buat subquery untuk menghitung total poin akurat PER LAPORAN
        // Ini adalah SUM() dari jawaban_laporans
        $poinAkuratPerLaporan = DB::table('jawaban_laporans')
            ->select('laporan_ibadah_id', DB::raw('SUM(poin_didapat) as poin_akurat'))
            ->groupBy('laporan_ibadah_id');

        // --- 6. QUERY UTAMA (DIPERBARUI) ---
        $scores = Mahasiswa::whereIn('mahasiswas.id', $mahasiswaIds)
            ->join('users', 'mahasiswas.user_id', '=', 'users.id')

            // Join 1: Mahasiswa -> Laporan Ibadah (dalam rentang)
            ->leftJoin('laporan_ibadahs', function ($join) use ($startDate, $endDate) {
                $join->on('laporan_ibadahs.mahasiswa_id', '=', 'mahasiswas.id')
                    ->whereBetween('laporan_ibadahs.tanggal_laporan', [$startDate, $endDate]);
            })

            // Join 2: Laporan Ibadah -> Subquery Poin Akurat
            ->leftJoinSub($poinAkuratPerLaporan, 'poin_per_laporan', function ($join) {
                $join->on('laporan_ibadahs.id', '=', 'poin_per_laporan.laporan_ibadah_id');
            })

            ->select(
                'users.name as nama_mahasiswa',
                'mahasiswas.uuid as mhs_uuid',
                'mahasiswas.nim',
                'mahasiswas.gender',

                // --- PERUBAHAN 1 ---
                // Hitung SUM dari 'poin_akurat' subquery. Ini 100% akurat.
                DB::raw('COALESCE(SUM(poin_per_laporan.poin_akurat), 0) as total_poin'),

                // --- PERUBAHAN 2 ---
                // Kita tidak lagi join ke 'jawaban_laporans', jadi COUNT biasa sudah cukup
                DB::raw('COUNT(laporan_ibadahs.id) as total_laporan'),
                DB::raw("COUNT(CASE WHEN laporan_ibadahs.is_haid = 1 AND mahasiswas.gender = 'P' THEN 1 END) as total_haid"),

                // --- PERUBAHAN 3 ---
                // GROUP_CONCAT untuk tanggal haid (tidak perlu DISTINCT)
                DB::raw("GROUP_CONCAT(
                            CASE WHEN laporan_ibadahs.is_haid = 1 AND mahasiswas.gender = 'P' 
                            THEN DATE_FORMAT(laporan_ibadahs.tanggal_laporan, '%d-%m-%Y') 
                            END ORDER BY laporan_ibadahs.tanggal_laporan ASC SEPARATOR ', '
                        ) as dates_haid"),

                // --- PERUBAHAN 4 ---
                // CONCAT 'poin_akurat' dari subquery. Ini 100% akurat.
                DB::raw("GROUP_CONCAT(
                            CONCAT(
                                DATE_FORMAT(laporan_ibadahs.tanggal_laporan, '%d-%m-%Y'), 
                                ':', 
                                laporan_ibadahs.uuid,
                                ':',
                                COALESCE(poin_per_laporan.poin_akurat, 0)
                            ) 
                            ORDER BY laporan_ibadahs.tanggal_laporan ASC SEPARATOR ';'
                        ) as dates_and_uuids")
            )
            ->groupBy('mahasiswas.id', 'users.name', 'mahasiswas.nim', 'mahasiswas.gender')
            ->get();

        // 7. Cek jika ada mahasiswi (Sama)
        $hasFemaleStudents = $scores->where('gender', 'P')->isNotEmpty();

        // 8. Hitung Poin Standar & Persentase (Sama)
        // Logika ini sudah Sempurna dan sekarang menerima total_poin yang akurat
        $scores = $scores->map(function ($score) use ($maxPoinHarian, $jumlahHari) {
            $score->total_poin = (int) $score->total_poin;
            $score->total_laporan = (int) $score->total_laporan;
            $score->total_haid = (int) $score->total_haid;
            $hariStandar = $jumlahHari;
            if ($score->gender === 'P') {
                $hariStandar = $jumlahHari - $score->total_haid;
            }
            $hariStandar = max(0, $hariStandar);
            $score->poin_standar_individu = $maxPoinHarian * $hariStandar;
            $persentase = 0;
            if ($score->poin_standar_individu > 0) {
                $persentase = ($score->total_poin / $score->poin_standar_individu) * 100;
            } else {
                if ($score->total_haid >= $jumlahHari && $score->gender === 'P') {
                    $persentase = 100.0;
                } else {
                    $persentase = 0.0;
                }
            }
            $score->persentase = round($persentase, 1);

            if ($score->persentase >= 100) {
                $score->status_standar = "Optimal";
            } elseif ($score->persentase >= 80) {
                $score->status_standar = "Cukup";
            } else {
                $score->status_standar = "Kurang";
            }

            if ($score->status_standar === "Optimal") {
                $score->backgroundColor = 'rgba(59, 130, 246, 0.6)'; // Biru
                $score->borderColor = 'rgba(59, 130, 246, 1)';
            } elseif ($score->status_standar === "Cukup") {
                $score->backgroundColor = 'rgba(34, 197, 94, 0.6)'; // Hijau
                $score->borderColor = 'rgba(34, 197, 94, 1)';
            } else { // "Belum"
                $score->backgroundColor = 'rgba(239, 68, 68, 0.6)'; // Merah
                $score->borderColor = 'rgba(239, 68, 68, 1)';
            }
            return $score;
        });

        $scores = $scores->sortByDesc('persentase')->values();

        // 9. Format Data Chart (Sama)
        $chartData = [
            'labels' => $scores->pluck('nama_mahasiswa'),
            'datasets' => [
                [
                    'label' => 'Persentase Poin Ibadah',
                    'data' => $scores->pluck('persentase'),
                    'backgroundColor' => $scores->pluck('backgroundColor'),
                    'borderColor' => $scores->pluck('borderColor'),
                    'borderWidth' => 1,
                ],
            ],
        ];

        // 10. Statistik Keseluruhan (Sama)
        $totalPoinDidapat = $scores->sum('total_poin');
        $totalStandarMaksimal = $scores->sum('poin_standar_individu');
        $rataRataPersen = $totalStandarMaksimal > 0 ? round(($totalPoinDidapat / $totalStandarMaksimal) * 100) : 0;
        $jumlahMahasiswa = $scores->count();
        $totalHaidReports = $scores->sum('total_haid');
        $overallStats = [
            ['label' => 'POIN STANDAR', 'percentage' => $totalStandardPoin_Max, 'color' => 'bg-green-500'],
            ['label' => 'PERSEN RATA-RATA', 'percentage' => $rataRataPersen, 'color' => 'bg-cyan-500'],
            ['label' => 'TOTAL POIN', 'percentage' => $totalPoinDidapat, 'color' => 'bg-blue-500'],
            ['label' => 'JML. MAHASISWA', 'percentage' => $jumlahMahasiswa, 'color' => 'bg-yellow-500'],
        ];
        if ($hasFemaleStudents) {
            $overallStats[] = ['label' => 'LAPORAN HAID', 'percentage' => $totalHaidReports, 'color' => 'bg-pink-500'];
        }

        // 11. Kembalikan Response (Sama)
        return response()->json([
            'chartData' => $chartData,
            'studentRecap' => $scores,
            'overallStats' => $overallStats,
            'dateRange' => $dateRangeString,
            'hasFemaleStudents' => $hasFemaleStudents,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }

    public function getIbadahScoreData(Request $request)
    {
        // 1. Validasi
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
            'range' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        // 2. Tentukan Rentang Tanggal
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->query('start_date'))->startOfDay();
            $endDate = Carbon::parse($request->query('end_date'))->endOfDay();
        } else {
            $range = $request->query('range', 7);
            $startDate = Carbon::now()->subDays($range - 1)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
        }

        $dateRangeString = $startDate->isoFormat('D MMM YYYY') . ' - ' . $endDate->isoFormat('D MMM YYYY');
        $jumlahHari = (int) $startDate->diffInDays($endDate) + 1;

        // 3. Hitung Poin Standar Harian
        $maxPoinHarian = Pertanyaan::where('kategori', 'umum')
            ->with('pilihanJawabans')
            ->get()
            ->sum(fn($pertanyaan) => $pertanyaan->pilihanJawabans->max('poin') ?? 0);

        $totalStandardPoin_Max = $maxPoinHarian * $jumlahHari;

        // 4. Dapatkan ID Mahasiswa
        $mahasiswaIds = DB::table('kelas_harian_mahasiswas')
            ->whereIn('kelas_harian_id', $validated['kelas_harian_ids'])
            ->distinct()
            ->pluck('mahasiswa_id');

        // 5. SUBQUERY POIN PER LAPORAN (Tetap)
        $poinAkuratPerLaporan = DB::table('jawaban_laporans')
            ->select('laporan_ibadah_id', DB::raw('SUM(poin_didapat) as poin_akurat'))
            ->groupBy('laporan_ibadah_id');

        // --- PERBAIKAN DI SINI (6. SUBQUERY KELAS & DOSEN) ---
        // Kita gunakan GROUP_CONCAT agar jika mhs punya banyak kelas, namanya digabung koma
        // Dan kita filter berdasarkan kelas_harian_ids yang diminta saja
        $kelasInfoSub = DB::table('kelas_harian_mahasiswas')
            ->whereIn('kelas_harian_mahasiswas.kelas_harian_id', $validated['kelas_harian_ids']) // Filter hanya kelas yg dipilih
            ->join('kelas_harians', 'kelas_harians.id', '=', 'kelas_harian_mahasiswas.kelas_harian_id')
            ->join('dosens', 'dosens.id', '=', 'kelas_harians.dosen_id')
            ->join('users as dosen_users', 'dosen_users.id', '=', 'dosens.user_id')
            ->select(
                'kelas_harian_mahasiswas.mahasiswa_id',
                // Gabungkan nama kelas jika lebih dari 1
                DB::raw("GROUP_CONCAT(DISTINCT kelas_harians.nama_kelas SEPARATOR ', ') as nama_kelas_gabungan"),
                // Gabungkan nama dosen jika lebih dari 1
                DB::raw("GROUP_CONCAT(DISTINCT dosen_users.name SEPARATOR ', ') as nama_dosen_gabungan"),
                // UUID Kelas (TAMBAHAN DISINI)
                DB::raw("GROUP_CONCAT(DISTINCT kelas_harians.uuid SEPARATOR ', ') as kelas_uuid_gabungan")
            )
            ->groupBy('kelas_harian_mahasiswas.mahasiswa_id');


        // 7. QUERY UTAMA
        $scores = Mahasiswa::whereIn('mahasiswas.id', $mahasiswaIds)
            ->join('users', 'mahasiswas.user_id', '=', 'users.id')

            // Join ke Laporan
            ->leftJoin('laporan_ibadahs', function ($join) use ($startDate, $endDate) {
                $join->on('laporan_ibadahs.mahasiswa_id', '=', 'mahasiswas.id')
                    ->whereBetween('laporan_ibadahs.tanggal_laporan', [$startDate, $endDate]);
            })

            // Join ke Subquery Poin
            ->leftJoinSub($poinAkuratPerLaporan, 'poin_per_laporan', function ($join) {
                $join->on('laporan_ibadahs.id', '=', 'poin_per_laporan.laporan_ibadah_id');
            })

            // Join ke Subquery Kelas (Yang sudah di-aggregate)
            ->leftJoinSub($kelasInfoSub, 'kelas_info', function ($join) {
                $join->on('kelas_info.mahasiswa_id', '=', 'mahasiswas.id');
            })

            ->select(
                'users.name as nama_mahasiswa',
                'mahasiswas.uuid as mhs_uuid',
                'mahasiswas.nim',
                'mahasiswas.gender',

                // Ambil data dari subquery kelas
                // Gunakan COALESCE untuk jaga-jaga jika null
                DB::raw("COALESCE(kelas_info.nama_kelas_gabungan, '-') as nama_kelas"),
                DB::raw("COALESCE(kelas_info.nama_dosen_gabungan, '-') as nama_dosen"),
                DB::raw("COALESCE(kelas_info.kelas_uuid_gabungan, '-') as kelas_harian_uuid"),

                DB::raw('COALESCE(SUM(poin_per_laporan.poin_akurat), 0) as total_poin'),
                DB::raw('COUNT(laporan_ibadahs.id) as total_laporan'),
                DB::raw("COUNT(CASE WHEN laporan_ibadahs.is_haid = 1 AND mahasiswas.gender = 'P' THEN 1 END) as total_haid"),

                DB::raw("GROUP_CONCAT(
                CASE WHEN laporan_ibadahs.is_haid = 1 AND mahasiswas.gender = 'P'
                THEN DATE_FORMAT(laporan_ibadahs.tanggal_laporan, '%d-%m-%Y')
                END ORDER BY laporan_ibadahs.tanggal_laporan ASC SEPARATOR ', '
            ) as dates_haid"),

                DB::raw("GROUP_CONCAT(
                CONCAT(
                    DATE_FORMAT(laporan_ibadahs.tanggal_laporan, '%d-%m-%Y'),
                    ':',
                    laporan_ibadahs.uuid,
                    ':',
                    COALESCE(poin_per_laporan.poin_akurat, 0)
                ) ORDER BY laporan_ibadahs.tanggal_laporan ASC SEPARATOR ';'
            ) as dates_and_uuids")
            )

            // GROUP BY Sesuai standard SQL Strict Mode
            // Jangan group by nama_kelas/dosen karena itu hasil agregasi subquery
            ->groupBy(
                'mahasiswas.id',
                'users.name',
                'mahasiswas.nim',
                'mahasiswas.gender',
                'kelas_info.nama_kelas_gabungan', // Masukkan kolom select non-aggregate
                'kelas_info.nama_dosen_gabungan',  // Masukkan kolom select non-aggregate
                'kelas_info.kelas_uuid_gabungan',  // Masukkan kolom select non-aggregate
            )
            ->get();

        // 8. CEK MAHASISWI
        $hasFemaleStudents = $scores->where('gender', 'P')->isNotEmpty();

        // 9. Hitung Persentase Individu (SAMA SEPERTI KODEMU)
        $scores = $scores->map(function ($score) use ($maxPoinHarian, $jumlahHari) {
            $score->total_poin = (int) $score->total_poin;
            $score->total_laporan = (int) $score->total_laporan;
            $score->total_haid = (int) $score->total_haid;

            $hariStandar = $jumlahHari;
            if ($score->gender === 'P') {
                $hariStandar -= $score->total_haid;
            }
            $hariStandar = max(0, $hariStandar);

            $score->poin_standar_individu = $maxPoinHarian * $hariStandar;

            if ($score->poin_standar_individu > 0) {
                $score->persentase = round(($score->total_poin / $score->poin_standar_individu) * 100, 1);
            } else {
                $score->persentase = ($score->gender === 'P' && $score->total_haid >= $jumlahHari) ? 100 : 0;
            }

            if ($score->persentase >= 100) {
                $score->status_standar = "Optimal";
                $score->backgroundColor = 'rgba(59, 130, 246, 0.6)';
                $score->borderColor = 'rgba(59, 130, 246, 1)';
            } elseif ($score->persentase >= 80) {
                $score->status_standar = "Cukup";
                $score->backgroundColor = 'rgba(34, 197, 94, 0.6)';
                $score->borderColor = 'rgba(34, 197, 94, 1)';
            } else {
                $score->status_standar = "Kurang";
                $score->backgroundColor = 'rgba(239, 68, 68, 0.6)';
                $score->borderColor = 'rgba(239, 68, 68, 1)';
            }

            return $score;
        });

        $scores = $scores->sortByDesc('persentase')->values();

        // 10. Data Chart
        $chartData = [
            'labels' => $scores->pluck('nama_mahasiswa'),
            'datasets' => [
                [
                    'label' => 'Persentase Poin Ibadah',
                    'data' => $scores->pluck('persentase'),
                    'backgroundColor' => $scores->pluck('backgroundColor'),
                    'borderColor' => $scores->pluck('borderColor'),
                    'borderWidth' => 1,
                ],
            ],
        ];

        // 11. Statistik Keseluruhan
        $totalPoinDidapat = $scores->sum('total_poin');
        $totalStandarMaksimal = $scores->sum('poin_standar_individu');
        $rataRataPersen = $totalStandarMaksimal > 0 ? round(($totalPoinDidapat / $totalStandarMaksimal) * 100) : 0;

        $overallStats = [
            ['label' => 'POIN STANDAR', 'percentage' => $totalStandardPoin_Max, 'color' => 'bg-green-500'],
            ['label' => 'PERSEN RATA-RATA', 'percentage' => $rataRataPersen, 'color' => 'bg-cyan-500'],
            ['label' => 'TOTAL POIN', 'percentage' => $totalPoinDidapat, 'color' => 'bg-blue-500'],
            ['label' => 'JML. MAHASISWA', 'percentage' => $scores->count(), 'color' => 'bg-yellow-500'],
        ];

        if ($hasFemaleStudents) {
            $overallStats[] = ['label' => 'LAPORAN HAID', 'percentage' => $scores->sum('total_haid'), 'color' => 'bg-pink-500'];
        }

        return response()->json([
            'chartData' => $chartData,
            'studentRecap' => $scores,
            'overallStats' => $overallStats,
            'dateRange' => $dateRangeString,
            'hasFemaleStudents' => $hasFemaleStudents,
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ]);
    }


    public function showLaporanDetail(string $uuid)
    {
        $laporanIbadah = LaporanIbadah::where('uuid', $uuid)->firstOrFail();
        // 1. Load semua relasi yang diperlukan (sudah benar)
        $laporanIbadah->load([
            'mahasiswa.user',
            'jawabanLaporans' => function ($query) {
                // Pastikan kita load relasi bersarang untuk ditampilkan di view
                $query->with(['pertanyaan', 'pilihanJawaban'])->orderBy('id');
            }
        ]);

        // 2. [BARU] Hitung total poin yang akurat secara manual
        // Ini adalah SUM() dari semua jawaban yang terkait dengan laporan ini.
        $total_poin_akurat = $laporanIbadah->jawabanLaporans->sum('poin_didapat');

        // 3. [BARU] Kirim variabel baru ini ke view
        return view('laporan-ibadah', [
            'laporan' => $laporanIbadah,
            'total_poin_akurat' => $total_poin_akurat // <-- Variabel baru
        ]);
    }

    public function getStudentDetailData($mahasiswaUuid, $startDate, $endDate, $kelasUuid = null)
    {
        $user = Auth::user();

        if ($user->mahasiswa && $user->mahasiswa->uuid !== $mahasiswaUuid) {
            abort(403);
        }

        $mahasiswa = Mahasiswa::with('user')->where('uuid', $mahasiswaUuid)->firstOrFail();

        // $kelas = $mahasiswa->kelasHarians()
        //     ->with(['dosen.user', 'tugasPekanans', 'projectSemesters', 'portofolios', 'bukus', 'sertifikats'])
        //     ->where('tahun', date('Y'))
        //     ->whereHas('kategoriKelasHarian', fn($q) => $q->where('jenis', 'IT'))
        //     ->firstOrFail();

        $kelas = $kelasUuid
            ? KelasHarian::with(['dosen.user', 'tugasPekanans', 'projectSemesters', 'portofolios', 'bukus', 'sertifikats'])
            ->where('uuid', $kelasUuid)
            ->firstOrFail()

            : $mahasiswa->kelasHarians()
            ->with(['dosen.user', 'tugasPekanans', 'projectSemesters', 'portofolios', 'bukus', 'sertifikats'])
            ->where('tahun', date('Y'))
            ->whereHas(
                'kategoriKelasHarian',
                fn($q) =>
                $q->where('jenis', 'IT')
            )
            ->firstOrFail();

        // 🔥 Helper: SKL
        $skl = SklHelper::hitungSklMahasiswa($kelas, $mahasiswa->id);

        // 🔥 Helper: Absensi semua kelas
        $absensi = AbsensiHelper::rekapAbsensiSemuaKelas($mahasiswa);

        // 🔥 Helper: Ibadah
        $ibadahSummary = IbadahHelper::hitungStatistikIbadah(
            $mahasiswa->id,
            $mahasiswa->gender,
            $startDate,
            $endDate
        );

        return view('prints.skl.detail_mahasiswa', [
            'avatar' => AvatarHelper::getAvatarData($mahasiswa),
            'mahasiswa' => $mahasiswa,
            'kelas' => $kelas,
            'history' => $absensi['history'],
            'chartData' => [
                'labels' => array_map('strtoupper', $skl['categories']),
                'targets' => $skl['targets'],
                'actuals' => $skl['actuals'],
            ],
            'attendanceChart' => $absensi['chart'],
            'attendanceTable' => $absensi['table'],
            'ibadahSummary' => $ibadahSummary,
            'tanggal' => now()->translatedFormat('d F Y')
        ]);
    }
}
