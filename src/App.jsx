import './App.css'
import {Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login/Login.jsx";


import Home from "./pages/home/Home.jsx";


function App() {

  return (
    <div className="app-body">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<Home />}/>
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </div>
  );
}

export default App
