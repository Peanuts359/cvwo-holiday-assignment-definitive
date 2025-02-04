import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import Menu from "./components/Menu"
import CreateThread from "./components/CreateThread";
import ThreadPage from "./components/ThreadPage";

const App: React.FC = () => {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/create" element={<CreateThread />} />
          <Route path="/threads/:thread_id" element={<ThreadPage />} />
        </Routes>
      </div>
  );
};

export default App;