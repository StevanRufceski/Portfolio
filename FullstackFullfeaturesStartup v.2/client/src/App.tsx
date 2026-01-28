import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Team from "./pages/Team";
import TeamProfile from "./pages/TeamProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RequestReset from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Role pages
import Admin from "./pages/Admin";
import Manager from "./pages/Manager";
import Officer from "./pages/Officer";
import Customer from "./pages/Customer";

// NEW
import UserForm from "./components/UserForm";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/profile/public/:id" element={<TeamProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Password */}
          <Route path="/request-reset" element={<RequestReset />} />
          <Route path="/reset/:token" element={<ResetPassword />} />

          {/* Email */}
          <Route path="/verify/:token" element={<VerifyEmail />} />

          {/* User profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            }
          />

          {/* User details */}
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            }
          />

          {/* Role dashboards */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["Administrator"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={["Manager"]}>
                <Manager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer"
            element={
              <ProtectedRoute roles={["Officer"]}>
                <Officer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer"
            element={
              <ProtectedRoute roles={["Customer"]}>
                <Customer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
