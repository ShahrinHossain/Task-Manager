import React, { useState, useMemo } from 'react';
import { BASE_URL } from "../config/config";
import Button from 'react-bootstrap/Button';
import { IoAdd } from "react-icons/io5";
import { TfiFilter } from "react-icons/tfi";
import { MdOutlineSort } from "react-icons/md";
import { LiaUndoSolid } from "react-icons/lia";
import { IoSearch } from "react-icons/io5";
import './TaskHeader.css';

const TaskHeader = ({ onTaskAdded, tasks = [] }) => {
  const taskCount = tasks.length;
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showInput, setShowInput] = useState(false);
  const [taskDesc, setTaskDesc] = useState("");
  const [priority, setPriority] = useState(1);
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState(""); 
  const [sortOrder, setSortOrder] = useState("asc");

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const defaultDate = `${yyyy}-${mm}-${dd}`;

  const taskDates = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const dates = tasks
      .map(t => t.target_date)
      .filter(Boolean)
      .sort();
    return [...new Set(dates)];
  }, [tasks]);

  const clearFiltersAndSort = () => {
    setFilterPriority("");
    setFilterStatus("");
    setFilterDate("");
    setSortField("");
    setSortOrder("asc");
    setSearchTerm("");
    onTaskAdded({ priority: "", status: "", date: "", sortBy: "", order: "asc", searchTerm: ""});
  };

  const handleAddTaskClick = () => setShowInput(prev => !prev);

  const handleFilterClick = () => {
    setShowFilter(prev => !prev);
    setShowSort(false);
    setShowInput(false);
    setShowSearch(false);
  };

  const handleSortClick = () => {
    setShowSort(prev => !prev);
    setShowFilter(false);
    setShowInput(false);
  };

  const handleSearchClick = () => {
    setShowSearch(prev => !prev);
    setShowSort(false);
    setShowFilter(false);
    setShowInput(false);
   };

  const applyFilter = () => {
    onTaskAdded({
      priority: filterPriority,
      status: filterStatus,
      date: filterDate,
      sortBy: sortField,
      order: sortOrder,
    });
    setShowFilter(false);
  };

  const applySort = () => {
    onTaskAdded({
      priority: filterPriority,
      status: filterStatus,
      date: filterDate,
      sortBy: sortField,
      order: sortOrder,
    });
    setShowSort(false);
  };

  const applySearch = () => {
    onTaskAdded({
    priority: filterPriority,
    status: filterStatus,
    date: filterDate,
    sortBy: sortField,
    order: sortOrder,
    searchTerm: searchTerm, 
    });
    setShowSearch(false);
    };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p>Add Task</p>
          <Button className='NewTaskButton' onClick={handleAddTaskClick}><IoAdd /></Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p>Filter</p>
          <Button className='FilterSortButton' onClick={handleFilterClick}><TfiFilter /></Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p>Sort</p>
          <Button className='FilterSortButton' onClick={handleSortClick}><MdOutlineSort /></Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p>Clear</p>
          <Button className='FilterSortButton' onClick={clearFiltersAndSort}><LiaUndoSolid /></Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <p>Search</p>
          <Button className='FilterSortButton' onClick={handleSearchClick}><IoSearch /></Button>
        </div>

        <div style={{ display: 'flex', marginRight:'10px', marginLeft: 'auto' , color:'#0970a0'  ,fontFamily:"Cambria, Cochin, Georgia, Times, 'Times New Roman', serif"}}>
          <p>Total Tasks: {taskCount}</p> 
        </div>

      </div>



      {showInput && (
        <div className="inline-add-task">
          <input type="text" placeholder="Enter task description..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
          <input type="date" value={targetDate} min={defaultDate} onChange={(e) => setTargetDate(e.target.value)} />
        </div>
      )}

      {showSearch && (
        <div className="inline-add-task"> 
            <input 
            type="text" 
            placeholder="Enter task name to search..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <button onClick={applySearch}>Search</button>
      </div>
      )}  

      {showFilter && (
        <div className="inline-filter-task">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">Priority (All)</option>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Status (All)</option>
            <option value={1}>Due</option>
            <option value={2}>Ongoing</option>
            <option value={3}>Completed</option>
          </select>

          <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
            <option value="">Date (All)</option>
            {taskDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString()}
              </option>
            ))}
          </select>

          <button onClick={applyFilter}>Filter</button>
        </div>
      )}

      {showSort && (
        <div className="inline-filter-task">
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="">Default</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="target_date">Date</option>
          </select>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          <button onClick={applySort}>Sort</button>
        </div>
      )}
    </div>
  );
};

export default TaskHeader;
