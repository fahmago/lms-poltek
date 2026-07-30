<?php

namespace App\Http\Controllers\My\Admin\Pekanan;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\KategoriKelasHarian;
use App\Models\Harian\KelasHarian;
use App\Models\Pekanan\PengumpulanTugasPekanan;
use App\Models\Pekanan\TugasPekanan;
use App\Models\Prodi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TugasPekananController extends Controller
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
            'tugasPekanans' => function ($query) use ($filterTahun, $filterSemester) {
                // Filter tugas pekanan berdasarkan tahun dan semester dari kelas harian yang terhubung
                $query->whereHas('kelasHarians', function ($q) use ($filterTahun, $filterSemester) {
                    if ($filterTahun) {
                        $q->where('tahun', $filterTahun);
                    }
                    if ($filterSemester) {
                        $q->where('semester', $filterSemester);
                    }
                });
            },
            // Muat relasi yang dibutuhkan untuk kalkulasi progress
            'tugasPekanans.kelasHarians.kelasHarianMahasiswas',
            'tugasPekanans.pengumpulanTugasPekanans'
        ])
            ->withCount(['tugasPekanans' => function ($query) use ($filterTahun, $filterSemester) {
                // Hitung jumlah tugas yang sesuai filter
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

        // Kalkulasi progres berdasarkan data tugas yang sudah difilter
        $prodis->getCollection()->transform(function ($prodi) use ($filterTahun, $filterSemester) {
            $totalStudents = 0;
            $totalSubmissions = 0;

            // Loop melalui tugas pekanan yang SUDAH DIFILTER
            foreach ($prodi->tugasPekanans as $tugas) {
                // Filter kelas harian sekali lagi untuk memastikan kalkulasi akurat
                $relevantKelasHarians = $tugas->kelasHarians->filter(function ($kelas) use ($filterTahun, $filterSemester) {
                    $tahunMatch = !$filterTahun || $kelas->tahun == $filterTahun;
                    $semesterMatch = !$filterSemester || $kelas->semester == $filterSemester;
                    return $tahunMatch && $semesterMatch;
                });

                $students = $relevantKelasHarians->flatMap(fn($k) => $k->kelasHarianMahasiswas)->unique('mahasiswa_id')->count();
                $submissions = $tugas->pengumpulanTugasPekanans->unique('mahasiswa_id')->count();

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

        return inertia('My/Admin/Pekanan/TugasPekanan/Index2', [
            'prodis' => $prodis,
            'angkatans' => Angkatan::orderBy('tahun_angkatan', 'desc')->get(), // Kirim data angkatan untuk filter
            'currentFilters' => $request->only(['q', 'tahun_angkatan', 'semester']), // Kirim filter aktif
        ]);
    }

    public function show(Request $request, $uuid)
    {
        $request->validate([
            'tahun' => 'nullable|exists:angkatans,tahun_angkatan',
            'semester' => 'nullable|integer|between:1,8',
        ]);

        $prodi = Prodi::where('uuid', $uuid)->firstOrFail();

        // 1. Ambil semua data Angkatan untuk filter dropdown
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();

        // Ambil filter dari request
        $filterTahun = $request->query('tahun');
        $filterSemester = $request->query('semester');

        $tugasPekanans = $prodi->tugasPekanans()
            ->withCount('kelasHarians')
            ->with(['kelasHarians.kelasHarianMahasiswas', 'pengumpulanTugasPekanans'])
            // --- LOGIKA FILTER BERDASARKAN KELAS HARIAn ---
            ->when($filterTahun || $filterSemester, function ($query) use ($filterTahun, $filterSemester) {
                // Cari tugas yang terhubung ke kelas harian yang cocok dengan filter
                $query->whereHas('kelasHarians', function ($q) use ($filterTahun, $filterSemester) {
                    if ($filterTahun) {
                        $q->where('tahun', $filterTahun);
                    }
                    if ($filterSemester) {
                        $q->where('semester', $filterSemester);
                    }
                });
            })
            // --- END LOGIKA FILTER ---
            ->latest()
            ->paginate(20);

        // Transformasi data tugas untuk menghitung progress
        $tugasPekanans->getCollection()->transform(function ($tugas) {
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
            $totalSubmissions = $tugas->pengumpulanTugasPekanans->unique('mahasiswa_id')->count();
            $completionPercentage = $totalStudents > 0 ? round(($totalSubmissions / $totalStudents) * 100) : 0;

            $tugas->progress = [
                'total_students' => $totalStudents,
                'total_submissions' => $totalSubmissions,
                'percentage' => $completionPercentage,
            ];
            return $tugas;
        });

        // $totalStudents = 0;
        // $totalSubmissions = 0;

        // foreach ($tugasPekanans->items() as $tugas) {
        //     $totalStudents += $tugas->progress['total_students'];
        //     $totalSubmissions += $tugas->progress['total_submissions'];
        // }

        // $summaryPercentage = $totalStudents > 0
        //     ? round(($totalSubmissions / $totalStudents) * 100)
        //     : 0;

        // $progressSummary = [
        //     'total_students' => $totalStudents,
        //     'total_submissions' => $totalSubmissions,
        //     'percentage' => $summaryPercentage,
        // ];

        return inertia('My/Admin/Pekanan/TugasPekanan/Show2', [
            'prodi' => $prodi,
            'tugasPekanans' => $tugasPekanans,
            'angkatans' => $angkatans, // Kirim daftar angkatan
            'currentFilters' => $request->only(['tahun', 'semester']), // Kirim filter yang sedang aktif
            // 'progressSummary' => $progressSummary,
        ]);
    }


    public function detail($uuid)
    {
        $tugasPekanan = TugasPekanan::where('uuid', $uuid)->firstOrFail();
        // Muat relasi yang dibutuhkan
        $tugasPekanan->load(['kelasHarians.kelasHarianMahasiswas.mahasiswa.user', 'prodi']);

        // 2. Ambil semua data pengumpulan untuk tugas ini dan kelompokkan berdasarkan ID mahasiswa
        $submissionsByStudent = $tugasPekanan->pengumpulanTugasPekanans()
            ->get()
            ->keyBy('mahasiswa_id');

        // 3. Olah data untuk format akordeon di frontend
        $rekapPerKelas = $tugasPekanan->kelasHarians->sortBy('nama_kelas')->map(function ($kelas) use ($submissionsByStudent) {

            // Siapkan data mahasiswa untuk setiap kelas
            $mahasiswaData = $kelas->kelasHarianMahasiswas->map(function ($khm) use ($submissionsByStudent) {
                $mahasiswa = $khm->mahasiswa;
                // Cari data pengumpulan mahasiswa ini dari data yang sudah dikelompokkan
                $submission = $submissionsByStudent->get($mahasiswa->id);

                return [
                    'id' => $mahasiswa->id,
                    'name' => $mahasiswa->user->name,
                    'nim' => $mahasiswa->nim,
                    'submission' => $submission, // Akan berisi data pengumpulan atau null
                ];
            })->sortBy('name')->values(); // Urutkan mahasiswa berdasarkan nama

            // Hitung statistik per kelas
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

        // Hitung statistik keseluruhan
        $totalStudents = $tugasPekanan->kelasHarians->flatMap(fn($k) => $k->kelasHarianMahasiswas)->unique('mahasiswa_id')->count();
        $totalSubmissions = $submissionsByStudent->count();
        $overallStats = [
            'total_students' => $totalStudents,
            'total_submissions' => $totalSubmissions,
            'completion_percentage' => $totalStudents > 0 ? round(($totalSubmissions / $totalStudents) * 100) : 0,
        ];

        return inertia('My/Admin/Pekanan/TugasPekanan/Detail', [
            'tugasPekanan' => $tugasPekanan,
            'rekapPerKelas' => $rekapPerKelas,
            'stats' => $overallStats,
        ]);
    }

    public function create()
    {
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();
        $prodis = Prodi::orderBy('nama_prodi', 'asc')->get();
        return inertia('My/Admin/Pekanan/TugasPekanan/Create', [
            'angkatans' => $angkatans,
            'prodis' => $prodis,
        ]);
    }

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

        $formattedClasses = $classes->map(function ($kelas) {
            return [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
                'nama_dosen' => $kelas->dosen->user->name ?? 'Dosen N/A',
            ];
        });

        return response()->json($formattedClasses);
        // return response()->json($classes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tipe_tugas' => 'required|in:yt,other',
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

            $tugas = TugasPekanan::create([
                'prodi_id' => $prodi->id,
                'judul' => $validatedData['judul'],
                'deskripsi' => $validatedData['deskripsi'],
                'tipe_tugas' => $validatedData['tipe_tugas'],
                'waktu_mulai' => $validatedData['waktu_mulai'],
                'batas_waktu' => $validatedData['batas_waktu'],
            ]);

            $tugas->kelasHarians()->attach($validatedData['kelas_harian_ids']);

            DB::commit();

            return redirect()->route('my.tweek.index')->with('success', 'Tugas pekanan berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan tugas. Silakan coba lagi.');
        }
    }

    public function edit($uuid)
    {
        $tugasPekanan = TugasPekanan::where('uuid', $uuid)->firstOrFail();

        // Muat relasi yang dibutuhkan
        $tugasPekanan->load('kelasHarians', 'prodi');

        // Ambil data untuk filter dropdown
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get();
        $prodis = Prodi::orderBy('nama_prodi', 'asc')->get();

        session(['previous_url' => url()->previous()]);

        // Ambil data dari kelas pertama yang terhubung untuk pre-fill filter
        $firstKelas = $tugasPekanan->kelasHarians->first();

        return inertia('My/Admin/Pekanan/TugasPekanan/Edit', [
            'tugasPekanan' => $tugasPekanan,
            'angkatans' => $angkatans,
            'prodis' => $prodis,
            // Kirim data filter yang sudah ada
            'initialFilters' => [
                'tahun_angkatan' => $firstKelas->tahun ?? '',
                'kode_prodi' => $tugasPekanan->prodi->kode_prodi ?? '',
                'semester' => $firstKelas->semester ?? '',
            ],
        ]);
    }

    /**
     * Memperbarui data tugas pekanan di database.
     */
    public function update(Request $request, $uuid)
    {
        $tugasPekanan = TugasPekanan::where('uuid', $uuid)->firstOrFail();

        $validatedData = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tipe_tugas' => 'required|in:yt,other',
            'waktu_mulai' => 'required|date',
            'batas_waktu' => 'required|date|after:waktu_mulai',
            'kode_prodi' => 'required|exists:prodis,kode_prodi',
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
        ]);

        DB::beginTransaction();
        try {
            $prodi = Prodi::where('kode_prodi', $validatedData['kode_prodi'])->firstOrFail();

            $tugasPekanan->update([
                'prodi_id' => $prodi->id,
                'judul' => $validatedData['judul'],
                'deskripsi' => $validatedData['deskripsi'],
                'tipe_tugas' => $validatedData['tipe_tugas'],
                'waktu_mulai' => $validatedData['waktu_mulai'],
                'batas_waktu' => $validatedData['batas_waktu'],
            ]);

            $tugasPekanan->kelasHarians()->sync($validatedData['kelas_harian_ids']);

            DB::commit();
            return redirect(session('previous_url'))->with('success', 'Tugas pekanan berhasil diperbarui!');
            // return redirect()->route('my.tweek.show', $tugasPekanan->prodi->uuid)->with('success', 'Tugas pekanan berhasil diperbarui!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat memperbarui tugas.');
        }
    }

    public function destroy($uuid)
    {
        $tugasPekanan = TugasPekanan::where('uuid', $uuid)->firstOrFail();

        try {
            $tugasPekanan->delete();

            return redirect()->back()->with('success', 'Tugas pekanan berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus tugas.');
        }
    }

    public function submitGrade(Request $request,  $uuid)
    {
        $pengumpulanTugasPekanan = PengumpulanTugasPekanan::where('uuid', $uuid)->firstOrFail();
        // Validasi input
        $validated = $request->validate([
            'nilai' => 'required|integer|between:0,100',
            'feedback_dosen' => 'nullable|string',
        ]);

        // Update data pengumpulan tugas
        $pengumpulanTugasPekanan->update([
            'nilai' => $validated['nilai'],
            'feedback_dosen' => $validated['feedback_dosen'],
            'status' => 'dinilai', // Otomatis ubah status menjadi 'dinilai'
        ]);

        return redirect()->back()->with('success', 'Nilai berhasil disimpan!');
    }

    public function bulkUpdateDeadline(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1', // Array UUID tugas yang dipilih
            'ids.*' => 'exists:tugas_pekanans,uuid',
            'batas_waktu' => 'required|date', // Tanggal baru
        ]);

        try {
            // Update batas_waktu untuk semua UUID yang dikirim
            // TugasPekanan::whereIn('uuid', $validated['ids'])
            //     ->update(['batas_waktu' => $validated['batas_waktu']]);

            // return redirect()->back()->with('success', 'Deadline berhasil diperbarui untuk ' . count($validated['ids']) . ' tugas.');
            
            // 1. Parsing format tanggal agar sesuai format Database (Y-m-d H:i:s)
            // Ini menghilangkan 'T' dan memastikan formatnya benar
            $formattedDate = Carbon::parse($validated['batas_waktu'])->format('Y-m-d H:i:s');

            // 2. Lakukan Update
            // Kita tampung ke variabel $affected untuk mengecek apakah ada baris yang berubah
            $affected = TugasPekanan::whereIn('uuid', $validated['ids'])
                ->update([
                    'batas_waktu' => $formattedDate,
                    'updated_at' => Carbon::now(), // Update timestamp updated_at manual karena query builder tidak otomatis mengubahnya
                ]);

            // 3. Cek hasil update
            if ($affected > 0) {
                return redirect()->back()->with('success', "Deadline berhasil diperbarui untuk $affected tugas.");
            } else {
                // Ini terjadi jika UUID valid tapi mungkin datanya tidak ditemukan saat query update (jarang terjadi jika validasi lolos)
                return redirect()->back()->with('error', 'Data tidak ditemukan atau tidak ada perubahan.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui deadline.');
        }
    }
}
