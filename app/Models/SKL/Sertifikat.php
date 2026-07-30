<?php

namespace App\Models\SKL;

use App\Helpers\UuidHelper;
use App\Models\Harian\KelasHarian;
use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sertifikat extends Model
{
    use HasFactory;

    // Sesuaikan dengan migration 'sertifikats'
    protected $fillable = [
        'uuid',
        'prodi_id',
        'judul',
        'deskripsi',
        'waktu_mulai',
        'batas_waktu',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'batas_waktu' => 'datetime',
    ];

    /**
     * Tentukan 'uuid' sebagai kunci rute
     */
    // public function getRouteKeyName(): string
    // {
    //     return 'uuid';
    // }

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = UuidHelper::generateUniqueCode(
                    table: $model->getTable(),
                    length: 17, 
                    column: 'uuid',
                );
            }
        });
    }

    /**
     * Relasi ke Prodi
     */
    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    /**
     * Relasi ke KelasHarian (Tugas sertifikat ini ditugaskan ke kelas mana saja)
     */
    public function kelasHarians()
    {
        return $this->belongsToMany(
            KelasHarian::class,
            'kelas_harian_sertifikat', // Nama tabel pivot
            'sertifikat_id',           // Foreign key di pivot untuk model ini
            'kelas_harian_id'          // Foreign key di pivot untuk model lawan
        );
    }

    public function pengumpulanSertifikats()
    {
        return $this->hasMany(PengumpulanSertifikat::class);
    }
}
