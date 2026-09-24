"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard, { EventType } from "@/components/EventCard";
import { Search, Filter } from "lucide-react";

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
        const data = snap.docs.map((doc) => doc.data() as EventType);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const cities = ["All Cities", ...Array.from(new Set(events.map((e) => e.city)))];

  const filteredEvents = events.filter((e) => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCity = cityFilter === "All Cities" || e.city === cityFilter;
    
    let matchesStatus = true;
    if (statusFilter === "Active (Live & Upcoming)") {
      matchesStatus = e.status === "active" || e.status === "upcoming";
    } else if (statusFilter === "Live Now") {
      matchesStatus = e.status === "active";
    } else if (statusFilter === "Upcoming") {
      matchesStatus = e.status === "upcoming";
    } else if (statusFilter === "Past / Concluded") {
      matchesStatus = e.status === "past";
    }
    
    return matchesSearch && matchesCity && matchesStatus;
  });

  return (
    <div className="bg-[#fbf9f4] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold text-[#ddaf56] uppercase tracking-widest mb-2">Exhibition Schedule</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#192742] tracking-tight mb-4">
            Upcoming Melas & Exhibitions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Explore vibrant handicraft melas, master weaver showcases, and traditional art expos happening across India.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8e2d2] mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search melas by title, city, or craft..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-xl focus:ring-2 focus:ring-[#192742] focus:border-[#192742] outline-none text-slate-700 font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide mb-2">
            <span className="text-sm font-bold text-slate-700 mr-2 shrink-0">Event Timeline:</span>
            {["Active (Live & Upcoming)", "Live Now", "Upcoming", "Past / Concluded", "All Melas"].map((status) => {
              // Quick count calculation
              let count = events.length;
              if (status === "Active (Live & Upcoming)") count = events.filter(e => e.status === "active" || e.status === "upcoming").length;
              if (status === "Live Now") count = events.filter(e => e.status === "active").length;
              if (status === "Upcoming") count = events.filter(e => e.status === "upcoming").length;
              if (status === "Past / Concluded") count = events.filter(e => e.status === "past").length;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                    statusFilter === status
                      ? "bg-[#192742] text-white border-[#192742]"
                      : "bg-white text-slate-600 border-slate-300 hover:border-[#192742]"
                  }`}
                >
                  {status} <span className={statusFilter === status ? "text-slate-300" : "text-slate-400"}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* City Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-bold text-slate-700 mr-2 shrink-0 flex items-center gap-1.5">
              <Filter className="w-4 h-4" /> Filter City:
            </span>
            {cities.map((city) => {
              const count = city === "All Cities" ? events.length : events.filter(e => e.city === city).length;
              return (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                    cityFilter === city
                      ? "bg-[#192742] text-white border-[#192742]"
                      : "bg-white text-slate-600 border-slate-300 hover:border-[#192742]"
                  }`}
                >
                  {city} <span className={cityFilter === city ? "text-slate-300 text-xs" : "text-slate-400 text-xs"}>({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-[#e8e2d2] h-96 animate-pulse"></div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#e8e2d2]">
            <p className="text-slate-500 text-lg">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
