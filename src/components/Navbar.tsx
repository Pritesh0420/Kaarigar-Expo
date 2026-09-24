"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { LogIn, UserPlus, LogOut, Flame } from "lucide-react";

export default function Navbar() {
  const { userProfile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="bg-[#3D2B1F] border-b border-[#6B4C3B]/30 px-4 py-0 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#C4602A] rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold text-[#F5EFE6] tracking-tight">
            Kaarigar Expo
          </span>
          <span className="bg-[#C4602A] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Mela
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {[
            { href: "/", label: "Home" },
            { href: "/events", label: "Upcoming Melas" },
            { href: "/kaarigars", label: "Kaarigars" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-1.5 rounded-lg text-[#EAE0CF] hover:text-white hover:bg-[#6B4C3B]/40 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3 text-sm font-medium">
          {!loading && (
            <>
              {userProfile ? (
                <div className="flex items-center gap-3">
                  {userProfile.role === "admin" && (
                    <Link href="/admin/dashboard" className="text-[#D4A96A] hover:text-white font-semibold transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  {userProfile.role === "kaarigar" && (
                    <Link href="/kaarigar/dashboard" className="text-[#D4A96A] hover:text-white font-semibold transition-colors">
                      Dashboard
                    </Link>
                  )}
                  {userProfile.role === "visitor" && (
                    <Link href="/visitor/my-rsvps" className="text-[#D4A96A] hover:text-white font-semibold transition-colors">
                      My RSVPs
                    </Link>
                  )}
                  
                  {/* Display User Name */}
                  <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#6B4C3B]/50 ml-1">
                    <div className="w-6 h-6 rounded-full bg-[#C4602A] text-white flex items-center justify-center text-xs font-bold">
                      {(userProfile.displayName || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[#F5EFE6] text-sm font-medium mr-2">
                      {userProfile.displayName || "User"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-[#9C7B6A] hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 border border-[#9C7B6A] text-[#EAE0CF] px-4 py-2 rounded-lg font-semibold hover:bg-[#6B4C3B]/40 hover:border-[#D4A96A] transition-all"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 bg-[#C4602A] hover:bg-[#9E4B1F] text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" /> Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
