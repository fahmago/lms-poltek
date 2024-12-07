import React from 'react';
import Select from 'react-select';

const SF3 = ({ label, value, onChange, options, placeholder, error }) => {
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderWidth: 1,
            borderColor: error ? 'red' : 'gray',
            borderRadius: '0.375rem', // Tailwind's rounded-md
            padding: '0.25rem', // Tailwind's p-1
            boxShadow: error ? '0 0 0 1px red' : provided.boxShadow,
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 50, // Tailwind's relative stacking
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isDisabled
                ? '#f5f5f5' // Disabled option background
                : state.isSelected
                ? '#4f46e5' // Selected option background (blue-600)
                : state.isFocused
                ? '#e0e7ff' // Focused option background (blue-100)
                : '#fff', // Default background
            color: state.isDisabled ? '#9ca3af' : '#000', // Disabled option text color
            cursor: state.isDisabled ? 'not-allowed' : 'default',
        }),
    };

    return (
        <div className="mb-4">
            {label && <label className="block font-medium mb-1 text-gray-700">{label}</label>}
            <Select
                value={options.find((option) => option.value === value)}
                onChange={(selectedOption) => onChange({ target: { value: selectedOption?.value } })}
                options={options}
                placeholder={placeholder || 'Pilih...'}
                styles={customStyles}
                isClearable
                isSearchable
                classNamePrefix="react-select"
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default SF3;
