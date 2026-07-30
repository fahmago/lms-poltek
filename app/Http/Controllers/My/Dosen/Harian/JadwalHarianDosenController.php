<?php

namespace App\Http\Controllers\My\Dosen\Harian;

use App\Http\Controllers\Controller;
use App\Models\Harian\AbsensiHarian;
use App\Models\Harian\JadwalHarian;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\KelasHarianMahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Ramsey\Uuid\Guid\Guid;

class JadwalHarianDosenController extends Controller
{
    public function index1(Request $request)
    {
        $dosen = Auth::user()->dosen;
        $kelas = $dosen->kelasHarians()
            ->withCount('jadwalHarians')
            ->with('dosen.user') 
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('nama_kelas', 'like', '%' . $search . '%') 
                            ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })->paginate(10);

        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        $kelas->appends(['q' => $request->q]);

        // return $kelas;

        return inertia('My/Dosen/Harian/JadwalHarian/Index', [
            'kelas' => $kelas, 
        ]);
    }

    public function index(Request $request)
    {
        // 1. Ambil Tahun untuk Filter
        $availableYears = KelasHarian::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        // 2. Set Default Filter
        $selectedYear = $request->input('tahun', date('Y'));
        $selectedSemester = $request->input('semester', 'all');

        $dosen = Auth::user()->dosen;

        // 3. Query Data dengan Filter
        $kelas = $dosen->kelasHarians()
            ->withCount('jadwalHarians')
            ->with('dosen.user')
            // Filter Search
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('nama_kelas', 'like', '%' . $search . '%')
                             ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })
            // Filter Tahun
            ->when($selectedYear !== 'all', function($q) use ($selectedYear) {
                $q->where('tahun', $selectedYear);
            })
            // Filter Semester
            ->when($selectedSemester !== 'all', function($q) use ($selectedSemester) {
                $q->where('semester', $selectedSemester);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Hide field kode_enroll
        $kelas->getCollection()->transform(function ($kelasItem) {
            return $kelasItem->makeHidden('kode_enroll');
        });

        // Append query params untuk pagination
        $kelas->appends([
            'q' => $request->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Dosen/Harian/JadwalHarian/Index', [
            'kelas' => $kelas,
            'availableYears' => $availableYears, // Kirim ke View
            'filters' => [ // Kirim state filter saat ini
                'tahun' => $selectedYear,
                'semester' => $selectedSemester,
                'q' => $request->q
            ]
        ]);
    }

    public function showJadwal($kodeKelasHarian)
    {
        $dosen = Auth::user()->dosen;

        // Pastikan dosen yang login memiliki kelas tersebut
        $kelasHarian = $dosen->kelasHarians()
            ->where('kode_kelas_harian', $kodeKelasHarian)
            ->with(['jadwalHarians' => function ($query) {
                $query->orderBy('tanggal', 'asc');
            }])
            ->firstOrFail();

        // Grup jadwal berdasarkan bulan
        $jadwalByMonth = $kelasHarian->jadwalHarians->groupBy(function ($jadwal) {
            return \Carbon\Carbon::parse($jadwal->tanggal)->format('Y-m'); // Grup berdasarkan Tahun-Bulan (format aman)
        });

        // Buat data bulan
        $months = $jadwalByMonth->map(function ($jadwals, $monthKey) {
            $year = substr($monthKey, 0, 4);
            $month = substr($monthKey, 5, 2); // Ambil bagian bulan

            return [
                'tahun' => $year,
                'bulan' => \Carbon\Carbon::createFromDate($year, $month, 1, 'UTC')->format('F'), // Nama bulan dalam bahasa Indonesia
                'count' => $jadwals->count(),
            ];
        })->values();

        // Return ke view dengan data yang sudah dipastikan valid
        return inertia('My/Dosen/Harian/JadwalHarian/ShowByMonth', [
            'kelasHarian' => $kelasHarian,
            'months' => $months,
        ]);
    }

    public function listJadwal1($kodeKelasHarian, $month)
    {
        // Mendapatkan kelas berdasarkan kode kelas
        // $kelasHarian = KelasHarian::where('kode_kelas_harian', $kodeKelasHarian)->firstOrFail();
        $dosen = Auth::user()->dosen;

        // Pastikan dosen yang login memiliki kelas tersebut
        $kelasHarian = $dosen->kelasHarians()
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
            ->with(['kelasHarian'])
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $bulan)
            ->orderBy('tanggal', 'asc')
            ->get();

        // Mengecek jika jadwal kosong
        if ($jadwal->isEmpty()) {
            // Tampilkan pesan atau penanganan jika tidak ada jadwal
            return inertia('My/Dosen/Harian/JadwalHarian/NoJadwal', [
                'kelasHarian' => $kelasHarian,
                'month' => \Carbon\Carbon::parse($month . '-01')->translatedFormat('F Y'),
            ]);
        }

        // Mengembalikan tampilan dengan data jadwal
        return inertia('My/Dosen/Harian/JadwalHarian/List3', [
            'kelasHarian' => $kelasHarian,
            'jadwal' => $jadwal,
            'month' => \Carbon\Carbon::parse($month . '-01')->translatedFormat('F Y'),
            'month2' => $month
        ]);
    }

    public function listJadwal($kodeKelasHarian, $month)
    {
        $dosen = Auth::user()->dosen;

        $kelasHarian = $dosen->kelasHarians()
            ->where('kode_kelas_harian', $kodeKelasHarian)
            ->firstOrFail();

        // Parsing bulan dan tahun dengan Carbon
        $parsedMonth = Carbon::parse($month);
        $year = $parsedMonth->year;
        $monthNum = $parsedMonth->month;
        
        // Dapatkan tanggal hari ini
        $today = Carbon::today()->toDateString();

        // Mendapatkan jadwal berdasarkan bulan dan tahun
        $jadwal = $kelasHarian->jadwalHarians()
            ->with(['kelasHarian'])
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $monthNum)
            // Urutkan jadwal hari ini ke paling atas, lalu sisanya berdasarkan tanggal
            ->orderByRaw("CASE WHEN tanggal = ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('tanggal', 'asc')
            ->get();

        if ($jadwal->isEmpty()) {
            return inertia('My/Dosen/Harian/JadwalHarian/NoJadwal', [
                'kelasHarian' => $kelasHarian,
                'month' => $parsedMonth->translatedFormat('F Y'),
            ]);
        }

        return inertia('My/Dosen/Harian/JadwalHarian/ListNew', [
            'kelasHarian' => $kelasHarian,
            'jadwal' => $jadwal,
            'month' => $parsedMonth->translatedFormat('F Y'),
            'month2' => $month
        ]);
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'waktu_isi_absen' => 'required|integer',
            'kode_unik' => 'required|unique:jadwal_harians,kode_unik,' . $uuid . ',uuid',
        ]);
    
        $jadwal = JadwalHarian::where('uuid', $uuid)->firstOrFail();
    
        $jadwal->update([
            'tanggal' => $validated['tanggal'],
            'waktu_isi_absen' => $validated['waktu_isi_absen'],
            'kode_unik' => $validated['kode_unik'],
        ]);
    
        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui ke tanggal ' . $validated['tanggal'] . ' dengan durasi ' . $validated['waktu_isi_absen'] . ' menit');
    }

    public function absenMhs($uuid_kelas_harian, $month)
    {
        $year = substr($month, 0, 4);
        $monthNum = substr($month, 5);
        $bulan = \Carbon\Carbon::parse("01-$monthNum-{$year}")->format('m');
        // return $monthNum;
        $kelas = KelasHarian::where('uuid', $uuid_kelas_harian)
            ->with([
                'dosen',
                'kelasHarianMahasiswas.mahasiswa.user',
                'jadwalHarians.absensiHarians' 
            ])
            ->firstOrFail();
    
        $mahasiswa = KelasHarianMahasiswa::where('kelas_harian_id', $kelas->id)
                ->with(['mahasiswa.user'])
                ->get()
                ->sortBy(function ($item) {
                    return strtolower($item->mahasiswa->user->name);
                })->values();   

        $jadwals = $kelas->jadwalHarians
            ->filter(function ($jadwal) use ($year, $bulan) {
                $date = Carbon::parse($jadwal->tanggal);
                return $date->year == $year && $date->month == $bulan;
            })
            ->map(function ($jadwal) {
                return [
                    'id' => $jadwal->id,
                    // 'hari' => Str::substr(Carbon::parse($jadwal->tanggal)->translatedFormat('l'), 0, 3),
                    // 'tanggal' => Carbon::parse($jadwal->tanggal)->format('d/m'),
                    'hari' => Carbon::parse($jadwal->tanggal)->translatedFormat('l'),
                    'tanggal' => Carbon::parse($jadwal->tanggal)->format('d-m-Y'),
                    'absensi' => $jadwal->absensiHarians->mapWithKeys(function ($absensi) {
                        return [
                            $absensi->mahasiswa_id => [
                                'id' => $absensi->id,
                                'status' => match ($absensi->status) {
                                    'hadir' => 'H',
                                    'sakit' => 'S',
                                    'izin' => 'I',
                                    default => 'A',
                                },
                            ],
                        ];
                    })->toArray(), 
                ];
        })
        ->sortBy(function ($jadwal) {
            // return Carbon::createFromFormat('d/m/Y', $jadwal['tanggal'] . '/2024')->format('Y-m-d'); // Mengubah format tanggal untuk urutan yang benar
            return Carbon::parse($jadwal['tanggal'])->format('Y-m-d'); // Mengubah format tanggal untuk urutan yang benar
        })
        ->values()->toArray();
        
        // return $jadwals;
    
        return inertia('My/Dosen/Harian/JadwalHarian/Absen', [
            'kelas' => $kelas,
            'mahasiswa' => $mahasiswa,
            'jadwals' => $jadwals,
            'monthNum' => $monthNum,
        ]);
    }

    public function updateAbsensi(Request $request)
    {
        $validated = $request->validate([
            'mahasiswa_id' => 'required|exists:mahasiswas,id',
            'jadwal_harian_id' => 'required|exists:jadwal_harians,id',
            'kelas_harian_id' => 'required|exists:kelas_harians,id',
            'kode_kelas_harian' => 'required|exists:kelas_harians,kode_kelas_harian',
            'status' => 'required|string|in:H,S,I,A,-', 
            'absensi_id' => 'nullable|exists:absensi_harians,id',
        ]);

        if ($validated['status'] === '-') {
            if ($validated['absensi_id']) {
                AbsensiHarian::where('id', $validated['absensi_id'])->delete();
            }

            return redirect()->back()->with('success', 'Absensi berhasil dihapus.');
        }

        $statusMapping = [
            'H' => 'hadir',
            'I' => 'izin',
            'S' => 'sakit',
            'A' => 'alpha',
        ];
    
        $statusToSave = $statusMapping[$validated['status']];
    
        if ($validated['absensi_id']) {
            $absensi = AbsensiHarian::findOrFail($validated['absensi_id']);
            $absensi->update([
                'status' => $statusToSave,
            ]);
    
            return redirect()->back()->with('success', 'Absensi berhasil diperbarui.');
        } 
    
        $absensi = AbsensiHarian::create([
            'mahasiswa_id' => $validated['mahasiswa_id'],
            'jadwal_harian_id' => $validated['jadwal_harian_id'],
            'kelas_harian_id' => $validated['kelas_harian_id'],
            'kode_kelas_harian' => $validated['kode_kelas_harian'],
            'waktu_absensi' => Carbon::now(),
            'status' => $statusToSave,
        ]);
        
    
        return redirect()->back()->with('success', 'Absensi berhasil disimpan.');
    }

    public function setHadirSemua1(Request $request)
    {
        $validated = $request->validate([
            'jadwal_harian_id' => 'required|exists:jadwal_harians,id',
            'kelas_harian_id' => 'required|exists:kelas_harians,id',
            'kode_kelas_harian' => 'required|exists:kelas_harians,kode_kelas_harian',
        ]);

        // 1. Dapatkan semua ID mahasiswa yang terdaftar di kelas ini
        $mahasiswaIds = KelasHarianMahasiswa::where('kelas_harian_id', $validated['kelas_harian_id'])
            ->pluck('mahasiswa_id');

        // 2. Gunakan transaction untuk memastikan semua query berhasil
        DB::transaction(function () use ($mahasiswaIds, $validated) {
            foreach ($mahasiswaIds as $mahasiswaId) {
                // 3. Gunakan updateOrInsert untuk efisiensi
                // Jika sudah ada record absensi, update statusnya. Jika belum, buat baru.
                AbsensiHarian::updateOrInsert(
                    [
                        'mahasiswa_id' => $mahasiswaId,
                        'jadwal_harian_id' => $validated['jadwal_harian_id'],
                    ],
                    [
                        'kelas_harian_id' => $validated['kelas_harian_id'],
                        'kode_kelas_harian' => $validated['kode_kelas_harian'],
                        'waktu_absensi' => Carbon::now(),
                        'status' => 'hadir',
                    ]
                );
            }
        });

        return redirect()->back()->with('success', 'Semua mahasiswa berhasil ditandai Hadir.');
    }

    public function setHadirSemua(Request $request)
    {
        $validated = $request->validate([
            'jadwal_harian_id' => 'required|exists:jadwal_harians,id',
            'kelas_harian_id' => 'required|exists:kelas_harians,id',
            'kode_kelas_harian' => 'required|exists:kelas_harians,kode_kelas_harian',
        ]);

        $mahasiswaIds = KelasHarianMahasiswa::where('kelas_harian_id', $validated['kelas_harian_id'])
            ->pluck('mahasiswa_id');
        
        $mahasiswaSudahAbsen = AbsensiHarian::where('jadwal_harian_id', $validated['jadwal_harian_id'])
            ->whereIn('mahasiswa_id', $mahasiswaIds)
            ->pluck('mahasiswa_id');
            
        $mahasiswaBelumAbsen = $mahasiswaIds->diff($mahasiswaSudahAbsen);

        if ($mahasiswaBelumAbsen->isEmpty()) {
            return redirect()->back()->with('success', 'Semua mahasiswa sudah memiliki status absensi.');
        }

        $dataToInsert = [];
        $now = Carbon::now();

        foreach ($mahasiswaBelumAbsen as $mahasiswaId) {
            $dataToInsert[] = [
                'mahasiswa_id' => $mahasiswaId,
                'jadwal_harian_id' => $validated['jadwal_harian_id'],
                'kelas_harian_id' => $validated['kelas_harian_id'],
                'kode_kelas_harian' => $validated['kode_kelas_harian'],
                'uuid' => (string) Guid::uuid4(),
                'waktu_absensi' => $now,
                'status' => 'hadir',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        AbsensiHarian::insert($dataToInsert);

        return redirect()->back()->with('success', 'Mahasiswa yang belum absen berhasil ditandai Hadir.');
    }


}
