import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import ButtonSave from '../../../../../Shared/ButtonSave';
import ToastNotification from '../../../../../Shared/ToastNotification';
import InputField from '../../../../../Shared/Fields/InputField';

const Create = () => {
    const { errors } = usePage().props;

    // State form
    const [namaKategori, setNamaKategori] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const storeKategori = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(
            route('my.kategori_kelas_harians.store'),
            {
                nama_kategori: namaKategori,
                deskripsi,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    ToastNotification({
                        icon: 'success',
                        title: 'Berhasil menambah kategori kelas!',
                        timer: 2000,
                    });
                    resetForm();
                },
                onError: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    const resetForm = () => {
        setNamaKategori('');
        setDeskripsi('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Kategori Kelas Harian</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        {/* Header */}
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-layer-group mr-2"></i> Tambah Kategori Kelas Harian
                            </span>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <form onSubmit={storeKategori}>
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
                                            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm`}
                                        />
                                        {errors?.deskripsi && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.deskripsi}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Tombol Simpan */}
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
