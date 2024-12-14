import './App.css'
import {Routes, Route} from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {

  return (
    <div className="app-body">
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/employees" element={<Home />} />
        <Route path="/employees/new" element={<Home />} /> */}
      </Routes>
    </div>
  );
}

export default App
