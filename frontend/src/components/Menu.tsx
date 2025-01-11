import React from "react";
import Navbar from "../ui/Navbar";

const Menu: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-4 pl-4">
            <Navbar />
            <main className="p-8">
                <h1>Wow, such empty</h1>
            </main>
        </div>
    );
};

export default Menu;