import { useState, useEffect } from "react";
import { backend_url } from "../../constants";

const ListConfigs = () => {
  const [orgFilter, setOrgFilter] = useState("");
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const url = orgFilter
        ? `${backend_url}/get-configs?org=${orgFilter}`
        : `${backend_url}/get-configs`;
      const res = await fetch(url);
      const data = await res.json();
      setConfigs(data);
    } catch (err) {
      setConfigs({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Filter by Org (optional)"
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 rounded" onClick={fetchConfigs}>Refresh</button>
      </div>

      {loading ? (
        <p>Loading configs...</p>
      ) : Object.keys(configs).length === 0 ? (
        <p>No configs found.</p>
      ) : (
        Object.entries(configs).map(([org, entries]) => (
          <div key={org} className="mb-4">
            <h3 className="font-bold text-lg">{org}</h3>
            <ul className="pl-4 list-disc">
              {entries.map((cfg, i) => (
                <li key={i}>
                  <strong>{cfg.config_key}:</strong> {cfg.system_prompt}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ListConfigs;
