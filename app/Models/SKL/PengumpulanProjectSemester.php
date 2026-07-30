<?php

namespace App\Models\SKL;

use App\Helpers\UuidHelper;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengumpulanProjectSemester extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'project_semester_id',
        'mahasiswa_id',
        'link_repository',
        'link_demo',
        'path_file_laporan',
        'status',
        'nilai',
        'feedback_dosen',
    ];

    protected $casts = [
        'nilai' => 'integer',
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

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function projectSemester()
    {
        return $this->belongsTo(ProjectSemester::class);
    }
}
