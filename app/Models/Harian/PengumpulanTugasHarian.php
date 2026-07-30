<?php

namespace App\Models\Harian;

use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class PengumpulanTugasHarian extends Model
{
    protected $fillable = [
        'tugas_harian_id',         // ID tugas (foreign key)
        'kode_kelas_harian',// Kode kelas
        'mahasiswa_id',     // ID mahasiswa (foreign key)
        'uuid',             // UUID
        'link_tugas',       // Link tugas
        'kendala',          // Kendala
        'nilai',            // Nilai tugas
        'tanggal_dikirim',  // Tanggal dikirim
        'status',           // Status tugas
        'feedback',         // Feedback dari dosen
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($ptugas) {
            do {
                $ptugas->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $ptugas->uuid)->exists());
        });
    }

    // Relasi ke model Tugas
    public function tugasHarian()
    {
        return $this->belongsTo(TugasHarian::class);  // Tugas yang diambil oleh pengumpulan tugas
    }

    // Relasi ke model Mahasiswa
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);  // Mahasiswa yang mengumpulkan tugas
    }

    public function kelasHarians()
    {
        return $this->belongsTo(KelasHarian::class, 'kode_kelas_harian', 'kode_kelas_harian');
    }
}
