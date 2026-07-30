/**
 * Utility function to format YYYY-MM-DD date string OR ISO Timestamp
 * to Indonesian format.
 * Example 1: "2025-11-06" -> "Kamis, 6 November 2025"
 * Example 2: "2025-11-05T17:00:00.000000Z" -> "Kamis, 6 November 2025" (di WIB)
 *
 * @param {string} dateString - The date string (format YYYY-MM-DD or ISO 8601).
 * @returns {string} The formatted Indonesian date string.
 */
export const formatDateID = (dateString) => {
    try {
        const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const bulan = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        if (!dateString) {
             throw new Error("Date string is empty or null");
        }

        let date;

        // Cek apakah ini adalah string timestamp ISO 8601 lengkap
        if (dateString.includes('T') && dateString.includes('Z')) {
            // new Date() akan otomatis mengkonversinya ke zona waktu LOKAL (WIB)
            date = new Date(dateString);
        
        } else if (dateString.includes('-')) {
            // Jika "YYYY-MM-DD", ganti '-' dengan '/' agar aman di semua browser
            const safeDateStr = dateString.split(' ')[0].replace(/-/g, '/');
            date = new Date(safeDateStr);
        
        } else {
            date = new Date(dateString);
        }

        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date object after parsing: ${dateString}`);
        }

        const namaHari = hari[date.getDay()];
        const tanggal = date.getDate();
        const namaBulan = bulan[date.getMonth()];
        const tahun = date.getFullYear();

        return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
    
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return "Tanggal tidak valid"; // Fallback jika terjadi error
    }
};