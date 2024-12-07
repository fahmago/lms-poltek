import React from 'react'
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const Dosen = ({ activeMenu, setActiveMenu }) => {
  const { url } = usePage();
  return (
    <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Dosen</div>
            </li>

            {hasAnyPermission(['dsn.kls.index']) && (  
              <SidebarLink
                href={route('dsn.kelas.index')}
                onClick={() => setActiveMenu('my/d/kelas')}
                icon="fas fa-users-rectangle"
                label="Kelas"
                active={url.includes('my/d/kelas')}
              />
            )}

            {hasAnyPermission(['dsn.mtr.index']) && (  
              <SidebarLink
                href={route('dsn.materi.index')}
                onClick={() => setActiveMenu('my/d/materi')}
                icon="fas fa-chalkboard"
                label="Materi"
                active={url.includes('my/d/materi')}
              />
            )}

            {hasAnyPermission(['dsn.tgs.index']) && (  
              <SidebarLink
                href={route('dsn.tugas.index')}
                onClick={() => setActiveMenu('my/d/tugas')}
                icon="fas fa-hand-holding-hand"
                label="Tugas"
                active={url.includes('my/d/tugas')}
              />
            )}

            {hasAnyPermission(['dsn.jdwl.index']) && (  
              <SidebarLink
                href={route('dsn.jdwl.index')}
                onClick={() => setActiveMenu('my/d/schedules')}
                icon="fas fa-calendar-check"
                label="Jadwal"
                active={url.includes('my/d/schedules')}
              />
            )}  

            {/* <li>
              <a
                href="#tugas"
                onClick={() => setActiveMenu('tugas"')}
                className={`flex items-center p-2 rounded transition-colors duration-200 ${
                  activeMenu === 'tugas"' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-hand-holding-hand mr-2"></i> Tugas
              </a>
            </li> */}
    </>
  )
}

export default Dosen
