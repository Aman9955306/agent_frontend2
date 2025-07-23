import { useState, useEffect, useRef } from "react";
import { LiveKitRoom, RoomAudioRenderer, RoomName, useTracks, VideoTrack } from "@livekit/components-react";
import "@livekit/components-styles";
import SimpleVoiceAssistant from "./SimpleVoiceAssistant";
import { backend_url } from "../../constants";
import { Track } from "livekit-client";
import SimpleVoiceAssistant2 from "./SimpleVoiceAssistant2";

const LiveKitModal = () => {
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      const fetchToken = async () => {
        try {
          setIsLoading(true);
          // const response = await fetch("https://4b589df45795.ngrok-free.app/create-room", {
          const response = await fetch(`${backend_url}/create-room`, {
            // const response = await fetch("http://127.0.0.1:85/create-room", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ participant_name: "you"}),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch token");
          }

          const { token, room_name, url } = await response.json();
          setRoomName(room_name);
          setUrl(url);
          setToken(token);
        } catch (error) {
          console.error("Error getting token:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchToken();
    }
  }, []);

  // useEffect(()=>{
  //   setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEllZGdRTWJrR3c3ZFIiLCJzdWIiOiJhbWFuIiwiYXVkIjoibGl2ZWtpdCIsImV4cCI6MTc1MzE2OTIwOCwibmJmIjoxNzUzMTY1NjA4LCJ2aWRlbyI6eyJyb29tIjoicm9vbS1aYmNDR1lGbTVOWSIsInJvb21Kb2luIjp0cnVlLCJyb29tTGlzdCI6dHJ1ZSwicm9vbVJlY29yZCI6dHJ1ZSwicm9vbUFkbWluIjp0cnVlLCJyb29tQ3JlYXRlIjp0cnVlLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5VcGRhdGVPd25NZXRhZGF0YSI6dHJ1ZSwiaW5ncmVzc0FkbWluIjp0cnVlLCJoaWRkZW4iOmZhbHNlLCJyZWNvcmRlciI6ZmFsc2V9fQ.797USTD6pTxPE1MGFRcj1HKz1MgEfxDE11Atp43tgpg")
  //   setUrl("wss://aman1-l15ejexw.livekit.cloud")
  //   setRoomName("room-ZbcCGYFm5NY")

  // })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-10">
      <div className="bg-white rounded-lg shadow-lg w-full">
        <div className="h-full w-full">
          {token && roomName && url ? (
            <LiveKitRoom
              serverUrl={url}
              token={token}
              roomName={roomName}
              connect={true}
              video={false}
              audio={true}
            >
              <RoomAudioRenderer />
              <div>
              <RoomName />
              </div>
              {/* <SimpleVoiceAssistant /> */}
              <SimpleVoiceAssistant2 />
            </LiveKitRoom>
          ) : (
            <div>Loading support room...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveKitModal;
