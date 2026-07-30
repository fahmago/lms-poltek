import React, { useEffect } from 'react'; // ✅ 1. Import useEffect
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '../../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import Delete from '../../../../../Shared/Delete';
import ToastNotification from '../../../../../Shared/ToastNotification';

const Index = () => {
    const { kategori, flash } = usePage().props;

    // ✅ 2. Gunakan useEffect untuk "mendengarkan" perubahan pada prop 'flash'
    // Ini akan dieksekusi SETELAH komponen re-render dengan prop baru
    useEffect(() => {
        if (flash.success) {
            ToastNotification({
                icon: 'success',
                title: flash.success, // 'flash.success' di sini adalah nilai yang BARU
                timer: 2000
            });
        }
    }, [flash]); // <-- Hook ini akan berjalan setiap kali 'flash' berubah

    // ✅ 3. Sederhanakan fungsi handleToggle
    const handleJenisChange = (item, value) => {
        Inertia.put(route('my.kategori_kelas_harians.update_jenis', item.uuid), { jenis: value }, {
            preserveScroll: true,
        });
    };

    const headers = [
        "No.", "Nama Kategori", "Deskripsi", "Jumlah Kelas", "Jenis", "Actions"
    ];

    const rows = kategori?.data.map((item, index) => [
        index + 1 + (kategori.current_page - 1) * kategori.per_page,
        item.nama_kategori || "-",
        item.deskripsi || "-",
        item.kelas_harians_count || "0",

        (
            <select
                value={item.jenis || ""}
                onChange={(e) => handleJenisChange(item, e.target.value)}
                disabled={!hasAnyPermission(['kategori.kelasharian.edit'])}
                className={`border rounded-md text-sm px-3 py-2 w-32 transition-colors duration-200
                        ${item.jenis === 'IT' ? 'bg-blue-50 border-blue-400 text-blue-700' :
                        item.jenis === 'ENGLISH' ? 'bg-green-50 border-green-400 text-green-700' :
                        item.jenis === 'AGAMA' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' :
                        'bg-white border-gray-300 text-gray-600'}
                        hover:border-blue-500 focus:ring focus:ring-blue-200`}
            >
                <option value="">- Pilih Jenis -</option>
                <option value="IT">IT</option>
                <option value="ENGLISH">ENGLISH</option>
                <option value="AGAMA">AGAMA</option>
            </select>
        ),

        // (
        //     <label className="relative inline-flex items-center cursor-pointer">
        //         <input
        //             type="checkbox"
        //             className="sr-only peer"
        //             checked={item.is_it} 
        //             onChange={() => handleToggle(item)} 
        //             disabled={!hasAnyPermission(['kategori.kelasharian.edit'])} 
        //         />
        //         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        //     </label>
        // ),

        (
            <div className="flex justify-center">
                {hasAnyPermission(['kategori.kelasharian.edit', 'kategori.kelasharian.delete']) ? (
                    <>
                        {hasAnyPermission(['kategori.kelasharian.edit']) && (
                            <Link
                                href={route('my.kategori_kelas_harians.edit', item.uuid)}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                            >
                                <i className="fa fa-pencil-alt"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['kategori.kelasharian.delete']) && (
                            <Delete URL={'/my/kategori-kelas-harian'} id={item.uuid} />
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
            <Head title="eLearning - Kategori Kelas Harian" />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['kategori.kelasharian.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['kategori.kelasharian.create']) && (
                            <Link
                                href={route('my.kategori_kelas_harians.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Tambah Kategori
                            </Link>
                        )}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/kategori-kelas-harian'} placeholder='Keyword: [Nama Kategori] [Deskripsi]' />
                        </div>
                    </div>
                </div>

                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kategori}
                    iconClass="fa fa-layer-group"
                    title="Data Kategori Kelas Harian"
                />
            </MyLayout>
        </>
    );
};

export default Index;