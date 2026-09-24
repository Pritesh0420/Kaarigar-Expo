"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, MapPin } from "lucide-react";
import { UserProfile } from "@/contexts/AuthContext";

export default function KaarigarsPage() {
  const [kaarigars, setKaarigars] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [craftFilter, setCraftFilter] = useState("All Crafts");

  useEffect(() => {
    const fetchKaarigars = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "kaarigar"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => doc.data() as UserProfile);
        setKaarigars(data);
      } catch (error) {
        console.error("Error fetching kaarigars", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKaarigars();
  }, []);

  const crafts = ["All Crafts", ...Array.from(new Set(kaarigars.map(k => k.craftType).filter(Boolean)))];

  const filtered = kaarigars.filter(k => {
    const matchesSearch = k.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (k.craftType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (k.bio || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCraft = craftFilter === "All Crafts" || k.craftType === craftFilter;
    return matchesSearch && matchesCraft;
  });

  return (
    <div className="bg-[#fbf9f4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold text-[#ddaf56] uppercase tracking-widest mb-2">Heritage Masters</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#192742] tracking-tight mb-4">
            Meet India’s Talented Kaarigars
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Discover master weavers, terracotta sculptors, wood carvers, and brass inlay artisans preserving generational craftsmanship.
          </p>
        </div>

        {/* Filters Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8e2d2] mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search kaarigars by name, craft, or bio..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#192742] outline-none text-slate-700 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm font-medium text-slate-500 mr-2 shrink-0">Filter Craft:</span>
            {crafts.map((craft, idx) => {
              const count = craft === "All Crafts" ? kaarigars.length : kaarigars.filter(k => k.craftType === craft).length;
              return (
                <button 
                  key={idx}
                  onClick={() => setCraftFilter(craft || "All Crafts")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors border ${
                    craftFilter === craft 
                      ? 'bg-[#192742] text-white border-[#192742]' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#192742]'
                  }`}
                >
                  {craft}
                  <span className={`text-xs ${craftFilter === craft ? 'text-slate-300' : 'text-slate-400'}`}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kaarigar Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white animate-pulse h-[400px] rounded-3xl border border-[#e8e2d2]"></div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(kaarigar => (
              <div key={kaarigar.uid} className="bg-white rounded-3xl p-6 shadow-sm border border-[#e8e2d2] flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#ddaf56]/20 mb-4 bg-slate-100">
                  <img 
                    src={kaarigar.photoUrl || `https://ui-avatars.com/api/?name=${kaarigar.displayName}&background=192742&color=fff&size=150`} 
                    alt={kaarigar.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-[#192742] mb-2">{kaarigar.displayName}</h3>
                
                <div className="bg-[#fbf9f4] border border-[#e8e2d2] text-slate-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 mb-4">
                  <span className="text-[#ddaf56]">✨</span> {kaarigar.craftType || "Master Artisan"}
                </div>
                
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-[#ddaf56]" />
                  <span>India</span> {/* Mock location since we don't store city for kaarigar in schema yet */}
                </div>
                
                <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                  {kaarigar.bio || `Master ${kaarigar.craftType || 'artisan'} dedicated to preserving traditional Indian art forms.`}
                </p>
                
                {/* Portfolio Image Mock */}
                <div className="mt-auto w-full h-32 rounded-xl overflow-hidden bg-slate-200">
                   <img 
                    src={`https://picsum.photos/seed/${kaarigar.uid}/400/200`} 
                    alt="Portfolio"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#e8e2d2]">
            <p className="text-slate-500 text-lg">No Kaarigars found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
