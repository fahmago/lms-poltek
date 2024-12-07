import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField';
import SelectField from '../../../../Shared/Fields/SelectField2'; // assuming SelectField2 is reusable

const Create = () => {
    const { errors, kelas } = usePage().props; // Assuming kelas contains available classes

    // State untuk form input
    const [kodeKelas, setKodeKelas] = useState('');  // Selected Kode Kelas
    const [kodeEnroll, setKodeEnroll] = useState(''); // New Kode Enroll input field
    const [isLoading, setIsLoading] = useState(false);

    const storeRegistrasiKelas = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('mhs.reg.store'), {
            kode_kelas: kodeKelas,
            kode_enroll: kodeEnroll,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil melakukan registrasi kelas!',
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
        setKodeKelas('');
        setKodeEnroll('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Registrasi Kelas</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-chalkboard-teacher mr-2"></i> Registrasi Kelas
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeRegistrasiKelas}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                                    {/* Select: Kode Kelas */}
                                    <SelectField
                                        label="Pilih Kelas"
                                        value={kodeKelas}
                                        onChange={(e) => setKodeKelas(e.target.value)}
                                        options={kelas.map((kls) => ({
                                            value: kls.kode_kelas,
                                            label: `${kls.kode_kelas} - ${kls.dosen.user.name} - ${kls.matkul.nama_matkul}(${kls.tahun}-${kls.matkul.semester})`,
                                        }))}
                                        placeholder="Cari atau pilih kelas"
                                        error={errors.kode_kelas}
                                    />

                                    {/* Input: Kode Enroll */}
                                    <InputField
                                        label="Kode Enroll"
                                        type="text"
                                        value={kodeEnroll}
                                        onChange={(e) => setKodeEnroll(e.target.value)}
                                        placeholder="Masukkan Kode Enroll"
                                        error={errors.kode_enroll}
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

export default Create;
