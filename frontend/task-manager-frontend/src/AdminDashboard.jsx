import React, { useState, useEffect } from "react";
import axios from "axios";
import RegisterAdminModal from "./components/RegisterAdminModal";
import "./AdminDashboard.css";
import dayjs from "dayjs";


const AdminDashboard = () => {
  const [openBoxes, setOpenBoxes] = useState([]);
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAdminRegistered = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Logout successful");

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Logout failed");
    }
  };

  const handleKickUser = async () => {
    if (!selectedUserId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/admin/kick/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("User removed successfully");
      setSelectedUserId(null);
      fetchStats();
    } catch (error) {
      console.error("Error kicking user:", error);
      if (error.response && error.response.status === 404) {
        setMessage("No user found");
      } else if (error.response && error.response.status === 401) {
        setMessage("Unauthorized action");
      } else {
        setMessage("Failed to kick user");
      }
    } finally {
      setDeleting(false);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const sections = [
    { id: 1, title: "Total Users", content: stats ? stats.all_users.length : "Loading..." },
    { id: 2, title: "Registered Users", content: stats ? stats.all_users : "Loading..." },
    { id: 3, title: "Active Today", content: stats ? stats.logged_in_today : "Loading..." },
    {
      id: 4,
      title: "Inactive Users (Last 30 Days)",
      content: stats ? stats.inactive_users : "Loading...",
      hasKickButton: true,
    },
    { id: 5, title: "Top 3 Scorers", content: stats ? stats.top_3_users : "Loading..." },
    { id: 6, title: "Tasks Completed Today", content: stats ? stats.total_tasks_done_today : "Loading..." },
  ];

  const toggleBox = (id) => {
    setOpenBoxes((prev) =>
      prev.includes(id) ? prev.filter((boxId) => boxId !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="AppName">DoneZone</div>
      <div className="dashboard-container">
        <div className="dashboard-title">Admin Dashboard</div>

        <div className="admin-buttons">
          <button onClick={() => setIsModalOpen(true)}>Register Admin</button>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="dashboard-boxes">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`dashboard-box ${openBoxes.includes(section.id) ? "open" : ""}`}
              onClick={() => toggleBox(section.id)}
            >
              <div className="box-header">{section.title}</div>
              {openBoxes.includes(section.id) && (
                <div className="box-content">
                  {Array.isArray(section.content) ? (
                    section.content.length > 0 ? (
                      section.content.map((item) => (
                        <div key={item.id} className="user-card">
                          <p><strong>Name:</strong> {item.name}</p>
                          <p><strong>Email:</strong> {item.email}</p>
                          <p><strong>Registered:</strong> {dayjs(item.created).format("MMMM D, YYYY h:mm A")}</p>
                          {item.bestscore !== undefined && (
                            <p><strong>Best Score:</strong> {item.bestscore}</p>
                          )}
                          {section.hasKickButton && (
                            <div className="kick-area">
                              {selectedUserId === item.id ? (
                                <div className="inline-confirm">
                                  <span>Are you sure you want to remove this user?</span>
                                  <button
                                    className="yes-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleKickUser();
                                    }}
                                    disabled={deleting}
                                  >
                                    {deleting ? "..." : "Yes"}
                                  </button>
                                  <button
                                    className="no-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedUserId(null);
                                    }}
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="kick-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUserId(item.id);
                                  }}
                                >
                                  Kick
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No data available</p>
                    )
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <RegisterAdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdminRegistered={() =>
            handleAdminRegistered("Admin registered successfully")
          }
        />
      )}

      {message && <div className="dashboard-message">{message}</div>}
    </div>
  );
};

export default AdminDashboard;
