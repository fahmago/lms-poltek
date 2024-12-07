import React from 'react';

const ImageUpload = ({
    label = "Gambar",
    existingImage = null,
    previewImage = null,
    onImageChange,
    error = null,
    buttonLabel = "Choose File",
}) => {
    return (
        <div className="mb-6">
            <div className="flex items-center">
                {/* Gambar Lama */}
                {existingImage && (
                    <div className="mr-4">
                        <img
                            src={existingImage}
                            alt="Gambar Lama"
                            className="w-24 h-auto rounded-lg border border-gray-300"
                        />
                    </div>
                )}

                {/* Preview Gambar Baru */}
                {previewImage && (
                    <div className="text-center mx-2">
                        <p className="text-sm font-medium text-gray-700">Akan diganti dengan:</p>
                    </div>
                )}

                {/* Gambar Baru */}
                {previewImage && (
                    <div>
                        <img
                            src={previewImage}
                            alt="Image Preview"
                            className="w-24 h-auto rounded-lg ml-4 border border-gray-300"
                        />
                    </div>
                )}
            </div>

            <label className="block text-base mb-2 font-medium text-gray-700 mt-4">{label}</label>
            <div className="flex items-center">
                <label className="bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-green-600 transition-colors duration-200">
                    <i className="fa fa-upload mr-1"></i> {buttonLabel}
                    <input
                        type="file"
                        className="hidden"
                        onChange={onImageChange}
                    />
                </label>
                <span className="ml-3 text-sm text-gray-600">
                    {previewImage ? "File selected" : "No file chosen"}
                </span>
            </div>

            {/* Menampilkan error untuk image */}
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default ImageUpload;
