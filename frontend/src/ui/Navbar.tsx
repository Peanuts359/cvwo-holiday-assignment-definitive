import React from "react";
import Dropdown from "./Dropdown";

interface NavbarProps {
    username: string;
    onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onSignOut }) => {
    return (
        <nav className="flex items-center justify-between bg-gray-100 p-4 shadow-md">
            <div className="text-lg font-medium text-gray-700">
                Signed in as: <span className="font-bold">{username}</span>
            </div>

            <Dropdown onSignOut={onSignOut} />
        </nav>
    );
};

export default Navbar;