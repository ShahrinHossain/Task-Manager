import React from 'react';
import "../../public/task.css";
import Button from 'react-bootstrap/Button';
import { IoAdd } from "react-icons/io5";
import { TfiFilter } from "react-icons/tfi";
import { MdOutlineSort } from "react-icons/md";


function TaskHeader(){
    return(
        <div style={{ display: 'flex', alignItems: 'center', gap: '10%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> 
                <p style={{fontSize: '18px'}}>Add New Task</p>
                <Button className= 'NewTaskButton'>
                    <IoAdd />
                </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> 
                <p style={{fontSize: '18px'}}>Filter</p>
                <Button className= 'FilterButton'>
                    <TfiFilter />
                </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> 
                <p style={{fontSize: '18px'}}>Sort By</p>
                <Button className= 'FilterButton'>
                    <MdOutlineSort />
                </Button>
            </div>
        </div>
    )
}

export default TaskHeader;