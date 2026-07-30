import React, { useState } from 'react';

const GradeSubmissionModal = ({ isOpen, onClose, onSubmit, submission, errors, isSubmitting }) => {
    const [nilai, setNilai] = useState(submission?.nilai || '');
    const [feedback, setFeedback] = useState(submission?.feedback_dosen || '');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nilai, feedback, submissionId: submission.uuid });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Beri Nilai Tugas</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="nilai" className="block text-sm font-medium text-gray-700 mb-1">Nilai (0-100)</label>
                            <input type="number" id="nilai" value={nilai} onChange={e => setNilai(e.target.value)} min="0" max="100" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            {errors.nilai && <p className="text-red-500 text-xs mt-1">{errors.nilai}</p>}
                        </div>
                        <div>
                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">Feedback Dosen (Opsional)</label>
                            <textarea id="feedback" value={feedback} onChange={e => setFeedback(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                            {errors.feedback && <p className="text-red-500 text-xs mt-1">{errors.feedback}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 mr-2">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Menilai...' : 'Simpan Nilai'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GradeSubmissionModal;