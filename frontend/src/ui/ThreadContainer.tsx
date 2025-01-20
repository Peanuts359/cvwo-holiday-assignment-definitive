import React from "react";

interface ThreadProps {
    id: number;
    username: string;
    title: string;
    content: string;
    loggedInUser: string;
    onDelete: (id: number) => void;
}

const ThreadContainer: React.FC<ThreadProps> = ({ id, username, title, content, loggedInUser, onDelete }) => {
    const handleDelete = () => {
        console.log("Thread ID to delete:", id);
        if (window.confirm("Deleted posts cannot be restored. Do you really want to delete this?")) {
            onDelete(id);
        }
    }
    return (
        <div className="border border-gray-300 p-4 rounded-lg shadow-md relative">

            <h2 className="font-bold text-lg mb-2">{title}</h2>

            <p className="text-sm text-gray-500 mb-4">Posted by: {username}</p>

            <p className="text-base mb-4">{content}</p>

            {loggedInUser === username && (
                <button
                    onClick={handleDelete}
                    className="absolute bottom-2 right-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                    Delete
                </button>
            )}
        </div>
    );
};

export default ThreadContainer;
