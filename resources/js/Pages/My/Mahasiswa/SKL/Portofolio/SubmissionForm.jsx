import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
// Path disesuaikan menggunakan alias
import InputField from '@/Shared/Fields/InputField';
import ButtonSave from '@/Shared/ButtonSave';

// GANTI: 'tugas' menjadi 'portofolio' (lebih deskriptif)
export default function SubmissionForm({ tugas: portofolio, submission }) { 
    const { errors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // GANTI: State disesuaikan, pathFileLaporan dihapus
    const [linkRepository, setLinkRepository] = useState(submission?.link_repository || '');
    const [linkDemo, setLinkDemo] = useState(submission?.link_demo || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // GANTI: dataToSend disesuaikan, pathFileLaporan dihapus
        const dataToSend = {
            link_repository: linkRepository,
            link_demo: linkDemo,
        };

        // GANTI: route 'mhs.tsem.submit' -> 'mhs.portofolio.submit' & param
        Inertia.post(route('mhs.portofolio.submit', { portofolio: portofolio.uuid }), dataToSend, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* GANTI: Teks "Project" -> "Portofolio" */}
            <h3 className="text-lg font-semibold text-gray-800">{submission ? 'Perbarui Portofolio' : 'Kumpulkan Portofolio'}</h3>
            
            <div className="space-y-4">
                <InputField
                    label="Link Repository"
                    type="url"
                    value={linkRepository}
                    onChange={e => setLinkRepository(e.target.value)}
                    placeholder="https://github.com/febryan1453/repo"
                    error={errors.link_repository} // Tampilkan error spesifik
                />
                <InputField
                    label="Link Detail" // Ganti label
                    type="url"
                    value={linkDemo}
                    onChange={e => setLinkDemo(e.target.value)}
                    placeholder="https://www.portofolio.politeknikidn.id/detail/..."
                    error={errors.link_demo} // Tampilkan error spesifik
                />
                
                {/* HAPUS: InputField untuk path_file_laporan dihapus */}
            </div>

            {/* Error umum (jika ada, selain yg di field) */}
            {errors.link_repository && !errors.link_demo && (
                <p className="text-red-500 text-sm mt-1">{errors.link_repository}</p>
            )}
             {errors.link_demo && !errors.link_repository && (
                <p className="text-red-500 text-sm mt-1">{errors.link_demo}</p>
            )}
            
            <div className="pt-4 flex justify-end">
                {/* GANTI: Teks disesuaikan untuk 'Portofolio' */}
                <ButtonSave type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Sedang Mengirim...
                        </>
                    ) : submission ? (
                        <>
                            <i className="fas fa-sync-alt mr-2"></i>
                            Perbarui Portofolio
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane mr-2"></i>
                            Kirim Portofolio
                        </>
                    )}
                </ButtonSave>
            </div>
        </form>
    );
};