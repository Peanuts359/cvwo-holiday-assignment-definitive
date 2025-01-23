import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../ui/Navbar";
import CommentContainer from "../ui/CommentContainer";

interface Comment {
    id: number;
    username: string;
    content: string;
}


const ThreadPage: React.FC = () => {
    const { thread_id } = useParams<{ thread_id: string }>();
    const [thread, setThread] = useState<any>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>("");
    const [loggedInUser, setLoggedInUser] = useState<string>("");

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const threadResponse = await axios.get(`http://localhost:8080/threads/${thread_id}`);
                setThread(threadResponse.data);

                const commentsResponse = await axios.get(`http://localhost:8080/threads/${thread_id}/comments`);
                setComments(commentsResponse.data || []);
            } catch (error) {
                console.error("Error fetching thread details:", error);
            }
        };

        const fetchLoggedInUser = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                const response = await axios.get("http://localhost:8080/username", {
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
                `http://localhost:8080/threads/${thread_id}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                setComments([...comments, response.data]);
                setNewComment("");
                alert("Comment added successfully!");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("An error occurred while adding the comment.");
        }
    };

    const handleEditComment = async (commentId: number, newContent: string) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to edit comments.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/comments/${commentId}`,
                { content: newContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setComments(
                    comments.map((comment) =>
                        comment.id === commentId
                            ? { ...comment, content: newContent }
                            : comment
                    )
                );
                alert("Comment edited successfully!");
            }
        } catch (error) {
            console.error("Error editing comment:", error);
            alert("An error occurred while editing the comment.");
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("You must be logged in to delete comments.");
            return;
        }

        if (!window.confirm("Deleted comments cannot be restored. Do you want to proceed?")) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:8080/comments/${commentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setComments(comments.filter((comment) => comment.id !== commentId));
                alert("Comment deleted successfully.");
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("An error occurred while deleting the comment.");
        }
    };


    if (!thread) return <div>Loading...</div>;

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
                <div className="mt-8">
                    <div>
                        <h2 className="text-lg font-bold">Comments: {comments.length}</h2>
                        {comments.length > 0 ? (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <CommentContainer
                                        key={comment.id}
                                        id={comment.id}
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
