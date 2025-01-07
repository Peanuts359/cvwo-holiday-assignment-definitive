import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const Reset: React.FC = () => {
    const { reset } = useApi();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await reset ({ email, newPassword });
            alert("Password reset successful");
            navigate("/"); // Redirect to login page
        } catch (error: any) {
            alert("Error: " + error.response.data.error);
        }
    };

    return (
        <div className="min-h-screen pt-4 pl-4 flex bg-gray-50">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <h1>Reset Password</h1>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="new-password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>


                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded-md"
                >
                    Reset Password
                </button>

                <div className="mt-4">
                    <a href="/" className="text-sm text-blue-500 hover:bold">
                        Return to login page
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Reset;