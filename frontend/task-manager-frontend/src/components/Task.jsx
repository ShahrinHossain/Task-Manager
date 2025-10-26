import React, { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../config/config";
import ReactDOM from "react-dom";
import "./Task.css";
import { CiEdit } from "react-icons/ci";
import { PiTrashSimpleLight, PiFlagPennantFill } from "react-icons/pi";
import axios from "axios";
 
function Task({ taskId, taskDesc, taskStat, taskPrior, taskDate, onTaskDeleted, onTaskUpdated }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState(taskStat);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
 
  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(taskDesc);
  const [editPriority, setEditPriority] = useState(taskPrior);
  const [editStatus, setEditStatus] = useState(taskStat);
  const [editDate, setEditDate] = useState("");
  const [saving, setSaving] = useState(false);
 
  const statusToNumber = { due: 1, ongoing: 2, completed: 3 };
  const priorityOptions = ["high", "medium", "low"];
  const statusOptions = ["due", "ongoing", "completed"];
 
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
 
  const containerRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };  

  const isOverdue = (() => {
    if (!taskDate) return false;
  
    const task = new Date(formatDateForInput(taskDate));
    const today = new Date();
  
    task.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    return task < today;
  })();
  
 
  const handleDelete = async () => {
    if (editingTaskId === taskId) setEditingTaskId(null);
    setDeletingTaskId(prev => (prev === taskId ? null : taskId));
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/delete_task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onTaskDeleted();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail?.message || "Failed to delete task");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };
 
  const handleStatusChange = async newStatus => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Sending status update:", statusToNumber[newStatus]);

      await axios.patch(
        `${BASE_URL}/update_task_status/${taskId}`,
        { status: statusToNumber[newStatus] },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      onTaskUpdated();
      setStatus(newStatus);
      setDropdownOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };
 
  const handleSaveEdit = async () => {
    if (deletingTaskId === taskId) setDeletingTaskId(null);
    setEditingTaskId(prev => (prev === taskId ? null : taskId));
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
 
      const updatedTask = {
        description: editDesc,
        priority: priorityOptions.indexOf(editPriority) + 1,
        status: statusToNumber[editStatus],
        target_date: editDate || taskDate,
      };
 
      await axios.put(
        `${BASE_URL}/update_task/${taskId}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
 
      setStatus(editStatus);
      onTaskUpdated();
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };
 
  useEffect(() => {
    if (dropdownOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [dropdownOpen]);
 
  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);
 
  return (
    <div className={`TaskCard ${status} ${isOverdue ? "OverdueTask" : ""}`}>
      <div className="TaskDescriptionCard">
        <span className="TaskDescLeft">{taskDesc}</span>
        <span className="TaskDescDate">{taskDate || "No date"}</span>
      </div>

      
      <div ref={containerRef}
            className="TaskStatusCard StatusDropdownContainer"
            onClick={() => setDropdownOpen(prev => !prev)}>
            {updatingStatus ? "Updating..." : status}
      </div>
    
      {dropdownOpen &&
      ReactDOM.createPortal(
      <div className="StatusDropdown" style={{top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px`, position: "absolute"}}>
        {statusOptions.map(s => (
          <div key={s} className="StatusOption" onClick={e => {e.stopPropagation(); handleStatusChange(s);}}> 
            {s} 
          </div>
        ))}
        </div>,
        document.body
        )}
    
    <div className={`TaskPriority ${taskPrior}`}>
      <div className="TooltipContainer">
        <PiFlagPennantFill />
        <span className="TooltipText">Priority: {taskPrior}</span>
      </div>
    </div>
    
    <button className="EditButton" onClick={() => setEditing(prev => !prev)}>
      <div className="TooltipContainer">
        <CiEdit />  
        <span className="TooltipText">Edit</span>
      </div>
    </button>

    <button className="DeleteButton" onClick={() => setShowConfirm(prev => !prev)}>
      <div className="TooltipContainer">
        <PiTrashSimpleLight />
        <span className="TooltipText">Delete</span>
      </div>
    </button>
    
    {showConfirm && (
      <div className="DeleteConfirmPopup">
        <div>Are you sure you want to delete this task?</div>
        <div className="PopupButtons">
          <button className="ConfirmButton" onClick={handleDelete} disabled={deleting}>
                        {deleting ? "Deleting..." : "Yes"}
          </button>
          <button className="CancelButton" onClick={() => setShowConfirm(false)}>
                        No
          </button>
        </div>
      </div>
      )
    }
    
    {editing && (
      <div className="EditFormCard">
        <textarea className="EditDescription" value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}/>
      
        <div className="EditDropdownRow">
          <select className="EditDropdown" value={editPriority} onChange={e => setEditPriority(e.target.value)}>
          {priorityOptions.map(p => (
            <option key={p} value={p}> {p} </option>
            ))
          }
          </select>
        
          <select className="EditDropdown" value={editStatus} onChange={e => setEditStatus(e.target.value)} style={{ marginLeft: "0.5rem" }}>
          {statusOptions.map(s => (
            <option key={s} value={s}> {s} </option>
            ))
          }
          </select>

          <input className="EditDropdown"
              type="date"
              value={editDate || formatDateForInput(taskDate)}
              onChange={e => setEditDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} 
              style={{ marginLeft: "0.5rem" }} />
        </div>
      
        <div className="EditFormButtons">
          <button className="SaveEditButton" onClick={handleSaveEdit} disabled={saving}> {saving ? "Saving..." : "Save"} </button>
          <button className="CancelEditButton" onClick={() => setEditing(false)}> Cancel </button>
        </div>
      </div>)
    }
  </div>
  );
}
 
export default Task;