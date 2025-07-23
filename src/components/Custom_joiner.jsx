import { useState, useEffect } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";
import { backend_url } from "../../constants";

const Custom_joiner = ({ setShowSupport }) => {
  const [configs, setConfigs] = useState({});
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedConfig, setSelectedConfig] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all available configs
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch(`${backend_url}/get-configs`);
        const data = await res.json();
        setConfigs(data);
      } catch (err) {
        console.error("Failed to fetch configs:", err);
      }
    };
    fetchConfigs();
  }, []);

  // When config is selected, load system_prompt
  useEffect(() => {
    if (selectedOrg && selectedConfig) {
      const configList = configs[selectedOrg] || [];
      const found = configList.find(c => c.config_key === selectedConfig);
      setSystemPrompt(found?.system_prompt || "");
    }
  }, [selectedOrg, selectedConfig, configs]);

  const handleJoin = async () => {
    if (!selectedOrg || !selectedConfig) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${backend_url}/create-room-custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_name: "you",
          org_key: selectedOrg,
          config_key: selectedConfig
        }),
      });

      if (!res.ok) throw new Error("Failed to get room token");

      const { token, room_name, url } = await res.json();
      setToken(token);
      setRoomName(room_name);
      setUrl(url);
    } catch (err) {
      console.error("Join error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" inset-0  flex justify-center items-center z-50 p-10">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-auto space-y-6">
        {!token ? (
          <div className="space-y-4">
            <div className="flex justify-between p-4">
            <h2 className="text-xl font-semibold">Join a Suport Room</h2>
            {/* <button >Close</button> */}
            </div>

            <select
              className="w-full border p-2 rounded"
              value={selectedOrg}
              onChange={(e) => {
                setSelectedOrg(e.target.value);
                setSelectedConfig("");
              }}
            >
              <option value="">Select Org</option>
              {Object.keys(configs).map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>

            {selectedOrg && (
              <select
                className="w-full border p-2 rounded"
                value={selectedConfig}
                onChange={(e) => setSelectedConfig(e.target.value)}
              >
                <option value="">Select Config</option>
                {configs[selectedOrg]?.map((cfg, idx) => (
                  <option key={idx} value={cfg.config_key}>
                    {cfg.config_key}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={handleJoin}
              disabled={!selectedOrg || !selectedConfig || isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {isLoading ? "Joining..." : "Join Room"}
            </button>
          </div>
        ) : (
          <div className=" block">
            <div className="flex justify end"><button onClick={() => setToken(null)}>Close</button></div>
            <LiveKitRoom
              serverUrl={url}
              token={token}
              roomName={roomName}
              connect={true}
              video={false}
              audio={true}
              onDisconnected={() => setShowSupport(false)}
            >
              <RoomAudioRenderer />
              <SimpleVoiceAssistant />
            </LiveKitRoom>
          </div>
        )}
      </div>
    </div>
  );
};

export default Custom_joiner;
