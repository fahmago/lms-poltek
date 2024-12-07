import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField';
import SelectField2 from '../../../../Shared/Fields/SelectField2';

const Edit = () => {
    const { errors, matkul, prodis } = usePage().props;

    // State untuk form input
    const [kodeProdi, setKodeProdi] = useState(matkul.kode_prodi);
    const [kodeMatkul, setKodeMatkul] = useState(matkul.kode_matkul);
    const [namaMatkul, setNamaMatkul] = useState(matkul.nama_matkul);
    const [sks, setSks] = useState(matkul.sks);
    const [semester, setSemester] = useState(matkul.semester);
    const [rps, setRps] = useState(matkul.rps);
    const [isLoading, setIsLoading] = useState(false);

    const updateMatkul = (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.put(
            route('my.matkuls.update', matkul.uuid),
            {
                kode_prodi: kodeProdi,
                kode_matkul: kodeMatkul,
                nama_matkul: namaMatkul,
                sks,
                semester,
                rps,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    ToastNotification({
                        icon: 'success',
                        title: 'Mata Kuliah berhasil diperbarui!',
                        timer: 2000,
                    });
                },
                onError: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <>
            <Head title="Edit Mata Kuliah" />
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-edit mr-2"></i> Edit Mata Kuliah
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={updateMatkul}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Kode Prodi */}
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

                                    {/* Semester */}
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

                                    {/* Kode Mata Kuliah */}
                                    <InputField
                                        label="Kode Mata Kuliah"
                                        type="text"
                                        value={kodeMatkul}
                                        onChange={(e) => setKodeMatkul(e.target.value)}
                                        placeholder="Masukkan Kode Mata Kuliah"
                                        error={errors.kode_matkul}
                                    />

                                    {/* Nama Mata Kuliah */}
                                    <InputField
                                        label="Nama Mata Kuliah"
                                        type="text"
                                        value={namaMatkul}
                                        onChange={(e) => setNamaMatkul(e.target.value)}
                                        placeholder="Masukkan Nama Mata Kuliah"
                                        error={errors.nama_matkul}
                                    />

                                    {/* SKS */}
                                    <InputField
                                        label="SKS"
                                        type="number"
                                        value={sks}
                                        onChange={(e) => setSks(e.target.value)}
                                        placeholder="Masukkan Jumlah SKS"
                                        error={errors.sks}
                                    />

                                    {/* RPS */}
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
