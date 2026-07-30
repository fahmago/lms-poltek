<?php

namespace App\Models\Harian;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;
use Illuminate\Support\Str;

class JadwalHarian extends Model
{
    protected $table = 'jadwal_harians';

    protected $fillable = [
        'kelas_harian_id',
        'kode_kelas_harian',
        'uuid', 
        'kode_unik', 
        'tanggal', 
        'tahun', 
        'waktu_isi_absen',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($jh) {

            do {
                $jh->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $jh->uuid)->exists());

            do {
                $jh->kode_unik = Str::random(6);
            } while (self::where('kode_unik', $jh->kode_unik)->exists());

        });
    }

    public function kelasHarian()
    {
        return $this->belongsTo(KelasHarian::class);
    }

    public function absensiHarians()
    {
        return $this->hasMany(AbsensiHarian::class);
    }

    public function getFormattedTanggalAttribute()
    {
        // Menggunakan Carbon untuk memformat tanggal
        return Carbon::parse($this->tanggal)->translatedFormat('l d-m-Y');
        // 'l' adalah untuk nama hari dalam bahasa Indonesia (Senin, Selasa, dll)
        // 'd-m-Y' adalah format tanggal (contoh: 09-12-2024)
    }
}
