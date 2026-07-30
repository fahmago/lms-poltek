<?php

namespace App\Models\Ibadah;

use App\Helpers\UuidHelper;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanIbadah extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'mahasiswa_id',
        'tanggal_laporan',
        'is_haid',
        'total_poin',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = UuidHelper::generateUniqueCode(
                    table: $model->getTable(),
                    length: 11,
                    column: 'uuid',
                );
            }
        });
    }

    /**
     * Relasi: Satu LaporanIbadah dimiliki oleh SATU Mahasiswa.
     * Ini adalah relasi kunci untuk menghubungkan ke data mahasiswa.
     */
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }

    public function jawabanLaporans()
    {
        return $this->hasMany(JawabanLaporan::class, 'laporan_ibadah_id');
    }

    protected $casts = [
        'tanggal_laporan' => 'date',
        'is_haid' => 'boolean',
    ];
}
