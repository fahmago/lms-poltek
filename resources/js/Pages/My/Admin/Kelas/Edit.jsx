import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState, useEffect } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField';
import SelectField2 from '../../../../Shared/Fields/SelectField2';

const Edit = () => {
    const { errors, dosens, matkuls, kelas, angkatans } = usePage().props;

    // State untuk form input, diisi dengan nilai awal dari props `kelas`
    const [dosenId, setDosenId] = useState(kelas.dosen_id || '');
    const [kodeMatkul, setKodeMatkul] = useState(kelas.kode_matkul || '');
    const [namaKelas, setNamaKelas] = useState(kelas.nama_kelas || '');
    const [tahun, setTahun] = useState(kelas.tahun || '');
    const [kodeEnroll, setKodeEnroll] = useState(kelas.kode_enroll || '');
    const [isLoading, setIsLoading] = useState(false);

    const updateKelas = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        Inertia.put(route('my.kelas.update', kelas.uuid), {
            dosen_id: dosenId,
            kode_matkul: kodeMatkul,
            nama_kelas: namaKelas,
            tahun,
            kode_enroll: kodeEnroll,
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil memperbarui kelas!',
                    timer: 2000,
                });
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    return (
        <>
            <Head>
                <title>eLearning - Edit Kelas</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-chalkboard-teacher mr-2"></i> Edit Kelas
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={updateKelas}>
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
                                            label: `${matkul.kode_matkul} - ${matkul.nama_matkul}`,
                                        }))}
                                        placeholder="Cari atau pilih mata kuliah"
                                        error={errors.kode_matkul}
                                    />

                                    {/* Input: Kode Kelas */}
                                    <InputField
                                        label="Kode Kelas"
                                        type="text"
                                        value={kelas.kode_kelas}
                                        placeholder="Masukkan Kode Kelas"
                                        readOnly
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

                                    {/* Input: tahun */}
                                    <SelectField2
                                        label="Tahun Kelas"
                                        value={tahun}
                                        onChange={(e) => setTahun(e.target.value)}
                                        options={angkatans.map((angkatan) => ({
                                            value: angkatan.kode_tahun,
                                            label: `${angkatan.kode_tahun} - ${angkatan.nama_angkatan}`,
                                        }))}
                                        placeholder="Cari atau pilih mata kuliah"
                                        error={errors.tahun}
                                    />

                                    {/* Input: Kode Enroll */}
                                    <InputField
                                        label="Kode Enroll (Kosongkan untuk update)"
                                        type="text"
                                        value={kodeEnroll}
                                        onChange={(e) => setKodeEnroll(e.target.value)}
                                        placeholder="Masukkan Kode Enroll Baru atau biarkan kosong"
                                        error={errors.kode_enroll}
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

export default Edit;
