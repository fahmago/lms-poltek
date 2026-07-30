const convertMonthToIndonesian = (monthName) => {
    const months = {
        January: "Januari",
        February: "Februari",
        March: "Maret",
        April: "April",
        May: "Mei",
        June: "Juni",
        July: "Juli",
        August: "Agustus",
        September: "September",
        October: "Oktober",
        November: "November",
        December: "Desember",
    };

    return months[monthName] || "Bulan tidak valid";
};

export default convertMonthToIndonesian;
