import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import ButtonSave from '../../../../../Shared/ButtonSave';
import ToastNotification from '../../../../../Shared/ToastNotification';
import InputField from '../../../../../Shared/Fields/InputField';

const Edit = () => {
    const { kategoriKelasHarian, errors } = usePage().props;

    const [namaKategori, setNamaKategori] = useState(kategoriKelasHarian.nama_kategori || '');
    const [deskripsi, setDeskripsi] = useState(kategoriKelasHarian.deskripsi || '');
    const [isLoading, setIsLoading] = useState(false);

    const updateKategori = (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.put(
            route('my.kategori_kelas_harians.update', kategoriKelasHarian.uuid),
            {
                nama_kategori: namaKategori,
                deskripsi,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    ToastNotification({
                        icon: 'success',
                        title: 'Berhasil memperbarui kategori kelas!',
                        timer: 2000,
                    });
                },
                onError: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <>
            <Head>
                <title>eLearning - Edit Kategori Kelas Harian</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        {/* Header */}
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-edit mr-2"></i> Edit Kategori Kelas Harian
                            </span>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <form onSubmit={updateKategori}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Input: Nama Kategori */}
                                    <InputField
                                        label="Nama Kategori"
                                        type="text"
                                        value={namaKategori}
                                        onChange={(e) => setNamaKategori(e.target.value)}
                                        placeholder="Masukkan nama kategori kelas"
                                        error={errors?.nama_kategori}
                                    />

                                    {/* Textarea: Deskripsi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Deskripsi
                                        </label>
                                        <textarea
                                            value={deskripsi}
                                            onChange={(e) => setDeskripsi(e.target.value)}
                                            placeholder="Masukkan deskripsi kategori"
                                            rows={4}
                                            className={`w-full border ${
                                                errors?.deskripsi
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                            } rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 p-2 text-sm`}
                                        />
                                        {errors?.deskripsi && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.deskripsi}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Tombol Update */}
                                <div className="flex justify-start mt-4">
                                    <ButtonSave type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin mr-2"></i> Updating...
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
