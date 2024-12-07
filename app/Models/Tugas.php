<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Tugas extends Model
{
    protected $fillable = [
        'uuid',
        'kode_kelas',
        'judul',
        'deskripsi',
        'tanggal_diberikan',
        'tanggal_deadline',
    ];

    protected static function boot()
    {
        parent::boot();        
        static::creating(function ($tugas) {
            do {
                $tugas->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $tugas->uuid)->exists());
        });
        // static::deleting(function ($tugas) {
        //     $tugas->pengumpulanTugas()->delete(); 
        // });
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kode_kelas', 'kode_kelas');
    }

    // Relasi ke model PengumpulanTugas
    public function pengumpulanTugas()
    {
        // return $this->hasOne(PengumpulanTugas::class);  // Satu tugas dapat memiliki banyak pengumpulan tugas
        return $this->hasMany(PengumpulanTugas::class);  // Satu tugas dapat memiliki banyak pengumpulan tugas
    }
}
