import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css"; 

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail?.message || "Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://127.0.0.1:8000/edit_user",
        { name: form.name, email: form.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert(res.data.message || "User updated successfully");
      setUser({ ...user, name: form.name, email: form.email });
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail?.message || "Failed to update user info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="UserProfile">Loading user info...</div>;
  if (error) return <div className="UserProfile Error">{error}</div>;
  if (!user) return null;

  return (
    <div>
    <div className="AppName">DoneZone</div>
    <div className="UserProfile">
    <div className="UserProfileTitle">User Profile</div>

      {!editing ? (
        <div className="UserDetails">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Best Score:</strong> {user.bestscore}</p>
          <p><strong>Created:</strong> {new Date(user.created).toLocaleString()}</p>
          <button onClick={() => setEditing(true)} className="EditProfileButton">
            Edit
          </button>
        </div>
      ) : (
        <div className="EditForm">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <div className="Buttons">
            <button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default UserProfile;
