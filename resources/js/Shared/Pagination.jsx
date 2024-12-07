import React from "react";
import { Link } from '@inertiajs/inertia-react';

export default function Pagination({ links, align = 'center' }) {

  // console.log(links);
  
  const labelMapping = {
    "&laquo; Previous": "⬅️ Sebelumnya",
    "Next &raquo;": "Selanjutnya ➡️",   
  };

  const updatedLinks = links.map(link => {
    if (link.label in labelMapping) {
      return {
        ...link,
        label: labelMapping[link.label]
      };
    }
    return link; 
  });

  return (
    <>
      <nav aria-label="Page Navigation" className="mt-6">
        <ul className={`flex justify-${align} -space-x-px text-base h-10`}>
          {/* Loop through the pagination links */}
          {updatedLinks.map((link, index) => (
            <li key={index}>
              <Link
                className={`flex items-center justify-center px-4 h-10 leading-tight border ${
                  link.active ? 
                  'text-blue-600 border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white' 
                  : 
                  'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                } ${link.url === null ? 'cursor-not-allowed opacity-50' : ''}`}
                href={link.url === null ? '#' : link.url}
                dangerouslySetInnerHTML={{ __html: link.label }}
              >
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
