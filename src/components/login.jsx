// client/src/components/Login.js
import React, { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";

function Login({ setIsAuthenticated, user }) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const socket = useMemo(() => io(`${apiUrl}`), []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login successful");

      socket.emit("playerConnected", user._id);
      setIsAuthenticated(true);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div className="bg-purple-700 flex justify-center items-center w-screen h-screen">
      <div className="translate-x-2/r translate-y-1/4  flex flex-col justify-center items-center px-16 py-16 rounded-lg bg-yellow-500">
        <h2 className="text-2xl text-black">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-64 h-12 rounded-md pl-4 placeholder:pl-2 block mt-4"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-64 h-12 rounded-md pl-4 placeholder:pl-2 block mt-4"
            required
          />
          <div className="text-center">
            <button
              type="submit"
              className="px-16 py-1 mt-4 text-white bg-purple-800 text-center rounded-lg "
            >
              Login
            </button>
          </div>
          {error && (
            <p className="text-center text-base font-medium text-red-600 mt-2 ">
              {error}
            </p>
          )}

          <p className="mt-4 text-center">
            Don't have account ?{" "}
            <Link to="/register">
              <span className="text-purple-800 text-lg">Register</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
