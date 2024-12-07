import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Edit = () => {
    const { errors, angkatans, prodis, mahasiswa } = usePage().props;

    const [nim, setNim] = useState(mahasiswa.nim || '');
    const [name, setName] = useState(mahasiswa.user.name || '');
    const [email, setEmail] = useState(mahasiswa.user.email || '');
    const [password, setPassword] = useState('');
    const [kodeProdi, setKodeProdi] = useState(mahasiswa.kode_prodi || '');
    const [kodeTahun, setKodeTahun] = useState(mahasiswa.kode_tahun || '');
    const [tempatLahir, setTempatLahir] = useState(mahasiswa.tempat_lahir || '');
    const [tanggalLahir, setTanggalLahir] = useState(mahasiswa.tanggal_lahir || '');
    const [telepon, setTelepon] = useState(mahasiswa.telepon || '');
    const [gender, setGender] = useState(mahasiswa.gender || '');
    const [alasanPilihIDN, setAlasanPilihIDN] = useState(mahasiswa.alasan_pilih_idn || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const [isLengkap, setIsLengkap] = useState(mahasiswa.is_lengkap || 0);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = () => {
        setIsLengkap(isLengkap === 1 ? 0 : 1);
    };

    // Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Preview the selected image
        }
    };

    const storeMahasiswa = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('nim', nim);
        formData.append('name', name);
        formData.append('email', email);
        if (password) formData.append('password', password);
        formData.append('kode_prodi', kodeProdi);
        formData.append('kode_tahun', kodeTahun);
        formData.append('tempat_lahir', tempatLahir);
        formData.append('tanggal_lahir', tanggalLahir);
        formData.append('telepon', telepon);
        formData.append('gender', gender);
        formData.append('alasan_pilih_idn', alasanPilihIDN);
        formData.append('is_lengkap', isLengkap);

        if (image) {
            formData.append('image', image);
        }

        Inertia.post(route('my.mahasiswas.update', mahasiswa.uuid), formData, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil update mahasiswa!',
                    timer: 2000,
                });
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
        setTempatLahir('');
        setTanggalLahir('');
        setTelepon('');
        setGender('');
        setAlasanPilihIDN('');
        setImage(null);
        setImagePreview(null); // Reset image preview
        setIsLengkap(0);
    };

    return (
        <>
            <Head>
                <title>eLearning - Edit Mahasiswa</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-days mr-2"></i> Edit Mahasiswa
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
                                            placeholder="Masukkan Password (Kosongkan jika tidak ingin mengganti)"
                                        />
                                        {errors.password && <p className="text-red-500 text-base mt-1">{errors.password}</p>}
                                    </div>

                                    {/* Select: Kode Prodi */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Program Studi</label>
                                        <select
                                            value={kodeProdi}
                                            onChange={(e) => setKodeProdi(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Pilih Program Studi</option>
                                            {prodis && prodis.map((prodi) => (
                                                <option key={prodi.kode_prodi} value={prodi.kode_prodi}>
                                                    {prodi.kode_prodi} - {prodi.nama_prodi}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kode_prodi && <p className="text-red-500 text-base mt-1">{errors.kode_prodi}</p>}
                                    </div>

                                    {/* Select: Kode Tahun */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Tahun Angkatan</label>
                                        <select
                                            value={kodeTahun}
                                            onChange={(e) => setKodeTahun(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Pilih Tahun Angkatan</option>
                                            {angkatans && angkatans.map((angkatan) => (
                                                <option key={angkatan.kode_tahun} value={angkatan.kode_tahun}>
                                                    {angkatan.kode_tahun} - {angkatan.nama_angkatan}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kode_tahun && <p className="text-red-500 text-base mt-1">{errors.kode_tahun}</p>}
                                    </div>

                                    {/* Input: Tempat Lahir */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Tempat Lahir</label>
                                        <input
                                            type="text"
                                            value={tempatLahir}
                                            onChange={(e) => setTempatLahir(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Masukkan Tempat Lahir"
                                        />
                                    </div>

                                    {/* Input: Tanggal Lahir */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            value={tanggalLahir}
                                            onChange={(e) => setTanggalLahir(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Input: Telepon */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Telepon</label>
                                        <input
                                            type="text"
                                            value={telepon}
                                            onChange={(e) => setTelepon(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.telepon && <p className="text-red-500 text-base mt-1">{errors.telepon}</p>}
                                    </div>

                                    {/* Input: Gender */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Gender</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>

                                    {/* Input: Alasan Memilih IDN */}
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Alasan Memilih IDN</label>
                                        <textarea
                                            value={alasanPilihIDN}
                                            onChange={(e) => setAlasanPilihIDN(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            rows="3"
                                            placeholder="Masukkan alasan"
                                        />
                                    </div>                                    

                                    {/* Toggle Is Lengkap */}
                                    <div className="flex justify-center items-center">
                                        <div className="flex items-center flex-col space-y-3">
                                            <span className="mr-2 text-sm mb-1">{isLengkap ? 'Lengkap' : 'Belum Lengkap'}</span>
                                            <div
                                                onClick={handleToggle}
                                                className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                                                    isLengkap ? 'bg-green-500' : 'bg-gray-300'
                                                }`}
                                            >
                                                <div
                                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                                                        isLengkap ? 'translate-x-6' : ''
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom File Input: Gambar */}
                                    <div className="mb-6">
                                        <div className="flex items-center">
                                            {/* Gambar Lama */}
                                            {mahasiswa.image && (
                                                <div className="mr-4">
                                                    <img
                                                        src={mahasiswa.image}
                                                        alt="Gambar Lama"
                                                        className="w-24 h-auto rounded-lg border border-gray-300"
                                                    />
                                                </div>
                                            )}

                                            {/* Preview Gambar Baru */}
                                            {imagePreview && (
                                                <div className="text-center mx-2">
                                                    <p className="text-sm font-medium text-gray-700">Akan diganti dengan:</p>
                                                </div>
                                            )}

                                            {/* Gambar Baru */}
                                            {imagePreview && (
                                                <div>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Image Preview"
                                                        className="w-24 h-auto rounded-lg ml-4 border border-gray-300"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <label className="block text-base mb-2 font-medium text-gray-700 mt-4">Gambar</label>
                                        <div className="flex items-center">
                                            <label className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-600 transition-colors duration-200">
                                                <i className="fa fa-upload mr-1"></i> Choose File
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                            <span className="ml-3 text-sm text-gray-600">
                                                {image ? image.name : "No file chosen"}
                                            </span>
                                        </div>

                                        {/* Menampilkan error untuk image */}
                                        {errors.image && (
                                            <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                                        )}
                                    </div>

                                </div>

                                <div className="flex justify-end mt-4">
                                    <ButtonSave type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <><i className="fa fa-spinner fa-spin mr-2"></i> Saving...</>
                                        ) : (
                                            <><i className="fa fa-save mr-2"></i> Save Changes</>
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
