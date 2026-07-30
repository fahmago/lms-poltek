<?php

namespace App\Http\Controllers\My\Mahasiswa\Ibadah;

use App\Http\Controllers\Controller;
use App\Models\Ibadah\JawabanLaporan;
use App\Models\Ibadah\LaporanIbadah;
use App\Models\Ibadah\Pertanyaan;
use App\Models\Ibadah\PilihanJawaban;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class LaporanIbadahController extends Controller
{
    public function index()
    {
        $mahasiswa = Auth::user()->mahasiswa;
        if (!$mahasiswa) {
            return redirect()->route('my.dashboard.index')->with('error', 'Profil mahasiswa Anda tidak ditemukan.');
        }

        // 1. Tentukan rentang tanggal (30 hari terakhir, termasuk hari ini)
        $endDate = Carbon::now()->endOfDay();
        $startDate = Carbon::now()->subDays(14)->startOfDay(); // 14 hari sebelum hari ini

        // 2. Ambil semua laporan yang ADA dalam rentang tanggal ini
        //    Gunakan keyBy() untuk memetakan laporan berdasarkan tanggal (Y-m-d)
        //    Ini jauh lebih efisien untuk pencarian
        $laporansMap = LaporanIbadah::where('mahasiswa_id', $mahasiswa->id)
            ->whereBetween('tanggal_laporan', [$startDate, $endDate])
            ->get()
            ->keyBy(function ($laporan) {
                // Format 'tanggal_laporan' (objek Carbon) menjadi string 'Y-m-d'
                return $laporan->tanggal_laporan->format('Y-m-d');
            });

        // 3. Buat periode untuk 30 hari
        $period = \Carbon\CarbonPeriod::create($startDate, '1 day', $endDate);

        $laporanStatuses = [];

        // 4. Iterasi setiap hari dalam periode
        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');

            // Cek apakah ada laporan di $laporansMap untuk tanggal ini
            $laporan = $laporansMap->get($dateString); // Akan berisi model LaporanIbadah, atau null

            $status = 'Belum Mengisi';
            $total_poin = null;

            if ($laporan) {
                // Jika laporan ada, cek status 'is_haid'
                if ($laporan->is_haid) {
                    $status = 'Haid';
                    $total_poin = 0; // Asumsi poin 0 saat haid
                } else {
                    $status = 'Terkirim';
                    $total_poin = $laporan->total_poin;
                }
            }

            // Tambahkan data ke array
            $laporanStatuses[] = [
                'tanggal' => $dateString,
                'status' => $status,
                'diisi_pada' => $laporan
                    ? (
                        Carbon::parse($laporan->created_at)->diffInDays() < 7
                        ? Carbon::parse($laporan->created_at)->diffForHumans()
                        : Carbon::parse($laporan->created_at)->translatedFormat('l, j F Y, H:i:s')
                    )
                    : null,
                // 'diisi_pada' => $laporan
                //     ? Carbon::parse($laporan->created_at)->translatedFormat('l, j F Y, H:i:s')
                //     : null,
                // 'total_poin' => $total_poin,
            ];
        }

        // 5. Urutkan dari yang terbaru ke terlama (sesuai UI yang umum)
        $laporanStatuses = array_reverse($laporanStatuses);

        // 6. Kirim data baru ke view Inertia
        return inertia('My/Mahasiswa/Ibadah/Index2', [
            'laporanStatuses' => $laporanStatuses,
        ]);
    }

    public function create()
    {
        $mahasiswa = Auth::user()->mahasiswa;
        if (!$mahasiswa) {
            return redirect()->route('my.dashboard.index')->with('error', 'Profil mahasiswa Anda tidak ditemukan.');
        }

        // Fungsi helper untuk mengambil pertanyaan
        $getPertanyaans = function ($kategori) use ($mahasiswa) {
            return Pertanyaan::where('kategori', $kategori)
                ->with(['pilihanJawabans' => function ($query) use ($mahasiswa) {
                    $query->where(function ($q) use ($mahasiswa) {
                        $q->whereNull('khusus_gender')
                            ->orWhere('khusus_gender', $mahasiswa->gender);
                    })->orderBy('urutan', 'asc');
                }])
                ->orderBy('urutan', 'asc')
                ->get();
        };

        // Ambil kedua set pertanyaan
        $pertanyaansUmum = $getPertanyaans('umum');
        $pertanyaansHaid = $getPertanyaans('haid');

        return inertia('My/Mahasiswa/Ibadah/Create', [
            'pertanyaans' => [
                'umum' => $pertanyaansUmum,
                'haid' => $pertanyaansHaid,
            ],
            'mahasiswa' => $mahasiswa,
        ]);
    }

    public function store(Request $request)
    {
        $mahasiswa = Auth::user()->mahasiswa;

        $minDate = Carbon::now()->subDays(7)->format('Y-m-d'); // 7 hari terakhir
        $maxDate = Carbon::now()->format('Y-m-d');

        // 1. Validasi Input
        $validated = $request->validate([
            'tanggal_laporan' => [
                'required',
                'date_format:Y-m-d',
                'after_or_equal:' . $minDate,
                'before_or_equal:' . $maxDate,
                Rule::unique('laporan_ibadahs')->where(function ($query) use ($mahasiswa) {
                    return $query->where('mahasiswa_id', $mahasiswa->id);
                }),
                function ($attribute, $value, $fail) {
                    $now = Carbon::now('Asia/Jakarta');
                    $selected = Carbon::parse($value, 'Asia/Jakarta');

                    // Jika tanggal = hari ini
                    if ($selected->isToday()) {
                        $allowedTime = Carbon::today('Asia/Jakarta')->setTime(19, 20, 0);
                        if ($now->lt($allowedTime)) {
                            $fail('Laporan untuk tanggal hari ini hanya dapat dikirim setelah pukul 19.20 WIB.');
                        }
                    }
                }
            ],
            // 'is_haid' hanya divalidasi jika user adalah 'P'
            'is_haid' => [
                Rule::requiredIf($mahasiswa->gender === 'P'),
                'boolean',
            ],
            'answers' => 'required|array',
            'answers.*.value' => 'required',
            'answers.*.type' => ['required', Rule::in(['pilihan_ganda', 'teks'])],
        ], [
            'tanggal_laporan.unique' => 'Anda sudah mengisi laporan untuk tanggal yang dipilih.',
            'tanggal_laporan.after_or_equal' => 'Anda hanya bisa mengisi laporan untuk 7 hari terakhir.',
            'tanggal_laporan.before_or_equal' => 'Anda tidak bisa mengisi laporan untuk tanggal di masa depan.',
            'is_haid.required' => 'Harap tentukan status haid Anda.',
        ]);

        $tanggalLaporan = $validated['tanggal_laporan'];
        // Tentukan status haid. Default false jika 'L' atau tidak dikirim
        $isHaidStatus = $request->input('is_haid', false);
        $totalPoin = 0;

        try {
            DB::transaction(function () use ($validated, $mahasiswa, $tanggalLaporan, $isHaidStatus, &$totalPoin) {

                // 3. Buat "Induk" Laporan (termasuk status haid)
                $laporanIbadah = LaporanIbadah::create([
                    'mahasiswa_id' => $mahasiswa->id,
                    'tanggal_laporan' => $tanggalLaporan,
                    'is_haid' => $isHaidStatus, // <-- SIMPAN STATUS HAID
                    'total_poin' => 0,
                ]);

                // Tentukan kategori pertanyaan yang relevan
                $relevantKategori = $isHaidStatus ? 'haid' : 'umum';

                // Ambil data dari DB (lebih aman)
                $pertanyaanIds = array_keys($validated['answers']);
                $pilihanIds = collect($validated['answers'])
                    ->where('type', 'pilihan_ganda')
                    ->pluck('value')
                    ->all();

                // Ambil pertanyaan HANYA dari kategori yang relevan
                $pertanyaansDB = Pertanyaan::whereIn('id', $pertanyaanIds)
                    ->where('kategori', $relevantKategori)
                    ->get();

                $pilihanJawabansDB = PilihanJawaban::findMany($pilihanIds);

                foreach ($validated['answers'] as $pertanyaanId => $answer) {
                    // Cek apakah pertanyaan ini valid untuk kategori ini
                    $pertanyaan = $pertanyaansDB->find($pertanyaanId);
                    if (!$pertanyaan) continue; // Lewati jika tidak relevan

                    $dataJawaban = [
                        'laporan_ibadah_id' => $laporanIbadah->id,
                        'pertanyaan_id' => $pertanyaanId,
                        'pilihan_jawaban_id' => null,
                        'jawaban_teks' => null,
                        'poin_didapat' => 0,
                    ];

                    if ($pertanyaan->tipe_pertanyaan === 'pilihan_ganda') {
                        $pilihan = $pilihanJawabansDB->find($answer['value']);
                        if ($pilihan && $pilihan->pertanyaan_id == $pertanyaanId) {
                            $dataJawaban['pilihan_jawaban_id'] = $pilihan->id;
                            $dataJawaban['poin_didapat'] = $pilihan->poin;
                            $totalPoin += $pilihan->poin;
                        }
                    } else if ($pertanyaan->tipe_pertanyaan === 'teks') {
                        $dataJawaban['jawaban_teks'] = $answer['value'];
                    }

                    JawabanLaporan::create($dataJawaban);
                }

                $laporanIbadah->total_poin = $totalPoin;
                $laporanIbadah->save();
            }); // End Transaction

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan laporan. Error: ' . $e->getMessage());
        }

        return redirect()->route('mhs.laporan-ibadah.index')
            ->with('success', 'Laporan ibadah untuk tanggal ' . $tanggalLaporan . ' berhasil disimpan.');
    }
}
