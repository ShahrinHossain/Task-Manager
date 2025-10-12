import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // FastAPI OAuth2 expects form data, not JSON
    const data = new URLSearchParams();
    data.append("username", email); // backend expects 'username' field
    data.append("password", password);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // store token in localStorage
      localStorage.setItem("token", response.data.access_token);
      setMessage("✅ Login successful");

      // navigate to app page after successful login
      navigate("/app"); 
    } catch (error) {
      console.error(error);
      if (error.response) {
        // backend returned an error message
        setMessage(`❌ ${error.response.data.detail.message || "Login failed"}`);
      } else {
        setMessage("❌ Server error or network issue");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginPage;
