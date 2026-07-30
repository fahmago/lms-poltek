<?php

namespace App\Http\Controllers\My\Dosen\SKL;

use App\Http\Controllers\Controller;
use App\Models\Harian\KelasHarian;
use App\Models\SKL\Buku;
use App\Models\SKL\PengumpulanBuku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BukuController extends Controller
{
    public function index1()
    {
        $dosen = Auth::user()->dosen;

        $kelasList = $dosen->kelasHarians()
            ->whereHas('kategoriKelasHarian', function ($query) {
                $query->where('jenis', 'IT');
            })
            ->with('kategoriKelasHarian')
            ->withCount('bukus') 
            ->orderBy('tahun', 'desc')
            ->orderBy('semester', 'desc')
            ->paginate(10);

        // GANTI PATH INERTIA
        return inertia('My/Dosen/SKL/Buku/Index', [
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
            // Filter Khusus: Hanya Kelas IT
            ->whereHas('kategoriKelasHarian', function ($query) {
                $query->where('jenis', 'IT');
            })
            // Filter Search (Nama Kelas / Kode)
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
            ->withCount('bukus') 
            ->orderBy('tahun', 'desc')
            ->orderBy('semester', 'desc')
            ->paginate(10);

        // Append query params
        $kelasList->appends([
            'q' => $request->q,
            'tahun' => $selectedYear,
            'semester' => $selectedSemester
        ]);

        return inertia('My/Dosen/SKL/Buku/Index', [
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
     * Menampilkan daftar buku untuk satu kelas spesifik.
     */
    public function show($uuid)
    {
        $kelasHarian = KelasHarian::where('uuid', $uuid)->firstOrFail();
        $loggedInDosenId = Auth::user()->dosen->id;

        if ($kelasHarian->dosen_id !== $loggedInDosenId) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        // Ambil data buku dengan pengumpulan
        // GANTI MODEL & RELASI
        $bukus = $kelasHarian->bukus()
            ->with(['pengumpulanBukus']) // Ganti relasi pengumpulan
            ->withCount('kelasHarians')
            ->latest()
            ->paginate(10);

        // GANTI VARIABEL
        $bukus->getCollection()->transform(function ($buku) use ($kelasHarian) {
            $totalMahasiswa = $kelasHarian->kelasHarianMahasiswas->count();
            // GANTI RELASI
            $totalPengumpulan = $buku->pengumpulanBukus
                ->whereIn('mahasiswa_id', $kelasHarian->kelasHarianMahasiswas->pluck('mahasiswa_id'))
                ->count();
            $percentage = $totalMahasiswa > 0 ? round(($totalPengumpulan / $totalMahasiswa) * 100) : 0;

            $buku->progress = [
                'total_submissions' => $totalPengumpulan,
                'total_students' => $totalMahasiswa,
                'percentage' => $percentage,
            ];

            return $buku;
        });

        // GANTI PATH INERTIA & NAMA PROP
        return inertia('My/Dosen/SKL/Buku/Show', [
            'kelasHarian' => $kelasHarian,
            'bukus' => $bukus, // Ganti prop
        ]);
    }

    /**
     * Menampilkan detail buku dan rekap pengumpulan untuk kelas yang spesifik.
     */
    // GANTI PARAMETER
    public function detail($uuidKelasHarian, $uuidBuku)
    {
        $kelasHarian = KelasHarian::where('uuid', $uuidKelasHarian)->firstOrFail();
        // GANTI MODEL & VARIABEL
        $buku = Buku::where('uuid', $uuidBuku)->firstOrFail();

        $loggedInDosenId = Auth::user()->dosen->id;
        if ($kelasHarian->dosen_id !== $loggedInDosenId) {
            abort(403, 'Anda tidak memiliki akses ke kelas ini.');
        }

        // Ambil data pengumpulan dan kelompokkan berdasarkan ID mahasiswa
        // GANTI RELASI & VARIABEL
        $submissionsByStudent = $buku->pengumpulanBukus()
            ->whereIn('mahasiswa_id', $kelasHarian->kelasHarianMahasiswas->pluck('mahasiswa_id'))
            ->get()
            ->keyBy('mahasiswa_id');

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

        $stats = [
            'total_students' => $mahasiswaData->count(),
            'total_submissions' => $submissionsByStudent->count(),
            'completion_percentage' => $mahasiswaData->count() > 0 ? round(($submissionsByStudent->count() / $mahasiswaData->count()) * 100) : 0,
        ];

        // GANTI PATH INERTIA & NAMA PROP
        return inertia('My/Dosen/SKL/Buku/Detail', [
            'buku' => $buku, // Ganti prop
            'kelasHarian' => $kelasHarian,
            'mahasiswaData' => $mahasiswaData,
            'stats' => $stats,
        ]);
    }

    /**
     * Menyimpan nilai dan feedback.
     */
    // GANTI PARAMETER
    public function submitGrade(Request $request, $uuidPengumpulanBuku)
    {
        // GANTI MODEL & VARIABEL
        $pengumpulanBuku = PengumpulanBuku::where('uuid', $uuidPengumpulanBuku)->firstOrFail();

        // --- Logika Otorisasi ---
        // GANTI RELASI
        $allowedDosenIds = $pengumpulanBuku->buku // Ganti ke relasi buku
            ->kelasHarians() 
            ->pluck('dosen_id')
            ->unique(); 

        $loggedInDosenId = Auth::user()->dosen->id;
        if (!$allowedDosenIds->contains($loggedInDosenId)) {
            abort(403, 'Anda tidak memiliki wewenang untuk menilai tugas di kelas ini.');
        }

        $validated = $request->validate([
            'nilai' => 'required|integer|between:0,100',
            'feedback_dosen' => 'nullable|string',
        ]);

        // GANTI VARIABEL
        $pengumpulanBuku->update([
            'nilai' => $validated['nilai'],
            'feedback_dosen' => $validated['feedback_dosen'],
            'status' => 'dinilai',
        ]);

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }
}
