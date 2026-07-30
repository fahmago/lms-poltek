<?php

namespace App\Models\SKL;

use App\Helpers\UuidHelper;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengumpulanBuku extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'buku_id',
        'mahasiswa_id',
        'link_naskah_draft', // Kolom baru
        'link_hasil_buku',   // Kolom baru
        'status',
        'nilai',
        'feedback_dosen',
    ];

    protected $casts = [
        'nilai' => 'integer',
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
    
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function buku()
    {
        return $this->belongsTo(Buku::class);
    }
}
