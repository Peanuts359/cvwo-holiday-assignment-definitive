import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../hooks/useApi";

const Register: React.FC = () => {
    const { register } = useApi();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await register({ username, email, password });
            alert("Registration successful: " + response.message);
        } catch (error: any) {
            alert("Error: " + error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>

            <div>
                <p>Already have an account? <Link to="/">Login here</Link></p>
            </div>
        </form>
    );
};

export default Register;
