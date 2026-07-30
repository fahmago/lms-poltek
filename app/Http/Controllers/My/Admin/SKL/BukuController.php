<?php

namespace App\Http\Controllers\My\Admin\SKL;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\KelasHarian;
use App\Models\Prodi;
use App\Models\SKL\Buku;
use App\Models\SKL\PengumpulanBuku;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BukuController extends Controller
{
    public function index(Request $request)
    {
        // 1. Validasi filter (Sama)
        $request->validate([
            'tahun_angkatan' => 'nullable|exists:angkatans,tahun_angkatan',
            'semester' => 'nullable|integer|between:1,8',
        ]);

        $filterTahun = $request->query('tahun_angkatan');
        $filterSemester = $request->query('semester');

        $prodis = Prodi::with([
            // Ganti relasi
            'bukus' => function ($query) use ($filterTahun, $filterSemester) {
                $query->whereHas('kelasHarians', function ($q) use ($filterTahun, $filterSemester) {
                    if ($filterTahun) {
                        $q->where('tahun', $filterTahun);
                    }
                    if ($filterSemester) {
                        $q->where('semester', $filterSemester);
                    }
                });
            },
            // Ganti relasi
            'bukus.kelasHarians.kelasHarianMahasiswas',
            'bukus.pengumpulanBukus' // Ganti relasi
        ])
        ->withCount(['bukus' => function ($query) use ($filterTahun, $filterSemester) { // Ganti relasi
            $query->whereHas('kelasHarians', function ($q) use ($filterTahun, $filterSemester) {
                if ($filterTahun) {
                    $q->where('tahun', $filterTahun);
                }
                if ($filterSemester) {
                    $q->where('semester', $filterSemester);
                }
            });
        }])
        ->when($request->q, function ($query, $search) {
            $query->where('kode_prodi', 'like', '%' . $search . '%')
                  ->orWhere('nama_prodi', 'like', '%' . $search . '%');
        })
        ->paginate(10);

        // Kalkulasi progres berdasarkan data buku yang sudah difilter
        $prodis->getCollection()->transform(function ($prodi) use ($filterTahun, $filterSemester) {
            $totalStudents = 0;
            $totalSubmissions = 0;
            
            // Loop melalui buku yang SUDAH DIFILTER
            foreach ($prodi->bukus as $tugas) { // Ganti variabel
                // Filter kelas harian (Sama)
                $relevantKelasHarians = $tugas->kelasHarians->filter(function ($kelas) use ($filterTahun, $filterSemester) {
                    $tahunMatch = !$filterTahun || $kelas->tahun == $filterTahun;
                    $semesterMatch = !$filterSemester || $kelas->semester == $filterSemester;
                    return $tahunMatch && $semesterMatch;
                });

                $students = $relevantKelasHarians->flatMap(fn($k) => $k->kelasHarianMahasiswas)->unique('mahasiswa_id')->count();
                // Ganti relasi
                $submissions = $tugas->pengumpulanBukus->unique('mahasiswa_id')->count(); 
                
                $totalStudents += $students;
                $totalSubmissions += $submissions;
            }

            $completionPercentage = $totalStudents > 0 ? round(($totalSubmissions / $totalStudents) * 100) : 0;

            $prodi->progress = [
                'total_students' => $totalStudents,
                'total_submissions' => $totalSubmissions,
                'percentage' => $completionPercentage,
            ];
            return $prodi;
        });

        $prodis->appends($request->all());

        return inertia('My/Admin/SKL/Buku/Index', [ // Ganti path inertia
            'prodis' => $prodis,
            'angkatans' => Angkatan::orderBy('tahun_angkatan', 'desc')->get(),
            'currentFilters' => $request->only(['q', 'tahun_angkatan', 'semester']),
        ]);
    }

    public function show(Request $request, $uuid)
    {
        $request->validate([
            'tahun' => 'nullable|exists:angkatans,tahun_angkatan', 
            'semester' => 'nullable|integer|between:1,8',            
        ]);

        $prodi = Prodi::where('uuid', $uuid)->firstOrFail();
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();
        $filterTahun = $request->query('tahun');
        $filterSemester = $request->query('semester');

        // Ganti relasi
        $bukus = $prodi->bukus() 
            ->withCount('kelasHarians')
             // Ganti relasi
            ->with(['kelasHarians.kelasHarianMahasiswas', 'pengumpulanBukus'])
            ->when($filterTahun || $filterSemester, function ($query) use ($filterTahun, $filterSemester) {
                $query->whereHas('kelasHarians', function ($q) use ($filterTahun, $filterSemester) {
                    if ($filterTahun) {
                        $q->where('tahun', $filterTahun);
                    }
                    if ($filterSemester) {
                        $q->where('semester', $filterSemester);
                    }
                });
            })
            ->latest()
            ->paginate(20);

        // Transformasi data buku untuk menghitung progress
        $bukus->getCollection()->transform(function ($tugas) { // $tugas adalah buku
            if ($tugas->waktu_mulai) {
                $tugas->formatted_waktu_mulai = Carbon::parse($tugas->waktu_mulai)
                    ->locale('id')
                    ->translatedFormat('D, d M Y H:i');
            }
            if ($tugas->batas_waktu) {
                $tugas->formatted_batas_waktu = Carbon::parse($tugas->batas_waktu)
                    ->locale('id')
                    ->translatedFormat('D, d M Y H:i');
            }
            $totalStudents = $tugas->kelasHarians->flatMap(fn($k) => $k->kelasHarianMahasiswas)->unique('mahasiswa_id')->count();
             // Ganti relasi
            $totalSubmissions = $tugas->pengumpulanBukus->unique('mahasiswa_id')->count();
            $completionPercentage = $totalStudents > 0 ? round(($totalSubmissions / $totalStudents) * 100) : 0;

            $tugas->progress = [
                'total_students' => $totalStudents,
                'total_submissions' => $totalSubmissions,
                'percentage' => $completionPercentage,
            ];
            return $tugas;
        });

        return inertia('My/Admin/SKL/Buku/Show', [ // Ganti path inertia
            'prodi' => $prodi,
            'bukus' => $bukus, // Ganti nama prop
            'angkatans' => $angkatans,
            'currentFilters' => $request->only(['tahun', 'semester']),
        ]);
    }

    public function detail($uuid)
    {
        // Ganti Model dan variabel
        $buku = Buku::where('uuid', $uuid)->firstOrFail();
        $buku->load(['kelasHarians.kelasHarianMahasiswas.mahasiswa.user', 'prodi']);

        // Ganti relasi
        $submissionsByStudent = $buku->pengumpulanBukus()
            ->get()
            ->keyBy('mahasiswa_id');

        // Ganti variabel
        $rekapPerKelas = $buku->kelasHarians->sortBy('nama_kelas')->map(function ($kelas) use ($submissionsByStudent) {
            $mahasiswaData = $kelas->kelasHarianMahasiswas->map(function ($khm) use ($submissionsByStudent) {
                $mahasiswa = $khm->mahasiswa;
                $submission = $submissionsByStudent->get($mahasiswa->id);

                return [
                    'id' => $mahasiswa->id,
                    'name' => $mahasiswa->user->name,
                    'nim' => $mahasiswa->nim,
                    'submission' => $submission, 
                ];
            })->sortBy('name')->values();

            $submissionCount = $mahasiswaData->whereNotNull('submission')->count();
            $totalStudents = $mahasiswaData->count();

            return [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
                'dosen_name' => optional($kelas->dosen?->user)->name ?? '-',
                'mahasiswas' => $mahasiswaData,
                'stats' => [
                    'submission_count' => $submissionCount,
                    'total_students' => $totalStudents,
                    'completion_percentage' => $totalStudents > 0 ? round(($submissionCount / $totalStudents) * 100) : 0,
                ]
            ];
        })
        ->values()
        ->toArray();

        // Ganti variabel
        $totalStudents = $buku->kelasHarians->flatMap(fn($k) => $k->kelasHarianMahasiswas)->unique('mahasiswa_id')->count();
        $totalSubmissions = $submissionsByStudent->count();
        $overallStats = [
            'total_students' => $totalStudents,
            'total_submissions' => $totalSubmissions,
            'completion_percentage' => $totalStudents > 0 ? round(($totalSubmissions / $totalStudents) * 100) : 0,
        ];

        return inertia('My/Admin/SKL/Buku/Detail', [ // Ganti path inertia
            'buku' => $buku, // Ganti nama prop
            'rekapPerKelas' => $rekapPerKelas,
            'stats' => $overallStats,
        ]);
    }

    public function create()
    {
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();
        $prodis = Prodi::orderBy('nama_prodi', 'asc')->get();
        return inertia('My/Admin/SKL/Buku/Create', [ // Ganti path inertia
            'angkatans' => $angkatans,
            'prodis' => $prodis,
        ]);
    }

    // Fungsi ini (getClasses) identik dan tidak perlu diubah
    public function getClasses(Request $request)
    {
        $data = $request->validate([
            'tahun_angkatan' => 'required|exists:angkatans,tahun_angkatan',
            'kode_prodi' => 'required|exists:prodis,kode_prodi',
            'semester' => 'required|integer|between:1,8',
        ]);
        $classes = KelasHarian::where('tahun', $data['tahun_angkatan'])
            ->where('semester', $data['semester'])
            ->whereHas('dosen', function ($query) use ($data) {
                $query->where('kode_prodi', $data['kode_prodi']);
            })
            ->whereHas('kategoriKelasHarian', function ($query) {
                $query->where('jenis', 'IT'); 
            })
            ->orderBy('nama_kelas', 'asc')
            ->get(['id', 'nama_kelas', 'dosen_id']);

        $classes->load(['dosen.user']);

        $formattedClasses = $classes->map(function($kelas) {
            return [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
                'nama_dosen' => $kelas->dosen->user->name ?? 'Dosen N/A',
            ];
        });

        return response()->json($formattedClasses);
    }
    
    public function store(Request $request)
    {
        // Validasi (Sama seperti portofolio, karena migrasi sama)
        $validatedData = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'waktu_mulai' => 'required|date',
            'batas_waktu' => 'required|date|after:waktu_mulai',
            'tahun_angkatan' => 'required|exists:angkatans,tahun_angkatan',
            'kode_prodi' => 'required|exists:prodis,kode_prodi',
            'semester' => 'required|integer|between:1,8',
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
        ], [
            'kelas_harian_ids.required' => 'Anda harus memilih setidaknya satu kelas harian.',
            'kelas_harian_ids.min' => 'Anda harus memilih setidaknya satu kelas harian.',
        ]);

        DB::beginTransaction();

        try {
            
            $prodi = Prodi::where('kode_prodi', $validatedData['kode_prodi'])->firstOrFail();

            // Ganti Model
            $buku = Buku::create([
                'prodi_id' => $prodi->id,
                'judul' => $validatedData['judul'],
                'deskripsi' => $validatedData['deskripsi'],
                'waktu_mulai' => $validatedData['waktu_mulai'],
                'batas_waktu' => $validatedData['batas_waktu'],
            ]);

            $buku->kelasHarians()->attach($validatedData['kelas_harian_ids']); // Ganti variabel

            DB::commit();

            return redirect()->route('my.buku.index')->with('success', 'Tugas Buku berhasil dibuat!'); // Ganti route & teks
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan tugas buku. Silakan coba lagi.'); // Ganti teks
        }
    }

    public function edit($uuid)
    {
        // Ganti Model dan variabel
        $buku = Buku::where('uuid', $uuid)->firstOrFail();

        $buku->load('kelasHarians', 'prodi');

        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();
        $prodis = Prodi::orderBy('nama_prodi', 'asc')->get();

        session(['previous_url' => url()->previous()]);

        // Ganti variabel
        $firstKelas = $buku->kelasHarians->first();

        return inertia('My/Admin/SKL/Buku/Edit', [ // Ganti path inertia
            'buku' => $buku, // Ganti nama prop
            'angkatans' => $angkatans,
            'prodis' => $prodis,
            'initialFilters' => [
                'tahun_angkatan' => $firstKelas->tahun ?? '',
                'kode_prodi' => $buku->prodi->kode_prodi ?? '', // Ganti variabel
                'semester' => $firstKelas->semester ?? '',
            ],
        ]);
    }

    public function update(Request $request, $uuid)
    {
        // Ganti Model dan variabel
        $buku = Buku::where('uuid', $uuid)->firstOrFail();

        // Validasi (Sama)
        $validatedData = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'waktu_mulai' => 'required|date',
            'batas_waktu' => 'required|date|after:waktu_mulai',
            'kode_prodi' => 'required|exists:prodis,kode_prodi',
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
        ]);

        DB::beginTransaction();
        try {
            $prodi = Prodi::where('kode_prodi', $validatedData['kode_prodi'])->firstOrFail();

            // Ganti variabel
            $buku->update([
                'prodi_id' => $prodi->id,
                'judul' => $validatedData['judul'],
                'deskripsi' => $validatedData['deskripsi'],
                'waktu_mulai' => $validatedData['waktu_mulai'],
                'batas_waktu' => $validatedData['batas_waktu'],
            ]);

             // Ganti variabel
            $buku->kelasHarians()->sync($validatedData['kelas_harian_ids']);

            DB::commit();

            // Ganti route & variabel
            return redirect(session('previous_url'))->with('success', 'Tugas buku berhasil diperbarui!');
            
            // return redirect()->route('my.buku.show', $buku->prodi->uuid)->with('success', 'Tugas Buku berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui tugas buku.'); // Ganti teks
        }
    }     

    public function destroy($uuid)
    {
         // Ganti Model dan variabel
        $buku = Buku::where('uuid', $uuid)->firstOrFail();

        try {
            $buku->delete(); // Ganti variabel

            return redirect()->back()->with('success', 'Tugas Buku berhasil dihapus.'); // Ganti teks
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus tugas buku.'); // Ganti teks
        }
    }

    public function submitGrade(Request $request, $uuid)
    {
        // Ganti Model dan variabel
        $pengumpulanBuku = PengumpulanBuku::where('uuid', $uuid)->firstOrFail();
        
        $validated = $request->validate([
            'nilai' => 'required|integer|between:0,100',
            'feedback_dosen' => 'nullable|string',
        ]);

        // Ganti variabel
        $pengumpulanBuku->update([
            'nilai' => $validated['nilai'],
            'feedback_dosen' => $validated['feedback_dosen'],
            'status' => 'dinilai', 
        ]);

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }
    public function bulkUpdateDeadline(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:bukus,uuid', // Pastikan nama tabel di migration adalah 'bukus'
            'batas_waktu' => 'required|date',
        ]);

        try {
            Buku::whereIn('uuid', $validated['ids'])
                ->update(['batas_waktu' => $validated['batas_waktu']]);

            return redirect()->back()->with('success', 'Deadline berhasil diperbarui untuk ' . count($validated['ids']) . ' tugas buku.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui deadline.');
        }
    }
}
