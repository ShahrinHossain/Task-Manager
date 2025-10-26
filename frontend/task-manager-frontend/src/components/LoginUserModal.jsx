import React, { useState } from "react";
import { BASE_URL } from "../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./LoginUserModal.css";

const LoginUserModal = ({ onClose, onSuccess, onFail }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate(); 

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      const data = new URLSearchParams();
      data.append("username", email);
      data.append("password", password);

      const res = await axios.post(`${BASE_URL}/auth/login`, data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token, role } = res.data || {};

      if (access_token) {
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role || "user");
        onClose();
        onSuccess(role || "user");
      } else {
        onFail("Login failed");
      }

    } catch (err) {
      console.error(err);

      if (err.response?.status === 500) {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "An unexpected server error occurred.";
        navigate("/error", { state: { message: msg, code: 500} });
        return; 
      }

      const msg =
        err.response?.data?.detail?.message ||
        err.response?.data?.message ||
        "Invalid credentials";
      onFail(msg);

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" role="dialog" aria-modal="true">
        <h3>Login</h3>
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
          <button onClick={handleLogin} disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LoginUserModal;
