import React from 'react';
import SelectField2 from '../../../../../../Shared/Fields/SelectField2';

const FilterSection = ({
    filterTahun,
    setFilterTahun,
    filterSemester,
    setFilterSemester,
    filterKategori,
    setFilterKategori,
    handleFilter,
    handleReset,
    tahunList,
    semesterList,
    kategoriList,
}) => {
    const tahunOptions = tahunList.map((th) => ({
        value: th,
        label: th.toString(),
    }));

    const semesterOptions = semesterList.map((sm) => ({
        value: sm,
        label: `Semester ${sm}`,
    }));

    const kategoriOptions = kategoriList.map((kat) => ({
        value: kat.uuid,
        label: kat.nama_kategori,
    }));

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
    <h2 className="text-gray-700 font-semibold mb-4 text-lg">Filter Data</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
        {/* Tahun */}
        <SelectField2
            label="Tahun"
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            options={[{ value: '', label: 'Semua' }, ...tahunOptions]}
            placeholder="Pilih Tahun"
        />

        {/* Semester */}
        <SelectField2
            label="Semester"
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            options={[{ value: '', label: 'Semua' }, ...semesterOptions]}
            placeholder="Pilih Semester"
        />

        {/* Kategori */}
        <SelectField2
            label="Kategori"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            options={[{ value: '', label: 'Semua' }, ...kategoriOptions]}
            placeholder="Pilih Kategori"
        />

        {/* Tombol Aksi */}
        <div className="flex gap-3 items-center mt-2">
            <button
                type="button"
                onClick={handleFilter}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 h-[40px] rounded-full transition duration-150 flex items-center justify-center gap-2"
            >
                <i className="fa fa-search"></i> Tampilkan
            </button>

            <button
                type="button"
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold px-6 h-[40px] rounded-full transition duration-150 flex items-center justify-center gap-2"
            >
                <i className="fa fa-undo"></i> Reset
            </button>
        </div>
    </div>
</div>

    );
};

export default FilterSection;
