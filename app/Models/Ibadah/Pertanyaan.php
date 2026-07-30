<?php

namespace App\Models\Ibadah;

use App\Helpers\UuidHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pertanyaan extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'uuid',
        'teks_pertanyaan',
        'tipe_pertanyaan',
        'wajib_diisi',
        'urutan',
        'kategori'
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

    public function pilihanJawabans()
    {
        return $this->hasMany(PilihanJawaban::class, 'pertanyaan_id');
    }

    public function jawabanLaporans()
    {
        return $this->hasMany(JawabanLaporan::class, 'pertanyaan_id');
    }
}
