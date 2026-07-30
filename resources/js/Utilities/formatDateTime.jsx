const formatDateTime = (dateString, options = {}) => {
    const { includeTime = false } = options;
    if (!dateString) return null;
    
    const date = new Date(dateString);
    
    const formatOptions = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };

    if (includeTime) {
        formatOptions.hour = '2-digit';
        formatOptions.minute = '2-digit';
    }

    let formatted = new Intl.DateTimeFormat('id-ID', formatOptions).format(date);
    formatted = formatted.replace(/, /g, ' ').replace(/\./g, ':');
    
    if (includeTime) {
        formatted += ' WIB';
    }
    
    return formatted;
};

export default formatDateTime