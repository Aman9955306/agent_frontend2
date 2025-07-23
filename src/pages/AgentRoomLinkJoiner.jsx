import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { backend_url } from "../../constants";
import SimpleVoiceAssistant from "../components/SimpleVoiceAssistant";
import SimpleVoiceAssistant2 from "../components/SimpleVoiceAssistant2";

const AgentRoomLinkJoiner = () => {
  const [searchParams] = useSearchParams();
  const roomName = searchParams.get("room_name");

  const [participantName, setParticipantName] = useState("");
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = async () => {
    if (!participantName || !roomName) {
      setError("Room name missing or participant name empty.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${backend_url}/generate-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_name: roomName, participant_name: participantName }),
      });

      if (!response.ok) throw new Error("Token generation failed");

      const data = await response.json();
      setToken(data.token);
      setUrl(data.url);
      setHasJoined(true);
    } catch (err) {
      console.error(err);
      setError("Failed to join the room.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!roomName) {
    return <p className="text-red-600">❌ No room_name found in URL.</p>;
  }

  if (hasJoined && token && url) {
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
        {/* <SimpleVoiceAssistant2 /> */}
      </LiveKitRoom>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-bold text-center">Join Room: <span className="text-blue-700">{roomName}</span></h2>

      <input
        className="w-full border px-4 py-2 rounded"
        type="text"
        placeholder="Enter your name"
        value={participantName}
        onChange={(e) => setParticipantName(e.target.value)}
      />

      <button
        onClick={handleJoin}
        disabled={!participantName || isLoading}
        className={`w-full px-4 py-2 rounded text-white ${
          !participantName || isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Joining..." : "Join Room"}
      </button>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
    </div>
  );
};

export default AgentRoomLinkJoiner;
