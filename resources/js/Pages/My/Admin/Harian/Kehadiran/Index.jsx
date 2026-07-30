import { Head, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import React, { useState, useEffect, useMemo } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import ToastNotification from '../../../../../Shared/ToastNotification';

const Index = () => {
    const { mahasiswas, flash, angkatans, filters } = usePage().props;

    const [filterState, setFilterState] = useState({
        angkatan: filters.angkatan || '',
        sort: filters.sort || '',
        semester: filters.semester || '',
        q: filters.q || ''
    });

    useEffect(() => {
        if (flash?.success) {
            ToastNotification({ icon: 'success', title: flash.success, timer: 2000 });
        }
        if (flash?.error) {
            ToastNotification({ icon: 'error', title: flash.error, timer: 2000 });
        }
    }, [flash]);

    // SINKRONISASI: Pastikan state selalu sama dengan props dari server
    useEffect(() => {
        setFilterState({
            angkatan: filters.angkatan || '',
            sort: filters.sort || '',
            semester: filters.semester || '',
            q: filters.q || ''
        });
    }, [filters]);

    const rows = useMemo(() => {
        return mahasiswas.data.map((mhs, index) => [
            index + 1 + (mahasiswas.current_page - 1) * mahasiswas.per_page,
            mhs.nim ?? '-',
            <div key={`name-${mhs.id}`} className="text-left">{mhs.user?.name ?? '-'}</div>,
            <table key={`table-${mhs.id}`} className="border border-gray-300 text-xs w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">No</th>
                        <th className="border px-2 py-1">Kelas</th>
                        <th className="border px-2 py-1 text-red-600">Alpha</th>
                        <th className="border px-2 py-1 text-blue-600">Izin</th>
                        <th className="border px-2 py-1 text-orange-600">Sakit</th>
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
            <span key={`alpha-${mhs.id}`} className="text-red-600 font-bold text-xl">{mhs.total_alpha ?? 0}</span>,
            <span key={`izin-${mhs.id}`} className="text-blue-600 font-bold text-xl">{mhs.total_izin ?? 0}</span>,
            <span key={`sakit-${mhs.id}`} className="text-orange-600 font-bold text-xl">{mhs.total_sakit ?? 0}</span>,
        ]);
    }, [mahasiswas.data, mahasiswas.current_page, mahasiswas.per_page]);

    const handleFilterChange = (key, value) => {
        Inertia.get('/my/harian/status/kehadiran/mahasiswa', {
            ...filterState,
            [key]: value,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const headers = [
        'No.', 'NIM', 'Nama Mahasiswa', 'Rekap Kelas',
        <span key="h-alpha" className="text-red-600 uppercase">Total Alpha</span>,
        <span key="h-izin" className="text-blue-600 uppercase">Total Izin</span>,
        <span key="h-sakit" className="text-orange-600 uppercase">Total Sakit</span>,
    ];

    return (
        <>
            <Head title="eLearning - Status Kehadiran Mahasiswa" />
            <MyLayout>
                <div className="flex flex-col mt-5 gap-3">
                    <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-center">
                        <div className="w-full md:w-auto">
                            <select
                                id="angkatan" value={filterState.angkatan} onChange={(e) => handleFilterChange('angkatan', e.target.value)}
                                className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                            >
                                <option value="">-- Semua Angkatan --</option>
                                {angkatans?.map((a) => (
                                    <option key={a.kode_tahun} value={a.kode_tahun}>
                                        {a.nama_angkatan} ({a.tahun_angkatan})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <select
                                id="semester" value={filterState.semester} onChange={(e) => handleFilterChange('semester', e.target.value)}
                                className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                            >
                                <option value="">-- Semua Semester --</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                    <option key={sem} value={sem}>Semester {sem}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-auto">
                            <select
                                id="sort" value={filterState.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                            >
                                <option value="">-- Urutkan Default --</option>
                                <option value="alpha">Terbanyak Alpha</option>
                                <option value="izin">Terbanyak Izin</option>
                                <option value="sakit">Terbanyak Sakit</option>
                            </select>
                        </div>
                        <div className="w-full md:w-3/4 lg:w-2/4">
                            <Search
                                URL="/my/harian/status/kehadiran/mahasiswa"
                                placeholder="Keyword: [Nama Mahasiswa] [Kelas]"
                                initialValue={filterState.q}
                                additionalParams={{ angkatan: filterState.angkatan, sort: filterState.sort, semester: filterState.semester }}
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