<?php

namespace App\Models\Harian;

use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;
use Illuminate\Support\Str;

class AbsensiHarian extends Model
{
    protected $fillable = [
        'mahasiswa_id',
        'jadwal_harian_id',  
        'kelas_harian_id',  
        'kode_kelas_harian',                                 
        'uuid',                                 
        'waktu_absensi',                                      
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($ah) {
            do {
                $ah->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $ah->uuid)->exists());
        });
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function jadwalHarian()
    {
        return $this->belongsTo(JadwalHarian::class);
    }

    public function kelas()
    {
        return $this->belongsTo(KelasHarian::class);
    }
}
