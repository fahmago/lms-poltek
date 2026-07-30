import React from 'react';

const formatJam = (time) => {
    if (!time) return '';
    // Jika format waktu dari backend adalah "HH:mm:ss"
    if (time.includes(':')) {
        return time.slice(0, 5); // Ambil hanya jam dan menit
    }
    return time;
};

export default formatJam;