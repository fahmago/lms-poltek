const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'short', // Hari dalam format pendek (Sen, Sel, Rab, dst.)
        day: '2-digit',   // Tanggal dalam format 2 digit
        month: 'short',   // Bulan dalam format pendek (Jan, Feb, dst.)
        year: 'numeric'   // Tahun dalam format lengkap
    });
};
export default formatDate