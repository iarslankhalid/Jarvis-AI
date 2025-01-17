"use client";

import { useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      date: "2024-12-15",
      time: "10:00 AM",
      location: "Conference Room",
      participants: "team@company.com",
    },
    {
      id: 2,
      title: "Project Deadline",
      date: "2024-12-20",
      time: "2:00 PM",
      location: "Online",
      participants: "project@company.com",
    },
  ]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    participants: "",
  });

  // Add new event to the list
  const handleAddEvent = () => {
    if (
      newEvent.title &&
      newEvent.date &&
      newEvent.time &&
      newEvent.location &&
      newEvent.participants
    ) {
      const newId = events.length ? events[events.length - 1].id + 1 : 1; // Generate a unique ID
      const participants = newEvent.participants
        .split(",")
        .map((email) => email.trim());
      const event = { ...newEvent, id: newId, participants: participants.join(", ") };
      setEvents((prev) => [...prev, event]); // Add the new event to the state
      setNewEvent({ title: "", date: "", time: "", location: "", participants: "" }); // Clear the form
    } else {
      alert("Please fill in all the fields."); // Validation message
    }
  };

  // Delete event by ID
  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <div className="flex">
      {/* Sidebar Space */}
      <div className="w-[240px] bg-gray-900 min-h-screen"></div>

      {/* Main Content */}
      <div className="flex flex-col bg-black min-h-screen text-light ml-0 w-[calc(100%-240px)] px-6">
        {/* Calendar Header */}
        <header className="text-center py-16 w-full max-w-screen-lg mx-auto">
          <h1 className="text-neonPink text-6xl font-extrabold glowing-text">
            Calendar Management
          </h1>
          <p className="text-gray-300 text-lg mt-4 max-w-xl mx-auto">
            View, manage, and schedule your meetings effortlessly.
          </p>
        </header>

        {/* Events List Section */}
        <section className="w-full bg-black py-16 px-6">
          <div className="max-w-screen-lg mx-auto">
            <h2 className="text-neonBlue text-4xl font-bold glowing-text text-center">
              Upcoming Events
            </h2>
            <p className="text-gray-200 text-lg mt-4 text-center max-w-2xl mx-auto">
              Stay on top of your schedule with a clear view of all your events.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center mt-10">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-6 mx-auto max-w-xs bg-black border-2 border-neonPink rounded-lg shadow-neon"
                >
                  <h3 className="text-neonPink text-2xl font-bold">{event.title}</h3>
                  <p className="text-gray-300 mt-2">📅 {event.date}</p>
                  <p className="text-gray-300 mt-2">⏰ {event.time}</p>
                  <p className="text-gray-300 mt-2">📍 {event.location}</p>
                  <p className="text-gray-300 mt-2">👥 {event.participants}</p>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete Event
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Add Event Section */}
        <section className="w-full py-12 mt-10 bg-black px-6">
          <div className="max-w-screen-lg mx-auto text-center">
            <h2 className="text-neonPurple text-3xl font-extrabold glowing-text">
              Add a New Event
            </h2>
            <p className="text-gray-300 text-lg mt-4">
              Plan and schedule your meetings or events with ease.
            </p>
            <div className="flex flex-col mt-6 gap-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="p-3 rounded bg-gray-800 text-gray-200"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="p-3 rounded bg-gray-800 text-gray-200"
              />
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="p-3 rounded bg-gray-800 text-gray-200"
              />
              <input
                type="text"
                placeholder="Location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="p-3 rounded bg-gray-800 text-gray-200"
              />
              <input
                type="text"
                placeholder="Participants (comma-separated emails)"
                value={newEvent.participants}
                onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                className="p-3 rounded bg-gray-800 text-gray-200"
              />
              <button
                onClick={handleAddEvent}
                className="px-8 py-3 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:shadow-neonPink hover:bg-neonPink transition-transform transform hover:scale-110"
              >
                Add Event
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
