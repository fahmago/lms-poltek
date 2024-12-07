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

const Index = () => {
    const { errors, angkatans, prodis, mahasiswa, flash, title} = usePage().props;

    const [telepon, setTelepon] = useState(mahasiswa.telepon || '');
    const [tempatLahir, setTempatLahir] = useState(mahasiswa.tempat_lahir || '');
    const [tanggalLahir, setTanggalLahir] = useState(mahasiswa.tanggal_lahir || '');
    const [gender, setGender] = useState(mahasiswa.gender || '');
    const [alasanPilihIDN, setAlasanPilihIDN] = useState(mahasiswa.alasan_pilih_idn || '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
        formData.append('telepon', telepon);
        formData.append('tempat_lahir', tempatLahir);
        formData.append('tanggal_lahir', tanggalLahir);
        formData.append('gender', gender);
        formData.append('alasan_pilih_idn', alasanPilihIDN);

        if (image) {
            formData.append('image', image);
        }

        Inertia.post(route('mhs.profil.update', mahasiswa.uuid), formData, {
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
            <Head title={`Profil Mahasiswa - ${mahasiswa.user.name}`} />
            <MyLayout>
                {flash.warning && (
                    <div className="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
                        <i className="fa fa-exclamation-triangle mr-2"></i>
                        <span className="sr-only">Info</span>
                    <div>
                      <span className="font-medium">{flash.warning}</span>
                    </div>
                  </div>
                )}
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-user-graduate mr-2"></i> {title ?? "My Profile"}
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeMahasiswa}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Field ReadOnly */}
                                    <InputField label="NIM" value={mahasiswa.nim} readOnly />
                                    <InputField label="Nama" value={mahasiswa.user.name} readOnly />
                                    <InputField label="Email" value={mahasiswa.user.email} readOnly />
                                    
                                    <SelectField
                                        label="Program Studi"
                                        value={mahasiswa.kode_prodi}
                                        options={prodis.map((prodi) => ({
                                            value: prodi.kode_prodi,
                                            label: `${prodi.kode_prodi} - ${prodi.nama_prodi}`,
                                        }))}
                                        disabled
                                    />

                                    <SelectField
                                        label="Tahun Angkatan"
                                        value={mahasiswa.kode_tahun}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun} - ${angkatan.nama_angkatan}`,
                                        }))}
                                        disabled
                                    />

                                    {/* Field yang dapat diubah */}
                                    <InputField
                                        label="Telepon"
                                        value={telepon}
                                        onChange={(e) => setTelepon(e.target.value)}
                                        placeholder="Masukkan Nomor Telepon"
                                        error={errors.telepon}
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

                                    <SelectField
                                        label="Gender"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        options={[
                                            { value: 'L', label: 'Laki-laki' },
                                            { value: 'P', label: 'Perempuan' },
                                        ]}
                                        placeholder="Pilih Gender"
                                        error={errors.gender}
                                    />

                                    <TextareaField
                                        label="Alasan Memilih IDN"
                                        value={alasanPilihIDN}
                                        onChange={(e) => setAlasanPilihIDN(e.target.value)}
                                        placeholder="Masukkan alasan"
                                        rows={4}
                                        error={errors.alasan_pilih_idn}
                                    />

                                    <ImageUpload
                                        label="Gambar"
                                        existingImage={mahasiswa.image}
                                        previewImage={imagePreview}
                                        onImageChange={handleImageChange}
                                        error={errors.image}
                                    />
                                </div>
                                <div className="flex justify-end mt-4">
                                        {mahasiswa.is_lengkap ? (
                                            <>
                                                <button type="button" className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mx-auto">
                                                    <i className="fa fa-check mr-2"></i> Data Sudah Lengkap, Hubungi admin untuk perubahan data
                                                </button>
                                            </>
                                        ) : (
                                            <ButtonSave type="submit" disabled={isLoading}>
                                                {isLoading ? (
                                                    <><i className="fa fa-spinner fa-spin mr-2"></i> Saving...</>
                                                ) : (
                                                    <><i className="fa fa-save mr-2"></i> Save Changes</>
                                                )}
                                            </ButtonSave>
                                        )}                                    
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Index;
