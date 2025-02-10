import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // If no token or role, redirect to login
  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not in the allowed roles, redirect to home (or a "Not Authorized" page)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
