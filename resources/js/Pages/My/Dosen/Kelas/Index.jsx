import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import DynamicModal from '../../../../Shared/DynamicModal';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../Shared/ToastNotification';

const Index = () => {
    const { kelas } = usePage().props;

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalFields, setModalFields] = useState([]);
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);  // State untuk menandakan submit
    const [modalErrors, setModalErrors] = useState({}); // Menyimpan error modal

    const headers = ["No.", "Enroll", "Kode", "Tahun", "Matkul", "Kelas", "Mahasiswa", "Actions"];

    const openModal = (kls) => {
        setSelectedKelas(kls);
        setModalFields([
            {
                name: '_method',
                type: 'hidden',
                defaultValue: 'PUT',
                required: true,
            },
            {
                name: 'kode_enroll',
                label: 'Kode Enroll',
                defaultValue: kls.kode_enroll || '',
                required: false,
            },
        ]);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedKelas(null);
        setModalFields([]);
        setModalErrors({}); // Reset errors saat menutup modal
    };

    const handleSubmit = (updatedData) => {
        setIsSubmitting(true);  // Menandakan bahwa proses sedang berlangsung

        Inertia.post(route('dsn.kelas.update', { uuid: selectedKelas.uuid }), updatedData, {
            onSuccess: () => {
                setIsSubmitting(false);
                closeModal();
                ToastNotification({
                    icon: 'success',
                    title: 'Kode enroll berhasil diupdate',
                    timer: 2000
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setModalErrors(errors); 
                ToastNotification({
                    icon: 'error',
                    title: 'Kode enroll gagal diupdate',
                    timer: 2000
                });
            }
        });
    };

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.kode_enroll,
        kls.kode_kelas,
        kls.tahun,
        `${kls.matkul.nama_matkul}(${kls.matkul.semester})`,
        kls.nama_kelas,
        kls.pilih_kelas_count,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dsn.kls.show', 'dsn.kls.enroll']) ? (
                    <>
                        {hasAnyPermission(['dsn.kls.show']) && (
                            <Link
                                // href={`/my/kelas/${kls.uuid}/edit`}
                                href={route('dsn.kelas.show', kls.uuid)}
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <i className="fa fa-user-graduate"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['dsn.kls.enroll']) && (
                            <button
                                onClick={() => openModal(kls)}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                <i className="fa fa-fingerprint"></i>
                            </button>
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    return (
        <>
            <Head title="eLearning - Data Kelas" />
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/d/kelas'}
                                placeholder="Keyword: [Kode Kelas] [Nama Kelas] [Mata Kuliah]"
                             />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-users-rectangle"
                    title="Data Kelas"
                />
                {/* Modal */}
                <DynamicModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    fields={modalFields}
                    title="Update Kode Enroll"
                    isSubmitting={isSubmitting}  // Kirim isSubmitting ke modal
                    errors={modalErrors}  // Kirim error ke modal
                />
            </MyLayout>
        </>
    );
};

export default Index;


