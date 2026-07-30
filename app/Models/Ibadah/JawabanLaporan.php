<?php

namespace App\Models\Ibadah;

use App\Helpers\UuidHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JawabanLaporan extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'laporan_ibadah_id',
        'pertanyaan_id',
        'pilihan_jawaban_id',
        'jawaban_teks',
        'poin_didapat',
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

    public function laporanIbadah()
    {
        return $this->belongsTo(LaporanIbadah::class, 'laporan_ibadah_id');
    }

    public function pertanyaan()
    {
        return $this->belongsTo(Pertanyaan::class, 'pertanyaan_id');
    }

    public function pilihanJawaban()
    {
        return $this->belongsTo(PilihanJawaban::class, 'pilihan_jawaban_id');
    }
}
