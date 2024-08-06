import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  isLoggedIn: boolean;
  redirectTo: string;
};
const ProtectedRoute = ({
  children,
  isLoggedIn,
  redirectTo,
}: ProtectedRouteProps) => {
  return isLoggedIn ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
