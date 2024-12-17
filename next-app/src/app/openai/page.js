"use client";

import { useState } from "react";

export default function OpenAIPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-pink-500 mb-5">Ask OpenAI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your query here..."
          className="w-full p-3 bg-gray-800 rounded-md text-white"
        />
        <button className="bg-pink-500 px-4 py-2 rounded-md hover:bg-pink-700">
          Submit
        </button>
      </form>
      {response && (
        <div className="mt-5 p-4 bg-gray-800 rounded-md">
          <h2 className="text-xl font-semibold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
