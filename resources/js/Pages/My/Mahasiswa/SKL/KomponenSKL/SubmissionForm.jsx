import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import InputField from '@/Shared/Fields/InputField';
import ButtonSave from '@/Shared/ButtonSave';

// GANTI: 'tugas' menjadi 'project' (lebih deskriptif)
export default function SubmissionForm({ tugas: project, submission }) { 
    const { errors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // GANTI: State 'jawaban' diubah menjadi 3 state untuk project
    const [linkRepository, setLinkRepository] = useState(submission?.link_repository || '');
    const [linkDemo, setLinkDemo] = useState(submission?.link_demo || '');
    const [pathFileLaporan, setPathFileLaporan] = useState(submission?.path_file_laporan || '');

    // HAPUS: Semua logika handleYoutubeIdChange, addVideoIdField, removeVideoIdField,
    // checkForDuplicates, dan duplicateErrors.

    const handleSubmit = (e) => {
        e.preventDefault();
        // HAPUS: Cek duplikat
        setIsSubmitting(true);
        
        // GANTI: dataToSend disesuaikan untuk project
        const dataToSend = {
            link_repository: linkRepository,
            link_demo: linkDemo,
            path_file_laporan: pathFileLaporan,
        };

        // GANTI: route 'mhs.tweek.submit' -> 'mhs.tsem.submit' & param
        Inertia.post(route('mhs.tsem.submit', { projectSemester: project.uuid }), dataToSend, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{submission ? 'Perbarui Project' : 'Kumpulkan Project'}</h3>
            
            {/* HAPUS: Logika 'tugas.tipe_tugas === "yt"' */}
            {/* GANTI: Form diganti dengan 3 field project */}
            
            <div className="space-y-4">
                <InputField
                    label="Link Repository"
                    type="url"
                    value={linkRepository}
                    onChange={e => setLinkRepository(e.target.value)}
                    placeholder="https://github.com/febryan1453/repo"
                    // error={errors.link_repository} // Tampilkan error spesifik
                />
                <InputField
                    label="Link Demo / Presentasi"
                    type="url"
                    value={linkDemo}
                    onChange={e => setLinkDemo(e.target.value)}
                    placeholder="https://febryan1453.github.io"
                    // error={errors.link_demo} // Tampilkan error spesifik
                />
                {/* <InputField
                    label="Path File Laporan"
                    type="text"
                    value={pathFileLaporan}
                    onChange={e => setPathFileLaporan(e.target.value)}
                    placeholder="Contoh: Laporan/Project_NIM.pdf"
                    error={errors.path_file_laporan} // Tampilkan error spesifik
                    helpText="Jika Anda mengumpulkan file, tuliskan path lengkap di sini."
                /> */}
            </div>

            <p className="text-red-500 text-base mt-1">{errors.link_repository}</p>
            
            {/* HAPUS: Error 'jawaban.*' */}

            <div className="pt-4 flex justify-end">
                {/* GANTI: Teks disesuaikan untuk 'Project' */}
                <ButtonSave type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Sedang Mengirim...
                        </>
                    ) : submission ? (
                        <>
                            <i className="fas fa-sync-alt mr-2"></i>
                            Perbarui Project
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane mr-2"></i>
                            Kirim Project
                        </>
                    )}
                </ButtonSave>
            </div>
        </form>
    );
};