import React from "react";
import "../../public/task.css";
import { CiEdit } from "react-icons/ci";
import { PiTrashSimpleLight } from "react-icons/pi";
import { PiFlagPennantFill } from "react-icons/pi";

function Task(props){
    const {taskId, taskDesc, taskStat, taskPrior} = props;
    return(
        <div className= {`TaskCard ${taskStat}`}> 
            {/* Task ID should not be visible */}
            {/* <p>{taskId}</p> */}
            <div className= "TaskDescriptionCard">
                {taskDesc}
            </div>
            <div className= "TaskStatusCard">
                {taskStat}
            </div>
            <button className= "EditButton">
                <CiEdit />
            </button>
            <icon className= {`TaskPriority ${taskPrior}`}>
                <PiFlagPennantFill />
            </icon>
            <button className= "DeleteButton">
                <PiTrashSimpleLight/>
            </button>
        </div>

    )
}

export default Task;