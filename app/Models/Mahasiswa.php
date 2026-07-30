<?php

namespace App\Models;

use App\Models\Harian\AbsensiHarian;
use App\Models\Harian\KelasHarian;
use App\Models\Harian\KelasHarianMahasiswa;
use App\Models\Harian\PengumpulanTugasHarian;
use App\Models\Ibadah\LaporanIbadah;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class Mahasiswa extends Model
{
    protected $fillable = [
        'user_id',
        'kode_tahun',
        'kode_prodi',
        'uuid',
        'nim',
        'tempat_lahir',
        'tanggal_lahir',
        'telepon',
        'gender',
        'alasan_pilih_idn',
        'image',
        'is_lengkap',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($mhs) {
            do {
                $mhs->uuid = (string) Guid::uuid4();
            } while (self::where('uuid', $mhs->uuid)->exists());
        });
    }

    /**
     * Relasi Mahasiswa ke User (setiap mahasiswa terkait dengan satu user)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi Mahasiswa ke Angkatan (setiap mahasiswa memiliki satu angkatan)
     */
    public function angkatan()
    {
        return $this->belongsTo(Angkatan::class, 'kode_tahun', 'kode_tahun');
    }

    /**
     * Relasi Mahasiswa ke Prodi (setiap mahasiswa memiliki satu program studi)
     */
    public function prodi()
    {
        return $this->belongsTo(Prodi::class, 'kode_prodi', 'kode_prodi');
    }

    protected function image(): Attribute
    {
        return Attribute::make(
            get: fn ($image) => $image ? asset('/storage/mahasiswa/' . $image) : asset('/images/no-image.png'),
        );
    }

    public function pilihKelas()
    {
        return $this->hasMany(PilihKelas::class);
    }

    public function kelas()
    {
        return $this->hasManyThrough(Kelas::class, PilihKelas::class, 'mahasiswa_id', 'kode_kelas', 'id', 'kode_kelas');
    }

    public function matkul()
    {
        return $this->hasManyThrough(
            Matkul::class,     // Model yang ingin diambil (Matkul)
            PilihKelas::class, // Model perantara (PilihKelas)
            'mahasiswa_id',    // Foreign key di PilihKelas yang menghubungkan ke Mahasiswa
            'kode_matkul',     // Foreign key di Kelas yang menghubungkan ke Matkul
            'id',              // Primary key di Mahasiswa
            'kode_kelas'       // Foreign key di PilihKelas yang menghubungkan ke Kelas
        );
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class);
    }

    public function absensiHarians()
    {
        return $this->hasMany(AbsensiHarian::class);
    }

    public function pengumpulanTugas()
    {
        return $this->hasMany(PengumpulanTugas::class);  // Satu mahasiswa dapat mengumpulkan banyak tugas
    }

    public function kelasHarianMahasiswas()
    {
        return $this->hasMany(KelasHarianMahasiswa::class);
    }

    public function kelasHarians()
    {
        return $this->hasManyThrough(
            KelasHarian::class, // Model tujuan
            KelasHarianMahasiswa::class, // Model perantara
            'mahasiswa_id', // Foreign key di `kelas_harian_mahasiswas` yang menghubungkan ke mahasiswa
            'id', // Primary key di `kelas_harians`
            'id', // Primary key di `mahasiswa`
            'kelas_harian_id' // Foreign key di `kelas_harian_mahasiswas` yang menghubungkan ke kelas_harians
        );
    }

    public function kelasHariansKehadiranStatus()
    {
        return $this->belongsToMany(
            KelasHarian::class,
            'kelas_harian_mahasiswas', // nama pivot
            'mahasiswa_id',            // FK ke mahasiswa
            'kelas_harian_id'          // FK ke kelas_harian
        )
        ->withPivot('id', 'uuid') 
        ->withTimestamps(); 
    }

    public function pengumpulanTugasHarians()
    {
        return $this->hasMany(PengumpulanTugasHarian::class);  // Satu mahasiswa dapat mengumpulkan banyak tugas
    }

    public function laporanIbadahs()
    {
        return $this->hasMany(LaporanIbadah::class, 'mahasiswa_id');
    }

}
