import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const MataKuliahImport = () => {
    const { errors } = usePage().props;

    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Method to handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Method to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            // Show error if no file selected
            Swal.fire({
                icon: 'error',
                title: 'File tidak boleh kosong',
                text: 'Silahkan pilih file terlebih dahulu.',
            });
            return;
        }

        // Set loading state
        setIsLoading(true);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);

        // Post the file to the server using Inertia.js
        Inertia.post(route('my.matkuls.matkul.excel.post'), formData, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'File imported successfully!',
                    timer: 2000,
                });
            },
            onError: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'error',
                    title: 'Import failed',
                    timer: 2000,
                });
            }
        });
    };

    return (
        <>
            <Head>
                <title>eLearning - Import Data Mata Kuliah</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-green-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-file-excel mr-2"></i> Import Data Mata Kuliah
                            </span>
                        </div>
                        <div className="p-6">
                            {/* Informasi tentang cara mengupload file */}
                            <div className="mb-4 text-sm text-gray-600">
                                <p className='font-bold'>Instruksi:</p>
                                <ul className="list-disc pl-5">
                                    <li>Pastikan file yang diunggah berformat Excel (.xls atau .xlsx).</li>
                                    <li>File Excel harus memiliki kolom-kolom berikut: <strong>Kode Prodi</strong>, <strong>Kode Mata Kuliah</strong>, <strong>Nama Mata Kuliah</strong>, <strong>SKS</strong>, <strong>Semester</strong>, dan <strong>Link RPS</strong>.</li>
                                    <li>Kolom <strong>Kode Prodi</strong> harus sesuai dengan data program studi yang terdaftar pada sistem ini.</li>
                                    <li>Kolom <strong>SKS</strong> dan <strong>Semester</strong> harus berupa angka sesuai format.</li>
                                    <li>Jika Anda tidak yakin dengan formatnya, unduh file contoh di bawah ini.</li>
                                </ul>
                                <div className="mt-2">
                                    <a
                                        href="/files/sample-matkul.xlsx"
                                        className="text-blue-500 hover:text-blue-700 underline"
                                        download
                                    >
                                        Mirror-1 Format Excel Mata Kuliah
                                    </a>
                                </div>
                                <div className="mt-2">
                                    <a
                                        href="https://docs.google.com/spreadsheets/d/168dJQCMa2pZ8YQjhifHdKtByO5cWGWAu9348S8AzIFc/edit?usp=sharing"
                                        className="text-blue-500 hover:text-blue-700 underline"
                                        target='_blank'
                                    >
                                        Mirror-2 Format Excel Mata Kuliah
                                    </a>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-base font-medium text-gray-700">Upload Excel File</label>
                                    <input
                                        type="file"
                                        accept=".xls,.xlsx"
                                        onChange={handleFileChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.file && (
                                        <p className="text-red-500 text-base mt-2">{errors.file}</p>
                                    )}
                                </div>
                                <div className="flex justify-start">
                                    <ButtonSave type="submit" disabled={isLoading} className='bg-green-600 hover:bg-green-700'>
                                        {isLoading ? (
                                            <>
                                                <i className="fa fa-spinner fa-spin mr-2"></i> Importing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fa fa-upload mr-2"></i> Import
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

export default MataKuliahImport;
