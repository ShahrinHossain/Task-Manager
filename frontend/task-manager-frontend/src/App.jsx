import React, { useState } from 'react'
import './App.css'
import Task from './components/Task'

function App() {
  const [count, setCount] = useState(0)

  return(
  <div>
      <h1 className= 'appname'> Do It </h1>
      <div className= 'taskbar'>
        <Task taskId= '1' taskDesc= 'Learn Python' taskStatus= 'completed'/>
        <Task taskId= '2' taskDesc= 'Learn Java' taskStatus= 'due'/>
        <Task taskId= '3' taskDesc= 'Learn C++' taskStatus= 'ongoing'/>
        <Task taskId= '1' taskDesc= 'Learn Python' taskStatus= 'completed'/>
        <Task taskId= '2' taskDesc= 'Learn Java' taskStatus= 'due'/>
        <Task taskId= '3' taskDesc= 'Learn C++' taskStatus= 'ongoing'/>
        <Task taskId= '1' taskDesc= 'Learn Python' taskStatus= 'completed'/>
        <Task taskId= '2' taskDesc= 'Learn Java' taskStatus= 'due'/>
        <Task taskId= '3' taskDesc= 'Learn C++' taskStatus= 'ongoing'/>
        <Task taskId= '1' taskDesc= 'Learn Python' taskStatus= 'completed'/>
        <Task taskId= '2' taskDesc= 'Learn Java' taskStatus= 'due'/>
        <Task taskId= '3' taskDesc= 'Learn C++' taskStatus= 'ongoing'/>
      </div>
  </div>
  )
}

export default App;
