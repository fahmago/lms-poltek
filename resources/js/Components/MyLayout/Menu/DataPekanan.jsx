import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';

const DataPekanan = ({activeMenu = '', setActiveMenu }) => {
    const { url } = usePage();
    return (
        <>
            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Data Pekanan</div>
            </li>

            {hasAnyPermission(['pekanan.index']) && (  
              <SidebarLink
                href={route('my.tweek.index')}
                onClick={() => setActiveMenu('my/tweek')}
                icon="fas fa-hand-holding-hand"
                label="Tugas Pekanan"
                active={url.includes('my/tweek')}
              />
            )}            

        </>
    );
}

export default DataPekanan;
