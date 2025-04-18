import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-200">
            <Navbar />
            <Sidebar />
            <main className="pt-16 pl-16 min-h-[calc(100vh-64px)]">
                {children}
            </main>
        </div>
    );
};

export default Layout;
