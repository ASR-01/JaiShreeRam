import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/pages/Navbar";

const Home = lazy(() => import("./components/pages/Home"));
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const Register = lazy(() => import("./components/auth/Register"));
const Login = lazy(() => import("./components/auth/Login"));

const App = () => {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
