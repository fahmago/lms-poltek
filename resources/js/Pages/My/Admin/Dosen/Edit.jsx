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
    const { errors, prodis, dosen } = usePage().props;

    const [nidn, setNidn] = useState(dosen.nidn || '');
    const [name, setName] = useState(dosen.user.name || '');
    const [email, setEmail] = useState(dosen.user.email || '');
    const [password, setPassword] = useState('');
    const [kodeProdi, setKodeProdi] = useState(dosen.kode_prodi || '');
    const [tempatLahir, setTempatLahir] = useState(dosen.tempat_lahir || '');
    const [tanggalLahir, setTanggalLahir] = useState(dosen.tanggal_lahir || '');
    const [telepon, setTelepon] = useState(dosen.telepon || '');
    const [gender, setGender] = useState(dosen.gender || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLengkap, setIsLengkap] = useState(dosen.is_lengkap || 0);
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

    const storeDosen = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('nidn', nidn);
        formData.append('name', name);
        formData.append('email', email);
        if (password) formData.append('password', password);
        formData.append('kode_prodi', kodeProdi);
        formData.append('tempat_lahir', tempatLahir);
        formData.append('tanggal_lahir', tanggalLahir);
        formData.append('telepon', telepon);
        formData.append('gender', gender);
        formData.append('is_lengkap', isLengkap);

        if (image) {
            formData.append('image', image);
        }

        Inertia.post(route('my.dosens.update', dosen.uuid), formData, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil update dosen!',
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
                <title>eLearning - Edit Dosen</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-user-tie mr-2"></i> Edit Dosen
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeDosen}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        label="NIDN"
                                        value={nidn}
                                        onChange={(e) => setNidn(e.target.value)}
                                        placeholder="Masukkan NIDN"
                                        error={errors.nidn}
                                    />

                                    <InputField
                                        label="Nama"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Masukkan Nama Dosen"
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

                                    <InputField
                                        label="Tempat Lahir"
                                        value={tempatLahir}
                                        onChange={(e) => setTempatLahir(e.target.value)}
                                        placeholder="Masukkan Tempat Lahir"
                                        error={errors.tempat_lahir}
                                    />

                                    <InputField
                                        label="Tanggal Lahir"
                                        type="date"
                                        value={tanggalLahir}
                                        onChange={(e) => setTanggalLahir(e.target.value)}
                                        error={errors.tanggal_lahir}
                                    />

                                    <InputField
                                        label="Telepon"
                                        type="text"
                                        value={telepon}
                                        onChange={(e) => setTelepon(e.target.value)}
                                        placeholder="Masukkan Telepon"
                                        error={errors.telepon}
                                    />

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

                                    {/* Toggle Is Lengkap */}
                                    <ToggleSwitch
                                        value={isLengkap}
                                        onToggle={handleToggle}
                                        labels={{ active: 'Lengkap', inactive: 'Belum Lengkap' }}
                                        size="large"
                                    />

                                    {/* Image Upload */}
                                    <ImageUpload
                                        label="Gambar"
                                        existingImage={dosen.image}
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
