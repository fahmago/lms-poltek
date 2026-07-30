import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import InputField from '../../../../Shared/Fields/InputField';
import ToastNotification from '../../../../Shared/ToastNotification';

const Index = () => {
    const { errors } = usePage().props;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State untuk visibilitas password
    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.pw.updatePassword'), {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: confirmPassword, // Sesuaikan key-nya
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Password berhasil diubah!',
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
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const togglePasswordVisibility = (setter, currentState) => {
        setter(!currentState);
    };

    return (
        <>
            <Head>
                <title>eLearning - Ganti Password</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-key mr-2"></i> Ganti Password
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handlePasswordChange}>
                                {/* Input: Password Sekarang */}
                                <div className="relative mb-4">
                                    <InputField
                                        label="Password Sekarang"
                                        type={isCurrentPasswordVisible ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Masukkan password saat ini"
                                        error={errors.current_password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility(setIsCurrentPasswordVisible, isCurrentPasswordVisible)
                                        }
                                        className="absolute top-[36px] right-4 text-gray-600"
                                    >
                                        <i className={`fa ${isCurrentPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>

                                {/* Input: Password Baru */}
                                <div className="relative mb-4">
                                    <InputField
                                        label="Password Baru"
                                        type={isNewPasswordVisible ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Masukkan password baru"
                                        error={errors.new_password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility(setIsNewPasswordVisible, isNewPasswordVisible)
                                        }
                                        className="absolute top-[36px] right-4 text-gray-600"
                                    >
                                        <i className={`fa ${isNewPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>

                                {/* Input: Konfirmasi Password Baru */}
                                <div className="relative mb-4">
                                    <InputField
                                        label="Konfirmasi Password Baru"
                                        type={isConfirmPasswordVisible ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Ulangi password baru"
                                        error={errors.new_password_confirmation}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility(setIsConfirmPasswordVisible, isConfirmPasswordVisible)
                                        }
                                        className="absolute top-[36px] right-4 text-gray-600"
                                    >
                                        <i className={`fa ${isConfirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>

                                <div className="flex justify-start mt-4">
                                    <ButtonSave type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <><i className="fa fa-spinner fa-spin mr-2"></i> Loading...</>
                                        ) : (
                                            <><i className="fa fa-save mr-2"></i> Ganti Password</>
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
