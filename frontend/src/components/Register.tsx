import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const { register } = useApi();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await register({ username, email, password });
            alert("Registration successful: " + response.message);
            navigate("/");
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error || "An unexpected error occurred.";
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen pt-4 pl-4 flex bg-gray-50">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <h1>Create An Account</h1>
                    {error && <p style={{color: "red"}}>{error}</p>}
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


                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded-md"
                >
                    Register
                </button>

                <div className="mt-4">
                    <span className="text-sm text-gray-600">
                        Already have an account? Log in&nbsp;
                    </span>
                    <a href="/" className="text-sm text-blue-500 hover:bold">
                        here
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Register;
