import React from 'react'
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const Mahasiswa = ({ activeMenu, setActiveMenu }) => {
    const { url } = usePage();
  return (
    <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Mahasiswa</div>
            </li>

            {hasAnyPermission(['mhs.reg.index']) && (  
              <SidebarLink
                href={route('mhs.reg.index')}
                onClick={() => setActiveMenu('my/mhs/reg')}
                icon="fas fa-registered"
                label="Registrasi Kelas"
                active={url.includes('my/mhs/reg')}
              />
            )}

            {hasAnyPermission(['mhs.kls.index']) && (  
              <SidebarLink
                href={route('mhs.kls.index')}
                onClick={() => setActiveMenu('my/mhs/kelas')}
                icon="fas fa-users-rectangle"
                label="Kelas"
                active={url.includes('my/mhs/kelas')}
              />
            )}

            {hasAnyPermission(['mhs.tgs.index']) && (  
              <SidebarLink
                href={route('mhs.tgs.index')}
                onClick={() => setActiveMenu('my/mhs/tugas')}
                icon="fas fa-hand-holding-hand"
                label="Tugas"
                active={url.includes('my/mhs/tugas')}
              />
            )}

            {hasAnyPermission(['mhs.mtr.index']) && (  
              <SidebarLink
                href={route('mhs.mtr.index')}
                onClick={() => setActiveMenu('my/mhs/materi')}
                icon="fas fa-person-chalkboard"
                label="Materi"
                active={url.includes('my/mhs/materi')}
              />
            )}

            {hasAnyPermission(['mhs.abs.index']) && (  
              <SidebarLink
                href={route('mhs.abs.index')}
                onClick={() => setActiveMenu('my/mhs/absensi')}
                icon="fas fa-clipboard-check"
                label="Absensi Kelas"
                active={url.includes('my/mhs/absensi')}
              />
            )}

    </>
  )
}

export default Mahasiswa
