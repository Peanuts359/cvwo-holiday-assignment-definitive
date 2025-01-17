import React, { useEffect, useState } from "react";
import Navbar from "../ui/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios"

interface JwtPayload {
    username: string;
}

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [username, setUsername] = useState<string>("Anonymous");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const token = sessionStorage.getItem("token"); // Get the JWT token
                if (!token) {
                    throw new Error("Invalid session. Please log in again.");
                }

                const response = await axios.get("http://localhost:8080/username", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching username:", error);
                setUsername("Anonymous");
            }
        };
        fetchUsername();
    }, []);

    const handleTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target.value.length <= 100) {
            setTitle(event.target.value);
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };



    const handleSubmit = () => {
        alert(`Posted by: ${username}\nTitle: ${title}\nPost content: ${text}`);
        navigate("/menu");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-4 pl-4">
            <Navbar />
            <main className="p-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">Create a Post</h1>
                <h2 className="text-lg text-gray-600 mb-6">Enter your post content here. Currently only supports
                    text.</h2>
                <div className="relative w-3/4 mb-4">
                    <textarea
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full h-12 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your post title (max 100 characters)"
                    />
                </div>
                <div className="relative h-3/4 w-3/4 mb-6">
                    <textarea
                        value={text}
                        onChange={handleTextChange}
                        className="w-full h-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute bottom-2 left-0 w-full flex justify-between items-center">
                        <div className="text-sm text-gray-500 px-4">
                            {text.length}
                        </div>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="right-2 w-1/5 px-6 py-2 border-gray-500 hover:bg-blue-500 text-black rounded-md"
                        >Create
                        </button>
                    </div>

                </div>

            </main>
        </div>
    );
};

export default CreatePost;