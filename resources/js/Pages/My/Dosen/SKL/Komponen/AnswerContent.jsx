import React from 'react';

// Helper component untuk merender link
const ProjectLink = ({ href, iconClass, label }) => {
  if (!href) return null;

  // Deteksi ikon otomatis untuk host populer
  let finalIconClass = iconClass;
  if (href.includes('github.com')) finalIconClass = 'fab fa-github';
  else if (href.includes('gitlab.com')) finalIconClass = 'fab fa-gitlab';
  else if (href.includes('figma.com')) finalIconClass = 'fab fa-figma';
  else if (href.includes('youtube.com') || href.includes('youtu.be')) finalIconClass = 'fab fa-youtube';
  else finalIconClass = 'fa-solid fa-globe';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-sm flex items-center gap-2"
      title={href} // Tampilkan link penuh saat hover
    >
      <i className={`${finalIconClass} text-gray-400`}></i> {label}
    </a>
  );
};

// Helper component untuk merender path file
const FilePath = ({ path }) => {
    if (!path) return null;
    return (
        <span className="text-gray-600 text-sm flex items-center gap-2" title={path}>
            <i className="fa fa-file-alt text-gray-400"></i> Laporan
        </span>
    );
};


// Komponen utama yang disesuaikan untuk Project Semester
// Prop 'tugasPekanan' diganti menjadi 'projectSemester'
export default function AnswerContent({ submission, projectSemester, nameMhs = '' }) {

    // Jika belum mengumpulkan, tampilkan pesan
    if (!submission)
        return <span className="text-xs text-gray-400 italic">Belum mengumpulkan</span>;

    // Hapus semua state dan logic modal YouTube
    // const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false); ...

    // Hapus pengecekan 'tipe_tugas'
    // if (projectSemester.tipe_tugas === 'yt') { ... } // (Tidak ada tipe_tugas)

    // Langsung render link/path dari submission project semester
    return (
        <div className="flex flex-col gap-1 mt-2">
            <ProjectLink
                href={submission.link_repository}
                iconClass="fa-code-branch" // Default icon jika host tidak dikenal
                label="Repository"
            />
            <ProjectLink
                href={submission.link_demo}
                iconClass="fa-play-circle" // Default icon
                label="Demo"
            />
            <FilePath
                path={submission.path_file_laporan}
            />
        </div>
    );
};