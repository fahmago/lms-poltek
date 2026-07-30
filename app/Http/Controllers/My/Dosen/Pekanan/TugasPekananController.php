<?php

namespace App\Http\Controllers\My\Dosen\Pekanan;

use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use App\Models\Pekanan\PengumpulanTugasPekanan;
use App\Models\Pekanan\TugasPekanan;
use App\Models\Tugas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TugasPekananController extends Controller
{
    public function index1()
    {
        $dosen = Auth::user()->dosen;

        $kelasList = $dosen->kelasHarians()
            ->whereHas('kategoriKelasHarian', function ($query) {
                $query->where('jenis', 'IT');
            })
            ->with('kategoriKelasHarian')
            ->withCount('tugasPekanans') // Menghitung jumlah tugas untuk setiap kelas
            ->orderBy('tahun', 'desc')
            ->orderBy('semester', 'desc')
            ->paginate(10);

        return inertia('My/Dosen/Pekanan/Index', [
            'kelasList' => $kelasList,
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
        $kelasList = $dosen->kelasHarians()
            // Filter Khusus: Hanya Kelas IT (Sesuai kode aslimu)
            ->whereHas('kategoriKelasHarian', function ($query) {
                $query->where('jenis', 'IT');
            })
            // Filter Search
            ->when($request->q, function ($query) use ($request) {
                $search = $request->q;
                $query->where(function ($sub) use ($search) {
                    $sub->where('nama_kelas', 'like', '%' . $search . '%')
                        ->orWhere('kode_kelas_harian', 'like', '%' . $search . '%');
                });
            })
            // Filter Tahun
            ->when($selectedYear !== 'all', function ($query) use ($selectedYear) {
                $query->where('tahun', $selectedYear);
            })
            // Filter Semester
            ->when($selectedSemester !== 'all', function ($query) use ($selectedSemester) {
                $query->where('semester', $selectedSemester);
            })
            ->with('kategoriKelasHarian')
            ->withCount('tugasPekanans') // Menghitung jumlah tugas
            ->orderBy('tahun', 'desc')
            ->orderBy('semester', 'desc')
            ->paginate(10);

        // Append query params agar pagination tidak mereset filter
        $kelasList->appends([
            'q' => $request->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Dosen/Pekanan/Index', [
            'kelasList' => $kelasList,
            'availableYears' => $availableYears, // Kirim data tahun
            'filters' => [ // Kirim state filter
                'tahun' => $selectedYear,
                'semester' => $selectedSemester,
                'q' => $request->q
            ]
        ]);
    }

    /**
     * Menampilkan daftar tugas pekanan untuk satu kelas spesifik.
     */
    public function show($uuid)
    {
        $kelasHarian = KelasHarian::where('uuid', $uuid)->firstOrFail();
        $loggedInDosenId = Auth::user()->dosen->id;

        if ($kelasHarian->dosen_id !== $loggedInDosenId) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        // Ambil data tugas dengan pengumpulan
        $tugasPekanans = $kelasHarian->tugasPekanans()
            ->with(['pengumpulanTugasPekanans']) // relasi pengumpulan
            ->withCount('kelasHarians')
            ->latest()
            ->paginate(10);

        $tugasPekanans->getCollection()->transform(function ($tugas) use ($kelasHarian) {
            $totalMahasiswa = $kelasHarian->kelasHarianMahasiswas->count();
            $totalPengumpulan = $tugas->pengumpulanTugasPekanans
                ->whereIn('mahasiswa_id', $kelasHarian->kelasHarianMahasiswas->pluck('mahasiswa_id'))
                ->count();
            $percentage = $totalMahasiswa > 0 ? round(($totalPengumpulan / $totalMahasiswa) * 100) : 0;

            $tugas->progress = [
                'total_submissions' => $totalPengumpulan,
                'total_students' => $totalMahasiswa,
                'percentage' => $percentage,
            ];

            return $tugas;
        });

        return inertia('My/Dosen/Pekanan/Show', [
            'kelasHarian' => $kelasHarian,
            'tugasPekanans' => $tugasPekanans,
        ]);
    }

    /**
     * Menampilkan detail tugas dan rekap pengumpulan untuk kelas yang spesifik.
     */
    public function detail($uuidKelasHarian, $uuidTugasPekanan)
    {
        $kelasHarian = KelasHarian::where('uuid', $uuidKelasHarian)->firstOrFail();
        $tugasPekanan = TugasPekanan::where('uuid', $uuidTugasPekanan)->firstOrFail();

        // 1. Dapatkan ID dosen yang sedang login
        $loggedInDosenId = Auth::user()->dosen->id;

        // 2. Lakukan pengecekan manual
        if ($kelasHarian->dosen_id !== $loggedInDosenId) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        // Ambil data pengumpulan dan kelompokkan berdasarkan ID mahasiswa
        $submissionsByStudent = $tugasPekanan->pengumpulanTugasPekanans()
            ->whereIn('mahasiswa_id', $kelasHarian->kelasHarianMahasiswas->pluck('mahasiswa_id'))
            ->get()
            ->keyBy('mahasiswa_id');

        // Siapkan data mahasiswa dari kelas ini saja
        $mahasiswaData = $kelasHarian->kelasHarianMahasiswas->map(function ($khm) use ($submissionsByStudent) {
            $mahasiswa = $khm->mahasiswa;
            $submission = $submissionsByStudent->get($mahasiswa->id);
            return [
                'id' => $mahasiswa->id,
                'name' => $mahasiswa->user->name,
                'nim' => $mahasiswa->nim,
                'submission' => $submission,
            ];
        })->sortBy('name')->values();

        // Hitung statistik untuk kelas ini
        $stats = [
            'total_students' => $mahasiswaData->count(),
            'total_submissions' => $submissionsByStudent->count(),
            'completion_percentage' => $mahasiswaData->count() > 0 ? round(($submissionsByStudent->count() / $mahasiswaData->count()) * 100) : 0,
        ];

        return inertia('My/Dosen/Pekanan/Detail', [
            'tugasPekanan' => $tugasPekanan,
            'kelasHarian' => $kelasHarian,
            'mahasiswaData' => $mahasiswaData,
            'stats' => $stats,
        ]);
    }

    /**
     * Menyimpan nilai dan feedback.
     */
    public function submitGrade(Request $request, $uuidPengumpulanTugasPekanan)
    {
        $pengumpulanTugasPekanan = PengumpulanTugasPekanan::where('uuid', $uuidPengumpulanTugasPekanan)->firstOrFail();

        // --- PERBAIKAN LOGIKA OTORISASI DI SINI ---

        // 1. Dapatkan semua ID dosen yang mengajar kelas-kelas yang menerima tugas ini.
        $allowedDosenIds = $pengumpulanTugasPekanan->tugasPekanan
            ->kelasHarians() // Ambil semua kelas yang terkait dengan tugas
            ->pluck('dosen_id') // Ambil hanya kolom 'dosen_id'
            ->unique(); // Pastikan tidak ada ID dosen yang duplikat

        // 2. Dapatkan ID dosen yang sedang login.
        $loggedInDosenId = Auth::user()->dosen->id;

        // 3. Cek apakah ID dosen yang login ada di dalam daftar dosen yang diizinkan.
        if (!$allowedDosenIds->contains($loggedInDosenId)) {
            abort(403, 'Anda tidak memiliki wewenang untuk menilai tugas di kelas ini.');
        }

        $validated = $request->validate([
            'nilai' => 'required|integer|between:0,100',
            'feedback_dosen' => 'nullable|string',
        ]);

        $pengumpulanTugasPekanan->update([
            'nilai' => $validated['nilai'],
            'feedback_dosen' => $validated['feedback_dosen'],
            'status' => 'dinilai',
        ]);

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }
}
