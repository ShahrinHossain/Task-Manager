// import React, { useState } from 'react'
// // import {v4 as uuidv4} from "uuid"
// import './App.css'
// import Task from './components/Task'
// import Data from './data.json'
// import TaskHeader from './components/TaskHeader'
// import Side from './components/Side'

// function App() {
//   const [count, setCount] = useState(0)

//   let items =[];
//   // for(let x=0; x<Data.length; x++)
//   // {
//   //   items.push(<Task taskId= {Data[x].task_id} taskDesc= {Data[x].description} taskStatus= 'completed'/>)
//   // }
//   items = Data.map((item, index) => 
//     <Task key={index} 
//       taskId= {item.task_id} 
//       taskDesc={item.description}
//       taskStat={item.status}
//       taskPrior={item.priority}
//     />)

//   return(
//   <div className= 'Container-app'>
//       <div className= 'AppName'> DoneZone </div>
//       <div className= 'TaskHeading'>
//         <TaskHeader />
//       </div>
//       <div className= 'TaskBar'>
//         {items}
//       </div>
//       <div className= 'SideBar'>
//         <Side />
//       </div>
//   </div>
//   )
// }

// export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Task from "./components/Task";
import TaskHeader from "./components/TaskHeader";
import Side from "./components/Side";

function App() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  // Mapping numbers to strings
  const statusMap = {
    1: "due",
    2: "ongoing",
    3: "completed",
  };

  const priorityMap = {
    1: "high",
    2: "medium",
    3: "low",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("❌ You are not logged in");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(response.data);
      } catch (error) {
        console.error(error);
        if (error.response) {
          setMessage(`❌ ${error.response.data.detail || "Failed to fetch tasks"}`);
        } else {
          setMessage("❌ Server error or network issue");
        }
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="Container-app">
      <div className="AppName">DoneZone</div>
      <div className="TaskHeading">
        <TaskHeader />
      </div>
      <div className="TaskBar">
        {tasks.length > 0 ? (
          tasks.map((item, index) => (
            <Task
              key={index}
              taskId={item.task_id}
              taskDesc={item.description}
              taskStat={statusMap[item.status] || "unknown"}
              taskPrior={priorityMap[item.priority] || "unknown"}
            />
          ))
        ) : (
          <p>{message || "No tasks available"}</p>
        )}
      </div>
      <div className="SideBar">
        <Side />
      </div>
    </div>
  );
}

export default App;
