"use client";

import { useState } from "react";

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("");

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const audioContent = reader.result.split(",")[1]; // Base64 content
      const res = await fetch("/api/speech-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioContent }),
      });
      const data = await res.json();
      setTranscript(data.transcript);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-pink-500 mb-5">Speech-to-Text</h1>
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        className="mb-4"
      />
      {transcript && (
        <div className="mt-5 p-4 bg-gray-800 rounded-md">
          <h2 className="text-xl font-semibold">Transcript:</h2>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
