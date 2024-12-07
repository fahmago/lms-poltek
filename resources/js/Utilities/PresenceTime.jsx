import React from 'react';

// Komponen untuk menampilkan waktu mulai dan 30 menit pertama
const PresenceTime = ({ tanggal, jamMulai }) => {
    const startDate = new Date(tanggal);
    const jamMulaiArray = jamMulai.split(':');
    startDate.setHours(jamMulaiArray[0], jamMulaiArray[1], 0, 0); // Set jam_mulai

    // Menambahkan 30 menit ke jam mulai untuk mendapatkan waktu akhir
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

    // Format waktu mulai dan waktu akhir
    const formattedStartTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const formattedEndTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    return (
        <span>{formattedStartTime} - {formattedEndTime}</span>
    );
};

export default PresenceTime;
