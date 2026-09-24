"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ShieldCheck, Palette, Ticket, Eye, EyeOff, UserPlus } from "lucide-react";

const ROLES = [
  { id: "admin",    label: "Admin",    sub: "Platform / Organizer",  icon: <ShieldCheck className="w-5 h-5" />, color: "border-[#5B35A0] bg-[#F2EDFC] text-[#5B35A0]" },
  { id: "kaarigar", label: "Kaarigar", sub: "Artisan / Exhibitor",   icon: <Palette className="w-5 h-5" />,    color: "border-[#B5541B] bg-[#FDF0E8] text-[#B5541B]" },
  { id: "visitor",  label: "Visitor",  sub: "Attendee / Buyer",      icon: <Ticket className="w-5 h-5" />,     color: "border-[#1A6B45] bg-[#EBF7F0] text-[#1A6B45]" },
];

export default function Register() {
  const [role,     setRole]     = useState("kaarigar");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  
  // Kaarigar specific
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [craftType, setCraftType] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  
  // Visitor specific
  const [interests, setInterests] = useState("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match!"); return; }
    if (password.length < 6)  { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const uc = await createUserWithEmailAndPassword(auth, email, password);
      const payload: any = {
        uid: uc.user.uid,
        email,
        role,
        displayName: name,
        phone,
        createdAt: new Date().toISOString(),
      };
      
      if (role === "kaarigar") {
        payload.city = city;
        payload.state = state;
        payload.craftType = craftType;
        payload.bio = bio;
        payload.photoUrl = photoUrl;
      } else if (role === "visitor") {
        payload.interests = interests;
      }
      
      await setDoc(doc(db, "users", uc.user.uid), payload);
      toast.success("Account created! Welcome to Kaarigar Expo 🎉");
      
      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "kaarigar") router.push("/kaarigar/dashboard");
      else router.push("/visitor/my-rsvps");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedStyle = ROLES.find(r => r.id === role)?.color || "";

  return (
    <div className="min-h-screen bg-[#EEF4EF] flex">

      {/* ── LEFT PANEL — forest green, craft image ── */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden flex-col">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop"
            alt="Handicraft mela stalls"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B3020]/60 via-[#1A6B45]/70 to-[#0B3020]/90"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <div>
            <span className="text-3xl">🌿</span>
          </div>
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Join India's Premier Artisan Network
            </h2>
            <p className="text-green-200 text-sm mb-8 leading-relaxed">
              Connect with 50+ mela organizers, showcase your craft to millions of visitors, and grow your artisan business.
            </p>
            <div className="space-y-3">
              {["Free to register — no commission", "Get approved within 48 hours", "Dedicated artisan support team"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#4CAF7D] flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-white text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — registration form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Icon + Heading */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1A6B45] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#1A6B45]/30">
              <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-3xl font-black text-[#0B3020] tracking-tight mb-1">Create Your Account</h1>
            <p className="text-[#4A7B65] text-sm">Join India's premier handicraft and cultural exhibition platform</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-[#C8E6D4] p-7 md:p-9">
            {/* Role Selector */}
            <p className="text-sm font-bold text-[#0B3020] mb-3">I want to register as:</p>
            <div className="grid grid-cols-3 gap-3 mb-7">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex flex-col items-center gap-1.5 px-2 py-4 rounded-2xl border-2 transition-all text-center ${
                    role === r.id
                      ? r.color + " shadow-sm"
                      : "border-[#D8EDDF] bg-white text-[#4A7B65] hover:border-[#1A6B45]/50"
                  }`}
                >
                  {r.icon}
                  <span className="font-bold text-sm">{r.label}</span>
                  <span className="text-[10px] opacity-60 leading-tight">{r.sub}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0B3020] mb-2">Full Name <span className="text-[#B5541B]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radheshyam Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#0B3020] mb-2">Email Address <span className="text-[#B5541B]">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B3020] mb-2">Phone Number <span className="text-[#B5541B]">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                  />
                </div>
              </div>

              {role === "kaarigar" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0B3020] mb-2">City <span className="text-[#B5541B]">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jaipur"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#0B3020] mb-2">State <span className="text-[#B5541B]">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajasthan"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0B3020] mb-2">Primary Craft Specialization <span className="text-[#B5541B]">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Handloom & Weaving"
                      value={craftType}
                      onChange={(e) => setCraftType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0B3020] mb-2">Artisan Bio & Craft Heritage Description <span className="text-[#B5541B]">*</span></label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your craft lineage, traditional techniques..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0B3020] mb-2">Banner / Profile Image URL <span className="text-[#A0C4B2] font-normal">(Optional)</span></label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                    />
                  </div>
                </>
              )}

              {role === "visitor" && (
                <div>
                  <label className="block text-sm font-bold text-[#0B3020] mb-2">Areas of Interest <span className="text-[#B5541B]">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pottery, Handloom, Tribal Art"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#0B3020] mb-2">Password <span className="text-[#B5541B]">*</span></label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Min 6 chars (e.g. Mela#1)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A7B65]">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0B3020] mb-2">Confirm Password <span className="text-[#B5541B]">*</span></label>
                  <div className="relative">
                    <input
                      type={showCf ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-[#C8E6D4] bg-[#F4FAF6] focus:ring-2 focus:ring-[#1A6B45] focus:border-[#1A6B45] outline-none text-[#0B3020] placeholder:text-[#A0C4B2] transition-all"
                    />
                    <button type="button" onClick={() => setShowCf(!showCf)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A7B65]">
                      {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1A6B45] to-[#2E8B5C] hover:from-[#0B3020] hover:to-[#1A6B45] text-white py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-[#1A6B45]/30 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                <UserPlus className="w-5 h-5" />
                {loading ? "Creating account..." : `Register as ${ROLES.find(r => r.id === role)?.label}`}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-[#4A7B65] mt-6">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-[#1A6B45] hover:text-[#0B3020]">Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
