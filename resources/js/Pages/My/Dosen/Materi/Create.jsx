import React, { useState } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import style quill (snow theme)
import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';
import InputField from '../../../../Shared/Fields/InputField';
import SelectField2 from '../../../../Shared/Fields/SelectField2';

const CreateMateri = () => {
    const { errors, kelas } = usePage().props;

    // State untuk form input
    const [kodeKelas, setKodeKelas] = useState('');
    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [file, setFile] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const storeMateri = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('kode_kelas', kodeKelas);
        formData.append('judul', judul);
        formData.append('deskripsi', deskripsi);
        formData.append('file', file);

        Inertia.post(route('dsn.materi.store'), formData, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil menambah materi!',
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
        setJudul('');
        setDeskripsi('');
        setFile('');
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Materi</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-book mr-2"></i> Tambah Materi
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeMateri}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Select: Kelas */}
                                    <SelectField2
                                        label="Kelas"
                                        value={kodeKelas}
                                        onChange={(e) => setKodeKelas(e.target.value)}
                                        options={kelas.map((kelasItem) => ({
                                            value: kelasItem.kode_kelas,
                                            label: `${kelasItem.kode_kelas} - ${kelasItem.nama_kelas} - ${kelasItem.matkul.nama_matkul}`,
                                        }))}
                                        placeholder="Cari atau pilih kelas"
                                        error={errors?.kode_kelas}
                                    />

                                    {/* Input: Judul */}
                                    <InputField
                                        label="Judul"
                                        type="text"
                                        value={judul}
                                        onChange={(e) => setJudul(e.target.value)}
                                        placeholder="Masukkan Judul Materi"
                                        error={errors.judul}
                                    />

                                    {/* Input: Deskripsi */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                        <ReactQuill
                                            value={deskripsi}
                                            onChange={setDeskripsi}
                                            placeholder="Masukkan Deskripsi Materi"
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                    [{ 'script': 'sub'}, { 'script': 'super' }],
                                                    [{ 'align': [] }],
                                                    ['bold', 'italic', 'underline'],
                                                    ['link'],
                                                    [{ 'color': [] }, { 'background': [] }],
                                                    ['blockquote'],
                                                    ['code-block'],
                                                ],
                                            }}
                                        />
                                        {errors.deskripsi && <p className="text-red-500 text-xs">{errors.deskripsi}</p>}
                                    </div> 

                                    {/* Input: File */}
                                    <InputField
                                        label="Link Modul PDF"
                                        type="text"
                                        value={file}
                                        onChange={(e) => setFile(e.target.value)}
                                        placeholder="Masukkan Link Modul PDF"
                                        error={errors.file}
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

export default CreateMateri;
