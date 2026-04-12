"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; 
import toast, { Toaster } from "react-hot-toast"; 
import { Github, Chrome } from "lucide-react"; 

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loginAction = async () => {
      
      const res = await signIn("credentials", {
        redirect: false, 
        email: formData.email,
        password: formData.password,
      });

      
      if (res?.error) {
        throw new Error("Invalid email or password");
      }

      if (res?.ok) {
       
        router.push("/research");
        router.refresh(); 
      }
      
      return res;
    };

    toast.promise(loginAction(), {
      loading: 'Authenticating...',
      success: 'Welcome back! 🔓',
      error: (err) => `${err.message}`,
    }, {
      style: { 
        borderRadius: '16px', 
        fontWeight: 'bold',
        background: '#fff',
        color: '#18181b',
      },
    }).finally(() => setLoading(false));
  };

  const handleSocialLogin = (provider: string) => {
    signIn(provider, { callbackUrl: "/research" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Toaster position="top-center" /> 

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Log in to access your research library.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 p-3 border-2 border-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Chrome size={20} className="text-red-500" /> Google
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-2 p-3 border-2 border-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            <Github size={20} /> GitHub
          </button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Or continue with</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              autoComplete="email"
              className="w-full p-4 mt-1 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              required 
              autoComplete="current-password"
              className="w-full p-4 mt-1 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-slate-300 mt-4"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}