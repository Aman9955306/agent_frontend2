import { useState } from "react";
import { backend_url } from "../../constants";

const CreateConfigForm = () => {
  const [orgKey, setOrgKey] = useState("");
  const [configKey, setConfigKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("Creating...");

    try {
      const res = await fetch(`${backend_url}/create-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_key: orgKey, config_key: configKey, system_prompt: systemPrompt }),
      });

      const data = await res.json();
      setMessage(res.ok ? data.message : data.detail || "Failed");
    } catch (err) {
      setMessage("Error creating config");
    }
  };

  return (
    <form onSubmit={handleCreate} className="space-y-4 p-4 border rounded max-w-md mx-auto bg-white shadow">
      <h2 className="text-xl font-semibold">Create Config</h2>

      <input className="w-full border p-2 rounded" placeholder="Org Key" value={orgKey} onChange={e => setOrgKey(e.target.value)} required />
      <input className="w-full border p-2 rounded" placeholder="Config Key" value={configKey} onChange={e => setConfigKey(e.target.value)} required />
      <textarea className="w-full border p-2 rounded" placeholder="System Prompt" value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} required />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create Config</button>
      {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
    </form>
  );
};

export default CreateConfigForm;
