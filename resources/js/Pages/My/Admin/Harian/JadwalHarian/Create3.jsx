import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import ToastNotification from '../../../../../Shared/ToastNotification';
import SelectField2 from '../../../../../Shared/Fields/SelectField2';

const CreateJadwal2 = () => {
    const { errors, angkatans, kategoriList } = usePage().props;

    const [tahun, setTahun] = useState('');
    const [bulan, setBulan] = useState('');
    const [semester, setSemester] = useState('');
    const [kategori, setKategori] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // State untuk Range Libur
    const [startLibur, setStartLibur] = useState('');
    const [endLibur, setEndLibur] = useState('');
    const [listRangeLibur, setListRangeLibur] = useState([]); // Menyimpan objek {start, end}

    const bulanOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('default', { month: 'long' }),
    }));

    const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
        value: i + 1,
        label: `Semester ${i + 1}`,
    }));

    // Menambah rentang libur ke daftar
    const addRangeLibur = () => {
        if (startLibur && endLibur) {
            if (new Date(startLibur) > new Date(endLibur)) {
                alert("Tanggal mulai tidak boleh lebih besar dari tanggal selesai");
                return;
            }
            setListRangeLibur([...listRangeLibur, { start: startLibur, end: endLibur }]);
            setStartLibur('');
            setEndLibur('');
        }
    };

    const removeRange = (index) => {
        setListRangeLibur(listRangeLibur.filter((_, i) => i !== index));
    };

    const storeJadwal = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        Inertia.post(
            route('my.dh.jadwal.store'),
            {
                tahun,
                bulan,
                semester,
                kategori,
                // Kirim range sebagai JSON string agar mudah diproses backend
                ranges_libur: JSON.stringify(listRangeLibur), 
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                    ToastNotification({ icon: 'success', title: 'Berhasil!' });
                    resetForm();
                },
                onError: () => setIsLoading(false),
            }
        );
    };

    const resetForm = () => {
        setTahun(''); setBulan(''); setSemester(''); setKategori('');
        setListRangeLibur([]);
    };

    return (
        <>
            <Head><title>eLearning - Generate Jadwal</title></Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md text-white font-bold">
                            <i className="fa fa-calendar-alt mr-2"></i> Generate Jadwal Harian
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeJadwal}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <SelectField2 label="Tahun" value={tahun} onChange={(e) => setTahun(e.target.value)} options={angkatans.map(a => ({ value: a.kode_tahun, label: a.kode_tahun }))} error={errors?.tahun} />
                                    <SelectField2 label="Bulan" value={bulan} onChange={(e) => setBulan(e.target.value)} options={bulanOptions} error={errors?.bulan} />
                                    <SelectField2 label="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} options={semesterOptions} error={errors?.semester} />
                                    <SelectField2 label="Kategori" value={kategori} onChange={(e) => setKategori(e.target.value)} options={kategoriList.map(i => ({ value: i.uuid, label: i.nama_kategori }))} error={errors?.kategori} />
                                </div>

                                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                                    <h4 className="text-blue-800 font-bold mb-3 text-sm">
                                        <i className="fa fa-calendar-day mr-2"></i> Atur Periode Libur (Optional)
                                    </h4>
                                    <div className="flex flex-wrap items-end gap-3">
                                        <div>
                                            <label className="block text-xs mb-1 text-gray-600">Dari Tanggal</label>
                                            <input type="date" className="p-2 border rounded text-sm" value={startLibur} onChange={(e) => setStartLibur(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1 text-gray-600">Sampai Tanggal</label>
                                            <input type="date" className="p-2 border rounded text-sm" value={endLibur} onChange={(e) => setEndLibur(e.target.value)} />
                                        </div>
                                        <button type="button" onClick={addRangeLibur} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
                                            Tambah Periode
                                        </button>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {listRangeLibur.map((range, idx) => (
                                            <div key={idx} className="flex items-center bg-white border border-blue-200 px-3 py-1 rounded-md text-xs shadow-sm">
                                                <span className="text-blue-700 font-medium">{range.start}</span>
                                                <span className="mx-2 text-gray-400">s/d</span>
                                                <span className="text-blue-700 font-medium">{range.end}</span>
                                                <button type="button" onClick={() => removeRange(idx)} className="ml-3 text-red-400 hover:text-red-600">
                                                    <i className="fa fa-times-circle"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button type="submit" disabled={isLoading} className={`bg-blue-700 text-white px-10 py-3 rounded-full font-bold uppercase tracking-wider text-xs ${isLoading ? 'opacity-50' : 'hover:bg-blue-800'}`}>
                                        {isLoading ? 'Processing...' : 'Generate Jadwal'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default CreateJadwal2;