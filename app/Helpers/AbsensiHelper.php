<?php

namespace App\Helpers;

use App\Models\Harian\AbsensiHarian;
use Illuminate\Support\Facades\DB;

class AbsensiHelper
{
    public static function rekapAbsensiSemuaKelas($mahasiswa)
    {
        $allValidClasses = $mahasiswa->kelasHarians()
            ->with(['dosen.user'])
            ->orderBy('tahun', 'desc')
            ->orderBy('semester', 'desc')
            ->orderBy('nama_kelas', 'asc')
            ->get();

        $validClassIds = $allValidClasses->pluck('id');

        $attendanceRaw = AbsensiHarian::join('kelas_harians', 'absensi_harians.kelas_harian_id', '=', 'kelas_harians.id')
            ->join('jadwal_harians', 'absensi_harians.jadwal_harian_id', '=', 'jadwal_harians.id')
            ->where('absensi_harians.mahasiswa_id', $mahasiswa->id)
            ->whereIn('absensi_harians.kelas_harian_id', $validClassIds)
            ->select(
                'kelas_harians.nama_kelas',
                'kelas_harians.tahun',
                'kelas_harians.semester',
                DB::raw("SUM(CASE WHEN absensi_harians.status = 'hadir' THEN 1 ELSE 0 END) as total_hadir"),
                DB::raw("SUM(CASE WHEN absensi_harians.status = 'sakit' THEN 1 ELSE 0 END) as total_sakit"),
                DB::raw("SUM(CASE WHEN absensi_harians.status = 'izin' THEN 1 ELSE 0 END) as total_izin"),
                DB::raw("SUM(CASE WHEN absensi_harians.status = 'alpha' THEN 1 ELSE 0 END) as total_alpha"),
                DB::raw("MIN(jadwal_harians.tanggal) as start_date"),
                DB::raw("MAX(jadwal_harians.tanggal) as end_date")
            )
            ->groupBy('kelas_harians.id', 'kelas_harians.nama_kelas', 'kelas_harians.tahun', 'kelas_harians.semester')
            ->orderBy('kelas_harians.tahun', 'desc')
            ->orderBy('kelas_harians.semester', 'desc')
            ->orderBy('kelas_harians.nama_kelas', 'asc')
            ->get();

        // Chart + Table Builder
        $attLabels = [];
        $attSakit = [];
        $attIzin = [];
        $attAlpha = [];
        $attendanceTable = [];

        foreach ($attendanceRaw as $row) {
            $attLabels[] = $row->nama_kelas . ' (' . $row->tahun . '-' . $row->semester . ')';
            $attSakit[] = $row->total_sakit;
            $attIzin[] = $row->total_izin;
            $attAlpha[] = $row->total_alpha;

            $periode = FormatPeriode::formatPeriode($row->start_date, $row->end_date);

            $attendanceTable[] = [
                'kelas' => $row->nama_kelas,
                'tahun' => $row->tahun,
                'semester' => $row->semester,
                'periode' => $periode,
                'hadir' => $row->total_hadir,
                'sakit' => $row->total_sakit,
                'izin' => $row->total_izin,
                'alpha' => $row->total_alpha,
                'total_absen' => $row->total_sakit + $row->total_izin + $row->total_alpha
            ];
        }

        return [
            'history' => $allValidClasses,
            'chart' => [
                'labels' => $attLabels,
                'sakit' => $attSakit,
                'izin' => $attIzin,
                'alpha' => $attAlpha,
            ],
            'table' => $attendanceTable
        ];
    }
}
