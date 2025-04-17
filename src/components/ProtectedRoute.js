import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import useUserRole from '../hooks/useUserRole';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = auth.currentUser;
  const { role, loading } = useUserRole();

  if (!user) return <Navigate to="/" />;

  if (loading) return <div>Loading...</div>;

  console.log("User role:", role);
  console.log("Allowed roles:", allowedRoles);

  if (!allowedRoles.includes(role)) {
    return <div>Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;
