import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  MessageSquare,
  Settings,
  Users,
  Clock,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function VideoConsult() {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: user?.name || 'You',
        message: newMessage.trim()
      }]);
      setNewMessage('');
    }
  };

  const initializeJitsiCall = () => {
    const roomName = `telemedcart-${appointmentId || 'demo'}`;
    const jitsiContainer = document.getElementById('jitsi-container');
    
    if (jitsiContainer) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainer,
        userInfo: {
          displayName: user?.name || 'User',
          email: user?.email || ''
        },
        configOverwrite: {
          startWithAudioMuted: !isAudioOn,
          startWithVideoMuted: !isVideoOn,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          DISABLE_PRESENCE_STATUS: true,
          MOBILE_APP_PROMO: false,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false
        }
      };

      // This would initialize Jitsi in a real application
      // const api = new window.JitsiMeetExternalAPI(domain, options);
      console.log('Jitsi would initialize with options:', options);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 relative">
          {/* Video Container */}
          <div className="w-full h-full bg-gray-800 relative" id="jitsi-container">
            {!isConnected ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">Connecting to consultation...</h3>
                  <p className="text-gray-300">Please wait while we establish your connection</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Video Consultation Active</h3>
                  <p className="text-gray-300">Duration: {formatDuration(callDuration)}</p>
                  <button 
                    onClick={initializeJitsiCall}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Initialize Jitsi Meet
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">
                    {user?.role === 'doctor' ? 'Patient Consultation' : 'Doctor Consultation'}
                  </span>
                </div>
                {isConnected && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(callDuration)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-4 rounded-full transition-colors ${
                  isAudioOn 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 rounded-full transition-colors ${
                  isVideoOn 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </button>

              <button className="p-4 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors">
                <Phone className="h-6 w-6" />
              </button>

              {user?.role === 'doctor' && (
                <button className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-300 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-sm text-gray-800">{msg.sender}</div>
                  <div className="text-gray-600 text-sm mt-1">{msg.message}</div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Modal for Demo */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <h4 className="font-semibold mb-2">Demo Video Consultation</h4>
        <p className="text-sm">
          This is a demo interface. In production, this would integrate with Jitsi Meet, WebRTC, or Twilio for real video calls.
        </p>
        <button 
          onClick={initializeJitsiCall}
          className="mt-2 text-xs bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors"
        >
          Try Jitsi Integration
        </button>
      </div>
    </div>
  );
}