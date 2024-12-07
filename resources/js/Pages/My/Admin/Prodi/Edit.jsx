import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState, useEffect } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Edit = () => {
    // destruct props "prodi" and "errors"
    const { prodi, errors } = usePage().props;

    // state
    const [kodeProdi, setKodeProdi] = useState(prodi.kode_prodi || "");
    const [namaProdi, setNamaProdi] = useState(prodi.nama_prodi || "");
    const [isLoading, setIsLoading] = useState(false);

    // method "updateProdi"
    const updateProdi = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.put(route('my.prodis.update', prodi.uuid), {
            kode_prodi: kodeProdi,
            nama_prodi: namaProdi,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil update prodi!',
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
        setKodeProdi(prodi.kode_prodi);
        setNamaProdi(prodi.nama_prodi);
    };

    return (
        <>
            <Head>
                <title>eLearning - Edit Prodi</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-days mr-2"></i> Edit Prodi
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={updateProdi}>
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
                                                <i className="fa fa-save mr-2"></i> Update
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

export default Edit;
