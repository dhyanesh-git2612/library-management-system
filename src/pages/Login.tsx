import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl">🔐</span>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to access the library</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-gray-800"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 bg-white/80 rounded-xl p-4 border border-amber-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">Quick Login:</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-mono text-gray-700">librarian@library.com</p>
              <p className="font-mono text-amber-600">admin123</p>
            </div>
            <div>
              <p className="font-mono text-gray-700">john@example.com</p>
              <p className="font-mono text-amber-600">user123</p>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
