import React from "react";

interface ThreadProps {
    id: number;
    username: string;
    title: string;
    content: string;
    onDelete: (id: number) => void;
}

const ThreadContainer: React.FC<ThreadProps> = ({ id, username, title, content, onDelete }) => {
    const handleDelete = () => {
        if (window.confirm("Deleted posts cannot be restored. Do you really want to delete this?")) {
            onDelete(id);
        }
    }
    return (
        <div className="border border-gray-300 p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg">{title}</h2>
            <p className="text-sm text-gray-500">Posted by: {username}</p>
            <p className="mt-2">{content}</p>
            <button
                onClick={handleDelete}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 float-right"
            >
                Delete
            </button>
        </div>
    );
};

export default ThreadContainer;
