<?php

namespace App\Http\Controllers\My\Mahasiswa\SKL;

use App\Http\Controllers\Controller;
use App\Models\SKL\PengumpulanSertifikat;
use App\Models\SKL\Sertifikat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Validation\Rule;

class SertifikatController extends Controller
{
    public function index(Request $request)
    {
        $getProcessedData = function (Request $request) {
            $mahasiswa = Auth::user()->mahasiswa;
            $statusFilter = $request->query('status');
            $kelasIds = $mahasiswa->kelasHarians()->pluck('kelas_harians.id');

            // GANTI MODEL & RELASI
            $allSertifikats = Sertifikat::whereHas('kelasHarians', fn($q) => $q->whereIn('kelas_harians.id', $kelasIds))
                ->with([
                    // Ganti relasi
                    'pengumpulanSertifikats' => fn($q) => $q->where('mahasiswa_id', $mahasiswa->id),
                    'kelasHarians' => fn($q) => $q->whereIn('kelas_harians.id', $kelasIds)
                ])
                ->latest('waktu_mulai')
                ->get();

            // GANTI VARIABEL
            $processedSertifikats = $allSertifikats->map(function ($sertifikat) {
                // Ganti relasi
                $submission = $sertifikat->pengumpulanSertifikats->first();
                $status = 'Belum Dikerjakan';
                if ($submission) {
                    $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
                } elseif (Carbon::now()->gt($sertifikat->batas_waktu)) {
                    $status = 'Terlambat';
                }
                $sertifikat->status = $status;
                $sertifikat->nama_kelas = $sertifikat->kelasHarians->first()->nama_kelas ?? 'N/A';
                return $sertifikat;
            });

            // GANTI VARIABEL
            $filteredSertifikats = $processedSertifikats;
            if ($statusFilter) {
                $filteredSertifikats = $processedSertifikats->filter(function ($sertifikat) use ($statusFilter) {
                    if ($statusFilter === 'Selesai') return in_array($sertifikat->status, ['Sudah Dikumpulkan', 'Sudah Dinilai']);
                    return $sertifikat->status === $statusFilter;
                });
            }

            return ['processed' => $processedSertifikats, 'filtered' => $filteredSertifikats];
        };

        // Jika request datang dari Axios (minta data JSON)
        if ($request->wantsJson()) {
            $data = $getProcessedData($request);
            $filteredSertifikats = $data['filtered']; // GANTI VARIABEL

            $perPage = 9;
            $currentPage = Paginator::resolveCurrentPage('page');
            $currentPageItems = $filteredSertifikats->slice(($currentPage - 1) * $perPage, $perPage)->values(); // GANTI VARIABEL

            // GANTI VARIABEL
            $sertifikats = new LengthAwarePaginator(
                $currentPageItems,
                $filteredSertifikats->count(),
                $perPage,
                $currentPage,
                ['path' => $request->url(), 'query' => $request->query()]
            );

            return response()->json($sertifikats); // GANTI VARIABEL
        }

        // Jika request awal (memuat halaman Inertia)
        $data = $getProcessedData($request);
        $processedSertifikats = $data['processed']; // GANTI VARIABEL
        $statusCounts = [
            'Semua' => $processedSertifikats->count(),
            'Belum Dikerjakan' => $processedSertifikats->where('status', 'Belum Dikerjakan')->count(),
            'Selesai' => $processedSertifikats->whereIn('status', ['Sudah Dikumpulkan', 'Sudah Dinilai'])->count(),
            'Terlambat' => $processedSertifikats->where('status', 'Terlambat')->count(),
        ];

        // GANTI PATH INERTIA
        return inertia('My/Mahasiswa/SKL/Sertifikat/Index', [
            'filters' => $request->only(['status']),
            'statusCounts' => $statusCounts,
        ]);
    }

