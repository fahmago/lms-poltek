import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import SelectField2 from '../../../../Shared/Fields/SelectField2';
import InputField from '../../../../Shared/Fields/InputField';

const Create = () => {
    const { errors, angkatans } = usePage().props;

    const [semester, setSemester] = useState('');
    const [tahun, setTahun] = useState('');
    const [jumlahPertemuan, setJumlahPertemuan] = useState('');
    const [startDate, setStartDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const storeJadwal = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.jadwal.store'), {
            semester,
            kode_tahun: tahun,
            start_date: startDate,
            jumlah_pertemuan: jumlahPertemuan,
        }, {
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
            }
        });
    };

    const resetForm = () => {
        setSemester('');
        setTahun('');
        setJumlahPertemuan('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Jadwal</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar mr-2"></i> Tambah Jadwal
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeJadwal}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Select: Tahun (from Angkatan model) */}
                                    <SelectField2
                                        label="Tahun"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun} - ${angkatan.nama_angkatan}`,
                                        }))}
                                        placeholder="Pilih Tahun"
                                        error={errors.kode_tahun}
                                    />

                                    {/* Select: Semester */}
                                    <SelectField2
                                        label="Semester"
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        options={[
                                            { value: 1, label: 'Semester 1' },
                                            { value: 2, label: 'Semester 2' },
                                            { value: 3, label: 'Semester 3' },
                                            { value: 4, label: 'Semester 4' },
                                            { value: 5, label: 'Semester 5' },
                                            { value: 6, label: 'Semester 6' },
                                            { value: 7, label: 'Semester 7' },
                                            { value: 8, label: 'Semester 8' },
                                        ]}
                                        placeholder="Pilih Semester"
                                        error={errors.semester}
                                    />     

                                    <InputField
                                        label="Kuliah Perdana"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="Pilih Tanggal Mulai"
                                        error={errors.start_date}
                                    />                               

                                    {/* Input: Jumlah Pertemuan */}
                                    <InputField
                                        label="Jumlah Pertemuan"
                                        type="number"
                                        value={jumlahPertemuan}
                                        onChange={(e) => setJumlahPertemuan(e.target.value)}
                                        placeholder="Masukkan Jumlah Pertemuan"
                                        error={errors.jumlah_pertemuan}
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
