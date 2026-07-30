<?php

namespace App\Models\Harian;

use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class KelasHarianMahasiswa extends Model
{
    protected $fillable = [
        'uuid', 
        'mahasiswa_id', 
        'kelas_harian_id', 
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($khm) {
            do {
                $khm->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $khm->uuid)->exists());
        });
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function kelasHarian()
    {
        return $this->belongsTo(KelasHarian::class);
    }
}
