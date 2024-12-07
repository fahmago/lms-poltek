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
    const [kodeProdi, setKodeProdi] = useState("");
    const [namaProdi, setNamaProdi] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // method "storeProdi"
    const storeProdi = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.prodis.store'), {
            kode_prodi: kodeProdi,
            nama_prodi: namaProdi,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil tambah prodi!',
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
        setKodeProdi("");
        setNamaProdi("");
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Prodi</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-days mr-2"></i> Tambah Prodi Baru
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeProdi}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Kode Prodi</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={kodeProdi}
                                            onChange={(e) => setKodeProdi(e.target.value)}
                                            placeholder="Masukkan Kode Prodi"
                                        />
                                        {errors.kode_prodi && (
                                            <p className="text-red-500 text-base mt-1">{errors.kode_prodi}</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Nama Prodi</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={namaProdi}
                                            onChange={(e) => setNamaProdi(e.target.value)}
                                            placeholder="Masukkan Nama Prodi"
                                        />
                                        {errors.nama_prodi && (
                                            <p className="text-red-500 text-base mt-1">{errors.nama_prodi}</p>
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
