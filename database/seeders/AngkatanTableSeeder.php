<?php

namespace Database\Seeders;

use App\Models\Angkatan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Guid\Guid;

class AngkatanTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Angkatan::insert([
            [
                'uuid' => (string) Guid::uuid4(),
                'kode_tahun' => '2022',
                'nama_angkatan' => 'Pertama',
                'ketua_angkatan' => 'Miko',
                'tahun_angkatan' => '2022',
            ],
            [
                'uuid' => (string) Guid::uuid4(),
                'kode_tahun' => '2023',
                'nama_angkatan' => 'Kedua',
                'ketua_angkatan' => 'Yusuf',
                'tahun_angkatan' => '2023',
            ],
            [
                'uuid' => (string) Guid::uuid4(),
                'kode_tahun' => '2024',
                'nama_angkatan' => 'Ketiga',
                'ketua_angkatan' => 'Rafif',
                'tahun_angkatan' => '2024',
            ],
        ]);
    }
}
