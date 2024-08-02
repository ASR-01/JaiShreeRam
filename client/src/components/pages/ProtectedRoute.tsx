

import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import React from "react";

interface RouteProps {
  element: React.ReactNode; // Define the type for the element prop
  isProtected?: boolean; 
}

const ProtectedRoute: React.FC<RouteProps> = ({ element, isProtected = false }) => {
  const isAuth = !!Cookies.get("is_Auth");

  if (isProtected) {
    // For protected routes, redirect if authenticated
    return isAuth ? <>{element}</> : <Navigate to="/" replace />;
  } else {
    // For non-protected routes, redirect to desired page if authenticated
    return isAuth ? <Navigate to="/" replace /> : <>{element}</>;
  }
};

export default ProtectedRoute;


