"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, getDocs, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  XCircle,
  Clock3,
  MapPin,
  TrendingUp,
  Activity,
  Search,
  RefreshCw,
} from "lucide-react";

type Tab = "overview" | "events" | "applications" | "rsvps";

export default function AdminDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [events, setEvents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", description: "", bannerUrl: "", locationName: "",
    city: "", lat: 0, lng: 0, startDate: "", endDate: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "admin")) {
      router.push("/");
    }
  }, [authLoading, userProfile, router]);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [eSnap, aSnap, rSnap] = await Promise.all([
        getDocs(collection(db, "events")),
        getDocs(collection(db, "applications")),
        getDocs(collection(db, "rsvps")),
      ]);
      setEvents(eSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setApplications(aSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setRsvps(rSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userProfile?.role === "admin") fetchData();
  }, [userProfile]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRef = doc(collection(db, "events"));
      const eventData = {
        id: newRef.id,
        ...newEvent,
        coordinates: { lat: Number(newEvent.lat), lng: Number(newEvent.lng) },
        createdBy: userProfile?.uid,
        status: "upcoming",
      };
      await setDoc(newRef, eventData);
      setEvents((prev) => [...prev, eventData]);
      setIsCreating(false);
      setNewEvent({ title: "", description: "", bannerUrl: "", locationName: "", city: "", lat: 0, lng: 0, startDate: "", endDate: "" });
      toast.success("Event created successfully!");
    } catch {
      toast.error("Failed to create event");
    }
  };

  const handleUpdateAppStatus = async (appId: string, status: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "applications", appId), { status });
      setApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, status } : a)));
      toast.success(`Application ${status}!`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const pendingApps = applications.filter((a) => a.status === "pending").length;
  const approvedApps = applications.filter((a) => a.status === "approved").length;

  const navItems: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "events", label: "Events", icon: <CalendarDays className="w-5 h-5" />, count: events.length },
    { id: "applications", label: "Applications", icon: <ClipboardList className="w-5 h-5" />, count: pendingApps || undefined },
    { id: "rsvps", label: "Visitor RSVPs", icon: <Users className="w-5 h-5" />, count: rsvps.length },
  ];

  const filteredApps = applications.filter((a) =>
    [a.kaarigarName, a.eventTitle, a.craftType].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredRsvps = rsvps.filter((r) =>
    [r.visitorName, r.visitorEmail, r.eventTitle].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredEvents = events.filter((ev) =>
    [ev.title, ev.city, ev.status].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#3D2B1F] flex items-center justify-center animate-pulse">
            <LayoutDashboard className="w-8 h-8 text-[#C4602A]" />
          </div>
          <p className="text-[#6B4C3B] font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] flex">

      {/* ── Sidebar ── */}
      <aside
        style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "16rem", zIndex: 20, paddingTop: "4rem" }}
        className="bg-[#3D2B1F] earthy-texture flex flex-col"
      >
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-1">Control Center</p>
          <h2 className="text-white font-bold text-lg leading-tight">Admin Dashboard</h2>
          <p className="text-[#9C7B6A] text-xs mt-1 truncate">{userProfile?.displayName || userProfile?.email}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-[#C4602A] text-white shadow-lg"
                  : "text-[#9C7B6A] hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={activeTab === item.id ? "text-white" : "text-[#9C7B6A] group-hover:text-white"}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeTab === item.id ? "bg-white/20 text-white" : "bg-[#C4602A]/20 text-[#C4602A]"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[#9C7B6A] text-xs mb-1">Platform Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white text-sm font-semibold">All Systems Normal</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-h-screen" style={{ marginLeft: "16rem" }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[#F5EFE6]/90 backdrop-blur-sm border-b border-[#EAE0CF] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#9C7B6A]">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#3D2B1F] font-semibold capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9C7B6A]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-[#EAE0CF] rounded-xl text-sm focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none w-56 text-[#3D2B1F]"
              />
            </div>
            <button
              onClick={() => fetchData(true)}
              className="p-2 bg-white border border-[#EAE0CF] rounded-xl hover:border-[#C4602A] transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 text-[#6B4C3B] ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        <div className="px-8 py-8">

          {/* ─────────── OVERVIEW ─────────── */}
          {activeTab === "overview" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#3D2B1F]">Good day, Admin! 👋</h1>
                <p className="text-[#9C7B6A] mt-1">Here&apos;s what&apos;s happening on Kaarigar Expo today.</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: "Total Events", value: events.length, icon: <CalendarDays className="w-6 h-6" />, bg: "bg-[#3D2B1F]", sub: `${events.filter(e => e.status === "upcoming").length} upcoming` },
                  { label: "Applications", value: applications.length, icon: <ClipboardList className="w-6 h-6" />, bg: "bg-[#C4602A]", sub: `${pendingApps} pending review` },
                  { label: "Total RSVPs", value: rsvps.length, icon: <Users className="w-6 h-6" />, bg: "bg-[#D4A96A]", sub: "Visitor registrations" },
                  { label: "Approved Artisans", value: approvedApps, icon: <TrendingUp className="w-6 h-6" />, bg: "bg-emerald-600", sub: "Ready to exhibit" },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.bg} rounded-2xl p-6 shadow-lg relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
                    <div className="text-white mb-4 opacity-80">{stat.icon}</div>
                    <p className="text-white text-4xl font-extrabold mb-1">{stat.value}</p>
                    <p className="text-white font-bold text-sm">{stat.label}</p>
                    <p className="text-white text-xs opacity-70 mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Applications */}
                <div className="bg-white rounded-2xl border border-[#EAE0CF] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <Activity className="w-5 h-5 text-[#C4602A]" />
                    <h3 className="font-bold text-[#3D2B1F] text-lg">Pending Applications</h3>
                    {pendingApps > 0 && (
                      <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">{pendingApps} need review</span>
                    )}
                  </div>
                  {applications.filter(a => a.status === "pending").slice(0, 4).length > 0 ? (
                    <div className="space-y-3">
                      {applications.filter(a => a.status === "pending").slice(0, 4).map(app => (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-[#F5EFE6] rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-[#3D2B1F]">{app.kaarigarName}</p>
                            <p className="text-xs text-[#9C7B6A]">{app.craftType} · {app.eventTitle}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateAppStatus(app.id, "approved")} className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleUpdateAppStatus(app.id, "rejected")} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#9C7B6A] text-sm text-center py-6">✓ All applications reviewed</p>
                  )}
                </div>

                {/* Recent Events */}
                <div className="bg-white rounded-2xl border border-[#EAE0CF] p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <CalendarDays className="w-5 h-5 text-[#C4602A]" />
                    <h3 className="font-bold text-[#3D2B1F] text-lg">Recent Events</h3>
                    <button onClick={() => setActiveTab("events")} className="ml-auto text-xs text-[#C4602A] font-semibold hover:underline">View all →</button>
                  </div>
                  {events.slice(0, 4).length > 0 ? (
                    <div className="space-y-3">
                      {events.slice(0, 4).map(ev => (
                        <div key={ev.id} className="flex items-center gap-3 p-3 bg-[#F5EFE6] rounded-xl">
                          <div className="w-10 h-10 rounded-lg bg-[#3D2B1F] flex items-center justify-center shrink-0">
                            <CalendarDays className="w-5 h-5 text-[#C4602A]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#3D2B1F] truncate">{ev.title}</p>
                            <div className="flex items-center gap-1 text-xs text-[#9C7B6A]">
                              <MapPin className="w-3 h-3" />
                              <span>{ev.city}</span>
                            </div>
                          </div>
                          <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            ev.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                            ev.status === "ongoing" ? "bg-emerald-100 text-emerald-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>{ev.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#9C7B6A] text-sm text-center py-6">No events yet. Create one!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─────────── EVENTS ─────────── */}
          {activeTab === "events" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#3D2B1F]">Manage Events</h1>
                  <p className="text-[#9C7B6A] mt-1">{events.length} events in the platform</p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 bg-[#C4602A] hover:bg-[#9E4B1F] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Create Event
                </button>
              </div>

              {/* Create Event Modal */}
              {isCreating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-[#EAE0CF] flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
                      <div>
                        <h3 className="text-xl font-bold text-[#3D2B1F]">Create New Event</h3>
                        <p className="text-sm text-[#9C7B6A]">Fill in the details for the new mela</p>
                      </div>
                      <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-[#F5EFE6] rounded-xl transition-colors">
                        <X className="w-5 h-5 text-[#6B4C3B]" />
                      </button>
                    </div>
                    <form onSubmit={handleCreateEvent} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {([ 
                        { label: "Event Title", key: "title", placeholder: "e.g. Jaipur Heritage Mela", col: 2 },
                        { label: "City", key: "city", placeholder: "e.g. Jaipur" },
                        { label: "Venue / Location Name", key: "locationName", placeholder: "e.g. Jawahar Kala Kendra" },
                        { label: "Banner Image URL", key: "bannerUrl", placeholder: "https://...", col: 2 },
                        { label: "Latitude", key: "lat", placeholder: "26.9124", type: "number" },
                        { label: "Longitude", key: "lng", placeholder: "75.7873", type: "number" },
                        { label: "Start Date", key: "startDate", type: "date" },
                        { label: "End Date", key: "endDate", type: "date" },
                      ] as { label: string; key: string; placeholder?: string; col?: number; type?: string }[]).map(({ label, key, placeholder, col, type }) => (
                        <div key={key} className={col === 2 ? "md:col-span-2" : ""}>
                          <label className="block text-xs font-bold text-[#6B4C3B] uppercase tracking-wider mb-1.5">{label}</label>
                          <input
                            required
                            type={type || "text"}
                            step={type === "number" ? "any" : undefined}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none transition-all placeholder:text-[#9C7B6A]"
                            onChange={(e) => {
                              const val = type === "date" ? new Date(e.target.value).toISOString() : e.target.value;
                              setNewEvent({ ...newEvent, [key]: type === "number" ? parseFloat(e.target.value) : val });
                            }}
                          />
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#6B4C3B] uppercase tracking-wider mb-1.5">Description</label>
                        <textarea
                          required rows={3}
                          placeholder="Describe the event, featured crafts, and highlights..."
                          className="w-full px-4 py-3 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl text-sm text-[#3D2B1F] focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none transition-all placeholder:text-[#9C7B6A] resize-none"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-3 border border-[#EAE0CF] text-[#6B4C3B] rounded-xl font-semibold text-sm hover:bg-[#F5EFE6] transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-[#C4602A] hover:bg-[#9E4B1F] text-white rounded-xl font-semibold text-sm transition-colors">Save Event</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F5EFE6] border-b border-[#EAE0CF]">
                        {["Event Title", "City", "Venue", "Status", "Start Date"].map(h => (
                          <th key={h} className="px-6 py-4 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6]">
                      {filteredEvents.length > 0 ? filteredEvents.map((ev) => (
                        <tr key={ev.id} className="hover:bg-[#F5EFE6]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#3D2B1F] flex items-center justify-center shrink-0">
                                <CalendarDays className="w-4 h-4 text-[#C4602A]" />
                              </div>
                              <span className="font-bold text-[#3D2B1F] text-sm">{ev.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#6B4C3B] font-medium">{ev.city}</td>
                          <td className="px-6 py-4 text-sm text-[#9C7B6A]">{ev.locationName}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                              ev.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                              ev.status === "ongoing" ? "bg-emerald-100 text-emerald-700" :
                              "bg-slate-100 text-slate-600"
                            }`}>{ev.status || "upcoming"}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9C7B6A]">
                            {ev.startDate ? new Date(ev.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="px-6 py-16 text-center text-[#9C7B6A]">No events found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────── APPLICATIONS ─────────── */}
          {activeTab === "applications" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#3D2B1F]">Kaarigar Applications</h1>
                <p className="text-[#9C7B6A] mt-1">{applications.length} total · {pendingApps} pending review</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Pending", count: applications.filter(a => a.status === "pending").length, cls: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-400" },
                  { label: "Approved", count: applications.filter(a => a.status === "approved").length, cls: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-400" },
                  { label: "Rejected", count: applications.filter(a => a.status === "rejected").length, cls: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-400" },
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl border p-5 ${s.cls}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                      <p className="text-xs font-bold uppercase tracking-wider">{s.label}</p>
                    </div>
                    <p className="text-3xl font-extrabold">{s.count}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F5EFE6] border-b border-[#EAE0CF]">
                        {["Artisan", "Craft Type", "Event Applied", "Status", "Actions"].map(h => (
                          <th key={h} className="px-6 py-4 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6]">
                      {filteredApps.length > 0 ? filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-[#F5EFE6]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.kaarigarName || "K")}&background=C4602A&color=fff&size=80`}
                                alt={app.kaarigarName}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                              <span className="font-bold text-[#3D2B1F] text-sm">{app.kaarigarName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs bg-[#F5EFE6] border border-[#EAE0CF] text-[#6B4C3B] font-bold px-3 py-1.5 rounded-full">
                              🪡 {app.craftType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#6B4C3B]">{app.eventTitle}</td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full w-fit ${
                              app.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                              app.status === "rejected" ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {app.status === "pending" ? <Clock3 className="w-3 h-3" /> :
                               app.status === "approved" ? <CheckCircle2 className="w-3 h-3" /> :
                               <XCircle className="w-3 h-3" />}
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {app.status === "pending" ? (
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdateAppStatus(app.id, "approved")} className="flex items-center gap-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                </button>
                                <button onClick={() => handleUpdateAppStatus(app.id, "rejected")} className="flex items-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                                  <XCircle className="w-3.5 h-3.5" /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-[#9C7B6A]">Decision made</span>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="px-6 py-16 text-center text-[#9C7B6A]">No applications found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─────────── RSVPs ─────────── */}
          {activeTab === "rsvps" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#3D2B1F]">Visitor RSVPs</h1>
                <p className="text-[#9C7B6A] mt-1">{rsvps.length} registrations across all events</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#EAE0CF] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#F5EFE6] border-b border-[#EAE0CF]">
                        {["Visitor", "Email", "Event", "RSVP Date"].map(h => (
                          <th key={h} className="px-6 py-4 text-xs font-bold text-[#6B4C3B] uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EFE6]">
                      {filteredRsvps.length > 0 ? filteredRsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-[#F5EFE6]/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rsvp.visitorName || "V")}&background=D4A96A&color=fff&size=80`}
                                alt={rsvp.visitorName}
                                className="w-9 h-9 rounded-full"
                              />
                              <span className="font-bold text-[#3D2B1F] text-sm">{rsvp.visitorName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9C7B6A]">{rsvp.visitorEmail}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#3D2B1F]">{rsvp.eventTitle}</td>
                          <td className="px-6 py-4 text-sm text-[#9C7B6A]">
                            {rsvp.rsvpDate ? new Date(rsvp.rsvpDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="px-6 py-16 text-center text-[#9C7B6A]">No RSVPs found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
