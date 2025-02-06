// "use client"; // Ensures the component is treated as a Client Component
// import { useState } from "react";

// export default function EmailPage() {
//   const [emails, setEmails] = useState([
//     { id: 1, subject: "Meeting Reminder", sender: "manager@example.com" },
//     { id: 2, subject: "Weekly Newsletter", sender: "newsletter@example.com" },
//     { id: 3, subject: "Invoice Due", sender: "billing@example.com" },
//   ]);

//   const [newEmail, setNewEmail] = useState({ subject: "", sender: "" });

//   const handleAddEmail = () => {
//     if (newEmail.subject && newEmail.sender) {
//       const newId = emails.length ? emails[emails.length - 1].id + 1 : 1;
//       setEmails((prevEmails) => [
//         ...prevEmails,
//         { id: newId, ...newEmail },
//       ]);
//       setNewEmail({ subject: "", sender: "" });
//     } else {
//       alert("Please fill in both the subject and sender.");
//     }
//   };

//   const handleDeleteEmail = (id) => {
//     setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
//   };

//   return (
//     <div className="flex flex-col items-center bg-black min-h-screen text-light">
//       {/* Email Header */}
//       <header className="text-center py-16 w-full max-w-screen-lg md:pl-[220px]">
//         <h1 className="text-neonPink text-6xl font-extrabold glowing-text">
//           Email Management
//         </h1>
//         <p className="text-gray-300 text-lg mt-4 max-w-xl mx-auto">
//           Manage your emails effectively with AI-powered tools.
//         </p>
//       </header>

//       {/* Emails Section */}
//       <section className="w-full bg-black py-16 px-6 md:pl-[220px]">
//         <div className="max-w-screen-lg mx-auto">
//           <h2 className="text-neonBlue text-4xl font-bold glowing-text text-center">
//             Your Emails
//           </h2>
//           <ul className="mt-8 space-y-4">
//             {emails.map((email) => (
//               <li
//                 key={email.id}
//                 className="flex justify-between items-center bg-gray-800 p-4 rounded-lg"
//               >
//                 <div>
//                   <h3 className="text-neonPink font-bold">{email.subject}</h3>
//                   <p className="text-gray-300">{email.sender}</p>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteEmail(email.id)}
//                   className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Delete
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* Add Email Section */}
//       <section className="w-full py-12 bg-black px-6 md:pl-[220px]">
//         <div className="max-w-screen-lg mx-auto text-center">
//           <h2 className="text-neonPurple text-3xl font-extrabold glowing-text">
//             Add a New Email
//           </h2>
//           <div className="flex flex-col mt-6 gap-4">
//             <input
//               type="text"
//               placeholder="Email Subject"
//               value={newEmail.subject}
//               onChange={(e) =>
//                 setNewEmail({ ...newEmail, subject: e.target.value })
//               }
//               className="p-3 rounded bg-gray-800 text-gray-200"
//             />
//             <input
//               type="email"
//               placeholder="Sender Email"
//               value={newEmail.sender}
//               onChange={(e) =>
//                 setNewEmail({ ...newEmail, sender: e.target.value })
//               }
//               className="p-3 rounded bg-gray-800 text-gray-200"
//             />
//             <button
//               onClick={handleAddEmail}
//               className="px-8 py-3 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:shadow-neonPink hover:bg-neonPink transition-transform transform hover:scale-110"
//             >
//               Add Email
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';

export default function EmailInbox() {
  const [emails, setEmails] = useState([]);
  const [linked, setLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);



  useEffect(() => {
    async function checkLinkedAccount() {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/email/messages');
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setEmails(data.emails);
          setLinked(true);
        } else {
          setLinked(false);
        }
      } catch (error) {
        setLinked(false);
      } finally {
        setLoading(false);
      }
    }
    checkLinkedAccount();
  }, []);

  const handleLogin = async () => {
    try {
        const res = await fetch("http://127.0.0.1:5000/api/email/login");
        const data = await res.json();
        console.log("Received data:", data);  // Debugging line
        if (data.redirect_url) {
            window.location.href = data.redirect_url;
        } else {
            console.error("No redirect URL received.");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
};

const handleOpenEmail = (email) => {
  setSelectedEmail(email);
  setEmails((prevEmails) =>
    prevEmails.map((e) => (e.id === email.id ? { ...e, read: true } : e))
  );
};


  return (
    <div className="flex flex-col bg-black min-h-screen text-light ml-[20%] p-6">
      <header className="text-center py-10 w-full max-w-3xl">
        <h1 className="text-neonPink text-5xl font-extrabold">Email Management</h1>
        <p className="text-gray-400 text-lg mt-2">Manage your emails efficiently with AI-powered tools.</p>
      </header>

      {linked ? (
        <section className="w-full max-w-5xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-neonBlue text-3xl font-bold mb-4">Your Emails</h2>

          {/* Agar Email Select Hai to Email Detail Dikhayega */}
          {selectedEmail ? (
            <div className="p-6 bg-gray-900 rounded-lg">
              <button
                onClick={() => setSelectedEmail(null)}
                className="mb-4 px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                ⬅ Back to Inbox
              </button>
              <h2 className="text-neonPink text-3xl font-bold mb-2">{selectedEmail.subject}</h2>
              <p className="text-gray-400">From: {selectedEmail.sender_email}</p>
              <p className="text-gray-500 text-sm">{selectedEmail.receivedDateTime}</p>
              <hr className="my-4 border-gray-600" />
              <p className="text-gray-200">{selectedEmail.body}</p>
            </div>
          ) : (
            // Email List Tab Jab Koi Email Select Na Ho
            <div>
              <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-xl font-semibold">Primary</h2>
                <input type="text" placeholder="Search mail" className="border p-2 rounded-md w-full md:w-1/3" />
              </div>
              <ul className="mt-4">
                {emails.length > 0 ? (
                  emails.map((email) => (
                    <li
                      key={email.id}
                      onClick={() => handleOpenEmail(email)}
                      className="flex flex-wrap md:flex-nowrap items-center justify-between p-3 border-b hover:bg-blue-100 hover:text-blue-900 cursor-pointer"
                    >
                      <div className="w-full md:w-1/4 font-bold truncate">{email.sender_email}</div>
                      <div className="w-full md:w-1/2">
                        <p className="font-semibold">{email.subject}</p>
                        <p className="text-sm text-gray-500 truncate">{email.preview}</p>
                      </div>
                      <p className="w-full md:w-auto text-sm text-gray-600 text-right">{email.receivedDateTime}</p>
                    </li>
                  ))
                ) : (
                  <p className="text-center py-4">No emails found.</p>
                )}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-gray-400 text-lg mb-4">You are not linked to an email account.</p>
          <button onClick={() => handleLogin()} className="px-6 py-3 bg-neonBlue text-black font-bold rounded-lg hover:bg-neonPink transition">
            Link Your Email
          </button>
        </div>
      )}
    </div>

  );
}
