import { Head, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import React, { useState, useEffect, useMemo } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import ToastNotification from '../../../../../Shared/ToastNotification';

const Index = () => {
    const { mahasiswas, flash, angkatans, selectedAngkatan, selectedSort } = usePage().props;
    const [angkatan, setAngkatan] = useState(selectedAngkatan || '');
    const [sort, setSort] = useState(selectedSort || '');

    // Menangani notifikasi flash
    useEffect(() => {
        if (flash?.success) {
            ToastNotification({
                icon: 'success',
                title: flash.success,
                timer: 2000,
            });
        }
        if (flash?.error) {
            ToastNotification({
                icon: 'error',
                title: flash.error,
                timer: 2000,
            });
        }
    }, [flash]);

    // Memoize rows untuk performa
    const rows = useMemo(() => {
        return mahasiswas.data.map((mhs, index) => [
            index + 1 + (mahasiswas.current_page - 1) * mahasiswas.per_page,
            mhs.nim ?? '-',
            <div className="text-left">{mhs.user?.name ?? '-'}</div>,
            <table className="border border-gray-300 text-xs w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1" scope="col">No</th>
                        <th className="border px-2 py-1" scope="col">Kelas</th>
                        <th className="border px-2 py-1 text-red-600" scope="col">Alpha</th>
                        <th className="border px-2 py-1 text-blue-600" scope="col">Izin</th>
                        <th className="border px-2 py-1 text-orange-600" scope="col">Sakit</th>
                    </tr>
                </thead>
                <tbody>
                    {mhs.list_kelas?.length > 0 ? (
                        mhs.list_kelas.map((kelas, idx) => (
                            <tr key={idx}>
                                <td className="border text-center px-2 py-1">{idx + 1}</td>
                                <td className="border px-2 py-1">{kelas.nama ?? '-'}</td>
                                <td className="border text-center px-2 py-1 text-red-600 font-bold">{kelas.alpha ?? 0}</td>
                                <td className="border text-center px-2 py-1 text-blue-600 font-bold">{kelas.izin ?? 0}</td>
                                <td className="border text-center px-2 py-1 text-orange-600 font-bold">{kelas.sakit ?? 0}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="border text-center px-2 py-1">-</td>
                        </tr>
                    )}
                </tbody>
            </table>,
            <span className="text-red-600 font-bold text-xl">{mhs.total_alpha ?? 0}</span>,
            <span className="text-blue-600 font-bold text-xl">{mhs.total_izin ?? 0}</span>,
            <span className="text-orange-600 font-bold text-xl">{mhs.total_sakit ?? 0}</span>,
        ]);
    }, [mahasiswas.data, mahasiswas.current_page, mahasiswas.per_page]);

    // Fungsi untuk menangani perubahan filter sambil mempertahankan semua parameter
    const handleFilterChange = (params) => {
        Inertia.get('/my/harian/status/kehadiran/mahasiswa', {
            angkatan,
            sort,
            q: new URLSearchParams(window.location.search).get('q') || '',
            ...params,
        }, { preserveState: true });
    };

    const handleAngkatanChange = (e) => {
        const tahun = e.target.value;
        setAngkatan(tahun);
        handleFilterChange({ angkatan: tahun });
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSort(val);
        handleFilterChange({ sort: val });
    };

    // Definisikan header sebagai konten, bukan elemen <th>
    const headers = [
        'No.',
        'NIM',
        'Nama Mahasiswa',
        'Kelas',
        <span className="text-red-600 uppercase">Total Alpha</span>,
        <span className="text-blue-600 uppercase">Total Izin</span>,
        <span className="text-orange-600 uppercase">Total Sakit</span>,
    ];

    return (
        <>
            <Head title="eLearning - Status Kehadiran Mahasiswa" />
            <MyLayout>
                <div className="flex flex-col mt-5 gap-3">
                    <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-center">
                        {/* Filter Angkatan */}
                        <div className="w-full md:w-1/4">
                            <label htmlFor="angkatan" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                                Pilih Angkatan
                            </label>
                            <div className="relative">
                                <select
                                    id="angkatan"
                                    value={angkatan}
                                    onChange={handleAngkatanChange}
                                    className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    aria-label="Pilih Angkatan"
                                >
                                    <option value="">-- Pilih Angkatan --</option>
                                    {angkatans?.map((a, idx) => (
                                        <option key={idx} value={a.kode_tahun}>
                                            {a.nama_angkatan} ({a.tahun_angkatan})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Filter Sort */}
                        <div className="w-full md:w-1/4">
                            <label htmlFor="sort" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                                Urutkan Berdasarkan
                            </label>
                            <div className="relative">
                                <select
                                    id="sort"
                                    value={sort}
                                    onChange={handleSortChange}
                                    className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    aria-label="Urutkan Berdasarkan"
                                >
                                    <option value="">-- Urutkan Berdasarkan --</option>
                                    <option value="alpha">Terbanyak Alpha</option>
                                    <option value="izin">Terbanyak Izin</option>
                                    <option value="sakit">Terbanyak Sakit</option>
                                </select>
                            </div>
                        </div>
                        {/* Pencarian */}
                        <div className="w-full md:w-3/4 lg:w-2/4">
                            <Search
                                URL="/my/harian/status/kehadiran/mahasiswa"
                                placeholder="Keyword: [Nama] [Kelas]"
                                additionalParams={{ angkatan, sort }}
                            />
                        </div>
                    </div>
                </div>

                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={mahasiswas}
                    iconClass="fa fa-user-check"
                    title="Data Status Kehadiran Mahasiswa"
                />
            </MyLayout>
        </>
    );
};

export default Index;