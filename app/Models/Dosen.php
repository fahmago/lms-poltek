<?php

namespace App\Models;

use App\Models\Harian\JadwalHarian;
use App\Models\Harian\KelasHarian;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Dosen extends Model
{
    protected $fillable = [
        'user_id',
        'kode_prodi',
        'uuid',
        'nidn',
        'tempat_lahir',
        'tanggal_lahir',
        'telepon',
        'gender',
        'image',
        'is_lengkap',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($dsn) {
            do {
                $dsn->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $dsn->uuid)->exists());
        });
    }

    /**
     * Relasi Dosen ke Prodi (setiap dosen memiliki satu program studi)
     */
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }
    /**
     * Define the relationship to the `User` model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->hasMany(Kelas::class);
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn ($image) => $image ? asset('/storage/dosen/' . $image) : asset('/images/no-image.png'),
        );
    }

    public function kelasHarians()
    {
        return $this->hasMany(KelasHarian::class);
    }

    public function jadwalDosenHarians()
    {
        return $this->hasManyThrough(
            JadwalHarian::class,    // Model tujuan yang ingin kita ambil
            KelasHarian::class,     // Model perantara
            'dosen_id',             // Foreign key di tabel 'kelas_harians'
            'kelas_harian_id',      // Foreign key di tabel 'jadwal_harians'
            'id',                   // Local key di tabel 'dosens'
            'id'                    // Local key di tabel 'kelas_harians'
        );
    }
}
