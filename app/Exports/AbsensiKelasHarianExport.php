<?php

namespace App\Exports;

use Illuminate\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AbsensiKelasHarianExport implements FromView, WithStyles
{
    protected $kelas, $mahasiswa, $jadwals, $month;

    public function __construct($kelas, $mahasiswa, $jadwals, $month)
    {
        $this->kelas = $kelas;
        $this->mahasiswa = $mahasiswa;
        $this->jadwals = $jadwals;
        $this->month = $month;
    }

    public function view(): View
    {
        return view('exports.ab', [
            'kelas' => $this->kelas,
            'mahasiswa' => $this->mahasiswa,
            'jadwals' => $this->jadwals,
            'month' => $this->month,
        ]);
    }

    // public function registerEvents(): array
    // {
    //     return [
    //         AfterSheet::class => function (AfterSheet $event) {
    //             $sheet = $event->sheet;

    //             // Judul di A1, merge cell agar di tengah
    //             $sheet->mergeCells('A1:E1');
    //             $sheet->setCellValue('A1', 'REKAP PRESENSI');
    //             $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
    //             $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

    //             // Informasi kelas (metadata)
    //             $sheet->setCellValue('A3', 'Kode Kelas');
    //             $sheet->setCellValue('B3', ': ' . $this->kelas->kode_kelas_harian);

    //             $sheet->setCellValue('A4', 'Nama Kelas');
    //             $sheet->setCellValue('B4', ': ' . $this->kelas->nama_kelas);

    //             $sheet->setCellValue('A5', 'Semester / Tahun');
    //             $sheet->setCellValue('B5', ': ' . $this->kelas->semester . ' / ' . $this->kelas->tahun);

    //             $sheet->setCellValue('A6', 'Dosen Pengampu');
    //             $sheet->setCellValue('B6', ': ' . $this->kelas->dosen->user->name);

    //             $sheet->setCellValue('A7', 'Rekap Absensi');
    //             $sheet->setCellValue('B7', ': ' . \Carbon\Carbon::parse($this->month)->translatedFormat('F Y'));

    //            // Set lebar dan alignment untuk kolom
    //             $sheet->getColumnDimension('B')->setWidth(130); // Kolom NIM (lebar tetap)
    //             $sheet->getStyle('B')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); // NIM rata tengah
    //             $sheet->getColumnDimension('C')->setAutoSize(true); // Kolom Nama Mahasiswa (lebar otomatis)
            
    //             $startColumn = 'D';
    //             foreach (range(0, count($this->jadwals) - 1) as $index) {
    //                 $col = chr(ord($startColumn) + $index);
    //                 $sheet->getStyle($col)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
    //             }

    //             // Tanda tangan dosen
    //             $lastRow = count($this->mahasiswa) + 10; // Posisi di bawah tabel
    //             $sheet->setCellValue('E' . ($lastRow + 1), 'Bogor, ' . \Carbon\Carbon::now()->translatedFormat('d F Y'));
    //             $sheet->setCellValue('E' . ($lastRow + 3), 'Mengetahui,');
    //             $sheet->setCellValue('E' . ($lastRow + 5), $this->kelas->dosen->user->name);

    //             // Membuat tanda tangan bold dan underline
    //             $sheet->getStyle('E' . ($lastRow + 5))->getFont()->setBold(true)->setUnderline(true);
    //         },
    //     ];
    // }

    public function styles(Worksheet $sheet)
    {
        $styles = [
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'alignment' => ['horizontal' => 'center'],
            ],
            'A' => ['alignment' => ['horizontal' => 'center']], // No (rata tengah)
            'B' => ['alignment' => ['horizontal' => 'center']], // NIM (rata tengah)
            'C' => ['alignment' => ['horizontal' => 'left']],   // Nama Mahasiswa (rata kiri + auto width)
        ];
         // Atur tinggi baris header (baris pertama)
        $sheet->getRowDimension(1)->setRowHeight(25);

        // Atur lebar kolom tertentu
        $sheet->getColumnDimension('A')->setWidth(5); // Kolom No
        $sheet->getColumnDimension('B')->setWidth(15); // Kolom NIM
        $sheet->getColumnDimension('C')->setAutoSize(true); // Nama Mahasiswa auto width

        // Set auto width untuk kolom jadwal (D dan seterusnya)
        $startColumn = 'D';
        foreach (range(0, count($this->jadwals) - 1) as $index) {
            $col = chr(ord($startColumn) + $index);
            $sheet->getColumnDimension($col)->setWidth(5);
            $styles[$col] = ['alignment' => ['horizontal' => 'center']];
        }

        return $styles;
    }
    // public function styles(Worksheet $sheet)
    // {
    //     $styles = [
    //         1 => [
    //             'font' => ['bold' => true, 'size' => 12],
    //             'alignment' => ['horizontal' => 'center'],
    //         ],
    //         'A' => ['alignment' => ['horizontal' => 'center']],
    //         'B' => ['alignment' => ['horizontal' => 'center']],
    //         'C' => ['alignment' => ['horizontal' => 'left']],
    //     ];

    //     $startColumn = 'D';
    //     foreach (range(0, count($this->jadwals) - 1) as $index) {
    //         $col = chr(ord($startColumn) + $index);
    //         $styles[$col] = ['alignment' => ['horizontal' => 'center']];
    //     }

    //     return $styles;
    // }
}
