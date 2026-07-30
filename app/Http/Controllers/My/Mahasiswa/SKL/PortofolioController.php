<?php

namespace App\Http\Controllers\My\Mahasiswa\SKL;

use App\Http\Controllers\Controller;
use App\Models\SKL\PengumpulanPortofolio;
use App\Models\SKL\Portofolio;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Validation\Rule;

class PortofolioController extends Controller
{
    public function index(Request $request)
    {
        $getProcessedData = function (Request $request) {
            $mahasiswa = Auth::user()->mahasiswa;
            $statusFilter = $request->query('status');
            $kelasIds = $mahasiswa->kelasHarians()->pluck('kelas_harians.id');

            // GANTI MODEL & RELASI
            $allPortofolios = Portofolio::whereHas('kelasHarians', fn($q) => $q->whereIn('kelas_harians.id', $kelasIds))
                ->with([
                    // Ganti relasi
                    'pengumpulanPortofolios' => fn($q) => $q->where('mahasiswa_id', $mahasiswa->id),
                    'kelasHarians' => fn($q) => $q->whereIn('kelas_harians.id', $kelasIds)
                ])
                ->latest('waktu_mulai')
                ->get();

            // GANTI VARIABEL
            $processedPortofolios = $allPortofolios->map(function ($portofolio) {
                // Ganti relasi
                $submission = $portofolio->pengumpulanPortofolios->first();
                $status = 'Belum Dikerjakan';
                if ($submission) {
                    $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
                } elseif (Carbon::now()->gt($portofolio->batas_waktu)) {
                    $status = 'Terlambat';
                }
                $portofolio->status = $status;
                $portofolio->nama_kelas = $portofolio->kelasHarians->first()->nama_kelas ?? 'N/A';
                return $portofolio;
            });

            // GANTI VARIABEL
            $filteredPortofolios = $processedPortofolios;
            if ($statusFilter) {
                $filteredPortofolios = $processedPortofolios->filter(function ($portofolio) use ($statusFilter) {
                    if ($statusFilter === 'Selesai') return in_array($portofolio->status, ['Sudah Dikumpulkan', 'Sudah Dinilai']);
                    return $portofolio->status === $statusFilter;
                });
            }

            return ['processed' => $processedPortofolios, 'filtered' => $filteredPortofolios];
        };

        // Jika request datang dari Axios (minta data JSON)
        if ($request->wantsJson()) {
            $data = $getProcessedData($request);
            $filteredPortofolios = $data['filtered']; // GANTI VARIABEL

            $perPage = 9;
            $currentPage = Paginator::resolveCurrentPage('page');
            $currentPageItems = $filteredPortofolios->slice(($currentPage - 1) * $perPage, $perPage)->values(); // GANTI VARIABEL

            // GANTI VARIABEL
            $portofolios = new LengthAwarePaginator(
                $currentPageItems,
                $filteredPortofolios->count(),
                $perPage,
                $currentPage,
                ['path' => $request->url(), 'query' => $request->query()]
            );

            return response()->json($portofolios); // GANTI VARIABEL
        }

        // Jika request awal (memuat halaman Inertia)
        $data = $getProcessedData($request);
        $processedPortofolios = $data['processed']; // GANTI VARIABEL
        $statusCounts = [
            'Semua' => $processedPortofolios->count(),
            'Belum Dikerjakan' => $processedPortofolios->where('status', 'Belum Dikerjakan')->count(),
            'Selesai' => $processedPortofolios->whereIn('status', ['Sudah Dikumpulkan', 'Sudah Dinilai'])->count(),
            'Terlambat' => $processedPortofolios->where('status', 'Terlambat')->count(),
        ];

        // GANTI PATH INERTIA
        return inertia('My/Mahasiswa/SKL/Portofolio/Index', [
            'filters' => $request->only(['status']),
            'statusCounts' => $statusCounts,
        ]);
    }

