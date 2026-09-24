"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (roleEmail: string, role: string) => {
    setLoading(true);
    try {
      try {
        await signInWithEmailAndPassword(auth, roleEmail, "password123");
      } catch (err: any) {
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-login-credentials") {
          // Create the user if they don't exist
          const userCredential = await createUserWithEmailAndPassword(auth, roleEmail, "password123");
          await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: roleEmail,
            role: role,
            displayName: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            createdAt: new Date().toISOString()
          });
        } else {
          throw err;
        }
      }
      toast.success(`Logged in as ${role}!`);
      router.push("/");
    } catch (error: any) {
      toast.error("Quick login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Sign in to manage your melas and applications
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <p className="text-sm text-center text-slate-600 mb-4 font-medium">Quick Assessment Logins (Auto-creates if missing)</p>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => quickLogin("admin@kaarigar.com", "admin")} className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded font-medium border border-slate-200 transition-colors">
              Login as Admin
            </button>
            <button onClick={() => quickLogin("artisan@kaarigar.com", "kaarigar")} className="text-sm bg-orange-50 hover:bg-orange-100 text-orange-800 py-2 rounded font-medium border border-orange-200 transition-colors">
              Login as Kaarigar (Artisan)
            </button>
            <button onClick={() => quickLogin("visitor@kaarigar.com", "visitor")} className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-800 py-2 rounded font-medium border border-blue-200 transition-colors">
              Login as Visitor
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600 mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
