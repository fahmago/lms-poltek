<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // permission sidebar
            'sidebar.dashboard',
            'sidebar.admin',
            'sidebar.dosen',
            'sidebar.mahasiswa',
            'sidebar.akses',

            // permission angkatans
            'angkatans.index',
            'angkatans.create',
            'angkatans.edit',
            'angkatans.delete',

            // permission prodis
            'prodis.index',
            'prodis.create',
            'prodis.edit',
            'prodis.delete',

            // permission mahasiswas
            'mahasiswas.index',
            'mahasiswas.create',
            'mahasiswas.edit',
            'mahasiswas.delete',

            // permission dosens
            'dosens.index',
            'dosens.create',
            'dosens.edit',
            'dosens.delete',

            // permission matkuls
            'matkuls.index',
            'matkuls.create',
            'matkuls.excel',
            'matkuls.edit',
            'matkuls.delete',

            // permission kelas
            'kelas.index',
            'kelas.create',
            'kelas.edit',
            'kelas.delete',

            // permission jadwal
            'jadwal.index',
            'jadwal.create',
            // 'kelas.edit',
            // 'kelas.delete',

            // permission users
            'users.index',
            'users.create',
            'users.mhs.excel',
            'users.dsn.excel',
            'users.edit',
            'users.delete',
            
            // permission roles
            'roles.index',
            'roles.create',
            'roles.edit',
            'roles.delete',
            
            // permission permissions
            'permissions.index',


            // permission SIDEBAR DOSEN
            // Kelas Dosen
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

            // permission SIDEBAR MAHASISWA
            'mhs.pro.index',
            'mhs.reg.index',

            'mhs.kls.index',
            'mhs.abs.index',
            'mhs.abs.presence',

            'mhs.tgs.index',
            'mhs.tgs.show',

            'mhs.mtr.index',
            'mhs.mtr.show',
        ];

        foreach ($permissions as $permission) {
            if (!Permission::where('name', $permission)->exists()) {
                Permission::create(['name' => $permission, 'guard_name' => 'web']);
            }
        }
    }
}
