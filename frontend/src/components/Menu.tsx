import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Menu: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem("token"); // Get the JWT token
                if (!token) {
                    throw new Error("Invalid session. Please log in again.");
                }

                const response = await axios.get("http://localhost:8080/menu", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/");
            }
        };

        fetchUser();
    }, [navigate]);

    const handleSignOut = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-4 pl-4">
            <div className="mb-4">
                <h1>Welcome, {username || "User"}!</h1>
            </div>
            <button
                onClick={handleSignOut}
                className="w-36 h-12 p-2 bg-red-500 text-white rounded-md"
            >
                Sign Out
            </button>
        </div>
    );
};

export default Menu;