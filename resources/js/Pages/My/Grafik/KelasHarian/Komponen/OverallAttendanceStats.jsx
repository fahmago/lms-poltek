import React from 'react';

const CircularProgress = ({ label, percentage, color }) => {
    // Pengaturan SVG
    const radius = 42;
    const strokeWidth = 12;
    const viewBoxSize = 100;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Mengkonversi kelas Tailwind 'bg-teal-500' menjadi 'text-teal-500'
    const strokeColor = color.replace('bg-', 'text-');

    return (
        <>
            <div className="flex flex-col items-center p-4">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                        {/* Lingkaran Latar Belakang (Track) */}
                        <circle
                            className="text-gray-200"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx={viewBoxSize / 2}
                            cy={viewBoxSize / 2}
                        />
                        {/* Lingkaran Progress */}
                        <circle
                            className={`${strokeColor} transition-all duration-1000 ease-out`}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round" // Membuat ujung garis bulat
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx={viewBoxSize / 2}
                            cy={viewBoxSize / 2}
                            transform={`rotate(-90 ${viewBoxSize / 2} ${viewBoxSize / 2})`} // Memulai dari atas (jam 12)
                        />
                    </svg>
                    {/* Teks Persentase di Tengah */}
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${strokeColor}`}>
                        {Math.round(percentage)}% 
                    </span>
                </div>
                {/* Label di Bawah */}
                <span className="text-base font-semibold text-gray-700 mt-3 uppercase">{label}</span>
            </div>

        </>
    );
};

export default function OverallAttendanceStats({ data }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3 text-center">
                Statistik Kehadiran Keseluruhan
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-4 pt-4">
                {data.map(item => (
                    <CircularProgress
                        key={item.label}
                        label={item.label}
                        percentage={item.percentage}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
}