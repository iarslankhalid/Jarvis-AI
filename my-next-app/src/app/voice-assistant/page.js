"use client"; // Ensure the component is treated as client-side
import { FaMicrophone, FaPaperPlane } from "react-icons/fa"; // Import necessary icons
import { useState } from "react";

export default function VoiceAssistantPage() {
  const [messages, setMessages] = useState([]); // State to hold the messages
  const [message, setMessage] = useState(""); // State to hold the input value

  const handleSend = () => {
    if (message.trim()) {
      // Add user message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: message },
      ]);

      // Simulate a chatbot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: `Jarvis says: \"I received your message: ${message}\"` },
        ]);
      }, 1000);

      setMessage(""); // Clear the input field
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend(); // Send message on Enter key press
    }
  };

  return (
    <div className="flex flex-col items-center bg-black h-screen text-light">
      {/* Chat Section */}
      <section className="w-max bg-black flex-grow px-6 flex flex-col justify-between">
        <div className="w-[900px] mx-auto px-8 py-4 bg-gray-900 rounded-lg shadow-lg flex flex-col h-full">
          <h2 className="text-center text-neonPink text-4xl font-extrabold glowing-text mb-4">
            JARVIS Chat
          </h2>
          <div className="space-y-4 overflow-y-auto flex-grow p-4 rounded bg-gray-800">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
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

          {/* Input Section */}
          <div className="relative w-full mt-4">
            <div className="flex items-center bg-gray-700 rounded-lg shadow-lg p-4">
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 px-4 py-2 text-white bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-neonPink"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress} // Handle Enter key
              />
              {/* Microphone Icon */}
              <button
                className="flex items-center justify-center w-12 h-12 text-neonBlue hover:text-neonPink transition-colors"
                aria-label="Activate voice input"
              >
                <FaMicrophone size={24} />
              </button>
              {/* Send Icon */}
              <button
                onClick={handleSend}
                className="flex items-center justify-center w-12 h-12 text-neonBlue hover:text-neonPink transition-colors"
                aria-label="Send message"
              >
                <FaPaperPlane size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
