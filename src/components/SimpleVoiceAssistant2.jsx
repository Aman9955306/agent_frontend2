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
  ChatEntry,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MessageSquare, 
  Phone, 
  MoreVertical,
  X,
  Users,
  Info
} from "lucide-react";

const Message = ({ type, text }) => {
  return (
    <div className="mb-3 p-2 rounded-lg bg-gray-50">
      <div className="flex items-center mb-1">
        <div className={`w-2 h-2 rounded-full mr-2 ${type === "agent" ? "bg-blue-500" : "bg-green-500"}`}></div>
        <strong className={`text-sm ${type === "agent" ? "text-blue-600" : "text-green-600"}`}>
          {type === "agent" ? "AI Assistant" : "You"}
        </strong>
        <span className="text-xs text-gray-400 ml-2">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <span className="text-gray-800 text-sm leading-relaxed">{text}</span>
    </div>
  );
};

const SimpleVoiceAssistant2 = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const tracks = useTracks([Track.Source.Camera]);
  
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">AI Voice Assistant Meeting</h1>
              <p className="text-sm text-gray-500">Meeting ID: 123-456-789</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">2</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Info className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Video Area */}
        <div className={`flex-1 bg-gray-900 flex items-center justify-center transition-all duration-300 ${isChatOpen ? 'mr-80' : ''}`}>
          <div className="w-full h-full max-w-4xl mx-auto p-8">
            {/* Participant Video */}
            <div className="w-full h-3/4 mb-6 relative overflow-hidden">
              <CarouselLayout tracks={tracks}>
                <ParticipantTile />
              </CarouselLayout>
              
              {/* Voice Visualizer */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-16">
                <BarVisualizer 
                  state={state} 
                  barCount={7} 
                  trackRef={audioTrack}
                  className="h-full"
                />
              </div>
            </div>

            {/* Voice Assistant Controls */}
            <div className="flex justify-center">
              <VoiceAssistantControlBar />
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className={`fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">In-call messages</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages - Using LiveKit Chat Component */}
            <div className="flex-1 overflow-y-auto">
              <Chat>
                <ChatEntry />
              </Chat>
              
              {/* Custom transcription messages */}
              <div className="p-4 space-y-2">
                {messages.map((msg, index) => (
                  <Message key={msg.id || index} type={msg.type} text={msg.text} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Meeting Info */}
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">AI Assistant Session</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            {/* Mic Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-colors ${
                isMicOn 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 rounded-full transition-colors ${
                isCameraOn 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isScreenSharing ? 'Stop presenting' : 'Present now'}
            >
              <Monitor className="w-5 h-5" />
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-3 rounded-full transition-colors relative ${
                isChatOpen 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Toggle chat"
            >
              <MessageSquare className="w-5 h-5" />
              {messages.length > 0 && !isChatOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </button>

            {/* End Call */}
            <button
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full ml-4"
              title="Leave call"
            >
              <Phone className="w-5 h-5 transform rotate-[135deg]" />
            </button>
          </div>

          {/* Time/Status */}
          <div className="text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVoiceAssistant2;