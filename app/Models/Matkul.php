<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Matkul extends Model
{

    protected $fillable = [
        'uuid',
        'kode_prodi',
        'kode_matkul',
        'nama_matkul',
        'sks',
        'semester',
        'rps',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($matkul) {
            do {
                $matkul->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $matkul->uuid)->exists());
        });
    }
    
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    public function kelas()
    {
        return $this->hasMany(Kelas::class, 'kode_matkul', 'kode_matkul');
    }
}
