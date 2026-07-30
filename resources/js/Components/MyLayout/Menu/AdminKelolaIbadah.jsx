import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import SidebarLink from './Link/SidebarLink';
import hasAnyPermission from '../../../Utilities/Permissions';

const AdminKelolaIbadah = ({ activeMenu = '', setActiveMenu }) => {
  const { url } = usePage();
  return (
    <>
      <li>
        <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Ibadah Harian</div>
      </li>

      {hasAnyPermission(['pertanyaan.ibadah.index']) && (
        <SidebarLink
          href={route('my.pertanyaan.ibadah.index')}
          onClick={() => setActiveMenu('my/pertanyaan-ibadah')}
          icon="fas fa-clipboard-question"
          label="Data Pertanyaan"
          active={url.includes('my/pertanyaan-ibadah')}
        />
      )}


    </>
  );
}

export default AdminKelolaIbadah;
