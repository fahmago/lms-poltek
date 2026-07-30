import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import MyLayout from '@/Layouts/MyLayout'; // Sesuaikan path jika perlu
import hasAnyPermission from '@/Utilities/Permissions'; // Sesuaikan path jika perlu
import Search from '@/Shared/Search'; // Sesuaikan path jika perlu
import DataTable from '@/Shared/DataTable'; // Sesuaikan path jika perlu
import ToastNotification from '@/Shared/ToastNotification'; // Sesuaikan path jika perlu
import Swal from 'sweetalert2';

// Fungsi stripHtml tidak diperlukan jika Anda menggunakan dangerouslySetInnerHTML
// const stripHtml = (html) => { ... };

const Index = () => {
    const { pertanyaans, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) ToastNotification({ icon: 'success', title: flash.success });
        if (flash?.error) ToastNotification({ icon: 'error', title: flash.error });
    }, [flash]);

    const handleDelete = (uuid) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: "Pertanyaan yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route('my.pertanyaan.ibadah.destroy', { pertanyaan: uuid }), {
                    preserveScroll: true,
                });
            }
        });
    };

    // Definisikan header tabel (DITAMBAH 'Kategori')
    const headers = [
        "No.",
        "Teks Pertanyaan",
        "Tipe",
        "Kategori", // <-- TAMBAHAN KOLOM
        "Wajib",
        "Urutan",
        "Aksi"
    ];

    // Mapping data untuk baris tabel (DITAMBAH 'item.kategori')
    const rows = pertanyaans.data.map((item, index) => [
        pertanyaans.from + index,
        // Ini adalah perbaikan dari kode Anda sebelumnya yang error
        <div dangerouslySetInnerHTML={{ __html: item.teks_pertanyaan }} className='text-left'></div>,
        // item.tipe_pertanyaan,
        item.tipe_pertanyaan === 'pilihan_ganda' ? (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full uppercase">
                Select
            </span>
        ) : (
            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full uppercase">
                Input
            </span>
        ),
        // --- TAMBAHAN DATA KATEGORI ---
        item.kategori === 'haid' ? (
            <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-700 rounded-full uppercase">
                Haid
            </span>
        ) : (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full uppercase">
                Umum
            </span>
        ),
        // --- AKHIR TAMBAHAN ---
        item.wajib_diisi ? 'Ya' : 'Tidak',
        item.urutan,
        (
            <div className="flex justify-center gap-2">
                {hasAnyPermission(['pertanyaan.ibadah.edit']) && (
                    <Link
                        href={route('my.pertanyaan.ibadah.edit', { pertanyaan: item.uuid })}
                        className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
                {hasAnyPermission(['pertanyaan.ibadah.delete']) && (
                    <button
                        onClick={() => handleDelete(item.uuid)}
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                    >
                        <i className="fa fa-trash-alt"></i>
                    </button>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title='eLearning - CRUD Pertanyaan Ibadah' />
            <MyLayout>
                <div className="flex flex-col gap-4">
                    <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-between">

                        {hasAnyPermission(['pertanyaan.ibadah.create']) && (
                            <Link
                                href={route('my.pertanyaan.ibadah.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2"
                            >
                                <i className="fa fa-plus-circle mr-2"></i>
                                Tambah Pertanyaan
                            </Link>
                        )}

                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search
                                URL={route('my.pertanyaan.ibadah.index')}
                                placeholder="Keyword: [Teks Pertanyaan]"
                            />
                        </div>
                    </div>

                    <DataTable
                        headers={headers}
                        rows={rows}
                        pagination={pertanyaans}
                        iconClass="fa fa-question-circle"
                        title="Data Pertanyaan Ibadah"
                    />
                </div>
            </MyLayout>
        </>
    );
};

export default Index;