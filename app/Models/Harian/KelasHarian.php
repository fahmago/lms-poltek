<?php

namespace App\Models\Harian;

use App\Helpers\UuidHelper;
use App\Models\Dosen;
use App\Models\Pekanan\TugasPekanan;
use App\Models\SKL\Buku;
use App\Models\SKL\Portofolio;
use App\Models\SKL\ProjectSemester;
use App\Models\SKL\Sertifikat;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Guid\Guid;

class KelasHarian extends Model
{
    use HasFactory;

    protected $fillable = [
        'dosen_id',
        'kategori_kelas_harian_id',
        'uuid',
        'kode_kelas_harian',
        'nama_kelas',
        'jam_mulai',
        'durasi',
        'tahun',
        'semester',
        'kode_enroll',
    ];

    public function jamSelesai()
    {
        $jamMulai = Carbon::createFromFormat('H:i:s', $this->jam_mulai);
        $jamSelesai = $jamMulai->addMinutes($this->durasi);
        return $jamSelesai->format('H:i');
    }

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($kh) {

            if (empty($kh->uuid)) {
                $kh->uuid = UuidHelper::generateUniqueCode(
                    table: $kh->getTable(),
                    length: 11,
                    column: 'uuid',
                );
            }

            // do {
            //     $kh->uuid = (string) Guid::uuid4();
            // } while (self::where('uuid', $kh->uuid)->exists());

            do {
                $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                $kh->kode_enroll = substr(str_shuffle(str_repeat($characters, 7)), 0, 7);
            } while (self::where('kode_enroll', $kh->kode_enroll)->exists());

            do {
                $kh->kode_kelas_harian = 'KH' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
            } while (self::where('kode_kelas_harian', $kh->kode_kelas_harian)->exists());
        });
    }
    public function dosen()
    {
        return $this->belongsTo(Dosen::class);
    }

    public function jadwalHarians()
    {
        return $this->hasMany(JadwalHarian::class);
    }

    public function kelasHarianMahasiswas()
    {
        return $this->hasMany(KelasHarianMahasiswa::class);
    }

    public function absensiHarians()
    {
        return $this->hasMany(AbsensiHarian::class);
    }

    public function tugasHarians()
    {
        return $this->hasMany(TugasHarian::class, 'kode_kelas_harian', 'kode_kelas_harian');
    }

    public function pengumpulanTugasHarians()
    {
        return $this->hasMany(PengumpulanTugasHarian::class, 'kode_kelas_harian', 'kode_kelas_harian');
    }

    public function materiHarians()
    {
        return $this->hasMany(MateriHarian::class, 'kode_kelas_harian', 'kode_kelas_harian');
    }

    public function kategoriKelasHarian()
    {
        return $this->belongsTo(KategoriKelasHarian::class, 'kategori_kelas_harian_id');
    }

    public function tugasPekanans()
    {
        return $this->belongsToMany(
            TugasPekanan::class,
            'kelas_harian_tugas_pekanan', // Nama tabel pivot
            'kelas_harian_id',
            'tugas_pekanan_id'
        );
    }

    public function projectSemesters()
    {
        return $this->belongsToMany(
            ProjectSemester::class,
            'kelas_harian_project_semester', // Nama tabel pivot
            'kelas_harian_id',
            'project_semester_id',
        );
    }

    public function portofolios()
    {
        return $this->belongsToMany(
            Portofolio::class,
            'kelas_harian_portofolio', // Nama tabel pivot
            'kelas_harian_id',         // Foreign key di pivot untuk model ini
            'portofolio_id'            // Foreign key di pivot untuk model lawan
        );
    }

    public function bukus()
    {
        return $this->belongsToMany(
            Buku::class,
            'kelas_harian_buku', // Nama tabel pivot
            'kelas_harian_id',   // Foreign key di pivot untuk model ini
            'buku_id'            // Foreign key di pivot untuk model lawan
        );
    }

    public function sertifikats()
    {
        return $this->belongsToMany(
            Sertifikat::class,
            'kelas_harian_sertifikat', // Nama tabel pivot
            'kelas_harian_id',         // Foreign key di pivot untuk model ini
            'sertifikat_id'            // Foreign key di pivot untuk model lawan
        );
    }


}
