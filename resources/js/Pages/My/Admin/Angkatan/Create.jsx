import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Create = () => {
    // destruct props "errors"
    const { errors } = usePage().props;

    // state
    const [namaAngkatan, setNamaAngkatan] = useState("");
    const [ketuaAngkatan, setKetuaAngkatan] = useState("");
    const [tahunAngkatan, setTahunAngkatan] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // method "storeAngkatan"
    const storeAngkatan = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.angkatans.store'), {
            nama_angkatan: namaAngkatan,
            ketua_angkatan: ketuaAngkatan,
            tahun_angkatan: tahunAngkatan,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil tambah angkatan!',
                    timer: 2000,
                });
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    // method "resetForm"
    const resetForm = () => {
        setNamaAngkatan("");
        setKetuaAngkatan("");
        setTahunAngkatan("");
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Angkatan</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-days mr-2"></i> Tambah Angkatan Baru
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeAngkatan}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Nama Angkatan</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={namaAngkatan}
                                            onChange={(e) => setNamaAngkatan(e.target.value)}
                                            placeholder="Masukkan Nama Angkatan"
                                        />
                                        {errors.nama_angkatan && (
                                            <p className="text-red-500 text-base mt-1">{errors.nama_angkatan}</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Ketua Angkatan</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={ketuaAngkatan}
                                            onChange={(e) => setKetuaAngkatan(e.target.value)}
                                            placeholder="Masukkan Nama Ketua Angkatan"
                                        />
                                        {errors.ketua_angkatan && (
                                            <p className="text-red-500 text-base mt-1">{errors.ketua_angkatan}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Tahun Angkatan</label>
                                        <input
                                            type="number"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={tahunAngkatan}
                                            onChange={(e) => setTahunAngkatan(e.target.value)}
                                            placeholder="Masukkan Tahun Angkatan"
                                        />
                                        {errors.tahun_angkatan && (
                                            <p className="text-red-500 text-base mt-1">{errors.tahun_angkatan}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-start mt-4">
                                    <ButtonSave type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin mr-2"></i> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-save mr-2"></i> Save
                                            </>
                                        )}
                                    </ButtonSave>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Create;
