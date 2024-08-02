// src/components/AuthRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

interface AuthRouteProps {
  isAuthenticated: boolean; // Prop to check if the user is authenticated
}

const AuthRoute = ({ isAuthenticated }: AuthRouteProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;
