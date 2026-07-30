<?php

namespace App\Models\Pekanan;

use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class PengumpulanTugasPekanan extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'tugas_pekanan_id',
        'mahasiswa_id',
        'jawaban',
        'status',
        'nilai',
        'feedback_dosen',
    ];

    protected $casts = [
        // Secara otomatis mengubah kolom 'jawaban' dari string JSON
        // menjadi array PHP saat diambil, dan sebaliknya saat disimpan.
        'jawaban' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            do {
                $model->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $model->uuid)->exists());
        });
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function tugasPekanan()
    {
        return $this->belongsTo(TugasPekanan::class);
    }
}
