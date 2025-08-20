import { useState } from "react";
import CreateConfigForm from "./CreateConfigForm";
import UpdateConfigForm from "./UpdateConfigForm";
import ListConfigs from "./ListConfigs";
import Custom_joiner from "./Custom_joiner";
import JoinRoomForm from "./JoinRoomForm";

const TABS = {
  join_room_name: "Join Room",
  create: "Create Agent",
  update: "Update Agent",
  list: "List Agents",
  join: "Join Saved Agents",
};

const Home = () => {
  const [activeTab, setActiveTab] = useState("join_room_name");

  const renderContent = () => {
    switch (activeTab) {
      case "create":
        return <CreateConfigForm />;
      case "update":
        return <UpdateConfigForm />;
      case "list":
        return <ListConfigs />;
      case "join":
        return <Custom_joiner />;
      case "join_room_name":
        return <JoinRoomForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Agent Management</h1>
      </header>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {Object.entries(TABS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded border transition-colors duration-150 ${
              activeTab === key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
