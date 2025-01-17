"use client"; // Ensures the component is treated as a Client Component
import { useState } from "react";

export default function EmailPage() {
  const [emails, setEmails] = useState([
    { id: 1, subject: "Meeting Reminder", sender: "manager@example.com" },
    { id: 2, subject: "Weekly Newsletter", sender: "newsletter@example.com" },
    { id: 3, subject: "Invoice Due", sender: "billing@example.com" },
  ]);

  const [newEmail, setNewEmail] = useState({ subject: "", sender: "" });

  const handleAddEmail = () => {
    if (newEmail.subject && newEmail.sender) {
      const newId = emails.length ? emails[emails.length - 1].id + 1 : 1;
      setEmails((prevEmails) => [
        ...prevEmails,
        { id: newId, ...newEmail },
      ]);
      setNewEmail({ subject: "", sender: "" });
    } else {
      alert("Please fill in both the subject and sender.");
    }
  };

  const handleDeleteEmail = (id) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
  };

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-light">
      {/* Email Header */}
      <header className="text-center py-16 w-full max-w-screen-lg md:pl-[220px]">
        <h1 className="text-neonPink text-6xl font-extrabold glowing-text">
          Email Management
        </h1>
        <p className="text-gray-300 text-lg mt-4 max-w-xl mx-auto">
          Manage your emails effectively with AI-powered tools.
        </p>
      </header>

      {/* Emails Section */}
      <section className="w-full bg-black py-16 px-6 md:pl-[220px]">
        <div className="max-w-screen-lg mx-auto">
          <h2 className="text-neonBlue text-4xl font-bold glowing-text text-center">
            Your Emails
          </h2>
          <ul className="mt-8 space-y-4">
            {emails.map((email) => (
              <li
                key={email.id}
                className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
              >
                <div>
                  <h3 className="text-neonPink font-bold">{email.subject}</h3>
                  <p className="text-gray-300">{email.sender}</p>
                </div>
                <button
                  onClick={() => handleDeleteEmail(email.id)}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Add Email Section */}
      <section className="w-full py-12 bg-black px-6 md:pl-[220px]">
        <div className="max-w-screen-lg mx-auto text-center">
          <h2 className="text-neonPurple text-3xl font-extrabold glowing-text">
            Add a New Email
          </h2>
          <div className="flex flex-col mt-6 gap-4">
            <input
              type="text"
              placeholder="Email Subject"
              value={newEmail.subject}
              onChange={(e) =>
                setNewEmail({ ...newEmail, subject: e.target.value })
              }
              className="p-3 rounded bg-gray-800 text-gray-200"
            />
            <input
              type="email"
              placeholder="Sender Email"
              value={newEmail.sender}
              onChange={(e) =>
                setNewEmail({ ...newEmail, sender: e.target.value })
              }
              className="p-3 rounded bg-gray-800 text-gray-200"
            />
            <button
              onClick={handleAddEmail}
              className="px-8 py-3 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:shadow-neonPink hover:bg-neonPink transition-transform transform hover:scale-110"
            >
              Add Email
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
