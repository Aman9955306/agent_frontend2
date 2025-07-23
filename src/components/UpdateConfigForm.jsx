import { useEffect, useState } from "react";
import { backend_url } from "../../constants";

const UpdateConfigForm = () => {
  const [allConfigs, setAllConfigs] = useState({});
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedConfig, setSelectedConfig] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all configs on mount
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await fetch(`${backend_url}/get-configs`);
        const data = await res.json();
        setAllConfigs(data);
      } catch (err) {
        console.error("Failed to fetch configs:", err);
      }
    };
    fetchConfigs();
  }, []);

  // Update prompt field when org & config are selected
  useEffect(() => {
    if (selectedOrg && selectedConfig) {
      const configList = allConfigs[selectedOrg] || [];
      const config = configList.find((c) => c.config_key === selectedConfig);
      setNewPrompt(config?.system_prompt || "");
    }
  }, [selectedOrg, selectedConfig, allConfigs]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("Updating...");

    try {
      const res = await fetch(`${backend_url}/update-config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_key: selectedOrg,
          config_key: selectedConfig,
          new_system_prompt: newPrompt,
        }),
      });

      const data = await res.json();
      setMessage(res.ok ? data.message : data.detail || "Failed");
    } catch (err) {
      setMessage("Error updating config");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4 p-4 border rounded max-w-xl mx-auto bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Update Existing Config</h2>

      <select
        value={selectedOrg}
        onChange={(e) => {
          setSelectedOrg(e.target.value);
          setSelectedConfig("");
          setNewPrompt("");
        }}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select Org</option>
        {Object.keys(allConfigs).map((org) => (
          <option key={org} value={org}>{org}</option>
        ))}
      </select>

      {selectedOrg && (
        <select
          value={selectedConfig}
          onChange={(e) => setSelectedConfig(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Config</option>
          {allConfigs[selectedOrg]?.map((cfg, idx) => (
            <option key={idx} value={cfg.config_key}>{cfg.config_key}</option>
          ))}
        </select>
      )}

      {selectedConfig && (
        <textarea
          className="w-full border p-2 rounded min-h-[120px]"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          required
        />
      )}

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
        disabled={!selectedOrg || !selectedConfig}
      >
        Update Config
      </button>

      {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
    </form>
  );
};

export default UpdateConfigForm;
