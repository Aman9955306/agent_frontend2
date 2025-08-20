import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Custom_joiner from "./components/Custom_joiner";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";




function App() {
  const [showSupport, setShowSupport] = useState(false);

  const handleSupportClick = () => {
    setShowSupport(true)
  }
  return (
    <div className=" bg-gray-100  font-bebas h-full">
      {/* <Home /> */}
      <Navbar />
      {/* <Custom_joiner /> */}
      <div className="relative">

      <Outlet />
      </div>
    </div>
  );
}

export default App;
