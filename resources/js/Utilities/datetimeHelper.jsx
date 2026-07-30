// resources/js/Helpers/datetimeHelper.jsx

/**
 * Konversi datetime dari backend Laravel ke format <input type="datetime-local" />
 * Agar tidak bergeser karena perbedaan zona waktu (mis. UTC ke WIB)
 */
export const toLocalDatetime = (datetimeStr) => {
    if (!datetimeStr) return '';

    const date = new Date(datetimeStr);
    if (isNaN(date)) return '';

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
};

/**
 * Konversi datetime dari input HTML ke format standar Laravel (Y-m-d H:i:s)
 */
export const fromLocalDatetime = (localDatetimeStr) => {
    if (!localDatetimeStr) return '';

    const date = new Date(localDatetimeStr);
    const offset = date.getTimezoneOffset();
    const utcDate = new Date(date.getTime() + offset * 60 * 1000);

    return utcDate.toISOString().slice(0, 19).replace('T', ' ');
};
