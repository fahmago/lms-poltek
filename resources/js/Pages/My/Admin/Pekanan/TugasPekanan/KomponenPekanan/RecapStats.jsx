import React from 'react';

const RecapStats = ({ stats }) => {
    // Tentukan warna berdasarkan persentase progress
    const getProgressColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        // <div className="backdrop-blur-md bg-white/70 border border-white/20 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
        //     <h2 className="text-xl font-bold text-gray-800 mb-4">Rekapitulasi Pengumpulan</h2>

        //     <div className="space-y-3">

        //         <div className="flex justify-between items-center text-sm font-medium">
        //             <span className="text-gray-600">Total Mahasiswa Mengumpulkan</span>
        //             <span className="text-gray-800">
        //                 {stats.total_submissions} / {stats.total_students}
        //             </span>
        //         </div>

        //         <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        //             <div
        //                 className={`h-2.5 rounded-full transition-all duration-700 ease-in-out ${getProgressColor(stats.completion_percentage)}`}
        //                 style={{ width: `${stats.completion_percentage}%` }}
        //             ></div>
        //         </div>

        //         <div className="text-right text-lg font-bold text-gray-800">
        //             <span
        //                 className={`${
        //                     stats.completion_percentage >= 80
        //                         ? 'text-green-600'
        //                         : stats.completion_percentage >= 50
        //                         ? 'text-yellow-600'
        //                         : 'text-red-600'
        //                 }`}
        //             >
        //                 {stats.completion_percentage}%
        //             </span>
        //             {' '}
        //             <span className="text-gray-500 font-normal">Selesai</span>
        //         </div>
        //     </div>
        // </div>
        <div className="backdrop-blur-md bg-white/70 border border-white/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <i className="fa fa-bolt text-blue-600 text-2xl"></i>
        Rekapitulasi Pengumpulan
    </h2>

    <div className="w-full">
        {/* Progress Info (atas bar) */}
        <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-700 font-medium">
                {stats.total_submissions}/{stats.total_students} Mahasiswa
            </span>
            <span className="font-bold text-gray-900 text-base">
                {stats.completion_percentage}%
            </span>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
                className={`absolute top-0 left-0 h-4 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                    stats.completion_percentage >= 80
                        ? 'bg-green-500 shadow-[0_0_10px_#22c55e]'
                        : stats.completion_percentage >= 50
                            ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]'
                            : 'bg-red-500 shadow-[0_0_10px_#ef4444]'
                }`}
                style={{ width: `${stats.completion_percentage}%` }}
            ></div>
        </div>
    </div>
</div>

    );
};

export default RecapStats;
