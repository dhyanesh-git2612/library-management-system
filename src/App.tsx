import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BookProvider } from "./contexts/BookContext";
import { BorrowProvider } from "./contexts/BorrowContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalog from "./pages/Catalog";
import BookDetail from "./pages/BookDetail";
import MapView from "./pages/MapView";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import AddEditBook from "./pages/AddEditBook";
import Inventory from "./pages/Inventory";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <BookProvider>
          <BorrowProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/book/:id" element={<BookDetail />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/librarian" element={<LibrarianDashboard />} />
                <Route path="/add-book" element={<AddEditBook />} />
                <Route path="/edit-book/:id" element={<AddEditBook />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/help" element={<Help />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Routes>
          </BorrowProvider>
        </BookProvider>
      </AuthProvider>
    </HashRouter>
  );
}
