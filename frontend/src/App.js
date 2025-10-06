// src/App.js
import React, { useState } from "react";
import api from "./api"; // your Axios instance

function App() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
      console.log("Tasks:", response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Task Management</h1>
      <button
        onClick={fetchTasks}
        style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}
      >
        Get Tasks
      </button>

      {/* Display tasks */}
      <ul style={{ marginTop: "20px", listStyleType: "none" }}>
        {tasks.map((task) => (
          <li key={task.task_id}>
            <strong>{task.name}</strong> - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
