<?php

namespace App\Imports;

use App\Models\Matkul;
use App\Models\Prodi;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class MataKuliahImport implements ToModel, WithHeadingRow
{
    use Importable;

    public function model(array $row)
    {
        try {
            // Validasi kolom wajib
            if (empty($row['kode_prodi']) || empty($row['kode_matkul']) || empty($row['nama_matkul']) || empty($row['sks']) || empty($row['semester']) || empty($row['rps'])) {
                // Log::warning('Data tidak lengkap:', $row);
                return null;
            }

            // Normalisasi tipe data
            $kodeProdi = is_numeric($row['kode_prodi']) ? (int)$row['kode_prodi'] : trim($row['kode_prodi']);
            $sks = is_numeric($row['sks']) ? (int)$row['sks'] : trim($row['sks']);
            $semester = is_numeric($row['semester']) ? (int)$row['semester'] : trim($row['semester']);

            // Validasi kode_prodi harus ada di tabel prodis
            $prodiExists = Prodi::where('kode_prodi', $kodeProdi)->exists();
            if (!$prodiExists) {
                // Log::warning('Kode Prodi tidak ditemukan:', ['kode_prodi' => $kodeProdi]);
                return null;
            }

            // Cek apakah kode_matkul sudah ada
            $existingMatkul = Matkul::where('kode_matkul', $row['kode_matkul'])->first();
            if ($existingMatkul) {
                // Log::info('Mata kuliah sudah ada:', ['kode_matkul' => $row['kode_matkul']]);
                return null;
            }

            // Simpan data
            return new Matkul([
                'kode_prodi'  => $kodeProdi,
                'kode_matkul' => trim($row['kode_matkul']),
                // 'nama_matkul' => trim($row['nama_matkul']),
                'nama_matkul' => ucwords(strtolower(trim($row['nama_matkul']))),
                'sks'         => $sks,
                'semester'    => $semester,
                'rps'         => trim($row['rps']),
            ]);
        } catch (\Exception $e) {
            // Log::error('Error saat mengimpor data:', [
            //     'row' => $row,
            //     'error' => $e->getMessage(),
            // ]);
            return null;
        }
    }

}
