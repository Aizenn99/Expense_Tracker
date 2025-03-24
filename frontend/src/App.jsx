import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";

// Authentication check function
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return token && user;
};

// Protected Route: Only accessible if logged in
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

// Restricted Route: Only accessible if NOT logged in
const RestrictedRoute = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Redirect to dashboard if authenticated, otherwise to login */}
          <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />

          {/* Public Routes (Restricted) */}
          <Route path="/login" element={<RestrictedRoute element={<Login />} />} />
          <Route path="/signUp" element={<RestrictedRoute element={<SignUp />} />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/income" element={<ProtectedRoute element={<Income />} />} />
          <Route path="/expense" element={<ProtectedRoute element={<Expense />} />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
          duration: 3000,
        }}
      />
    </UserProvider>
  );
}

export default App;
