import React, { useState } from "react";

interface CommentProps {
    id: number;
    username: string;
    content: string;
    loggedInUser: string;
    onEdit: (id: number, updatedContent: string) => void;
    onDelete: (id: number) => void;
}

const CommentContainer: React.FC<CommentProps> = ({
                                                      id,
                                                      username,
                                                      content,
                                                      loggedInUser,
                                                      onEdit,
                                                      onDelete,
                                                  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);

    const handleSave = () => {
        if (editedContent.trim() === "") {
            alert("Content cannot be empty.");
            return;
        }

        if (editedContent === content) {
            alert("No changes detected.");
            setIsEditing(false);
            return;
        }

        onEdit(id, editedContent);
        setIsEditing(false);
    };

    return (
        <div className="mt-2 p-2 border-b relative">
            {isEditing ? (
                <div>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
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
                    <p className="text-sm font-bold">{username}</p>
                    <p>{content}</p>
                    {loggedInUser === username && (
                        <div className="absolute top-0 right-0 flex space-x-2">
                            <img
                                src="/edit.svg"
                                alt="Edit"
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            />
                            <img
                                src="/delete.svg"
                                alt="Delete"
                                className="h-4 w-4 cursor-pointer"
                                onClick={() => onDelete(id)}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommentContainer;
