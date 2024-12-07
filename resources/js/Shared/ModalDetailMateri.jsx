import React from 'react';

const ModalDetailMateri = ({ materi, onClose }) => {
    if (!materi) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">Deskripsi Materi</h2>
                <p>{materi.deskripsi}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDetailMateri;
