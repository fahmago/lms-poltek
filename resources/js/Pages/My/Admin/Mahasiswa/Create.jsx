import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Create = () => {
    // destruct props "errors", "angkatans", "prodis", and "roles"
    const { errors, angkatans, prodis, roles } = usePage().props;

    // state for form inputs
    const [nim, setNim] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [kodeProdi, setKodeProdi] = useState('');
    const [kodeTahun, setKodeTahun] = useState('');
    const [role, setRole] = useState('mahasiswa');
    const [isLoading, setIsLoading] = useState(false);

    const storeMahasiswa = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.mahasiswas.store'), {
            nim,
            name,
            email,
            password,
            kode_prodi: kodeProdi,
            kode_tahun: kodeTahun,
            role, // Passing the selected role to the backend
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil tambah mahasiswa!',
                    timer: 2000,
                });
                resetForm();
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    const resetForm = () => {
        setNim('');
        setName('');
        setEmail('');
        setPassword('');
        setKodeProdi('');
        setKodeTahun('');
        setRole('mahasiswa'); // Reset the role to default
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Mahasiswa</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-days mr-2"></i> Tambah Mahasiswa Baru
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeMahasiswa}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Input: NIM */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">NIM</label>
                                        <input
                                            type="text"
                                            value={nim}
                                            onChange={(e) => setNim(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Masukkan NIM"
                                        />
                                        {errors.nim && <p className="text-red-500 text-base mt-1">{errors.nim}</p>}
                                    </div>

                                    {/* Input: Nama */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Nama</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Masukkan Nama Mahasiswa"
                                        />
                                        {errors.name && <p className="text-red-500 text-base mt-1">{errors.name}</p>}
                                    </div>

                                    {/* Input: Email */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Masukkan Email"
                                        />
                                        {errors.email && <p className="text-red-500 text-base mt-1">{errors.email}</p>}
                                    </div>

                                    {/* Input: Password */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Masukkan Password"
                                        />
                                        {errors.password && <p className="text-red-500 text-base mt-1">{errors.password}</p>}
                                    </div>

                                    {/* Select: Kode Prodi */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Kode Prodi</label>
                                        <select
                                            value={kodeProdi}
                                            onChange={(e) => setKodeProdi(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Pilih Kode Prodi</option>
                                            {prodis.map((prodi) => (
                                                <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                                    {prodi.nama_prodi}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kode_prodi && <p className="text-red-500 text-base mt-1">{errors.kode_prodi}</p>}
                                    </div>

                                    {/* Select: Kode Tahun */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Kode Tahun</label>
                                        <select
                                            value={kodeTahun}
                                            onChange={(e) => setKodeTahun(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Pilih Kode Tahun</option>
                                            {angkatans.map((angkatan) => (
                                                <option key={angkatan.kode_tahun} value={angkatan.kode_tahun}>
                                                    {angkatan.nama_angkatan} ({angkatan.kode_tahun})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kode_tahun && <p className="text-red-500 text-base mt-1">{errors.kode_tahun}</p>}
                                    </div>

                                    {/* Select: Role */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Role</label>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Pilih Role</option>
                                            {roles.map((roleItem) => (
                                                <option key={roleItem.name} value={roleItem.name}>
                                                    {roleItem.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && <p className="text-red-500 text-base mt-1">{errors.role}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-start mt-4">
                                    <ButtonSave type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <><i className="fa fa-spinner fa-spin mr-2"></i> Saving...</>
                                        ) : (
                                            <><i className="fa fa-save mr-2"></i> Save</>
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
