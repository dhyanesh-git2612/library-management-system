import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Help() {
  const { user, isLibrarian } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <span className="text-6xl">❓</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Help & Guide</h1>
        <p className="text-gray-500 mt-2">Everything you need to know about using LibraryHub</p>
      </div>

      {/* Getting Started */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
          Getting Started
        </h2>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">🔍 Browsing the Catalog</h3>
              <p className="text-sm text-gray-600">
                Visit the <Link to="/catalog" className="text-amber-600 font-semibold hover:underline">Catalog</Link> page to browse all 200 books. 
                Use the search bar to find books by title, author, or ISBN. Filter by genre, status, or sort by different fields.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">🗺️ Using the Map</h3>
              <p className="text-sm text-gray-600">
                The <Link to="/map" className="text-amber-600 font-semibold hover:underline">Map</Link> page shows a satellite-style floor plan of the library. 
                Each colored block represents a section. Click any block to see which books are stored there and their availability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">📋 Checking Inventory</h3>
              <p className="text-sm text-gray-600">
                The <Link to="/inventory" className="text-amber-600 font-semibold hover:underline">Inventory</Link> page provides a detailed table view of all books 
                with location, quantity, and status information. Sort and filter to find what you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Account & Roles */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
          User Roles
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">👤</span>
              <div>
                <h3 className="font-bold text-blue-800">Member (User)</h3>
                <p className="text-xs text-blue-600">Default role for new accounts</p>
              </div>
            </div>
            <ul className="text-sm text-blue-700 space-y-1.5">
              <li>✅ Browse and search the catalog</li>
              <li>✅ View book details and locations</li>
              <li>✅ Use the interactive map</li>
              <li>✅ View inventory and stock levels</li>
              <li>✅ Access help documentation</li>
              <li>❌ Cannot add, edit, or delete books</li>
              <li>❌ Cannot access librarian dashboard</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🔑</span>
              <div>
                <h3 className="font-bold text-amber-800">Librarian (Admin)</h3>
                <p className="text-xs text-amber-600">Full management access</p>
              </div>
            </div>
            <ul className="text-sm text-amber-700 space-y-1.5">
              <li>✅ All Member capabilities</li>
              <li>✅ Add new books to the catalog</li>
              <li>✅ Edit existing book details</li>
              <li>✅ Delete books from the library</li>
              <li>✅ Check out and return books</li>
              <li>✅ Access librarian dashboard & analytics</li>
              <li>✅ Monitor stock levels and low-stock alerts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Library Map Guide */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</span>
          Library Floor Plan Guide
        </h2>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-4">
            The library is organized into 8 rows (A–H) and 8 aisles (1–8), creating 64 sections:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { row: "A", label: "Fiction Wing", color: "bg-blue-100 border-blue-300" },
              { row: "B", label: "Science & Tech", color: "bg-cyan-100 border-cyan-300" },
              { row: "C", label: "History & Biography", color: "bg-amber-100 border-amber-300" },
              { row: "D", label: "Arts & Literature", color: "bg-purple-100 border-purple-300" },
              { row: "E", label: "Children's Section", color: "bg-pink-100 border-pink-300" },
              { row: "F", label: "Reference Section", color: "bg-gray-100 border-gray-300" },
              { row: "G", label: "Periodicals", color: "bg-teal-100 border-teal-300" },
              { row: "H", label: "Special Collections", color: "bg-rose-100 border-rose-300" },
            ].map(section => (
              <div key={section.row} className={`${section.color} border rounded-xl p-3`}>
                <p className="font-bold text-gray-800 text-lg">Row {section.row}</p>
                <p className="text-xs text-gray-600">{section.label}</p>
                <p className="text-[10px] text-gray-400 mt-1">Aisles 1–8</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Accounts */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">4</span>
          Demo Accounts
        </h2>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-600 mb-4">Use these pre-configured accounts to explore the system:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="font-bold text-amber-800 text-sm mb-2">🔑 Librarian Account</p>
              <div className="space-y-1 font-mono text-xs">
                <p>Email: <span className="bg-white px-2 py-0.5 rounded">librarian@library.com</span></p>
                <p>Password: <span className="bg-white px-2 py-0.5 rounded">admin123</span></p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="font-bold text-blue-800 text-sm mb-2">👤 User Account</p>
              <div className="space-y-1 font-mono text-xs">
                <p>Email: <span className="bg-white px-2 py-0.5 rounded">john@example.com</span></p>
                <p>Password: <span className="bg-white px-2 py-0.5 rounded">user123</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pages Overview */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">5</span>
          All Pages
        </h2>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500">Page</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500">Description</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500">Access</th>
              </tr>
            </thead>
            <tbody>
              {[
                { page: "Home", desc: "Landing page with overview, stats, and quick links", access: "Public", link: "/" },
                { page: "Login", desc: "Sign in with email and password", access: "Public", link: "/login" },
                { page: "Register", desc: "Create a new member account", access: "Public", link: "/register" },
                { page: "Catalog", desc: "Browse, search, and filter all 200 books", access: "Public", link: "/catalog" },
                { page: "Book Detail", desc: "Full details for a single book with actions", access: "Public", link: "/book/BK0001" },
                { page: "Map View", desc: "Interactive satellite-style library floor plan", access: "Public", link: "/map" },
                { page: "Inventory", desc: "Table view of all books with status tracking", access: "Public", link: "/inventory" },
                { page: "Librarian Dashboard", desc: "Analytics, stats, and book management", access: "Librarian Only", link: "/librarian" },
                { page: "Add/Edit Book", desc: "Form to create or modify book entries", access: "Librarian Only", link: "/add-book" },
                { page: "Help", desc: "Documentation and user guide", access: "Public", link: "/help" },
              ].map((row, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-amber-50/30">
                  <td className="py-2.5 px-4">
                    <Link to={row.link} className="font-semibold text-amber-700 hover:text-amber-600">
                      {row.page}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-gray-600">{row.desc}</td>
                  <td className="py-2.5 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      row.access === "Librarian Only"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {row.access}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">6</span>
          Technical Details
        </h2>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Frontend</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• React 18 with TypeScript</li>
                <li>• React Router for page navigation</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Context API for state management</li>
                <li>• LocalStorage for data persistence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Data</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• 200 seeded books across 20 genres</li>
                <li>• 64 library sections (8×8 grid)</li>
                <li>• Role-based access (User/Librarian)</li>
                <li>• Full CRUD operations for books</li>
                <li>• Client-side search and filtering</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Current user info */}
      {user && (
        <section className="mb-10">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">👋 You're logged in as {user.name}</h3>
            <p className="text-amber-100 text-sm mb-3">
              Role: {isLibrarian ? "🔑 Librarian" : "👤 Member"} — Email: {user.email}
            </p>
            <div className="flex gap-3">
              {isLibrarian ? (
                <Link to="/librarian" className="px-4 py-2 bg-white/20 rounded-xl font-semibold text-sm hover:bg-white/30 transition-all">
                  Go to Dashboard →
                </Link>
              ) : (
                <Link to="/catalog" className="px-4 py-2 bg-white/20 rounded-xl font-semibold text-sm hover:bg-white/30 transition-all">
                  Browse Catalog →
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
