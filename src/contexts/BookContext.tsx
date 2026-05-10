import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Book, Location, initializeData } from "../data/seed";

interface BookContextType {
  books: Book[];
  locations: Location[];
  searchBooks: (query: string) => Book[];
  getBookById: (id: string) => Book | undefined;
  getBooksByLocation: (blockId: string) => Book[];
  addBook: (book: Omit<Book, "id">) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  refreshData: () => void;
}

const BookContext = createContext<BookContextType | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const data = initializeData();
    setBooks(data.books);
    setLocations(data.locations);
  }, []);

  useEffect(() => {
    setLocations(() => {
      const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
      const locationLabels: Record<string, string> = {
        "A": "Fiction Wing", "B": "Science & Tech", "C": "History & Biography",
        "D": "Arts & Literature", "E": "Children's Section", "F": "Reference Section",
        "G": "Periodicals", "H": "Special Collections"
      };
      return rows.flatMap((row, ri) =>
        [1,2,3,4,5,6,7,8].map((col) => {
          const blockId = `${row}${col}`;
          return {
            blockId,
            row: ri,
            col: col - 1,
            label: `${locationLabels[row]} — Aisle ${col}`,
            bookCount: books.filter(b => b.locationBlock === blockId).length
          };
        })
      );
    });
  }, [books]);

  const searchBooks = (query: string): Book[] => {
    if (!query.trim()) return books;
    const q = query.toLowerCase();
    return books.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q) ||
        b.genre.toLowerCase().includes(q)
    );
  };

  const getBookById = (id: string) => books.find(b => b.id === id);

  const getBooksByLocation = (blockId: string) => books.filter(b => b.locationBlock === blockId);

  const addBook = (book: Omit<Book, "id">) => {
    const newId = `BK${String(books.length + 1).padStart(4, "0")}`;
    const newBook = { ...book, id: newId };
    const updated = [...books, newBook];
    setBooks(updated);
    localStorage.setItem("lib_books", JSON.stringify(updated));
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    const updated = books.map(b => (b.id === id ? { ...b, ...updates } : b));
    setBooks(updated);
    localStorage.setItem("lib_books", JSON.stringify(updated));
  };

  const deleteBook = (id: string) => {
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    localStorage.setItem("lib_books", JSON.stringify(updated));
  };

  const refreshData = () => {
    const data = initializeData();
    setBooks(data.books);
    setLocations(data.locations);
  };

  return (
    <BookContext.Provider value={{ books, locations, searchBooks, getBookById, getBooksByLocation, addBook, updateBook, deleteBook, refreshData }}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("useBooks must be used within BookProvider");
  return ctx;
}
