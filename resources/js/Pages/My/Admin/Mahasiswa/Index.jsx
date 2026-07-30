import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import DataTable from '../../../../Shared/DataTable';
import Delete from '../../../../Shared/Delete';
import Modal from '../../../../Shared/Modal';

const Index = () => {
    const { mahasiswas } = usePage().props;

    // 3. Tambahkan state untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

    // 4. Buat fungsi untuk handle modal
    const handleOpenModal = (mhs) => {
        setSelectedMahasiswa(mhs);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMahasiswa(null);
    };
    
    const headers = ["No.", "Foto", "Nim", "Nama Mahasiswa", "Angkatan", "Actions"];

    const rows = mahasiswas.data.map((mhs, index) => [
        index + 1 + (mahasiswas.current_page - 1) * mahasiswas.per_page,
        <img src={mhs.image} className="rounded-lg w-20 h-auto mx-auto" />,
        mhs.nim ? mhs.nim : <><span className="text-red-500 font-semibold">Belum Ada</span></>,
        mhs.user.name ? mhs.user.name : 'Dihapus',
       <>{ mhs.angkatan.kode_tahun}</>,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['mahasiswas.edit', 'mahasiswas.delete']) ? (
                    <>
                        {hasAnyPermission(['mahasiswas.list-kelas']) && (
                            <button
                                onClick={() => handleOpenModal(mhs)} 
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <i className="fa fa-eye"></i>
                            </button>
                        )}
                        {hasAnyPermission(['mahasiswas.edit']) && (
                            <Link
                                href={`/my/mahasiswa/${mhs.uuid}/edit`}
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                <i className="fa fa-pencil-alt"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['mahasiswas.delete']) && (
                            <Delete 
                                URL={'/my/mahasiswa'} 
                                title="Hapus Mahasiswa"
                                id={mhs.uuid} 
                            />
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    const modalHeaders = ["No.", "Tahun", "Semester", "Kode", "Kelas", "Pengajar", "Actions"];
    const kelasRows = selectedMahasiswa?.kelas_harians_kehadiran_status?.map((kelas, index) => [
        index + 1,
        kelas.tahun,
        kelas.semester,
        kelas.kode_kelas_harian,
        kelas.nama_kelas,
        kelas.dosen?.user?.name || 'N/A', // Pastikan properti `nama` di model Dosen sesuai
        <Delete
            URL={'/my/mahasiswa/kelas-harian'}
            id={kelas.pivot.uuid}
            icon='fas fa-sign-out-alt' // Tambahkan ikon keluar
            onSuccess={() => handleCloseModal()}
            titleSuccess={`${selectedMahasiswa.user.name} berhasil dikeluarkan dari kelas ${kelas.nama_kelas}.`}
            title={`Keluarkan ${selectedMahasiswa.user.name} dari kelas ${kelas.nama_kelas}?`}
        />
    ]) || [];

  return (
    <>
        <Head title='eLearning - Data Mahasiswa' />
        <MyLayout>
            <div className="flex flex-col mt-5">
                <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['mahasiswas.create']) ? 'justify-between' : 'justify-center'}`}>
                    {hasAnyPermission(['mahasiswas.create']) && (
                        <Link href={route('my.mahasiswas.create')}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            <i className="fa fa-plus-circle mr-2"></i>
                            Mahasiswa
                        </Link>
                    )}
                    <div className="w-full md:w-3/4 lg:w-3/6">
                        <Search URL={'/my/mahasiswa'} />
                    </div>
                </div>
            </div>
            <DataTable
                headers={headers}
                rows={rows}
                pagination={mahasiswas}
                iconClass="fa fa-user-graduate"
                title="Data Mahasiswa"
            />
            {/* 6. Render komponen Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={`Daftar Kelas - ${selectedMahasiswa ? selectedMahasiswa.user.name : ''}`}
                >
                    <DataTable
                        headers={modalHeaders}
                        rows={kelasRows}
                        iconClass="fa fa-chalkboard-teacher"
                        title="Kelas yang Diikuti"
                        // Tidak perlu pagination untuk data di modal ini
                    />
                </Modal>
        </MyLayout>
    </>
  )
}

export default Index
