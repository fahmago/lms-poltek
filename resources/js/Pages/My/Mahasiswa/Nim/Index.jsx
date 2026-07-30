import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField';

const Index = () => {
    const { errors } = usePage().props; // Access errors from the backend validation

    const [nim, setNim] = useState(''); // State for NIM
    const [password, setPassword] = useState(''); // State for Password
    const [isLoading, setIsLoading] = useState(false);

    const storeRegistrasiMahasiswa = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('mhs.nim.store'), {
            nim: nim,
            password: password,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil update nim anda!',
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
        setPassword('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Update NIM Mahasiswa</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-id-card-clip mr-2"></i> Update Nim Mahasiswa
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeRegistrasiMahasiswa}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Input: NIM */}
                                    <InputField
                                        label="NIM Mahasiswa"
                                        type="text"
                                        value={nim}
                                        onChange={(e) => setNim(e.target.value)}
                                        placeholder="Masukkan NIM Anda"
                                        error={errors.nim}
                                    />

                                    {/* Input: Password */}
                                    <InputField
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan Password Anda"
                                        error={errors.password}
                                    />
                                </div>

                                <div className="flex justify-start mt-4">
                                    <ButtonSave type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <><i className="fa fa-spinner fa-spin mr-2"></i> Updating...</>
                                        ) : (
                                            <><i className="fa fa-save mr-2"></i> Update</>
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

export default Index;
