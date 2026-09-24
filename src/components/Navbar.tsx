"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

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
    <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-600 tracking-tight">
          Kaarigar Expo
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/events" className="hover:text-orange-600 transition-colors">
            All Melas
          </Link>
          
          {!loading && (
            <>
              {userProfile ? (
                <div className="flex items-center gap-4 border-l pl-4 border-slate-300">
                  {userProfile.role === "admin" && (
                    <Link href="/admin/dashboard" className="hover:text-orange-600 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  {userProfile.role === "kaarigar" && (
                    <Link href="/kaarigar/dashboard" className="hover:text-orange-600 transition-colors">
                      Kaarigar Dashboard
                    </Link>
                  )}
                  {userProfile.role === "visitor" && (
                    <Link href="/visitor/my-rsvps" className="hover:text-orange-600 transition-colors">
                      My RSVPs
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                      {userProfile.role}
                    </span>
                    <button 
                      onClick={handleLogout}
                      className="text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="hover:text-orange-600 transition-colors">
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors shadow-sm"
                  >
                    Register
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
