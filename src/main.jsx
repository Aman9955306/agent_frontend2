import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './components/Home.jsx';
import LiveKitModal from './components/LiveKitModal.jsx';
import JoinMeet from './pages/JoinMeet.jsx';
import RoomTabs from './pages/RoomTabs.jsx';
import AgentRoomLinkJoiner from './pages/AgentRoomLinkJoiner.jsx';
// import Home from './pages/Home.jsx';
// import About from './pages/About.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      }
    ],
  },
  {
    path: "/v1",
    element: <LiveKitModal />,
  },
  {
    path: "/meet",
    element: <JoinMeet />,
  },
  {
    path: "/meetjoiner",
    element: <RoomTabs />,
  },
  {
    path: "/meet-link-join",
    element: <AgentRoomLinkJoiner />,
  },
  
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
