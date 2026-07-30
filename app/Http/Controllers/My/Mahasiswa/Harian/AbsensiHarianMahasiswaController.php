<?php

namespace App\Http\Controllers\My\Mahasiswa\Harian;

use App\Http\Controllers\Controller;
use App\Models\Harian\AbsensiHarian;
use App\Models\Harian\JadwalHarian;
use App\Models\Harian\KelasHarian;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AbsensiHarianMahasiswaController extends Controller
{
    public function index1(Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }        

        $kelas = $mahasiswa->kelasHarians()
            ->withCount('jadwalHarians')
            ->with('dosen.user') 
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas_harians.nama_kelas', 'like', '%' . $search . '%') 
                            ->orWhere('kelas_harians.kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })->paginate(10);

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'
            ], 404);
        }

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        $kelas->appends(['q' => $request->q]);

        return inertia('My/Mahasiswa/Harian/AbsensiHarian/Index', [
            'kelas' => $kelas, 
        ]);
    }

    public function index(Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        if (!$mahasiswa) {
            return response()->json([
                'success' => false,
                'message' => 'Mahasiswa tidak ditemukan untuk user yang login'
            ], 404);
        }        

        // 1. Ambil Tahun untuk Filter
        $availableYears = KelasHarian::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // 2. Set Default Filter
        $selectedYear = $request->input('tahun', date('Y'));
        $selectedSemester = $request->input('semester', 'all');

        // 3. Query Data dengan Filter
        $kelas = $mahasiswa->kelasHarians()
            ->withCount('jadwalHarians')
            ->with('dosen.user') 
            // Filter Search
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('kelas_harians.nama_kelas', 'like', '%' . $search . '%') 
                             ->orWhere('kelas_harians.kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })
            // Filter Tahun (Spesifik tabel kelas_harians)
            ->when($selectedYear !== 'all', function($q) use ($selectedYear) {
                $q->where('kelas_harians.tahun', $selectedYear);
            })
            // Filter Semester
            ->when($selectedSemester !== 'all', function($q) use ($selectedSemester) {
                $q->where('kelas_harians.semester', $selectedSemester);
            })
            ->orderBy('kelas_harians.created_at', 'desc')
            ->paginate(10);

        if (!$kelas) {
            return response()->json([
                'success' => false,
                'message' => 'Kelas tidak ditemukan atau Anda tidak terdaftar dalam kelas ini'
            ], 404);
        }

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        $kelas->appends([
            'q' => $request->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Mahasiswa/Harian/AbsensiHarian/Index', [
            'kelas' => $kelas, 
            'availableYears' => $availableYears, // Kirim data tahun
            'filters' => [ // Kirim state filter
                'tahun' => $selectedYear,
                'semester' => $selectedSemester,
                'q' => $request->q
            ]
        ]);
    }

    public function showJadwal($kodeKelasHarian)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // Pastikan mahasiswa terdaftar dalam kelas harian tersebut
        $kelasHarian = $mahasiswa->kelasHarians()
            ->where('kode_kelas_harian', $kodeKelasHarian)
            ->with(['jadwalHarians' => function ($query) {
                $query->orderBy('tanggal', 'asc'); // Urutkan jadwal berdasarkan tanggal
            }])
            ->firstOrFail();

        // Grupkan jadwal berdasarkan bulan
        $jadwalByMonth = $kelasHarian->jadwalHarians->groupBy(function ($jadwal) {
            return \Carbon\Carbon::parse($jadwal->tanggal)->format('Y-m'); // Format tahun-bulan
        });

        // Buat data bulan untuk dikirim ke view
        $months = $jadwalByMonth->map(function ($jadwals, $monthKey) {
            $year = substr($monthKey, 0, 4);
            $month = substr($monthKey, 5, 2); // Ambil bulan

            return [
                'tahun' => $year,
                'bulan' => \Carbon\Carbon::createFromDate($year, $month, 1, 'UTC')->format('F'), // Nama bulan
                'count' => $jadwals->count(),
                'jadwal' => $jadwals->map(function ($jadwal) {
                    return [
                        'tanggal' => $jadwal->tanggal,
                        'formatted_tanggal' => $jadwal->formattedTanggal,
                        'kode_unik' => $jadwal->kode_unik,
                    ];
                }),
            ];
        })->values();

        return inertia('My/Mahasiswa/Harian/AbsensiHarian/ShowByMonth', [
            'kelasHarian' => $kelasHarian,
            'months' => $months,
        ]);
    }

    public function listJadwal1($kodeKelasHarian, $month)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // Pastikan mahasiswa terdaftar dalam kelas harian tersebut
        $kelasHarian = $mahasiswa->kelasHarians()
            ->where('kode_kelas_harian', $kodeKelasHarian)
            ->with(['jadwalHarians' => function ($query) {
                $query->orderBy('tanggal', 'asc');
            }])
            ->firstOrFail();

        // Parsing bulan dan tahun
        $year = substr($month, 0, 4);
        $monthNum = substr($month, 5);

        // Mengonversi nama bulan menjadi angka bulan
        $bulan = \Carbon\Carbon::parse("01-$monthNum-{$year}")->format('m');

        // Mendapatkan jadwal berdasarkan bulan dan tahun
        $jadwal = $kelasHarian->jadwalHarians()
            ->with(['kelasHarian', 'absensiHarians' => function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            }])
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $bulan)
            ->orderBy('tanggal', 'asc')
            ->get();

        // Mengecek jika jadwal kosong
        if ($jadwal->isEmpty()) {
            // Tampilkan pesan atau penanganan jika tidak ada jadwal
            return inertia('My/Mahasiswa/Harian/AbsensiHarian/NoJadwal', [
                'kelasHarian' => $kelasHarian,
                'month' => \Carbon\Carbon::parse($month . '-01')->translatedFormat('F Y'),
            ]);
        }

        // Mengembalikan tampilan dengan data jadwal
        return inertia('My/Mahasiswa/Harian/AbsensiHarian/ListJadwal1', [
            'kelasHarian' => $kelasHarian,
            'jadwal' => $jadwal,
            'month' => \Carbon\Carbon::parse($month . '-01')->translatedFormat('F Y'),
            'month2' => $month
        ]);
    }

    public function listJadwal2($kodeKelasHarian, $month)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // Pastikan mahasiswa terdaftar dalam kelas harian tersebut
        $kelasHarian = $mahasiswa->kelasHarians()
            ->where('kode_kelas_harian', $kodeKelasHarian)
            ->firstOrFail();

        // Parsing bulan dan tahun dengan aman menggunakan Carbon
        $parsedMonth = Carbon::parse($month);
        $year = $parsedMonth->year;
        $monthNum = $parsedMonth->month;

        $today = Carbon::today()->toDateString();

        // Mendapatkan jadwal berdasarkan bulan dan tahun
        $jadwal = $kelasHarian->jadwalHarians()
            ->with(['kelasHarian', 'absensiHarians' => function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            }])
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $monthNum)
            // Urutkan jadwal hari ini ke paling atas, lalu sisanya berdasarkan tanggal
            ->orderByRaw("CASE WHEN tanggal = ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('tanggal', 'asc')
            ->get();

        // Mengecek jika jadwal kosong
        if ($jadwal->isEmpty()) {
            return inertia('My/Mahasiswa/Harian/AbsensiHarian/NoJadwal', [
                'kelasHarian' => $kelasHarian,
                'month' => $parsedMonth->translatedFormat('F Y'),
            ]);
        }

        // Mengembalikan tampilan dengan data jadwal
        return inertia('My/Mahasiswa/Harian/AbsensiHarian/ListJadwal2', [
            'kelasHarian' => $kelasHarian,
            'jadwal' => $jadwal,
            'month' => $parsedMonth->translatedFormat('F Y'),
            'month2' => $month
        ]);
    }

    public function listJadwal($kodeKelasHarian, $month)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        $kelasHarian = $mahasiswa->kelasHarians()
            ->where('kode_kelas_harian', $kodeKelasHarian)
            ->firstOrFail();

        $parsedMonth = Carbon::parse($month);
        $year = $parsedMonth->year;
        $monthNum = $parsedMonth->month;
        $today = Carbon::today()->toDateString();

        $jadwal = $kelasHarian->jadwalHarians()
            ->with(['kelasHarian', 'absensiHarians' => function ($query) use ($mahasiswa) {
                $query->where('mahasiswa_id', $mahasiswa->id);
            }])
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $monthNum)
            // LOGIKA SORTING BARU:
            // Prioritaskan (beri nilai 0) HANYA JIKA:
            // 1. Tanggalnya adalah hari ini
            // 2. DAN TIDAK ADA record absensi untuk mahasiswa ini di jadwal ini
            ->orderByRaw(
                "CASE WHEN tanggal = ? AND NOT EXISTS (SELECT 1 FROM absensi_harians WHERE absensi_harians.jadwal_harian_id = jadwal_harians.id AND absensi_harians.mahasiswa_id = ?) THEN 0 ELSE 1 END",
                [$today, $mahasiswa->id]
            )
            ->orderBy('tanggal', 'asc')
            ->get();

        if ($jadwal->isEmpty()) {
            return inertia('My/Mahasiswa/Harian/AbsensiHarian/NoJadwal', [
                'kelasHarian' => $kelasHarian,
                'month' => $parsedMonth->translatedFormat('F Y'),
            ]);
        }

        return inertia('My/Mahasiswa/Harian/AbsensiHarian/ListJadwal', [
            'kelasHarian' => $kelasHarian,
            'jadwal' => $jadwal,
            'month' => $parsedMonth->translatedFormat('F Y'),
            'month2' => $month
        ]);
    }

    public function doPresence(Request $request)
    {
        $request->validate([
            'jadwal_id' => 'required|exists:jadwal_harians,id',
            'kode_unik' => 'required|string|exists:jadwal_harians,kode_unik',
        ],[
            'jadwal_id.required' => 'Jadwal harus dipilih',
            'jadwal_id.exists' => 'Jadwal tidak ditemukan',
            'kode_unik.required' => 'Kode presensi harus diisi',
            'kode_unik.exists' => 'Kode presensi tidak ditemukan',
        ]);
    
        $jadwalHarian = JadwalHarian::find($request->jadwal_id);
    
        if (!$jadwalHarian) {
            return response()->json(['error' => 'Jadwal tidak ditemukan'], 404);
        }
    
        if ($jadwalHarian->kode_unik !== $request->kode_unik) {
            return response()->json(['error' => 'Kode unik tidak sesuai'], 400);
        }
    
        $existingAbsensi = AbsensiHarian::where('jadwal_harian_id', $jadwalHarian->id)
            ->where('mahasiswa_id', Auth::user()->mahasiswa->id) 
            ->first();
    
        if ($existingAbsensi) {
            return response()->json(['error' => 'Anda sudah mengisi presensi untuk jadwal ini'], 400);
        }
    
        $absensi = AbsensiHarian::create([
            'mahasiswa_id' => Auth::user()->mahasiswa->id,
            'jadwal_harian_id' => $jadwalHarian->id, 
            'kelas_harian_id' => $jadwalHarian->kelas_harian_id, 
            'kode_kelas_harian' => $jadwalHarian->kode_kelas_harian, 
            'waktu_absensi' => now(), 
            'status' => 'hadir',
        ]);
    
        return redirect()->back()->with('success', 'Presensi berhasil disimpan');
    }


}
