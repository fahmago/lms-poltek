import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import FilterTahunSemester from '../../../../../Shared/FilterTahunSemester';

export default function Index() {
    const { kelasList, availableYears, filters } = usePage().props;

    // GANTI: Teks Header
    const headers = ["No.", "Tahun", "Semester", "Nama Kelas", "Jenis Kelas",  "Jumlah Tugas", "Aksi"];

    const rows = kelasList.data.map((kelas, index) => [
        kelasList.from + index,
        `${kelas.tahun}`,
        `${kelas.semester}`,
        kelas.nama_kelas,
        kelas.kategori_kelas_harian.jenis,
        <span className="font-bold text-lg">{kelas.bukus_count}</span>,
        (
            <div className="flex justify-center">
                <Link
                    // GANTI: route
                    href={route('dsn.buku.show', { kelasHarian: kelas.uuid })}
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    {/* GANTI: Teks Tombol */}
                    <i className="fa fa-eye mr-2"></i>Progress
                </Link>
            </div>
        )
    ]);

    return (
        <MyLayout>
            {/* GANTI: Head title */}
            <Head title="Tugas Buku per Kelas" />
            {/* <div className="mt-5">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Pilih Kelas untuk Melihat Tugas Buku</h1>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelasList}
                    iconClass="fa fa-chalkboard-teacher"
                    title="Daftar Kelas IT Anda"
                />
            </div> */}
            <div className="mb-8">
                
                {/* --- HEADER SECTION --- */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                    
                    {/* BAGIAN KIRI: Judul & Ikon */}
                    <div className="flex items-center gap-5">
                        {/* Icon Box: fa-book untuk Buku */}
                        <div className="w-14 h-14 rounded-xl bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white text-2xl">
                            <i className="fas fa-book"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                                Buku
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Monitoring progres penulisan buku mahasiswa Anda.
                            </p>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: Filter */}
                    <div className="w-full xl:w-auto">
                        <div className="w-full md:w-[440px]">
                            <FilterTahunSemester
                                availableYears={availableYears}
                                filters={filters}
                                url={route('dsn.buku.index')}
                            />
                        </div>
                    </div>

                </div>
                {/* ---------------------- */}

                {/* DATATABLE */}
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelasList}
                    iconClass="fa fa-list-check"
                    title={`Daftar Kelas IT (${(filters.tahun && filters.tahun !== 'all') ? filters.tahun : 'Semua Tahun'})`}
                />
            </div>
        </MyLayout>
    );
}