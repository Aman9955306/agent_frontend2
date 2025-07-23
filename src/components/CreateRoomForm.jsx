import { useEffect, useState } from "react";
import { backend_url } from "../../constants";

const CreateRoomForm = () => {
  const [orgConfigs, setOrgConfigs] = useState({});
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedConfig, setSelectedConfig] = useState("");
  const [createdRoomName, setCreatedRoomName] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch(`${backend_url}/get-configs`);
        const data = await res.json();
        setOrgConfigs(data);
      } catch (err) {
        console.error("Error fetching configs", err);
      }
    };
    fetchConfigs();
  }, []);

  const handleCreate = async () => {
    if (!selectedOrg || !selectedConfig) {
      setError("Please select both Org and Config.");
      return;
    }

    try {
      const res = await fetch(`${backend_url}/create-config-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_key: selectedOrg,
          config_key: selectedConfig,
          participant_name: "agent",
        }),
      });

      if (!res.ok) throw new Error("Failed to create room");

      const data = await res.json();
      const room = data.room_name;

      setCreatedRoomName(room);

      // 👇 Set meet link based on frontend routing
      const meetUrl = `${window.location.origin}/meet-link-join?room_name=${room}`;
      setMeetLink(meetUrl);

      setError("");
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Room creation failed.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Create a Room</h2>

      <select
        className="border rounded px-4 py-2 w-full"
        value={selectedOrg}
        onChange={(e) => {
          setSelectedOrg(e.target.value);
          setSelectedConfig("");
        }}
      >
        <option value="">Select Org</option>
        {Object.keys(orgConfigs).map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </select>

      <select
        className="border rounded px-4 py-2 w-full"
        value={selectedConfig}
        onChange={(e) => setSelectedConfig(e.target.value)}
        disabled={!selectedOrg}
      >
        <option value="">Select Config</option>
        {selectedOrg &&
          orgConfigs[selectedOrg]?.map((config) => (
            <option key={config.config_key} value={config.config_key}>
              {config.config_key}
            </option>
          ))}
      </select>

      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!selectedOrg || !selectedConfig}
      >
        Create Room
      </button>

      {createdRoomName && (
        <p className="text-green-600">
          ✅ Room: <strong>{createdRoomName}</strong>
        </p>
      )}

      {meetLink && (
        <p className="text-blue-600">
          🔗 Meet Link:{" "}
          <a
            href={meetLink}
            className="underline text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {meetLink}
          </a>
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default CreateRoomForm;
