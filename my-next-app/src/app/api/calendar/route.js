export async function GET() {
  const calendarApiUrl = `https://graph.microsoft.com/v1.0/me/events`;

  try {
    const response = await fetch(calendarApiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.CALENDAR_API_ID}`,
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify({ events: data.value }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching calendar events" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const { title, date, time, location, participants } = await req.json();
  const calendarApiUrl = `https://graph.microsoft.com/v1.0/me/events`;

  const event = {
    subject: title,
    start: {
      dateTime: `${date}T${time}`,
      timeZone: "UTC",
    },
    end: {
      dateTime: `${date}T${parseInt(time.split(":")[0]) + 1}:00`,
      timeZone: "UTC",
    },
    location: {
      displayName: location,
    },
    attendees: participants.map((email) => ({
      emailAddress: { address: email, name: "" },
      type: "required",
    })),
  };

  try {
    const response = await fetch(calendarApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CALENDAR_API_ID}`,
      },
      body: JSON.stringify(event),
    });

    const data = await response.json();
    return new Response(JSON.stringify({ message: "Event created", data }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating calendar event" }), {
      status: 500,
    });
  }
}