    // GANTI ROUTE MODEL BINDING
    public function show(Sertifikat $sertifikat)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // GANTI RELASI
        $submission = $sertifikat->pengumpulanSertifikats()
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // Tentukan status tugas untuk ditampilkan di view
        $status = 'Belum Dikerjakan';
        if ($submission) {
            $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
        } elseif (Carbon::now()->gt($sertifikat->batas_waktu)) { // GANTI VARIABEL
            $status = 'Terlambat';
        }

        // GANTI PATH INERTIA & NAMA PROP
        return inertia('My/Mahasiswa/SKL/Sertifikat/Show', [
            'sertifikat' => $sertifikat->load('prodi'), // Ganti prop
            'submission' => $submission,
            'status' => $status,
        ]);
    }

    /**
     * Menyimpan jawaban sertifikat dari mahasiswa.
     */
    public function submit(Request $request, $uuid)
    {
        // GANTI MODEL
        $sertifikat = Sertifikat::where('uuid', $uuid)->firstOrFail();
        $mahasiswa = Auth::user()->mahasiswa;

        // Ambil data pengumpulan yang sudah ada (jika ada)
        // GANTI MODEL & RELASI
        $pengumpulan = PengumpulanSertifikat::where('sertifikat_id', $sertifikat->id)
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // --- VALIDASI (PENTING: Sesuaikan dengan field 'pengumpulan_sertifikats') ---
        $request->validate([
            'nama_penerbit' => 'required|string|max:255',
            'tanggal_terbit' => 'required|date',
            'link_file_sertifikat' => [
                'required',
                'url',
                'regex:/^https:\/\/drive\.google\.com\/(file|open)\/.+$/',
                Rule::unique('pengumpulan_sertifikats', 'link_file_sertifikat') // Ganti tabel & field
                    ->ignore(optional($pengumpulan)->id),
            ],
            'link_verifikasi' => [
                'nullable',
                'url',
                Rule::unique('pengumpulan_sertifikats', 'link_verifikasi') // Ganti tabel & field
                    ->ignore(optional($pengumpulan)->id),
            ]
        ], [
            // Ganti pesan error
            'nama_penerbit.required' => 'Nama penerbit harus diisi.',
            'tanggal_terbit.required' => 'Tanggal terbit harus diisi.',
            'link_file_sertifikat.required' => 'Link file sertifikat harus diisi.',
            'link_file_sertifikat.url' => 'Link file sertifikat harus berupa URL yang valid.',
            'link_file_sertifikat.regex' => 'Link file sertifikat harus berupa link Google Drive yang valid.',
            'link_file_sertifikat.unique' => 'Link file ini sudah digunakan oleh mahasiswa lain.',
            'link_verifikasi.url' => 'Link verifikasi harus berupa URL yang valid.',
            'link_verifikasi.unique' => 'Link verifikasi ini sudah digunakan oleh mahasiswa lain.',
        ]);

        // Cek apakah sudah lewat batas waktu (beri toleransi 1 menit)
        if (Carbon::now()->gt($sertifikat->batas_waktu->addMinute())) {
            return redirect()->back()->with('error', 'Waktu pengumpulan telah berakhir.');
        }

        $status = Carbon::now()->gt($sertifikat->batas_waktu) ? 'terlambat' : 'diserahkan';

        // GANTI MODEL & FIELD
        PengumpulanSertifikat::updateOrCreate(
            [
                'sertifikat_id' => $sertifikat->id, // Ganti field
                'mahasiswa_id' => $mahasiswa->id,
            ],
            [
                'link_file_sertifikat' => $request->link_file_sertifikat,
                'link_verifikasi' => $request->link_verifikasi,
                'nama_penerbit' => $request->nama_penerbit,
                'tanggal_terbit' => $request->tanggal_terbit,
                'status' => $status,
            ]
        );

        // GANTI ROUTE & TEKS
        return redirect()->route('mhs.sertifikat.show', $sertifikat->uuid)->with('success', 'Sertifikat berhasil dikumpulkan!');
    }
}
