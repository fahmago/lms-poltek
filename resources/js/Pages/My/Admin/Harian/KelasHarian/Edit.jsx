import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import ButtonSave from '../../../../../Shared/ButtonSave';
import ToastNotification from '../../../../../Shared/ToastNotification';
import InputField from '../../../../../Shared/Fields/InputField';
import SelectField2 from '../../../../../Shared/Fields/SelectField2';
import formatJam from '../../../../../Utilities/formatJam';

const Edit = () => {
    const { errors, dosens, angkatans, kelas, kategoriKelasHarians } = usePage().props;

    const [dosenId, setDosenId] = useState(kelas.dosen_id || '');
    const [namaKelas, setNamaKelas] = useState(kelas.nama_kelas || '');
    const [tahun, setTahun] = useState(kelas.tahun || '');
    // const [jamMulai, setJamMulai] = useState(kelas.jam_mulai || '');
    const [jamMulai, setJamMulai] = useState(formatJam(kelas.jam_mulai));
    const [durasi, setDurasi] = useState(kelas.durasi || '');
    const [semester, setSemester] = useState(kelas.semester || '');
    const [kategoriId, setKategoriId] = useState(kelas.kategori_kelas_harian_id || '');
    const [isLoading, setIsLoading] = useState(false);

    const updateKelas = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.put(
            route('my.dh.kelas.update', kelas.id),
            {
                dosen_id: dosenId,
                nama_kelas: namaKelas,
                tahun,
                jam_mulai: jamMulai,
                durasi,
                semester,
                kategori_kelas_harian_id: kategoriId,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    ToastNotification({
                        icon: 'success',
                        title: 'Berhasil mengupdate kelas!',
                        timer: 2000,
                    });
                },
                onError: () => setIsLoading(false),
            }
        );
    };

    return (
        <>
            <Head>
                <title>eLearning - Edit Kelas Harian</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-edit mr-2"></i> Edit Kelas Harian
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={updateKelas}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                                    

                                    {/* Select: Kategori Kelas Harian */}
                                    <SelectField2
                                        label="Kategori Kelas Harian"
                                        value={kategoriId}
                                        onChange={(e) => setKategoriId(e.target.value)}
                                        options={kategoriKelasHarians.map((kategori) => ({
                                            value: kategori.id,
                                            label: kategori.nama_kategori,
                                        }))}
                                        placeholder="Pilih Kategori"
                                        error={errors?.kategori_kelas_harian_id}
                                    />

                                    {/* Select: Dosen */}
                                    <SelectField2
                                        label="Dosen"
                                        value={dosenId}
                                        onChange={(e) => setDosenId(e.target.value)}
                                        options={dosens.map((dosen) => ({
                                            value: dosen.id,
                                            label: `${dosen.nidn || dosen.id} - ${dosen.user?.name || 'Nama Tidak Tersedia'}`,
                                        }))}
                                        placeholder="Pilih Dosen"
                                        error={errors?.dosen_id}
                                    />

                                    {/* Select: Tahun Kelas */}
                                    <SelectField2
                                        label="Tahun Kelas"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun} - ${angkatan.nama_angkatan}`,
                                        }))}
                                        placeholder="Pilih Tahun"
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
                                        placeholder="Pilih Semester"
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
                                        error={errors?.durasi}
                                    />
                                </div>

                                <div className="flex justify-start mt-4">
                                    <ButtonSave type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin mr-2"></i> Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-save mr-2"></i> Update
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

export default Edit;
