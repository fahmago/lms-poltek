import React from 'react';

const TextareaField = ({ label, value, onChange, placeholder, rows = 3, error = null, }) => {
    return (
        <div className="mb-3">
            <label className="block text-base font-medium text-gray-700">{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={rows}
                placeholder={placeholder}
            />
            {error && <p className="text-red-500 text-base mt-1">{error}</p>}
        </div>
    );
};

export default TextareaField;
