import React, { useState } from "react";
import "./AdminDashboard.css";
import "./UserDashboard.css";
import "./Home.css";
import RegisterUserModal from "./components/RegisterUserModal";
import LoginUserModal from "./components/LoginUserModal";

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleLoginSuccess = (role) => {
    showMessage("Login successful");
    setTimeout(() => {
      if (role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        window.location.href = "/user-dashboard";
      }
    }, 2000);
  };

  const handleRegistrationSuccess = () => {
    showMessage("Registration successful");
    setTimeout(() => setIsRegisterOpen(false), 2000);
  };

  return (
    <div>
      <div className="AppName">Welcome to DoneZone</div>
      {/* <div className="welcome-message">Welcome to DoneZone, where you can easily organize, track, and manage 
          all your tasks in one place and boost your productivity effortlessly.
          So hurry up and start being productive now!</div> */}
      <div className="auth-page">
        <div className="auth-buttons">
          <button onClick={() => setIsLoginOpen(true)}>Login</button>
          <button onClick={() => setIsRegisterOpen(true)}>Register</button>
        </div>

        {/* Demo image section */}
        <img 
          src="/welcomepage.png" 
          alt="App Demo" 
          className="demo-image" 
        />

        {isLoginOpen && (
          <LoginUserModal
            onClose={() => setIsLoginOpen(false)}
            onSuccess={handleLoginSuccess}
            onFail={(errMsg) => showMessage(errMsg)}
          />
        )}

        {isRegisterOpen && (
          <RegisterUserModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            onSuccess={handleRegistrationSuccess}
          />
        )}

        {message && <div className="dashboard-message bottom-left">{message}</div>}
      </div>
    </div>
  );
};

export default Home;
