import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField'; 
import SelectField from '../../../../Shared/Fields/SelectField';
import TextareaField from '../../../../Shared/Fields/TextareaField';
import ImageUpload from '../../../../Shared/Fields/ImageUpload';
import ToggleSwitch from '../../../../Shared/Fields/ToggleSwitch';

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
    const [imagePreview, setImagePreview] = useState(null);
    const [isLengkap, setIsLengkap] = useState(mahasiswa.is_lengkap || 0);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = () => {
        setIsLengkap(isLengkap === 1 ? 0 : 1);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
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
            },
        });
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
                                    
                                    <InputField
                                        label="NIM"
                                        value={nim}
                                        onChange={(e) => setNim(e.target.value)}
                                        placeholder="Masukkan NIM"
                                        error={errors.nim}
                                    />

                                    <InputField
                                        label="Nama"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Masukkan Nama Mahasiswa"
                                        error={errors.name}
                                    />

                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Masukkan Email"
                                        error={errors.email}
                                    />

                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan Password (Kosongkan jika tidak ingin mengganti)"
                                        error={errors.password}
                                    />

                                    <SelectField
                                        label="Program Studi"
                                        value={kodeProdi}
                                        onChange={(e) => setKodeProdi(e.target.value)}
                                        options={prodis.map((prodi) => ({
                                            value: prodi.kode_prodi,
                                            label: `${prodi.kode_prodi} - ${prodi.nama_prodi}`
                                        }))}
                                        placeholder="Pilih Program Studi"
                                        error={errors.kode_prodi}
                                    />

                                    <SelectField
                                        label="Tahun Angkatan"
                                        value={kodeTahun}
                                        onChange={(e) => setKodeTahun(e.target.value)}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun} - ${angkatan.nama_angkatan}`
                                        }))}
                                        placeholder="Pilih Tahun Angkatan"
                                        error={errors.kode_tahun}
                                    />

                                    
                                    {/* Input: Tempat Lahir */}
                                    <InputField
                                        label="Tempat Lahir"
                                        value={tempatLahir}
                                        onChange={(e) => setTempatLahir(e.target.value)}
                                        placeholder="Masukkan Tempat Lahir"
                                        error={errors.tempat_lahir}
                                    />

                                    {/* Input: Tanggal Lahir */}
                                    <InputField
                                        label="Tanggal Lahir"
                                        type="date"
                                        value={tanggalLahir}
                                        onChange={(e) => setTanggalLahir(e.target.value)}
                                        error={errors.tanggal_lahir}
                                    />

                                    {/* Input: Telepon */}
                                    <InputField
                                        label="Telepon"
                                        type="text"
                                        value={telepon}
                                        onChange={(e) => setTelepon(e.target.value)}
                                        placeholder="Masukkan Nomor Telepon"
                                        error={errors.telepon}
                                    />

                                    {/* Input: Gender */}
                                    <SelectField
                                        label="Gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        options={[
                                            { value: 'L', label: 'Laki-laki' },
                                            { value: 'P', label: 'Perempuan' },
                                        ]}
                                        placeholder="Pilih Gender"
                                    />

                                    {/* Input: Alasan Memilih IDN */}
                                    <TextareaField
                                        label="Alasan Memilih IDN"
                                        value={alasanPilihIDN}
                                        onChange={(e) => setAlasanPilihIDN(e.target.value)}
                                        placeholder="Masukkan alasan"
                                        rows={3}
                                    />                               

                                    {/* Toggle Is Lengkap */}
                                    <ToggleSwitch
                                        value={isLengkap}
                                        onToggle={handleToggle}
                                        labels={{ active: 'Lengkap', inactive: 'Belum Lengkap' }}
                                        size="large"
                                    />

                                    {/* Custom File Input: Gambar */}
                                    <ImageUpload
                                        label="Gambar"
                                        existingImage={mahasiswa.image}
                                        previewImage={imagePreview}
                                        onImageChange={handleImageChange}
                                        error={errors.image}
                                    />

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
