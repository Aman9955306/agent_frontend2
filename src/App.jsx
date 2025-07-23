import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import Custom_joiner from "./components/Custom_joiner";
import { Outlet } from "react-router-dom";




function App() {
  const [showSupport, setShowSupport] = useState(false);

  const handleSupportClick = () => {
    setShowSupport(true)
  }
  return (
    <div className=" bg-gray-100  font-bebas h-full">
      {/* <Home /> */}
      {/* <Custom_joiner /> */}
      <Outlet />
    </div>
  );
}

export default App;
