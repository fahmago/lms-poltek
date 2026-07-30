<?php

namespace App\Models\SKL;

use App\Helpers\UuidHelper;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengumpulanSertifikat extends Model
{
    use HasFactory;

    // Sesuaikan dengan migration 'pengumpulan_sertifikats'
    protected $fillable = [
        'uuid',
        'sertifikat_id',
        'mahasiswa_id',
        'link_file_sertifikat', 
        'link_verifikasi',      
        'nama_penerbit',        
        'tanggal_terbit',       
        'status',
        'nilai',
        'feedback_dosen',
    ];

    protected $casts = [
        'nilai' => 'integer',
        'tanggal_terbit' => 'date', // Cast kolom tanggal baru
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
    
    public function sertifikat()
    {
        return $this->belongsTo(Sertifikat::class);
    }
}
