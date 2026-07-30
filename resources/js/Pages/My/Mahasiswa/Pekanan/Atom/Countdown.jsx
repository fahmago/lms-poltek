import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            const updatedTime = calculateTimeLeft();
            setTimeLeft(updatedTime);

            // Jika waktu sudah habis, refresh halaman
            if (Object.keys(updatedTime).length === 0) {
                window.location.reload(); // 👈 ini auto refresh halaman
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    return (
        <div className="flex justify-center gap-4 text-center">
            {Object.keys(timeLeft).length > 0 ? (
                Object.entries(timeLeft).map(([interval, value]) => (
                    <div key={interval} className="p-3 bg-blue-50 rounded-lg w-20">
                        <div className="text-2xl font-bold text-blue-600">{value}</div>
                        <div className="text-xs text-blue-500 uppercase">{interval}</div>
                    </div>
                ))
            ) : (
                <span className="text-green-600 font-semibold">Tugas sudah dimulai!</span>
            )}
        </div>
    );
};

export default Countdown;





// import React, { useState, useEffect } from 'react';
// const Countdown = ({ targetDate }) => {
//     const calculateTimeLeft = () => {
//         const difference = +new Date(targetDate) - +new Date();
//         let timeLeft = {};
//         if (difference > 0) {
//             timeLeft = {
//                 days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//                 hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//                 minutes: Math.floor((difference / 1000 / 60) % 60),
//                 seconds: Math.floor((difference / 1000) % 60),
//             };
//         }
//         return timeLeft;
//     };

//     const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setTimeLeft(calculateTimeLeft());
//         }, 1000);
//         return () => clearTimeout(timer);
//     });

//     return (
//         <div className="flex justify-center gap-4 text-center">
//             {Object.keys(timeLeft).length > 0 ? (
//                 Object.entries(timeLeft).map(([interval, value]) => (
//                     <div key={interval} className="p-3 bg-blue-50 rounded-lg w-20">
//                         <div className="text-2xl font-bold text-blue-600">{value}</div>
//                         <div className="text-xs text-blue-500 uppercase">{interval}</div>
//                     </div>
//                 ))
//             ) : (
//                 <span className="text-green-600 font-semibold">Tugas sudah dimulai!</span>
//             )}
//         </div>
//     );
// };
// export default Countdown;