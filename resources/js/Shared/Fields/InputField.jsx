import React from 'react';

const InputField = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder = '', 
    error = null, 
    className = '', 
    readOnly = false // Tambahkan properti readOnly dengan default false
}) => {
    return (
        <div className={`mb-3 ${className}`}>
            {label && (
                <label className="block text-base font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                readOnly={readOnly} // Gunakan prop readOnly
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
                }`} // Tambahkan style untuk feedback visual
                placeholder={placeholder}
            />
            {error && <p className="text-red-500 text-base mt-1">{error}</p>}
        </div>
    );
};

export default InputField;
