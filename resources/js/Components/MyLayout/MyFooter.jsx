import React from 'react';

const MyFooter = () => {
    const startYear = 2024;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-center font-medium text-gray-800 lg:text-right pt-4 pb-2 mt-8 mb-2">
            <p>
                eLearning by{' '}
                <a
                    href="https://febryann.my.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                    Febryan
                </a>{' '}
                &copy; {startYear}
                {currentYear > startYear && ` - ${currentYear}`}
            </p>
        </footer>
    );
}

export default MyFooter;
