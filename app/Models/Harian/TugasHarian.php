<?php

namespace App\Models\Harian;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class TugasHarian extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'kode_kelas_harian',
        'judul',
        'deskripsi',
        'tanggal_diberikan',
        'tanggal_deadline',
    ];

    protected static function boot()
    {
        parent::boot();        
        static::creating(function ($tugasHarian) {
            do {
                $tugasHarian->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $tugasHarian->uuid)->exists());
        });
    }

    public function kelasHarian()
    {
        return $this->belongsTo(KelasHarian::class, 'kode_kelas_harian', 'kode_kelas_harian');
    }

    // Relasi ke model PengumpulanTugas
    public function pengumpulanTugasHarians()
    {
        // return $this->hasOne(PengumpulanTugas::class);  // Satu tugas dapat memiliki banyak pengumpulan tugas
        return $this->hasMany(PengumpulanTugasHarian::class);  // Satu tugas dapat memiliki banyak pengumpulan tugas
    }
}
