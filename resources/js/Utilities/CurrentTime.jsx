import React, { useEffect, useState } from 'react';

const CurrentTime = ({ color = 'text-white' }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update setiap detik

        return () => clearInterval(timer); // Cleanup ketika komponen di-unmount
    }, []);

    // Format tanggal dalam format "Sel, 21 Jan 2025"
    const dayOfWeek = currentTime.toLocaleString('id-ID', { weekday: 'short' }); // Mengambil nama hari (contoh: "Sel")
    const dayOfMonth = currentTime.getDate().toString().padStart(2, '0'); // Menampilkan tanggal (contoh: "21")
    const month = currentTime.toLocaleString('id-ID', { month: 'short' }); // Mengambil nama bulan singkat (contoh: "Jan")
    const year = currentTime.getFullYear(); // Mengambil tahun (contoh: "2025")

    // Format waktu dalam format "jam:menit:detik"
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');

    return (
        <div className={`font-semibold tracking-widest ${color}`}>
            {/* {dayOfWeek}, {dayOfMonth} {month} {year} <i className="fa fa-hourglass-start fa-spin mx-2"></i> {hours}:{minutes}:{seconds} */}
            {dayOfWeek}, {dayOfMonth} {month} {year} <i className="fa fa-sync-alt fa-spin mx-1"></i> {hours}:{minutes}:{seconds}
        </div>
    );
};

export default CurrentTime;
