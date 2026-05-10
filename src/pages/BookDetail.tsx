import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooks } from "../contexts/BookContext";
import { useAuth } from "../contexts/AuthContext";
import { useBorrow } from "../contexts/BorrowContext";

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { getBookById, updateBook, deleteBook } = useBooks();
  const { user, isLibrarian } = useAuth();
  const { checkoutBook, returnBook, getActiveRecordForBook, getUserRecords } = useBorrow();
  const navigate = useNavigate();
  const book = getBookById(id || "");
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "err" } | null>(null);

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl">😕</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Book Not Found</h1>
        <Link to="/catalog" className="inline-block mt-6 px-6 py-2 bg-amber-600 text-white rounded-xl font-semibold">Back to Catalog</Link>
      </div>
    );
  }

  const activeRecord = getActiveRecordForBook(book.id);
  const userActiveRecord = user ? getUserRecords(user.id).find(r => r.bookId === book.id && r.status !== "returned") : null;
  const isUserBorrower = userActiveRecord?.userId === user?.id;

  const genreColors: Record<string, string> = {
    "Fiction": "bg-blue-500", "Science Fiction": "bg-cyan-500", "Fantasy": "bg-purple-500",
    "Mystery": "bg-gray-700", "Romance": "bg-pink-500", "Thriller": "bg-red-600",
    "Biography": "bg-amber-700", "History": "bg-yellow-700", "Science": "bg-green-600",
    "Technology": "bg-indigo-500", "Philosophy": "bg-violet-600", "Poetry": "bg-rose-500",
    "Self-Help": "bg-orange-500", "Travel": "bg-teal-500", "Cooking": "bg-lime-600",
    "Art": "bg-fuchsia-500", "Business": "bg-sky-600", "Psychology": "bg-emerald-500",
    "Education": "bg-blue-700", "Health": "bg-green-500"
  };

  const handleCheckout = () => {
    if (!user) { setMsg({ text: "Please log in to borrow books.", type: "err" }); return; }
    const result = checkoutBook(book.id);
    if (result.success) {
      setMsg({ text: `📖 "${book.title}" checked out! Due in 14 days. Check your email & SMS for confirmation.`, type: "ok" });
    } else {
      setMsg({ text: result.error || "Checkout failed.", type: "err" });
    }
  };

  const handleReturn = () => {
    if (!userActiveRecord) return;
    returnBook(userActiveRecord.id);
    setMsg({ text: `✅ "${book.title}" returned successfully!`, type: "ok" });
  };

  const handleToggleStatus = () => {
    updateBook(book.id, { status: book.status === "available" ? "checked-out" : "available" });
  };

  const handleDelete = () => {
    if (confirm(`Delete "${book.title}"?`)) { deleteBook(book.id); navigate("/catalog"); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/catalog" className="hover:text-amber-600">Catalog</Link><span>/</span>
        <span className="text-gray-600">{book.title}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100">
        <div className={`h-2 ${genreColors[book.genre] || "bg-teal-500"}`} />
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="shrink-0">
              <div className={`w-48 h-64 rounded-xl ${genreColors[book.genre] || "bg-teal-500"} flex items-center justify-center shadow-lg`}>
                <div className="text-center text-white p-4">
                  <span className="text-5xl block mb-3">📕</span>
                  <p className="text-xs font-semibold opacity-90 line-clamp-2">{book.title}</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-start gap-3 mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">{book.title}</h1>
                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold ${
                  book.status === "available" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                }`}>
                  {book.status === "available" ? "✅ Available" : "📕 Checked Out"}
                </span>
              </div>
              <p className="text-lg text-gray-600 mb-4">by <span className="font-semibold text-gray-800">{book.author}</span></p>
              <p className="text-gray-600 mb-6 leading-relaxed">{book.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: "ISBN", value: book.isbn, icon: "🔢" },
                  { label: "Genre", value: book.genre, icon: "🏷️" },
                  { label: "Location", value: `Block ${book.locationBlock}`, icon: "📍" },
                  { label: "Shelf", value: book.shelf, icon: "📚" },
                  { label: "Quantity", value: `${book.quantity} copies`, icon: "📦" },
                  { label: "Book ID", value: book.id, icon: "🆔" },
                ].map(info => (
                  <div key={info.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{info.icon} {info.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{info.value}</p>
                  </div>
                ))}
              </div>

              {/* Message */}
              {msg && (
                <div className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
                  msg.type === "ok" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {msg.text}
                </div>
              )}

              {/* Borrowing Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-4 border border-amber-200">
                <h3 className="font-bold text-gray-800 text-sm mb-2">📖 Borrowing Status</h3>
                {book.status === "available" && !isUserBorrower && (
                  <div>
                    <p className="text-xs text-gray-600 mb-3">This book is available! Check it out for 14 days. You'll receive email & SMS confirmation.</p>
                    {user ? (
                      <button onClick={handleCheckout}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all">
                        📖 Check Out Book
                      </button>
                    ) : (
                      <Link to="/login" className="inline-block px-5 py-2.5 bg-amber-600 text-white rounded-xl font-semibold text-sm shadow-md">
                        🔐 Login to Borrow
                      </Link>
                    )}
                  </div>
                )}
                {isUserBorrower && userActiveRecord && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      You have this book checked out.
                    </p>
                    <p className="text-xs mb-3">
                      <span className="text-amber-700 font-semibold">Due: {new Date(userActiveRecord.dueDate).toLocaleDateString()}</span>
                      {userActiveRecord.status === "overdue" && (
                        <span className="text-red-600 font-bold ml-2">⚠️ OVERDUE — ${userActiveRecord.fine.toFixed(2)} fine</span>
                      )}
                    </p>
                    <button onClick={handleReturn}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all">
                      📥 Return Book
                    </button>
                  </div>
                )}
                {book.status === "checked-out" && !isUserBorrower && activeRecord && (
                  <div>
                    <p className="text-xs text-gray-600">
                      This book is currently checked out.
                      {activeRecord.dueDate && ` Due back: ${new Date(activeRecord.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {isLibrarian && (
                  <>
                    <button onClick={handleToggleStatus}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all shadow-md ${
                        book.status === "available" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}>
                      {book.status === "available" ? "📕 Force Checkout" : "✅ Force Return"}
                    </button>
                    <Link to={`/edit-book/${book.id}`}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md">
                      ✏️ Edit
                    </Link>
                    <button onClick={handleDelete}
                      className="px-4 py-2 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-600 rounded-xl font-semibold text-sm transition-all">
                      🗑️ Delete
                    </button>
                  </>
                )}
                <Link to={`/map?block=${book.locationBlock}`}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md">
                  🗺️ View on Map
                </Link>
                <Link to={`/catalog`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all">
                  ← Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
