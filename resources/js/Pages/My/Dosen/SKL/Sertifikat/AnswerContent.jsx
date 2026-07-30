import React from 'react';
import formatDate from '@/Utilities/formatDate'; // Import formatDate

// Helper component untuk merender link
const ProjectLink = ({ href, iconClass, label }) => {
    if (!href) return null;

    // Deteksi ikon
    let finalIconClass = iconClass;
    if (href.includes('drive.google.com') || href.includes('docs.google.com')) finalIconClass = 'fab fa-google-drive';
    // ...tambahkan deteksi lain jika perlu

    // Pastikan URL memiliki protokol
    const properHref = (href.startsWith('http://') || href.startsWith('https://')) ? href : `https://${href}`;

    return (
        <a
            href={properHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center gap-2"
            title={properHref}
        >
            <i className={`${finalIconClass} text-gray-400`}></i> {label}
        </a>
    );
};

// Helper component untuk info teks
const InfoText = ({ label, value, iconClass }) => {
    if (!value) return null;
    return (
        <div className="text-sm flex items-center gap-2 text-gray-700">
            <i className={`${iconClass} text-gray-400`}></i>
            <span className="font-medium">{label}:</span>
            <span>{value}</span>
        </div>
    );
};


// GANTI: 'buku' -> 'sertifikat'
export default function AnswerContent({ submission, sertifikat, nameMhs = '' }) {
    
    if (!submission)
        return <span className="text-xs text-gray-400 italic">Belum mengumpulkan</span>;

    // Render field dari 'pengumpulan_sertifikats'
    return (
        <div className="flex flex-col gap-1.5 mt-2">
            <InfoText 
                label="Penerbit"
                value={submission.nama_penerbit}
                iconClass="fa fa-building"
            />
             <InfoText 
                label="Tgl. Terbit"
                value={submission.tanggal_terbit ? formatDate(submission.tanggal_terbit, { includeTime: false }) : null}
                iconClass="fa fa-calendar-check"
            />
            <ProjectLink 
                href={submission.link_file_sertifikat} 
                iconClass="fa fa-file-pdf" // Icon default untuk file
                label="File Sertifikat (Link)" 
            />
            <ProjectLink 
                href={submission.link_verifikasi} 
                iconClass="fa fa-shield-alt" // Icon default untuk verifikasi
                label="Link Verifikasi" 
            />
            
            {!submission.link_file_sertifikat && !submission.link_verifikasi && !submission.nama_penerbit && (
                <span className="text-xs text-gray-500 italic">Tidak ada data yang dilampirkan.</span>
            )}
        </div>
    );
};