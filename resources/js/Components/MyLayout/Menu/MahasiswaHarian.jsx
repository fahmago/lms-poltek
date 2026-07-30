import React from 'react'
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const MahasiswaHarian = ({ activeMenu, setActiveMenu }) => {
    const { url } = usePage();
  return (
    <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Mahasiswa</div>
            </li>

            {hasAnyPermission(['mhs.join.index']) && (  
              <SidebarLink
                href={route('mhs.join.index')}
                onClick={() => setActiveMenu('my/mhs/join')}
                icon="fas fa-registered"
                label="Join Kelas Harian"
                active={url.includes('my/mhs/join')}
              />
            )}

            {hasAnyPermission(['mhs.dh.kelas.index']) && (  
              <SidebarLink
                href={route('mhs.dh.kls.index')}
                onClick={() => setActiveMenu('my/mhs/harian/kelas_harian')}
                icon="fas fa-users-rectangle"
                label="Kelas Harian"
                active={url.includes('my/mhs/harian/kelas_harian')}
              />
            )}        

            {hasAnyPermission(['mhs.dh.tgs.index']) && (  
              <SidebarLink
                href={route('mhs.dh.tgs.index')}
                onClick={() => setActiveMenu('my/mhs/harian/tugas_harian')}
                icon="fas fa-hand-holding-hand"
                label="Tugas Harian"
                active={url.includes('my/mhs/harian/tugas_harian')}
              />
            )}        

            {/* {hasAnyPermission(['mhs.pekanan.index']) && (  
              <SidebarLink
                href={route('mhs.tweek.index')}
                onClick={() => setActiveMenu('mhs/pekanan/tugas-pekanan')}
                icon="fas fa-hand-holding-hand"
                label="Tugas Pekanan"
                active={url.includes('mhs/pekanan/tugas-pekanan')}
              />
            )}         */}

            {hasAnyPermission(['mhs.dh.abs.index']) && (  
              <SidebarLink
                href={route('mhs.dh.abs.index')}
                onClick={() => setActiveMenu('my/mhs/harian/absensi_harian')}
                icon="fas fa-clipboard-check"
                label="Absensi Kelas Harian"
                active={url.includes('my/mhs/harian/absensi_harian')}
              />
            )}   

            {hasAnyPermission(['mhs.dh.sholat.index']) && (  
              <SidebarLink
                href={route('mhs.laporan-ibadah.index')}
                onClick={() => setActiveMenu('my/mhs/laporan-ibadah-harian')}
                icon="fas fa-mosque"
                label="Laporan Ibadah"
                active={url.includes('my/mhs/laporan-ibadah-harian')}
              />
            )}   

            {/* {hasAnyPermission(['mhs.dh.sholat.index']) && (
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
            )} */}
            
    </>
  )
}

export default MahasiswaHarian
