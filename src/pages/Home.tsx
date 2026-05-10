import { Link } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { books } = useBooks();
  const { user } = useAuth();

  const totalBooks = books.length;
  const available = books.filter(b => b.status === "available").length;
  const genres = [...new Set(books.map(b => b.genre))].length;
  const locations = [...new Set(books.map(b => b.locationBlock))].length;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)`
          }} />
        </div>
        <div className="absolute top-10 right-10 text-[200px] opacity-5 select-none pointer-events-none">📖</div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Welcome to LibraryHub
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Next <br />
              <span className="text-amber-400">Great Read</span>
            </h1>
            <p className="text-amber-200/80 text-lg mb-8 max-w-xl">
              Browse our collection of {totalBooks} books across {genres} genres. 
              Explore the library map, search by title or author, and manage your collection with ease.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5"
              >
                Browse Catalog 📚
              </Link>
              <Link
                to="/map"
                className="px-8 py-3 bg-amber-700/50 hover:bg-amber-700 text-amber-100 font-semibold rounded-xl transition-all border border-amber-600/50"
              >
                View Map 🗺️
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Join Now ✨
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Books", value: totalBooks, icon: "📕", color: "from-amber-500 to-amber-600" },
              { label: "Available", value: available, icon: "✅", color: "from-emerald-500 to-emerald-600" },
              { label: "Genres", value: genres, icon: "🏷️", color: "from-purple-500 to-purple-600" },
              { label: "Locations", value: locations, icon: "📍", color: "from-blue-500 to-blue-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-xl shadow-md`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Everything You Need</h2>
          <p className="text-gray-500 max-w-lg mx-auto">A complete library management system with powerful tools for both readers and librarians.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔍",
              title: "Smart Search",
              desc: "Find books by title, author, ISBN, or genre instantly across the entire collection.",
              link: "/catalog",
              color: "bg-blue-50 border-blue-200 hover:border-blue-400"
            },
            {
              icon: "🗺️",
              title: "Interactive Map",
              desc: "Explore the library floor plan with a satellite-style view showing book density by section.",
              link: "/map",
              color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400"
            },
            {
              icon: "📋",
              title: "Inventory Management",
              desc: "View all books with their status, location, and stock levels in a clean table view.",
              link: "/inventory",
              color: "bg-purple-50 border-purple-200 hover:border-purple-400"
            },
            {
              icon: "🔑",
              title: "Librarian Dashboard",
              desc: "Add, edit, and manage books. Monitor stock levels and control the catalog.",
              link: "/librarian",
              color: "bg-amber-50 border-amber-200 hover:border-amber-400"
            },
            {
              icon: "📊",
              title: "Book Statistics",
              desc: "Real-time statistics on book availability, genre distribution, and location data.",
              link: "/catalog",
              color: "bg-rose-50 border-rose-200 hover:border-rose-400"
            },
            {
              icon: "❓",
              title: "Help & Guide",
              desc: "Complete guide on using LibraryHub, role descriptions, and feature walkthrough.",
              link: "/help",
              color: "bg-teal-50 border-teal-200 hover:border-teal-400"
            },
          ].map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className={`block p-6 rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${f.color}`}
            >
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Login Info */}
      {!user && (
        <section className="bg-amber-900 text-amber-100">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold text-amber-300 mb-2">Quick Access Accounts</h3>
                <p className="text-amber-200/70">Use these demo accounts to explore the app:</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-amber-800/50 rounded-xl p-4 border border-amber-700">
                  <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Librarian</p>
                  <p className="text-sm font-mono">librarian@library.com</p>
                  <p className="text-sm font-mono text-amber-400">admin123</p>
                </div>
                <div className="bg-amber-800/50 rounded-xl p-4 border border-amber-700">
                  <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">User</p>
                  <p className="text-sm font-mono">john@example.com</p>
                  <p className="text-sm font-mono text-amber-400">user123</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-amber-500 font-semibold">📚 LibraryHub — Book Management System</p>
          <p className="text-xs mt-2">MVP Demo • {totalBooks} books loaded • Built with React</p>
        </div>
      </footer>
    </div>
  );
}
