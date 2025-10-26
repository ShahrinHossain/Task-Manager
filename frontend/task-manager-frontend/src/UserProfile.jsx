import React, { useEffect, useState } from "react";
import { BASE_URL } from "./config/config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    old_pass: "",
    new_pass: "",
    confirm_pass: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/user`, {
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

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000); 
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BASE_URL}/edit_user`,
        { name: form.name, email: form.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showMessage(res.data.message || "User updated successfully");
      setUser({ ...user, name: form.name, email: form.email });
      setEditing(false);
    } catch (err) {
      console.error(err);

      if (err.response?.status == 403) {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "Email already in use or action forbidden.";
          showMessage(msg);
      }
      else if (err.response?.status == 422) {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "Invalid input data.";
          showMessage(msg);
      }
      else {
        const msg =
          err.response?.data?.detail?.message ||
          err.response?.data?.message ||
          "An unexpected server error occurred.";
        navigate("/error", { state: { message: msg, code: 500 } });
        return;
      } 

      
    } finally {
      
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setSaving(true);
    setPasswordError("");

    if (passwordForm.new_pass !== passwordForm.confirm_pass) {
      setPasswordError("New passwords do not match");
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BASE_URL}/auth/edit_password`,
        {
          old_pass: passwordForm.old_pass,
          new_pass: passwordForm.new_pass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      showMessage(res.data.message || "Password changed successfully");
      setPasswordForm({ old_pass: "", new_pass: "", confirm_pass: "" });
      setChangingPassword(false);
    } catch (err) {
      console.error(err);
      setPasswordError(err.response?.data?.detail?.message || "Failed to change password");
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

        {!editing && !changingPassword ? (
          <div className="UserDetails">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Best Score:</strong> {user.bestscore}</p>
            <p><strong>Created:</strong> {new Date(user.created).toLocaleString()}</p>

            <div className="Buttons">
              <button onClick={() => setEditing(true)} className="EditProfileButton">
                Edit Profile
              </button>
              <button onClick={() => setChangingPassword(true)} className="EditProfileButton">
                Change Password
              </button>
            </div>
          </div>
        ) : editing ? (
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
        ) : (
          <div className="EditForm">
            <label>
              Old Password:
              <input
                type="password"
                name="old_pass"
                value={passwordForm.old_pass}
                onChange={handlePasswordChange}
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                name="new_pass"
                value={passwordForm.new_pass}
                onChange={handlePasswordChange}
              />
            </label>
            <label>
              Confirm Password:
              <input
                type="password"
                name="confirm_pass"
                value={passwordForm.confirm_pass}
                onChange={handlePasswordChange}
              />
            </label>
            {passwordError && <div className="Error">{passwordError}</div>}
            <div className="Buttons">
              <button onClick={handlePasswordSave} disabled={saving}>
                {saving ? "Saving..." : "Change Password"}
              </button>
              <button onClick={() => setChangingPassword(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {message && <div className="dashboard-message">{message}</div>}
    </div>
  );
}

export default UserProfile;
