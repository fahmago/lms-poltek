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
        $adminRole = Role::create(['name' => 'admin']);
        $dosenRole = Role::create(['name' => 'dosen']);
        $mahasiswaRole = Role::create(['name' => 'mahasiswa']);

        // Buat permissions untuk dosen
        $dosenPermissions = [
            'sidebar.dashboard',
            'sidebar.dosen',
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
        ];
        foreach ($dosenPermissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName]);
            $dosenRole->givePermissionTo($permission); 
        }

        // Buat permissions untuk mahasiswa
        $mahasiswaPermissions = [
            'sidebar.dashboard',
            'sidebar.mahasiswa',

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
        foreach ($mahasiswaPermissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName]);
            $mahasiswaRole->givePermissionTo($permission);
        }

        // Berikan semua permission ke admin
        $adminRole->givePermissionTo(Permission::all());
    }
}
