import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import FilterTahunSemester from '../../../../Shared/FilterTahunSemester';
import Search from '../../../../Shared/Search';

export default function Index() {
    const { kelasList, availableYears, filters } = usePage().props;

    const headers = ["No.", "Tahun", "Semester", "Nama Kelas", "Jenis Kelas", "Jumlah Tugas", "Aksi"];

    const rows = kelasList.data.map((kelas, index) => [
        kelasList.from + index,
        `${kelas.tahun}`,
        `${kelas.semester}`,
        kelas.nama_kelas,
        kelas.kategori_kelas_harian.jenis,
        <span className="font-bold text-lg">{kelas.tugas_pekanans_count}</span>,
        (
            <div className="flex justify-center">
                <Link
                    href={route('dsn.tweek.show', { kelasHarian: kelas.uuid })}
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    <i className="fa fa-eye mr-2"></i>Progress
                </Link>
            </div>
        )
    ]);

    return (
        <MyLayout>
            <Head title="Tugas Pekanan per Kelas" />
            {/* <div className="mt-5">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Pilih Kelas untuk Melihat Tugas Pekanan</h1>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelasList}
                    iconClass="fa fa-chalkboard-teacher"
                    title="Daftar Kelas IT Anda"
                />
            </div> */}
            <div className="mb-8">

                {/* --- HEADER SECTION BARU --- */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">

                    {/* BAGIAN KIRI: Judul & Ikon */}
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white text-2xl">
                            <i className="fas fa-hand-holding-hand"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                                Tugas Pekanan
                            </h1>
                            {/* Deskripsi (Opsional, uncomment jika ingin dipakai) */}
                            <p className="text-sm text-gray-500 mt-1">
                                Monitoring progres tugas pekanan mahasiswa Anda.
                            </p>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: Filter Saja */}
                    <div className="w-full xl:w-auto">
                        {/* Saya ubah width-nya menjadi w-full md:w-96.
               md:w-96 (sekitar 384px) cukup lebar agar 2 dropdown (Tahun & Semester)
               terlihat proporsional berdampingan.
            */}
                        <div className="w-full md:w-[440px]">
                            <FilterTahunSemester
                                availableYears={availableYears}
                                filters={filters}
                                url={route('dsn.tweek.index')}
                            />
                        </div>
                    </div>

                </div>
                {/* --------------------------- */}

                {/* KOMPONEN DATATABLE ANDA */}
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelasList}
                    iconClass="fa fa-list-check"
                    title={`Daftar Kelas IT (${filters.tahun ? filters.tahun === 'all' ? 'Semua Tahun' : filters.tahun : 'Semua Tahun'})`}
                />
            </div>
        </MyLayout>
    );
}