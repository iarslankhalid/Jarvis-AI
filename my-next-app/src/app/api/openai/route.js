export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Error with OpenAI API");
    }

    return new Response(JSON.stringify({ response: data.choices[0].text.trim() }), { status: 200 });
  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
