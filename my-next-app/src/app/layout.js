import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import "../globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-gray-900 text-light">
      <body className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Page Content */}
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
