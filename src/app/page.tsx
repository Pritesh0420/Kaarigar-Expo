"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard, { EventType } from "@/components/EventCard";
import { seedDatabase } from "@/lib/seedData";
import { ArrowRight, Sparkles, Map as MapIcon, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), limit(3));
        const snapshot = await getDocs(q);
        const evts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventType));
        setFeaturedEvents(evts);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSeed = async () => {
    toast.promise(seedDatabase(), {
      loading: "Seeding database...",
      success: "Database seeded successfully! Please refresh.",
      error: "Error seeding database."
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-orange-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Discover India's Finest Artisans</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6 leading-tight">
            Connecting Kaarigars to the World Through <span className="text-orange-600">Local Melas</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-10">
            Explore authentic handcrafted arts, register as an artisan to showcase your work, or discover upcoming cultural exhibitions near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/events" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-lg font-medium text-lg transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              Explore Melas
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/register" 
              className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-3.5 rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2"
            >
              Register as Kaarigar
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Upcoming Melas</h2>
              <p className="text-slate-600">Discover events happening around you.</p>
            </div>
            <Link href="/events" className="hidden sm:flex text-orange-600 font-medium hover:text-orange-700 items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-100 animate-pulse h-96 rounded-xl"></div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-slate-500 mb-4">No events found.</p>
              <button 
                onClick={handleSeed}
                className="bg-slate-900 text-white px-4 py-2 rounded shadow-sm hover:bg-slate-800 transition-colors"
              >
                Seed Mock Data
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Built for Artisans and Enthusiasts</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg"><Users className="w-6 h-6 text-orange-400" /></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Empowering Local Kaarigars</h3>
                    <p className="text-slate-400">Directly connect with stall organizers and apply to exhibit your unique crafts effortlessly.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg"><MapIcon className="w-6 h-6 text-orange-400" /></div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Interactive Expo Maps</h3>
                    <p className="text-slate-400">Locate venues instantly and discover participating artisan stalls through interactive maps.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <h3 className="text-xl font-bold mb-4">For Evaluators</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                This platform includes role-based dashboards. Feel free to use the Quick Login buttons on the login page to easily switch between Admin, Kaarigar, and Visitor accounts.
              </p>
              {featuredEvents.length > 0 && (
                <button 
                  onClick={handleSeed}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors border border-slate-600"
                >
                  Re-Seed Database
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
