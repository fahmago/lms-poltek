import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect, useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '@/Layouts/MyLayout';
import hasAnyPermission from '@/Utilities/Permissions';
import Search from '@/Shared/Search';
import DataTable from '@/Shared/DataTable';
import ToastNotification from '@/Shared/ToastNotification';
import TugasPekananFilter from './KomponenPekanan/TugasPekananFilter';

const Index = () => {
    const { prodis, angkatans, currentFilters, flash } = usePage().props;

    // State filter awal
    const [filters, setFilters] = useState({
        tahun_angkatan: currentFilters.tahun_angkatan || '',
        semester: currentFilters.semester || '',
    });

    // Ref untuk mendeteksi render pertama
    const isFirstRender = useRef(true);

    // Notifikasi flash message
    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    // Jalankan Inertia GET hanya setelah render pertama
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            // Cegah kirim request jika semua filter kosong
            if (!filters.tahun_angkatan && !filters.semester) {
                Inertia.get(route('my.tweek.index'), {}, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
                return;
            }

            // Kirim request jika filter diisi
            Inertia.get(route('my.tweek.index'), filters, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer);
    }, [filters]);

    // Reset filter ke keadaan awal
    const handleReset = () => {
        setFilters({ tahun_angkatan: '', semester: '' });
        Inertia.get(route('my.tweek.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const headers = ["No.", "Kode Prodi", "Nama Prodi", "Total Tugas", "Progress", "Aksi"];

    const rows = prodis.data.map((prodi, index) => [
        prodis.from + index,
        prodi.kode_prodi,
        prodi.nama_prodi,
        prodi.tugas_pekanans_count,
        (
            <div className="flex justify-center">
                <div className="w-40 backdrop-blur-md bg-white/50 border border-white/30 rounded-xl p-2 shadow-sm">
                    <div className="flex justify-between text-[11px] text-gray-600 mb-1">
                        <span>{prodi.progress.total_submissions}/{prodi.progress.total_students}</span>
                        <span className="font-semibold">{prodi.progress.percentage}%</span>
                    </div>
                    <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-700 ${
                                prodi.progress.percentage >= 80
                                    ? 'bg-green-400 shadow-[0_0_6px_#22c55e]'
                                    : prodi.progress.percentage >= 50
                                    ? 'bg-yellow-400 shadow-[0_0_6px_#facc15]'
                                    : 'bg-red-400 shadow-[0_0_6px_#ef4444]'
                            }`}
                            style={{ width: `${prodi.progress.percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        ),
        (
            <div className="flex justify-center">
                {hasAnyPermission(['pekanan.show']) && (
                    <Link
                        href={route('my.tweek.show', { uuid: prodi.uuid })}
                        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                    >
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title='eLearning - Tugas Pekanan Prodi' />
            <MyLayout>
                <div className="flex flex-col ">
                    <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-between">
                        {hasAnyPermission(['pekanan.create']) && (
                            <Link
                                href={route('my.tweek.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Tugas Pekanan Baru
                            </Link>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search
                                URL={route('my.tweek.index')}
                                placeholder="Keyword: [Kode Prodi] [Nama Prodi]"
                            />
                        </div>
                    </div>

                    {/* Komponen Filter */}
                    <TugasPekananFilter
                        filters={filters}
                        setFilters={setFilters}
                        angkatans={angkatans}
                        onReset={handleReset}
                    />
                </div>

                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={prodis}
                    iconClass="fa fa-building-columns"
                    title="Data Prodi"
                />
            </MyLayout>
        </>
    );
};

export default Index;
