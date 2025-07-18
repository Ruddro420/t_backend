import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet, useLocation } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const location = useLocation();
    const handleResize = () => {
        if (window.innerWidth < 991) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    };
    useEffect(() => {

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);


    }, [location.pathname]);



    return (
        <div className='flex flex-col justify-between h-full min-h-screen'>
            <div className='flex'>
                <Toaster position="top-center" reverseOrder={false} />
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                        onClick={toggleSidebar}
                    ></div>
                )}


                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className='flex flex-col w-full relative' >
                    <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                    <div  className='w-full lg:px-6 md:px-4 px-4'>
                        <Outlet /* context={{ put context-item }} */ />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;