import React from 'react';

const Header: React.FC = () => {

    return (
        <nav className="top-nav w-full text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">Poke Plaza</div>
        <div className="flex space-x-4">
            <a href="#home" className="hover:underline">Home</a>
            <a href="#about" className="hover:underline">Account Settings</a>
            <a href="#contact" className="hover:underline">Sign In</a>
        </div>
        </nav>
    );
};

export default Header;