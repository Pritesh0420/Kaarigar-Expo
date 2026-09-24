"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Ticket,
  Clock,
  Search,
  User,
  Heart,
  Phone,
  Pencil,
  X,
} from "lucide-react";

export default function VisitorRSVPs() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ phone: "", interests: "" });

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "visitor")) {
      router.push("/");
    }
    if (userProfile) {
      setProfile({
        phone: userProfile.phone || "",
        interests: userProfile.interests || "",
      });
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    const fetchRSVPs = async () => {
      if (!userProfile) return;
      try {
        const q = query(collection(db, "rsvps"), where("visitorId", "==", userProfile.uid));
        const snap = await getDocs(q);

        const rsvpData = [];
        for (const rsvpDoc of snap.docs) {
          const rsvp = rsvpDoc.data();
          let eventDetails = null;
          if (rsvp.eventId) {
            const evSnap = await getDoc(doc(db, "events", rsvp.eventId));
            if (evSnap.exists()) {
              eventDetails = evSnap.data();
            }
          }
          rsvpData.push({ id: rsvpDoc.id, ...rsvp, eventDetails });
        }

        setRsvps(rsvpData);
      } catch (error) {
        console.error("Error fetching RSVPs", error);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) fetchRSVPs();
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      await updateDoc(doc(db, "users", userProfile.uid), profile);
      setIsEditing(false);
    } catch {
      // Ignore error for now or use toast if available
    }
  };

  const filtered = rsvps.filter((r) =>
    [r.eventTitle, r.eventDetails?.city, r.eventDetails?.locationName]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3D2B1F] flex items-center justify-center animate-pulse">
            <Ticket className="w-8 h-8 text-[#C4602A]" />
          </div>
          <p className="text-[#6B4C3B] font-medium">Loading your RSVPs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-20">

      {/* Hero Banner */}
      <div className="bg-[#3D2B1F] earthy-texture pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-2">Your Registrations</p>
          <h1 className="text-4xl font-extrabold text-white mb-2">My RSVPs 🎟️</h1>
          <p className="text-[#9C7B6A] text-lg max-w-xl">
            All the melas and artisan fairs you&apos;ve registered to attend. Get ready for an incredible cultural experience!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Profile Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#EAE0CF] shadow-sm overflow-hidden sticky top-24">
              <div className="bg-[#F5EFE6] px-6 pt-8 pb-6 text-center border-b border-[#EAE0CF]">
                <div className="relative inline-block mb-4">
                  <img
                    src={userProfile?.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.displayName || "V")}&background=1A6B45&color=fff&size=200`}
                    alt={userProfile?.displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <h2 className="text-xl font-extrabold text-[#3D2B1F]">{userProfile?.displayName}</h2>
                <p className="text-[#9C7B6A] text-sm">{userProfile?.email}</p>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider mb-1.5">
                        <Phone className="w-3.5 h-3.5" /> Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2.5 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] outline-none"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider mb-1.5">
                        <Heart className="w-3.5 h-3.5" /> Interests
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] outline-none"
                        value={profile.interests}
                        onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                        placeholder="e.g. Pottery, Handloom"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="submit" className="flex-1 bg-[#1A6B45] hover:bg-[#0B3020] text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
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
                      { icon: <Phone className="w-4 h-4 text-[#1A6B45]" />, label: "Phone", value: userProfile?.phone || "Not provided" },
                      { icon: <Heart className="w-4 h-4 text-[#1A6B45]" />, label: "Interests", value: userProfile?.interests || "Not specified" },
                      { icon: <User className="w-4 h-4 text-[#1A6B45]" />, label: "Role", value: "Visitor" },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 p-3 bg-[#F5EFE6] rounded-xl">
                        <div className="mt-0.5 shrink-0">{icon}</div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#9C7B6A] uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-sm font-semibold text-[#3D2B1F] truncate">{value}</p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-2 border border-[#EAE0CF] hover:border-[#1A6B45] text-[#6B4C3B] hover:text-[#1A6B45] py-2.5 rounded-xl font-semibold text-sm transition-all"
                    >
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── RSVPs Panel ─── */}
          <div className="lg:col-span-2">
            {/* Stats + Search bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* RSVP Count Card */}
          <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-sm px-6 py-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3D2B1F] rounded-xl flex items-center justify-center">
              <Ticket className="w-6 h-6 text-[#C4602A]" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#3D2B1F]">{rsvps.length}</p>
              <p className="text-xs font-bold text-[#9C7B6A] uppercase tracking-wider">Event{rsvps.length !== 1 ? "s" : ""} Registered</p>
            </div>
          </div>

          {/* Search */}
          {rsvps.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7B6A]" />
              <input
                type="text"
                placeholder="Search your RSVPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none transition-all placeholder:text-[#9C7B6A]"
              />
            </div>
          )}
        </div>

        {/* RSVP Cards */}
        {rsvps.length > 0 ? (
          filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((rsvp) => {
                const ev = rsvp.eventDetails;
                const isUpcoming = ev?.startDate && new Date(ev.startDate) > new Date();
                
                const updatedBanners: Record<string, string> = {
                  "event-1": "https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1200&auto=format&fit=crop",
                  "event-2": "https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=1200&auto=format&fit=crop",
                  "event-3": "https://images.unsplash.com/photo-1616706161242-f1d591350d1c?w=1200&auto=format&fit=crop",
                  "event-4": "https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=1200&auto=format&fit=crop",
                  "event-5": "https://images.unsplash.com/photo-1603030002297-85e206a2285a?w=1200&auto=format&fit=crop",
                };
                const banner = updatedBanners[rsvp.eventId] || ev?.bannerUrl || `https://picsum.photos/seed/${rsvp.eventId || rsvp.id}/800/400`;

                return (
                  <div
                    key={rsvp.id}
                    className="bg-white rounded-3xl border border-[#EAE0CF] shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {/* Banner */}
                    <div className="relative h-44 w-full overflow-hidden bg-[#EAE0CF]">
                      <img
                        src={banner}
                        alt={rsvp.eventTitle}
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${rsvp.eventId || rsvp.id}/800/400`;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
                          isUpcoming
                            ? "bg-emerald-500/90 text-white"
                            : "bg-[#3D2B1F]/80 text-[#D4A96A]"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming ? "bg-white animate-pulse" : "bg-[#D4A96A]"}`} />
                          {isUpcoming ? "Upcoming" : "Past Event"}
                        </span>
                      </div>
                      {/* RSVP Confirmed tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="flex items-center gap-1.5 text-xs font-bold bg-white/90 text-[#3D2B1F] px-3 py-1.5 rounded-full backdrop-blur-sm">
                          🎟️ RSVP Confirmed
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-extrabold text-[#3D2B1F] mb-3 leading-tight">
                        {rsvp.eventTitle}
                      </h3>

                      <div className="space-y-2 mb-5">
                        {ev?.startDate && (
                          <div className="flex items-center gap-2.5 text-sm text-[#6B4C3B]">
                            <div className="w-7 h-7 rounded-lg bg-[#F5EFE6] flex items-center justify-center shrink-0">
                              <Calendar className="w-3.5 h-3.5 text-[#C4602A]" />
                            </div>
                            <span className="font-medium">
                              {new Date(ev.startDate).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}

                        {ev?.locationName && (
                          <div className="flex items-center gap-2.5 text-sm text-[#6B4C3B]">
                            <div className="w-7 h-7 rounded-lg bg-[#F5EFE6] flex items-center justify-center shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-[#C4602A]" />
                            </div>
                            <span className="font-medium truncate">
                              {ev.locationName}{ev.city ? `, ${ev.city}` : ""}
                            </span>
                          </div>
                        )}

                        {rsvp.rsvpDate && (
                          <div className="flex items-center gap-2.5 text-sm text-[#9C7B6A]">
                            <div className="w-7 h-7 rounded-lg bg-[#F5EFE6] flex items-center justify-center shrink-0">
                              <Clock className="w-3.5 h-3.5 text-[#9C7B6A]" />
                            </div>
                            <span>
                              Registered on{" "}
                              {new Date(rsvp.rsvpDate).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/events/${rsvp.eventId}`}
                        className="mt-auto flex items-center justify-between bg-[#F5EFE6] hover:bg-[#3D2B1F] text-[#3D2B1F] hover:text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group/btn"
                      >
                        <span>View Event Details</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#EAE0CF]">
              <Search className="w-10 h-10 text-[#EAE0CF] mx-auto mb-4" />
              <p className="text-[#9C7B6A] font-medium">No RSVPs match your search.</p>
              <button onClick={() => setSearchTerm("")} className="mt-3 text-[#C4602A] text-sm font-semibold hover:underline">
                Clear search
              </button>
            </div>
          )
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-[#EAE0CF] shadow-sm">
            <div className="w-20 h-20 bg-[#F5EFE6] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#EAE0CF]">
              <Ticket className="w-10 h-10 text-[#9C7B6A]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#3D2B1F] mb-3">No RSVPs yet</h2>
            <p className="text-[#9C7B6A] mb-8 max-w-md mx-auto leading-relaxed">
              You haven&apos;t registered for any upcoming melas yet. Discover artisan fairs near you and experience India&apos;s rich craft heritage.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 bg-[#C4602A] hover:bg-[#9E4B1F] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-[#C4602A]/25"
            >
              <Calendar className="w-5 h-5" />
              Browse Events
            </Link>
          </div>
        )}

          </div>
        </div>
      </div>
    </div>
  );
}
