import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../data/seed";
import { initializeData } from "../data/seed";

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, phone: string) => { success: boolean; error?: string };
  logout: () => void;
  isLibrarian: boolean;
  updateProfile: (updates: Partial<Pick<User, "name" | "email" | "phone" | "emailNotifications" | "smsNotifications">>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const { users: loadedUsers } = initializeData();
    setUsers(loadedUsers);
    const session = localStorage.getItem("lib_session");
    if (session) {
      const sessionData = JSON.parse(session);
      const found = loadedUsers.find((u: User) => u.id === sessionData.userId);
      if (found) setUser(found);
    }
  }, []);

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password." };
    setUser(found);
    localStorage.setItem("lib_session", JSON.stringify({ userId: found.id }));
    return { success: true };
  };

  const register = (name: string, email: string, password: string, phone: string) => {
    if (users.find(u => u.email === email)) {
      return { success: false, error: "Email already registered." };
    }
    const newUser: User = {
      id: `USR${String(users.length + 1).padStart(3, "0")}`,
      name,
      email,
      password,
      phone,
      role: "user",
      emailNotifications: true,
      smsNotifications: false
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem("lib_users", JSON.stringify(updatedUsers));
    localStorage.setItem("lib_session", JSON.stringify({ userId: newUser.id }));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lib_session");
  };

  const updateProfile = (updates: Partial<Pick<User, "name" | "email" | "phone" | "emailNotifications" | "smsNotifications">>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    const updatedUsers = users.map(u => u.id === user.id ? updated : u);
    setUsers(updatedUsers);
    localStorage.setItem("lib_users", JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, isLibrarian: user?.role === "librarian", updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
