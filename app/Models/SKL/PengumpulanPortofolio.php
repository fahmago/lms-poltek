<?php

namespace App\Models\SKL;

use App\Helpers\UuidHelper;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengumpulanPortofolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'portofolio_id',
        'mahasiswa_id',
        'link_repository',
        'link_demo',
        'status',
        'nilai',
        'feedback_dosen',
    ];

    protected $casts = [
        'nilai' => 'integer',
    ];

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
                    length: 17, 
                    column: 'uuid',
                );
            }
        });
    }

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }
    
    public function portofolio()
    {
        return $this->belongsTo(Portofolio::class);
    }
}
