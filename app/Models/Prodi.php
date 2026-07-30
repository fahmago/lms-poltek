<?php

namespace App\Models;

use App\Models\Pekanan\TugasPekanan;
use App\Models\SKL\Buku;
use App\Models\SKL\Portofolio;
use App\Models\SKL\ProjectSemester;
use App\Models\SKL\Sertifikat;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Prodi extends Model
{
    protected $fillable = [
        'uuid',
        'kode_prodi',
        'nama_prodi',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($prodi) {
            do {
                $prodi->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $prodi->uuid)->exists());
        });
    }

    /**
     * Relasi Prodi ke Mahasiswa (sebuah prodi memiliki banyak mahasiswa)
     */
    public function mahasiswas()
    {
        return $this->hasMany(Mahasiswa::class, 'kode_prodi', 'kode_prodi');
    }

    public function dosens()
    {
        return $this->hasMany(Dosen::class, 'kode_prodi', 'kode_prodi');
    }

    public function matkuls()
    {
        return $this->hasMany(Matkul::class, 'kode_prodi', 'kode_prodi');
    }

    public function tugasPekanans()
    {
        return $this->hasMany(TugasPekanan::class);
    }

    public function projectSemesters()
    {
        return $this->hasMany(ProjectSemester::class);
    }

    public function portofolios()
    {
        return $this->hasMany(Portofolio::class);
    }

    public function bukus()
    {
        return $this->hasMany(Buku::class);
    }

    public function sertifikats()
    {
        return $this->hasMany(Sertifikat::class);
    }
    
}
