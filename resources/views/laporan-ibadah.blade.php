<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Detail Laporan Ibadah</title>
  <link rel="icon" href="{{ asset('images/favicons/favicon.ico') }}" sizes="any">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <style>
    body {
      background-color: #e9ecef;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
    }

    .container-wrapper {
      max-width: 800px;
      margin: 40px auto;
      background-color: #f7f7f7;
      border: 1px solid #d1d1d1;
      border-radius: 4px;
      padding: 25px 35px;
    }

    h2.title {
      font-size: 20px;
      font-weight: 600;
      color: #444;
      border-bottom: 1px solid #dcdcdc;
      padding-bottom: 10px;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
      text-align: center;
      text-transform: uppercase;
    }

    h5.section-title {
      font-size: 14px;
      text-transform: uppercase;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      padding-bottom: 4px;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
    }

    .info-item {
      font-size: 14px;
      margin-bottom: 10px;
      margin-top: 8px;
    }

    .info-item small {
      display: block;
      color: #888;
      font-size: 12px;
    }

    .info-item span {
      color: #333;
      font-weight: 500;
    }

    .question-box {
      background-color: #fff;
      border: 1px solid #dcdcdc;
      border-radius: 4px;
      padding: 12px 15px;
      font-size: 14px;
    }

    .question-text {
      color: #333;
      font-weight: 500;
    }

    .answer {
      margin-top: 6px;
      font-size: 13.5px;
    }

    .answer i {
      color: #999;
      margin-right: 6px;
    }

    .alert-primary {
      background-color: #edf4ff;
      border: 1px solid #c6ddff;
      color: #195fbf;
      font-size: 13.5px;
      margin-top: 8px;
      padding: 8px 10px;
      border-radius: 3px;
    }

    .total-section {
      border-top: 1px solid #d1d1d1;
      margin-top: 25px;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
    }

    .total-section .value {
      font-weight: 700;
      color: #0d6efd;
      font-size: 30px;
    }

    /* Perbaikan untuk Teks Quill */
    .question-text p:first-child {
      margin-top: 0;
    }

    .question-text p:last-child {
      margin-bottom: 0;
    }
  </style>
</head>

<body>
  <div class="container-wrapper">
    <h2 class="title">Detail Laporan Ibadah</h2>

    {{-- PERUBAHAN DI SINI --}}
    <!-- <div class="text-center my-3 py-2 border-top border-bottom">
      <div style="font-size: 14px; text-transform: uppercase; color: #666;">Total Poin (Akurat)</div>
      <div style="font-size: 42px; font-weight: 800; color: #0d6efd; line-height: 1.2;">
        {{ $total_poin_akurat }}
      </div>
    </div> -->

    <div class="mb-4">
      <h5 class="section-title d-flex justify-content-between align-items-center">
        <span>Informasi Mahasiswa</span>
        <small class="text-muted">{{ \Carbon\Carbon::parse($laporan->created_at)->format('d-m-Y H:i:s') ?? 'N/A' }}</small>
      </h5>

      <div class="row text-uppercase">
        <div class="col-md-6 info-item">
          <small>Nama Mahasiswa</small>
          <span>
            {{ $laporan->mahasiswa->user->name ?? 'N/A' }}
            @if($laporan->mahasiswa->gender)
            ({{ strtoupper($laporan->mahasiswa->gender) }})
            @endif
          </span>
        </div>

        <div class="col-md-6 info-item">
          <small>Tanggal Laporan</small>
          <span>{{ $laporan->tanggal_laporan->isoFormat('dddd, D MMMM YYYY') }}</span>
        </div>

        <div class="col-md-6 info-item">
          <small>NIM</small>
          <span>{{ $laporan->mahasiswa->nim ?? 'N/A' }}</span>
        </div>

        @if($laporan->mahasiswa->gender === 'P')
        <div class="col-md-6 info-item">
          <small>Status Saat Lapor</small>
          @if($laporan->is_haid)
          <span class="text-danger">Sedang Haid</span>
          @else
          <span class="text-success">Tidak Haid</span>
          @endif
        </div>
        @endif
      </div>
    </div>

    <div class="mb-4">
      <h5 class="section-title">Daftar Jawaban (Kategori: {{ $laporan->is_haid ? 'Haid' : 'Umum' }})</h5>
      <div class="d-flex flex-column gap-3">
        @forelse ($laporan->jawabanLaporans as $jawaban)
        <div class="question-box">
          <div class="d-flex align-items-start">
            <span class="fw-bold me-2">{{ $jawaban->pertanyaan->urutan ?? $loop->iteration }}.</span>
            <div class="question-text">{!! $jawaban->pertanyaan->teks_pertanyaan ?? 'Pertanyaan telah dihapus' !!}</div>
          </div>

          @if($jawaban->pertanyaan && $jawaban->pertanyaan->tipe_pertanyaan === 'pilihan_ganda')
          <div class="alert-primary d-flex align-items-center">
            <i class="fas fa-check-circle me-2" style="padding-top: 2px;"></i>
            <div>
              {{ $jawaban->pilihanJawaban->teks_jawaban ?? 'Jawaban tidak ditemukan' }}
              <strong>({{ $jawaban->poin_didapat }} Poin)</strong>
            </div>
          </div>
          @elseif($jawaban->pertanyaan && $jawaban->pertanyaan->tipe_pertanyaan === 'teks')
          <div class="answer d-flex">
            <i class="fas fa-pencil-alt me-2" style="padding-top: 4px;"></i>
            <pre style="font-family: inherit; margin: 0; white-space: pre-wrap;">{{ $jawaban->jawaban_teks }}</pre>
          </div>
          @endif
        </div>
        @empty
        <p class="text-muted text-center">Tidak ada jawaban yang tercatat.</p>
        @endforelse
      </div>
    </div>

    <div class="total-section" style="text-transform: uppercase;">
      <span>Total Poin Didapat:</span>
      {{-- PERUBAHAN DI SINI --}}
      <span class="value">{{ $total_poin_akurat }}</span>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>