<?php

namespace App\Http\Controllers\My\Mahasiswa\SKL;

use App\Http\Controllers\Controller;
use App\Models\SKL\PengumpulanProjectSemester;
use App\Models\SKL\ProjectSemester;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Validation\Rule;

class ProjectSemesterController extends Controller
{
    public function index(Request $request)
    {
        $getProcessedData = function (Request $request) {
            $mahasiswa = Auth::user()->mahasiswa;
            $statusFilter = $request->query('status');
            $kelasIds = $mahasiswa->kelasHarians()->pluck('kelas_harians.id');

            // GANTI MODEL & RELASI
            $allProjects = ProjectSemester::whereHas('kelasHarians', fn($q) => $q->whereIn('kelas_harians.id', $kelasIds))
                ->with([
                    'pengumpulanProjectSemesters' => fn($q) => $q->where('mahasiswa_id', $mahasiswa->id),
                    'kelasHarians' => fn($q) => $q->whereIn('kelas_harians.id', $kelasIds)
                ])
                ->latest('waktu_mulai')
                ->get();

            // GANTI VARIABEL
            $processedProjects = $allProjects->map(function ($project) {
                $submission = $project->pengumpulanProjectSemesters->first();
                $status = 'Belum Dikerjakan';
                if ($submission) {
                    $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
                } elseif (Carbon::now()->gt($project->batas_waktu)) {
                    $status = 'Terlambat';
                }
                $project->status = $status;
                $project->nama_kelas = $project->kelasHarians->first()->nama_kelas ?? 'N/A';
                return $project;
            });

            // GANTI VARIABEL
            $filteredProjects = $processedProjects;
            if ($statusFilter) {
                $filteredProjects = $processedProjects->filter(function ($project) use ($statusFilter) {
                    if ($statusFilter === 'Selesai') return in_array($project->status, ['Sudah Dikumpulkan', 'Sudah Dinilai']);
                    return $project->status === $statusFilter;
                });
            }

            return ['processed' => $processedProjects, 'filtered' => $filteredProjects];
        };

        // Jika request datang dari Axios (minta data JSON)
        if ($request->wantsJson()) {
            $data = $getProcessedData($request);
            $filteredProjects = $data['filtered']; // GANTI VARIABEL

            $perPage = 9;
            $currentPage = Paginator::resolveCurrentPage('page');
            $currentPageItems = $filteredProjects->slice(($currentPage - 1) * $perPage, $perPage)->values(); // GANTI VARIABEL

            // GANTI VARIABEL
            $projectSemesters = new LengthAwarePaginator(
                $currentPageItems,
                $filteredProjects->count(),
                $perPage,
                $currentPage,
                ['path' => $request->url(), 'query' => $request->query()]
            );

            return response()->json($projectSemesters); // GANTI VARIABEL
        }

        // Jika request awal (memuat halaman Inertia)
        $data = $getProcessedData($request);
        $processedProjects = $data['processed']; // GANTI VARIABEL
        $statusCounts = [
            'Semua' => $processedProjects->count(),
            'Belum Dikerjakan' => $processedProjects->where('status', 'Belum Dikerjakan')->count(),
            'Selesai' => $processedProjects->whereIn('status', ['Sudah Dikumpulkan', 'Sudah Dinilai'])->count(),
            'Terlambat' => $processedProjects->where('status', 'Terlambat')->count(),
        ];

        // GANTI PATH INERTIA
        return inertia('My/Mahasiswa/SKL/Index', [
            'filters' => $request->only(['status']),
            'statusCounts' => $statusCounts,
        ]);
    }

    // GANTI ROUTE MODEL BINDING
    public function show(ProjectSemester $projectSemester)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // GANTI RELASI
        $submission = $projectSemester->pengumpulanProjectSemesters()
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // Tentukan status tugas untuk ditampilkan di view
        $status = 'Belum Dikerjakan';
        if ($submission) {
            $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
        } elseif (Carbon::now()->gt($projectSemester->batas_waktu)) { // GANTI VARIABEL
            $status = 'Terlambat';
        }

        // GANTI PATH INERTIA & NAMA PROP
        return inertia('My/Mahasiswa/SKL/Show', [
            'projectSemester' => $projectSemester->load('prodi'),
            'submission' => $submission,
            'status' => $status,
        ]);
    }

    /**
     * Menyimpan jawaban project dari mahasiswa.
     */
    public function submit(Request $request, $uuid)
    {
        // GANTI MODEL
        $projectSemester = ProjectSemester::where('uuid', $uuid)->firstOrFail();
        $mahasiswa = Auth::user()->mahasiswa;

        // Ambil data pengumpulan yang sudah ada (jika ada)
        $pengumpulan = PengumpulanProjectSemester::where('project_semester_id', $projectSemester->id)
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // --- VALIDASI ---
        $request->validate([
            'link_repository' => [
                'nullable',
                'url',
                'max:255',
                Rule::unique('pengumpulan_project_semesters', 'link_repository')
                    ->ignore(optional($pengumpulan)->id),
            ],
            'link_demo' => 'nullable|url|max:255',
            'path_file_laporan' => 'nullable|string|max:255', // Asumsi ini adalah string, bukan file upload
        ], [
            'link_repository.url' => 'Link repository harus berupa URL yang valid (sertakan http:// atau https://).',
            'link_repository.unique' => 'Link repository sudah digunakan oleh mahasiswa lain.',
            'link_demo.url' => 'Link demo harus berupa URL yang valid (sertakan http:// atau https://).',
            'link_demo.unique' => 'Link demo sudah digunakan oleh mahasiswa lain.',
        ]);

        // Validasi kustom: setidaknya satu field harus diisi
        if (empty($request->link_repository) && empty($request->link_demo) && empty($request->path_file_laporan)) {
            return redirect()->back()->withInput()->withErrors([
                'link_repository' => 'Anda harus mengisi setidaknya salah satu: Link Repository, Link Demo/Link Presentasi.'
            ]);
        }
        // --- SELESAI GANTI VALIDASI ---


        // Cek apakah sudah lewat batas waktu (beri toleransi 1 menit)
        if (Carbon::now()->gt($projectSemester->batas_waktu->addMinute())) {
            return redirect()->back()->with('error', 'Waktu pengumpulan telah berakhir.');
        }

        $status = Carbon::now()->gt($projectSemester->batas_waktu) ? 'terlambat' : 'diserahkan';

        // GANTI MODEL & FIELD
        PengumpulanProjectSemester::updateOrCreate(
            [
                'project_semester_id' => $projectSemester->id,
                'mahasiswa_id' => $mahasiswa->id,
            ],
            [
                'link_repository' => $request->link_repository,
                'link_demo' => $request->link_demo,
                'path_file_laporan' => $request->path_file_laporan,
                'status' => $status,
            ]
        );

        // GANTI ROUTE & TEKS
        return redirect()->route('mhs.tsem.show', $projectSemester->uuid)->with('success', 'Project berhasil dikumpulkan!');
    }
}
