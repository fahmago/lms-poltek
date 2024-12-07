<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Angkatan extends Model
{
    protected $fillable = [
        'uuid', 
        'kode_tahun', 
        'nama_angkatan', 
        'ketua_angkatan', 
        'tahun_angkatan'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($angkatan) {
            $angkatan->uuid = (string) Guid::uuid4();  // Menggunakan ramsey/uuid
        });
    }
    
    /**
     * Relasi Angkatan ke Mahasiswa (sebuah angkatan memiliki banyak mahasiswa)
     */
    public function mahasiswas()
    {
        return $this->hasMany(Mahasiswa::class, 'kode_tahun', 'kode_tahun');
    }
}
