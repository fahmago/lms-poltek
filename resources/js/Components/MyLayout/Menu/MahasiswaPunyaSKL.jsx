import React from 'react'
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const MahasiswaPunyaSKL = ({ activeMenu, setActiveMenu }) => {
  const { url } = usePage();
  const { auth } = usePage().props;
  return (
    <>
      <li>
        <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Skl Mahasiswa</div>
      </li>

      {hasAnyPermission(['mhs.pekanan.index']) && (
        <SidebarLink
          href={route('mhs.tweek.index')}
          onClick={() => setActiveMenu('mhs/pekanan/tugas-pekanan')}
          icon="fas fa-hand-holding-hand"
          label="Tugas Pekanan"
          active={url.includes('mhs/pekanan/tugas-pekanan')}
        />
      )}

      {hasAnyPermission(['mhs.project.semester.index']) && (
        <SidebarLink
          href={route('mhs.tsem.index')}
          onClick={() => setActiveMenu('mhs/project-semester')}
          icon="fas fa-laptop-code"
          label="Project Semester"
          active={url.includes('mhs/project-semester')}
        />
      )}

      {hasAnyPermission(['mhs.portofolio.index']) && (
        <SidebarLink
          href={route('mhs.portofolio.index')}
          onClick={() => setActiveMenu('mhs/portofolio')}
          icon="fas fa-star"
          label="Portofolio"
          active={url.includes('mhs/portofolio')}
        />
      )}

      {hasAnyPermission(['mhs.buku.index']) && (
        <SidebarLink
          href={route('mhs.buku.index')}
          onClick={() => setActiveMenu('mhs/buku')}
          icon="fas fa-book"
          label="Buku"
          active={url.includes('mhs/buku')}
        />
      )}

      {hasAnyPermission(['mhs.sertifikat.index']) && (
        <SidebarLink
          href={route('mhs.sertifikat.index')}
          onClick={() => setActiveMenu('mhs/sertifikat')}
          icon="fas fa-certificate"
          label="Sertifikat"
          active={url.includes('mhs/sertifikat')}
        />
      )}

      {hasAnyPermission(['mhs.lihat.skl']) && (
        <a
          href={route('my.lap.index', {
            mahasiswaUuid: auth.mhs?.uuid || 0
          })}
          target="_blank"
          className={`flex items-center p-2 rounded transition-colors duration-200 ${activeMenu === 'laporan/skl'
            ? 'bg-blue-600 text-white'
            : 'text-black hover:bg-gray-100'
            }`}
        >
          {/* <i className="fa-regular fa-file-lines mr-2"></i> Laporan SKL */}
          <i className="fas fa-file-pdf mr-2"></i> Laporan SKL
        </a>
      )}

    </>
  )
}

export default MahasiswaPunyaSKL;
