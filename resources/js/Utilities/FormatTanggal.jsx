import React from 'react';

const FormatTanggal = ({ dateString }) => {
    const formatDate = (date) => {
        const parsedDate = new Date(date);
        const day = String(parsedDate.getDate()).padStart(2, '0'); // Tambahkan 0 di depan jika perlu
        const month = parsedDate.toLocaleString('en-US', { month: 'short' }); // Format bulan pendek
        // const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const year = parsedDate.getFullYear();
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

        return (
            <>
                {`${day}${month}${year}`}
                <br />
                {`${hours}:${minutes}`}
            </>
        );
    };

    return <span>{formatDate(dateString)}</span>;
};

export default FormatTanggal;
