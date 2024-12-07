import React from 'react';

const ToggleSwitch = ({ value, onToggle, labels = { active: 'Aktif', inactive: 'Tidak Aktif' }, size = 'medium' }) => {
    const sizes = {
        small: {
            container: 'w-8 h-4',          // Ukuran untuk small
            circle: 'w-3.5 h-3.5',         // Ukuran lingkaran untuk small
            translate: 'translate-x-4',
        },
        medium: {
            container: 'w-12 h-6',         // Ukuran untuk medium (sesuai dengan kode asli)
            circle: 'w-5 h-5',             // Ukuran lingkaran untuk medium (sesuai dengan kode asli)
            translate: 'translate-x-6',    // Posisi lingkaran untuk medium
        },
        large: {
            container: 'w-16 h-8',
            circle: 'w-7 h-7',
            translate: 'translate-x-8',
        },
    };

    const currentSize = sizes[size] || sizes.medium;

    return (
        <div className="flex justify-center items-center">
            <div className="flex justify-center items-center flex-col space-y-3">
                {/* Label */}
                <span className="mr-2 text-sm mb-1">{value ? labels.active : labels.inactive}</span>
                
                {/* Toggle */}
                <div
                    onClick={onToggle}
                    className={`${currentSize.container} flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${value ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div
                        className={`bg-white rounded-full shadow-md transform transition-transform duration-300 ${value ? currentSize.translate : ''} ${currentSize.circle}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ToggleSwitch;
