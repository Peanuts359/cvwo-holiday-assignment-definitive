import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../ui/Navbar";
import CommentContainer from "../ui/CommentContainer";

interface Comment {
    comment_id: number;
    username: string;
    content: string;
}


const ThreadPage: React.FC = () => {
    const { thread_id } = useParams<{ thread_id: string }>();
    const [thread, setThread] = useState<any>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [loggedInUser, setLoggedInUser] = useState<string>("");
    const [currentVote, setCurrentVote] = useState<string | null>(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const threadResponse = await axios.get(`${backendUrl}/threads/${thread_id}`);
                setThread(threadResponse.data);

                const commentsResponse = await axios.get(`${backendUrl}/threads/${thread_id}/comments`);
                console.log("API response for comments:", commentsResponse.data);
                setComments(commentsResponse.data || []);
            } catch (error) {
                console.error("Error fetching thread details:", error);
            }
        };

        const fetchLoggedInUser = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                const response = await axios.get(`${backendUrl}/username`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLoggedInUser(response.data.username);
            } catch (error) {
                console.error("Error fetching logged-in user:", error);
            }
        };
        fetchThread();
        fetchLoggedInUser();
    }, [thread_id]);

    const handleUpvote = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to vote.");
                return;
            }

            const response = await axios.post(
                `${backendUrl}/threads/${thread_id}/upvote`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setThread((prevThread: any) => ({
                    ...prevThread,
                    upvotes: prevThread.upvotes + (currentVote === "upvote" ? -1 : 1),
                    downvotes: currentVote === "downvote" ? prevThread.downvotes - 1 : prevThread.downvotes,
                    votes:
                        prevThread.upvotes -
                        prevThread.downvotes +
                        (currentVote === "upvote" ? -1 : currentVote === "downvote" ? 2 : 1),
                }));
                setCurrentVote(currentVote === "upvote" ? null : "upvote");
            }
        } catch (error) {
            console.error("Error upvoting thread:", error);
        }
    };

    const handleDownvote = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                alert("You must be logged in to vote.");
                return;
            }

            const response = await axios.post(
                `${backendUrl}/threads/${thread_id}/downvote`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setThread((prevThread: any) => ({
                    ...prevThread,
                    upvotes: currentVote === "upvote" ? prevThread.upvotes - 1 : prevThread.upvotes,
                    downvotes: prevThread.downvotes + (currentVote === "downvote" ? -1 : 1),
                    votes:
                        prevThread.upvotes -
                        prevThread.downvotes +
                        (currentVote === "downvote" ? 1 : currentVote === "upvote" ? -2 : -1),
                }));
                setCurrentVote(currentVote === "downvote" ? null : "downvote");
            }
        } catch (error) {
            console.error("Error downvoting thread:", error);
        }
    };

    const handleAddComment = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to comment.");
            return;
        }

        if (!newComment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/threads/${thread_id}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                setComments([...comments, response.data]);
                setNewComment("");
                alert("Comment added successfully!");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("An error occurred while adding the comment.");
        }
    };

    const handleEditComment = async (comment_id: number, newContent: string) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to edit comments.");
            return;
        }

        try {
            const response = await axios.put(
                `${backendUrl}/threads/${thread_id}/comments/${comment_id}`,
                { content: newContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setComments(
                    comments.map((comment) =>
                        comment.comment_id === comment_id
                            ? { ...comment, content: newContent }
                            : comment
                    )
                );
                alert("Comment edited successfully!");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error editing comment:", error);
            alert("An error occurred while editing the comment.");
        }
    };

    const handleDeleteComment = async (comment_id: number) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to delete comments.");
            return;
        }

        if (!window.confirm("Deleted comments cannot be restored. Do you want to proceed?")) {
            return;
        }

        try {
            console.log("Comment ID to delete:", comment_id);
            const response = await axios.delete(
                `${backendUrl}/threads/${thread_id}/comments/${comment_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setComments(comments.filter((comment) => comment.comment_id !== comment_id));
                alert("Comment deleted successfully.");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("An error occurred while deleting the comment.");
        }
    };


    if (!thread) return <div>Loading...</div>;

    console.log(comments);
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="p-8">
                <h1 className="text-2xl font-bold">{thread.title}</h1>
                <p className="text-sm text-gray-500 mb-2">
                    Posted by: <span className="font-bold">{thread.username}</span>
                </p>
                <p className="text-gray-500">Tags: {thread.tags || "No tags"}</p>
                <p className="mt-4">{thread.content}</p>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleDownvote}
                        className={`hover:bg-gray-200 rounded-full p-2 ${
                            thread.userVote === "downvoted" ? "bg-blue-500 text-white" : "bg-gray-300"
                        }`}
                    >
                        <img src="/down.svg" alt="Downvote" className="h-6 w-6"/>
                    </button>
                    <span className="text-lg font-bold">{thread.votes}</span>
                    <button
                        onClick={handleUpvote}
                        className={`hover:bg-gray-200 rounded-full p-2 ${
                            thread.userVote === "upvoted" ? "bg-red-500 text-white" : "bg-gray-300"
                        }`}
                    >
                        <img src="/up.svg" alt="Upvote" className="h-6 w-6"/>
                    </button>
                </div>

                <div className="mt-8">
                    <div>
                        <h2 className="text-lg font-bold">Comments: {comments.length}</h2>
                        {comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <CommentContainer
                                        key={comment.comment_id}
                                        comment_id={comment.comment_id}
                                        username={comment.username}
                                        content={comment.content}
                                        loggedInUser={loggedInUser}
                                        onEdit={handleEditComment}
                                        onDelete={handleDeleteComment}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>No comments yet. Be the first to comment!</p>
                        )}
                    </div>

                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a comment..."
                    />
                    <button
                        onClick={handleAddComment}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ThreadPage;
