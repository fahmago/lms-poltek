<?php

namespace App\Http\Controllers\My\Admin\SKL;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\KelasHarian;
use App\Models\Prodi;
use App\Models\SKL\PengumpulanProjectSemester;
use App\Models\SKL\ProjectSemester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectSemesterController extends Controller
{
    public function index(Request $request)
    {
        // 1. Validasi filter
        $request->validate([
            'tahun_angkatan' => 'nullable|exists:angkatans,tahun_angkatan',
            'semester' => 'nullable|integer|between:1,8',
        ]);

        $filterTahun = $request->query('tahun_angkatan');
        $filterSemester = $request->query('semester');

        $prodis = Prodi::with([
            // Ganti relasi
            'projectSemesters' => function ($query) use ($filterTahun, $filterSemester) {
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
            'projectSemesters.kelasHarians.kelasHarianMahasiswas',
            'projectSemesters.pengumpulanProjectSemesters'
        ])
        ->withCount(['projectSemesters' => function ($query) use ($filterTahun, $filterSemester) { // Ganti relasi
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

        // Kalkulasi progres berdasarkan data project yang sudah difilter
        $prodis->getCollection()->transform(function ($prodi) use ($filterTahun, $filterSemester) {
            $totalStudents = 0;
            $totalSubmissions = 0;
            
            // Loop melalui project semester yang SUDAH DIFILTER
            foreach ($prodi->projectSemesters as $tugas) { // Ganti variabel
                // Filter kelas harian sekali lagi untuk memastikan kalkulasi akurat
                $relevantKelasHarians = $tugas->kelasHarians->filter(function ($kelas) use ($filterTahun, $filterSemester) {
                    $tahunMatch = !$filterTahun || $kelas->tahun == $filterTahun;
                    $semesterMatch = !$filterSemester || $kelas->semester == $filterSemester;
                    return $tahunMatch && $semesterMatch;
                });

                $students = $relevantKelasHarians->flatMap(fn($k) => $k->kelasHarianMahasiswas)->unique('mahasiswa_id')->count();
                // Ganti relasi
                $submissions = $tugas->pengumpulanProjectSemesters->unique('mahasiswa_id')->count(); 
                
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

        return inertia('My/Admin/SKL/ProjectSemester/Index', [ // Ganti path inertia
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
        $projectSemesters = $prodi->projectSemesters() 
            ->withCount('kelasHarians')
             // Ganti relasi
            ->with(['kelasHarians.kelasHarianMahasiswas', 'pengumpulanProjectSemesters'])
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

        // Transformasi data project untuk menghitung progress
        $projectSemesters->getCollection()->transform(function ($tugas) { // $tugas adalah project
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
            $totalSubmissions = $tugas->pengumpulanProjectSemesters->unique('mahasiswa_id')->count();
            $completionPercentage = $totalStudents > 0 ? round(($totalSubmissions / $totalStudents) * 100) : 0;

            $tugas->progress = [
                'total_students' => $totalStudents,
                'total_submissions' => $totalSubmissions,
                'percentage' => $completionPercentage,
            ];
            return $tugas;
        });

        return inertia('My/Admin/SKL/ProjectSemester/Show', [ // Ganti path inertia
            'prodi' => $prodi,
            'projectSemesters' => $projectSemesters, // Ganti nama prop
            'angkatans' => $angkatans,
            'currentFilters' => $request->only(['tahun', 'semester']),
        ]);
    }

    public function detail($uuid)
    {
        // Ganti Model dan variabel
        $projectSemester = ProjectSemester::where('uuid', $uuid)->firstOrFail();
        $projectSemester->load(['kelasHarians.kelasHarianMahasiswas.mahasiswa.user', 'prodi']);

        // Ganti relasi
        $submissionsByStudent = $projectSemester->pengumpulanProjectSemesters()
            ->get()
            ->keyBy('mahasiswa_id');

        // Ganti variabel
        $rekapPerKelas = $projectSemester->kelasHarians->sortBy('nama_kelas')->map(function ($kelas) use ($submissionsByStudent) {
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
        $totalStudents = $projectSemester->kelasHarians->flatMap(fn($k) => $k->kelasHarianMahasiswas)->unique('mahasiswa_id')->count();
        $totalSubmissions = $submissionsByStudent->count();
        $overallStats = [
            'total_students' => $totalStudents,
            'total_submissions' => $totalSubmissions,
            'completion_percentage' => $totalStudents > 0 ? round(($totalSubmissions / $totalStudents) * 100) : 0,
        ];

        return inertia('My/Admin/SKL/ProjectSemester/Detail', [ // Ganti path inertia
            'projectSemester' => $projectSemester, // Ganti nama prop
            'rekapPerKelas' => $rekapPerKelas,
            'stats' => $overallStats,
        ]);
    }

    public function create()
    {
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();
        $prodis = Prodi::orderBy('nama_prodi', 'asc')->get();
        return inertia('My/Admin/SKL/ProjectSemester/Create', [ // Ganti path inertia
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
        $validatedData = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            // 'tipe_tugas' dihapus, tidak ada di migration ProjectSemester
            'catatan' => 'nullable|string', // Kolom tambahan dari migration ProjectSemester
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
            $project = ProjectSemester::create([
                'prodi_id' => $prodi->id,
                'judul' => $validatedData['judul'],
                'deskripsi' => $validatedData['deskripsi'],
                'catatan' => $validatedData['catatan'], // Tambahkan kolom baru
                // 'tipe_tugas' dihapus
                'waktu_mulai' => $validatedData['waktu_mulai'],
                'batas_waktu' => $validatedData['batas_waktu'],
            ]);

            $project->kelasHarians()->attach($validatedData['kelas_harian_ids']); // Ganti variabel

            DB::commit();

            return redirect()->route('my.project_semester.index')->with('success', 'Project semester berhasil dibuat!'); // Ganti route & teks
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan project. Silakan coba lagi.'); // Ganti teks
        }
    }

    public function edit($uuid)
    {
        // Ganti Model dan variabel
        $projectSemester = ProjectSemester::where('uuid', $uuid)->firstOrFail();

        $projectSemester->load('kelasHarians', 'prodi');

        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();
        $prodis = Prodi::orderBy('nama_prodi', 'asc')->get();

        session(['previous_url' => url()->previous()]);

        // Ganti variabel
        $firstKelas = $projectSemester->kelasHarians->first();

        return inertia('My/Admin/SKL/ProjectSemester/Edit', [ // Ganti path inertia
            'projectSemester' => $projectSemester, // Ganti nama prop
            'angkatans' => $angkatans,
            'prodis' => $prodis,
            'initialFilters' => [
                'tahun_angkatan' => $firstKelas->tahun ?? '',
                'kode_prodi' => $projectSemester->prodi->kode_prodi ?? '', // Ganti variabel
                'semester' => $firstKelas->semester ?? '',
            ],
        ]);
    }

    public function update(Request $request, $uuid)
    {
        // Ganti Model dan variabel
        $projectSemester = ProjectSemester::where('uuid', $uuid)->firstOrFail();

        $validatedData = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'catatan' => 'nullable|string', // Kolom tambahan
            // 'tipe_tugas' dihapus
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
            $projectSemester->update([
                'prodi_id' => $prodi->id,
                'judul' => $validatedData['judul'],
                'deskripsi' => $validatedData['deskripsi'],
                'catatan' => $validatedData['catatan'], // Tambahkan kolom baru
                // 'tipe_tugas' dihapus
                'waktu_mulai' => $validatedData['waktu_mulai'],
                'batas_waktu' => $validatedData['batas_waktu'],
            ]);

             // Ganti variabel
            $projectSemester->kelasHarians()->sync($validatedData['kelas_harian_ids']);

            DB::commit();

            // Ganti route & variabel
            return redirect(session('previous_url'))->with('success', 'Tugas project semester berhasil diperbarui!');
            // return redirect()->route('my.project_semester.show', $projectSemester->prodi->uuid)->with('success', 'Project semester berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui project.'); // Ganti teks
        }
    }     

    public function destroy($uuid)
    {
         // Ganti Model dan variabel
        $projectSemester = ProjectSemester::where('uuid', $uuid)->firstOrFail();

        try {
            $projectSemester->delete(); // Ganti variabel

            return redirect()->back()->with('success', 'Project semester berhasil dihapus.'); // Ganti teks
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus project.'); // Ganti teks
        }
    }

    public function submitGrade(Request $request, $uuid)
    {
        // Ganti Model dan variabel
        $pengumpulanProjectSemester = PengumpulanProjectSemester::where('uuid', $uuid)->firstOrFail();
        
        $validated = $request->validate([
            'nilai' => 'required|integer|between:0,100',
            'feedback_dosen' => 'nullable|string',
        ]);

        // Ganti variabel
        $pengumpulanProjectSemester->update([
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
            'ids.*' => 'exists:project_semesters,uuid', // Pastikan nama tabel benar
            'batas_waktu' => 'required|date',
        ]);

        try {
            ProjectSemester::whereIn('uuid', $validated['ids'])
                ->update(['batas_waktu' => $validated['batas_waktu']]);

            return redirect()->back()->with('success', 'Deadline berhasil diperbarui untuk ' . count($validated['ids']) . ' project.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui deadline.');
        }
    }
}
