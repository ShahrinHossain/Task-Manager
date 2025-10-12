import React, { useState } from "react";
import axios from "axios";
import "../UserDashboard.css";

const RegisterUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/auth/register", {
        name: username,
        email,
        password,
      });

      onSuccess();
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setMessage("");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || "Registration failed";
      setMessage(msg);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="urm-modal-overlay">
      <div className="urm-modal-content">
        <h3>User Registration</h3>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="urm-modal-buttons">
          <button onClick={handleRegister}>Register</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        {message && <p className="urm-message">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterUserModal;
