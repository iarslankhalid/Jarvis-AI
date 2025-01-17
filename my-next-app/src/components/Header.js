import Link from "next/link"; // Import the Next.js Link component

export default function Header() {
  return (
    <header className="sticky top-0 w-full bg-black border-b-4 border-neonPink py-4 px-6 flex items-center justify-between shadow-neon">
      {/* Logo and Title */}
      <div className="flex items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <img
              src="/logo (2).jpg"
              alt="JARVIS Logo"
              className="h-12 w-12 mr-4 rounded-full border-4 border-neonBlue shadow-neon"
            />
            <h1 className="text-neonPink text-3xl font-extrabold glowing-text">
              JARVIS AI
            </h1>
          </div>
        </Link>
      </div>

      {/* Wake Word */}
      <div className="flex items-center space-x-6">
        <div className="text-light text-sm md:text-base">
          Wake word:{" "}
          <span className="text-neonBlue font-semibold hover:text-neonPurple transition-all">
            "Hello Jarvis"
          </span>
        </div>

        {/* Profile Icon */}
        <Link href="/profile">
          <div className="cursor-pointer">
            <img
              src="/profile-icon.png" // Replace with your profile icon image path
              alt="Profile"
              className="h-10 w-10 rounded-full border-4 border-neonPink hover:shadow-neonPink transition-all"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}
