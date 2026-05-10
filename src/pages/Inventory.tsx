import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";

export default function Inventory() {
  const { books } = useBooks();
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "checked-out">("all");
  const [filterGenre, setFilterGenre] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [sortField, setSortField] = useState<"title" | "author" | "quantity" | "locationBlock">("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const perPage = 25;

  const genres = useMemo(() => ["All", ...new Set(books.map(b => b.genre))].sort(), [books]);
  const locs = useMemo(() => ["All", ...[...new Set(books.map(b => b.locationBlock))].sort()], [books]);

  const filtered = useMemo(() => {
    let result = [...books];
    if (filterStatus !== "all") result = result.filter(b => b.status === filterStatus);
    if (filterGenre !== "All") result = result.filter(b => b.genre === filterGenre);
    if (filterLocation !== "All") result = result.filter(b => b.locationBlock === filterLocation);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "title") cmp = a.title.localeCompare(b.title);
      else if (sortField === "author") cmp = a.author.localeCompare(b.author);
      else if (sortField === "quantity") cmp = a.quantity - b.quantity;
      else cmp = a.locationBlock.localeCompare(b.locationBlock);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [books, filterStatus, filterGenre, filterLocation, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <span className="ml-1 text-[10px]">
      {sortField === field ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📋 Inventory</h1>
          <p className="text-gray-500 mt-1">Complete book inventory with status and location tracking</p>
        </div>
        <Link to="/catalog" className="text-sm text-amber-600 hover:text-amber-700 font-semibold">
          ← Back to Catalog
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{books.length}</p>
          <p className="text-xs text-gray-500">Total Books</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-2xl font-bold text-emerald-700">{books.filter(b => b.status === "available").length}</p>
          <p className="text-xs text-emerald-600">Available</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-2xl font-bold text-red-700">{books.filter(b => b.status === "checked-out").length}</p>
          <p className="text-xs text-red-600">Checked Out</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className="text-2xl font-bold text-amber-700">{books.reduce((s, b) => s + b.quantity, 0)}</p>
          <p className="text-xs text-amber-600">Total Copies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            {(["all", "available", "checked-out"] as const).map(s => (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filterStatus === s
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "all" ? "All Status" : s === "available" ? "✅ Available" : "📕 Checked Out"}
              </button>
            ))}
          </div>
          <select
            value={filterGenre}
            onChange={e => { setFilterGenre(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
          >
            {genres.map(g => <option key={g} value={g}>{g === "All" ? "All Genres" : g}</option>)}
          </select>
          <select
            value={filterLocation}
            onChange={e => { setFilterLocation(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
          >
            {locs.map(l => <option key={l} value={l}>{l === "All" ? "All Locations" : `Block ${l}`}</option>)}
          </select>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500">ID</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 cursor-pointer hover:text-amber-600" onClick={() => toggleSort("title")}>
                  Title <SortIcon field="title" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 cursor-pointer hover:text-amber-600" onClick={() => toggleSort("author")}>
                  Author <SortIcon field="author" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500">Genre</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 cursor-pointer hover:text-amber-600" onClick={() => toggleSort("locationBlock")}>
                  Location <SortIcon field="locationBlock" />
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500">Shelf</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-gray-500 cursor-pointer hover:text-amber-600" onClick={() => toggleSort("quantity")}>
                  Qty <SortIcon field="quantity" />
                </th>
                <th className="text-center py-3 px-4 text-xs font-bold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((book, i) => (
                <tr key={book.id} className={`border-b border-gray-50 hover:bg-amber-50/50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                  <td className="py-2.5 px-4 font-mono text-xs text-gray-400">{book.id}</td>
                  <td className="py-2.5 px-4">
                    <Link to={`/book/${book.id}`} className="font-semibold text-gray-800 hover:text-amber-600 transition-colors">
                      {book.title}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-gray-600">{book.author}</td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{book.genre}</span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-xs">
                    <Link to={`/map?block=${book.locationBlock}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                      📍 {book.locationBlock}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-xs text-gray-500">{book.shelf}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`inline-block min-w-[2rem] py-0.5 px-2 rounded-full text-xs font-bold ${
                      book.quantity <= 2 ? "bg-red-100 text-red-700" : book.quantity <= 4 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {book.quantity}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      book.status === "available"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {book.status === "available" ? "✓ Available" : "⊗ Checked Out"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-white border text-xs hover:bg-gray-50 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-white border text-xs hover:bg-gray-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
