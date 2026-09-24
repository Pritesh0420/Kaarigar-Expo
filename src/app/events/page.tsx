"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard, { EventType } from "@/components/EventCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [statusFilter, setStatusFilter] = useState("Active (Live & Upcoming)");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("startDate", "asc"));
        const snap = await getDocs(q);
        setEvents(snap.docs.map((d) => d.data() as EventType));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const cities = ["All Cities", ...Array.from(new Set(events.map((e) => e.city)))];

  const getCount = (status: string) => {
    if (status === "Active (Live & Upcoming)") return events.filter(e => e.status === "active" || e.status === "upcoming").length;
    if (status === "Live Now") return events.filter(e => e.status === "active").length;
    if (status === "Upcoming") return events.filter(e => e.status === "upcoming").length;
    if (status === "Past / Concluded") return events.filter(e => e.status === "past").length;
    return events.length;
  };

  const filtered = events.filter((e) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
    const matchesCity = cityFilter === "All Cities" || e.city === cityFilter;
    let matchesStatus = true;
    if (statusFilter === "Active (Live & Upcoming)") matchesStatus = e.status === "active" || e.status === "upcoming";
    else if (statusFilter === "Live Now") matchesStatus = e.status === "active";
    else if (statusFilter === "Upcoming") matchesStatus = e.status === "upcoming";
    else if (statusFilter === "Past / Concluded") matchesStatus = e.status === "past";
    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div className="bg-[#F5EFE6] min-h-screen pb-20">
      
      {/* Header */}
      <div className="bg-[#3D2B1F] earthy-texture py-14 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-2">Exhibition Schedule</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Upcoming Melas & Exhibitions
          </h1>
          <p className="text-[#9C7B6A] text-lg max-w-2xl">
            Explore vibrant handicraft melas, master weaver showcases, and traditional art expos happening across India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAE0CF] mb-12">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C7B6A]" />
            <input
              type="text"
              placeholder="Search melas by title, city, or craft..."
              className="w-full pl-12 pr-4 py-4 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none text-[#3D2B1F] font-medium transition-all placeholder:text-[#9C7B6A]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Timeline filter pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-hide mb-3">
            <span className="text-sm font-bold text-[#6B4C3B] mr-1 shrink-0">Event Timeline:</span>
            {["Active (Live & Upcoming)", "Live Now", "Upcoming", "Past / Concluded", "All Melas"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                  statusFilter === s
                    ? "bg-[#3D2B1F] text-white border-[#3D2B1F]"
                    : "bg-white text-[#6B4C3B] border-[#EAE0CF] hover:border-[#C4602A]"
                }`}
              >
                {s}
                <span className={`text-xs ${statusFilter === s ? "text-[#9C7B6A]" : "text-[#9C7B6A]"}`}>({getCount(s)})</span>
              </button>
            ))}
          </div>

          {/* City filter pills */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-bold text-[#6B4C3B] mr-1 shrink-0 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" /> Filter City:
            </span>
            {cities.map((city) => {
              const count = city === "All Cities" ? events.length : events.filter(e => e.city === city).length;
              return (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                    cityFilter === city
                      ? "bg-[#3D2B1F] text-white border-[#3D2B1F]"
                      : "bg-white text-[#6B4C3B] border-[#EAE0CF] hover:border-[#C4602A]"
                  }`}
                >
                  {city} <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#EAE0CF] h-96 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EAE0CF]">
            <p className="text-[#9C7B6A] text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
