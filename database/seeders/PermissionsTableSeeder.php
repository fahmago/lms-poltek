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
            'sidebar.grafik',
            'sidebar.grafik.kelas_harian',
            'sidebar.grafik.skl',
            'sidebar.grafik.ibadah',
            'sidebar.admin',
            'sidebar.admin.kelolah.ibadah',
            'sidebar.harian',
            'sidebar.dosen',
            'sidebar.dosen.harian',
            'sidebar.dosen.skl',
            'sidebar.mahasiswa',
            'sidebar.akses',
            'sidebar.mh.harian',
            'sidebar.mh.skl',
            'sidebar.mh.profile',
            'sidebar.pekanan',
            'sidebar.skl',                        

            // permission project semester
            'project.semester.index',
            'project.semester.create',
            'project.semester.show',
            'project.semester.edit',
            'project.semester.delete',

            // permission portofolio
            'portofolio.index',
            'portofolio.create',
            'portofolio.show',
            'portofolio.edit',
            'portofolio.delete',

            // permission buku
            'buku.index',
            'buku.create',
            'buku.show',
            'buku.edit',
            'buku.delete',

            // permission sertifikat
            'sertifikat.index',
            'sertifikat.create',
            'sertifikat.show',
            'sertifikat.edit',
            'sertifikat.delete',

            // permission pekanan
            'pekanan.index',
            'pekanan.create',
            'pekanan.show',
            'pekanan.edit',
            'pekanan.delete',

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
            'mahasiswas.list-kelas',
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
            
            // permission data harian
            'dh.kelas.index',
            'dh.kelas.create',
            'dh.kelas.edit',
            'dh.kelas.delete',
            'dh.kelas.print',

            'dh.jadwal.index',
            'dh.jadwal.create',


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

            'dsn.dh.kelas.index',
            'dsn.dh.kelas.show',
            'dsn.dh.kelas.edit',
            'dsn.dh.kelas.enroll',
            'dsn.dh.kelas.view',

            'dsn.dh.jadwal.index',
            'dsn.dh.jadwal.showJadwal',
            'dsn.dh.jadwal.setHadirSemua',
            
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

            // Permission SKL
            'dsn.pekanan.index',
            'dsn.pekanan.show',

            'dsn.project.semester.index',
            'dsn.project.semester.show',

            'dsn.portofolio.index',
            'dsn.portofolio.show',

            'dsn.buku.index',
            'dsn.buku.show',

            'dsn.sertifikat.index',
            'dsn.sertifikat.show',
            // End Permission SKL

            // permission SIDEBAR MAHASISWA
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
            
            'mhs.pekanan.index',
            'mhs.project.semester.index',
            'mhs.portofolio.index',
            'mhs.buku.index',
            'mhs.sertifikat.index',
            'mhs.ingat.laporan',
            'mhs.view-online-users',
            'mhs.lihat.skl',

            // permission Kehadiran Mahasiswa
            'kehadiran.status.index',
            'view-online-users',
            'view-system-health',
            // 'view-photo-all',
            'view-photo-p',
            'view-photo-l',
            'tanpa.watermark',
            'grafik.watermark',
            
            'kategori.kelasharian.index',
            'kategori.kelasharian.create',
            'kategori.kelasharian.edit',
            'kategori.kelasharian.delete',

            'pertanyaan.ibadah.index',
            'pertanyaan.ibadah.create',
            'pertanyaan.ibadah.edit',
            'pertanyaan.ibadah.delete',
        ];

        foreach ($permissions as $permission) {
            if (!Permission::where('name', $permission)->exists()) {
                Permission::create(['name' => $permission, 'guard_name' => 'web']);
            }
        }
    }
}
