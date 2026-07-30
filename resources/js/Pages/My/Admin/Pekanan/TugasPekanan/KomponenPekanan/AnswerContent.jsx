import React, { useState } from 'react';
import YoutubeGalleryModal from '../../../../../../Shared/YoutubeGalleryModal';

const AnswerContent = ({ submission, tugasPekanan, nameMhs = '' }) => {
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    if (!submission)
        return <span className="text-xs text-gray-400 italic">Belum mengumpulkan</span>;

    const getYoutubeThumbnail = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

    if (tugasPekanan.tipe_tugas === 'yt') {
        if (submission.jawaban.length === 1) {
            const videoId = submission.jawaban[0];
            return (
                <div className="mt-2">
                    <div className="relative w-48 h-28 overflow-hidden rounded-xl shadow-md border border-white/20 group cursor-pointer">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            className="w-full h-full"
                            allowFullScreen
                            title="YouTube Video"
                        ></iframe>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col gap-3 mt-2">
                    <div
                        onClick={() => setIsGalleryModalOpen(true)}
                        className="relative w-48 h-28 overflow-hidden rounded-xl shadow-md border border-white/20 group cursor-pointer">
                        <img
                            src={getYoutubeThumbnail(submission.jawaban[0])}
                            alt="thumb"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                                +{submission.jawaban.length} Video
                            </span>
                        </div>
                    </div>

                    <YoutubeGalleryModal
                        isOpen={isGalleryModalOpen}
                        onClose={() => setIsGalleryModalOpen(false)}
                        videoIds={submission.jawaban}
                        title={`${nameMhs} - Playlist ${tugasPekanan.judul}`}
                        fullscreen
                    />
                </div>
            );
        }
    }

    return (
        <a
            href={submission.jawaban}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm flex items-center gap-2"
        >
            <i className="fa fa-link text-gray-400"></i> Lihat Jawaban
        </a>
    );
};

export default AnswerContent;