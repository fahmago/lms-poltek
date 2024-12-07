<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Materi extends Model
{
    protected $fillable = [
        'dosen_id',
        'nidn',
        'kode_kelas',
        'uuid',
        'judul',
        'deskripsi',
        'file',
        'tanggal_dibuat',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($materi) {
            do {
                $materi->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $materi->uuid)->exists());
        });
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class, 'kode_kelas', 'kode_kelas');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
        // return $this->belongsTo(Dosen::class, 'nidn', 'nidn');
    }
}
