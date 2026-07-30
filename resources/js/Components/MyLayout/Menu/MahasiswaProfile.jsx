import React from 'react'
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';
import { usePage } from '@inertiajs/inertia-react';

const MahasiswaProfile = ({ activeMenu, setActiveMenu }) => {
    const { url } = usePage();
  return (
    <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Profile</div>
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

            {hasAnyPermission(['mhs.nim.index']) && (  
              <SidebarLink
                href={route('mhs.nim.index')}
                onClick={() => setActiveMenu('my/mhs/nim')}
                icon="fas fa-id-card-clip"
                label="Update Nim"
                active={url.includes('my/mhs/nim')}
              />
            )}
    </>
  )
}

export default MahasiswaProfile
