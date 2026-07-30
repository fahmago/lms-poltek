<?php

namespace App\Models\Harian;

use App\Helpers\UuidHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriKelasHarian extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'nama_kategori',
        'deskripsi',
        'is_it',
        'jenis',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = UuidHelper::generateUniqueCode(
                    table: $model->getTable(),
                    length: 12,
                    column: 'uuid',
                );
            }
        });
    }

    public function kelasHarians()
    {
        return $this->hasMany(KelasHarian::class, 'kategori_kelas_harian_id');
    }
}
