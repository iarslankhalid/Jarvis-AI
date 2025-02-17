'use client';

import { useState, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [isClient, setIsClient] = useState(false); // New state to check client-side rendering
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Set client-side rendering flag once the component is mounted
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      setShowAssistant(true);
    } else {
      router.push('/login');
    }
  };

  const handleCloseAssistant = () => {
    setShowAssistant(false);
  };

  // Only render the page when on the client side
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-light">
      {/* Main Interface */}
      {!showAssistant && (
        <>
          {/* Welcome Section */}
          <header className="text-center py-16 w-full max-w-screen-lg">
            <h1 className="text-neonPink text-6xl font-extrabold glowing-text">
              Welcome to JARVIS AI
            </h1>
            <p className="text-gray-300 text-lg mt-4 max-w-xl mx-auto">
              Your productivity hub with seamless integrations and powerful AI assistance.
            </p>
          </header>

          {/* Features Section */}
          <section className="w-full bg-black py-16 px-6 md:pl-[220px]">
            <div className="max-w-screen-lg mx-auto text-center">
              <h2 className="text-neonBlue text-4xl font-bold glowing-text">
                Features You'll Love
              </h2>
              <p className="text-gray-200 text-lg mt-4 max-w-2xl mx-auto">
                Explore advanced AI tools and seamless integrations to supercharge your work.
              </p>

              {/* Get Started Button */}
              <button
                onClick={handleGetStarted}
                className="mt-8 px-10 py-4 bg-neonBlue text-black font-bold rounded-full shadow-neon 
                hover:shadow-neonPink hover:bg-neonPink transition-transform transform hover:scale-110"
              >
                Get Started
              </button>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center mt-10">
                <div className="p-6 mx-auto max-w-xs bg-black border-2 border-neonPink rounded-lg shadow-neon">
                  <h3 className="text-neonPink text-2xl font-bold">Seamless Integration</h3>
                  <p className="text-gray-300 mt-2">Connect all your tools effortlessly.</p>
                </div>
                <div className="p-6 mx-auto max-w-xs bg-black border-2 border-neonPink rounded-lg shadow-neon">
                  <h3 className="text-neonPink text-2xl font-bold">AI Assistance</h3>
                  <p className="text-gray-300 mt-2">Boost productivity with intelligent automation.</p>
                </div>
                <div className="p-6 mx-auto max-w-xs bg-black border-2 border-neonPink rounded-lg shadow-neon">
                  <h3 className="text-neonPink text-2xl font-bold">Advanced Analytics</h3>
                  <p className="text-gray-300 mt-2">Get real-time insights to make smarter decisions.</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Voice Assistant Interface */}
      {showAssistant && (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-light px-6">
          <h1 className="text-neonPink text-4xl font-bold glowing-text mb-6">
            JARVIS Voice Assistant
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Say <span className="text-neonBlue font-bold">"Hello Jarvis"</span> to wake the assistant, or type your message below.
          </p>

          {/* Typing Input */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Type your message here..."
              className="w-full px-4 py-2 text-black rounded-lg pr-12"
            />
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neonBlue hover:text-neonPink transition-colors"
              aria-label="Activate voice input"
            >
              <FaMicrophone size={20} />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleCloseAssistant}
            className="mt-6 px-8 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
