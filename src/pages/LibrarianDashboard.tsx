import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";

export default function LibrarianDashboard() {
  const { books, deleteBook } = useBooks();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const total = books.length;
    const available = books.filter(b => b.status === "available").length;
    const checkedOut = total - available;
    const genres = [...new Set(books.map(b => b.genre))];
    const lowStock = books.filter(b => b.quantity <= 2);
    const genreCounts = genres.map(g => ({
      genre: g,
      count: books.filter(b => b.genre === g).length,
      available: books.filter(b => b.genre === g && b.status === "available").length
    })).sort((a, b) => b.count - a.count);
    const locationCounts = ["A","B","C","D","E","F","G","H"].map(row => ({
      row,
      count: books.filter(b => b.locationBlock.startsWith(row)).length
    }));

    return { total, available, checkedOut, genres: genreCounts, lowStock, locationCounts };
  }, [books]);

  if (!user || user.role !== "librarian") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl">🔒</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Access Denied</h1>
        <p className="text-gray-500 mt-2">You need librarian privileges to access this page.</p>
        <Link to="/login" className="inline-block mt-6 px-6 py-2 bg-amber-600 text-white rounded-xl font-semibold">
          Login as Librarian
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🔑 Librarian Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name}. Manage your library here.</p>
        </div>
        <Link
          to="/add-book"
          className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          + Add New Book
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Books", value: stats.total, icon: "📚", color: "from-amber-500 to-amber-600" },
          { label: "Available", value: stats.available, icon: "✅", color: "from-emerald-500 to-emerald-600" },
          { label: "Checked Out", value: stats.checkedOut, icon: "📕", color: "from-red-500 to-red-600" },
          { label: "Low Stock", value: stats.lowStock.length, icon: "⚠️", color: "from-orange-500 to-orange-600" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-xl text-white shadow-md`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Genre Distribution</h2>
          <div className="space-y-2">
            {stats.genres.slice(0, 10).map(g => (
              <div key={g.genre} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-28 shrink-0 truncate">{g.genre}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all"
                    style={{ width: `${(g.count / stats.total) * 100}%` }}
                  />
                  <span className="absolute right-2 top-0 h-full flex items-center text-[10px] font-bold text-gray-600">
                    {g.count} ({g.available} avail)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Distribution */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📍 Location Distribution</h2>
          <div className="space-y-2">
            {stats.locationCounts.map(l => (
              <div key={l.row} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-8 font-bold">Row {l.row}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    style={{ width: `${(l.count / stats.total) * 100}%` }}
                  />
                  <span className="absolute right-2 top-0 h-full flex items-center text-[10px] font-bold text-gray-600">
                    {l.count} books
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">⚠️ Low Stock Alert ({stats.lowStock.length} items)</h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">All books have sufficient stock levels.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stats.lowStock.slice(0, 12).map(book => (
                <div key={book.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center text-lg shrink-0">
                    📕
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{book.title}</p>
                    <div className="flex gap-2 text-[10px]">
                      <span className="text-orange-600 font-bold">Qty: {book.quantity}</span>
                      <span className="text-gray-400">{book.locationBlock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Books */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">📚 All Books (Quick View)</h2>
            <Link to="/catalog" className="text-sm text-amber-600 hover:text-amber-700 font-semibold">
              View Full Catalog →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">ID</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Title</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Author</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Genre</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Qty</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Status</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.slice(0, 15).map(book => (
                  <tr key={book.id} className="border-b border-gray-50 hover:bg-amber-50/50 transition-colors">
                    <td className="py-2 px-3 font-mono text-xs text-gray-400">{book.id}</td>
                    <td className="py-2 px-3 font-semibold text-gray-800 max-w-[200px] truncate">
                      <Link to={`/book/${book.id}`} className="hover:text-amber-600 transition-colors">
                        {book.title}
                      </Link>
                    </td>
                    <td className="py-2 px-3 text-gray-600">{book.author}</td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{book.genre}</span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{book.quantity}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        book.status === "available"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Link to={`/edit-book/${book.id}`} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-all">
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${book.title}"?`)) deleteBook(book.id);
                          }}
                          className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
