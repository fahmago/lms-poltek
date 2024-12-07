<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class PilihKelas extends Model
{
    protected $fillable = [
        'uuid',
        'mahasiswa_id',
        'kode_kelas',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($pk) {
            do {
                $pk->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $pk->uuid)->exists());
        });
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kode_kelas', 'kode_kelas');
    }
}

