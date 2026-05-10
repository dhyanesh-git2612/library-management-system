import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";

const GENRES = [
  "All", "Fiction", "Science Fiction", "Fantasy", "Mystery", "Romance",
  "Thriller", "Biography", "History", "Science", "Philosophy",
  "Poetry", "Self-Help", "Travel", "Cooking", "Art",
  "Technology", "Business", "Psychology", "Education", "Health"
];

export default function Catalog() {
  const { books } = useBooks();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState<"all" | "available" | "checked-out">("all");
  const [sortBy, setSortBy] = useState<"title" | "author" | "genre">("title");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = useMemo(() => {
    let result = [...books];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.isbn.includes(q)
      );
    }

    if (genre !== "All") {
      result = result.filter(b => b.genre === genre);
    }

    if (status !== "all") {
      result = result.filter(b => b.status === status);
    }

    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      return a.genre.localeCompare(b.genre);
    });

    return result;
  }, [books, query, genre, status, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📖 Book Catalog</h1>
        <p className="text-gray-500 mt-1">Browse and search our entire collection of {books.length} books</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-amber-100">
        <div className="grid md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Search</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Genre</label>
            <select
              value={genre}
              onChange={e => { setGenre(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none transition-all text-gray-800 bg-white"
            >
              {GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as "title" | "author" | "genre")}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none transition-all text-gray-800 bg-white"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
            </select>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex gap-2 mt-4">
          {(["all", "available", "checked-out"] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                status === s
                  ? s === "available"
                    ? "bg-emerald-500 text-white"
                    : s === "checked-out"
                    ? "bg-red-500 text-white"
                    : "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "all" ? "All" : s === "available" ? "✅ Available" : "📕 Checked Out"} ({s === "all" ? books.length : books.filter(b => b.status === s).length})
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Showing {paged.length} of {filtered.length} books
          {query && ` for "${query}"`}
        </p>
      </div>

      {/* Book Grid */}
      {paged.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl">🔍</span>
          <p className="text-gray-500 mt-4 text-lg">No books found matching your criteria.</p>
          <button
            onClick={() => { setQuery(""); setGenre("All"); setStatus("all"); }}
            className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paged.map(book => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 overflow-hidden group"
            >
              {/* Colored header based on genre */}
              <div className={`h-3 ${
                book.genre === "Fiction" ? "bg-blue-500" :
                book.genre === "Science Fiction" ? "bg-cyan-500" :
                book.genre === "Fantasy" ? "bg-purple-500" :
                book.genre === "Mystery" ? "bg-gray-700" :
                book.genre === "Romance" ? "bg-pink-500" :
                book.genre === "Thriller" ? "bg-red-600" :
                book.genre === "Biography" ? "bg-amber-700" :
                book.genre === "History" ? "bg-yellow-700" :
                book.genre === "Science" ? "bg-green-600" :
                book.genre === "Technology" ? "bg-indigo-500" :
                "bg-teal-500"
              }`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-amber-700 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    book.status === "available"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {book.status === "available" ? "✓" : "⊗"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{book.genre}</span>
                  <span className="text-[10px] text-gray-400">📍 {book.locationBlock}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400">Qty: {book.quantity}</span>
                  <span className="text-[10px] font-mono text-gray-400">{book.isbn.slice(0, 13)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    page === pageNum
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-white border border-gray-200 hover:bg-amber-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
