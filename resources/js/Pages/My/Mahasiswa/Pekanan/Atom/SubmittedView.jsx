import React, { useState } from 'react';
import formatDate from '@/Utilities/formatDateTime';

const SubmittedView = ({ submission, tugas }) => {
    if (!submission || !submission.jawaban) return null;

    const [playingVideoId, setPlayingVideoId] = useState(null);
    const closeModal = () => setPlayingVideoId(null);
    const getYoutubeThumbnail = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const getGridColsClass = (count) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 md:grid-cols-2';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Jawaban Terkirim</h3>
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-inner">
                <p className="text-sm text-gray-500 mb-4 font-mono">
                    Dikumpulkan pada: {formatDate(submission.created_at, {includeTime: true})}
                </p>
                {tugas.tipe_tugas === 'yt' ? (
                    <div className={`grid ${getGridColsClass(submission.jawaban.length)} gap-4`}>
                        {submission.jawaban.map((videoId, i) => (
                            <div key={i} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700 group">
                                <img src={getYoutubeThumbnail(videoId)} alt={`YouTube Thumbnail ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setPlayingVideoId(videoId)}
                                        className="text-white bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        title={`Tonton Video ${i + 1}`}
                                    >
                                        <i className="fab fa-youtube fa-2x"></i>
                                    </button>
                                </div>
                                <a
                                    href={`https://www.youtube.com/watch?v=${videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-2 left-2 text-white text-xs bg-gray-800 bg-opacity-70 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-900 transition-colors"
                                    title="Buka di YouTube"
                                >
                                    <i className="fa fa-external-link-alt"></i>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <a
                        href={submission.jawaban}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                        <i className="fa fa-link fa-lg text-blue-600"></i>
                        <span className="text-sm text-gray-800 truncate font-medium">{submission.jawaban}</span>
                        <i className="fa fa-external-link-alt text-gray-400 ml-auto"></i>
                    </a>
                )}
            </div>

            {/* Modal untuk memutar video YouTube */}
            {playingVideoId && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded YouTube Video"
                        ></iframe>
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white text-3xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black focus:outline-none focus:ring-2 focus:ring-white z-10">&times;</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmittedView;