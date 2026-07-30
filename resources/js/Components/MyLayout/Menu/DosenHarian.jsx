import React from 'react'
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const DosenHarian = ({ activeMenu, setActiveMenu }) => {
  const { url } = usePage();
  return (
    <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Data Harian</div>
            </li>

            {hasAnyPermission(['dsn.dh.kelas.index']) && (  
              <SidebarLink
                href={route('dsn.dh.kelas.index')}
                onClick={() => setActiveMenu('my/d/harian/kelas_harian')}
                icon="fas fa-users-rectangle"
                label="Kelas Harian"
                active={url.includes('my/d/harian/kelas_harian')}
              />
            )}   

            {hasAnyPermission(['dsn.dh.mtr.index']) && (  
              <SidebarLink
                href={route('dsn.dh.materi.index')}
                onClick={() => setActiveMenu('my/d/harian/materi_harian')}
                icon="fas fa-chalkboard"
                label="Materi Harian"
                active={url.includes('my/d/harian/materi_harian')}
              />
            )}     

            {hasAnyPermission(['dsn.dh.tugas.index']) && (  
              <SidebarLink
                href={route('dsn.dh.tugas.index')}
                onClick={() => setActiveMenu('my/d/harian/tugas_harian')}
                icon="fas fa-hand-holding-hand"
                label="Tugas Harian"
                active={url.includes('my/d/harian/tugas_harian')}
              />
            )}   

            {/* {hasAnyPermission(['dsn.pekanan.index']) && (  
              <SidebarLink
                href={route('dsn.tweek.index')}
                onClick={() => setActiveMenu('my/d/tugas-pekanan')}
                icon="fas fa-hand-holding-hand"
                label="Tugas Pekanan"
                active={url.includes('my/d/tugas-pekanan')}
              />
            )}    */}

            {hasAnyPermission(['dsn.dh.jadwal.index']) && (  
              <SidebarLink
                href={route('dsn.dh.jadwal.index')}
                onClick={() => setActiveMenu('my/d/harian/jadwal_harian')}
                icon="fas fa-calendar-check"
                label="Jadwal Harian"
                active={url.includes('my/d/harian/jadwal_harian')}
              />
            )}   
    </>
  )
}

export default DosenHarian
