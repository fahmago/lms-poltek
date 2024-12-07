import React, { useState, useEffect } from 'react';

const PresenceModal = ({ isOpen, onClose, onSubmit, selectedStatus, onStatusChange, isSubmitting }) => {
    const handleStatusChange = (event) => {
        onStatusChange(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedStatus && !isSubmitting) {
            onSubmit(selectedStatus);
            onStatusChange(''); // Reset status setelah submit
        }
    };

    useEffect(() => {
        // Reset status if modal is closed
        if (!isOpen) {
            onStatusChange(''); 
        }
    }, [isOpen, onStatusChange]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg w-96">
                <h3 className="text-lg font-semibold">Pilih Status Kehadiran</h3>
                <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="hadir"
                            name="status"
                            value="Hadir"
                            checked={selectedStatus === 'Hadir'}
                            onChange={handleStatusChange}
                            className="mr-2"
                        />
                        <label htmlFor="hadir">Hadir</label>
                    </div>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="izin"
                            name="status"
                            value="Izin"
                            checked={selectedStatus === 'Izin'}
                            onChange={handleStatusChange}
                            className="mr-2"
                        />
                        <label htmlFor="izin">Izin</label>
                    </div>
                    <div className="flex items-center mb-2">
                        <input
                            type="radio"
                            id="sakit"
                            name="status"
                            value="Sakit"
                            checked={selectedStatus === 'Sakit'}
                            onChange={handleStatusChange}
                            className="mr-2"
                        />
                        <label htmlFor="sakit">Sakit</label>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting} // Disable tombol saat submit sedang berlangsung
                        className={`${
                            isSubmitting ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        } text-white px-4 py-2 rounded-md`}
                    >
                        {isSubmitting ? <><i className="fa fa-spinner fa-spin mr-2"></i>Submitting...</> : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PresenceModal;
