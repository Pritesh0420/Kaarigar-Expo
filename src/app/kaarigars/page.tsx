"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { UserProfile } from "@/contexts/AuthContext";

export default function KaarigarsPage() {
  const [kaarigars, setKaarigars] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [craftFilter, setCraftFilter] = useState("All Crafts");

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "kaarigar"));
        const snap = await getDocs(q);
        setKaarigars(snap.docs.map(d => d.data() as UserProfile));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const crafts = ["All Crafts", ...Array.from(new Set(kaarigars.map(k => k.craftType).filter(Boolean)))];

  const filtered = kaarigars.filter(k => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = k.displayName.toLowerCase().includes(q) || (k.craftType || "").toLowerCase().includes(q) || (k.bio || "").toLowerCase().includes(q);
    const matchesCraft = craftFilter === "All Crafts" || k.craftType === craftFilter;
    return matchesSearch && matchesCraft;
  });

  return (
    <div className="bg-[#F5EFE6] min-h-screen pb-20">

      {/* Header */}
      <div className="bg-[#3D2B1F] earthy-texture py-14 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-2">Heritage Masters</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Meet India's Talented Kaarigars
          </h1>
          <p className="text-[#9C7B6A] text-lg max-w-2xl">
            Discover master weavers, terracotta sculptors, wood carvers, and brass inlay artisans preserving generational craftsmanship.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EAE0CF] mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9C7B6A]" />
            <input
              type="text"
              placeholder="Search kaarigars by name, craft, or bio..."
              className="w-full pl-12 pr-4 py-4 bg-[#F5EFE6] border border-[#EAE0CF] rounded-xl focus:ring-2 focus:ring-[#C4602A] focus:border-[#C4602A] outline-none text-[#3D2B1F] font-medium transition-all placeholder:text-[#9C7B6A]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-bold text-[#6B4C3B] mr-1 shrink-0 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" /> Filter Craft:
            </span>
            {crafts.map((craft) => {
              const count = craft === "All Crafts" ? kaarigars.length : kaarigars.filter(k => k.craftType === craft).length;
              return (
                <button
                  key={craft as string}
                  onClick={() => setCraftFilter(craft as string)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                    craftFilter === craft
                      ? "bg-[#3D2B1F] text-white border-[#3D2B1F]"
                      : "bg-white text-[#6B4C3B] border-[#EAE0CF] hover:border-[#C4602A]"
                  }`}
                >
                  {craft}
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white animate-pulse h-[420px] rounded-3xl border border-[#EAE0CF]" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(k => (
              <div key={k.uid} className="bg-white rounded-3xl p-7 shadow-sm border border-[#EAE0CF] flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#EAE0CF] mb-5 bg-[#EAE0CF] group-hover:border-[#C4602A] transition-colors">
                  <img
                    src={k.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(k.displayName)}&background=C4602A&color=fff&size=200`}
                    alt={k.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">{k.displayName}</h3>

                <div className="bg-[#F5EFE6] border border-[#EAE0CF] text-[#6B4C3B] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 mb-3">
                  🪡 {k.craftType || "Master Artisan"}
                </div>

                <div className="flex items-center text-sm text-[#9C7B6A] mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-[#C4602A]" />
                  <span>India</span>
                </div>

                <p className="text-sm text-[#6B4C3B] mb-6 line-clamp-3 leading-relaxed">
                  {k.bio || `Master ${k.craftType || "artisan"} dedicated to preserving traditional Indian art forms.`}
                </p>

                {/* Portfolio thumbnail */}
                <div className="mt-auto w-full h-32 rounded-xl overflow-hidden border border-[#EAE0CF]">
                  <img
                    src={k.photoUrl || `https://picsum.photos/seed/${k.uid}/400/200`}
                    alt="Portfolio"
                    onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${k.uid}/400/200`; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EAE0CF]">
            <p className="text-[#9C7B6A] text-lg">No Kaarigars found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
