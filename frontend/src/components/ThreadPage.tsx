import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../ui/Navbar";

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
        fetchThread();
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

    if (!thread) return <div>Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="p-8">
                <h1 className="text-2xl font-bold">{thread.title}</h1>
                <p className="text-gray-500">Tags: {thread.tags || "No tags"}</p>
                <p className="mt-4">{thread.content}</p>

                <div className="mt-8">
                    <div>
                        <h2 className="text-lg font-bold">Comments: {comments.length}</h2>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="border border-gray-300 rounded-lg p-4 mb-4">
                                    <p className="text-sm font-bold">{comment.username}</p>
                                    <p>{comment.content}</p>
                                </div>
                            ))
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
