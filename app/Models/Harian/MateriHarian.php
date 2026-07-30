<?php

namespace App\Models\Harian;

use App\Models\Dosen;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class MateriHarian extends Model
{
    protected $fillable = [
        'dosen_id',
        'nidn',
        'kode_kelas_harian',
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

    public function kelasHarian()
    {
        return $this->belongsTo(KelasHarian::class, 'kode_kelas_harian', 'kode_kelas_harian');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
        // return $this->belongsTo(Dosen::class, 'nidn', 'nidn');
    }
}
