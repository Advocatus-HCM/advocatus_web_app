import './App.css'
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from './pages/login/Login.jsx';
import NotFoundPage from "./pages/NotFound";
import EmployeeManagement from './pages/EmployeeManagement.jsx';
import AccountSettings from './pages/AccountSettings.jsx';
import Home from "./pages/home/Home.jsx";
import Cases from './pages/Cases.jsx';
import ChangePassword from './pages/ChangePassword';
import Attendance from './pages/Attendance.jsx';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee-management" element={<EmployeeManagement />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
