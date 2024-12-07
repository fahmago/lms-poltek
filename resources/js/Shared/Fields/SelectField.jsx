import React from 'react';

const SelectField = ({ 
    label, 
    value, 
    onChange, 
    options = [], 
    placeholder = 'Pilih...', 
    error = null, 
    className = '', 
    disabled = false // Tambahkan properti disabled dengan default false
}) => {
    return (
        <div className={`mb-3 ${className}`}>
            {label && (
                <label className="block text-base font-medium text-gray-700">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                disabled={disabled} // Gunakan prop disabled
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                }`} // Tambahkan style untuk visual feedback saat disabled
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-base mt-1">{error}</p>}
        </div>
    );
};

export default SelectField;
