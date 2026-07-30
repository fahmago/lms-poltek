import React, { useEffect, useState } from 'react';

/**
 * Reusable Bulk Update Modal (Premium Version)
 */
const BulkUpdateModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    processing, 
    title = 'Update Data',
    icon = 'fa-pencil',
    subTitle = 'Perubahan ini akan diterapkan pada semua item yang dipilih.',
    submitLabel = 'Simpan Perubahan',
    color = 'indigo', 
    children 
}) => {
    
    // State untuk animasi entry (Mounting animation)
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            setTimeout(() => setShow(false), 200); // Delay unmount untuk animasi exit
        }
    }, [isOpen]);

    if (!isOpen && !show) return null;

    // Mapping warna yang lebih detail (termasuk Shadow berwarna)
    const theme = {
        indigo: {
            btn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 border-transparent',
            iconBg: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
            ring: 'focus:ring-indigo-500',
        },
        blue: {
            btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 border-transparent',
            iconBg: 'bg-blue-50 text-blue-600 ring-blue-100',
            ring: 'focus:ring-blue-500',
        },
        red: {
            btn: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 border-transparent',
            iconBg: 'bg-red-50 text-red-600 ring-red-100',
            ring: 'focus:ring-red-500',
        },
        green: {
            btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 border-transparent',
            iconBg: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
            ring: 'focus:ring-emerald-500',
        },
    };

    const currentTheme = theme[color] || theme.indigo;

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6 transition-all duration-300 ${
                isOpen ? 'visible' : 'invisible'
            }`}
        >
            
            {/* Backdrop dengan Blur Premium */}
            <div 
                className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={!processing ? onClose : undefined}
            ></div>

            {/* Modal Panel */}
            <div 
                className={`
                    relative w-full max-w-lg transform rounded-2xl bg-white p-0 text-left 
                    shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-gray-900/5 
                    transition-all duration-300 ease-out
                    ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}
                `}
            >
                {/* Decorative Top Border (Opsional, memberi aksen warna di paling atas) */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl ${currentTheme.btn.split(' ')[0]}`}></div>

                <div className="p-6 sm:p-8">
                    {/* Header Section */}
                    <div className="flex items-start gap-5">
                        {/* Icon dengan Double Ring Effect */}
                        <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl ring-4 ring-white ${currentTheme.iconBg}`}>
                            <i className={`fa ${icon} text-2xl`}></i>
                        </div>
                        
                        <div className="flex-1 pt-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-900 leading-6 tracking-tight">
                                    {title}
                                </h3>
                                {/* Close Button (X) */}
                                <button 
                                    onClick={onClose} 
                                    disabled={processing}
                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors -mt-2 -mr-2"
                                >
                                    <i className="fa fa-times text-lg"></i>
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                                {subTitle}
                            </p>
                        </div>
                    </div>

                    {/* Content / Form Inputs */}
                    <div className="mt-8 mb-2">
                        {children}
                    </div>
                </div>

                {/* Footer / Actions dengan Background berbeda */}
                <div className="bg-gray-50/80 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse sm:gap-3 rounded-b-2xl border-t border-gray-100">
                    <button 
                        onClick={onSubmit} 
                        disabled={processing}
                        type="button"
                        className={`w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform active:scale-95 ${currentTheme.btn} ${currentTheme.ring} disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none`}
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            </>
                        ) : (
                            submitLabel
                        )}
                    </button>
                    <button 
                        onClick={onClose} 
                        type="button" 
                        disabled={processing}
                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-95"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkUpdateModal;
// import React from 'react';

// const BulkUpdateModal = ({ isOpen, onClose, onSubmit, processing, data, setData }) => {
//     // Jika tidak open, jangan render apa-apa
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
//             <div className="bg-white rounded-xl p-6 w-96 shadow-2xl transform transition-all scale-100">
                
//                 <div className="flex justify-between items-center mb-4 border-b pb-2">
//                     <h3 className="text-lg font-bold text-gray-800">
//                         <i className="fa fa-clock-o mr-2 text-blue-600"></i>
//                         Update Deadline
//                     </h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
//                         <i className="fa fa-times"></i>
//                     </button>
//                 </div>

//                 <p className="text-sm text-gray-600 mb-4">
//                     Silakan pilih tanggal dan waktu baru. Perubahan ini akan diterapkan pada semua tugas yang Anda centang.
//                 </p>

//                 <div className="mb-6">
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Batas Waktu Baru
//                     </label>
//                     <input 
//                         type="datetime-local" 
//                         className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 text-gray-700"
//                         value={data.batas_waktu}
//                         onChange={e => setData('batas_waktu', e.target.value)}
//                     />
//                 </div>

//                 <div className="flex justify-end gap-3">
//                     <button 
//                         onClick={onClose} 
//                         type="button" 
//                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                     >
//                         Batal
//                     </button>
//                     <button 
//                         onClick={onSubmit} 
//                         disabled={processing || !data.batas_waktu}
//                         className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
//                     >
//                         {processing ? (
//                             <>
//                                 <i className="fa fa-spinner fa-spin mr-2"></i> Menyimpan...
//                             </>
//                         ) : (
//                             'Simpan Perubahan'
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BulkUpdateModal;