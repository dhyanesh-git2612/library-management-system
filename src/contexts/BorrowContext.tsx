import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useBooks } from "./BookContext";

// ── Types ──
export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  bookTitle: string;
  checkoutDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "active" | "returned" | "overdue";
  fine: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  channel: "email" | "sms" | "in-app";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  delivered: boolean;
  recipient: string;
}

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  enabled: boolean;
}

interface BorrowContextType {
  records: BorrowRecord[];
  notifications: AppNotification[];
  emailjsConfig: EmailJSConfig;
  checkoutBook: (bookId: string) => { success: boolean; error?: string };
  returnBook: (recordId: string) => void;
  getUserRecords: (userId: string) => BorrowRecord[];
  getActiveRecordForBook: (bookId: string) => BorrowRecord | undefined;
  getOverdueRecords: () => BorrowRecord[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateEmailJSConfig: (config: EmailJSConfig) => void;
  sendTestEmail: (email: string) => Promise<{ sent: boolean; error?: string }>;
  sendTestSMS: (phone: string) => Promise<{ sent: boolean; error?: string }>;
  unreadCount: number;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  totalFines: (userId: string) => number;
}

const BorrowContext = createContext<BorrowContextType | null>(null);

// ── Email via EmailJS REST API ──
async function sendEmailViaEmailJS(
  config: EmailJSConfig,
  toEmail: string,
  subject: string,
  message: string
): Promise<boolean> {
  if (!config.enabled || !config.serviceId) return false;
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        template_params: {
          to_email: toEmail,
          from_name: "LibraryHub",
          subject,
          message,
          to_name: toEmail.split("@")[0]
        }
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── SMS via TextBelt (free: 1 SMS/day) ──
async function sendSMSViaTextBelt(phone: string, message: string): Promise<boolean> {
  if (!phone) return false;
  try {
    const res = await fetch("https://textbelt.com/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        message: `📚 LibraryHub: ${message}`,
        key: "textbelt"
      })
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// ── Provider ──
export function BorrowProvider({ children }: { children: ReactNode }) {
  const { user, users } = useAuth();
  const { getBookById, updateBook } = useBooks();

  const [records, setRecords] = useState<BorrowRecord[]>(() => {
    try {
      const s = localStorage.getItem("lib_borrows");
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const s = localStorage.getItem("lib_notifications");
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  const [emailjsConfig, setEmailjsConfig] = useState<EmailJSConfig>(() => {
    try {
      const s = localStorage.getItem("lib_emailjs");
      return s ? JSON.parse(s) : { serviceId: "", templateId: "", publicKey: "", enabled: false };
    } catch { return { serviceId: "", templateId: "", publicKey: "", enabled: false }; }
  });

  // Persist
  useEffect(() => { localStorage.setItem("lib_borrows", JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem("lib_notifications", JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem("lib_emailjs", JSON.stringify(emailjsConfig)); }, [emailjsConfig]);

  // Check overdue on mount
  useEffect(() => {
    const now = new Date();
    setRecords(prev => prev.map(r => {
      if (r.status === "active" && new Date(r.dueDate) < now) {
        const days = Math.ceil((now.getTime() - new Date(r.dueDate).getTime()) / 86400000);
        return { ...r, status: "overdue" as const, fine: Math.round(days * 50) / 100 };
      }
      return r;
    }));
  }, []);

  const unreadCount = notifications.filter(n => !n.read && (!user || n.userId === user.id)).length;

  const addNotification = useCallback((
    userId: string, channel: "email" | "sms" | "in-app",
    title: string, message: string, delivered: boolean, recipient: string
  ) => {
    const n: AppNotification = {
      id: `N${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
      userId, channel, title, message,
      timestamp: new Date().toISOString(),
      read: false, delivered, recipient
    };
    setNotifications(prev => [n, ...prev]);
  }, []);

  const checkoutBook = useCallback((bookId: string) => {
    if (!user) return { success: false, error: "Please log in to borrow books." };
    const book = getBookById(bookId);
    if (!book) return { success: false, error: "Book not found." };
    if (book.status === "checked-out") return { success: false, error: "Book is already checked out." };
    if (records.find(r => r.bookId === bookId && r.userId === user.id && r.status !== "returned"))
      return { success: false, error: "You already have this book." };

    const now = new Date();
    const due = new Date(now.getTime() + 14 * 86400000);
    const record: BorrowRecord = {
      id: `BR${Date.now()}`, bookId, userId: user.id, bookTitle: book.title,
      checkoutDate: now.toISOString(), dueDate: due.toISOString(),
      returnDate: null, status: "active", fine: 0
    };

    setRecords(prev => [...prev, record]);
    updateBook(bookId, { status: "checked-out" });

    const dueStr = due.toLocaleDateString();
    const msg = `You checked out "${book.title}". Due: ${dueStr}. Return on time to avoid $0.50/day fine.`;

    // Always add in-app notification
    addNotification(user.id, "in-app", "📖 Book Checked Out", msg, true, "");

    // Email notification
    if (user.emailNotifications && user.email) {
      addNotification(user.id, "email", "📧 Checkout Confirmation", `Email to ${user.email}`, true, user.email);
      sendEmailViaEmailJS(emailjsConfig, user.email, "LibraryHub - Book Checked Out", msg);
    }

    // SMS notification
    if (user.smsNotifications && user.phone) {
      addNotification(user.id, "sms", "📱 Checkout SMS", `SMS to ${user.phone}`, true, user.phone);
      sendSMSViaTextBelt(user.phone, msg);
    }

    return { success: true };
  }, [user, records, getBookById, updateBook, addNotification, emailjsConfig]);

  const returnBook = useCallback((recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    const now = new Date();
    let fine = 0;
    if (new Date(record.dueDate) < now) {
      const days = Math.ceil((now.getTime() - new Date(record.dueDate).getTime()) / 86400000);
      fine = Math.round(days * 50) / 100;
    }

    setRecords(prev => prev.map(r =>
      r.id === recordId ? { ...r, returnDate: now.toISOString(), status: "returned" as const, fine } : r
    ));
    updateBook(record.bookId, { status: "available" });

    const book = getBookById(record.bookId);
    const msg = `You returned "${book?.title || record.bookTitle}".${fine > 0 ? ` Late fee: $${fine.toFixed(2)}` : " Returned on time!"}`;
    addNotification(record.userId, "in-app", "✅ Book Returned", msg, true, "");

    const borrowUser = users.find(u => u.id === record.userId);
    if (borrowUser?.emailNotifications && borrowUser.email) {
      addNotification(record.userId, "email", "📧 Return Confirmation", `Email to ${borrowUser.email}`, true, borrowUser.email);
      sendEmailViaEmailJS(emailjsConfig, borrowUser.email, "LibraryHub - Book Returned", msg);
    }
    if (borrowUser?.smsNotifications && borrowUser.phone) {
      addNotification(record.userId, "sms", "📱 Return SMS", `SMS to ${borrowUser.phone}`, true, borrowUser.phone);
      sendSMSViaTextBelt(borrowUser.phone, msg);
    }
  }, [records, updateBook, getBookById, addNotification, users, emailjsConfig]);

  const getUserRecords = useCallback((userId: string) => records.filter(r => r.userId === userId), [records]);
  const getActiveRecordForBook = useCallback((bookId: string) => records.find(r => r.bookId === bookId && r.status !== "returned"), [records]);
  const getOverdueRecords = useCallback(() => records.filter(r => r.status === "overdue"), [records]);
  const totalFines = useCallback((userId: string) => records.filter(r => r.userId === userId && r.status !== "returned").reduce((s, r) => s + r.fine, 0), [records]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!user) return;
    setNotifications(prev => prev.map(n => n.userId === user.id ? { ...n, read: true } : n));
  }, [user]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    if (!user) return;
    setNotifications(prev => prev.filter(n => n.userId !== user.id));
  }, [user]);

  const updateEmailJSConfig = useCallback((config: EmailJSConfig) => setEmailjsConfig(config), []);

  const sendTestEmail = async (email: string) => {
    if (!emailjsConfig.enabled || !emailjsConfig.serviceId)
      return { sent: false, error: "EmailJS not configured. Go to Profile → Email Setup." };
    const sent = await sendEmailViaEmailJS(emailjsConfig, email, "LibraryHub Test", "✅ This is a test email from LibraryHub. Email notifications are working!");
    if (sent && user) addNotification(user.id, "email", "📧 Test Email Sent", `Delivered to ${email}`, true, email);
    return { sent, error: sent ? undefined : "Failed. Check your EmailJS Service ID, Template ID, and Public Key." };
  };

  const sendTestSMS = async (phone: string) => {
    if (!phone) return { sent: false, error: "No phone number provided." };
    const sent = await sendSMSViaTextBelt(phone, "LibraryHub test SMS! Notifications are working.");
    if (sent && user) addNotification(user.id, "sms", "📱 Test SMS Sent", `Delivered to ${phone}`, true, phone);
    return { sent, error: sent ? undefined : "Failed. TextBelt free tier allows 1 SMS/day. Try again tomorrow or use a different number." };
  };

  return (
    <BorrowContext.Provider value={{
      records, notifications, emailjsConfig, checkoutBook, returnBook,
      getUserRecords, getActiveRecordForBook, getOverdueRecords,
      markNotificationRead, markAllNotificationsRead, updateEmailJSConfig,
      sendTestEmail, sendTestSMS, unreadCount, deleteNotification,
      clearNotifications, totalFines
    }}>
      {children}
    </BorrowContext.Provider>
  );
}

export function useBorrow() {
  const ctx = useContext(BorrowContext);
  if (!ctx) throw new Error("useBorrow must be used within BorrowProvider");
  return ctx;
}
