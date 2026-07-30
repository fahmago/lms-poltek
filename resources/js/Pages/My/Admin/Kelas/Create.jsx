import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField';
import SelectField from '../../../../Shared/Fields/SelectField';
import SelectField2 from '../../../../Shared/Fields/SelectField2';

const Create = () => {
    const { errors, dosens, matkuls, angkatans } = usePage().props;

    // State untuk form input
    const [dosenId, setDosenId] = useState('');
    const [kodeMatkul, setKodeMatkul] = useState('');
    const [namaKelas, setNamaKelas] = useState('');
    const [tahun, setTahun] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const storeKelas = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.kelas.store'), {
            dosen_id: dosenId,
            kode_matkul: kodeMatkul,
            nama_kelas: namaKelas,
            tahun,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil menambah kelas!',
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
        setDosenId('');
        setKodeMatkul('');
        setNamaKelas('');
        setTahun('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Kelas</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-chalkboard-teacher mr-2"></i> Tambah Kelas
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeKelas}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                                    {/* Select: Dosen */}
                                    <SelectField2
                                        label="Dosen"
                                        value={dosenId}
                                        onChange={(e) => setDosenId(e.target.value)}
                                        options={dosens.map((dosen) => ({
                                            value: dosen.id,
                                            label: (
                                                <>
                                                    {dosen.nidn ? (
                                                        dosen.nidn
                                                    ) : (
                                                        dosen.id
                                                        // <span className="text-red-500">NIDN</span>
                                                    )}
                                                    {' - '}{dosen.user?.name || 'Nama Tidak Tersedia'}
                                                </>
                                            ),
                                        }))}
                                        placeholder="Cari atau pilih dosen"
                                        error={errors?.dosen_id}
                                    />


                                    {/* Select: Mata Kuliah */}
                                    <SelectField2
                                        label="Mata Kuliah"
                                        value={kodeMatkul}
                                        onChange={(e) => setKodeMatkul(e.target.value)}
                                        options={matkuls.map((matkul) => ({
                                            value: matkul.kode_matkul,
                                            label: `${matkul.kode_matkul} - ${matkul.nama_matkul}(${matkul.semester})`,
                                        }))}
                                        placeholder="Cari atau pilih mata kuliah"
                                        error={errors.kode_matkul}
                                    />

                                    {/* Select: Mata Kuliah */}
                                    <SelectField2
                                        label="Tahun Kelas"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun} - ${angkatan.nama_angkatan}`,
                                        }))}
                                        placeholder="Cari atau pilih tahun kelas"
                                        error={errors.tahun}
                                    />

                                    {/* Input: Nama Kelas */}
                                    <InputField
                                        label="Nama Kelas"
                                        type="text"
                                        value={namaKelas}
                                        onChange={(e) => setNamaKelas(e.target.value)}
                                        placeholder="Masukkan Nama Kelas"
                                        error={errors.nama_kelas}
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
