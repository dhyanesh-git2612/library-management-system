import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";

const GENRES = [
  "Fiction", "Science Fiction", "Fantasy", "Mystery", "Romance",
  "Thriller", "Biography", "History", "Science", "Philosophy",
  "Poetry", "Self-Help", "Travel", "Cooking", "Art",
  "Technology", "Business", "Psychology", "Education", "Health"
];

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const COLS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function AddEditBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addBook, getBookById, updateBook } = useBooks();
  const { user } = useAuth();
  const isEdit = Boolean(id);
  const existingBook = id ? getBookById(id) : null;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [locationBlock, setLocationBlock] = useState("A1");
  const [shelf, setShelf] = useState("A-1");
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (existingBook) {
      setTitle(existingBook.title);
      setAuthor(existingBook.author);
      setIsbn(existingBook.isbn);
      setGenre(existingBook.genre);
      setLocationBlock(existingBook.locationBlock);
      setShelf(existingBook.shelf);
      setQuantity(existingBook.quantity);
      setDescription(existingBook.description);
    }
  }, [existingBook]);

  if (!user || user.role !== "librarian") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl">🔒</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Access Denied</h1>
        <p className="text-gray-500 mt-2">Only librarians can add or edit books.</p>
        <Link to="/login" className="inline-block mt-6 px-6 py-2 bg-amber-600 text-white rounded-xl font-semibold">
          Login as Librarian
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookData = {
      title,
      author,
      isbn,
      genre,
      locationBlock,
      shelf,
      quantity,
      status: "available" as const,
      description
    };

    if (isEdit && id) {
      updateBook(id, bookData);
      setSuccess("Book updated successfully!");
    } else {
      addBook(bookData);
      setSuccess("Book added successfully!");
    }

    setTimeout(() => {
      navigate(isEdit && id ? `/book/${id}` : "/catalog");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link to="/librarian" className="hover:text-amber-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-600">{isEdit ? "Edit Book" : "Add Book"}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEdit ? "✏️ Edit Book" : "📖 Add New Book"}
        </h1>
        <p className="text-gray-500 mt-1">
          {isEdit ? `Editing: ${existingBook?.title}` : "Fill in the details to add a new book to the library"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span>✅</span> {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="Enter book title"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Author *</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="Author name"
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN *</label>
            <input
              type="text"
              value={isbn}
              onChange={e => setIsbn(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all font-mono text-sm"
              placeholder="978-0-00000-000-0"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Genre *</label>
            <select
              value={genre}
              onChange={e => setGenre(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none transition-all bg-white"
            >
              {GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={e => setQuantity(parseInt(e.target.value) || 1)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
            />
          </div>

          {/* Location Block */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location Block *</label>
            <select
              value={locationBlock}
              onChange={e => setLocationBlock(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none transition-all bg-white"
            >
              {ROWS.map(row =>
                COLS.map(col => (
                  <option key={`${row}${col}`} value={`${row}${col}`}>
                    Block {row}{col}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Shelf */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Shelf *</label>
            <input
              type="text"
              value={shelf}
              onChange={e => setShelf(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="e.g. A-5"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none"
              placeholder="Brief description of the book..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            {isEdit ? "💾 Save Changes" : "📖 Add Book"}
          </button>
          <Link
            to={isEdit && id ? `/book/${id}` : "/librarian"}
            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
