import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        // Backdrop
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose} // Optional: close modal on backdrop click
        >
            {/* Modal Content */}
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl"
                onClick={e => e.stopPropagation()} // Prevent modal from closing when clicking inside it
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b rounded-t-md bg-gray-50">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                        onClick={onClose}
                    >
                        <i className="fa fa-times fa-lg"></i>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;