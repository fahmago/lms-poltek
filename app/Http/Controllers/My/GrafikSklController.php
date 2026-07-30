<?php

namespace App\Http\Controllers\My;

use App\Http\Controllers\Controller;
use App\Models\Angkatan;
use App\Models\Harian\KategoriKelasHarian;
use App\Models\Harian\KelasHarian;
use App\Models\Pekanan\PengumpulanTugasPekanan;
use App\Models\SKL\PengumpulanBuku;
use App\Models\SKL\PengumpulanPortofolio;
use App\Models\SKL\PengumpulanProjectSemester;
use App\Models\SKL\PengumpulanSertifikat;
use Illuminate\Http\Request;

class GrafikSklController extends Controller
{
    public function index(Request $request)
    {
        $kategoriList = KategoriKelasHarian::where('jenis', 'IT')->orderBy('nama_kategori', 'asc')->get(['id', 'nama_kategori']);
        $angkatans = Angkatan::orderBy('tahun_angkatan', 'desc')->get(['id', 'tahun_angkatan', 'nama_angkatan']);
        
        return inertia('My/Grafik/Skl/Index', [ // Pastikan path Inertia ini benar
            'kategoriList' => $kategoriList,
            'angkatans' => $angkatans,
        ]);
    }

    public function getClasses(Request $request)
    {
        $data = $request->validate([
            'tahun_angkatan' => 'required|exists:angkatans,tahun_angkatan',
            'kategori_id' => 'required|integer|exists:kategori_kelas_harians,id',
            'semester' => 'required|integer|between:1,8',
        ]);

        $classes = KelasHarian::where('tahun', $data['tahun_angkatan'])
            ->where('semester', $data['semester'])
            ->where('kategori_kelas_harian_id', $data['kategori_id'])
            ->with('dosen.user')
            ->orderBy('nama_kelas', 'asc')
            ->get(); 

        $formattedClasses = $classes->map(function($kelas) {
            return [
                'id' => $kelas->id,
                'nama_kelas' => $kelas->nama_kelas,
                'nama_dosen' => $kelas->dosen->user->name ?? 'Dosen N/A',
            ];
        });

        return response()->json($formattedClasses);
    }

