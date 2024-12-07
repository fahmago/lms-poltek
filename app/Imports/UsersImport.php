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

class UsersImport implements ToModel, WithHeadingRow
{
    use Importable;

    // php artisan make:import UsersImport --model=User
    public function model(array $row)
    {
        // Log::info('Impor Data:', $row);

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
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password']),
        ]);

        $user->assignRole($roles);

        return $user;
    }

    /**
     * Mendapatkan role yang valid dari kolom roles
     */
    protected function getValidRoles($roles)
    {
        $roleNames = explode(',', $roles);
        return Role::whereIn('name', $roleNames)->pluck('name')->toArray();
    }
}
