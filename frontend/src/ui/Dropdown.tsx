import React, { useState } from "react";

interface dropdownProps {
    onSignOut: () => void;
    create: () => void;
}

const Dropdown: React.FC<dropdownProps> = ({ onSignOut, create }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={toggleMenu}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            >
                <div className="w-6 h-1 bg-black mb-1"></div>
                <div className="w-6 h-1 bg-black mb-1"></div>
                <div className="w-6 h-1 bg-black"></div>
            </button>

            {isOpen && (
                <div className="flex flex-col absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                    <button
                        onClick={create}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-500 hover:text-white focus:outline-none"
                    >
                        Create New Post
                    </button>
                    <button
                        onClick={onSignOut}
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-500 hover:text-white focus:outline-none"
                    >
                        Sign Out
                    </button>

                </div>
            )}
        </div>
    );
};

export default Dropdown;