    public function getSklData1(Request $request)
    {
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
        ]);

        // 1. Ambil kelas, hitung mahasiswanya, dan ambil ID relasi SKL
        $kelasHarians = KelasHarian::whereIn('id', $validated['kelas_harian_ids'])
            ->with(['dosen.user'])
            ->withCount('kelasHarianMahasiswas') // Total M (Mahasiswa) per kelas
            ->with([ 
                'tugasPekanans:id',
                'projectSemesters:id',
                'portofolios:id',
                'bukus:id',
                'sertifikats:id'
            ])
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $labels = [];
        // Data untuk Chart (Per Kelas)
        $datasets = [
            ['label' => 'Tugas Pekanan', 'data' => [], 'backgroundColor' => 'rgba(255, 99, 132, 0.7)'], // Merah
            ['label' => 'Project Semester', 'data' => [], 'backgroundColor' => 'rgba(54, 162, 235, 0.7)'], // Biru
            ['label' => 'Portofolio', 'data' => [], 'backgroundColor' => 'rgba(255, 206, 86, 0.7)'], // Kuning
            ['label' => 'Buku', 'data' => [], 'backgroundColor' => 'rgba(75, 192, 192, 0.7)'], // Hijau/Teal
            ['label' => 'Sertifikat', 'data' => [], 'backgroundColor' => 'rgba(153, 102, 255, 0.7)'], // Ungu
        ];

        // Data untuk Rekapitulasi (Total Gabungan)
        $totalTargetPekanan = 0;
        $totalAktualPekanan = 0;
        $totalTargetProject = 0;
        $totalAktualProject = 0;
        $totalTargetPortofolio = 0;
        $totalAktualPortofolio = 0;
        $totalTargetBuku = 0;
        $totalAktualBuku = 0;
        $totalTargetSertifikat = 0;
        $totalAktualSertifikat = 0;

        foreach ($kelasHarians as $kelas) {

            // $labels[] = $kelas->nama_kelas; // Label untuk sumbu X

            // $namaDosen = $kelas->dosen->user->name ?? '';
            // $inisialDosen = $this->getInitials($namaDosen);
            // $labels[] = $kelas->nama_kelas . ' (' . $inisialDosen . ')';

            $labels[] = $kelas->nama_kelas . ' (' . str_replace(' ', '', strtoupper(substr($kelas->dosen->user->name ?? 'N/A', 0, 5))) . ')';
            
            $totalMahasiswaDiKelas = $kelas->kelas_harian_mahasiswas_count;
            $mahasiswaIds = $kelas->kelasHarianMahasiswas()->pluck('mahasiswa_id');

            // --- Kalkulasi per Kategori SKL ---

            // A. Tugas Pekanan
            $totalTugasPekanan = $kelas->tugasPekanans->count();
            $targetPekanan = $totalMahasiswaDiKelas * $totalTugasPekanan;
            $aktualPekanan = 0;
            if ($targetPekanan > 0) {
                $aktualPekanan = PengumpulanTugasPekanan::whereIn('tugas_pekanan_id', $kelas->tugasPekanans->pluck('id'))
                                    ->whereIn('mahasiswa_id', $mahasiswaIds)
                                    ->count();
            }
            $datasets[0]['data'][] = $targetPekanan > 0 ? round(($aktualPekanan / $targetPekanan) * 100) : 0;
            $totalTargetPekanan += $targetPekanan;
            $totalAktualPekanan += $aktualPekanan;

            // B. Project Semester
            $totalProject = $kelas->projectSemesters->count();
            $targetProject = $totalMahasiswaDiKelas * $totalProject;
            $aktualProject = 0;
            if ($targetProject > 0) {
                $aktualProject = PengumpulanProjectSemester::whereIn('project_semester_id', $kelas->projectSemesters->pluck('id'))
                                    ->whereIn('mahasiswa_id', $mahasiswaIds)
                                    ->count();
            }
            $datasets[1]['data'][] = $targetProject > 0 ? round(($aktualProject / $targetProject) * 100) : 0;
            $totalTargetProject += $targetProject;
            $totalAktualProject += $aktualProject;

            // C. Portofolio
            $totalPortofolio = $kelas->portofolios->count();
            $targetPortofolio = $totalMahasiswaDiKelas * $totalPortofolio;
            $aktualPortofolio = 0;
            if ($targetPortofolio > 0) {
                $aktualPortofolio = PengumpulanPortofolio::whereIn('portofolio_id', $kelas->portofolios->pluck('id'))
                                    ->whereIn('mahasiswa_id', $mahasiswaIds)
                                    ->count();
            }
            $datasets[2]['data'][] = $targetPortofolio > 0 ? round(($aktualPortofolio / $targetPortofolio) * 100) : 0;
            $totalTargetPortofolio += $targetPortofolio;
            $totalAktualPortofolio += $aktualPortofolio;

            // D. Buku
            $totalBuku = $kelas->bukus->count();
            $targetBuku = $totalMahasiswaDiKelas * $totalBuku;
            $aktualBuku = 0;
            if ($targetBuku > 0) {
                $aktualBuku = PengumpulanBuku::whereIn('buku_id', $kelas->bukus->pluck('id'))
                                    ->whereIn('mahasiswa_id', $mahasiswaIds)
                                    ->count();
            }
            $datasets[3]['data'][] = $targetBuku > 0 ? round(($aktualBuku / $targetBuku) * 100) : 0;
            $totalTargetBuku += $targetBuku;
            $totalAktualBuku += $aktualBuku;

            // E. Sertifikat
            $totalSertifikat = $kelas->sertifikats->count();
            $targetSertifikat = $totalMahasiswaDiKelas * $totalSertifikat;
            $aktualSertifikat = 0;
            if ($targetSertifikat > 0) {
                $aktualSertifikat = PengumpulanSertifikat::whereIn('sertifikat_id', $kelas->sertifikats->pluck('id'))
                                    ->whereIn('mahasiswa_id', $mahasiswaIds)
                                    ->count();
            }
            $datasets[4]['data'][] = $targetSertifikat > 0 ? round(($aktualSertifikat / $targetSertifikat) * 100) : 0;
            $totalTargetSertifikat += $targetSertifikat;
            $totalAktualSertifikat += $aktualSertifikat;
        }
        
        // Siapkan data rekapitulasi total
        $overallData = [
            [
                'label' => 'Tugas Pekanan',
                'percentage' => $totalTargetPekanan > 0 ? round(($totalAktualPekanan / $totalTargetPekanan) * 100) : 0,
                'color' => 'bg-red-500'
            ],
            [
                'label' => 'Project Semester',
                'percentage' => $totalTargetProject > 0 ? round(($totalAktualProject / $totalTargetProject) * 100) : 0,
                'color' => 'bg-blue-500'
            ],
            [
                'label' => 'Portofolio',
                'percentage' => $totalTargetPortofolio > 0 ? round(($totalAktualPortofolio / $totalTargetPortofolio) * 100) : 0,
                'color' => 'bg-yellow-500'
            ],
            [
                'label' => 'Buku',
                'percentage' => $totalTargetBuku > 0 ? round(($totalAktualBuku / $totalTargetBuku) * 100) : 0,
                'color' => 'bg-teal-500'
            ],
            [
                'label' => 'Sertifikat',
                'percentage' => $totalTargetSertifikat > 0 ? round(($totalAktualSertifikat / $totalTargetSertifikat) * 100) : 0,
                'color' => 'bg-purple-500'
            ],
        ];

        return response()->json([
            'chartData' => ['labels' => $labels, 'datasets' => $datasets],
            'overallData' => $overallData, // Kirim data rekapitulasi
        ]);
    }

    public function getSklData2(Request $request)
    {
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
        ]);

        // Ambil data kelas beserta relasi SKL dan Mahasiswa
        $kelasHarians = KelasHarian::whereIn('id', $validated['kelas_harian_ids'])
            ->with(['dosen.user'])
            ->withCount('kelasHarianMahasiswas') 
            ->with(['kelasHarianMahasiswas.mahasiswa.user']) // Load User dari Mahasiswa
            ->with([ 
                'tugasPekanans:id',
                'projectSemesters:id',
                'portofolios:id',
                'bukus:id',
                'sertifikats:id'
            ])
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $labels = [];
        $datasets = [
            ['label' => 'Tugas Pekanan', 'data' => [], 'backgroundColor' => 'rgba(255, 99, 132, 0.7)'], 
            ['label' => 'Project Semester', 'data' => [], 'backgroundColor' => 'rgba(54, 162, 235, 0.7)'], 
            ['label' => 'Portofolio', 'data' => [], 'backgroundColor' => 'rgba(255, 206, 86, 0.7)'], 
            ['label' => 'Buku', 'data' => [], 'backgroundColor' => 'rgba(75, 192, 192, 0.7)'], 
            ['label' => 'Sertifikat', 'data' => [], 'backgroundColor' => 'rgba(153, 102, 255, 0.7)'], 
        ];

        // Variabel untuk Rekapitulasi Global
        $totalTarget = ['pekanan' => 0, 'project' => 0, 'portofolio' => 0, 'buku' => 0, 'sertifikat' => 0];
        $totalAktual = ['pekanan' => 0, 'project' => 0, 'portofolio' => 0, 'buku' => 0, 'sertifikat' => 0];

        // Variabel untuk Detail Mahasiswa
        $studentDetails = [];

        foreach ($kelasHarians as $kelas) {
            // Label Chart
            $labels[] = $kelas->nama_kelas . ' (' . str_replace(' ', '', strtoupper(substr($kelas->dosen->user->name ?? 'N/A', 0, 5))) . ')';
            
            $totalMahasiswa = $kelas->kelas_harian_mahasiswas_count;
            $mahasiswaIds = $kelas->kelasHarianMahasiswas()->pluck('mahasiswa_id');

            // ID Item SKL
            $tugasIds = $kelas->tugasPekanans->pluck('id');
            $projectIds = $kelas->projectSemesters->pluck('id');
            $portofolioIds = $kelas->portofolios->pluck('id');
            $bukuIds = $kelas->bukus->pluck('id');
            $sertifikatIds = $kelas->sertifikats->pluck('id');

            // --- 1. Kalkulasi untuk Grafik (Kelas Level) ---
            
            // Pekanan
            $tPekanan = $totalMahasiswa * $tugasIds->count();
            $aPekanan = $tPekanan > 0 ? PengumpulanTugasPekanan::whereIn('tugas_pekanan_id', $tugasIds)->whereIn('mahasiswa_id', $mahasiswaIds)->count() : 0;
            $datasets[0]['data'][] = $tPekanan > 0 ? round(($aPekanan / $tPekanan) * 100) : 0;
            $totalTarget['pekanan'] += $tPekanan; $totalAktual['pekanan'] += $aPekanan;

            // Project
            $tProject = $totalMahasiswa * $projectIds->count();
            $aProject = $tProject > 0 ? PengumpulanProjectSemester::whereIn('project_semester_id', $projectIds)->whereIn('mahasiswa_id', $mahasiswaIds)->count() : 0;
            $datasets[1]['data'][] = $tProject > 0 ? round(($aProject / $tProject) * 100) : 0;
            $totalTarget['project'] += $tProject; $totalAktual['project'] += $aProject;

            // Portofolio
            $tPortofolio = $totalMahasiswa * $portofolioIds->count();
            $aPortofolio = $tPortofolio > 0 ? PengumpulanPortofolio::whereIn('portofolio_id', $portofolioIds)->whereIn('mahasiswa_id', $mahasiswaIds)->count() : 0;
            $datasets[2]['data'][] = $tPortofolio > 0 ? round(($aPortofolio / $tPortofolio) * 100) : 0;
            $totalTarget['portofolio'] += $tPortofolio; $totalAktual['portofolio'] += $aPortofolio;

            // Buku
            $tBuku = $totalMahasiswa * $bukuIds->count();
            $aBuku = $tBuku > 0 ? PengumpulanBuku::whereIn('buku_id', $bukuIds)->whereIn('mahasiswa_id', $mahasiswaIds)->count() : 0;
            $datasets[3]['data'][] = $tBuku > 0 ? round(($aBuku / $tBuku) * 100) : 0;
            $totalTarget['buku'] += $tBuku; $totalAktual['buku'] += $aBuku;

            // Sertifikat
            $tSertifikat = $totalMahasiswa * $sertifikatIds->count();
            $aSertifikat = $tSertifikat > 0 ? PengumpulanSertifikat::whereIn('sertifikat_id', $sertifikatIds)->whereIn('mahasiswa_id', $mahasiswaIds)->count() : 0;
            $datasets[4]['data'][] = $tSertifikat > 0 ? round(($aSertifikat / $tSertifikat) * 100) : 0;
            $totalTarget['sertifikat'] += $tSertifikat; $totalAktual['sertifikat'] += $aSertifikat;


            // --- 2. Kalkulasi Detail Per Mahasiswa ---
            
            // Target unit per siswa di kelas ini
            $targetUnit = [
                'pekanan' => $tugasIds->count(),
                'project' => $projectIds->count(),
                'portofolio' => $portofolioIds->count(),
                'buku' => $bukuIds->count(),
                'sertifikat' => $sertifikatIds->count(),
            ];

            foreach ($kelas->kelasHarianMahasiswas as $km) {
                $mhs = $km->mahasiswa;
                if (!$mhs) continue; // Skip jika data mahasiswa corrupt

                $mhsId = $mhs->id;

                // Hitung aktual per mahasiswa
                $actPekanan = $targetUnit['pekanan'] > 0 ? PengumpulanTugasPekanan::whereIn('tugas_pekanan_id', $tugasIds)->where('mahasiswa_id', $mhsId)->count() : 0;
                $actProject = $targetUnit['project'] > 0 ? PengumpulanProjectSemester::whereIn('project_semester_id', $projectIds)->where('mahasiswa_id', $mhsId)->count() : 0;
                $actPortofolio = $targetUnit['portofolio'] > 0 ? PengumpulanPortofolio::whereIn('portofolio_id', $portofolioIds)->where('mahasiswa_id', $mhsId)->count() : 0;
                $actBuku = $targetUnit['buku'] > 0 ? PengumpulanBuku::whereIn('buku_id', $bukuIds)->where('mahasiswa_id', $mhsId)->count() : 0;
                $actSertifikat = $targetUnit['sertifikat'] > 0 ? PengumpulanSertifikat::whereIn('sertifikat_id', $sertifikatIds)->where('mahasiswa_id', $mhsId)->count() : 0;

                // Cek status "Belum Tuntas"
                $isIncomplete = ($actPekanan < $targetUnit['pekanan']) || 
                                ($actProject < $targetUnit['project']) || 
                                ($actPortofolio < $targetUnit['portofolio']) || 
                                ($actBuku < $targetUnit['buku']) || 
                                ($actSertifikat < $targetUnit['sertifikat']);

                $studentDetails[] = [
                    'nim' => $mhs->nim ?? '-',
                    'name' => $mhs->user->name ?? 'No Name',
                    'nama_kelas' => $kelas->nama_kelas,
                    'nama_dosen' => $kelas->dosen->user->name ?? '-',
                    'is_incomplete' => $isIncomplete,
                    'scores' => [
                        'pekanan' => ['actual' => $actPekanan, 'target' => $targetUnit['pekanan']],
                        'project' => ['actual' => $actProject, 'target' => $targetUnit['project']],
                        'portofolio' => ['actual' => $actPortofolio, 'target' => $targetUnit['portofolio']],
                        'buku' => ['actual' => $actBuku, 'target' => $targetUnit['buku']],
                        'sertifikat' => ['actual' => $actSertifikat, 'target' => $targetUnit['sertifikat']],
                    ]
                ];
            }
        }
        
        // Data Rekapitulasi Global (Widget di atas Chart)
        $overallData = [
            ['label' => 'Tugas Pekanan', 'percentage' => $totalTarget['pekanan'] > 0 ? round(($totalAktual['pekanan'] / $totalTarget['pekanan']) * 100) : 0, 'color' => 'bg-red-500'],
            ['label' => 'Project Semester', 'percentage' => $totalTarget['project'] > 0 ? round(($totalAktual['project'] / $totalTarget['project']) * 100) : 0, 'color' => 'bg-blue-500'],
            ['label' => 'Portofolio', 'percentage' => $totalTarget['portofolio'] > 0 ? round(($totalAktual['portofolio'] / $totalTarget['portofolio']) * 100) : 0, 'color' => 'bg-yellow-500'],
            ['label' => 'Buku', 'percentage' => $totalTarget['buku'] > 0 ? round(($totalAktual['buku'] / $totalTarget['buku']) * 100) : 0, 'color' => 'bg-teal-500'],
            ['label' => 'Sertifikat', 'percentage' => $totalTarget['sertifikat'] > 0 ? round(($totalAktual['sertifikat'] / $totalTarget['sertifikat']) * 100) : 0, 'color' => 'bg-purple-500'],
        ];

        // Sortir siswa: Yang belum tuntas di paling atas
        usort($studentDetails, function ($a, $b) {
            return $b['is_incomplete'] <=> $a['is_incomplete'];
        });

        return response()->json([
            'chartData' => ['labels' => $labels, 'datasets' => $datasets],
            'overallData' => $overallData,
            'studentDetails' => $studentDetails, // <--- Data Tabel Baru
        ]);
    }

    private function calculateSklData($kelasHarianIds)
    {
        $kelasHarians = KelasHarian::whereIn('id', $kelasHarianIds)
            ->with(['dosen.user'])
            ->withCount('kelasHarianMahasiswas')
            ->with(['kelasHarianMahasiswas.mahasiswa.user'])
            ->with([ 
                'tugasPekanans:id', 'projectSemesters:id', 'portofolios:id', 'bukus:id', 'sertifikats:id'
            ])
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $labels = [];
        $datasets = [
            ['label' => 'Tugas Pekanan', 'data' => [], 'backgroundColor' => 'rgba(255, 99, 132, 0.7)'], 
            ['label' => 'Project Semester', 'data' => [], 'backgroundColor' => 'rgba(54, 162, 235, 0.7)'], 
            ['label' => 'Portofolio', 'data' => [], 'backgroundColor' => 'rgba(255, 206, 86, 0.7)'], 
            ['label' => 'Buku', 'data' => [], 'backgroundColor' => 'rgba(75, 192, 192, 0.7)'], 
            ['label' => 'Sertifikat', 'data' => [], 'backgroundColor' => 'rgba(153, 102, 255, 0.7)'], 
        ];

        $totalTarget = ['pekanan' => 0, 'project' => 0, 'portofolio' => 0, 'buku' => 0, 'sertifikat' => 0];
        $totalAktual = ['pekanan' => 0, 'project' => 0, 'portofolio' => 0, 'buku' => 0, 'sertifikat' => 0];
        $studentDetails = [];

        foreach ($kelasHarians as $kelas) {
            $labels[] = $kelas->nama_kelas . ' (' . str_replace(' ', '', strtoupper(substr($kelas->dosen->user->name ?? 'N/A', 0, 5))) . ')';
            
            $totalMahasiswa = $kelas->kelas_harian_mahasiswas_count;
            $mahasiswaIds = $kelas->kelasHarianMahasiswas()->pluck('mahasiswa_id');

            $tugasIds = $kelas->tugasPekanans->pluck('id');
            $projectIds = $kelas->projectSemesters->pluck('id');
            $portofolioIds = $kelas->portofolios->pluck('id');
            $bukuIds = $kelas->bukus->pluck('id');
            $sertifikatIds = $kelas->sertifikats->pluck('id');

            // --- Kalkulasi Chart (Ringkas) ---
            $unitData = [
                ['ids' => $tugasIds, 'key' => 'pekanan', 'model' => PengumpulanTugasPekanan::class, 'col' => 'tugas_pekanan_id'],
                ['ids' => $projectIds, 'key' => 'project', 'model' => PengumpulanProjectSemester::class, 'col' => 'project_semester_id'],
                ['ids' => $portofolioIds, 'key' => 'portofolio', 'model' => PengumpulanPortofolio::class, 'col' => 'portofolio_id'],
                ['ids' => $bukuIds, 'key' => 'buku', 'model' => PengumpulanBuku::class, 'col' => 'buku_id'],
                ['ids' => $sertifikatIds, 'key' => 'sertifikat', 'model' => PengumpulanSertifikat::class, 'col' => 'sertifikat_id'],
            ];

            foreach ($unitData as $idx => $u) {
                $target = $totalMahasiswa * $u['ids']->count();
                $aktual = $target > 0 ? $u['model']::whereIn($u['col'], $u['ids'])->whereIn('mahasiswa_id', $mahasiswaIds)->count() : 0;
                
                $datasets[$idx]['data'][] = $target > 0 ? round(($aktual / $target) * 100) : 0;
                $totalTarget[$u['key']] += $target;
                $totalAktual[$u['key']] += $aktual;
            }

            // --- Kalkulasi Detail Mahasiswa ---
            $targetUnit = [
                'pekanan' => $tugasIds->count(), 'project' => $projectIds->count(),
                'portofolio' => $portofolioIds->count(), 'buku' => $bukuIds->count(), 'sertifikat' => $sertifikatIds->count(),
            ];

            foreach ($kelas->kelasHarianMahasiswas as $km) {
                $mhs = $km->mahasiswa;
                if (!$mhs) continue;

                $mhsId = $mhs->id;
                $scores = [];
                $isIncomplete = false;

                foreach ($unitData as $u) {
                    $tgt = $targetUnit[$u['key']];
                    $act = $tgt > 0 ? $u['model']::whereIn($u['col'], $u['ids'])->where('mahasiswa_id', $mhsId)->count() : 0;
                    
                    $scores[$u['key']] = ['actual' => $act, 'target' => $tgt];
                    if ($act < $tgt) $isIncomplete = true;
                }

                $studentDetails[] = [
                    'mhs_uuid' => $mhs->uuid,
                    'kelas_harian_uuid' => $kelas->uuid,
                    'nim' => $mhs->nim ?? '-',
                    'name' => $mhs->user->name ?? 'No Name',
                    'nama_kelas' => $kelas->nama_kelas,
                    'nama_dosen' => $kelas->dosen->user->name ?? '-',
                    'is_incomplete' => $isIncomplete,
                    'scores' => $scores
                ];
            }
        }

        $overallData = [
            ['label' => 'Tugas Pekanan', 'percentage' => $totalTarget['pekanan'] > 0 ? round(($totalAktual['pekanan'] / $totalTarget['pekanan']) * 100) : 0, 'color' => 'bg-red-500'],
            ['label' => 'Project Semester', 'percentage' => $totalTarget['project'] > 0 ? round(($totalAktual['project'] / $totalTarget['project']) * 100) : 0, 'color' => 'bg-blue-500'],
            ['label' => 'Portofolio', 'percentage' => $totalTarget['portofolio'] > 0 ? round(($totalAktual['portofolio'] / $totalTarget['portofolio']) * 100) : 0, 'color' => 'bg-yellow-500'],
            ['label' => 'Buku', 'percentage' => $totalTarget['buku'] > 0 ? round(($totalAktual['buku'] / $totalTarget['buku']) * 100) : 0, 'color' => 'bg-teal-500'],
            ['label' => 'Sertifikat', 'percentage' => $totalTarget['sertifikat'] > 0 ? round(($totalAktual['sertifikat'] / $totalTarget['sertifikat']) * 100) : 0, 'color' => 'bg-purple-500'],
        ];

        // Sortir
        usort($studentDetails, function ($a, $b) {
            // return $b['is_incomplete'] <=> $a['is_incomplete'];
            
            // 1. Cek Status Kelengkapan (Prioritas Utama)
            // Yang 'is_incomplete' = true (belum tuntas) akan naik ke atas
            if ($a['is_incomplete'] !== $b['is_incomplete']) {
                return $b['is_incomplete'] <=> $a['is_incomplete'];
            }

            // 2. Jika statusnya sama (sama-sama Belum atau sama-sama Sudah),
            // Urutkan berdasarkan NAMA secara Ascending (A-Z)
            // strcasecmp = string case-insensitive comparison (huruf besar/kecil dianggap sama)
            return strcasecmp($a['name'], $b['name']);

            // ==============================================================//
            // 1. Cek Nama Kelas dulu
            // $classComparison = strcasecmp($a['nama_kelas'], $b['nama_kelas']);
            // if ($classComparison !== 0) {
            //     return $classComparison;
            // }

            // // 2. Jika Nama Kelas SAMA, Cek Nama Dosen
            // // Ini akan memisahkan TRPL-A (Dosen A) dengan TRPL-A (Dosen B)
            // $dosenComparison = strcasecmp($a['nama_dosen'], $b['nama_dosen']);
            // if ($dosenComparison !== 0) {
            //     return $dosenComparison;
            // }

            // // 3. Jika Kelas & Dosen SAMA, baru urutkan Nama Mahasiswa
            // return strcasecmp($a['name'], $b['name']);
        });

        return [
            'chartData' => ['labels' => $labels, 'datasets' => $datasets],
            'overallData' => $overallData,
            'studentDetails' => $studentDetails,
        ];
    }

    // 2. Method getSklData (Diperpendek karena pakai fungsi private)
    public function getSklData(Request $request)
    {
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
        ]);

        $result = $this->calculateSklData($validated['kelas_harian_ids']);

        return response()->json($result);
    }

    public function printSklData1(Request $request)
    {
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
            'judul_laporan' => 'nullable|string',
            'only_incomplete' => 'nullable|boolean', // Validasi input baru
        ]);

        // Ambil semua data dulu
        $result = $this->calculateSklData($validated['kelas_harian_ids']);
        $studentDetails = $result['studentDetails'];

        // LOGIC FILTERING DI SINI
        // Jika user minta 'hanya yang belum tuntas'
        if ($request->has('only_incomplete') && $request->only_incomplete == 1) {
            $studentDetails = array_filter($studentDetails, function ($mhs) {
                return $mhs['is_incomplete'] === true; // Ambil yang flag-nya true saja
            });
        }

        return view('prints.skl.print', [
            'data' => $studentDetails,
            'rekap' => $result['overallData'],
            'judul' => $request->judul_laporan ?? 'Laporan Capaian SKL',
            'tanggal' => now()->format('d F Y'),
        ]);
    }

    public function printSklData(Request $request)
    {
        $validated = $request->validate([
            'kelas_harian_ids' => 'required|array|min:1',
            'kelas_harian_ids.*' => 'exists:kelas_harians,id',
            'judul_laporan' => 'nullable|string',
            'filter_status' => 'nullable|string', // Parameter Baru
        ]);

        $result = $this->calculateSklData($validated['kelas_harian_ids']);
        $studentDetails = $result['studentDetails'];

        // --- LOGIKA FILTERING BACKEND ---
        if ($request->has('filter_status') && $request->filter_status !== 'all') {
            
            $status = $request->filter_status;

            $studentDetails = array_filter($studentDetails, function ($mhs) use ($status) {
                // Konversi scores ke array biasa
                $scores = array_values($mhs['scores']); 

                switch ($status) {
                    case 'not_started':
                        // Lolos jika SEMUA 'actual' adalah 0
                        foreach ($scores as $s) {
                            if ($s['actual'] > 0) {
                                return false; // Ada nilai > 0, berarti GAGAL masuk kategori ini
                            }
                        }
                        return true; // Lolos, semua 0
                    
                    case 'has_zero':
                         // Lolos jika ada minimal SATU score yang target>0 dan actual==0
                        foreach ($scores as $s) {
                            if ($s['target'] > 0 && $s['actual'] == 0) return true;
                        }
                        return false;

                    case 'in_progress':
                        // Syarat 1: Harus berstatus Belum Tuntas
                        if ($mhs['is_incomplete'] === false) return false;

                        // Syarat 2: Harus ada minimal SATU nilai > 0
                        $hasProgress = false;
                        foreach ($scores as $s) {
                            if ($s['actual'] > 0) {
                                $hasProgress = true;
                                break;
                            }
                        }
                        return $hasProgress; // Lolos jika Belum Tuntas DAN Punya Progress

                    case 'completed':
                        // Lolos jika sudah tuntas semua
                        return $mhs['is_incomplete'] === false;

                    default:
                        return true;
                }
            });
        }

        return view('prints.skl.print', [
            'data' => $studentDetails,
            'rekap' => $result['overallData'],
            'judul' => $request->judul_laporan ?? 'Laporan Capaian SKL',
            'tanggal' => now()->format('d F Y'),
        ]);
    }
}
