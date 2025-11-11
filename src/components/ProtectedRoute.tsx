import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  // ✅ If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If logged in, allow access
  return children;
}
