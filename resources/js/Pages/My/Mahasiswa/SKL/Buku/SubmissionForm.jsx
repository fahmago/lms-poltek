import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import InputField from '@/Shared/Fields/InputField'; // Menggunakan alias
import ButtonSave from '@/Shared/ButtonSave'; // Menggunakan alias

// GANTI: 'tugas: portofolio' -> 'tugas: buku'
export default function SubmissionForm({ tugas: buku, submission }) { 
    const { errors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // GANTI: State disesuaikan untuk field 'buku'
    const [linkNaskahDraft, setLinkNaskahDraft] = useState(submission?.link_naskah_draft || '');
    const [linkHasilBuku, setLinkHasilBuku] = useState(submission?.link_hasil_buku || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // GANTI: dataToSend disesuaikan untuk 'buku'
        const dataToSend = {
            link_naskah_draft: linkNaskahDraft,
            link_hasil_buku: linkHasilBuku,
        };

        // GANTI: route 'mhs.portofolio.submit' -> 'mhs.buku.submit' & param
        Inertia.post(route('mhs.buku.submit', { buku: buku.uuid }), dataToSend, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* GANTI: Teks "Portofolio" -> "Buku" */}
            <h3 className="text-lg font-semibold text-gray-800">{submission ? 'Perbarui Buku' : 'Kumpulkan Buku'}</h3>
            
            <div className="space-y-4">
                {/* GANTI: Field untuk Naskah Draft */}
                <InputField
                    label="Link Naskah Draft"
                    type="url"
                    value={linkNaskahDraft}
                    onChange={e => setLinkNaskahDraft(e.target.value)}
                    placeholder="https://docs.google.com/document/..."
                    error={errors.link_naskah_draft} // Error spesifik
                />
                {/* GANTI: Field untuk Hasil Buku */}
                <InputField
                    label="Link Hasil Buku"
                    type="url"
                    value={linkHasilBuku}
                    onChange={e => setLinkHasilBuku(e.target.value)}
                    placeholder="https://drive.google.com/file/..."
                    error={errors.link_hasil_buku} // Error spesifik
                />
            </div>

            {/* GANTI: Error disesuaikan */}
            {errors.link_naskah_draft && !errors.link_hasil_buku && (
                <p className="text-red-500 text-sm mt-1">{errors.link_naskah_draft}</p>
            )}
             {errors.link_hasil_buku && !errors.link_naskah_draft && (
                <p className="text-red-500 text-sm mt-1">{errors.link_hasil_buku}</p>
            )}
            
            <div className="pt-4 flex justify-end">
                {/* GANTI: Teks disesuaikan untuk 'Buku' */}
                <ButtonSave type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Sedang Mengirim...
                        </>
                    ) : submission ? (
                        <>
                            <i className="fas fa-sync-alt mr-2"></i>
                            Perbarui Buku
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane mr-2"></i>
                            Kirim Buku
                        </>
                    )}
                </ButtonSave>
            </div>
        </form>
    );
};