// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container flex header-content">
        <Link to="/" className="logo">FreelanceHub</Link>
        <nav>
          <button
            onClick={toggleTheme}
            style={{
              marginRight: 16,
              background: "none",
              border: "none",
              color: "var(--primary)",
              fontSize: "1.2em",
              cursor: "pointer"
            }}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <Link to="/">Home</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && (
            <>
              {user.role === "Client" && <Link to="/client">Dashboard</Link>}
              {user.role === "Freelancer" && <Link to="/freelancer">Dashboard</Link>}
              {user.role === "Admin" && <Link to="/admin">Admin Panel</Link>}
              <span style={{ marginLeft: 16, color: "var(--primary)" }}>
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: 16,
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 12px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;