import React from 'react';

// Helper component untuk merender link
const ProjectLink = ({ href, iconClass, label }) => {
    if (!href) return null;

    // Deteksi ikon otomatis
    let finalIconClass = iconClass;
    if (href.includes('github.com')) finalIconClass = 'fab fa-github';
    else if (href.includes('gitlab.com')) finalIconClass = 'fab fa-gitlab';
    else if (href.includes('figma.com')) finalIconClass = 'fab fa-figma';
    else if (href.includes('canva.com')) finalIconClass = 'fa fa-palette';
    else if (href.includes('docs.google.com')) finalIconClass = 'fa fa-file-word';
    else if (href.includes('drive.google.com')) finalIconClass = 'fab fa-google-drive';
    else if (href.includes('youtube.com') || href.includes('youtu.be')) finalIconClass = 'fab fa-youtube';
    else finalIconClass = 'fa-solid fa-link';

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

// GANTI: 'portofolio' -> 'buku'
export default function AnswerContent({ submission, buku, nameMhs = '' }) {
    
    if (!submission)
        return <span className="text-xs text-gray-400 italic">Belum mengumpulkan</span>;

    // GANTI: Sesuaikan dengan kolom migrasi 'pengumpulan_bukus'
    return (
        <div className="flex flex-col gap-1 mt-2">
            <ProjectLink 
                href={submission.link_naskah_draft} 
                iconClass="fa-file-alt" // Icon default untuk draf
                label="Naskah Draft" 
            />
            <ProjectLink 
                href={submission.link_hasil_buku} 
                iconClass="fa-book-open" // Icon default untuk hasil
                label="Hasil Buku" 
            />
            
            {/* Tampilkan pesan jika tidak ada link sama sekali */}
            {!submission.link_naskah_draft && !submission.link_hasil_buku && (
                <span className="text-xs text-gray-500 italic">Tidak ada link yang dilampirkan.</span>
            )}
        </div>
    );
};