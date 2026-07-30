<?php

namespace App\Http\Controllers\My\Mahasiswa\Pekanan;

use App\Http\Controllers\Controller;
use App\Models\Pekanan\PengumpulanTugasPekanan;
use App\Models\Pekanan\TugasPekanan;
use App\Rules\UniqueVideoIdForTask;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class TugasPekananController extends Controller
{
    public function index(Request $request)
    {
        $getProcessedData = function (Request $request) {
            $mahasiswa = Auth::user()->mahasiswa;
            $statusFilter = $request->query('status');
            $kelasIds = $mahasiswa->kelasHarians()->pluck('kelas_harians.id');

            $allTugas = TugasPekanan::whereHas('kelasHarians', fn($q) => $q->whereIn('kelas_harians.id', $kelasIds))
                ->with([
                    'pengumpulanTugasPekanans' => fn($q) => $q->where('mahasiswa_id', $mahasiswa->id),
                    'kelasHarians' => fn($q) => $q->whereIn('kelas_harians.id', $kelasIds)
                ])
                ->latest('waktu_mulai')
                ->get();

            $processedTugas = $allTugas->map(function ($tugas) {
                $submission = $tugas->pengumpulanTugasPekanans->first();
                $status = 'Belum Dikerjakan';
                if ($submission) {
                    $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
                } elseif (Carbon::now()->gt($tugas->batas_waktu)) {
                    $status = 'Terlambat';
                }
                $tugas->status = $status;
                $tugas->nama_kelas = $tugas->kelasHarians->first()->nama_kelas ?? 'N/A';
                return $tugas;
            });

            $filteredTugas = $processedTugas;
            if ($statusFilter) {
                $filteredTugas = $processedTugas->filter(function ($tugas) use ($statusFilter) {
                    if ($statusFilter === 'Selesai') return in_array($tugas->status, ['Sudah Dikumpulkan', 'Sudah Dinilai']);
                    return $tugas->status === $statusFilter;
                });
            }

            return ['processed' => $processedTugas, 'filtered' => $filteredTugas];
        };

        // Jika request datang dari Axios (minta data JSON)
        if ($request->wantsJson()) {
            $data = $getProcessedData($request);
            $filteredTugas = $data['filtered'];

            $perPage = 9;
            $currentPage = Paginator::resolveCurrentPage('page');
            $currentPageItems = $filteredTugas->slice(($currentPage - 1) * $perPage, $perPage)->values();

            $tugasPekanans = new LengthAwarePaginator(
                $currentPageItems, $filteredTugas->count(), $perPage, $currentPage,
                ['path' => $request->url(), 'query' => $request->query()]
            );

            return response()->json($tugasPekanans);
        }
        
        // Jika request awal (memuat halaman Inertia)
        $data = $getProcessedData($request);
        $processedTugas = $data['processed'];
        $statusCounts = [
            'Semua' => $processedTugas->count(),
            'Belum Dikerjakan' => $processedTugas->where('status', 'Belum Dikerjakan')->count(),
            'Selesai' => $processedTugas->whereIn('status', ['Sudah Dikumpulkan', 'Sudah Dinilai'])->count(),
            'Terlambat' => $processedTugas->where('status', 'Terlambat')->count(),
        ];

        return inertia('My/Mahasiswa/Pekanan/Index', [
            'filters' => $request->only(['status']),
            'statusCounts' => $statusCounts,
        ]);
    }

    public function show(TugasPekanan $tugasPekanan)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        // Ambil data pengumpulan tugas milik mahasiswa ini (jika ada)
        $submission = $tugasPekanan->pengumpulanTugasPekanans()
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        // Tentukan status tugas untuk ditampilkan di view
        $status = 'Belum Dikerjakan';
        if ($submission) {
            $status = $submission->nilai !== null ? 'Sudah Dinilai' : 'Sudah Dikumpulkan';
        } elseif (Carbon::now()->gt($tugasPekanan->batas_waktu)) {
            $status = 'Terlambat';
        }

        return inertia('My/Mahasiswa/Pekanan/Show', [
            'tugasPekanan' => $tugasPekanan->load('prodi'), // Muat relasi prodi
            'submission' => $submission,
            'status' => $status,
        ]);
    }

    /**
     * Menyimpan jawaban tugas dari mahasiswa.
     */
    public function submit(Request $request, $uuid)
    {
        $tugasPekanan = TugasPekanan::where('uuid', $uuid)->firstOrFail();

        $mahasiswa = Auth::user()->mahasiswa;

        $request->validate([
            'jawaban' => ['required', Rule::when($tugasPekanan->tipe_tugas === 'other', 'url')],
            'jawaban.*' => [
                // Rule::when($tugasPekanan->tipe_tugas === 'yt', [
                //     'string',
                //     'max:20',
                //     'distinct', 
                //     new UniqueVideoIdForTask($tugasPekanan->id, $mahasiswa->id, $tugasPekanan->prodi_id),
                // ]),
                'string',
                // 'max:12',
                'size:11',
                'distinct',
                Rule::when($tugasPekanan->tipe_tugas === 'yt', [
                    'regex:/^[a-zA-Z0-9_-]{11}$/', // YouTube video ID pattern
                    'not_regex:/^https?:\/\//', // Tolak jika ada http:// atau https://
                    'not_regex:/^www\./',           // Tolak link yang dimulai www.
                    new UniqueVideoIdForTask($tugasPekanan->id, $mahasiswa->id, $tugasPekanan->prodi_id),
                ]),
            ],
        ], [
            'jawaban.required' => 'Anda harus mengisi setidaknya satu jawaban.',
            'jawaban.url' => 'Jawaban harus berupa link URL yang valid.',
            // 'jawaban.*.max' => 'Video ID tidak boleh lebih dari 12 karakter.',
            'jawaban.*.size' => 'ID Video YouTube harus terdiri dari tepat 11 karakter.',
            'jawaban.*.distinct' => 'Setiap Video ID dalam pengumpulan Anda harus unik.',
            'jawaban.*.regex' => 'ID Video YouTube hanya boleh mengandung huruf, angka, garis bawah (_), atau strip (-).',
            'jawaban.*.not_regex' => 'Jangan masukkan link YouTube (termasuk yang dimulai dengan http, https, atau www). Hanya masukkan ID Video YouTube saja.',
            // 'jawaban.*.regex' => 'ID Video YouTube harus dalam format yang benar.',
            // 'jawaban.*.not_regex' => 'Jangan masukkan link YouTube. Hanya masukkan ID Video YouTube saja.',
        ]);

        // Cek apakah sudah lewat batas waktu (beri toleransi 1 menit)
        if (Carbon::now()->gt($tugasPekanan->batas_waktu->addMinute())) {
            return redirect()->back()->with('error', 'Waktu pengumpulan telah berakhir.');
        }

        $status = Carbon::now()->gt($tugasPekanan->batas_waktu) ? 'terlambat' : 'diserahkan';

        PengumpulanTugasPekanan::updateOrCreate(
            [
                'tugas_pekanan_id' => $tugasPekanan->id,
                'mahasiswa_id' => $mahasiswa->id,
            ],
            [
                'jawaban' => $request->jawaban,
                'status' => $status,
            ]
        );

        return redirect()->route('mhs.tweek.show', $tugasPekanan->uuid)->with('success', 'Tugas berhasil dikumpulkan!');
    }
}
