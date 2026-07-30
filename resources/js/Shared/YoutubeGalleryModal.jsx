import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const YoutubeGalleryModal = ({ isOpen, onClose, videoIds, title = "Lihat Semua Video" }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    if (!isOpen || !videoIds?.length) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-8 text-white text-4xl hover:text-gray-300 transition-transform"
            >
                &times;
            </button>

            <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>

            {/* Video utama */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/20 mb-6"
            >
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoIds[activeIndex]}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Video utama`}
                ></iframe>
            </div>

            {/* Thumbnail selector */}
            {/* <div
                className="flex justify-center gap-3 overflow-x-auto pb-2 w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
            >
                {videoIds.map((id, i) => (
                    <div
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-32 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                            i === activeIndex ? 'border-red-500' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    >
                        <iframe
                            className="w-full h-full pointer-events-none"
                            src={`https://www.youtube.com/embed/${id}`}
                            frameBorder="0"
                            allowFullScreen
                            title={`Thumbnail ${i + 1}`}
                        ></iframe>
                    </div>
                ))}
            </div> */}
            <div
                className="w-full max-w-5xl pb-2 overflow-x-auto"
                style={{
                    display: 'flex',
                    justifyContent: videoIds.length < 5 ? 'center' : 'flex-start',
                    gap: '0.75rem',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <style>{`
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {videoIds.map((id, i) => (
                    <div
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-32 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${i === activeIndex
                            ? 'border-red-500'
                            : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                    >
                        <iframe
                            className="w-full h-full pointer-events-none"
                            src={`https://www.youtube.com/embed/${id}`}
                            frameBorder="0"
                            allowFullScreen
                            title={`Thumbnail ${i + 1}`}
                        ></iframe>
                    </div>
                ))}
            </div>

        </div>,
        document.body
    );
};

export default YoutubeGalleryModal;
