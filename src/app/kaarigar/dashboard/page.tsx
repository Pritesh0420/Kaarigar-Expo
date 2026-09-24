"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  User,
  Palette,
  Phone,
  FileText,
  CalendarDays,
  MapPin,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock3,
  Pencil,
  X,
  ExternalLink,
  Award,
} from "lucide-react";

export default function KaarigarDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ phone: "", craftType: "", bio: "" });

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "kaarigar")) {
      router.push("/");
    }
    if (userProfile) {
      setProfile({
        phone: userProfile.phone || "",
        craftType: userProfile.craftType || "",
        bio: userProfile.bio || "",
      });
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    const fetchApps = async () => {
      if (!userProfile) return;
      try {
        const q = query(collection(db, "applications"), where("kaarigarId", "==", userProfile.uid));
        const snap = await getDocs(q);
        setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching apps", error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) fetchApps();
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      await updateDoc(doc(db, "users", userProfile.uid), profile);
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const pendingCount = applications.filter((a) => a.status === "pending").length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3D2B1F] flex items-center justify-center animate-pulse">
            <Palette className="w-8 h-8 text-[#C4602A]" />
          </div>
          <p className="text-[#6B4C3B] font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-20">

      {/* Hero Banner */}
      <div className="bg-[#3D2B1F] earthy-texture pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-2">Artisan Workspace</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Welcome back, {userProfile?.displayName?.split(" ")[0] || "Kaarigar"}! 🪡
          </h1>
          <p className="text-[#9C7B6A] text-lg">
            Manage your profile, track event applications, and showcase your craft.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: "Total Applications", value: applications.length, icon: <ClipboardList className="w-5 h-5" />, bg: "bg-white", text: "text-[#3D2B1F]", sub: "Submitted to events" },
            { label: "Approved", value: approvedCount, icon: <CheckCircle2 className="w-5 h-5" />, bg: "bg-emerald-600", text: "text-white", sub: "Ready to exhibit" },
            { label: "Pending Review", value: pendingCount, icon: <Clock3 className="w-5 h-5" />, bg: "bg-[#C4602A]", text: "text-white", sub: "Awaiting admin decision" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 shadow-md border border-[#EAE0CF] flex items-center gap-4 relative overflow-hidden`}>
              <div className={`${s.text} opacity-80`}>{s.icon}</div>
              <div>
                <p className={`${s.text} text-3xl font-extrabold`}>{s.value}</p>
                <p className={`${s.text} text-sm font-bold`}>{s.label}</p>
                <p className={`${s.text} text-xs opacity-60`}>{s.sub}</p>
              </div>
              <div className="absolute right-0 top-0 w-20 h-20 rounded-full bg-black/5 translate-x-8 -translate-y-8" />
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Profile Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#EAE0CF] shadow-sm overflow-hidden sticky top-24">

              {/* Profile Header */}
              <div className="bg-[#F5EFE6] px-6 pt-8 pb-6 text-center border-b border-[#EAE0CF]">
                <div className="relative inline-block mb-4">
                  <img
                    src={userProfile?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || "K")}&background=C4602A&color=fff&size=200`}
                    alt={userProfile?.displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <h2 className="text-xl font-extrabold text-[#3D2B1F]">{userProfile?.displayName}</h2>
                <p className="text-[#9C7B6A] text-sm">{userProfile?.email}</p>
                {userProfile?.craftType && (
                  <div className="inline-flex items-center gap-1.5 bg-[#3D2B1F] text-white text-xs font-bold px-3 py-1.5 rounded-full mt-3">
                    <Award className="w-3.5 h-3.5 text-[#C4602A]" />
                    {userProfile.craftType}
                  </div>
                )}
              </div>

              {/* Profile Details / Edit Form */}
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider mb-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2.5 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none transition-all"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider mb-1.5">
                        <Palette className="w-3.5 h-3.5" /> Craft Type
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none transition-all"
                        value={profile.craftType}
                        onChange={(e) => setProfile({ ...profile, craftType: e.target.value })}
                        placeholder="e.g. Pottery, Handloom"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider mb-1.5">
                        <FileText className="w-3.5 h-3.5" /> Bio
                      </label>
                      <textarea
                        className="w-full px-4 py-2.5 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none transition-all resize-none"
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Tell the world about your craft..."
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className="flex-1 bg-[#C4602A] hover:bg-[#9E4B1F] text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
                        Save Changes
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="p-2.5 border border-[#EAE0CF] text-[#6B4C3B] rounded-xl hover:bg-[#F5EFE6] transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {[
                      { icon: <Phone className="w-4 h-4 text-[#C4602A]" />, label: "Phone", value: userProfile?.phone || "Not provided" },
                      { icon: <Palette className="w-4 h-4 text-[#C4602A]" />, label: "Craft Type", value: userProfile?.craftType || "Not specified" },
                      { icon: <User className="w-4 h-4 text-[#C4602A]" />, label: "Role", value: "Kaarigar" },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 p-3 bg-[#F5EFE6] rounded-xl">
                        <div className="mt-0.5 shrink-0">{icon}</div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#9C7B6A] uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-sm font-semibold text-[#3D2B1F] truncate">{value}</p>
                        </div>
                      </div>
                    ))}

                    {userProfile?.bio && (
                      <div className="p-3 bg-[#F5EFE6] rounded-xl">
                        <p className="text-xs font-bold text-[#9C7B6A] uppercase tracking-wider mb-1.5">Bio</p>
                        <p className="text-sm text-[#6B4C3B] leading-relaxed line-clamp-4">{userProfile.bio}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-2 border border-[#EAE0CF] hover:border-[#C4602A] text-[#6B4C3B] hover:text-[#C4602A] py-2.5 rounded-xl font-semibold text-sm transition-all"
                    >
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Applications Panel ─── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-[#EAE0CF] shadow-sm p-7">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-xl font-extrabold text-[#3D2B1F]">My Event Applications</h2>
                  <p className="text-sm text-[#9C7B6A] mt-0.5">{applications.length} application{applications.length !== 1 ? "s" : ""} submitted</p>
                </div>
                <button
                  onClick={() => router.push("/events")}
                  className="flex items-center gap-2 bg-[#3D2B1F] hover:bg-[#5a3f2e] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Find Melas
                </button>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border border-[#EAE0CF] rounded-2xl p-5 hover:border-[#C4602A] hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          {/* Event Icon */}
                          <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] border border-[#EAE0CF] flex items-center justify-center shrink-0 group-hover:bg-[#3D2B1F] transition-colors">
                            <CalendarDays className="w-5 h-5 text-[#C4602A]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-[#3D2B1F] text-base truncate">{app.eventTitle}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5">
                              {app.craftType && (
                                <span className="flex items-center gap-1 text-xs text-[#9C7B6A]">
                                  <Palette className="w-3 h-3 text-[#C4602A]" />
                                  {app.craftType}
                                </span>
                              )}
                              {app.city && (
                                <span className="flex items-center gap-1 text-xs text-[#9C7B6A]">
                                  <MapPin className="w-3 h-3 text-[#C4602A]" />
                                  {app.city}
                                </span>
                              )}
                              <span className="text-xs text-[#9C7B6A]">
                                Applied:{" "}
                                {app.appliedAt
                                  ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                                  : "—"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                            app.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {app.status === "approved" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : app.status === "rejected" ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Clock3 className="w-3.5 h-3.5" />
                            )}
                            <span className="capitalize">{app.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Status Message */}
                      {app.status === "approved" && (
                        <div className="mt-3 pt-3 border-t border-[#EAE0CF] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <p className="text-xs text-emerald-700 font-medium">
                            Congratulations! Your application has been approved. Get ready to exhibit your craft!
                          </p>
                        </div>
                      )}
                      {app.status === "rejected" && (
                        <div className="mt-3 pt-3 border-t border-[#EAE0CF] flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <p className="text-xs text-red-600 font-medium">
                            This application was not selected. Keep applying to other events!
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#F5EFE6] rounded-2xl border border-dashed border-[#EAE0CF]">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#EAE0CF]">
                    <ClipboardList className="w-8 h-8 text-[#9C7B6A]" />
                  </div>
                  <h3 className="font-bold text-[#3D2B1F] text-lg mb-2">No applications yet</h3>
                  <p className="text-[#9C7B6A] text-sm mb-6 max-w-xs mx-auto">
                    Discover upcoming melas and apply to showcase your craft to thousands of visitors.
                  </p>
                  <button
                    onClick={() => router.push("/events")}
                    className="inline-flex items-center gap-2 bg-[#C4602A] hover:bg-[#9E4B1F] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-[#C4602A]/25"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Browse Events
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

