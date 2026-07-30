<?php

namespace App\Models\Pekanan;

use App\Models\Harian\KelasHarian;
use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class TugasPekanan extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'prodi_id',
        'judul',
        'deskripsi',
        'tipe_tugas',
        'waktu_mulai',
        'batas_waktu',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'batas_waktu' => 'datetime',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            do {
                $model->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $model->uuid)->exists());
        });
    }

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }
    
    public function kelasHarians()
    {
        return $this->belongsToMany(
            KelasHarian::class,
            'kelas_harian_tugas_pekanan',
            'tugas_pekanan_id',
            'kelas_harian_id'
        );
    }

    public function pengumpulanTugasPekanans()
    {
        return $this->hasMany(PengumpulanTugasPekanan::class);
    }
}
