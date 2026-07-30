import { Head, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import ToastNotification from '../../../../../Shared/ToastNotification';

const Index = () => {
    const { mahasiswas, flash } = usePage().props;

    if (flash?.success) {
        ToastNotification({
            icon: 'success',
            title: flash.success,
            timer: 2000
        });
    }

    const headers = ["No.", "NIM", "Nama Mahasiswa", "Kelas", <span className="text-red-600 uppercase">Total Alpha</span>, <span className="text-blue-600 uppercase">Total Izin</span>, <span className="text-orange-600 uppercase">Total Sakit</span>];

    const rows = mahasiswas.data.map((mhs, index) => [
        index + 1 + (mahasiswas.current_page - 1) * mahasiswas.per_page,
        mhs.nim ?? "-",
        <div className="text-left">{mhs.user.name ?? "-"}</div>, 
        <table className="border border-gray-300 text-xs w-full">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 py-1">No</th>
                    <th className="border border-gray-300 px-2 py-1">Kelas</th>
                    <th className="border border-gray-300 px-2 py-1 text-red-600">Alpha</th>
                    <th className="border border-gray-300 px-2 py-1 text-blue-600">Izin</th>
                    <th className="border border-gray-300 px-2 py-1 text-orange-600">Sakit</th>
                </tr>
            </thead>
            <tbody>
                {mhs.list_kelas?.map((kelas, idx) => (
                    <tr key={idx}>
                        <td className="border border-gray-300 text-center px-2 py-1">{idx + 1}</td>
                        <td className="border border-gray-300 px-2 py-1">{kelas.nama}</td>
                        <td className="border border-gray-300 text-center px-2 py-1 text-red-600 font-bold">{kelas.alpha}</td>
                        <td className="border border-gray-300 text-center px-2 py-1 text-blue-600 font-bold">{kelas.izin}</td>
                        <td className="border border-gray-300 text-center px-2 py-1 text-orange-600 font-bold">{kelas.sakit}</td>
                    </tr>
                ))}
            </tbody>
        </table>,
        <span className="text-red-600 font-bold text-xl">{mhs.total_alpha}</span>,
        <span className="text-blue-600 font-bold text-xl">{mhs.total_izin}</span>,
        <span className="text-orange-600 font-bold text-xl">{mhs.total_sakit}</span>
    ]);

    return (
        <>
            <Head title="eLearning - Status Kehadiran Mahasiswa" />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-center">
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/harian/status/kehadiran/mahasiswa'} 
                                placeholder="Keyword: [Nama] [NIM] [Kelas]" 
                            />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={mahasiswas}
                    iconClass="fa fa-user-check"
                    title="Data Kehadiran Mahasiswa (Sakit, Alpha, Izin)"
                />
            </MyLayout>
        </>
    );
};

export default Index;
