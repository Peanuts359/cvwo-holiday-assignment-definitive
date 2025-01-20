import React, { useEffect, useState } from "react";
import Navbar from "../ui/Navbar";
import axios from "axios";
import ThreadContainer from "../ui/ThreadContainer";

interface Thread {
    id: number;
    username: string;
    title: string;
    content: string;
}

const Menu: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<string>("");

    useEffect(() => {
        const fetchUser = async () => {
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

                setLoggedInUser(response.data.username);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const fetchThreads = async () => {
            try {
                const response = await axios.get("http://localhost:8080/threads");
                console.log("Fetched threads:", response.data);
                setThreads(response.data || []);
            } catch (error) {
                console.error("Error fetching threads:", error);
                setThreads([]);
            }
        };

        fetchUser();
        fetchThreads();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await axios.delete(`http://localhost:8080/threads/${id}`);
            if (response.status === 200) {
                setThreads(threads.filter((thread) => thread.id !== id));
                alert("Thread deleted successfully.");
            }
        } catch (error) {
            console.error("Error deleting thread:", error);
            alert("An error occurred while deleting the thread.");
        }
    };

    const handleEdit = async (id: number, newContent: string) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/threads/${id}`,
                { content: newContent },
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            );
            if (response.status === 200) {
                setThreads(
                    threads.map((thread) =>
                        thread.id === id ? { ...thread, content: newContent } : thread
                    )
                );
                alert("Thread edited successfully.");
            }
        } catch (error) {
            console.error("Error editing thread:", error);
            alert("An error occurred while editing the thread.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="p-8">
                <h1 className="text-2xl font-bold mb-4">All Threads</h1>
                {!threads || threads.length === 0 ? (
                    <p>Wow, such empty</p>
                ) : (
                    <ul className="space-y-4">
                        {threads.map((thread) => (
                            <ThreadContainer
                                key={thread.id}
                                id={thread.id}
                                username={thread.username}
                                title={thread.title}
                                content={thread.content}
                                loggedInUser={loggedInUser}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default Menu;
