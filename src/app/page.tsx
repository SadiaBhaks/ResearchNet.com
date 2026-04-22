"use client";

import { useDarkMode } from "@/components/DarkModeContext";
import { primaryGradient, secondaryColor, textColor, cardBg } from "@/theme/theme";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Github, Chrome, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import CountUp from "react-countup";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function Homepage() {
  const { darkMode } = useDarkMode();
  const card = darkMode ? cardBg.dark : cardBg.light;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const hasShownToast = useRef(false);
  useEffect(() => {
    if (status === "authenticated" && !hasShownToast.current) {
      toast.success(`Welcome back, ${session?.user?.name || 'Researcher'}! `, {
        style: {
          borderRadius: '16px',
          background: darkMode ? '#18181b' : '#fff',
          color: darkMode ? '#fff' : '#18181b',
          border: `1px solid ${darkMode ? '#27272a' : '#f4f4f5'}`,
          fontWeight: 'bold',
        },
      });
      hasShownToast.current = true;
    }
  }, [status, session, darkMode]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const registerAction = async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.refresh();
      router.push("/login");
      return data;
    };

    toast.promise(registerAction(), {
      loading: 'Creating your research account...',
      success: 'Welcome to ResearchNet! kindly Login before using notes or settings. ',
      error: (err) => `${err.message}`,
    }, {
      style: {
        borderRadius: '16px',
        background: darkMode ? '#18181b' : '#fff',
        color: darkMode ? '#fff' : '#18181b',
        border: `1px solid ${darkMode ? '#27272a' : '#f4f4f5'}`,
        fontWeight: 'bold',
      },
      success: {
        iconTheme: {
          primary: '#0ea5e9',
          secondary: '#fff',
        },
      },
    }).finally(() => {
      setLoading(false);
    });
  };

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 }
  };

  return (

    <main className="overflow-hidden">

      <Toaster position="top-center" />

      {/* HERO SECTION */}
      <section

        className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2"
        style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}
      >

        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-40 bg-blue-500"></div>
        <div className="absolute top-60 right-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-30 bg-purple-500"></div>

        {/* LEFT SIDE */}
        <div className="max-w-5xl mx-auto px-10 py-20 flex flex-col justify-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-tight"
            style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}
          >
            Discover
            <span className="block">Research</span>
            <span className="block">That Matters</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg max-w-xl leading-relaxed"
            style={{ color: darkMode ? textColor.dark : textColor.light }}
          >
            Stop just reading papers—start building a library of insights.
            ResearchNet analyzes citation trends and feasibility in real-time.
            <span className="block mt-6"> <b className="text-xl">Search. Analyze. Annotate.</b> </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          />
        </div>

        
        <div className="flex items-center justify-center p-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            {status === "authenticated" ? (
            
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/20 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-500/20 rounded-full">
                    <UserCheck size={48} className="text-blue-500" />
                  </div>
                </div>
                <h2 className="text-3xl font-black mb-2" style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
                  Welcome Back!
                </h2>
                <p className="mb-8 opacity-70" style={{ color: darkMode ? textColor.dark : textColor.light }}>
                  You are logged in as <br />
                  <span className="font-bold text-blue-500">{session?.user?.email}</span>
                </p>

                <button
                  onClick={() => router.push("/research")}
                  className={`group flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  Go to Discovery Hub <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
             
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20">
                <h1 className="text-black dark:text-white text-2xl text-center m-2 font-black">Register Here</h1>
                <p className="text-sm text-center text-gray-500 dark:text-zinc-400 mb-8">
                  Create your free research account.
                </p>

                {/* SOCIAL LOGIN */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => signIn("google")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border bg-white hover:scale-105 transition"
                  >
                    <Chrome size={16} className="text-red-500 " />
                    Google
                  </button>
                  <button
                    onClick={() => signIn("github")}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border bg-white hover:scale-105 transition"
                  >
                    <Github size={16} />
                    GitHub
                  </button>
                </div>

                <div className="relative flex items-center mb-6">
                  <div className="flex-grow border-t"></div>
                  <span className="mx-3 text-xs opacity-50">or</span>
                  <div className="flex-grow border-t"></div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">

                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full p-3 rounded-xl bg-gray-300  border focus:ring-2"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />

                  <input
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full p-3 rounded-xl bg-gray-300  border focus:ring-2 "
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <input
                    type="password"
                    required
                    placeholder="Password"
                    className="w-full p-3 rounded-xl bg-gray-300  border focus:ring-2 "
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />

                  {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white transition ${darkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >

                    {loading ? "Creating Account..." : "Create Free Account"}

                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Login here!{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className={`font-bold hover:underline ${darkMode ? 'text-purple-600' : 'text-blue-600'
                      }`}
                  >
                    Log in
                  </button>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* MOVING KEYWORD TICKER */}
      <section className="py-20 overflow-hidden">
        <div className="relative">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex whitespace-nowrap text-4xl font-black opacity-20 gap-16"
          >
            <span>AI</span>
            <span>Machine Learning</span>
            <span>Quantum Computing</span>
            <span>NLP</span>
            <span>Computer Vision</span>
            <span>Bioinformatics</span>
            <span>Graph Theory</span>
            <span>Data Mining</span>

            <span>AI</span>
            <span>Machine Learning</span>
            <span>Quantum Computing</span>
            <span>NLP</span>
            <span>Computer Vision</span>
            <span>Bioinformatics</span>
            <span>Graph Theory</span>
            <span>Data Mining</span>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-32 px-6 overflow-hidden"
        style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>

        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[150px] animate-floatSlow"></div>
        <div className="absolute bottom-10 right-0 w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[120px] animate-floatSlow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent dark:via-purple-900/10"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:30px_30px]"></div>

        <div className="relative max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`text-4xl md:text-5xl font-black text-center mb-24  ${darkMode ? 'text-white' : 'text-gray-600 '
              }`}
          >
            Powerful <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Research Tools</span>
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            className="grid md:grid-cols-3 gap-10"
          >
            {[
              { title: "Smart Paper Search", desc: "Find relevant research instantly with real-time indexing.", icon: "🔎" },
              { title: "Citation Trend Analysis", desc: "Understand research impact through citation velocity.", icon: "📈" },
              { title: "Research Annotation", desc: "Build your own knowledge base of insights.", icon: "📝" }
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={cardAnim}
                whileHover={{ y: -12, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="group relative p-10 rounded-3xl backdrop-blur-xl border border-white/20 bg-white/30 dark:bg-white/5 shadow-2xl overflow-hidden cursor-pointer transition-all"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"></div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 3 + i }}
                  className="text-5xl mb-6 relative z-10"
                >
                  {f.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{f.title}</h3>
                <p className="opacity-70 text-sm relative z-10">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-36 overflow-hidden" style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/20 blur-[180px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[160px] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black text-center mb-24"
            style={{ color: darkMode ? textColor.dark : textColor.light }}
          >
            Research Impact in Numbers
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.25 } }
            }}
            className="grid md:grid-cols-3 gap-10"
          >
            {[
              { number: 50000000, label: "Research Papers Indexed" },
              { number: 120000, label: "Researchers" },
              { number: 10000000, label: "Citations Tracked" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                whileHover={{ y: -8, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="group relative p-12 rounded-3xl backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-white/20 shadow-xl overflow-hidden text-center"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent relative z-10">
                  <CountUp
                    end={stat.number}
                    duration={2}
                    separator=","
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  {stat.number >= 1000000 && "+"}
                </h2>
                <p className="opacity-70 mt-4 text-lg relative z-10">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-40 text-center overflow-hidden" style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-blue-500/20 blur-[180px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[160px] opacity-30"></div>

        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-black mb-30"
            style={{ color: darkMode ? textColor.dark : textColor.light }}
          >
            Start Discovering Research Today
          </motion.h2>

          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mt-16"
          >
            <Link
              href="/research"
              className="rounded-2xl font-bold text-lg text-white transition relative inline-flex items-center"
              style={{
                backgroundColor: card.backgroundColor,
                border: card.border,
                backdropFilter: card.backdropFilter,
                borderRadius: card.borderRadius,
                padding: "2rem",
                boxShadow: card.shadow,
                color: darkMode ? textColor.dark : textColor.light,
              }}
            >
              Explore Research{" "}
              <motion.span
                className="ml-3 text-4xl"
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}