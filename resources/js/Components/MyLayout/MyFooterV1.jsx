import React from 'react';

const MyFooter = () => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-center font-medium text-gray-800 lg:text-right pt-4 pb-2">
            <p>
                eLearning &copy; {startYear}{currentYear > startYear && ` - ${currentYear}`}
            </p>
        </footer>
    );
}

export default MyFooter;
