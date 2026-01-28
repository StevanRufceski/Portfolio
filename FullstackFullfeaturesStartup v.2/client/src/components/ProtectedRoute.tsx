import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles = [] }: ProtectedRouteProps) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    // Wait for bootstrap (refresh + get current user)
    return <div>Loading...</div>;
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/" />; // redirect to home
  }

  return children;
}
