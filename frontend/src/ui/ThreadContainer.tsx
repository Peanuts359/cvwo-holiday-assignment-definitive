import React, {useState} from "react";

interface ThreadProps {
    id: number;
    username: string;
    title: string;
    content: string;
    loggedInUser: string;
    onDelete: (id: number) => void;
    onEdit: (id: number, newContent: string) => void;
}

const ThreadContainer: React.FC<ThreadProps> = ({ id, username, title, content, loggedInUser, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);

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
                    <p className="text-base mb-4">{content}</p>
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
