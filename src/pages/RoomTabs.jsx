import { useState } from "react";
import CreateRoomForm from "../components/CreateRoomForm";
import JoinRoomForm from "../components/JoinRoomForm";

const RoomTabs = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Tab Switcher */}
      {/* <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded ${
            activeTab === "create" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Create Room
        </button>
        <button
          onClick={() => setActiveTab("join")}
          className={`px-4 py-2 rounded ${
            activeTab === "join" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Join Room
        </button>
      </div> */}

      {/* Tab Content */}
      {/* {activeTab === "create" ? <CreateRoomForm /> : <JoinRoomForm />} */}
      <JoinRoomForm />
    </div>
  );
};

export default RoomTabs;
