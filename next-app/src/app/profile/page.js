"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    bio: 'A passionate learner and developer.',
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Implement saving functionality (e.g., API call)
    console.log('Profile saved:', profile);
  };

  return (
    <div className="absolute inset-0 bg-black text-light flex flex-col items-center pt-16 px-4">
      {/* Close Icon */}
      <button
        className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold z-50"
        onClick={() => router.push('/')}
        aria-label="Close"
      >
        &times;
      </button>

      {/* Profile Section */}
      <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-neonPink text-4xl font-bold glowing-text mb-6 text-center">
          Profile
        </h1>

        {/* Profile Fields */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-gray-300 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-black"
              />
            ) : (
              <p className="text-gray-300">{profile.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-black"
              />
            ) : (
              <p className="text-gray-300">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-gray-300 mb-2">
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-black"
              />
            ) : (
              <p className="text-gray-300">{profile.phone}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-gray-300 mb-2">
              Bio
            </label>
            {isEditing ? (
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg text-black"
                rows="4"
              />
            ) : (
              <p className="text-gray-300">{profile.bio}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:shadow-neonPink hover:bg-neonPink transition-transform transform hover:scale-105"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-neonPink text-black font-bold rounded-lg shadow-neon hover:shadow-neonBlue hover:bg-neonBlue transition-transform transform hover:scale-105"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
