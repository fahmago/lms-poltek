import React from 'react';
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const Admin = ({activeMenu = '', setActiveMenu }) => {
  const { url } = usePage();
    return (
        <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Admin</div>
            </li>

            {hasAnyPermission(['angkatans.index']) && (  
              <SidebarLink
                href={route('my.angkatans.index')}
                onClick={() => setActiveMenu('my/angkatan')}
                icon="fas fa-calendar-days"
                label="Angkatan"
                active={url.includes('my/angkatan')}
              />
            )}

            {hasAnyPermission(['prodis.index']) && (  
              <SidebarLink
                href={route('my.prodis.index')}
                onClick={() => setActiveMenu('my/prodi')}
                icon="fas fa-building-columns"
                label="Prodi"
                active={url.includes('my/prodi')}
              />
            )}

            {hasAnyPermission(['mahasiswas.index']) && (  
              <SidebarLink
                href={route('my.mahasiswas.index')}
                onClick={() => setActiveMenu('my/mahasiswa')}
                icon="fas fa-user-graduate"
                label="Mahasiswa"
                active={url.includes('my/mahasiswa')}
              />
            )}

            {hasAnyPermission(['dosens.index']) && (  
              <SidebarLink
                href={route('my.dosens.index')}
                onClick={() => setActiveMenu('my/dosen')}
                icon="fas fa-user-tie"
                label="Pengajar"
                active={url.includes('my/dosen')}
              />
            )}

            {hasAnyPermission(['matkuls.index']) && (  
              <SidebarLink
                href={route('my.matkuls.index')}
                onClick={() => setActiveMenu('my/matkul')}
                icon="fas fa-book"
                label="Mata Kuliah"
                active={url.includes('my/matkul')}
              />
            )}

            {hasAnyPermission(['kelas.index']) && (  
              <SidebarLink
                href={route('my.kelas.index')}
                onClick={() => setActiveMenu('my/kelas')}
                icon="fas fa-chalkboard-user"
                label="Kelas"
                active={url.includes('my/kelas')}
              />
            )}        

            {hasAnyPermission(['jadwal.index']) && (  
              <SidebarLink
                href={route('my.jadwal.index')}
                onClick={() => setActiveMenu('my/jadwal')}
                icon="fas fa-calendar-plus"
                label="Jadwal"
                active={url.includes('my/jadwal')}
              />
            )}        

        </>
    )
}

export default Admin
