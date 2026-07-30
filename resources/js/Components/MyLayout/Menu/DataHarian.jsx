import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';

const DataHarian = ({activeMenu = '', setActiveMenu }) => {
    const { url } = usePage();
    return (
        <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Data Harian Admin</div>
            </li>

            {hasAnyPermission(['kategori.kelasharian.index']) && (  
              <SidebarLink
                href={route('my.kategori_kelas_harians.index')}
                onClick={() => setActiveMenu('my/kategori-kelas-harian')}
                icon="fas fa-layer-group"
                label="Kategori Kelas"
                active={url.includes('my/kategori-kelas-harian')}
              />
            )}        

            {hasAnyPermission(['dh.kelas.index']) && (  
              <SidebarLink
                href={route('my.dh.kelas.index')}
                onClick={() => setActiveMenu('my/harian/kelas_harian')}
                icon="fas fa-chalkboard-user"
                label="Kelas Harian"
                active={url.includes('my/harian/kelas_harian')}
              />
            )}        

            {hasAnyPermission(['dh.jadwal.index']) && (  
              <SidebarLink
                href={route('my.dh.jadwal.index')}
                onClick={() => setActiveMenu('my/harian/jadwal_harian')}
                icon="fas fa-calendar-plus"
                label="Jadwal Harian"
                active={url.includes('my/harian/jadwal_harian')}
              />
            )}      

            {hasAnyPermission(['kehadiran.status.index']) && (  
              <SidebarLink
                href={route('my.kehadiran.status.index')}
                onClick={() => setActiveMenu('my/harian/status/kehadiran/mahasiswa')}
                icon="fa fa-user-check"
                label="Status Kehadiran"
                active={url.includes('my/harian/status/kehadiran/mahasiswa')}
              />
            )}      

        </>
    );
}

export default DataHarian;
