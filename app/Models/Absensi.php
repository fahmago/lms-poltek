<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Absensi extends Model
{
    protected $fillable = [
        'mahasiswa_id',
        'jadwal_id',
        'kode_kelas',
        'uuid',
        'waktu_absensi',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($absensi) {
            do {
                $absensi->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $absensi->uuid)->exists());
        });
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function jadwal()
    {
        return $this->belongsTo(Jadwal::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kode_kelas', 'kode_kelas');
    }
}
