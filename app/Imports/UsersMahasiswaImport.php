<?php

namespace App\Imports;

use App\Models\Angkatan;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Spatie\Permission\Models\Role;

class UsersMahasiswaImport implements ToModel, WithHeadingRow
{
    use Importable;
    
    public function model(array $row)
    {
        // Log::info('Impor Data:', $row);

        $kodeTahun = trim($row['kode_tahun']);
        $kodeProdi = trim($row['kode_prodi']);

        if (is_numeric($kodeTahun)) {
            $kodeTahun = (int)$kodeTahun;
        }

        if (is_numeric($kodeProdi)) {
            $kodeProdi = (int)$kodeProdi;
        }

        $existingUser = User::where('email', $row['email'])->first();
        if ($existingUser) {
            // Log::info('Pengguna sudah ada, lewati email: ' . $row['email']);
            return null;
        }

        $roles = $this->getValidRoles($row['roles']);
        if (empty($roles)) {
            // Log::error('Role tidak valid atau tidak ditemukan untuk email: ' . $row['email']);
            return null; 
        }

        $user = User::create([
            'name' => ucwords(strtolower($row['name'])),
            'email' => $row['email'],
            'password' => Hash::make($row['password']),
        ]);

        $user->assignRole($roles);

        // Log::info('User Berhasil Dibuat:', [
        //     'id' => $user->id,
        //     'name' => $user->name,
        //     'email' => $user->email,
        // ]);

        $angkatan = Angkatan::where('kode_tahun', $kodeTahun)->first();
        $prodi = Prodi::where('kode_prodi', $kodeProdi)->first();

        if (!$angkatan) {
            // Log::error('Angkatan tidak ditemukan', ['kode_tahun' => $kodeTahun]);
            return null;
        }

        if (!$prodi) {
            // Log::error('Prodi tidak ditemukan', ['kode_prodi' => $kodeProdi]);
            return null;
        }

        $mahasiswa = Mahasiswa::create([
            'user_id' => $user->id,          
            'kode_tahun' => $angkatan->kode_tahun,
            'kode_prodi' => $prodi->kode_prodi, 
        ]);

        // Log::info('Mahasiswa berhasil dibuat:', [
        //     'mahasiswa_id' => $mahasiswa->id,
        //     'user_id' => $mahasiswa->user_id,
        //     'kode_tahun' => $mahasiswa->kode_tahun,
        //     'kode_prodi' => $mahasiswa->kode_prodi,
        // ]);

        return $mahasiswa;
    }

    protected function getValidRoles($roles)
    {
        $roleNames = explode(',', $roles);
        return Role::whereIn('name', $roleNames)->pluck('name')->toArray();
    }
}
