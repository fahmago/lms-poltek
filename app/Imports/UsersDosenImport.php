<?php

namespace App\Imports;

use App\Models\Dosen;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Spatie\Permission\Models\Role;

class UsersDosenImport implements ToModel, WithHeadingRow
{
    use Importable;
    
    public function model(array $row)
    {
        
        $kodeProdi = trim($row['kode_prodi']);

        if (is_numeric($kodeProdi)) {
            $kodeProdi = (int)$kodeProdi;
        }

        $existingUser = User::where('email', $row['email'])->first();
        
        if ($existingUser) {
            return null;
        }

        $roles = $this->getValidRoles($row['roles']);

        if (empty($roles)) {
            return null; 
        }

        $user = User::create([
            'name' => $row['name'],
            'email' => $row['email'],
            'password' => Hash::make($row['password']),
        ]);

        $user->assignRole($roles);

        $prodi = Prodi::where('kode_prodi', $kodeProdi)->first();

        if (!$prodi) {
            return null;
        }

        $dosen = Dosen::create([
            'user_id' => $user->id,          
            'kode_prodi' => $prodi->kode_prodi, 
        ]);

        return $dosen;
    }

    protected function getValidRoles($roles)
    {
        $roleNames = explode(',', $roles);
        return Role::whereIn('name', $roleNames)->pluck('name')->toArray();
    }
}
