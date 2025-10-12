import React, { useState } from "react";
import axios from "axios";
import "../AdminDashboard.css";

const RegisterAdminModal = ({ isOpen, onClose, onAdminRegistered }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/register_admin",
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Admin registered successfully");

      // Clear message after 2 seconds
      setTimeout(() => setMessage(""), 2000);

      onAdminRegistered(); 
      setName("");
      setEmail("");
      setPassword("");
      onClose(); // close modal
    } catch (error) {
      console.error(error);
      if (error.response) {
        setMessage(error.response.data.detail || "Registration failed");
      } else {
        setMessage("Server error or network issue");
      }

      // Clear message after 2 seconds
      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Register New Admin</h3>
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
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default RegisterAdminModal;
