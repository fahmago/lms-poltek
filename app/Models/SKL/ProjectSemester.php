<?php

namespace App\Models\SKL;

use App\Helpers\UuidHelper;
use App\Models\Harian\KelasHarian;
use App\Models\Prodi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectSemester extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'prodi_id',
        'judul',
        'deskripsi',
        'catatan',
        'waktu_mulai',
        'batas_waktu',
    ];

    protected $casts = [
        'waktu_mulai' => 'datetime',
        'batas_waktu' => 'datetime',
    ];


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

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function kelasHarians()
    {
        return $this->belongsToMany(
            KelasHarian::class,
            'kelas_harian_project_semester', // Nama tabel pivot
            'project_semester_id',           // Foreign key di pivot untuk model ini
            'kelas_harian_id'                // Foreign key di pivot untuk model lawan
        );
    }

    public function pengumpulanProjectSemesters()
    {
        return $this->hasMany(PengumpulanProjectSemester::class);
    }
}
