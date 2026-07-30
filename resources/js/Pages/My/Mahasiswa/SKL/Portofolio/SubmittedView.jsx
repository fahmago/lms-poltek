import React from 'react';
// Path disesuaikan untuk naik 6 level
import formatDate from '@/Utilities/formatDateTime'; 

// Helper untuk ikon link
const LinkIcon = ({ href }) => {
    let iconClass = 'fa fa-link'; // Default
    if (href.includes('github.com')) iconClass = 'fab fa-github';
    else if (href.includes('gitlab.com')) iconClass = 'fab fa-gitlab';
    else if (href.includes('figma.com')) iconClass = 'fab fa-figma';
    else if (href.includes('youtube.com') || href.includes('youtu.be')) iconClass = 'fab fa-youtube';
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

export default function SubmittedView({ submission, tugas }) { 
    if (!submission) return null;
    return (
        <div className="space-y-4">
            {/* GANTI: Teks "Project" -> "Portofolio" */}
            <h3 className="text-lg font-semibold text-gray-800">Portofolio Terkirim</h3>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-inner">
                <p className="text-sm text-gray-500 mb-4 font-mono">
                    Dikumpulkan pada: {formatDate(submission.created_at, { includeTime: true })}
                </p>

                <div className="space-y-4">
                    <SubmissionLink label="Link Repository" href={submission.link_repository} />
                    <SubmissionLink label="Link Detail" href={submission.link_demo} />
                </div>

            </div>
            
        </div>
    );
}

