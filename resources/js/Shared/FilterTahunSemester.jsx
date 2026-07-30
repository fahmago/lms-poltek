import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { pickBy } from 'lodash';

const FilterTahunSemester = ({ 
    availableYears = [], 
    filters = {}, 
    url, 
    className = "" 
}) => {
    
    // Ambil nilai saat ini
    const currentYear = filters.tahun || new Date().getFullYear();
    const currentSemester = filters.semester || 'all';

    const handleFilterChange = (key, value) => {
        const queryParams = pickBy({
            ...filters,
            [key]: value,
        });

        Inertia.get(url, queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className={`flex flex-col md:flex-row gap-3 ${className}`}>
            
            {/* Filter Tahun dengan Ikon */}
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <i className="fa fa-calendar-alt"></i>
                </div>
                <select
                    value={currentYear}
                    onChange={(e) => handleFilterChange('tahun', e.target.value)}
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                >
                    <option value="all">Semua Tahun</option>
                    {availableYears.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* Filter Semester dengan Ikon */}
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <i className="fa fa-layer-group"></i>
                </div>
                <select
                    value={currentSemester}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                    // className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                >
                    <option value="all">Semua Semester</option>
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                </select>
            </div>
        </div>
    );
};

export default FilterTahunSemester;