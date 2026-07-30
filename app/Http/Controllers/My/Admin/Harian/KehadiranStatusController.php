<?php

namespace App\Http\Controllers\My\Admin\Harian;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;

class KehadiranStatusController extends Controller
{
    public function index1()
    {
        $mahasiswas = Mahasiswa::when(request()->q, function ($query) {
            $search = request()->q;

            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            })
            ->orWhereHas('kelasHariansKehadiranStatus', function ($q) use ($search) {
                $q->where('nama_kelas', 'like', '%' . $search . '%');
            });
        })
        ->with([
            'user:id,name',
            'kelasHariansKehadiranStatus:id,nama_kelas',
            'absensiHarians:id,mahasiswa_id,kelas_harian_id,status'
        ])
        ->whereHas('absensiHarians', function ($q) {
            $q->whereIn('status', ['sakit', 'alpha', 'izin']);
        })
        ->paginate(10);

        // transform untuk hitung total status
        $mahasiswas->getCollection()->transform(function ($mhs) {
            $mhs->total_sakit = $mhs->absensiHarians->where('status', 'sakit')->count();
            $mhs->total_alpha = $mhs->absensiHarians->where('status', 'alpha')->count();
            $mhs->total_izin  = $mhs->absensiHarians->where('status', 'izin')->count();
            // $mhs->list_kelas = $mhs->kelasHariansKehadiranStatus->pluck('nama_kelas')->implode(', ');
            $rekapKelas = [];
            foreach ($mhs->kelasHariansKehadiranStatus as $kelas) {
                $izin  = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'izin')->count();
                $sakit = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'sakit')->count();
                $alpha = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'alpha')->count();

                $rekapKelas[] = [
                    'nama' => $kelas->nama_kelas,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpha' => $alpha,
                ];
            }

            $mhs->list_kelas = $rekapKelas;

            return $mhs;
        });

        // agar query pencarian tetap terbawa saat pindah halaman
        $mahasiswas->appends(['q' => request()->q]);

        return $mahasiswas;

        return inertia('My/Admin/Harian/Kehadiran/Index', [
            'mahasiswas' => $mahasiswas,
        ]);
    }

    public function index2()
    {
        $angkatanFilter = request()->angkatan; // ambil filter dari request

        $mahasiswas = Mahasiswa::when(request()->q, function ($query) {
            $search = request()->q;

            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            })
            ->orWhereHas('kelasHariansKehadiranStatus', function ($q) use ($search) {
                $q->where('nama_kelas', 'like', '%' . $search . '%');
            });
        })
        ->when($angkatanFilter, function ($query) use ($angkatanFilter) {
            $query->where('kode_tahun', $angkatanFilter);
        })
        ->with([
            'user:id,name',
            'kelasHariansKehadiranStatus:id,nama_kelas',
            'absensiHarians:id,mahasiswa_id,kelas_harian_id,status',
        ])
        ->whereHas('absensiHarians', function ($q) {
            $q->whereIn('status', ['sakit', 'alpha', 'izin']);
        })
        ->paginate(10);

        // transform untuk hitung total status
        $mahasiswas->getCollection()->transform(function ($mhs) {
            $mhs->total_sakit = $mhs->absensiHarians->where('status', 'sakit')->count();
            $mhs->total_alpha = $mhs->absensiHarians->where('status', 'alpha')->count();
            $mhs->total_izin  = $mhs->absensiHarians->where('status', 'izin')->count();

            $rekapKelas = [];
            foreach ($mhs->kelasHariansKehadiranStatus as $kelas) {
                $izin  = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'izin')->count();
                $sakit = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'sakit')->count();
                $alpha = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'alpha')->count();

                $rekapKelas[] = [
                    'nama' => $kelas->nama_kelas,
                    'izin' => $izin,
                    'sakit' => $sakit,
                    'alpha' => $alpha,
                ];
            }

            $mhs->list_kelas = $rekapKelas;
            return $mhs;
        });

        // data angkatan buat filter dropdown
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get(['kode_tahun','nama_angkatan','tahun_angkatan']);

        // biar query tetap kebawa pas pagination
        $mahasiswas->appends(['q' => request()->q, 'angkatan' => $angkatanFilter]);

        return inertia('My/Admin/Harian/Kehadiran/Index', [
            'mahasiswas' => $mahasiswas,
            'angkatans' => $angkatans,
            'selectedAngkatan' => $angkatanFilter,
        ]);
    }

    // public function index3()
    // {
    //     $angkatanFilter = request()->angkatan; 
    //     $sortFilter = request()->sort;

    //     $query = Mahasiswa::query()
    //         ->when(request()->q, function ($query) {
    //             $search = request()->q;
    //             $query->where(function ($q) use ($search) {
    //                 $q->whereHas('user', function ($q) use ($search) {
    //                     $q->where('name', 'like', '%' . $search . '%');
    //                 })
    //                 ->whereHas('absensiHarians', function ($q) {
    //                     $q->whereIn('status', ['sakit', 'alpha', 'izin']);
    //                 });
    //             })
    //             ->orWhere(function ($q) use ($search) {
    //                 $q->whereHas('kelasHariansKehadiranStatus', function ($q) use ($search) {
    //                     $q->where('nama_kelas', 'like', '%' . $search . '%');
    //                 })
    //                 ->whereHas('absensiHarians', function ($q) {
    //                     $q->whereIn('status', ['sakit', 'alpha', 'izin']);
    //                 });
    //             });
    //         }, function ($query) {
    //             // Jika tidak ada pencarian, tetap terapkan filter absensi
    //             $query->whereHas('absensiHarians', function ($q) {
    //                 $q->whereIn('status', ['sakit', 'alpha', 'izin']);
    //             });
    //         })
    //         ->when($angkatanFilter, function ($query) use ($angkatanFilter) {
    //             $query->where('kode_tahun', $angkatanFilter);
    //         })
    //         ->with([
    //             'user:id,name',
    //             'kelasHariansKehadiranStatus:id,nama_kelas',
    //             'absensiHarians:id,mahasiswa_id,kelas_harian_id,status',
    //         ]);

    //     // Apply sorting
    //     if ($sortFilter === 'alpha') {
    //         $query->orderByRaw('(SELECT COUNT(*) FROM absensi_harians WHERE absensi_harians.mahasiswa_id = mahasiswas.id AND absensi_harians.status = "alpha") DESC');
    //     } elseif ($sortFilter === 'izin') {
    //         $query->orderByRaw('(SELECT COUNT(*) FROM absensi_harians WHERE absensi_harians.mahasiswa_id = mahasiswas.id AND absensi_harians.status = "izin") DESC');
    //     } elseif ($sortFilter === 'sakit') {
    //         $query->orderByRaw('(SELECT COUNT(*) FROM absensi_harians WHERE absensi_harians.mahasiswa_id = mahasiswas.id AND absensi_harians.status = "sakit") DESC');
    //     }

    //     // Paginasi
    //     $perPage = 15;
    //     $mahasiswas = $query->paginate($perPage);

    //     // Transformasi data
    //     $mahasiswas->through(function ($mhs) {
    //         $mhs->total_sakit = $mhs->absensiHarians->where('status', 'sakit')->count();
    //         $mhs->total_alpha = $mhs->absensiHarians->where('status', 'alpha')->count();
    //         $mhs->total_izin = $mhs->absensiHarians->where('status', 'izin')->count();

    //         $rekapKelas = [];
    //         foreach ($mhs->kelasHariansKehadiranStatus as $kelas) {
    //             $izin = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'izin')->count();
    //             $sakit = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'sakit')->count();
    //             $alpha = $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'alpha')->count();

    //             $rekapKelas[] = [
    //                 'nama' => $kelas->nama_kelas,
    //                 'izin' => $izin,
    //                 'sakit' => $sakit,
    //                 'alpha' => $alpha,
    //             ];
    //         }

    //         $mhs->list_kelas = $rekapKelas;
    //         return $mhs;
    //     });

    //     $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')
    //         ->get(['kode_tahun', 'nama_angkatan', 'tahun_angkatan']);

    //     return inertia('My/Admin/Harian/Kehadiran/Index3', [
    //         'mahasiswas' => $mahasiswas,
    //         'angkatans' => $angkatans,
    //         'selectedAngkatan' => $angkatanFilter,
    //         'selectedSort' => $sortFilter,
    //     ]);
    // }

    public function index4()
    {
        // Ambil semua request filter
        $filters = request()->only(['angkatan', 'sort', 'semester', 'q']);

        $query = Mahasiswa::query()
            ->whereHas('absensiHarians', function ($q) {
                // Filter utama: hanya mahasiswa yang punya status tidak hadir
                $q->whereIn('status', ['sakit', 'alpha', 'izin']);
            })
            ->when($filters['q'] ?? null, function ($query, $search) {
                // Logika search yang lebih sederhana
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($subq) use ($search) {
                        $subq->where('name', 'like', '%' . $search . '%');
                    })->orWhereHas('kelasHariansKehadiranStatus', function ($subq) use ($search) {
                        $subq->where('nama_kelas', 'like', '%' . $search . '%');
                    });
                });
            })
            ->when($filters['angkatan'] ?? null, function ($query, $angkatan) {
                $query->where('kode_tahun', $angkatan);
            })
            ->when($filters['semester'] ?? null, function ($query, $semester) {
                // Filter berdasarkan semester
                $query->whereHas('kelasHariansKehadiranStatus', function ($q) use ($semester) {
                    $q->where('semester', $semester);
                });
            })
            ->with([
                'user:id,name',
                'angkatan:id,kode_tahun,nama_angkatan',
                // Muat relasi kelas, filter berdasarkan semester jika ada
                'kelasHariansKehadiranStatus' => function ($q) use ($filters) {
                    $q->when($filters['semester'] ?? null, function ($subq, $semester) {
                        $subq->where('semester', $semester);
                    });
                },
                // Muat relasi absensi (ini penting untuk rekap per kelas)
                'absensiHarians' => function ($q) {
                    $q->whereIn('status', ['sakit', 'alpha', 'izin']);
                }
            ])
            // OPTIMASI: Gunakan withCount untuk kalkulasi total
            ->withCount([
                'absensiHarians as total_sakit' => fn ($q) => $q->where('status', 'sakit'),
                'absensiHarians as total_izin' => fn ($q) => $q->where('status', 'izin'),
                'absensiHarians as total_alpha' => fn ($q) => $q->where('status', 'alpha'),
            ]);

        // Terapkan sorting menggunakan kolom virtual dari withCount
        if ($filters['sort'] ?? null) {
            $query->orderBy('total_' . $filters['sort'], 'desc');
        } else {
            $query->latest(); // Default sort
        }

        $mahasiswas = $query->paginate(10)->appends(request()->all());

        // Transformasi sekarang jadi lebih ringan
        $mahasiswas->through(function ($mhs) {
            $rekapKelas = [];
            foreach ($mhs->kelasHariansKehadiranStatus as $kelas) {
                $rekapKelas[] = [
                    'nama' => $kelas->nama_kelas,
                    'izin' => $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'izin')->count(),
                    'sakit' => $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'sakit')->count(),
                    'alpha' => $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'alpha')->count(),
                ];
            }
            $mhs->list_kelas = $rekapKelas;
            unset($mhs->absensiHarians, $mhs->kelasHariansKehadiranStatus); // Hapus relasi besar
            return $mhs;
        });

        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')
            ->get(['kode_tahun', 'nama_angkatan', 'tahun_angkatan']);

        return inertia('My/Admin/Harian/Kehadiran/Index', [
            'mahasiswas' => $mahasiswas,
            'angkatans' => $angkatans,
            'filters' => $filters, // Kirim semua filter yang aktif ke view
        ]);
    }

    public function index()
    {
        // Ambil semua request filter
        $filters = request()->only(['angkatan', 'sort', 'semester', 'q']);

        $query = Mahasiswa::query()
            ->whereHas('absensiHarians', function ($q) {
                // Filter utama: hanya mahasiswa yang punya status tidak hadir
                $q->whereIn('status', ['sakit', 'alpha', 'izin']);
            })
            ->when($filters['q'] ?? null, function ($query, $search) {
                // Logika search
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($subq) use ($search) {
                        $subq->where('name', 'like', '%' . $search . '%');
                    })->orWhereHas('kelasHariansKehadiranStatus', function ($subq) use ($search) {
                        $subq->where('nama_kelas', 'like', '%' . $search . '%');
                    });
                });
            })
            ->when($filters['angkatan'] ?? null, function ($query, $angkatan) {
                $query->where('kode_tahun', $angkatan);
            })
            ->when($filters['semester'] ?? null, function ($query, $semester) {
                // Filter berdasarkan semester
                $query->whereHas('kelasHariansKehadiranStatus', function ($q) use ($semester) {
                    $q->where('semester', $semester);
                });
            })
            ->with([
                'user:id,name',
                'angkatan:id,kode_tahun,nama_angkatan',
                'kelasHariansKehadiranStatus' => function ($q) use ($filters) {
                    $q->when($filters['semester'] ?? null, function ($subq, $semester) {
                        $subq->where('semester', $semester);
                    });
                },
                'absensiHarians' => function ($q) {
                    $q->whereIn('status', ['sakit', 'alpha', 'izin']);
                }
            ])
            // OPTIMASI: Gunakan withCount untuk kalkulasi total
            ->withCount([
                'absensiHarians as total_sakit' => fn ($q) => $q->where('status', 'sakit'),
                'absensiHarians as total_izin' => fn ($q) => $q->where('status', 'izin'),
                'absensiHarians as total_alpha' => fn ($q) => $q->where('status', 'alpha'),
            ]);

        // Terapkan sorting menggunakan kolom virtual dari withCount
        if ($filters['sort'] ?? null) {
            $query->orderBy('total_' . $filters['sort'], 'desc');
        } else {
            $query->latest(); // Default sort
        }

        $mahasiswas = $query->paginate(10)->appends(request()->all());

        // Transformasi data
        $mahasiswas->through(function ($mhs) {
            $rekapKelas = [];
            foreach ($mhs->kelasHariansKehadiranStatus as $kelas) {
                $rekapKelas[] = [
                    'nama' => $kelas->nama_kelas,
                    'izin' => $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'izin')->count(),
                    'sakit' => $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'sakit')->count(),
                    'alpha' => $mhs->absensiHarians->where('kelas_harian_id', $kelas->id)->where('status', 'alpha')->count(),
                ];
            }
            $mhs->list_kelas = $rekapKelas;
            unset($mhs->absensiHarians, $mhs->kelasHariansKehadiranStatus);
            return $mhs;
        });

        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')
            ->get(['kode_tahun', 'nama_angkatan', 'tahun_angkatan']);

        return inertia('My/Admin/Harian/Kehadiran/Index', [
            'mahasiswas' => $mahasiswas,
            'angkatans' => $angkatans,
            'filters' => $filters,
        ]);
    }


}
