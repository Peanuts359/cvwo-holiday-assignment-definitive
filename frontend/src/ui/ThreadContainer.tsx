import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

interface ThreadProps {
    id: number;
    username: string;
    title: string;
    tags: string | null;
    content: string;
    commentCount: number;
    loggedInUser: string;
    onDelete: (id: number) => void;
    onEdit: (id: number, newContent: string) => void;
}

const ThreadContainer: React.FC<ThreadProps> = ({ id, username, title, tags, content, commentCount, loggedInUser, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const navigate = useNavigate();
    console.log("ThreadContainer received ID:", id);

    const truncatedContent =
        content.length > 200 ? content.slice(0, 200) + "..." : content;

    const handleReadMore = () => {
        console.log("Navigating to thread with ID:", id);
        if (id) {
            navigate(`/threads/${id}`); // Navigate to thread details page
        } else {
            console.error("Thread ID is undefined");
        }
    };

    const handleSave = () => {
        if (newContent.trim() === "") {
            alert("Content cannot be empty.");
            return;
        }

        if (newContent === content) {
            alert("No changes detected.");
            setIsEditing(false);
            return;
        }
        onEdit(id, newContent);
        setIsEditing(false);
    };

    const handleDelete = () => {
        console.log("Thread ID to delete:", id);
        if (window.confirm("Deleted posts cannot be restored. Do you really want to delete this?")) {
            onDelete(id);
        }
    }
    return (
        <div className="border border-gray-300 p-4 rounded-lg shadow-md relative">
            { isEditing ? (
                <div>
                    <h2 className="font-bold text-lg mb-2">{title}</h2>
                    <p className="text-sm text-gray-500 mb-4">Posted by: {username}</p>
                    <p className="text-sm text-gray-500">
                        Tags: {tags ? tags.split(",").map(tag => (
                        <span key={tag} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700 mr-2">
                        {tag.trim()}
                        </span>
                        )) : ""}
                    </p>

                    <h3>Editing thread content</h3>
                    <textarea
                        className="w-full p-2 border rounded-md"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Edit content"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            ) : (
                <>
                    <h2 className="font-bold text-lg mb-2">{title}</h2>
                    <p className="text-sm text-gray-500 mb-4">Posted by: {username}</p>
                    <p className="text-sm text-gray-500">
                        Tags: {tags ? tags.split(",").map(tag => (
                        <span key={tag}
                              className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700 mr-2">
                            {tag.trim()}
                        </span>
                        )) : ""}
                    </p>
                    <p className="text-base mb-2">{truncatedContent}</p>
                    <p
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={handleReadMore}
                    >
                        Read More
                    </p>
                </>
            )}


            {loggedInUser === username && (
                <div className="absolute top-2 right-2 flex space-x-2">
                    <img
                        src="/edit.svg"
                        alt="Edit"
                        className="h-6 w-6 cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    />
                    <img
                        src="/delete.svg"
                        alt="Delete"
                        className="h-6 w-6 cursor-pointer"
                        onClick={handleDelete}
                    />

                </div>
            )}
        </div>
    );
};

export default ThreadContainer;
