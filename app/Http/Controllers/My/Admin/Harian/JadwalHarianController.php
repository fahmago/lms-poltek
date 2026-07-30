<?php

namespace App\Http\Controllers\My\Admin\Harian;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\JadwalHarian;
use App\Models\Harian\KategoriKelasHarian;
use App\Models\Harian\KelasHarian;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Guid\Guid;
use Illuminate\Support\Str;

class JadwalHarianController extends Controller
{
    public function index()
    {
        $jadwalHarians = JadwalHarian::when(request()->q, function ($jadwalHarians) {
            $search = request()->q;
            $jadwalHarians = $jadwalHarians->where(function ($query) use ($search) {
                $query->where('tahun', 'like', '%' . $search . '%')
                    ->orWhere('tanggal', 'like', '%' . $search . '%')
                    ->orWhereHas('kelasHarian', function ($q) use ($search) {
                        $q->where('nama_kelas', 'like', '%' . $search . '%');
                    });
            });
        })->with(['kelasHarian'])->paginate(10);

        $jadwalHarians->getCollection()->transform(function ($jadwal) {
            $jadwal->jam_selesai = $jadwal->kelasHarian->jamSelesai();
            $jadwal->tanggal = $jadwal->getFormattedTanggalAttribute();
            return $jadwal;
        });

        $jadwalHarians->appends(['q' => request()->q]);

        return inertia('My/Admin/Harian/JadwalHarian/Index', [
            'jadwals' => $jadwalHarians,
        ]);
    }

    public function create()
    {
        $angkatans = Angkatan::select('kode_tahun', 'nama_angkatan')->orderBy('tahun_angkatan', 'desc')->get();
        $kategoriList = KategoriKelasHarian::select('uuid', 'nama_kategori')->get();

        return inertia('My/Admin/Harian/JadwalHarian/Create3', [
            'angkatans' => $angkatans,
            'kategoriList' => $kategoriList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'semester' => 'required|integer|min:1|max:8',
            'bulan' => 'required|integer|min:1|max:12',
            'kategori' => 'nullable|exists:kategori_kelas_harians,uuid',
            'ranges_libur' => 'nullable|string', // JSON string dari frontend
        ]);

        $tahun = $request->tahun;
        $semester = $request->semester;
        $bulan = $request->bulan;
        $kategoriUuid = $request->kategori;

        // 1. Ambil data kelas harian (Filter tetap sama)
        $kelasHarianQuery = KelasHarian::where('tahun', $tahun)
            ->where('semester', $semester);

        if ($kategoriUuid) {
            $kelasHarianQuery->whereHas('kategoriKelasHarian', function ($q) use ($kategoriUuid) {
                $q->where('uuid', $kategoriUuid);
            });
        }

        $kelasHarianList = $kelasHarianQuery->get();

        if ($kelasHarianList->isEmpty()) {
            return back()->with('error', 'Tidak ada kelas harian yang ditemukan.');
        }

        // 2. Decode Ranges Libur
        $rangesLibur = json_decode($request->ranges_libur, true) ?? [];

        // 3. Buat daftar tanggal yang akan di-generate
        $startOfMonth = Carbon::create($tahun, $bulan, 1);
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $tanggalRange = [];

        for ($date = $startOfMonth->copy(); $date->lte($endOfMonth); $date->addDay()) {
            $currentDate = $date->format('Y-m-d');

            // Cek apakah hari kerja (Senin-Jumat)
            if ($date->isWeekday()) {
                $isLibur = false;

                // Cek apakah tanggal ini masuk dalam salah satu range libur
                foreach ($rangesLibur as $range) {
                    if ($currentDate >= $range['start'] && $currentDate <= $range['end']) {
                        $isLibur = true;
                        break;
                    }
                }

                if (!$isLibur) {
                    $tanggalRange[] = $currentDate;
                }
            }
        }

        // 4. Proses Simpan ke Database
        DB::transaction(function () use ($kelasHarianList, $tanggalRange, $tahun, $rangesLibur) {
            // OPSIONAL: Hapus jadwal yang sudah ada jika ternyata masuk dalam range libur baru
            foreach ($kelasHarianList as $kelasHarian) {
                foreach ($rangesLibur as $range) {
                    JadwalHarian::where('kelas_harian_id', $kelasHarian->id)
                        ->whereBetween('tanggal', [$range['start'], $range['end']])
                        ->delete();
                }
            }
            $insertData = [];

            foreach ($kelasHarianList as $kelasHarian) {
                foreach ($tanggalRange as $tanggal) {
                    // Cek duplikasi agar tidak double insert
                    $exists = JadwalHarian::where('kelas_harian_id', $kelasHarian->id)
                        ->where('tanggal', $tanggal)
                        ->exists();

                    if (!$exists) {
                        do {
                            $uuid = (string) Guid::uuid4();
                        } while (JadwalHarian::where('uuid', $uuid)->exists());

                        do {
                            $kodeUnik = Str::random(6);
                        } while (JadwalHarian::where('kode_unik', $kodeUnik)->exists());
                        $insertData[] = [
                            'kelas_harian_id'   => $kelasHarian->id,
                            'kode_kelas_harian' => $kelasHarian->kode_kelas_harian,
                            'uuid'              => $uuid,
                            'kode_unik'         => $kodeUnik,
                            'tanggal'           => $tanggal,
                            'tahun'             => $tahun,
                            'waktu_isi_absen'   => 10,
                            'created_at'        => now(),
                            'updated_at'        => now(),
                        ];
                    }

                    // Chunking insert jika data terlalu besar (opsional)
                    if (count($insertData) >= 500) {
                        JadwalHarian::insert($insertData);
                        $insertData = [];
                    }
                }
            }

            if (!empty($insertData)) {
                JadwalHarian::insert($insertData);
            }
        });

        return redirect()->route('my.dh.jadwal.index')
            ->with('success', 'Jadwal berhasil digenerate dengan mengecualikan tanggal libur.');
    }

