<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Role::create(['name' => 'admin']);
        // Role::create(['name' => 'dosen']);
        // Role::create(['name' => 'mahasiswa']);
        
        // Buat roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $dosenRole = Role::firstOrCreate(['name' => 'dosen']);
        $mahasiswaRole = Role::firstOrCreate(['name' => 'mahasiswa']);

        // Buat permissions untuk dosen
        $dosenPermissions = [
            'sidebar.dashboard',
            'sidebar.dosen',
            'sidebar.dosen.harian',
            'dsn.kls.index',
            'dsn.kls.show',
            'dsn.mhs.view',
            'dsn.kls.enroll',

            'dsn.mtr.index',
            'dsn.mtr.create',
            'dsn.mtr.show',
            'dsn.mtr.edit',
            'dsn.mtr.delete',
            
            'dsn.tgs.index',
            'dsn.tgs.create',
            'dsn.tgs.show',
            'dsn.tgs.edit',
            'dsn.tgs.delete',

            'dsn.jdwl.index',
            'dsn.jdwl.show',

            'dsn.dh.kelas.index',
            'dsn.dh.kelas.show',
            'dsn.dh.kelas.edit',
            'dsn.dh.kelas.enroll',
            'dsn.dh.kelas.view',

            'dsn.dh.jadwal.index',
            'dsn.dh.jadwal.showJadwal',

            'dsn.dh.tugas.index',
            'dsn.dh.tugas.show',
            'dsn.dh.tugas.create',
            'dsn.dh.tugas.edit', 
            'dsn.dh.tugas.delete',

            'dsn.dh.mtr.index',
            'dsn.dh.mtr.create',
            'dsn.dh.mtr.show',
            'dsn.dh.mtr.edit',
            'dsn.dh.mtr.delete',
        ];
        foreach ($dosenPermissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName]);
            $dosenRole->givePermissionTo($permission); 
        }

        // Buat permissions untuk mahasiswa
        $mahasiswaPermissions = [
            'sidebar.dashboard',
            'sidebar.mahasiswa',
            'sidebar.mh.harian',
            'sidebar.mh.profile',

            'mhs.pro.index',
            'mhs.nim.index',

            'mhs.reg.index',

            'mhs.kls.index',
            'mhs.abs.index',
            'mhs.abs.presence',

            'mhs.tgs.index',
            'mhs.tgs.show',

            'mhs.mtr.index',
            'mhs.mtr.show',

            'mhs.dh.kelas.index',
            'mhs.dh.abs.index',
            'mhs.dh.abs.jadwal',

            'mhs.dh.tgs.index',
            'mhs.dh.tgs.show',
            'mhs.dh.sholat.index',

            'mhs.join.index',
        ];
        foreach ($mahasiswaPermissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName]);
            $mahasiswaRole->givePermissionTo($permission);
        }

        // Berikan semua permission ke admin
        // $adminRole->givePermissionTo(Permission::all());

        // --- Untuk Admin ---
        // Admin dapat semua permission, tapi kita exclude yang hanya untuk dosen & mahasiswa
        $excludedPermissions = array_merge($dosenPermissions, $mahasiswaPermissions);

        $allPermissions = Permission::all()->pluck('name')->toArray();

        // Ambil semua permission kecuali yang ada di $excludedPermissions
        $adminPermissions = array_diff($allPermissions, $excludedPermissions);

        foreach ($adminPermissions as $permissionName) {
            $adminRole->givePermissionTo($permissionName);
        }
    }
}
