import React, { useState } from 'react'
// import {v4 as uuidv4} from "uuid"
import './App.css'
import Task from './components/Task'
import Data from './data.json'
import TaskHeader from './components/TaskHeader'
import Side from './components/Side'

function App() {
  const [count, setCount] = useState(0)

  let items =[];
  // for(let x=0; x<Data.length; x++)
  // {
  //   items.push(<Task taskId= {Data[x].task_id} taskDesc= {Data[x].description} taskStatus= 'completed'/>)
  // }
  items = Data.map((item, index) => 
    <Task key={index} 
      taskId= {item.task_id} 
      taskDesc={item.description}
      taskStat={item.status}
      taskPrior={item.priority}
    />)

  return(
  <div className="SiteContainer">
      <h1 className= 'AppName'> DoneZone </h1>
      <div className= 'TaskHeading'>
        <TaskHeader />
      </div>
      <div className= 'TaskBar'>
        {items}
      </div>
      <div className= 'SideBar'>
        <Side />
      </div>
  </div>
  )
}

export default App;
