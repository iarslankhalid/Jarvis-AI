// "use client";
// import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
// import { useState, useEffect, useRef } from "react";
// import { v4 as uuidv4 } from "uuid";

// export default function VoiceAssistantPage() {
//   const [messages, setMessages] = useState([]); // Chat messages
//   const [message, setMessage] = useState(""); // Input message
//   const sessionId = uuidv4(); // This will generate a valid 
//   const [isListening, setIsListening] = useState(false); // Microphone state
//   const [loading, setLoading] = useState(false); // Loading indicator
//   const recognitionRef = useRef(null); // Ref to hold the recognition instance

//   // Initialize the session and speech recognition
//   useEffect(() => {
//     // Set a unique session ID
//     // setSessionId(uuidv4());

//     // Check if speech recognition is supported
//     if ("webkitSpeechRecognition" in window) {
//       const SpeechRecognition = window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();
//       recognition.continuous = false;
//       recognition.interimResults = false;
//       recognition.lang = "en-US";

//       // Define event handlers
//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setMessage(transcript); // Update input field
//         handleSend(transcript); // Send the message automatically
//       };

//       recognition.onerror = (error) => {
//         console.error("Speech recognition error:", error);
//         setIsListening(false);
//       };

//       recognition.onend = () => {
//         setIsListening(false); // Stop listening when recognition ends
//       };

//       recognitionRef.current = recognition; // Save instance in ref
//     } else {
//       alert("Speech recognition is not supported in your browser.");
//     }
//   }, []);

//   const handleSend = async (inputMessage) => {
//     const text = (inputMessage || message || "").trim();
//     if (!text) return;
  
//     // Add user message to the chat
//     setMessages((prev) => [...prev, { sender: "user", text }]);
//     setLoading(true); // Show loading state
  
//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/assistant/query", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ session_id: sessionId, prompt: text }),
//       });
  
//       if (!response.ok) {
//         // Log the response to understand the 422 error better
//         const errorData = await response.json();
//         console.error("API error:", errorData);
//         throw new Error(`HTTP error: ${response.status}`);
//       }
  
//       const data = await response.json();
//       const botMessage =
//         typeof data.response === "string"
//           ? data.response
//           : JSON.stringify(data.response); // Handle object response
  
//       // Add bot response to the chat
//       setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
//     } catch (error) {
//       console.error("Failed to get response from API:", error);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Error: Unable to fetch response from API" },
//       ]);
//     } finally {
//       setLoading(false); // Hide loading state
//       setMessage(""); // Clear input
//     }
//   };
  

//   const toggleMicrophone = () => {
//     const recognition = recognitionRef.current; // Get the recognition instance
//     if (!recognition) return;

//     if (isListening) {
//       recognition.stop(); // Stop speech recognition
//     } else {
//       recognition.start(); // Start speech recognition
//     }

//     setIsListening(!isListening); // Toggle microphone state
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSend(); // Send message on Enter key press
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-black h-screen text-light">
//     <section className="flex justify-center w-[800] h-screen bg-black m-5">
      
//       <div className="w-[900px] px-8 py-4 bg-gray-900 rounded-lg shadow-lg flex flex-col">
//           <h2 className="text-center text-neonPink text-4xl font-extrabold glowing-text mb-4">
//             JARVIS Chat
//           </h2>
//           <div className="space-y-4 overflow-y-auto flex-grow p-4 rounded bg-gray-800">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`${
//                     msg.sender === "user"
//                       ? "bg-neonBlue text-black"
//                       : "bg-gradient-to-r from-neonPink to-neonPurple text-white"
//                   } px-6 py-3 rounded-lg max-w-lg shadow-md`}
//                 >
//                   {msg.text}
//                 </div>
//               </div>
//             ))}
//             {loading && (
//               <div className="text-center text-gray-500">Loading...</div>
//             )}
//           </div>

//           {/* Input Section */}
//           <div className="relative w-full mt-4">
//             <div className="flex items-center bg-gray-700 rounded-lg shadow-lg p-4">
//               <input
//                 type="text"
//                 placeholder="Type your message here..."
//                 className="flex-1 px-4 py-2 text-white bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-neonPink"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 onKeyDown={handleKeyPress}
//               />
//               <button
//                 onClick={toggleMicrophone}
//                 className={`flex items-center justify-center w-12 h-12 ${
//                   isListening ? "text-red-500" : "text-neonBlue"
//                 } hover:text-neonPink transition-colors`}
//                 aria-label="Activate voice input"
//               >
//                 <FaMicrophone size={24} />
//               </button>
//               <button
//                 onClick={() => handleSend()}
//                 className="flex items-center justify-center w-12 h-12 text-neonBlue hover:text-neonPink transition-colors"
//                 aria-label="Send message"
//               >
//                 <FaPaperPlane size={24} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }



"use client";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function VoiceAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(true);
  const sessionId = uuidv4();
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeRecognition();
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Initialize Speech Recognition
  const initializeRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Heard:", transcript);

      if (!isListening) {
        if (transcript.includes("hey jarvis")) {
          setIsListening(true);
          setMessages((prev) => [...prev, { sender: "user", text: "Hey Jarvis" }]);
          speakText("Hello! How can I assist you?");
        }
        return;
      }

      handleSend(transcript);
    };

    recognition.onerror = (error) => console.error("Speech recognition error:", error);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Send message to AI and get response
  const handleSend = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/assistant/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, prompt: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = typeof data.response === "string" ? data.response : JSON.stringify(data.response);

      setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
      speakText(botMessage);
    } catch (error) {
      console.error("Failed to get response from API:", error);
      const errorMessage = "I am having trouble connecting to the server.";
      setMessages((prev) => [...prev, { sender: "bot", text: errorMessage }]);
      speakText(errorMessage);
    }
  };

  // Speak text using browser's built-in speech synthesis
  const speakText = (text) => {
    if (!synthesisRef.current) {
      console.error("Speech synthesis not supported");
      return;
    }

    // Stop any ongoing speech
    synthesisRef.current.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-US";

    // Find a suitable voice
    const voices = synthesisRef.current.getVoices();
    utterance.voice = voices.find(voice => voice.lang === "en-US") || null;

    // Pause recognition while speaking
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Speak the text
    synthesisRef.current.speak(utterance);

    // Handle speech events
    utterance.onend = () => {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    };
  };

  return (
    <div className="flex flex-col bg-black min-h-screen text-light ml-[20%]">
      <section className="flex justify-center w-[800px] h-screen bg-black m-5">
        <div className="w-[900px] px-8 py-4 bg-gray-900 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-center text-neonPink text-4xl font-extrabold glowing-text mb-4">
            JARVIS AI (Voice-Activated)
          </h2>
          <div className="space-y-4 overflow-y-auto flex-grow p-4 rounded bg-gray-800">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
>
                <div
                  className={`${
                    msg.sender === "user"
                      ? "bg-neonBlue text-black"
                      : "bg-gradient-to-r from-neonPink to-neonPurple text-white"
                  } px-6 py-3 rounded-lg max-w-lg shadow-md`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}