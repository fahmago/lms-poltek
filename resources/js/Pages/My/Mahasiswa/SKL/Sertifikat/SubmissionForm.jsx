import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import InputField from '@/Shared/Fields/InputField'; // Menggunakan alias
import ButtonSave from '@/Shared/ButtonSave'; // Menggunakan alias

// GANTI: 'tugas: buku' -> 'tugas: sertifikat'
export default function SubmissionForm({ tugas: sertifikat, submission }) { 
    const { errors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // GANTI: State disesuaikan untuk field 'sertifikat'
    const [linkFileSertifikat, setLinkFileSertifikat] = useState(submission?.link_file_sertifikat || '');
    const [linkVerifikasi, setLinkVerifikasi] = useState(submission?.link_verifikasi || '');
    const [namaPenerbit, setNamaPenerbit] = useState(submission?.nama_penerbit || '');
    const [tanggalTerbit, setTanggalTerbit] = useState(submission?.tanggal_terbit || '');


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // GANTI: dataToSend disesuaikan untuk 'sertifikat'
        const dataToSend = {
            link_file_sertifikat: linkFileSertifikat,
            link_verifikasi: linkVerifikasi,
            nama_penerbit: namaPenerbit,
            tanggal_terbit: tanggalTerbit,
        };

        // GANTI: route 'mhs.buku.submit' -> 'mhs.sertifikat.submit' & param
        Inertia.post(route('mhs.sertifikat.submit', { sertifikat: sertifikat.uuid }), dataToSend, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* GANTI: Teks "Buku" -> "Sertifikat" */}
            <h3 className="text-lg font-semibold text-gray-800">{submission ? 'Perbarui Sertifikat' : 'Kumpulkan Sertifikat'}</h3>
            
            <div className="space-y-4">
                {/* GANTI: Field untuk Sertifikat */}
                <InputField
                    label="Nama Penerbit"
                    type="text"
                    value={namaPenerbit}
                    onChange={e => setNamaPenerbit(e.target.value)}
                    placeholder="Misal: Dicoding, Coursera, LSP Informatika"
                    error={errors.nama_penerbit}
                    required
                />
                 <InputField
                    label="Tanggal Terbit"
                    type="date"
                    value={tanggalTerbit}
                    onChange={e => setTanggalTerbit(e.target.value)}
                    error={errors.tanggal_terbit}
                    required
                />
                <InputField
                    label="Link File Sertifikat (Google Drive)"
                    type="url"
                    value={linkFileSertifikat}
                    onChange={e => setLinkFileSertifikat(e.target.value)}
                    placeholder="https://drive.google.com/file/..."
                    error={errors.link_file_sertifikat}
                    required
                />
                <InputField
                    label="Link Verifikasi"
                    type="url"
                    value={linkVerifikasi}
                    onChange={e => setLinkVerifikasi(e.target.value)}
                    placeholder="https://dicoding.com/certificates/..."
                    error={errors.link_verifikasi}
                />
            </div>

            {/* GANTI: Error disesuaikan */}
            {/* {errors.link_file_sertifikat && <p className="text-red-500 text-sm mt-1">{errors.link_file_sertifikat}</p>}
            {errors.link_verifikasi && <p className="text-red-500 text-sm mt-1">{errors.link_verifikasi}</p>}
            {errors.nama_penerbit && <p className="text-red-500 text-sm mt-1">{errors.nama_penerbit}</p>}
            {errors.tanggal_terbit && <p className="text-red-500 text-sm mt-1">{errors.tanggal_terbit}</p>} */}
            
            <div className="pt-4 flex justify-end">
                {/* GANTI: Teks disesuaikan untuk 'Sertifikat' */}
                <ButtonSave type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Sedang Mengirim...
                        </>
                    ) : submission ? (
                        <>
                            <i className="fas fa-sync-alt mr-2"></i>
                            Perbarui Sertifikat
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane mr-2"></i>
                            Kirim Sertifikat
                        </>
                    )}
                </ButtonSave>
            </div>
        </form>
    );
};