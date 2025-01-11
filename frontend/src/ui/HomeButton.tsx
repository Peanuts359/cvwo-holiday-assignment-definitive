import React from "react";
import { useNavigate } from "react-router-dom";

const HomeButton: React.FC = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate("/menu");
    };

    return (
        <button
            onClick={handleHomeClick}
            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
            <img src="/home.svg" alt="Home" className="w-6 h-6" />
        </button>
    );
};

export default HomeButton;