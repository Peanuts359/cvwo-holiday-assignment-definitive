import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const { login } = useApi();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // React Router's navigation hook

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            alert("Login successful");
            navigate("/dashboard"); // Redirect to a dashboard or another page
        } catch (error: any) {
            alert("Error: " + error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;