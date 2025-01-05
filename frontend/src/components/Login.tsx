import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const { login } = useApi();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login({ username, password });
            console.log("Login response:", response);
            if (response && response.data && response.data.token) {
                const token = response.data.token;
                sessionStorage.setItem("token", token);
                alert("Login successful");
                navigate("/menu");
            } else {
                throw new Error("Unexpected response format from server");
            }
        } catch (error: any) {
            alert("Error: " + error.response.data.error);
            setPassword("");
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