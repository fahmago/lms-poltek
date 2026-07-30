import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import ButtonSave from '../../../../../Shared/ButtonSave';
import ToastNotification from '../../../../../Shared/ToastNotification';
import InputField from '../../../../../Shared/Fields/InputField';
import SelectField2 from '../../../../../Shared/Fields/SelectField2';

const Create = () => {
    const { errors, dosens, angkatans, kategoriKelasHarians } = usePage().props;

    const [kategoriId, setKategoriId] = useState('');
    const [dosenId, setDosenId] = useState('');
    const [namaKelas, setNamaKelas] = useState('');
    const [tahun, setTahun] = useState('');
    const [jamMulai, setJamMulai] = useState('');
    const [durasi, setDurasi] = useState('');
    const [semester, setSemester] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const storeKelas = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        Inertia.post(
            route('my.dh.kelas.store'),
            {
                kategori_kelas_harian_id: kategoriId,
                dosen_id: dosenId,
                nama_kelas: namaKelas,
                tahun,
                jam_mulai: jamMulai,
                durasi,
                semester,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    ToastNotification({
                        icon: 'success',
                        title: 'Berhasil menambah kelas!',
                        timer: 2000,
                    });
                    resetForm();
                },
                onError: () => setIsLoading(false),
            }
        );
    };

    const resetForm = () => {
        setKategoriId('');
        setDosenId('');
        setNamaKelas('');
        setTahun('');
        setJamMulai('');
        setDurasi('');
        setSemester('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Kelas Harian</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-chalkboard-teacher mr-2"></i> Tambah Kelas Harian
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeKelas}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                                    {/* Select: Kategori Kelas Harian */}
                                    <SelectField2
                                        label="Kategori Kelas Harian"
                                        value={kategoriId}
                                        onChange={(e) => setKategoriId(e.target.value)}
                                        options={kategoriKelasHarians.map((item) => ({
                                            value: item.id,
                                            label: item.nama_kategori,
                                        }))}
                                        placeholder="Pilih kategori kelas"
                                        error={errors?.kategori_kelas_harian_id}
                                    />

                                    {/* Select: Dosen */}
                                    <SelectField2
                                        label="Dosen"
                                        value={dosenId}
                                        onChange={(e) => setDosenId(e.target.value)}
                                        options={dosens.map((dosen) => ({
                                            value: dosen.id,
                                            label: `${dosen.nidn || dosen.id} - ${dosen.user?.name || 'Tanpa Nama'}`,
                                        }))}
                                        placeholder="Pilih dosen"
                                        error={errors?.dosen_id}
                                    />

                                    {/* Select: Tahun Kelas */}
                                    <SelectField2
                                        label="Tahun Kelas"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun}`,
                                        }))}
                                        placeholder="Pilih tahun"
                                        error={errors?.tahun}
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
                                        placeholder="Pilih semester"
                                        error={errors?.semester}
                                    />

                                    {/* Input: Nama Kelas */}
                                    <InputField
                                        label="Nama Kelas"
                                        type="text"
                                        value={namaKelas}
                                        onChange={(e) => setNamaKelas(e.target.value)}
                                        placeholder="Masukkan Nama Kelas"
                                        error={errors?.nama_kelas}
                                    />

                                    {/* Input: Jam Mulai */}
                                    <InputField
                                        label="Jam Mulai"
                                        type="time"
                                        value={jamMulai}
                                        onChange={(e) => setJamMulai(e.target.value)}
                                        error={errors?.jam_mulai}
                                    />

                                    {/* Input: Durasi */}
                                    <InputField
                                        label="Durasi (Menit)"
                                        type="number"
                                        value={durasi}
                                        onChange={(e) => setDurasi(e.target.value)}
                                        placeholder="Masukkan Durasi dalam Menit"
                                        error={errors?.durasi}
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

export default Create;
