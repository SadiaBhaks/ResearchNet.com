"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"; 

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    
    const loginAction = async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      
      localStorage.setItem("nexusUser", JSON.stringify(data.user));
      
      router.push("/research");
      router.refresh();
      return data;
    };

    toast.promise(loginAction(), {
      loading: 'Authenticating...',
      success: 'Welcome back! 🔓',
      error: (err) => `${err.message}`,
    }, {
      style: {
        borderRadius: '16px',
        background: '#fff',
        color: '#18181b',
        border: '1px solid #f4f4f5',
        fontWeight: 'bold',
      },
      success: {
        iconTheme: {
          primary: '#2563eb', 
          secondary: '#fff',
        },
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      
      <Toaster position="top-center" /> 

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Log in to access your research library.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
            <input 
              type="email" required 
              className="w-full p-3 mt-1 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Password</label>
            <input 
              type="password" required 
              className="w-full p-3 mt-1 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}