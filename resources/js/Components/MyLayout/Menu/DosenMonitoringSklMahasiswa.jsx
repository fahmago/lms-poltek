import React from 'react'
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const DosenMonitoringSklMahasiswa = ({ activeMenu, setActiveMenu }) => {
  const { url } = usePage();
  return (
    <>
      <li>
        <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">skl mahasiswa</div>
      </li>

      {hasAnyPermission(['dsn.pekanan.index']) && (
        <SidebarLink
          href={route('dsn.tweek.index')}
          onClick={() => setActiveMenu('my/d/tugas-pekanan')}
          icon="fas fa-hand-holding-hand"
          label="Tugas Pekanan"
          active={url.includes('my/d/tugas-pekanan')}
        />
      )}

      {hasAnyPermission(['dsn.project.semester.index']) && (
        <SidebarLink
          href={route('dsn.tsem.index')}
          onClick={() => setActiveMenu('d/project-semester')}
          icon="fas fa-laptop-code"
          label="Project Semester"
          active={url.includes('d/project-semester')}
        />
      )}

      {hasAnyPermission(['dsn.portofolio.index']) && (
        <SidebarLink
          href={route('dsn.portofolio.index')}
          onClick={() => setActiveMenu('d/portofolio')}
          icon="fas fa-star"
          label="Portofolio"
          active={url.includes('d/portofolio')}
        />
      )}

      {hasAnyPermission(['dsn.buku.index']) && (
        <SidebarLink
          href={route('dsn.buku.index')}
          onClick={() => setActiveMenu('d/buku')}
          icon="fas fa-book"
          label="Buku"
          active={url.includes('d/buku')}
        />
      )}

      {hasAnyPermission(['dsn.sertifikat.index']) && (
        <SidebarLink
          href={route('dsn.sertifikat.index')}
          onClick={() => setActiveMenu('d/sertifikat')}
          icon="fas fa-certificate"
          label="Sertifikat"
          active={url.includes('d/sertifikat')}
        />
      )}

    </>
  )
}

export default DosenMonitoringSklMahasiswa
