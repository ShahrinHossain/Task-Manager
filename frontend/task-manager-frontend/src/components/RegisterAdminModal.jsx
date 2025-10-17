import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterUserModal.css";

const RegisterAdminModal = ({ isOpen, onClose, onAdminRegistered }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSave = async () => {
    if (email.trim().toLowerCase().endsWith("@donezone.com") == false) {
      setMessage("Invalid email domain");
      setTimeout(() => setMessage(""), 2000);
      return;
    }

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

      setTimeout(() => setMessage(""), 2000);

      onAdminRegistered(); 
      setName("");
      setEmail("");
      setPassword("");
      onClose(); 
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "Email already in use or action forbidden.";
        setMessage(msg);
      } 
      else if (err.response?.status === 422) {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "Invalid input data.";
        setMessage(msg);
      }
      else {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "An unexpected server error occurred.";
        navigate("/error", { state: { message: msg, code: 500 } });
        return;
      }

      setTimeout(() => setMessage(""), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="urm-modal-overlay">
      <div className="urm-modal-content">
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
        <div className="urm-modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
        {message && <p className="urm-message">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterAdminModal;
