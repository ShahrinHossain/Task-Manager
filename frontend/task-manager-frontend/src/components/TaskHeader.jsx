import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { IoAdd } from "react-icons/io5";
import { TfiFilter } from "react-icons/tfi";
import { MdOutlineSort } from "react-icons/md";
import './TaskHeader.css';
import axios from "axios";

const TaskHeader = ({ onTaskAdded }) => {
  const [showInput, setShowInput] = useState(false);
  const [taskDesc, setTaskDesc] = useState("");
  const [priority, setPriority] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [showSort, setShowSort] = useState(false);
  const [sortField, setSortField] = useState(""); 
  const [sortOrder, setSortOrder] = useState("asc");

  const handleAddTask = async () => {
    if (!taskDesc) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const data = {
        description: taskDesc,
        priority: Number(priority),
        status: 1, 
      };

      const res = await axios.post("http://127.0.0.1:8000/add_task", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.message === "Task addition successful") {
        onTaskAdded(); 
        setTaskDesc("");
        setShowInput(false);
      } else {
        alert(res.data.message || "Error adding task");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterClick = () => {
    if (showInput) setShowInput(false);
    if (showSort) setShowSort(false);
    setShowFilter(prev => !prev);
  };

  const handleSortClick = () => {
    if (showInput) setShowInput(false);
    if (showFilter) setShowFilter(false);
    setShowSort(prev => !prev);
  };

  const applyFilter = () => {
    onTaskAdded({ priority: filterPriority, status: filterStatus, sortBy: sortField, order: sortOrder });
    setShowFilter(false);
  };

  const applySort = () => {
    onTaskAdded({ priority: filterPriority, status: filterStatus, sortBy: sortField, order: sortOrder });
    setShowSort(false);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> 
          <p>Add Task</p>
          <Button className='NewTaskButton' onClick={() => { setShowInput(prev => !prev); if (showFilter) setShowFilter(false); if (showSort) setShowSort(false); }}>
            <IoAdd />
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}> 
          <p>Filter</p>
          <Button className='FilterSortButton' onClick={handleFilterClick}>
            <TfiFilter />
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}> 
          <p>Sort</p>
          <Button className='FilterSortButton' onClick={handleSortClick}>
            <MdOutlineSort />
          </Button>
        </div>
      </div>

      {showInput && (
        <div className="inline-add-task">
          <input
            type="text"
            placeholder="Enter task description..."
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
          <button onClick={handleAddTask} disabled={submitting}>
            {submitting ? "Adding..." : "Add"}
          </button>
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

          <button onClick={applyFilter}>Filter</button>
        </div>
      )}

      {showSort && (
        <div className="inline-filter-task">
          <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="">Default</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
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
