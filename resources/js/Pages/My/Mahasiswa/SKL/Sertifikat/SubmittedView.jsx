import React from 'react';
import formatDate from '@/Utilities/formatDateTime'; // Menggunakan alias

// Helper untuk ikon link
const LinkIcon = ({ href }) => {
    let iconClass = 'fa fa-link'; // Default
    if (href.includes('drive.google.com') || href.includes('docs.google.com')) iconClass = 'fab fa-google-drive';
    else if (href.includes('dicoding.com')) iconClass = 'fa fa-shield-alt';
    else if (href.includes('coursera.org')) iconClass = 'fa fa-graduation-cap';
    return <i className={`${iconClass} fa-lg text-gray-700`}></i>;
};

// Komponen untuk menampilkan link pengumpulan
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

// Komponen untuk info teks (Baru)
const SubmissionInfo = ({ label, value, iconClass }) => {
    if (!value) return null;
    return (
         <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
            <div className="flex items-center gap-3 p-3 mt-1 bg-white rounded-lg shadow-sm border border-gray-200">
                <i className={`${iconClass} fa-lg text-gray-700`}></i>
                <span className="text-sm text-gray-800 font-medium">{value}</span>
            </div>
        </div>
    );
}

export default function SubmittedView({ submission, tugas }) { 
    if (!submission) return null;
    return (
        <div className="space-y-4">
            {/* GANTI: Teks "Buku" -> "Sertifikat" */}
            <h3 className="text-lg font-semibold text-gray-800">Sertifikat Terkirim</h3>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-inner">
                <p className="text-sm text-gray-500 mb-4 font-mono">
                    Dikumpulkan pada: {formatDate(submission.created_at, { includeTime: true })}
                </p>

                <div className="space-y-4">
                    {/* GANTI: Sesuaikan label dan field
                        'link_naskah_draft' -> 'nama_penerbit'
                        'link_hasil_buku' -> 'tanggal_terbit'
                        Tambah link_file_sertifikat dan link_verifikasi
                    */}
                    <SubmissionInfo 
                        label="Nama Penerbit" 
                        value={submission.nama_penerbit}
                        iconClass="fa fa-building"
                    />
                    <SubmissionInfo 
                        label="Tanggal Terbit" 
                        value={formatDate(submission.tanggal_terbit, { includeTime: false })}
                        iconClass="fa fa-calendar-check"
                    />
                    <SubmissionLink 
                        label="Link File Sertifikat (PDF/Gambar)" 
                        href={submission.link_file_sertifikat} 
                    />
                    <SubmissionLink 
                        label="Link Verifikasi" 
                        href={submission.link_verifikasi} 
                    />
                </div>

            </div>
            
        </div>
    );
}