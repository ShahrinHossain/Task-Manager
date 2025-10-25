import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterUserModal.css";

const RegisterUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setModalMessage("Passwords do not match");
      setTimeout(() => setModalMessage(""), 2000);
      return;
    }

    if (email.trim().toLowerCase().endsWith("@donezone.com")) {
      setModalMessage("You cannot use this email domain");
      setTimeout(() => setModalMessage(""), 2000);
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/register", {
        name: username,
        email,
        password,
      });
    
      onSuccess(res.data);
    
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setModalMessage("");
      onClose();
    
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "Email already in use or action forbidden.";
        setModalMessage(msg);
      } 
      else if (err.response?.status === 422) {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "Invalid input data.";
        setModalMessage(msg);
      }
      else {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "An unexpected server error occurred.";
        navigate("/error", { state: { message: msg, code: 500 } });
        return;
      } 

      setTimeout(() => setModalMessage(""), 2000);
    } finally {
      setSubmitting(false);
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
          <button onClick={handleRegister} disabled={submitting}>
            {submitting ? "Registering..." : "Register"}
          </button>
          <button onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </div>
        {modalMessage && <p className="urm-message">{modalMessage}</p>}
      </div>
    </div>
  );
};

export default RegisterUserModal;
