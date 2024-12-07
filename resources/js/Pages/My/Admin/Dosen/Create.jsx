import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField'; 
import SelectField from '../../../../Shared/Fields/SelectField';

const CreateDosen = () => {
    // destruct props "errors", "prodis", and "roles"
    const { errors, prodis, roles } = usePage().props;

    // state for form inputs
    const [nidn, setNidn] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [kodeProdi, setKodeProdi] = useState('');
    const [role, setRole] = useState('dosen'); // default role
    const [isLoading, setIsLoading] = useState(false);

    const storeDosen = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.dosens.store'), {
            nidn,
            name,
            email,
            password,
            kode_prodi: kodeProdi,
            role,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil tambah dosen!',
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
        setNidn('');
        setName('');
        setEmail('');
        setPassword('');
        setKodeProdi('');
        setRole('dosen'); // Reset the role to default
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Dosen</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-user-tie mr-2"></i> Tambah Dosen Baru
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeDosen}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Input: NIDN */}
                                    <InputField
                                        label="NIDN"
                                        type="text"
                                        value={nidn}
                                        onChange={(e) => setNidn(e.target.value)}
                                        placeholder="Masukkan Nidn"
                                        error={errors.nidn}
                                    />

                                    {/* Input: Nama */}
                                    <InputField
                                        label="Nama"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Masukkan Nama Pengajar"
                                        error={errors.name}
                                    />

                                    {/* Input: Email */}
                                    <InputField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Masukkan Email Pengajar"
                                        error={errors.email}
                                    />

                                    {/* Input: Password */}
                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan Password"
                                        error={errors.password}
                                    />

                                    {/* Select: Kode Prodi */}
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

                                    {/* Select: Role */}
                                    <SelectField
                                        label="Role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        options={roles.map((roleItem) => ({
                                            value: roleItem.name,
                                            label: `${roleItem.name}`
                                        }))}
                                        placeholder="Pilih Role"
                                        error={errors.role}
                                    />
                                    
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

export default CreateDosen;
