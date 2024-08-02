import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";


const Login = lazy(() => import("./components/auth/Login"));
const Profile = lazy(() => import("./components/pages/Profile"));
const ProtectedRoute = lazy(() => import("./components/pages/ProtectedRoute"));
const PageNotFound = lazy(() => import("./components/pages/PageNotFound"));
const Navbar = lazy(() => import("./components/pages/Navbar"));
const Register = lazy(() => import("./components/auth/Register"));
const VerifyAccount = lazy(() => import("./components/auth/VerifyAccount"));
const ChangePassword = lazy(() => import("./components/auth/ChangePassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/login" element={<ProtectedRoute element={<Login />} isProtected={false} />} />
          <Route path="/register" element={<ProtectedRoute element={<Register />} isProtected={false} />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<PageNotFound/>} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<Profile />} isProtected={true} />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
