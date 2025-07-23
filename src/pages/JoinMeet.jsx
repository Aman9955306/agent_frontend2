import { useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { backend_url } from "../../constants";
import SimpleVoiceAssistant from "../components/SimpleVoiceAssistant";

const JoinMeet = () => {
  const [state, setState] = useState({
    roomName: "",
    participantName: "",
    token: null,
    url: "",
    isLoading: false,
    hasJoined: false,
    error: "",
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      {state.hasJoined && state.token && state.url && state.roomName ? (
        <LiveKitRoom
          serverUrl={state.url}
          token={state.token}
          roomName={state.roomName}
          connect={true}
          video={false}
          audio={true}
        >
          <RoomAudioRenderer />
          <SimpleVoiceAssistant />
        </LiveKitRoom>
      ) : (
        <>
          <h2 className="text-xl font-bold">Join a Meet Room</h2>

          <input
            className="border rounded px-4 py-2 w-full max-w-md"
            type="text"
            placeholder="Room Name"
            value={state.roomName}
            onChange={(e) => setState((prev) => ({ ...prev, roomName: e.target.value }))}
          />

          <input
            className="border rounded px-4 py-2 w-full max-w-md"
            type="text"
            placeholder="Participant Name"
            value={state.participantName}
            onChange={(e) => setState((prev) => ({ ...prev, participantName: e.target.value }))}
          />

          {state.error && <p className="text-red-500">{state.error}</p>}

          <button
            disabled={!state.roomName || !state.participantName || state.isLoading}
            onClick={async () => {
              setState((prev) => ({ ...prev, isLoading: true, error: "" }));
              try {
                const res = await fetch(`${backend_url}/generate-token`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    room_name: state.roomName,
                    participant_name: state.participantName,
                  }),
                });

                if (!res.ok) throw new Error("Failed to get token");

                const data = await res.json();
                setState((prev) => ({
                  ...prev,
                  token: data.token,
                  url: data.url,
                  hasJoined: true,
                  isLoading: false,
                }));
              } catch (err) {
                setState((prev) => ({
                  ...prev,
                  isLoading: false,
                  error: "Failed to join room. Please try again.",
                }));
              }
            }}
            className={`px-6 py-2 rounded text-white ${
              !state.roomName || !state.participantName || state.isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {state.isLoading ? "Joining..." : "Join Room"}
          </button>
        </>
      )}
    </div>
  );
};

export default JoinMeet;
