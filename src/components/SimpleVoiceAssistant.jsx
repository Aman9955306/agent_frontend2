import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
  useTracks,
  CarouselLayout,
  ParticipantTile,
  Chat,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
// import "./SimpleVoiceAssistant.css";
import { ChatEntry } from "@livekit/components-react";



const Message = ({ type, text }) => {
  return (
    <div className="mb-2">
      <strong className={type === "agent" ? "text-blue-500" : "text-green-500"}>
        {type === "agent" ? "Agent: " : "You: "}
      </strong>
      <span className="text-gray-800 ml-1">{text}</span>
    </div>
  );
};

const SimpleVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const tracks = useTracks([Track.Source.Camera]);

  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-5 h-full">
      <div className="w-full  h-20 mx-auto">
        <BarVisualizer state={state} barCount={7} trackRef={audioTrack} />
        <CarouselLayout tracks={tracks}>
          <ParticipantTile />
        </CarouselLayout>;
      </div>
      <div className="w-full max-w-2xl mt-5">
        <VoiceAssistantControlBar />
        <Chat>
          <ChatEntry />
        </Chat>
        
        {/* <div className="p-5 max-h-72 overflow-y-scroll w-full h-full border border-gray-200 rounded-lg mt-5 bg-white">
          {messages.map((msg, index) => (
            <Message key={msg.id || index} type={msg.type} text={msg.text} />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default SimpleVoiceAssistant;
