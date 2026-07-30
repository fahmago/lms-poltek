import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '../../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import Delete from '../../../../../Shared/Delete';
import FilterKelas from './Partials/FilterKelas';

const Index3 = () => {
    const { kelas, kategoriList, tahunList, semesterList, filters } = usePage().props;

    // State filter
    const [filterTahun, setFilterTahun] = useState(filters.tahun || '');
    const [filterSemester, setFilterSemester] = useState(filters.semester || '');
    const [filterKategori, setFilterKategori] = useState(filters.kategori || '');

    // Modal cetak
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBulan, setSelectedBulan] = useState('');
    const [selectedTahun, setSelectedTahun] = useState('');
    const [selectedKelas, setSelectedKelas] = useState(null);

    const bulanOptions = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    // Fungsi filter
    const handleFilter = () => {
        Inertia.visit(route('my.dh.kelas.index'), {
            method: 'get',
            data: {
                tahun: filterTahun,
                semester: filterSemester,
                kategori: filterKategori,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Fungsi reset filter
    const handleReset = () => {
        setFilterTahun('');
        setFilterSemester('');
        setFilterKategori('');
        Inertia.visit(route('my.dh.kelas.index'), {
            method: 'get',
            preserveState: false,
        });
    };

    // Fungsi cetak
    const handlePrint = () => {
        if (selectedBulan) {
            let bulan = selectedTahun + '-' + selectedBulan;
            window.open(route('my.dh.kelas.printAbsensiKelas', { uuid: selectedKelas, month: bulan }), '_blank');
            setIsModalOpen(false);
        }
    };

    // Header tabel
    const headers = [
        'No.', 'Tahun', 'Enroll', 'Kode', 'Semester', 'Kategori', 'Kelas', 'Pengajar', 'Mahasiswa', 'Actions'
    ];

    // Baris tabel
    const rows = kelas?.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun || '-',
        kls.kode_enroll || '-',
        kls.kode_kelas_harian || '-',
        kls.semester || '-',
        kls.kategori_kelas_harian?.nama_kategori || '-',
        kls.nama_kelas || '-',
        kls.dosen?.user?.name || '-',
        kls.kelas_harian_mahasiswas_count || '0',
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dh.kelas.edit', 'dh.kelas.delete', 'dh.kelas.print']) ? (
                    <>
                        {hasAnyPermission(['dh.kelas.edit']) && (
                            <Link
                                href={route('my.dh.kelas.edit', kls.uuid)}
                                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 me-2 transition"
                            >
                                <i className="fa fa-pencil-alt"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['dh.kelas.delete']) && (
                            <Delete URL={'/my/harian/kelas_harian'} id={kls.uuid} />
                        )}
                        {hasAnyPermission(['dh.kelas.print']) && (
                            <button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setSelectedKelas(kls.uuid);
                                    setSelectedTahun(kls.tahun);
                                }}
                                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2.5 me-2 transition"
                            >
                                <i className="fa fa-print"></i>
                            </button>
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title="eLearning - Data Kelas" />
            <MyLayout>
                <div className="flex flex-col space-y-6">                    

                    {/* Tombol tambah + search */}
                    <div className={`w-full flex flex-col md:flex-row gap-3 items-center ${hasAnyPermission(['dh.kelas.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['dh.kelas.create']) && (
                            <Link
                                href={route('my.dh.kelas.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 transition"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Kelas Harian
                            </Link>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/harian/kelas_harian'} placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Pengajar]" />
                        </div>
                    </div>

                    {/* ✅ Komponen Filter */}
                    <FilterKelas
                        tahunList={tahunList || []}
                        semesterList={semesterList || []}
                        kategoriList={kategoriList || []}
                        filterTahun={filterTahun}
                        setFilterTahun={setFilterTahun}
                        filterSemester={filterSemester}
                        setFilterSemester={setFilterSemester}
                        filterKategori={filterKategori}
                        setFilterKategori={setFilterKategori}
                        handleFilter={handleFilter}
                        handleReset={handleReset}
                    />

                    {/* Data Table */}
                    <DataTable
                        headers={headers}
                        rows={rows}
                        pagination={kelas}
                        iconClass="fa fa-chalkboard-teacher"
                        title="Data Kelas Harian"
                    />

                    {/* Modal Cetak */}
                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                            <div className="bg-white w-96 rounded-lg shadow-xl p-6">
                                <div className="mb-4 border-b pb-2 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold">Pilih Bulan</h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-1">
                                        Bulan
                                    </label>
                                    <select
                                        id="bulan"
                                        className="block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={selectedBulan}
                                        onChange={(e) => setSelectedBulan(e.target.value)}
                                    >
                                        <option value="">Pilih Bulan</option>
                                        {bulanOptions.map((bulan) => (
                                            <option key={bulan.value} value={bulan.value}>
                                                {bulan.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Cetak
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </MyLayout>
        </>
    );
};

export default Index3;
