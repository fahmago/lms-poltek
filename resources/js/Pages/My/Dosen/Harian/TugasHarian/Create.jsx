import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import style quill (snow theme)
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../../Layouts/MyLayout';
import ButtonSave from '../../../../../Shared/ButtonSave';
import ToastNotification from '../../../../../Shared/ToastNotification';
import InputField from '../../../../../Shared/Fields/InputField';
import SelectField2 from '../../../../../Shared/Fields/SelectField2';

const CreateTugasHarian = () => {
    const { errors, kelas } = usePage().props;

    // State untuk form input
    const [kodeKelas, setKodeKelas] = useState('');
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [tanggalDeadline, setTanggalDeadline] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const storeTugas = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('kode_kelas_harian', kodeKelas);
        formData.append('judul', judul);
        formData.append('deskripsi', deskripsi);
        formData.append('tanggal_deadline', tanggalDeadline);

        Inertia.post(route('dsn.dh.tugas.store'), formData, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil menambah tugas!',
                    timer: 2000,
                });
                resetForm();
            },
            onError: () => {
                setIsLoading(false);
            },
        });
    };

    const resetForm = () => {
        setKodeKelas('');
        setJudul('');
        setDeskripsi('');
        setTanggalDeadline('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Tugas Harian</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-hand-holding-hand mr-2"></i> Tambah Tugas Harian
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeTugas}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Select: Kelas */}
                                    <SelectField2
                                        label="Kelas Harian"
                                        value={kodeKelas}
                                        onChange={(e) => setKodeKelas(e.target.value)}
                                        options={kelas.map((kelasItem) => ({
                                            value: kelasItem.kode_kelas_harian,
                                            label: `${kelasItem.kode_kelas_harian} - ${kelasItem.nama_kelas} - (${kelasItem.tahun}-${kelasItem.semester})`,
                                        }))}
                                        placeholder="Cari atau pilih kelas"
                                        error={errors?.kode_kelas_harian}
                                    />

                                    {/* Input: Judul */}
                                    <InputField
                                        label="Judul"
                                        type="text"
                                        value={judul}
                                        onChange={(e) => setJudul(e.target.value)}
                                        placeholder="Masukkan Judul Tugas"
                                        error={errors.judul}
                                    />

                                    {/* Input: Tanggal Deadline */}
                                    <InputField
                                        label="Tanggal Deadline"
                                        type="datetime-local"
                                        value={tanggalDeadline}
                                        onChange={(e) => setTanggalDeadline(e.target.value)}
                                        placeholder="Masukkan Tanggal Deadline"
                                        error={errors.tanggal_deadline}
                                    />

                                    {/* Input: Deskripsi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                        <ReactQuill
                                            value={deskripsi}
                                            onChange={setDeskripsi}
                                            placeholder="Masukkan Deskripsi Tugas Harian"
                                            modules={{
                                                toolbar: [
                                                    [{ header: '1' }, { header: '2' }, { font: [] }],
                                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                                    [{ script: 'sub' }, { script: 'super' }],
                                                    [{ align: [] }],
                                                    ['bold', 'italic', 'underline'],
                                                    ['link'],
                                                    [{ color: [] }, { background: [] }],
                                                    ['blockquote'],
                                                    ['code-block'],
                                                ],
                                            }}
                                        />
                                        {errors.deskripsi && <p className="text-red-500 text-xs">{errors.deskripsi}</p>}
                                    </div>
                                    
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

export default CreateTugasHarian;
