<?php

namespace App\Http\Controllers\My\Mahasiswa\SKL;

use App\Http\Controllers\Controller;
use App\Models\SKL\Buku;
use App\Models\SKL\PengumpulanBuku;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Validation\Rule;

class BukuController extends Controller
{
    public function index(Request $request)
    {
        $getProcessedData = function (Request $request) {
            $mahasiswa = Auth::user()->mahasiswa;
            $statusFilter = $request->query('status');
            $kelasIds = $mahasiswa->kelasHarians()->pluck('kelas_harians.id');

            // GANTI MODEL & RELASI
            $allBukus = Buku::whereHas('kelasHarians', fn($q) => $q->whereIn('kelas_harians.id', $kelasIds))
                ->with([
                    // Ganti relasi
                    'pengumpulanBukus' => fn($q) => $q->where('mahasiswa_id', $mahasiswa->id),
                    'kelasHarians' => fn($q) => $q->whereIn('kelas_harians.id', $kelasIds)
                ])
                ->latest('waktu_mulai')
                ->get();

            // GANTI VARIABEL
            $processedBukus = $allBukus->map(function ($buku) {
                // Ganti relasi
                $submission = $buku->pengumpulanBukus->first();
                $status = 'Belum Dikerjakan';
                if ($submission) {
                    $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
                } elseif (Carbon::now()->gt($buku->batas_waktu)) {
                    $status = 'Terlambat';
                }
                $buku->status = $status;
                $buku->nama_kelas = $buku->kelasHarians->first()->nama_kelas ?? 'N/A';
                return $buku;
            });

            // GANTI VARIABEL
            $filteredBukus = $processedBukus;
            if ($statusFilter) {
                $filteredBukus = $processedBukus->filter(function ($buku) use ($statusFilter) {
                    if ($statusFilter === 'Selesai') return in_array($buku->status, ['Sudah Dikumpulkan', 'Sudah Dinilai']);
                    return $buku->status === $statusFilter;
                });
            }

            return ['processed' => $processedBukus, 'filtered' => $filteredBukus];
        };

        // Jika request datang dari Axios (minta data JSON)
        if ($request->wantsJson()) {
            $data = $getProcessedData($request);
            $filteredBukus = $data['filtered']; // GANTI VARIABEL

            $perPage = 9;
            $currentPage = Paginator::resolveCurrentPage('page');
            $currentPageItems = $filteredBukus->slice(($currentPage - 1) * $perPage, $perPage)->values(); // GANTI VARIABEL

            // GANTI VARIABEL
            $bukus = new LengthAwarePaginator(
                $currentPageItems,
                $filteredBukus->count(),
                $perPage,
                $currentPage,
                ['path' => $request->url(), 'query' => $request->query()]
            );

            return response()->json($bukus); // GANTI VARIABEL
        }

        // Jika request awal (memuat halaman Inertia)
        $data = $getProcessedData($request);
        $processedBukus = $data['processed']; // GANTI VARIABEL
        $statusCounts = [
            'Semua' => $processedBukus->count(),
            'Belum Dikerjakan' => $processedBukus->where('status', 'Belum Dikerjakan')->count(),
            'Selesai' => $processedBukus->whereIn('status', ['Sudah Dikumpulkan', 'Sudah Dinilai'])->count(),
            'Terlambat' => $processedBukus->where('status', 'Terlambat')->count(),
        ];

        // GANTI PATH INERTIA
        return inertia('My/Mahasiswa/SKL/Buku/Index', [
            'filters' => $request->only(['status']),
            'statusCounts' => $statusCounts,
        ]);
    }

    // GANTI ROUTE MODEL BINDING
    public function show(Buku $buku)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // GANTI RELASI
        $submission = $buku->pengumpulanBukus()
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // Tentukan status tugas untuk ditampilkan di view
        $status = 'Belum Dikerjakan';
        if ($submission) {
            $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
        } elseif (Carbon::now()->gt($buku->batas_waktu)) { // GANTI VARIABEL
            $status = 'Terlambat';
        }

