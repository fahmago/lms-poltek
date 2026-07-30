<?php

namespace App\Models\SKL;

use App\Helpers\UuidHelper;
use App\Models\Harian\KelasHarian;
use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buku extends Model
{
    use HasFactory;

    // Sesuaikan dengan migration 'bukus'
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
                    length: 17, // Sesuaikan panjang jika perlu
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
     * Relasi ke KelasHarian (Tugas buku ini ditugaskan ke kelas mana saja)
     */
    public function kelasHarians()
    {
        return $this->belongsToMany(
            KelasHarian::class,
            'kelas_harian_buku', // Nama tabel pivot
            'buku_id',             // Foreign key di pivot untuk model ini
            'kelas_harian_id'    // Foreign key di pivot untuk model lawan
        );
    }

    /**
     * Relasi ke Pengumpulan (Melihat semua hasil pengumpulan)
     */
    public function pengumpulanBukus()
    {
        return $this->hasMany(PengumpulanBuku::class);
    }
}
