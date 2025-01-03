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
        <form onSubmit={handleSubmit}>
            <h1>Reset Password</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
        </form>
    );
};

export default Reset;