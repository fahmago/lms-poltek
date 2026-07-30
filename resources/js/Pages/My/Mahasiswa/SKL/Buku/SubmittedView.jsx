import React from 'react';
import formatDate from '@/Utilities/formatDateTime'; // Menggunakan alias

// Helper untuk ikon link (Sama)
const LinkIcon = ({ href }) => {
    let iconClass = 'fa fa-link'; // Default
    if (href.includes('github.com')) iconClass = 'fab fa-github';
    else if (href.includes('gitlab.com')) iconClass = 'fab fa-gitlab';
    // Tambahkan ikon spesifik buku jika perlu
    else if (href.includes('docs.google.com')) iconClass = 'fa fa-file-word';
    else if (href.includes('canva.com')) iconClass = 'fa fa-palette';
    else if (href.includes('drive.google.com')) iconClass = 'fab fa-google-drive';

    return <i className={`${iconClass} fa-lg text-gray-700`}></i>;
};

// Komponen untuk menampilkan link pengumpulan (Sama)
const SubmissionLink = ({ label, href }) => {
    if (!href) return null;
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 mt-1 bg-white rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors"
            >
                <LinkIcon href={href} />
                <span className="text-sm text-gray-800 truncate font-medium">{href}</span>
                <i className="fa fa-external-link-alt text-gray-400 ml-auto"></i>
            </a>
        </div>
    );
};

export default function SubmittedView({ submission, tugas }) { 
    if (!submission) return null;
    return (
        <div className="space-y-4">
            {/* GANTI: Teks "Portofolio" -> "Buku" */}
            <h3 className="text-lg font-semibold text-gray-800">Buku Terkirim</h3>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-inner">
                <p className="text-sm text-gray-500 mb-4 font-mono">
                    Dikumpulkan pada: {formatDate(submission.created_at, { includeTime: true })}
                </p>

                <div className="space-y-4">
                    {/* GANTI: Sesuaikan label dan field
                        'link_repository' -> 'link_naskah_draft'
                        'link_demo' -> 'link_hasil_buku'
                    */}
                    <SubmissionLink label="Link Naskah Draft" href={submission.link_naskah_draft} />
                    <SubmissionLink label="Link Hasil Buku" href={submission.link_hasil_buku} />
                </div>

            </div>
            
        </div>
    );
}