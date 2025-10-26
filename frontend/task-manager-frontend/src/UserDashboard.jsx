import React, { useState, useEffect } from "react";
import { BASE_URL } from "./config/config";
import axios from "axios";
import Task from "./components/Task";
import TaskHeader from "./components/TaskHeader";
import Side from "./components/Side";
import "./UserDashboard.css";
import { FaUserCircle } from "react-icons/fa";

function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [originalTasks, setOriginalTasks] = useState([]); 
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); 
  const [userInfo, setUserInfo] = useState({ email: "", username: "" });

  const statusMap = { 1: "due", 2: "ongoing", 3: "completed" };
  const priorityMap = { 1: "high", 2: "medium", 3: "low" };

  useEffect(() => {
    fetchTasks();
    fetchUserInfo();
  }, []);


  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInfo({
        username: response.data.username,
        email: response.data.email,
      });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setUserInfo({ username: "Unknown", email: "Unknown" });
    }
  };

  const fetchTasks = async (options = {}) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You are not logged in");
        return;
      }
  
      const response = await axios.get(`${BASE_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      let data = response.data;
      
      if (options.searchTerm) { 
              data = data.filter(t => 
              t.description.toLowerCase().includes(options.searchTerm.toLowerCase())
          );
              }
      if (!originalTasks.length) setOriginalTasks(data);
  
      const statusOrder = { ongoing: 1, due: 2, completed: 3 };
      data.sort((a, b) => {
        const statusA = statusOrder[statusMap[a.status]] || 4;
        const statusB = statusOrder[statusMap[b.status]] || 4;
        return statusA - statusB;
      });
  
      if (options.priority) data = data.filter(t => t.priority === Number(options.priority));
      if (options.status) data = data.filter(t => t.status === Number(options.status));
      if (options.date) data = data.filter(t => t.target_date === options.date);
  
      if (options.sortBy) {
        data.sort((a, b) => {
          if (options.sortBy === "priority") return (a.priority - b.priority) * (options.order === "asc" ? 1 : -1);
          if (options.sortBy === "status") return (a.status - b.status) * (options.order === "asc" ? 1 : -1);
          if (options.sortBy === "target_date") {

          const dateA = a.target_date || '9999-12-31';
          const dateB = b.target_date || '9999-12-31';
            
          let comparison = 0;
          if (dateA > dateB) {
            comparison = 1;
            } else if (dateA < dateB) {
            comparison = -1;
            }
            return comparison * (options.order === "asc" ? 1 : -1);
          }
          return 0;
        });
      }
  
      if (options.toggleSort && !options.sortBy) data = [...originalTasks];
  
      setTasks(data);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "Server error or network issue");
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "No date";
    const d = new Date(isoDate);
    return `${d.getDate().toString().padStart(2,'0')}/${
             (d.getMonth()+1).toString().padStart(2,'0')}/${
             d.getFullYear()}`;
  };
  

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });

      setMessage("Logout successful");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Logout failed");
    }
  };

  return (
    <div className="Container-app">
      <div className="TopBar">
        <div className="AppName">DoneZone</div>
          <div className="UserMenu">
            <div className="TooltipContainer">
              <FaUserCircle
                size={32}
                className="UserIcon"
                onClick={() => {
                  window.location.href = "/user-profile"; 
                }}
              />
              <span className="TooltipText">Profile</span>
            </div>
            <button className="LogoutInlineBtn" onClick={handleLogout}>
              Logout
            </button>
          </div>
      </div>

      <div className="TaskHeading">
        <TaskHeader onTaskAdded={fetchTasks} tasks={tasks} />
      </div>

      <div className="TaskBar">
        {tasks.length > 0 ? (
          tasks.map((item) => (
            <Task
              key={item.id}
              taskId={item.id}              
              taskDesc={item.description}
              taskStat={statusMap[item.status] || "unknown"}
              taskPrior={priorityMap[item.priority] || "unknown"}
              taskDate={formatDate(item.target_date)} 
              onTaskDeleted={fetchTasks}  
              onTaskUpdated={fetchTasks}       
            />
          ))
        ) : (
          <div className="dashboard-message">{message || "No tasks!"}</div>
        )}
      </div>


      <div className="SideBar">
        <Side />
      </div>

      {message && <div className="dashboard-message">{message}</div>}
    </div>
  );
}

export default UserDashboard;
