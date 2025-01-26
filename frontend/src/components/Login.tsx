import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate, Link } from "react-router-dom";

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

            if (response && response.token) {
                const token = response.token;
                sessionStorage.setItem("token", token);
                alert("Login successful");
                navigate("/menu");
            } else {
                throw new Error("Unexpected response format from server");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            const errorMessage =
                error.response?.data?.error || error.message || "An unexpected error occurred.";
            alert("Error: " + errorMessage);
            setPassword("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="p-8 border rounded shadow-md">
                <div className="mb-4">
                    <h1>Login Page</h1>
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md"
                        required
                    />
                </div>

                <div className="mt-2">
                    <Link to="/reset" className="text-sm text-blue-500 hover:bold">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded-md"
                >Log In
                </button>

                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                        New? Sign up&nbsp;
                    </span>
                    <Link to="/register" className="text-sm text-blue-500 hover:bold">
                        here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;