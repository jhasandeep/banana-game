// client/src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./components/register";
import Login from "./components/login";
import Player from "./components/player";
import Admin from "./components/admin";
import Ranking from "./components/ranking";
import Header from "./components/header";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState({});
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const decoded = jwtDecode(token);

      const userId = decoded._id;

      try {
        const response = await axios.post(
          "https://banana-game-server-65st-git-main-sandeeps-projects-16cf5d96.vercel.app/api/ranking/user",
          { playerId: userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data, "user");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching User", error);
      }
    };

    fetchUser();
  }, []);
  return (
    <Router>
      {isAuthenticated && (
        <Header setIsAuthenticated={setIsAuthenticated} user={user} />
      )}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login setIsAuthenticated={setIsAuthenticated} user={user} />
          }
        />
        <Route
          exact
          path="/"
          element={
            isAuthenticated ? <Player user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/ranking"
          element={isAuthenticated ? <Ranking /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <Admin /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
