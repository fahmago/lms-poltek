import React from 'react';
import Select from 'react-select';

const SelectField2 = ({ label, value, onChange, options, placeholder, error, disabled = false }) => {
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderWidth: 1,
            borderColor: error ? 'red' : 'gray',
            borderRadius: '0.375rem', // Tailwind's rounded-md
            padding: '0.25rem', // Tailwind's p-1
            boxShadow: error ? '0 0 0 1px red' : provided.boxShadow,
            backgroundColor: state.isDisabled ? '#f3f4f6' : 'white',
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 50, // Tailwind's relative stacking
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
                isDisabled={disabled}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default SelectField2;
