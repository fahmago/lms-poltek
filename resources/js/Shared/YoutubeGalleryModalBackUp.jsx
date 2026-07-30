import React from 'react';

const YoutubeGalleryModal = ({ isOpen, onClose, videoIds, title = "Detail Video YouTube" }) => {
    if (!isOpen || !videoIds || videoIds.length === 0) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header Modal */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>

                {/* Konten Modal (Galeri Video) */}
                <div className="p-4 max-h-[80vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videoIds.map((videoId, index) => (
                        <div key={index} className="aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={`Video YouTube ${index + 1}`}
                            ></iframe>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YoutubeGalleryModal;