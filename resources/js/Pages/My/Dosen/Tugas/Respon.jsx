import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import DataTable from '../../../../Shared/DataTable';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../Shared/ToastNotification';
import FormatTanggal from '../../../../Utilities/FormatTanggal';
import DynamicModal from '../../../../Shared/DynamicModal';
import Delete from '../../../../Shared/Delete';

const formatTanggal = (dateString, isNamaBulan = false) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');  // getMonth() is 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const displayMonth = isNamaBulan ? months[date.getMonth()] : month;

    if (isNamaBulan) {
        return `${day} ${displayMonth} ${year} - ${hours}:${minutes}:${seconds}`;
    } else {
        return `${day}-${displayMonth}-${year} - ${hours}:${minutes}:${seconds}`;
    }
};

const ResponTugas = () => {
    const { tugas, pengumpulanTugas } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
    const [selectedTugas, setSelectedTugas] = useState(null); // State untuk tugas yang dipilih
    const [isSubmitting, setIsSubmitting] = useState(false); // State untuk tombol submit
    const [errors, setErrors] = useState({}); // State untuk error dari server

    const openModal = (tugasItem) => {
        setSelectedTugas(tugasItem);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTugas(null);
        setErrors({});
    };

    const handleSubmit = (formData) => {
        setIsSubmitting(true);
        // console.log(formData);

        // Kirim data ke server menggunakan Inertia
        Inertia.post(
            route("dsn.tugas.feedBackTugas", { uuid: selectedTugas.uuid }),
            formData,
            {
                onSuccess: () => {
                    closeModal(); // Tutup modal
                    setIsSubmitting(false);
                    ToastNotification({
                        icon: "success",
                        title: "Feedback berhasil dikirim",
                        timer: 2000,
                    });
                },
                onError: (err) => {
                    setErrors(err); // Tampilkan error jika ada
                    setIsSubmitting(false);
                },
            }
        );
    };

    const headers = ["No.", "Dikirim", "Nama Mahasiswa", "Kendala", "Link Tugas", "Nilai", "Actions"];

    // Mapping rows to display pengumpulanTugas data
    const rows = pengumpulanTugas.map((item, index) => [
        index + 1,
        formatTanggal(item.tanggal_dikirim),   // Tanggal dikirim tugas
        item.mahasiswa.user.name,  // Nama mahasiswa
        item.kendala || '-',  // Kendala, jika ada
        <a href={item.link_tugas} target="_blank" className="text-blue-600 hover:underline">
            Lihat Tugas
        </a>,
        item.nilai || 'Belum Dinilai',  // Nilai tugas
        (
            <div className="flex justify-center">
                <button
                    onClick={() => openModal(item)} // Buka modal dengan data tugas
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2"
                >
                    <i className="fa fa-pen-nib"></i>
                </button>
                <Delete URL={'/my/d/tugas/respon/delete'} id={item.uuid} />
            </div>
        )
    ]);

    return (
        <>
            <Head title={`Respon Tugas ${tugas.judul}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-info-circle mr-2"></i> Detail Tugas: TIDN{tugas.id}
                            </span>
                        </div>
                        <div className="p-6">
                            {/* Displaying class details */}
                            <div className="mb-4">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Tugas</td>
                                            <td className="py-1 pl-3 w-3/4">: {tugas.judul}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Ditugaskan Pada</td>
                                            <td className="py-1 pl-3 w-3/4">: <span className="text-green-600 font-semibold">{formatTanggal(tugas.tanggal_diberikan)}</span></td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Batas Pengumpulan</td>
                                            <td className="py-1 pl-3 w-3/4">: <span className="text-red-600 font-semibold">{formatTanggal(tugas.tanggal_deadline)}</span></td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5 flex items-start">Deskripsi</td>
                                            <td className="py-1 pl-3 w-3/4">: <div className='-mt-5 ml-2' dangerouslySetInnerHTML={{ __html: tugas.deskripsi }}></div></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <DataTable
                                headers={headers}
                                rows={rows}
                                title={`Respon Tugas TIDN${tugas.id}`}
                                iconClass="fa fa-sync-alt fa-spin"
                            />
                        </div>
                    </div>
                </div>

                <DynamicModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    title={`Berikan Penilaian untuk ${selectedTugas?.mahasiswa?.user?.name || ''}`}
                    fields={[
                        {
                            name: "nilai",
                            label: "Nilai",
                            type: "number",
                            defaultValue: selectedTugas?.nilai || "",
                            required: true,
                        },
                        {
                            name: "feedback",
                            label: "Feedback",
                            type: "textarea",
                            defaultValue: selectedTugas?.feedback || "",
                        },
                    ]}
                    tbutton="Simpan"
                    tProses="Menyimpan..."
                />

            </MyLayout>
        </>
    );
};

export default ResponTugas;
