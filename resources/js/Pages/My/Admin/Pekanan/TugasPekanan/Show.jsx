import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '@/Layouts/MyLayout';
import DataTable from '@/Shared/DataTable';
import formatDate from '@/Utilities/formatDateTime';
import hasAnyPermission from '@/Utilities/Permissions';
import ToastNotification from '@/Shared/ToastNotification';
import Delete from '../../../../../Shared/Delete';

const Show = () => {
    const { prodi, tugasPekanans, flash } = usePage().props;
    useEffect(() => {
        if (flash?.success) {
            ToastNotification({
                icon: 'success',
                title: flash.success
            });
        }
        if (flash?.error) {
            ToastNotification({
                icon: 'error',
                title: flash.error
            });
        }
    }, [flash]);

    const headers = ["No.", "Judul Tugas", "Tipe", "Waktu Mulai", "Batas Waktu", "Jum. Kelas", "Progress", "Aksi"];

    const rows = tugasPekanans.data.map((tugas, index) => [
        tugasPekanans.from + index,
        tugas.judul,
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tugas.tipe_tugas === 'yt' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            {tugas.tipe_tugas === 'yt' ? 'YouTube' : 'Link Umum'}
        </span>,
        formatDate(tugas.waktu_mulai,{ includeTime: false }),
        formatDate(tugas.batas_waktu,{ includeTime: false }),
        <span className="font-mono text-center block">{tugas.kelas_harians_count} Kelas</span>,
        (
            <div className="w-full">
                <div className="flex items-center justify-between text-xs mb-1">
                    <span>{tugas.progress.total_submissions}/{tugas.progress.total_students}</span>
                    <span className="font-medium text-gray-700">{tugas.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${tugas.progress.percentage >= 80
                                ? 'bg-green-500'
                                : tugas.progress.percentage >= 50
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                            }`}
                        style={{ width: `${tugas.progress.percentage}%` }}
                    ></div>
                </div>
            </div>
        ),
        (
            <div className="flex justify-center gap-2">
                {hasAnyPermission(['pekanan.show']) && (
                    <Link href={route('my.tweek.detail', tugas.uuid)} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5">
                        <i className="fa fa-eye"></i>
                    </Link>
                )}
                {hasAnyPermission(['pekanan.edit']) && (
                    <Link href={route('my.tweek.edit', tugas.uuid)} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-4 py-2" title="Edit Tugas">
                        <i className="fa fa-edit"></i>
                    </Link>
                )}
                {hasAnyPermission(['pekanan.delete']) && (
                    <Delete URL={'/my/tweek/task'} id={tugas.uuid} />
                )}
            </div>
        )
    ]);

    return (
        <MyLayout>
            <Head title={`Tugas Pekanan - ${prodi.nama_prodi}`} />

            <div className="flex justify-between items-center mt-5 mb-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    Tugas Pekanan: <span className="text-blue-600">{prodi.nama_prodi}</span>
                </h1>
                <Link href={route('my.tweek.index')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <i className="fa fa-arrow-left mr-2"></i>
                    Kembali ke Daftar Prodi
                </Link>
            </div>

            <DataTable
                headers={headers}
                rows={rows}
                pagination={tugasPekanans}
                iconClass="fa fa-tasks"
                title={`Daftar Tugas Pekanan`}
            />
        </MyLayout>
    );
};

export default Show;