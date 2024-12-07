import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import '../../../css/custom.css';
import HakAkses from './Menu/HakAkses';
// import AdminMenuSidebar from './Menu/AdminMenuSidebar';
// import AkunMenuSidebar from './Menu/AkunMenuSidebar';
// import MemberMenuSidebar from './Menu/MemberMenuSidebar';
// import ManajemenPermissionMenuSidebar from './Menu/ManajemenPermissionMenuSidebar';
// import SidebarLink from './Menu/Link/SidebarLink';
// import ProductMenuSidebar from './Menu/ProductMenuSidebar';
import hasAnyPermission from '../../Utilities/Permissions';
import SidebarLink from './Menu/Link/SidebarLink';
import Mahasiswa from './Menu/Mahasiswa';
import Dosen from './Menu/Dosen';
import Admin from './Menu/Admin';

const MySidebar = ({ activeMenu, setActiveMenu, sideOpen }) => {
    
    const { url } = usePage();

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-10 w-64 bg-white shadow-lg h-full transition-transform transform ${
        sideOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static overflow-y-auto hide-scrollbar`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-grow p-4">
          <ul className="space-y-3">

            {/* Section */}
            <li>
              <div className="px-3 lg:mt-[-54px] pt-10 font-bold"></div>
            </li>

            {hasAnyPermission(['sidebar.dashboard']) && (  
              <SidebarLink
              href={route('my.dashboard.index')}
              onClick={() => setActiveMenu('my/dashboard')}
              icon="fas fa-home"
              label="Dashboard"
              active={url.includes('my/dashboard')}
              />            
            )}         

            {/* Admin Section */}
            {hasAnyPermission(['sidebar.admin']) && (
              <Admin activeMenu={activeMenu} setActiveMenu={setActiveMenu} />              
            )}
            
            {/* Dosen Section */}
            {hasAnyPermission(['sidebar.dosen']) && (
              <Dosen activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* Mahasiswa Section */}
            {hasAnyPermission(['sidebar.mahasiswa']) && (
              <Mahasiswa activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* Hak Akses Section */}
            {hasAnyPermission(['sidebar.akses']) && (  
              <HakAkses activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}
            
          </ul>
        </nav>
        {/* <div className="p-4 text-center">
          <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded">Logout</button>
        </div> */}
      </div>
    </aside>
  );
}

export default MySidebar;
