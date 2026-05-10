import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBorrow } from "../contexts/BorrowContext";

export default function Navbar() {
  const { user, logout, isLibrarian } = useAuth();
  const { unreadCount } = useBorrow();
  const loc = useLocation();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      loc.pathname === path
        ? "bg-amber-700 text-white shadow-md"
        : "text-amber-100 hover:bg-amber-700/50 hover:text-white"
    }`;

  return (
    <nav className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-xl sticky top-0 z-50 border-b-2 border-amber-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl">📚</span>
            <div>
              <span className="text-xl font-bold text-amber-50 group-hover:text-amber-300 transition-colors">LibraryHub</span>
              <span className="block text-[10px] text-amber-400 -mt-1 tracking-widest uppercase">LMS + Notifications</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={linkClass("/")}>Home</Link>
            <Link to="/catalog" className={linkClass("/catalog")}>Catalog</Link>
            <Link to="/map" className={linkClass("/map")}>Map</Link>
            <Link to="/inventory" className={linkClass("/inventory")}>Inventory</Link>
            <Link to="/help" className={linkClass("/help")}>Help</Link>
            {isLibrarian && (
              <>
                <span className="w-px h-6 bg-amber-600 mx-1" />
                <Link to="/librarian" className={linkClass("/librarian")}>Dashboard</Link>
                <Link to="/add-book" className={linkClass("/add-book")}>Add Book</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <Link to="/notifications" className="relative p-2 text-amber-200 hover:text-white transition-colors">
                  <span className="text-xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile */}
                <Link to="/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-amber-700/50 transition-all">
                  <span className="text-lg">{user.role === "librarian" ? "🔑" : "👤"}</span>
                  <div className="text-right">
                    <p className="text-sm text-amber-100 font-medium leading-tight">{user.name}</p>
                    <p className="text-[10px] text-amber-400 uppercase tracking-wider">{user.role}</p>
                  </div>
                </Link>

                <button onClick={logout}
                  className="px-3 py-1.5 bg-amber-700/50 hover:bg-red-700 text-amber-100 hover:text-white rounded-lg text-sm transition-all border border-amber-600/50">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-1.5 bg-amber-700/50 hover:bg-amber-700 text-amber-100 rounded-lg text-sm transition-all border border-amber-600/50">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-all shadow-md">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex flex-wrap gap-1 pb-2">
          <Link to="/" className={linkClass("/")}>Home</Link>
          <Link to="/catalog" className={linkClass("/catalog")}>Cat</Link>
          <Link to="/map" className={linkClass("/map")}>Map</Link>
          <Link to="/inventory" className={linkClass("/inventory")}>Inv</Link>
          <Link to="/help" className={linkClass("/help")}>Help</Link>
          {user && <Link to="/notifications" className={linkClass("/notifications")}>🔔<sup className="text-red-400">{unreadCount}</sup></Link>}
          {user && <Link to="/profile" className={linkClass("/profile")}>Me</Link>}
          {isLibrarian && <Link to="/librarian" className={linkClass("/librarian")}>Dash</Link>}
        </div>
      </div>
    </nav>
  );
}
