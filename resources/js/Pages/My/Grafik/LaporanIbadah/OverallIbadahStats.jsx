import React, { useState, useEffect } from "react";

// --- PERUBAHAN DIMULAI DI SINI ---

const CircularStatValue = ({ label, value, color }) => {
    // 1. State (Sama, tidak berubah)
    const [currentValue, setCurrentValue] = useState(0);
    const [currentOffset, setCurrentOffset] = useState(0);

    // 2. LOGIKA BARU: Cek apakah label ini adalah persentase
    // Kita ubah ke .toUpperCase() agar aman (tidak case-sensitive)
    const isPercentage = label.toUpperCase().includes('PERSEN') || label.toUpperCase().includes('RATA-RATA');

    // 3. Pengaturan SVG (Sama, tidak berubah)
    const radius = 42;
    const strokeWidth = 12;
    const viewBoxSize = 100;
    const circumference = 2 * Math.PI * radius;
    const strokeColor = color.replace("bg-", "text-");

    // 4. Efek Animasi (Sama, tidak berubah)
    useEffect(() => {
        let start = null;
        const duration = 1500; 
        const startValue = 0;
        const endValue = value; 
        const startOffset = circumference;
        const endOffset = 0; 
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = easeOutCubic(progress);

            const newTextValue = startValue + (endValue - startValue) * eased;
            setCurrentValue(newTextValue);

            const newOffsetValue = startOffset + (endOffset - startOffset) * eased;
            setCurrentOffset(newOffsetValue);

            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        
        setCurrentOffset(circumference);
    }, [value, circumference]);

    return (
        <div className="flex flex-col items-center p-4">
            <div className="relative w-32 h-32">
                <svg
                    className="w-full h-full"
                    viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                >
                    {/* Track (Sama) */}
                    <circle
                        className="text-gray-200"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={viewBoxSize / 2}
                        cy={viewBoxSize / 2}
                    />
                    {/* Progress (Sama) */}
                    <circle
                        className={`${strokeColor}`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={currentOffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx={viewBoxSize / 2}
                        cy={viewBoxSize / 2}
                        transform={`rotate(-90 ${viewBoxSize / 2} ${viewBoxSize / 2})`}
                    />
                </svg>

                {/* 5. PERUBAHAN TAMPILAN ANGKA DI TENGAH */}
                <span
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${strokeColor}`}
                >
                    {/* Tampilkan nilai yang dianimasi */}
                    {Math.floor(currentValue)}
                    {/* Tampilkan '%' HANYA jika isPercentage true */}
                    {isPercentage && '%'}
                </span>
                {/* --- AKHIR PERUBAHAN --- */}

            </div>
            <span className="text-base font-semibold text-gray-700 mt-3 uppercase">
                {label}
            </span>
        </div>
    );
};

// --- TIDAK ADA PERUBAHAN DI BAWAH INI ---

export default function OverallIbadahStats({ data, title = "Statistik Keseluruhan" }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3 text-center">
                {title}
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-4 pt-4">
                {data.map((item) => (
                    <CircularStatValue
                        key={item.label}
                        label={item.label}
                        value={item.percentage} 
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
}