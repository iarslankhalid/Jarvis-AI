"use client";

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div
      className="absolute inset-0 bg-black text-light flex items-center justify-center z-50"
      style={{ paddingTop: '4rem' }}
    >
      {/* Close Icon */}
      <button
        className="absolute top-4 right-4 text-neonPink hover:text-neonBlue text-2xl font-bold z-50"
        onClick={() => router.push('/')}
        aria-label="Close"
      >
        &times;
      </button>

      <div className="p-8 rounded-lg shadow-lg bg-gray-900 w-full max-w-lg">
        <h1 className="text-neonPink text-4xl font-bold glowing-text mb-6 text-center">
          Log In
        </h1>
        <form className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg text-black"
            />
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg text-black"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-neonBlue text-black font-bold rounded-lg shadow-neon hover:shadow-neonPink hover:bg-neonPink transition-transform transform hover:scale-105"
          >
            Log In
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Don’t have an account?{' '}
          <a href="/signup" className="text-neonBlue hover:text-neonPink">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