        // GANTI PATH INERTIA & NAMA PROP
        return inertia('My/Mahasiswa/SKL/Buku/Show', [
            'buku' => $buku->load('prodi'), // Ganti prop
            'submission' => $submission,
            'status' => $status,
        ]);
    }

    /**
     * Menyimpan jawaban buku dari mahasiswa.
     */
    public function submit(Request $request, $uuid)
    {
        // GANTI MODEL
        $buku = Buku::where('uuid', $uuid)->firstOrFail();
        $mahasiswa = Auth::user()->mahasiswa;

        // Ambil data pengumpulan yang sudah ada (jika ada)
        // GANTI MODEL & RELASI
        $pengumpulan = PengumpulanBuku::where('buku_id', $buku->id)
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // --- VALIDASI (PENTING: Sesuaikan dengan field 'pengumpulan_bukus') ---
        $request->validate([
            'link_naskah_draft' => [ // Ganti field
                'required', // Asumsi sama-sama required
                'url',
                // 'max:255',
                'regex:/^https:\/\/docs\.google\.com\/document\/.+$/',
                Rule::unique('pengumpulan_bukus', 'link_naskah_draft') // Ganti tabel & field
                    ->ignore(optional($pengumpulan)->id),
            ],
            'link_hasil_buku' => [ // Ganti field
                'required', // Asumsi sama-sama required
                'url',
                'regex:/^https:\/\/drive\.google\.com\/file\/.+$/',
                Rule::unique('pengumpulan_bukus', 'link_hasil_buku') // Ganti tabel & field
                    ->ignore(optional($pengumpulan)->id),
            ]
        ], [
            // Ganti pesan error
            'link_naskah_draft.url' => 'Link naskah draft harus berupa URL yang valid (sertakan http:// atau https://).',
            'link_naskah_draft.unique' => 'Link naskah draft sudah digunakan oleh mahasiswa lain.',
            'link_naskah_draft.required' => 'Link naskah draft harus diisi.',
            'link_hasil_buku.url' => 'Link hasil buku harus berupa URL yang valid (sertakan http:// atau https://).',
            'link_hasil_buku.unique' => 'Link hasil buku sudah digunakan oleh mahasiswa lain.',
            'link_hasil_buku.required' => 'Link hasil buku harus diisi.',
            'link_naskah_draft.regex' => 'Link naskah draft harus dari https://docs.google.com/document/.',
            'link_hasil_buku.regex' => 'Link hasil buku harus dari https://drive.google.com/file/',
        ]);

        // Validasi kustom: setidaknya satu field harus diisi
        // GANTI: Cek field baru
        if (empty($request->link_naskah_draft) && empty($request->link_hasil_buku)) {
            return redirect()->back()->withInput()->withErrors([
                // Ganti pesan error
                'link_naskah_draft' => 'Anda harus mengisi setidaknya salah satu: Link Naskah Draft atau Link Hasil Buku.'
            ]);
        }
        // --- SELESAI GANTI VALIDASI ---


        // Cek apakah sudah lewat batas waktu (beri toleransi 1 menit)
        if (Carbon::now()->gt($buku->batas_waktu->addMinute())) {
            return redirect()->back()->with('error', 'Waktu pengumpulan telah berakhir.');
        }

        $status = Carbon::now()->gt($buku->batas_waktu) ? 'terlambat' : 'diserahkan';

        // GANTI MODEL & FIELD
        PengumpulanBuku::updateOrCreate(
            [
                'buku_id' => $buku->id, // Ganti field
                'mahasiswa_id' => $mahasiswa->id,
            ],
            [
                'link_naskah_draft' => $request->link_naskah_draft, // Ganti field
                'link_hasil_buku' => $request->link_hasil_buku, // Ganti field
                'status' => $status,
            ]
        );

        // GANTI ROUTE & TEKS
        return redirect()->route('mhs.buku.show', $buku->uuid)->with('success', 'Buku berhasil dikumpulkan!');
    }
}
