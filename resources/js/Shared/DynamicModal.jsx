import React, { useEffect, useState } from 'react';

const DynamicModal = ({ isOpen, onClose, onSubmit, fields, title, isSubmitting, errors, tbutton = 'Update', tProses = 'Updating...', colorButton = 'green' }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const initialData = fields.reduce((acc, field) => {
            acc[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
            return acc;
        }, {});
        setFormData(initialData);
    }, [fields]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">{title || 'Update Data'}</h2>
                    <form onSubmit={handleSubmit}>
                        {fields.map((field) => (
                            <div key={field.name} className="mb-4">
                                <label
                                    htmlFor={field.name}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    {field.label}
                                </label>
                                
                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required={field.required || false}
                                    />
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required={field.required || false}
                                        disabled={field.disabled || false}
                                    />
                                )}

                                {errors && errors[field.name] && (
                                    <div className="text-red-500 text-xs mt-1">{errors[field.name]}</div>
                                )}
                            </div>
                        ))}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white bg-${colorButton}-600 hover:bg-${colorButton}-700 rounded-lg`}
                                // className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
                                disabled={isSubmitting}  // Nonaktifkan tombol jika sedang mengirim
                            >
                                {isSubmitting ? <><i className="fa fa-spinner fa-spin mr-2"></i>{tProses}</> : <>{tbutton}</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default DynamicModal;
