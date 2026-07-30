<?php

namespace App\Helpers;

use App\Models\Pekanan\PengumpulanTugasPekanan;
use App\Models\SKL\PengumpulanBuku;
use App\Models\SKL\PengumpulanPortofolio;
use App\Models\SKL\PengumpulanProjectSemester;
use App\Models\SKL\PengumpulanSertifikat;

class SklHelper
{
    public static function hitungSklMahasiswa($kelas, $mahasiswaId)
    {
        // ID setiap kategori
        $tugasIds = $kelas->tugasPekanans->pluck('id');
        $projectIds = $kelas->projectSemesters->pluck('id');
        $portofolioIds = $kelas->portofolios->pluck('id');
        $bukuIds = $kelas->bukus->pluck('id');
        $sertifikatIds = $kelas->sertifikats->pluck('id');

        // Nama kategori
        $categories = [
            'Tugas Pekanan',
            'Project Semester',
            'Portofolio',
            'Buku / Cv',
            'Sertifikat'
        ];

        // Target
        $targets = [
            $tugasIds->count(),
            $projectIds->count(),
            $portofolioIds->count(),
            $bukuIds->count(),
            $sertifikatIds->count(),
        ];

        // Actual
        $actuals = [
            PengumpulanTugasPekanan::whereIn('tugas_pekanan_id', $tugasIds)->where('mahasiswa_id', $mahasiswaId)->count(),
            PengumpulanProjectSemester::whereIn('project_semester_id', $projectIds)->where('mahasiswa_id', $mahasiswaId)->count(),
            PengumpulanPortofolio::whereIn('portofolio_id', $portofolioIds)->where('mahasiswa_id', $mahasiswaId)->count(),
            PengumpulanBuku::whereIn('buku_id', $bukuIds)->where('mahasiswa_id', $mahasiswaId)->count(),
            PengumpulanSertifikat::whereIn('sertifikat_id', $sertifikatIds)->where('mahasiswa_id', $mahasiswaId)->count(),
        ];

        return [
            'categories' => $categories,
            'targets' => $targets,
            'actuals' => $actuals,
        ];
    }
}
