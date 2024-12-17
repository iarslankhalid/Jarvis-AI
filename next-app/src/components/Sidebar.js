import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed top-15 left-0 w-1/6 bg-black text-light shadow-lg min-h-screen border-r-4 border-neonPink">
      <nav>
        <ul className="space-y-6 px-6 py-8">
          {/* Email */}
          <li>
            <Link
              href="/email"
              className="flex items-center space-x-3 text-neonPink font-bold hover:text-neonBlue transition-transform transform hover:scale-110 hover:shadow-neon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89-3.947a2 2 0 011.789 0L21 8m-18 4v8a2 2 0 002 2h14a2 2 0 002-2v-8m-9 4h.01"
                />
              </svg>
              <span>Email</span>
            </Link>
          </li>

          {/* Calendar */}
          <li>
            <Link
              href="/calendar"
              className="flex items-center space-x-3 text-neonPink font-bold hover:text-neonBlue transition-transform transform hover:scale-110 hover:shadow-neon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 4h10M5 11h14m-9 4h3"
                />
              </svg>
              <span>Calendar</span>
            </Link>
          </li>

          {/* Tasks */}
          <li>
            <Link
              href="/tasks"
              className="flex items-center space-x-3 text-neonPink font-bold hover:text-neonBlue transition-transform transform hover:scale-110 hover:shadow-neon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Tasks</span>
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link
              href="/voice-assistant"
              className="flex items-center space-x-3 text-neonPink font-bold hover:text-neonBlue transition-transform transform hover:scale-110 hover:shadow-neon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.105 0-2 .895-2 2m4 0c0-1.105-.895-2-2-2m0 0c1.105 0 2 .895 2 2m-4 0c0 1.105.895 2 2 2m0 0c-1.105 0-2-.895-2-2m4 0c0-1.105-.895-2-2-2m0 0V5.414A2 2 0 0113.414 3H16m-4 0V5.414M8 21h8m-8-2h8m-8 0h8"
                />
              </svg>
              <span>assistance</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
