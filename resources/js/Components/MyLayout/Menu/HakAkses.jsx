import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';

const HakAkses = ({activeMenu = '', setActiveMenu }) => {
    const { url } = usePage();
    return (
        <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Hak Akses</div>
            </li>

            {hasAnyPermission(['users.index']) && (  
              <SidebarLink
                href={route('my.users.index')}
                onClick={() => setActiveMenu('my/users')}
                icon="fas fa-users"
                label="Pengguna"
                active={url.includes('my/users')}
              />
            )}

            {hasAnyPermission(['roles.index']) && (
              <SidebarLink
                href={route('my.roles.index')}
                onClick={() => setActiveMenu('my/roles')}
                icon="fas fa-shield-alt"
                label="Roles"
                active={url.includes('my/roles')}
              />
            )}

            {hasAnyPermission(['permissions.index']) && (
              <SidebarLink
                href={route('my.permissions.index')}
                onClick={() => setActiveMenu('my/permissions')}
                icon="fas fa-key"
                label="Permissions"
                active={url.includes('my/permissions')}
              />
            )}

            {/* <li> 
              <a
                href="#users"
                onClick={() => setActiveMenu('users""')}
                className={`flex items-center p-2 rounded transition-colors duration-200 ${
                  activeMenu === 'users""' ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-users mr-2"></i> Pengguna
              </a>
            </li> */}

        </>
    );
}

export default HakAkses;