    public function store2(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'semester' => 'required|integer|min:1|max:8',
            'bulan' => 'required|integer|min:1|max:12',
            'kategori' => 'nullable|exists:kategori_kelas_harians,uuid',
        ]);

        $tahun = $request->tahun;
        $semester = $request->semester;
        $bulan = $request->bulan;
        $kategoriUuid = $request->kategori;

        // Ambil data kelas harian berdasarkan filter
        $kelasHarianQuery = KelasHarian::where('tahun', $tahun)
            ->where('semester', $semester);

        if ($kategoriUuid) {
            $kelasHarianQuery->whereHas('kategoriKelasHarian', function ($q) use ($kategoriUuid) {
                $q->where('uuid', $kategoriUuid);
            });
        }

        $kelasHarianList = $kelasHarianQuery->get();

        if ($kelasHarianList->isEmpty()) {
            return back()->with('error', 'Tidak ada kelas harian yang ditemukan dengan filter tersebut.');
        }

        // Buat tanggal weekdays
        $startOfMonth = Carbon::create($tahun, $bulan, 1);
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        $tanggalRange = [];

        for ($date = $startOfMonth; $date->lte($endOfMonth); $date->addDay()) {
            if ($date->isWeekday()) {
                $tanggalRange[] = $date->format('Y-m-d');
            }
        }

        DB::transaction(function () use ($kelasHarianList, $tanggalRange, $tahun) {
            $insertData = [];

            foreach ($kelasHarianList as $kelasHarian) {
                foreach ($tanggalRange as $tanggal) {
                    if (!JadwalHarian::where('kelas_harian_id', $kelasHarian->id)
                        ->where('tanggal', $tanggal)
                        ->exists()) {
                        do {
                            $uuid = (string) Guid::uuid4();
                        } while (JadwalHarian::where('uuid', $uuid)->exists());

                        do {
                            $kodeUnik = Str::random(6);
                        } while (JadwalHarian::where('kode_unik', $kodeUnik)->exists());
                        $insertData[] = [
                            'kelas_harian_id' => $kelasHarian->id,
                            'kode_kelas_harian' => $kelasHarian->kode_kelas_harian,
                            'uuid' => $uuid,
                            'kode_unik' => $kodeUnik,
                            'tanggal' => $tanggal,
                            'tahun' => $tahun,
                            'waktu_isi_absen' => 10,
                        ];
                    }
                }
            }

            if (!empty($insertData)) {
                JadwalHarian::insert($insertData);
            }
        });

        return redirect()->route('my.dh.jadwal.index')
            ->with('success', 'Jadwal berhasil dibuat untuk semua kelas harian yang cocok.');
    }

    public function repairUuidAndKodeUnik()
    {
        $count = 0;

        DB::transaction(function () use (&$count) {
            $jadwals = JadwalHarian::whereNull('uuid')
                ->orWhereNull('kode_unik')
                ->get();

            foreach ($jadwals as $jadwal) {
                $updatedData = [];

                if (empty($jadwal->uuid)) {
                    do {
                        $newUuid = (string) Guid::uuid4();
                    } while (JadwalHarian::where('uuid', $newUuid)->exists());

                    $updatedData['uuid'] = $newUuid;
                }

                if (empty($jadwal->kode_unik)) {
                    do {
                        $newKode = Str::random(6);
                    } while (JadwalHarian::where('kode_unik', $newKode)->exists());

                    $updatedData['kode_unik'] = $newKode;
                }

                if (!empty($updatedData)) {
                    $jadwal->update($updatedData);
                    $count++;
                }
            }
        });

        return redirect()->back()->with('success', "{$count} data jadwal berhasil diperbarui UUID dan kode uniknya.");
    }
}
