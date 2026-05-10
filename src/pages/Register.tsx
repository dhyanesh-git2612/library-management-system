import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    const result = register(name, email, password, phone);
    if (result.success) navigate("/");
    else setError(result.error || "Registration failed");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl">📝</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Create Account</h1>
          <p className="text-gray-500 mt-2">Join LibraryHub — borrow books & get notifications</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">⚠️ {error}</div>
          )}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="Your full name" />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="you@example.com" />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="+15551234567 (for SMS notifications)" />
            <p className="text-[10px] text-gray-400 mt-1">Include country code. Used for SMS alerts (overdue reminders).</p>
          </div>
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="Minimum 6 characters" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              placeholder="Repeat your password" />
          </div>
          <button type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
            Create Account
          </button>
          <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-700">📧 <strong>Email:</strong> Get checkout confirmations & due-date reminders</p>
            <p className="text-xs text-amber-700 mt-1">📱 <strong>SMS:</strong> Overdue alerts straight to your phone</p>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            New accounts get <strong>Member</strong> role. Librarian access requires admin.
          </p>
        </form>
        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
