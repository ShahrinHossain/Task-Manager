import React from 'react';
import "../../public/taskheader.css";
import Button from 'react-bootstrap/Button';
import { IoAdd } from "react-icons/io5";
import { TfiFilter } from "react-icons/tfi";
import { MdOutlineSort } from "react-icons/md";


function TaskHeader(){
    return(
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center',  gap: '10px' }}> 
                <p>Add Task</p>
                <Button className= 'NewTaskButton'>
                    <IoAdd />
                </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> 
                <p>Filter</p>
                <Button className= 'FilterSortButton'>
                    <TfiFilter />
                </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> 
                <p>Sort</p>
                <Button className= 'FilterSortButton'>
                    <MdOutlineSort />
                </Button>
            </div>
        </div>
    )
}

export default TaskHeader;