"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShieldCheck, Palette, Ticket, Eye, EyeOff, LogIn } from "lucide-react";

const ROLES = [
  { id: "admin",    label: "Admin",    sub: "Platform Administrator", icon: <ShieldCheck className="w-5 h-5" /> },
  { id: "kaarigar", label: "Kaarigar", sub: "Artisan / Exhibitor",   icon: <Palette className="w-5 h-5" /> },
  { id: "visitor",  label: "Visitor",  sub: "Event Attendee",        icon: <Ticket className="w-5 h-5" /> },
];

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("kaarigar");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      const userRole = userDoc.data()?.role || "visitor";
      toast.success("Welcome back!");
      if (userRole === "admin") router.push("/admin/dashboard");
      else if (userRole === "kaarigar") router.push("/kaarigar/dashboard");
      else router.push("/visitor/my-rsvps");
    } catch (err: any) {
      toast.error(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (roleId: string) => {
    const emailMap: Record<string, string> = {
      admin:    "admin@kaarigarexpo.in",
      kaarigar: "artisan@kaarigarexpo.in",
      visitor:  "visitor@kaarigarexpo.in",
    };
    const roleEmail = emailMap[roleId];
    setLoading(true);
    try {
      try {
        await signInWithEmailAndPassword(auth, roleEmail, "password123");
      } catch (err: any) {
        if (err.code?.includes("user-not-found") || err.code?.includes("invalid")) {
          const uc = await createUserWithEmailAndPassword(auth, roleEmail, "password123");
          await setDoc(doc(db, "users", uc.user.uid), {
            uid: uc.user.uid,
            email: roleEmail,
            role: roleId,
            displayName: `Demo ${roleId.charAt(0).toUpperCase() + roleId.slice(1)}`,
            createdAt: new Date().toISOString(),
          });
        } else throw err;
      }
      toast.success(`Signed in as ${roleId}!`);
      if (roleId === "admin") router.push("/admin/dashboard");
      else if (roleId === "kaarigar") router.push("/kaarigar/dashboard");
      else router.push("/visitor/my-rsvps");
    } catch (err: any) {
      toast.error("Quick login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.id === role)!;

  return (
    <div className="min-h-screen bg-[#0F1C2E] flex">

      {/* ── LEFT PANEL — craft photo backdrop ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=900&auto=format&fit=crop"
          alt="Artisan at a mela stall"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1C2E]/80 via-[#0F1C2E]/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 max-w-sm">
            <p className="text-3xl font-black leading-snug mb-3">
              "Every thread tells a story of <span className="text-[#E8A45C]">heritage</span>."
            </p>
            <p className="text-sm text-white/70">— Kaarigar Expo, 2026</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F7F2EC]">
        <div className="w-full max-w-md">

          {/* Icon + heading */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#E8A45C] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#E8A45C]/30">
              <span className="text-3xl">🏺</span>
            </div>
            <h1 className="text-3xl font-black text-[#2D1A0E] tracking-tight mb-1">Sign In to Kaarigar Expo</h1>
            <p className="text-[#9C7B6A] text-sm">Choose your role and log in to your portal</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col items-center gap-1.5 px-3 py-4 rounded-2xl border-2 transition-all text-center ${
                  role === r.id
                    ? "border-[#C4602A] bg-[#FDF0E8] text-[#C4602A] shadow-sm"
                    : "border-[#E8D5C0] bg-white text-[#6B4C3B] hover:border-[#C4602A]/50"
                }`}
              >
                {r.icon}
                <span className="font-bold text-sm leading-none">{r.label}</span>
                <span className="text-[10px] text-current opacity-60 leading-tight">{r.sub}</span>
              </button>
            ))}
          </div>

          {/* Role hint */}
          <div className="bg-[#FDF0E8] border border-[#F4C9AB] rounded-xl px-4 py-3 mb-6 flex items-start gap-2">
            <span className="text-lg shrink-0">✨</span>
            <p className="text-xs text-[#B5541B] font-medium leading-relaxed">
              {role === "admin"    && "Sign in to manage melas, review artisan applications, and oversee the platform."}
              {role === "kaarigar" && "Sign in to manage your artisan profile, apply to melas, and track your stall applications."}
              {role === "visitor"  && "Sign in to browse events, RSVP for melas, and access your visitor passes."}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-md border border-[#EAD8C5] p-7">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#4A2E1A] mb-2">
                  Email Address <span className="text-[#C4602A]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8D5C0] bg-[#FDFAF6] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none text-[#2D1A0E] placeholder:text-[#C4A882] transition-all"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-[#4A2E1A]">Password</label>
                  <button type="button" className="text-xs text-[#C4602A] hover:text-[#9E4B1F] font-semibold">Forgot Password?</button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-[#E8D5C0] bg-[#FDFAF6] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none text-[#2D1A0E] placeholder:text-[#C4A882] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9C7B6A] hover:text-[#C4602A] transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D1A0E] hover:bg-[#1a0e07] text-white py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <LogIn className="w-5 h-5" />
                {loading ? "Signing in..." : `Sign In as ${selectedRole.label}`}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#F0E6D6]">
              <p className="text-center text-xs text-[#9C7B6A] mb-3 font-semibold uppercase tracking-wider">Quick Demo Access</p>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => quickLogin(r.id)}
                    disabled={loading}
                    className="text-xs py-2 px-2 rounded-lg border border-[#EAD8C5] text-[#6B4C3B] hover:border-[#C4602A] hover:text-[#C4602A] hover:bg-[#FDF0E8] transition-all font-medium disabled:opacity-50"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-[#9C7B6A] mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-[#C4602A] hover:text-[#9E4B1F]">
              Register here →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
