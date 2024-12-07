<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Jadwal extends Model
{
    protected $fillable = [
        'kode_kelas',
        'uuid',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'ruangan',
        'tahun',
        'semester',
    ];

    protected static function boot()
    {
        parent::boot();        
        static::creating(function ($jadwal) {
            do {
                $jadwal->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $jadwal->uuid)->exists());
        });
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kode_kelas', 'kode_kelas');
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class);
    }
}
