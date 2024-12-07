import React, { useEffect, useState, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's default theme

const DM2 = ({ isOpen, onClose, onSubmit, fields, title, isSubmitting, errors }) => {
    const [formData, setFormData] = useState({});
    const quillRef = useRef(); // Ref for the Quill editor
    const [quillEditor, setQuillEditor] = useState(null);

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Initialize Quill editor for fields that require it
    useEffect(() => {
        if (isOpen && fields.some(field => field.type === 'quill')) {
            const quill = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        ['link'],
                        [{ 'align': [] }],
                    ],
                },
            });
            setQuillEditor(quill);
        }

        // Cleanup Quill editor when modal is closed
        return () => {
            if (quillEditor) {
                quillEditor.root.innerHTML = ''; // Clear editor content
                setQuillEditor(null); // Remove Quill instance
            }
        };
    }, [isOpen, fields]);

    useEffect(() => {
        // Set initial data for the form fields including Quill content
        const initialData = fields.reduce((acc, field) => {
            acc[field.name] = field.defaultValue || '';
            return acc;
        }, {});
        setFormData(initialData);

        // If the field type is 'quill', set its content in Quill editor
        if (quillEditor) {
            const quillContent = fields.find(field => field.type === 'quill')?.defaultValue || '';
            quillEditor.root.innerHTML = quillContent; // Set Quill content
        }
    }, [fields, quillEditor]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFormData = { ...formData };
        if (quillEditor) {
            updatedFormData['deskripsi'] = quillEditor.root.innerHTML; // Get HTML content from Quill
        }
        onSubmit(updatedFormData); // Pass the updated data
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
                                ) : field.type === 'quill' ? (
                                    <div ref={quillRef} style={{ height: '200px' }}></div>
                                ) : (
                                    <input
                                        type={field.type || 'text'}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required={field.required || false}
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
                                className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg"
                                disabled={isSubmitting}  // Nonaktifkan tombol jika sedang mengirim
                            >
                                {isSubmitting ? <><i className="fa fa-spinner fa-spin mr-2"></i>Updating...</> : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default DM2;
