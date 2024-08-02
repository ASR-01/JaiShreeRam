// import { Navigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import React from "react";

// interface RouteProps {
//   element: React.ReactNode; 
//   isProtected?: boolean; 
// }

// const ProtectedRoute: React.FC<RouteProps> = ({ element, isProtected = false }) => {
//   const isAuth = !!Cookies.get("is_Auth");

//   if (isProtected) {
//     return isAuth ? <>{element}</> : <Navigate to="/login" replace />;
//   } else {
//     // For non-protected routes, redirect authenticated users to a different page
//     return isAuth ? <Navigate to="/" replace /> : <>{element}</>;
//   }
// };

// export default ProtectedRoute;
