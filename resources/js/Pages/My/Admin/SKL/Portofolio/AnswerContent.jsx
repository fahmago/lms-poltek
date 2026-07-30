import React from 'react';

// Helper component untuk merender link (dari contoh Anda)
const ProjectLink = ({ href, iconClass, label }) => {
    if (!href) return null;

    // Pastikan URL memiliki protokol
    let fullHref = href;
    if (!fullHref.startsWith('http://') && !fullHref.startsWith('https://')) {
        fullHref = 'https://' + fullHref;
    }

    // Deteksi ikon otomatis untuk host populer
    let finalIconClass = iconClass;
    if (href.includes('github.com')) finalIconClass = 'fab fa-github';
    else if (href.includes('gitlab.com')) finalIconClass = 'fab fa-gitlab';
    else if (href.includes('figma.com')) finalIconClass = 'fab fa-figma';
    else if (href.includes('youtube.com') || href.includes('youtu.be')) finalIconClass = 'fab fa-youtube';
    else finalIconClass = 'fa-solid fa-globe';


    return (
        <a
            href={fullHref} // Gunakan URL yang sudah divalidasi
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center gap-2"
            title={fullHref} // Tampilkan link penuh saat hover
        >
            <i className={`${finalIconClass} text-gray-400`}></i> {label}
        </a>
    );
};

// Komponen ini spesifik untuk menampilkan hasil submission Portofolio
// (Hanya link_repository dan link_demo)
export default function AnswerContent({ submission, portofolio, nameMhs }) {
    if (!submission) {
        return <span className="text-xs text-gray-400 italic">Belum ada pengumpulan.</span>;
    }

    const { link_repository, link_demo } = submission;

    // Hapus fungsi openInNewTab, sudah ditangani ProjectLink

    return (
        <div className="flex flex-col gap-1 mt-2">
            <ProjectLink
                href={submission.link_repository}
                iconClass="fa-code-branch" // Fallback icon
                label="Repository"
            />
            <ProjectLink
                href={submission.link_demo}
                iconClass="fa-globe" // Fallback icon
                label="Detail"
            />

            {/* Tampilkan pesan jika tidak ada link sama sekali */}
            {!link_repository && !link_demo && (
                <span className="text-xs text-gray-500 italic">Tidak ada link yang dilampirkan.</span>
            )}
        </div>
    );
}