import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';

const DataSklMahasiswa = ({ activeMenu = '', setActiveMenu }) => {
  const { url } = usePage();
  return (
    <>
      <li>
        <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Skl Mahasiswa</div>
      </li>

      {hasAnyPermission(['pekanan.index']) && (
        <SidebarLink
          href={route('my.tweek.index')}
          onClick={() => setActiveMenu('my/tweek')}
          icon="fas fa-hand-holding-hand"
          label="Tugas Pekanan"
          active={url.includes('my/tweek')}
        />
      )}

      {hasAnyPermission(['project.semester.index']) && (
        <SidebarLink
          href={route('my.project_semester.index')}
          onClick={() => setActiveMenu('my/project-semester')}
          icon="fas fa-laptop-code"
          label="Project Semester"
          active={url.includes('my/project-semester')}
        />
      )}

      {hasAnyPermission(['portofolio.index']) && (
        <SidebarLink
          href={route('my.portofolio.index')}
          onClick={() => setActiveMenu('my/portofolio')}
          icon="fas fa-star"
          label="Portofolio"
          active={url.includes('my/portofolio')}
        />
      )}

      {hasAnyPermission(['buku.index']) && (
        <SidebarLink
          href={route('my.buku.index')}
          onClick={() => setActiveMenu('my/buku')}
          icon="fas fa-book"
          label="Buku"
          active={url.includes('my/buku')}
        />
      )}

      {hasAnyPermission(['sertifikat.index']) && (
        <SidebarLink
          href={route('my.sertifikat.index')}
          onClick={() => setActiveMenu('my/sertifikat')}
          icon="fas fa-certificate"
          label="Sertifikat"
          active={url.includes('my/sertifikat')}
        />
      )}


    </>
  );
}

export default DataSklMahasiswa;
