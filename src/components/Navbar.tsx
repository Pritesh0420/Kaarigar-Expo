"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { LogIn, UserPlus, UserCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const { userProfile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-[#192742] tracking-tight">
            Kaarigar Expo
          </span>
          <span className="bg-[#ddaf56] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            Mela
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#192742]">
          <Link href="/" className="hover:text-[#ddaf56] transition-colors pb-1 border-b-2 border-transparent hover:border-[#ddaf56]">Home</Link>
          <Link href="/events" className="hover:text-[#ddaf56] transition-colors pb-1 border-b-2 border-transparent hover:border-[#ddaf56]">Upcoming Melas</Link>
          <Link href="/kaarigars" className="hover:text-[#ddaf56] transition-colors pb-1 border-b-2 border-transparent hover:border-[#ddaf56]">Kaarigars</Link>
          <Link href="/about" className="hover:text-[#ddaf56] transition-colors pb-1 border-b-2 border-transparent hover:border-[#ddaf56]">About</Link>
          <Link href="/contact" className="hover:text-[#ddaf56] transition-colors pb-1 border-b-2 border-transparent hover:border-[#ddaf56]">Contact</Link>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {!loading && (
            <>
              {userProfile ? (
                <div className="flex items-center gap-4">
                  {userProfile.role === "admin" && (
                    <Link href="/admin/dashboard" className="text-[#192742] hover:text-[#ddaf56] font-semibold">Admin</Link>
                  )}
                  {userProfile.role === "kaarigar" && (
                    <Link href="/kaarigar/dashboard" className="text-[#192742] hover:text-[#ddaf56] font-semibold">Dashboard</Link>
                  )}
                  {userProfile.role === "visitor" && (
                    <Link href="/visitor/my-rsvps" className="text-[#192742] hover:text-[#ddaf56] font-semibold">My RSVPs</Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/login" 
                    className="flex items-center gap-2 border-2 border-[#192742] text-[#192742] px-4 py-2 rounded font-semibold hover:bg-[#192742] hover:text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="flex items-center gap-2 bg-[#192742] text-white px-4 py-2 rounded font-semibold hover:bg-[#111a2e] transition-colors shadow-sm"
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
