import './App.css'
import {Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import Home from "./pages/Home";

function App() {

  return (
    <div className="app-body">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<Home />}/>
        <Route path="/Home" element={<Home />} />


      </Routes>
    </div>
  );
}

export default App
