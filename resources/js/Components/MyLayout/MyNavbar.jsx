import { Link, usePage } from '@inertiajs/inertia-react';
import React, { useEffect, useRef, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../Shared/ToastNotification';
import hasAnyPermission from '../../Utilities/Permissions';
import ConnectionStatus from '../../Utilities/ConnectionStatus';

const MyNavbar = ({ toggleSidebar, isSidebarOpen }) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { auth } = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Handle logout
    const handleLogout = () => {
        Inertia.post(route('logout'), {}, {
            onSuccess: () => {
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil logout!',
                });
            },
            onError: (error) => {
                ToastNotification({
                    icon: 'error',
                    title: 'Gagal logout!',
                });
            }
        });
    };

    const displayIdentity = () => {
        // Jika mahasiswa
        if (auth?.mhs) {
            // Jika NIM ada dan tidak kosong
            if (auth.mhs.nim && auth.mhs.nim.trim() !== '') {
                // return 'NIM: ' + auth.mhs.nim;
                return `${auth.mhs.nim}@idn.ac.id`; // NIM: auth.mhs.nim;
            }
            // Jika NIM kosong
            return auth.user.email;
        }

        // Jika bukan mahasiswa
        return auth.user.email;
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between w-full px-4 py-3 bg-white shadow-sm">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={toggleSidebar}
                        className="text-2xl lg:hidden"
                    >

                        {isSidebarOpen ? (
                            <i className="fas fa-times"></i> // Icon close
                        ) : (
                            <i className="fas fa-bars"></i> // Icon hamburger
                        )}

                    </button>
                    <Link href={route('my.dashboard.index')}>
                        {/* {identityWebsite.is_brand ? (
                    <img src={identityWebsite.logo_web} alt="Logo" className="ml-4 h-8" />
                ) : (
                    <h1 className="ml-5 text-xl font-black text-blue-600 uppercase tracking-[3px] lg:tracking-[7px]">
                        {identityWebsite.name_web}
                    </h1>
                )} */}
                        {/* <h1 className="ml-5 text-xl font-black text-blue-600 tracking-[3px] lg:tracking-[5px]">
                            eLearning
                        </h1> */}
                        <img
                            src={`/images/new-logo.svg`}
                            alt="eLearning"
                            className="ml-5 w-40 h-auto"
                            style={{ marginTop: "-6px" }}
                        />
                    </Link>
                </div>

                {/* Search and Icons */}
                {/* <div className="hidden lg:flex flex-1 items-center justify-center">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 transition-colors duration-300 border border-gray-300 hover:border-[#7F9CF5] bg-gray-100/30 rounded-xl group hover:border-gray-300/70 backdrop-blur hover:dark:border-gray-600"
            >
                <div className="flex items-center gap-2">
                <i className="fas fa-search group-hover:text-[#7F9CF5]"></i>
                <span className="text-sm text-gray-400">Cari produk &amp; transaksi</span>
                </div>
                <span className="inline-flex items-center ml-3 gap-1 px-2 py-1 text-xs tracking-tighter bg-gray-100 border rounded-md whitespace-nowrap dark:bg-gray-700/20">
                <i className="fas fa-keyboard"></i>
                <kbd className="inline-flex items-center uppercase">k</kbd>
                </span>
            </button>
            </div> */}

                <div className="relative flex items-center space-x-4">

                    <ConnectionStatus />

                    {hasAnyPermission(['tanpa.watermark']) ? (
                        <>
                            {/* Versi Desktop - PREMIUM */}
                            <span className="hidden md:flex text-xs font-semibold bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full items-center gap-1 shadow-md">
                                <span className="animate-spin-slow text-yellow-700">★</span> PREMIUM
                            </span>

                            {/* Versi Mobile - PREMIUM */}
                            <span className="md:hidden flex items-center justify-center px-3 py-1.5 cursor-pointer bg-yellow-400 text-yellow-900 rounded-2xl">
                                <span className="animate-spin-slow text-yellow-700 text-lg">★</span>
                            </span>
                        </>
                    ) : (
                        <>
                            {/* Versi Desktop - FREEMIUM */}
                            <span className="hidden md:flex text-xs font-semibold bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full items-center gap-1 shadow-sm">
                                <span className="text-gray-500">☆</span> FREEMIUM
                            </span>

                            {/* Versi Mobile - FREEMIUM */}
                            <span className="md:hidden flex items-center justify-center px-3 py-1.5 cursor-pointer bg-gray-200 text-gray-700 rounded-2xl">
                                <span className="text-gray-500 text-lg">☆</span>
                            </span>
                        </>
                    )}

                    {/* <button type="button" className="px-3 py-2 text-gray-600 cursor-pointer bg-[#f3f4f680] rounded-2xl">
                        <i className="fas fa-bell"></i>
                    </button> */}

                    {/* User Icon and Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="px-3 py-2 cursor-pointer bg-[#EBF4FF] text-[#7F9CF5] rounded-2xl"
                        >
                            <i className="fas fa-user"></i>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-6 min-w-[15rem] bg-white shadow-md rounded-lg p-2 z-50">
                                <div className="px-5 py-3 bg-gray-100 rounded-t-lg">
                                    <div className="inline-block text-sm font-semibold text-gray-800">{auth.user.name}</div>
                                    <div className="text-sm font-medium text-gray-800 italic">{displayIdentity()}</div>
                                </div>

                                <div className="flex flex-col pt-4 pb-0 space-y-1">
                                    <Link href={route('landing.index')} className="flex items-center gap-x-2.5 py-3 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-all duration-200">
                                        <i className="fas fa-home"></i> Halaman Depan
                                    </Link>
                                    <Link href={route('my.pw.index')} className="flex items-center gap-x-2.5 py-3 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-all duration-200">
                                        <i className="fas fa-lock"></i> Ganti Password
                                    </Link>
                                    <button
                                        type="button"
                                        className="flex items-center gap-x-2.5 py-3 px-3 rounded-lg text-sm text-red-600 hover:bg-red-100 hover:text-red-600 transition-all duration-200 w-full"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt"></i> Keluar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Modal pencarian */}
            {/* <ModalSearch isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
            {/* Inline animation styles */}
            <style>{`
            @keyframes premium-glow {
                0%, 100% {
                    box-shadow: 0 0 6px rgba(250, 204, 21, 0.6), 0 0 12px rgba(250, 204, 21, 0.4);
                    transform: scale(1);
                }
                50% {
                    box-shadow: 0 0 14px rgba(250, 204, 21, 1), 0 0 24px rgba(250, 204, 21, 0.8);
                    transform: scale(1.05);
                }
            }

            @keyframes spin-slow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .animate-premium-glow {
                animation: premium-glow 2.5s ease-in-out infinite;
            }

            .animate-spin-slow {
                display: inline-block;
                animation: spin-slow 6s linear infinite;
            }
        `}</style>
        </>
    );
}

export default MyNavbar;
