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

            <li>
              <a
                href="#absensholat"
                onClick={() => setActiveMenu('absensholat')}
                className={`flex items-center p-2 rounded transition-colors duration-200 ${
                  activeMenu === 'absensholat' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-mosque mr-2"></i> Absensi Sholat
              </a>
            </li>

            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Pengaturan</div>
            </li>

            {hasAnyPermission(['mhs.pro.index']) && (  
              <SidebarLink
                href={route('mhs.profil.index')}
                onClick={() => setActiveMenu('my/mhs/profil')}
                icon="fas fa-user-graduate"
                label="My Profil"
                active={url.includes('my/mhs/profil')}
              />
            )}
    </>
  )
}

export default Mahasiswa
