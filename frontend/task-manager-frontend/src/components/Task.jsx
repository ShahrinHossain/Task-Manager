import React, { useState } from "react";
import "./Task.css";
import { CiEdit } from "react-icons/ci";
import { PiTrashSimpleLight, PiFlagPennantFill } from "react-icons/pi";
import axios from "axios";

function Task({ taskId, taskDesc, taskStat, taskPrior, onTaskDeleted, onTaskUpdated }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState(taskStat);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editDesc, setEditDesc] = useState(taskDesc);
  const [editPriority, setEditPriority] = useState(taskPrior);
  const [editStatus, setEditStatus] = useState(taskStat);
  const [saving, setSaving] = useState(false);

  const statusToNumber = { due: 1, ongoing: 2, completed: 3 };
  const priorityOptions = ["high", "medium", "low"];
  const statusOptions = ["due", "ongoing", "completed"];

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);


  const handleDelete = async () => {
    if (editingTaskId === taskId) setEditingTaskId(null);
  setDeletingTaskId(prev => prev === taskId ? null : taskId);
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/delete_task/${taskId}`, {
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

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:8000/update_task_status/${taskId}`,
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
    setEditingTaskId(prev => prev === taskId ? null : taskId);
    setSaving(true);
    try {
      const token = localStorage.getItem("token");

      const updatedTask = {
        description: editDesc,
        priority: priorityOptions.indexOf(editPriority) + 1,
        status: statusToNumber[editStatus],
      };

      await axios.put(
        `http://127.0.0.1:8000/update_task/${taskId}`,
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

  return (
    <div className={`TaskCard ${status}`}>
      <div className="TaskDescriptionCard">{taskDesc}</div>

      <div
        className="TaskStatusCard StatusDropdownContainer"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        {updatingStatus ? "Updating..." : status}
        {dropdownOpen && (
          <div className="StatusDropdown">
            {statusOptions.map((s) => (
              <div
                key={s}
                className="StatusOption"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(s);
                }}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`TaskPriority ${taskPrior}`}>
        <PiFlagPennantFill />
      </div>

      <button className="EditButton" onClick={() => setEditing((prev) => !prev)}>
        <CiEdit />
      </button>
    <button
        className="DeleteButton"
        onClick={() => setShowConfirm((prev) => !prev)} 
        >
        <PiTrashSimpleLight />
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
      )}

      {editing && (
        <div className="EditFormCard">
          <textarea
            className="EditDescription"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
          />

          <div className="EditDropdownRow">
            <select
              className="EditDropdown"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              {priorityOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              className="EditDropdown"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="EditFormButtons">
            <button className="SaveEditButton" onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="CancelEditButton" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
