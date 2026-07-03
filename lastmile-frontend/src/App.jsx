// LastMile Delivery Tracker
// Developed by: Anshika Chaurasia
// Email: anshikachaurasia99@gmail.com
// © 2026 All Rights Reserved

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";

function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={
          <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/customer" element={
          <PrivateRoute role="customer"><CustomerDashboard /></PrivateRoute>
        } />
        <Route path="/agent" element={
          <PrivateRoute role="agent"><AgentDashboard /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
