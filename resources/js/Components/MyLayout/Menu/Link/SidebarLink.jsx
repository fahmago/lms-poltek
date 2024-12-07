import React from 'react';
import { Link } from '@inertiajs/inertia-react';

const SidebarLink = ({ href, icon, label, active, onClick }) => {
  return (
    <li>
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center p-2 rounded transition-colors duration-200 ${
                active ? 'bg-blue-600 text-white' : 'text-black hover:bg-gray-100'
            }`}
        >
            <i className={`mr-2 ${icon}`}></i> {label}
        </Link>
    </li>
  );
};

export default SidebarLink;
