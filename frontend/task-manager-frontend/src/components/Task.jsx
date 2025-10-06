import React from "react";
import "../../public/style.css";

function Task(props){
    const {taskId, taskDesc, taskStatus} = props;
    return(
        <div className="TaskCard"> 
            <p>{taskId}</p>
            <p>{taskDesc}</p>
            <p>{taskStatus}</p>
        </div>
    )
}

export default Task;