    // GANTI ROUTE MODEL BINDING
    public function show(Portofolio $portofolio)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // GANTI RELASI
        $submission = $portofolio->pengumpulanPortofolios()
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // Tentukan status tugas untuk ditampilkan di view
        $status = 'Belum Dikerjakan';
        if ($submission) {
            $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
        } elseif (Carbon::now()->gt($portofolio->batas_waktu)) { // GANTI VARIABEL
            $status = 'Terlambat';
        }

        // GANTI PATH INERTIA & NAMA PROP
        return inertia('My/Mahasiswa/SKL/Portofolio/Show', [
            'portofolio' => $portofolio->load('prodi'),
            'submission' => $submission,
            'status' => $status,
        ]);
    }

    /**
     * Menyimpan jawaban portofolio dari mahasiswa.
     */
    public function submit(Request $request, $uuid)
    {
        // GANTI MODEL
        $portofolio = Portofolio::where('uuid', $uuid)->firstOrFail();
        $mahasiswa = Auth::user()->mahasiswa;

        // Ambil data pengumpulan yang sudah ada (jika ada)
        // GANTI MODEL & RELASI
        $pengumpulan = PengumpulanPortofolio::where('portofolio_id', $portofolio->id)
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // --- VALIDASI (PENTING: path_file_laporan dihapus) ---
        $request->validate([
            'link_repository' => [
                'required',
                // 'nullable',
                'url',
                'max:255',
                // Ganti nama tabel
                Rule::unique('pengumpulan_portofolios', 'link_repository')
                    ->ignore(optional($pengumpulan)->id),
            ],
            'link_demo' => [
                'required',
                'url',
                'max:255',
                Rule::unique('pengumpulan_portofolios', 'link_demo')
                    ->ignore(optional($pengumpulan)->id),
            ]
            // 'link_demo' => 'required|url|max:255',
            // 'path_file_laporan' DIHAPUS
        ], [
            'link_repository.url' => 'Link repository harus berupa URL yang valid (sertakan http:// atau https://).',
            'link_repository.unique' => 'Link repository sudah digunakan oleh mahasiswa lain.',
            'link_demo.unique' => 'Link detail sudah digunakan oleh mahasiswa lain.',
            'link_demo.url' => 'Link detail harus berupa URL yang valid (sertakan http:// atau https://).',
            'link_demo.required' => 'Link detail ke halaman https://www.portofolio.politeknikidn.id/detail/... harus diisi.',
            'link_repository.required' => 'Link repository harus diisi.',
        ]);

        // Validasi kustom: setidaknya satu field harus diisi
        // GANTI: Hapus 'path_file_laporan' dari cek
        if (empty($request->link_repository) && empty($request->link_demo)) {
            return redirect()->back()->withInput()->withErrors([
                // Ganti pesan error
                'link_repository' => 'Anda harus mengisi setidaknya salah satu: Link Repository atau Link Demo.'
            ]);
        }
        // --- SELESAI GANTI VALIDASI ---


        // Cek apakah sudah lewat batas waktu (beri toleransi 1 menit)
        if (Carbon::now()->gt($portofolio->batas_waktu->addMinute())) {
            return redirect()->back()->with('error', 'Waktu pengumpulan telah berakhir.');
        }

        $status = Carbon::now()->gt($portofolio->batas_waktu) ? 'terlambat' : 'diserahkan';

        // GANTI MODEL & FIELD (path_file_laporan dihapus)
        PengumpulanPortofolio::updateOrCreate(
            [
                'portofolio_id' => $portofolio->id, // Ganti field
                'mahasiswa_id' => $mahasiswa->id,
            ],
            [
                'link_repository' => $request->link_repository,
                'link_demo' => $request->link_demo,
                // 'path_file_laporan' DIHAPUS
                'status' => $status,
            ]
        );

        // GANTI ROUTE & TEKS
        return redirect()->route('mhs.portofolio.show', $portofolio->uuid)->with('success', 'Portofolio berhasil dikumpulkan!');
    }
}
