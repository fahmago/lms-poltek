import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import InputField from '@/Shared/Fields/InputField';
import ButtonSave from '@/Shared/ButtonSave';

const SubmissionForm = ({ tugas, submission }) => {
    const { errors } = usePage().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [jawaban, setJawaban] = useState(() => {
        if (tugas.tipe_tugas === 'yt') {
            return submission?.jawaban && Array.isArray(submission.jawaban) ? submission.jawaban : [''];
        }
        return submission?.jawaban || '';
    });

    const [duplicateErrors, setDuplicateErrors] = useState({});

    const checkForDuplicates = (ids) => {
        const newErrors = {};
        const seen = new Set();
        let hasDuplicates = false;
        ids.forEach((id, index) => {
            const trimmedId = id.trim();
            if (trimmedId === '') return;
            if (seen.has(trimmedId)) {
                hasDuplicates = true;
                ids.forEach((innerId, innerIndex) => {
                    if (innerId.trim() === trimmedId) {
                        newErrors[innerIndex] = 'Video ID ini sudah digunakan di dalam form ini.';
                    }
                });
            }
            seen.add(trimmedId);
        });
        setDuplicateErrors(newErrors);
        return hasDuplicates;
    };

    const handleYoutubeIdChange = (index, value) => {
        const newIds = [...jawaban];
        newIds[index] = value;
        setJawaban(newIds);
        checkForDuplicates(newIds);
    };

    const addVideoIdField = () => setJawaban([...jawaban, '']);
    const removeVideoIdField = (index) => {
        const newIds = jawaban.filter((_, i) => i !== index);
        setJawaban(newIds);
        checkForDuplicates(newIds);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (tugas.tipe_tugas === 'yt' && checkForDuplicates(jawaban)) {
            ToastNotification({ icon: 'error', title: 'Terdapat Video ID yang sama.' });
            return;
        }
        setIsSubmitting(true);
        const dataToSend = {
            jawaban: tugas.tipe_tugas === 'yt' ? jawaban.filter(id => id.trim() !== '') : jawaban,
        };
        Inertia.post(route('mhs.tweek.submit', { tugasPekanan: tugas.uuid }), dataToSend, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{submission ? 'Perbarui Jawaban Anda' : 'Kirim Jawaban Anda'}</h3>
            {tugas.tipe_tugas === 'yt' ? (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Video ID YouTube</label>
                    {jawaban.map((videoId, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-center gap-2">
                                {/* Menggunakan InputField */}
                                <InputField
                                    type="text"
                                    value={videoId}
                                    onChange={e => handleYoutubeIdChange(index, e.target.value)}
                                    placeholder="Contoh: dQw4w9WgXcQ"
                                    className={`flex-grow ${duplicateErrors[index] ? 'border-red-500 ring-red-500' : ''}`} // Styling error
                                    error={duplicateErrors[index]} // Meneruskan error ke InputField
                                    hideLabel={true} // Sembunyikan label bawaan InputField
                                />
                                {jawaban.length > 1 && <button type="button" onClick={() => removeVideoIdField(index)} className="px-3 py-2 -mt-2 text-sm text-red-600 hover:bg-red-50 rounded-md"><i className="fa fa-trash-alt"></i></button>}
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={addVideoIdField} className="text-sm text-blue-600 hover:underline">+ Tambah Video (untuk playlist)</button>
                </div>
            ) : (
                <div>
                    {/* Menggunakan InputField */}
                    <InputField
                        label="Link Jawaban"
                        type="url"
                        value={jawaban}
                        onChange={e => setJawaban(e.target.value)}
                        placeholder="https://..."
                        error={errors.jawaban}
                        required
                    />
                </div>
            )}
            {/* Menampilkan error dari backend */}
            {Object.keys(errors).map(key => key.startsWith('jawaban.') && <p key={key} className="text-red-500 text-xs mt-1">{errors[key]}</p>)}

            <div className="pt-4 flex justify-end">
                {/* <button type="submit" disabled={isSubmitting || Object.keys(duplicateErrors).length > 0} className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Mengirim...' : (submission ? 'Perbarui Jawaban' : 'Kirim Jawaban')}
                </button> */}
                <ButtonSave type="submit" disabled={isSubmitting || Object.keys(duplicateErrors).length > 0}>
                    {isSubmitting ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Sedang Mengirim...
                        </>
                    ) : submission ? (
                        <>
                            <i className="fas fa-sync-alt mr-2"></i>
                            Perbarui Jawaban
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane mr-2"></i>
                            Kirim Jawaban
                        </>
                    )}
                </ButtonSave>

            </div>
        </form>
    );
};

export default SubmissionForm;