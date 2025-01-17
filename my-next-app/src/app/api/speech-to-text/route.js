import { SpeechClient } from "@google-cloud/speech";

export async function POST(req) {
  try {
    // Parse the incoming JSON request
    const { audioContent } = await req.json();

    if (!audioContent) {
      return new Response(
        JSON.stringify({ error: "Missing audioContent in the request" }),
        { status: 400 }
      );
    }

    // Initialize the Google Speech-to-Text client
    const client = new SpeechClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Ensure the environment variable is set correctly
    });

    // Set up the audio and config for the API request
    const audio = { content: audioContent }; // Base64-encoded audio content
    const config = {
      encoding: "LINEAR16", // Adjust encoding based on your audio format
      sampleRateHertz: 16000, // Ensure this matches your audio file
      languageCode: "en-US", // Change to your preferred language
    };

    const request = { audio, config };

    // Call the Google Speech-to-Text API
    const [response] = await client.recognize(request);
    const transcript = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    // Return the transcription
    return new Response(JSON.stringify({ transcript }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Google Speech-to-Text API Error:", error);

    // Return an error response with details
    return new Response(
      JSON.stringify({ error: "Failed to process the audio." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
