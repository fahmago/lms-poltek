<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Administrator',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('1234'),
        ]);

        //get all permissions
        // $permissions = Permission::all();

        // Ambil semua permissions kecuali 'sidebar.dosen' dan 'sidebar.mahasiswa'
        $permissions = Permission::whereNotIn('name', ['sidebar.dosen', 'sidebar.mahasiswa'])->get();

        //get role admin
        $role = Role::findByName('admin');

        //assign permission to role
        $role->syncPermissions($permissions);

        //assign role to user
        $user->assignRole($role);
    }
}
