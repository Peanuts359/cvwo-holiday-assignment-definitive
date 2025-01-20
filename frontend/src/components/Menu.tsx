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

    useEffect(() => {
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
            alert("An error occurred while deleting the post.");
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
                                onDelete={handleDelete}
                            />
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default Menu;
