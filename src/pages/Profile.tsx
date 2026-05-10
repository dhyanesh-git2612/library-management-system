import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBorrow } from "../contexts/BorrowContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { getUserRecords, totalFines, emailjsConfig, updateEmailJSConfig, sendTestEmail, sendTestSMS } = useBorrow();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [emailNotif, setEmailNotif] = useState(user?.emailNotifications ?? true);
  const [smsNotif, setSmsNotif] = useState(user?.smsNotifications ?? false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "email-setup" | "history">("info");

  // EmailJS form
  const [ejService, setEjService] = useState(emailjsConfig.serviceId);
  const [ejTemplate, setEjTemplate] = useState(emailjsConfig.templateId);
  const [ejPublic, setEjPublic] = useState(emailjsConfig.publicKey);
  const [ejEnabled, setEjEnabled] = useState(emailjsConfig.enabled);

  // Test results
  const [testEmailResult, setTestEmailResult] = useState<string>("");
  const [testSMSResult, setTestSMSResult] = useState<string>("");
  const [testing, setTesting] = useState(false);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl">🔒</span>
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Login Required</h1>
        <p className="text-gray-500 mt-2">Please log in to view your profile.</p>
      </div>
    );
  }

  const userRecords = getUserRecords(user.id);
  const activeRecords = userRecords.filter(r => r.status !== "returned");
  const returnedRecords = userRecords.filter(r => r.status === "returned");
  const fines = totalFines(user.id);

  const handleSave = () => {
    updateProfile({ name, email, phone, emailNotifications: emailNotif, smsNotifications: smsNotif });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveEmailJS = () => {
    updateEmailJSConfig({ serviceId: ejService, templateId: ejTemplate, publicKey: ejPublic, enabled: ejEnabled });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setTestEmailResult("Sending...");
    const result = await sendTestEmail(email);
    setTestEmailResult(result.sent ? "✅ Email sent successfully!" : `❌ ${result.error}`);
    setTesting(false);
  };

  const handleTestSMS = async () => {
    setTesting(true);
    setTestSMSResult("Sending...");
    const result = await sendTestSMS(phone);
    setTestSMSResult(result.sent ? "✅ SMS sent successfully!" : `❌ ${result.error}`);
    setTesting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">👤 My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account, notifications, and borrowing history</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* User Card */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
            {user.role === "librarian" ? "🔑" : "👤"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-amber-100 text-sm">{user.email}</p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{user.role === "librarian" ? "🔑 Librarian" : "👤 Member"}</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">📧 Email: {emailNotif ? "ON" : "OFF"}</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">📱 SMS: {smsNotif ? "ON" : "OFF"}</span>
            </div>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-2xl font-bold">{activeRecords.length}</p>
            <p className="text-xs text-amber-100">Active Borrows</p>
            {fines > 0 && (
              <>
                <p className="text-lg font-bold text-red-200 mt-1">${fines.toFixed(2)}</p>
                <p className="text-xs text-red-200">Outstanding Fines</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {([
          { id: "info", label: "📋 Personal Info" },
          { id: "email-setup", label: "📧 Email & SMS Setup" },
          { id: "history", label: "📖 Borrow History" },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id ? "bg-amber-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-amber-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Personal Info Tab */}
      {activeTab === "info" && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Edit Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-amber-500 outline-none transition-all"
                placeholder="+15551234567" />
              <p className="text-[10px] text-gray-400 mt-1">Include country code for SMS delivery</p>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                <span className="text-sm text-gray-700">📧 Email Notifications</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={smsNotif} onChange={e => setSmsNotif(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                <span className="text-sm text-gray-700">📱 SMS Notifications</span>
              </label>
            </div>
          </div>
          <button onClick={handleSave}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
            💾 Save Changes
          </button>
        </div>
      )}

      {/* Email/SMS Setup Tab */}
      {activeTab === "email-setup" && (
        <div className="space-y-6">
          {/* EmailJS Setup */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📧 EmailJS Setup (Real Email Delivery)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect your <a href="https://www.emailjs.com/" target="_blank" rel="noreferrer" className="text-amber-600 underline">EmailJS</a> account
              to send real emails. Free tier: 200 emails/month.
            </p>
            <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
              <p className="text-xs font-bold text-amber-800 mb-2">Setup Steps:</p>
              <ol className="text-xs text-amber-700 space-y-1 list-decimal pl-4">
                <li>Create a free account at <a href="https://www.emailjs.com/" target="_blank" rel="noreferrer" className="underline">emailjs.com</a></li>
                <li>Add an Email Service (Gmail, Outlook, etc.) → get <strong>Service ID</strong></li>
                <li>Create an Email Template with variables: <code className="bg-amber-100 px-1 rounded">{"{{to_email}}"}</code>, <code className="bg-amber-100 px-1 rounded">{"{{subject}}"}</code>, <code className="bg-amber-100 px-1 rounded">{"{{message}}"}</code></li>
                <li>Get your <strong>Public Key</strong> from Account → API Keys</li>
                <li>Fill in the fields below and enable</li>
              </ol>
            </div>
            <div className="grid gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Service ID</label>
                <input type="text" value={ejService} onChange={e => setEjService(e.target.value)} placeholder="service_abc123"
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 outline-none text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Template ID</label>
                <input type="text" value={ejTemplate} onChange={e => setEjTemplate(e.target.value)} placeholder="template_xyz789"
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 outline-none text-sm font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Public Key</label>
                <input type="text" value={ejPublic} onChange={e => setEjPublic(e.target.value)} placeholder="aB3cD4eF5gH6iJ7k"
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-amber-500 outline-none text-sm font-mono" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={ejEnabled} onChange={e => setEjEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600" />
                <span className="text-sm font-semibold text-gray-700">Enable EmailJS Email Delivery</span>
              </label>
              <div className="flex gap-3">
                <button onClick={handleSaveEmailJS}
                  className="px-5 py-2 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-700 transition-all">
                  Save Config
                </button>
                <button onClick={handleTestEmail} disabled={testing || !ejEnabled}
                  className="px-5 py-2 bg-blue-500 text-white rounded-xl font-semibold text-sm hover:bg-blue-600 transition-all disabled:opacity-40">
                  🧪 Send Test Email
                </button>
              </div>
              {testEmailResult && (
                <div className={`text-sm px-4 py-2 rounded-lg ${testEmailResult.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {testEmailResult}
                </div>
              )}
            </div>
          </div>

          {/* SMS Setup */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">📱 SMS Setup (Real SMS via TextBelt)</h3>
            <p className="text-sm text-gray-500 mb-4">
              SMS is powered by <a href="https://textbelt.com/" target="_blank" rel="noreferrer" className="text-amber-600 underline">TextBelt</a>.
              Free tier: 1 SMS per day. Set your phone number above to enable.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Current Phone:</strong> {phone || "Not set"} —{" "}
                {phone ? (
                  <button onClick={handleTestSMS} disabled={testing}
                    className="text-blue-800 font-semibold underline disabled:opacity-40">
                    🧪 Send Test SMS
                  </button>
                ) : (
                  "Set your phone number in Personal Info tab first."
                )}
              </p>
            </div>
            {testSMSResult && (
              <div className={`text-sm px-4 py-2 rounded-lg ${testSMSResult.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {testSMSResult}
              </div>
            )}
            <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-bold text-gray-600 mb-2">For higher SMS limits, use TextBelt with an API key:</p>
              <p className="text-xs text-gray-500">Visit <a href="https://textbelt.com/" target="_blank" rel="noreferrer" className="text-amber-600 underline">textbelt.com</a> →
                Purchase a key → Replace "textbelt" in the code with your key.</p>
            </div>
          </div>
        </div>
      )}

      {/* Borrow History Tab */}
      {activeTab === "history" && (
        <div className="space-y-6">
          {/* Active */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              📖 Active Borrows ({activeRecords.length})
            </h3>
            {activeRecords.length === 0 ? (
              <p className="text-gray-500 text-sm">No active borrows. Visit the catalog to check out books!</p>
            ) : (
              <div className="space-y-3">
                {activeRecords.map(r => (
                  <div key={r.id} className={`p-4 rounded-xl border-2 ${r.status === "overdue" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-800">{r.bookTitle}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Checked out: {new Date(r.checkoutDate).toLocaleDateString()} →
                          Due: <span className={r.status === "overdue" ? "text-red-600 font-bold" : "text-amber-700 font-semibold"}>
                            {new Date(r.dueDate).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        r.status === "overdue" ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"
                      }`}>
                        {r.status === "overdue" ? `⚠️ OVERDUE — $${r.fine.toFixed(2)} fine` : "📖 Active"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Returned */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ✅ Returned ({returnedRecords.length})
            </h3>
            {returnedRecords.length === 0 ? (
              <p className="text-gray-500 text-sm">No returned books yet.</p>
            ) : (
              <div className="space-y-2">
                {returnedRecords.map(r => (
                  <div key={r.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{r.bookTitle}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(r.checkoutDate).toLocaleDateString()} → {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    {r.fine > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">${r.fine.toFixed(2)} fine</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
              <p className="text-2xl font-bold text-amber-600">{userRecords.length}</p>
              <p className="text-xs text-gray-500">Total Borrows</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
              <p className="text-2xl font-bold text-emerald-600">{returnedRecords.length}</p>
              <p className="text-xs text-gray-500">Returned</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border text-center">
              <p className={`text-2xl font-bold ${fines > 0 ? "text-red-600" : "text-emerald-600"}`}>
                ${fines.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Fines</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
