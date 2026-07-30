import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import ButtonSave from '../../../../../Shared/ButtonSave';
import ToastNotification from '../../../../../Shared/ToastNotification';
import SelectField2 from '../../../../../Shared/Fields/SelectField2';

const CreateJadwal = () => {
    const { errors, angkatans } = usePage().props;

    // State untuk form input
    const [tahun, setTahun] = useState('');
    const [bulan, setBulan] = useState('');
    const [semester, setSemester] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Daftar bulan
    const bulanOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }));

    // Daftar semester
    const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
        value: i + 1,
        label: `Semester ${i + 1}`,
    }));

    const storeJadwal = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        Inertia.post(
            route('my.dh.jadwal.store'), // Ganti dengan route Anda
            {
                tahun,
                bulan,
                semester,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    ToastNotification({
                        icon: 'success',
                        title: 'Berhasil menambah jadwal!',
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
        setTahun('');
        setBulan('');
        setSemester('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Jadwal Harian</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-alt mr-2"></i> Tambah Jadwal Harian
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeJadwal}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Select: Tahun */}
                                    <SelectField2
                                        label="Tahun"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun} - ${angkatan.nama_angkatan}`,
                                        }))}
                                        placeholder="Pilih tahun"
                                        error={errors?.tahun}
                                    />

                                    {/* Select: Bulan */}
                                    <SelectField2
                                        label="Bulan"
                                        value={bulan}
                                        onChange={(e) => setBulan(e.target.value)}
                                        options={bulanOptions}
                                        placeholder="Pilih bulan"
                                        error={errors?.bulan}
                                    />

                                    {/* Select: Semester */}
                                    <SelectField2
                                        label="Semester"
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        options={semesterOptions}
                                        placeholder="Pilih semester"
                                        error={errors?.semester}
                                    />
                                </div>

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

export default CreateJadwal;
