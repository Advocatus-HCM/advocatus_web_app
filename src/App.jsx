import './App.css'
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login/Login.jsx";
import NotFoundPage from "./pages/NotFound";
import EmployeeManagement from './pages/EmployeeManagement.jsx';
import AccountSettings from './pages/AccountSettings.jsx';
import Home from "./pages/home/Home.jsx";
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
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
