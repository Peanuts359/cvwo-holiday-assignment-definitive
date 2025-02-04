import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import HomeButton from "./HomeButton";
import axios from "axios";

const Navbar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const navigate = useNavigate();
    const backendUrl: string = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem("token"); // Get the JWT token
                if (!token) {
                    throw new Error("Invalid session. Please log in again.");
                }

                const response = await axios.get(`${backendUrl}/username`, {
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

    const redirectCreate = () => {
        navigate("/create");
    }

    return (
        <nav className="flex items-center justify-between bg-gray-100 p-4 shadow-md">
            <div className="flex items-center space-x-2">
                <HomeButton/>
                <div className="text-lg font-medium text-gray-700">
                    Signed in as: <span className="font-bold">{username}</span>
                </div>
            </div>

            <Dropdown onSignOut={handleSignOut} create={redirectCreate}/>
        </nav>
    );
};

export default Navbar;