import React, { useEffect, useRef, useState } from 'react';
import MyNavbar from '../Components/MyLayout/MyNavbar';
import { Head, usePage } from '@inertiajs/inertia-react';
import MySidebar from '../Components/MyLayout/MySidebar';
import MyFooter from '../Components/MyLayout/MyFooter';

const MyLayout = ({children}) => {

    const { identityWebsite } = usePage().props;

    const [sideOpen, setSideOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('my');
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setSideOpen(!sideOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setSideOpen(false);
        }
        };

        if(sideOpen){
        document.addEventListener('mousedown', handleClickOutside);
        }else{
        document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
        
    }, []);

    return (
        <>
        <Head>
            {/* {identityWebsite.favicon_web && (
                <link rel="icon" href={identityWebsite.favicon_web} type="image/png" />
            )} */}
        </Head>
       
        <div className="flex flex-col min-h-screen font-poppins relative">
            {/* Navbar */}
            <MyNavbar toggleSidebar={toggleSidebar} isSidebarOpen={sideOpen} />

            <div className="flex flex-1 pt-16">
                {/* Sidebar */}
                <div ref={sidebarRef} className="h-screen overflow-y-auto hide-scrollbar">
                <MySidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} sideOpen={sideOpen} />
                </div>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-100 px-6 pt-6 pb-3 hide-scrollbar">

                {/* Content Wrapper */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Footer */}
                <MyFooter/>
                </main>

                {/* <main className="flex-1 h-screen overflow-y-auto bg-gray-100 p-6 hide-scrollbar">
                {children}          
                <LayoutFooter/>
                </main> */}

            </div>

            {/* Footer */}
            {/* <LayoutFooter /> */}
        </div>
        </>
    );
}

export default MyLayout;
