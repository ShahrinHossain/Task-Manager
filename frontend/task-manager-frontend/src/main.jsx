import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import UserDashboard from './UserDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import UserProfile from './UserProfile.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>   
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/user-profile" element={<UserProfile />} />
    </Routes>
  </BrowserRouter>
);

