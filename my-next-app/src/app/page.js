"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the router for navigation

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user authentication
  const router = useRouter(); // Router instance for navigation

  const handleGetStarted = () => {
    if (isLoggedIn) {
      // If the user is logged in, navigate to the Voice Assistant page
      router.push("/voice-assistant");
    } else {
      // If the user is not logged in, navigate to the Login page
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-light">
      {/* Main Interface */}
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
    </div>
  );
}
