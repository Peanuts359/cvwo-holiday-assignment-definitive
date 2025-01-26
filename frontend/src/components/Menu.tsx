import React, { useEffect, useState } from "react";
import Navbar from "../ui/Navbar";
import axios from "axios";
import ThreadContainer from "../ui/ThreadContainer";

interface Thread {
    thread_id: number;
    username: string;
    title: string;
    tags: string | null;
    content: string;
    commentCount: number;
    votes: number;
    upvotes: number;
    downvotes: number;
    userVote: "upvote" | "downvote" | null;
}

const Menu: React.FC = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<string>("");

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

                setLoggedInUser(response.data.username);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const fetchThreads = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    alert("You must be logged in to vote.");
                    return;
                }
                const response = await axios.get(`${backendUrl}/threads`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

    const handleUpvote = async (thread_id: number) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to vote.");
                return;
            }
            const response = await axios.post(
                `${backendUrl}/threads/${thread_id}/upvote`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setThreads((prevThreads) =>
                    prevThreads.map((thread) =>
                        thread.thread_id === thread_id
                            ? {
                                ...thread,
                                votes: thread.userVote === "upvote"
                                    ? thread.votes - 1
                                    : thread.userVote === "downvote"
                                        ? thread.votes + 2
                                        : thread.votes + 1,
                                upvotes: thread.userVote === "upvote"
                                    ? thread.upvotes - 1
                                    : thread.upvotes + 1,
                                downvotes: thread.userVote === "downvote"
                                    ? thread.downvotes - 1
                                    : thread.downvotes,
                                userVote: thread.userVote === "upvote" ? undefined : "upvote",
                            }
                            : thread
                    )
                );
            }
        } catch (error) {
            console.error("Error upvoting thread:", error);
        }
    };


    const handleDownvote = async (thread_id: number) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to vote.");
                return;
            }

            const response = await axios.post(
                `${backendUrl}/threads/${thread_id}/downvote`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setThreads((prevThreads) =>
                    prevThreads.map((thread) =>
                        thread.thread_id === thread_id
                            ? {
                                ...thread,
                                votes: thread.userVote === "downvote"
                                    ? thread.votes + 1
                                    : thread.userVote === "upvote"
                                        ? thread.votes - 2
                                        : thread.votes - 1,
                                downvotes: thread.userVote === "downvote"
                                    ? thread.downvotes - 1
                                    : thread.downvotes + 1,
                                upvotes: thread.userVote === "upvote"
                                    ? thread.upvotes - 1
                                    : thread.upvotes,
                                userVote: thread.userVote === "downvote" ? undefined : "downvote",
                            }
                            : thread
                    )
                );
            }
        } catch (error) {
            console.error("Error downvoting thread:", error);
        }
    };




    const handleDelete = async (thread_id: number) => {
        try {
            const response = await axios.delete(
                `${backendUrl}/threads/${thread_id}`,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            );
            if (response.status === 200) {
                setThreads(threads.filter((thread) => thread.thread_id !== thread_id));
                alert("Thread deleted successfully.");
            }
        } catch (error) {
            console.error("Error deleting thread:", error);
            alert("An error occurred while deleting the thread.");
        }
    };

    const handleEdit = async (thread_id: number, newContent: string) => {
        try {
            const response = await axios.put(
                `${backendUrl}/threads/${thread_id}`,
                { content: newContent },
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            );
            if (response.status === 200) {
                setThreads(
                    threads.map((thread) =>
                        thread.thread_id === thread_id ? { ...thread, content: newContent } : thread
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
                        {threads.map((thread) => {
                            return (
                                <ThreadContainer
                                    key={thread.thread_id}
                                    thread_id={thread.thread_id}
                                    username={thread.username}
                                    title={thread.title}
                                    tags={thread.tags}
                                    content={thread.content}
                                    commentCount={thread.commentCount}
                                    loggedInUser={loggedInUser}
                                    votes={thread.votes}
                                    initialVote={thread.userVote}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    onUpvote={handleUpvote}
                                    onDownvote={handleDownvote}
                                />
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default Menu;
