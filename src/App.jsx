import './App.css'
import {Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFound";
import EmployeeManagement from './pages/EmployeeManagement.jsx';
import AccountSettings from './pages/AccountSettings.jsx';

import Home from "./pages/home/Home.jsx";

function App() {

  return (
    <div className="app-body">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Home" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee-management" element={<EmployeeManagement/>} />
        <Route path="/account-settings" element={<AccountSettings/>} />
      </Routes>
    </div>
  );
}

export default App
