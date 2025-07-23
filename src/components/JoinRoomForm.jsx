import { useState } from "react";
import { LiveKitRoom, RoomAudioRenderer,FocusLayout  } from "@livekit/components-react";
import "@livekit/components-styles";
import { backend_url } from "../../constants";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";


const JoinRoomForm = () => {
  const [roomName, setRoomName] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${backend_url}/generate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_name: roomName,
          participant_name: participantName,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate token");

      const data = await res.json();
      setToken(data.token);
      setUrl(data.url);
      setHasJoined(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join room.");
    } finally {
      setIsLoading(false);
    }
  };

  if (hasJoined && token && url && roomName) {
    return (
      <LiveKitRoom
        serverUrl={url}
        token={token}
        roomName={roomName}
        connect={true}
        video={false}
        audio={true}
      >
        <RoomAudioRenderer />
        <SimpleVoiceAssistant />
      </LiveKitRoom>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Join a Room</h2>

      <input
        className="border rounded px-4 py-2 w-full"
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />

      <input
        className="border rounded px-4 py-2 w-full"
        type="text"
        placeholder="Participant Name"
        value={participantName}
        onChange={(e) => setParticipantName(e.target.value)}
      />

      <button
        onClick={handleJoin}
        disabled={!roomName || !participantName || isLoading}
        className={`px-6 py-2 rounded text-white ${
          !roomName || !participantName || isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Joining..." : "Join Room"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default JoinRoomForm;
