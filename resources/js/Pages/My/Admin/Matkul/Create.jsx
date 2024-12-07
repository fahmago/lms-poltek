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
    const { errors, prodis } = usePage().props;

    // State untuk form input
    const [kodeProdi, setKodeProdi] = useState('');
    const [kodeMatkul, setKodeMatkul] = useState('');
    const [namaMatkul, setNamaMatkul] = useState('');
    const [sks, setSks] = useState('');
    const [semester, setSemester] = useState('');
    const [rps, setRps] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const storeMatkul = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.post(route('my.matkuls.store'), {
            kode_prodi: kodeProdi,
            kode_matkul: kodeMatkul,
            nama_matkul: namaMatkul,
            sks,
            semester,
            rps,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil menambah mata kuliah!',
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
        setKodeProdi('');
        setKodeMatkul('');
        setNamaMatkul('');
        setSks('');
        setSemester('');
        setRps('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Mata Kuliah</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-book mr-2"></i> Tambah Mata Kuliah
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeMatkul}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                                    {/* Select: Program Studi */}
                                    <SelectField2
                                        label="Program Studi"
                                        value={kodeProdi}
                                        onChange={(e) => setKodeProdi(e.target.value)}
                                        options={prodis.map((prodi) => ({
                                            value: prodi.kode_prodi,
                                            label: `${prodi.kode_prodi} - ${prodi.nama_prodi}`,
                                        }))}
                                        placeholder="Cari atau pilih program studi"
                                        error={errors.kode_prodi}
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

                                    {/* Input: Kode Mata Kuliah */}
                                    <InputField
                                        label="Kode Mata Kuliah"
                                        type="text"
                                        value={kodeMatkul}
                                        onChange={(e) => setKodeMatkul(e.target.value)}
                                        placeholder="Masukkan Kode Mata Kuliah"
                                        error={errors.kode_matkul}
                                    />

                                    {/* Input: Nama Mata Kuliah */}
                                    <InputField
                                        label="Nama Mata Kuliah"
                                        type="text"
                                        value={namaMatkul}
                                        onChange={(e) => setNamaMatkul(e.target.value)}
                                        placeholder="Masukkan Nama Mata Kuliah"
                                        error={errors.nama_matkul}
                                    />

                                    {/* Input: SKS */}
                                    <InputField
                                        label="SKS"
                                        type="number"
                                        value={sks}
                                        onChange={(e) => setSks(e.target.value)}
                                        placeholder="Masukkan Jumlah SKS"
                                        error={errors.sks}
                                    />

                                    {/* Input: Semester */}
                                    {/* <InputField
                                        label="Semester"
                                        type="number"
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        placeholder="Masukkan Semester"
                                        error={errors.semester}
                                    /> */}                                   

                                    {/* Input: Rps */}
                                    <InputField
                                        label="RPS"
                                        type="text"
                                        value={rps}
                                        onChange={(e) => setRps(e.target.value)}
                                        placeholder="Masukkan Link RPS"
                                        error={errors.rps}
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
