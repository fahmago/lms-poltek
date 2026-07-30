import React from 'react';
import Pagination from './Pagination';

const DataTableJadwal = ({ headers, rows, pagination, iconClass, title, linkButton = null }) => {
    return (
        <div className="flex flex-col mt-4 mb-4">
            <div className="w-full">
                <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                    <div className="bg-blue-700 p-4 rounded-t-md flex justify-between items-center">
                        <span className="font-bold text-white tracking-widest">
                            <i className={`${iconClass} mr-2`}></i> {title}
                        </span>
                        {linkButton}
                    </div>
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {headers.map((header, index) => (
                                            <th key={index} className="border px-4 py-2 text-center">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.length > 0 ? (
                                        rows.map((row, rowIndex) => (
                                            // MODIFIKASI DI SINI:
                                            // 1. Terapkan className dari props di elemen <tr>
                                            <tr key={rowIndex} className={`hover:bg-gray-50 ${row.className || ''}`}>
                                                {/* 2. Map data dari properti `row.data` */}
                                                {row.data.map((col, colIndex) => (
                                                    <td key={colIndex} className="border px-4 py-2 text-center">
                                                        {col}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={headers.length + 1} className="text-center py-7">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <i className="fas fa-folder-open fa-4x mb-2"></i>
                                                    <span className="text-base">Belum ada data</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {pagination && pagination.links && pagination.links.length > 0 && (
                            <Pagination links={pagination.links} align={'end'} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataTableJadwal;