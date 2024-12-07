<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Guid\Guid;
use Illuminate\Support\Str;

class Kelas extends Model
{
    protected $fillable = [
        'dosen_id',
        'nidn',
        'kode_matkul',
        'uuid',
        'kode_kelas',
        'nama_kelas',
        'tahun',   
        // 'ruangan',   
        'kode_enroll',     
    ];

    protected static function boot()
    {
        parent::boot();        
        static::creating(function ($kelas) {
            do {
                $kelas->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $kelas->uuid)->exists());
            do {
                $kelas->kode_enroll = Str::random(7);
            } while (self::where('kode_enroll', $kelas->kode_enroll)->exists()); 
            do {
                $kelas->kode_kelas = 'IDN' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            } while (self::where('kode_kelas', $kelas->kode_kelas)->exists());
        });
        static::deleting(function ($kelas) {
            // Log::info('Deleting Kelas: ' . $kelas->kode_kelas);
            $kelas->materis()->delete(); 
            $kelas->tugas()->delete(); 
            $kelas->jadwals()->delete(); 
            $kelas->pilihKelas()->delete();
            $kelas->absensis()->delete();
        });
    }

    public function matkul()
    {
        return $this->belongsTo(Matkul::class, 'kode_matkul', 'kode_matkul');
    }

    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
        // return $this->belongsTo(Dosen::class, 'nidn', 'nidn');
    }

    public function materis()
    {
        return $this->hasMany(Materi::class, 'kode_kelas', 'kode_kelas');
    }

    public function tugas()
    {
        return $this->hasMany(Tugas::class, 'kode_kelas', 'kode_kelas');
    }

    public function jadwals()
    {
        return $this->hasMany(Jadwal::class, 'kode_kelas', 'kode_kelas');
    }

    public function pilihKelas()
    {
        return $this->hasMany(PilihKelas::class, 'kode_kelas', 'kode_kelas');
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class, 'kode_kelas', 'kode_kelas');
    }

    public function pengumpulanTugas()
    {
        return $this->hasMany(PengumpulanTugas::class, 'kode_kelas', 'kode_kelas');
    }
}
