import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBorrow } from "../contexts/BorrowContext";

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, clearNotifications, unreadCount } = useBorrow();
  const [filter, setFilter] = useState<"all" | "email" | "sms" | "in-app">("all");

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl">🔒</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Login Required</h1>
        <p className="text-gray-500 mt-2">Please log in to view notifications.</p>
      </div>
    );
  }

  const userNotifs = notifications.filter(n => n.userId === user.id);
  const filtered = filter === "all" ? userNotifs : userNotifs.filter(n => n.channel === filter);

  const channelIcon = (ch: string) => {
    if (ch === "email") return "📧";
    if (ch === "sms") return "📱";
    return "🔔";
  };

  const channelColor = (ch: string) => {
    if (ch === "email") return "bg-blue-50 border-blue-200";
    if (ch === "sms") return "bg-purple-50 border-purple-200";
    return "bg-amber-50 border-amber-200";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🔔 Notifications</h1>
          <p className="text-gray-500 mt-1">{unreadCount} unread — Email, SMS & in-app alerts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all">
            ✓ Mark All Read
          </button>
          <button onClick={clearNotifications}
            className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all">
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "in-app", "email", "sms"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f ? "bg-amber-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-amber-50"
            }`}>
            {f === "all" ? "🔔 All" : f === "in-app" ? "🔔 In-App" : f === "email" ? "📧 Email" : "📱 SMS"}
            <span className="ml-1 text-xs opacity-70">
              ({f === "all" ? userNotifs.length : userNotifs.filter(n => n.channel === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-6xl">📭</span>
          <p className="text-gray-500 mt-4 text-lg">No notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">Check out a book to receive your first notification!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id}
              className={`rounded-xl p-4 border-2 transition-all cursor-pointer ${
                n.read ? channelColor(n.channel) + " opacity-70" : channelColor(n.channel)
              } ${!n.read ? "ring-2 ring-amber-300/50" : ""}`}
              onClick={() => markNotificationRead(n.id)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{channelIcon(n.channel)}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{n.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.timestamp).toLocaleString()}
                      </span>
                      {n.recipient && (
                        <span className="text-[10px] bg-white/80 px-2 py-0.5 rounded-full text-gray-500">
                          → {n.recipient}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        n.delivered ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {n.delivered ? "✓ Delivered" : "⏳ Queued"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!n.read && <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />}
                  <button onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                    className="text-gray-400 hover:text-red-500 text-sm transition-colors">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info boxes */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-bold text-blue-800 text-sm mb-2">📧 About Email Notifications</h3>
          <p className="text-xs text-blue-700">
            Real emails are sent via <strong>EmailJS</strong> when configured. Go to{" "}
            <a href="#/profile" className="underline font-semibold">Profile → Email Setup</a> to connect your EmailJS account.
            Free tier includes 200 emails/month.
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <h3 className="font-bold text-purple-800 text-sm mb-2">📱 About SMS Notifications</h3>
          <p className="text-xs text-purple-700">
            Real SMS via <strong>TextBelt</strong>. Free tier: 1 SMS/day. Set your phone number with country code in{" "}
            <a href="#/profile" className="underline font-semibold">Profile</a>. For more, upgrade at textbelt.com.
          </p>
        </div>
      </div>
    </div>
  );
}
