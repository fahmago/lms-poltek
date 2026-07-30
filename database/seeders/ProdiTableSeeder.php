<?php

namespace Database\Seeders;

use App\Models\Prodi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Guid\Guid;

class ProdiTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Prodi::insert([
        //     [
        //         'uuid' => (string) Guid::uuid4(),
        //         'kode_prodi' => '58302',
        //         'nama_prodi' => 'Teknologi Rekayasa Perangkat Lunak',
        //     ],
        //     [
        //         'uuid' => (string) Guid::uuid4(),
        //         'kode_prodi' => '90343',
        //         'nama_prodi' => 'Teknologi Rekayasa Multimedia Grafis',
        //     ],
        //     [
        //         'uuid' => (string) Guid::uuid4(),
        //         'kode_prodi' => '90346',
        //         'nama_prodi' => 'Teknologi Rekayasa Komputer Jaringan',
        //     ],
        // ]);

        $data = [
            [
                'kode_prodi' => '58302',
                'nama_prodi' => 'Teknologi Rekayasa Perangkat Lunak',
            ],
            [
                'kode_prodi' => '90343',
                'nama_prodi' => 'Teknologi Rekayasa Multimedia Grafis',
            ],
            [
                'kode_prodi' => '90346',
                'nama_prodi' => 'Teknologi Rekayasa Komputer Jaringan',
            ],
        ];

        foreach ($data as $item) {
            Prodi::updateOrInsert(
                ['kode_prodi' => $item['kode_prodi']], // key unik
                [
                    'nama_prodi' => $item['nama_prodi'],
                    'uuid' => (string) Guid::uuid4(), // generate ulang uuid
                ]
            );
        }
    }
}

