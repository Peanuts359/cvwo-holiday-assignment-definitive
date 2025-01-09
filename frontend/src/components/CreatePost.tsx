import React from "react";
import Navbar from "../ui/Navbar";

const CreatePost: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pt-4 pl-4">
            <Navbar />
            <main className="p-8">
                <h1>Create a Post</h1>
                <h2>Work in progress...</h2>
            </main>
        </div>
    );
};

export default CreatePost;