"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useDarkMode } from "@/components/DarkModeContext";
import { Save, User, Loader2, Moon, Sun, LogOut } from "lucide-react"; 
import toast, { Toaster } from "react-hot-toast";
import { primaryGradient, secondaryColor, textColor, cardBg } from "@/theme/theme";

export default function SettingsPage() {
  const router = useRouter();
 
  const { darkMode, toggleDarkMode } = useDarkMode(); 
  const { data: session, status } = useSession();

 
  const [localUser, setLocalUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexusUser");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  
  const activeUser = useMemo(() => session?.user || localUser, [session, localUser]);

 
  const [name, setName] = useState(activeUser?.name || "");
  const [isSaving, setIsSaving] = useState(false);

 
  useEffect(() => {
    if (activeUser?.name && !name) {
      setName(activeUser.name);
    }
  }, [activeUser, name]);

  const isChecking = status === "loading";

  useEffect(() => {
  
    if (status === "unauthenticated" && !localUser) {
      router.push("/login");
    }
  }, [status, localUser, router]);

  const handleSave = async () => {
    if (!activeUser?.email) return;
    
    setIsSaving(true);
    const updateAction = async () => {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: activeUser.email }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

     
      if (localUser) {
        const updated = { ...localUser, name };
        localStorage.setItem("nexusUser", JSON.stringify(updated));
        setLocalUser(updated);
      }
      
      return res;
    };

    toast.promise(updateAction(), {
      loading: 'Saving changes...',
      success: 'Profile updated!',
      error: (err) => err.message,
    }, {
      style: {
        borderRadius: '16px',
        background: darkMode ? '#18181b' : '#fff',
        color: darkMode ? '#fff' : '#18181b',
        border: `1px solid ${darkMode ? '#27272a' : '#f4f4f5'}`,
        fontWeight: 'bold',
      },
      success: { iconTheme: { primary: '#0ea5e9', secondary: '#fff' } },
    }).finally(() => setIsSaving(false));
  };

  const handleSignOut = async () => {
    localStorage.removeItem("nexusUser");
    if (session) {
      await signOut({ callbackUrl: "/" });
    } else {
      router.push("/");
      router.refresh();
    }
  };

  if (isChecking) {
    return <div className="p-20 text-center font-bold opacity-50 italic">Verifying...</div>;
  }

  if (!activeUser) return null;

  return (
    <div className="w-full mx-auto p-8 space-y-8"  style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>
      <Toaster position="top-center" /> 

      {/*  APPEARANCE SECTION  */}
      <section className="p-8 rounded-3xl border max-w-5xl mx-auto"   style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
        <div className="flex items-center gap-3 mb-8 "  style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
          {darkMode ? <Moon size={24} /> : <Sun size={24} />}
          <h2 className="font-black uppercase tracking-widest text-sm"   style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>Appearance</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">Dark Mode</p>
            <p className="text-sm opacity-50">Toggle between light and dark themes.</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`w-14 h-8 rounded-full transition-all relative ${darkMode ? 'bg-sky-600' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </section>

      {/*  PROFILE SECTION  */}
      <section className={`p-8 rounded-3xl border max-w-7xl mx-auto ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center gap-3 mb-8 "  style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
          <User size={24} />
          <h2 className="font-black uppercase tracking-widest text-sm"   style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>Account Profile</h2>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold opacity-50 uppercase ml-1" style={{ color: darkMode ? textColor.dark : textColor.light }}>Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              className={`p-4 rounded-2xl border-2 outline-none transition-all font-bold ${
                darkMode ? 'bg-slate-800 border-white/5 focus:border-sky-500' : 'bg-slate-50 border-transparent focus:border-sky-500'
              }`}
              style={{ color: darkMode ? textColor.dark : textColor.light }}
            />
          </div>

          <div className="flex flex-col gap-1 opacity-50">
            <label className="text-xs font-bold uppercase ml-1" style={{ color: darkMode ? textColor.dark : textColor.light }}>Email Address</label>
            <p className="p-4 bg-transparent italic text-sm" style={{ color: darkMode ? textColor.dark : textColor.light }}>{activeUser?.email}</p>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center max-w-2xl mx-auto gap-2 bg-slate-500  hover:bg-gray-500 text-white p-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-gray-500/20"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isSaving ? "Updating Account..." : "Save Changes"}
          </button>
        </div>
      </section>

    
      <section className={`p-8 rounded-3xl border border-red-500/20 ${darkMode ? 'bg-red-500/5' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-red-500 font-black uppercase tracking-widest text-sm mb-1">Session Management</h2>
            <p className="text-sm opacity-60">Log out of your current session on this device.</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-500/20"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
}