import React from 'react';
import SelectField2 from '@/Shared/Fields/SelectField2';

const TugasPekananFilter = ({ filters, setFilters, angkatans, onReset }) => {
    const hasActiveFilter = filters.tahun_angkatan || filters.semester;

    // Fungsi reset yang juga memastikan select dikosongkan sepenuhnya
    const handleReset = () => {
        setFilters({
            tahun_angkatan: '',
            semester: '',
        });

        // Pastikan SelectField2 ikut refresh
        if (onReset) onReset();
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-1 mt-4">
            <h2 className="text-gray-700 font-semibold mb-4 text-lg">
                Filter Tahun & Semester
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
                {/* Filter Tahun */}
                <SelectField2
                    label="Tahun"
                    hideLabel={true}
                    value={filters.tahun_angkatan || ''} // Pastikan placeholder muncul
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, tahun_angkatan: e.target.value }))
                    }
                    options={[
                        { value: '', label: '-- Semua --' },
                        ...angkatans.map((a) => ({
                            value: a.tahun_angkatan,
                            label: `${a.tahun_angkatan}`,
                        })),
                    ]}
                    placeholder="-- Semua --"
                />

                {/* Filter Semester */}
                <SelectField2
                    label="Semester"
                    hideLabel={true}
                    value={filters.semester || ''}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, semester: e.target.value }))
                    }
                    options={[
                        { value: '', label: '-- Semua --' },
                        ...[...Array(8)].map((_, i) => ({
                            value: i + 1,
                            label: `Semester ${i + 1}`,
                        })),
                    ]}
                    placeholder="-- Semua --"
                />

                {/* Tombol Reset */}
                {hasActiveFilter && (
                    <div className="flex gap-3 items-center mt-2 sm:col-span-2 md:col-span-1">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold px-6 h-[40px] rounded-full transition duration-150 flex items-center justify-center gap-2"
                        >
                            <i className="fa fa-undo text-sm"></i>
                            Reset
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TugasPekananFilter;
