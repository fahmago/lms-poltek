<?php

namespace App\Models\Ibadah;

use App\Helpers\UuidHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PilihanJawaban extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'uuid',
        'pertanyaan_id',
        'teks_jawaban',
        'poin',
        'khusus_gender',
        'urutan',
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
     * Relasi: Satu PilihanJawaban dimiliki oleh SATU Pertanyaan.
     */
    public function pertanyaan()
    {
        return $this->belongsTo(Pertanyaan::class, 'pertanyaan_id');
    }
}
