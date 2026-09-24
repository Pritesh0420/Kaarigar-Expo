"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard, { EventType } from "@/components/EventCard";
import { ArrowRight, Star, Heart, Map, ShieldCheck, ChevronRight, ChevronLeft } from "lucide-react";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<EventType[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("status", "in", ["upcoming", "active"]),
          limit(3)
        );
        const snap = await getDocs(q);
        setFeaturedEvents(snap.docs.map((d) => d.data() as EventType));
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#F5EFE6] w-full">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#3D2B1F] earthy-texture">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C4602A] rounded-full opacity-10 blur-[120px] translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4A96A] rounded-full opacity-10 blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 border border-[#D4A96A]/60 text-[#D4A96A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              🏺 National Mela Registration & Artisan Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
              Celebrating India's <span className="text-[#C4602A]">Artisans</span>,<br />Crafts & Culture
            </h1>
            <p className="text-lg text-[#9C7B6A] mb-10 leading-relaxed max-w-xl">
              Discover authentic local craftsmanship, meet talented master kaarigars, and experience vibrant handicraft exhibitions across India.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/events"
                className="bg-[#C4602A] hover:bg-[#9E4B1F] text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-[#C4602A]/30"
              >
                <Map className="w-5 h-5" /> Explore Melas
              </Link>
              <Link
                href="/register"
                className="border border-[#6B4C3B] hover:border-[#D4A96A] text-[#EAE0CF] hover:text-[#D4A96A] px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Register as Kaarigar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 hidden md:block">
            <div className="relative w-full h-[420px] rounded-3xl overflow-hidden border border-[#6B4C3B]/60 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1635205411959-a27e5f9bba33?w=900&auto=format&fit=crop"
                alt="Artisan at mela stall"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&auto=format&fit=crop"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/90 via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-1">Heritage Weaves & Handloom</h3>
                <p className="text-[#9C7B6A] text-sm">Authentic artisan textiles from across India</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-8 h-1 bg-[#C4602A] rounded-full"></div>
                  <div className="w-2 h-1 bg-white/30 rounded-full"></div>
                  <div className="w-2 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 w-9 h-9 rounded-full bg-[#3D2B1F]/60 backdrop-blur flex items-center justify-center text-white border border-white/10">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 w-9 h-9 rounded-full bg-[#3D2B1F]/60 backdrop-blur flex items-center justify-center text-white border border-white/10">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING MELAS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-2">Live & Upcoming Events</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D2B1F] tracking-tight">
              Upcoming Melas & Exhibitions
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 border-2 border-[#3D2B1F] text-[#3D2B1F] font-semibold rounded-xl hover:bg-[#3D2B1F] hover:text-white transition-colors text-sm"
          >
            View All Melas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#EAE0CF] h-96 animate-pulse" />
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#EAE0CF]">
            <p className="text-[#9C7B6A] mb-3 text-lg">Events are being loaded...</p>
            <p className="text-sm text-[#9C7B6A]">Data will appear automatically in a few seconds.</p>
          </div>
        )}
      </section>

      {/* ── WHY KAARIGAR EXPO ── */}
      <section className="bg-white border-y border-[#EAE0CF] py-20 px-4 sm:px-6 lg:px-8 earthy-texture">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-2">Platform Benefits</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D2B1F] tracking-tight mb-3">
              Why Kaarigar Expo?
            </h2>
            <p className="text-[#6B4C3B] max-w-xl mx-auto">
              Connecting traditional craft traditions with contemporary cultural appreciation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Star className="w-6 h-6" />, title: "Showcase Your Craft", desc: "Directly apply for stall spaces in premier craft melas, gain visibility, and sell directly to collectors." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Discover Unique Artisans", desc: "Connect with verified master craftsmen across textiles, pottery, woodwork, brassware, and paintings." },
              { icon: <Map className="w-6 h-6" />, title: "Join Vibrant Melas", desc: "Convenient online visitor RSVP, instant pass confirmation, and comprehensive schedules in one place." },
              { icon: <Heart className="w-6 h-6" />, title: "Support Local Craftsmanship", desc: "Preserve indigenous heritage through transparent digital organization and community empowerment." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#F5EFE6] border border-[#EAE0CF] rounded-2xl p-7 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-white border border-[#EAE0CF] rounded-full flex items-center justify-center mx-auto mb-5 text-[#C4602A] group-hover:bg-[#C4602A] group-hover:text-white group-hover:border-[#C4602A] transition-colors shadow-sm">
                  {icon}
                </div>
                <h3 className="text-base font-bold text-[#3D2B1F] mb-2">{title}</h3>
                <p className="text-sm text-[#9C7B6A] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#C4602A] uppercase tracking-widest mb-2">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D2B1F] tracking-tight">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-9 border-2 border-[#C4602A] shadow-sm relative">
            <div className="absolute top-0 left-8 -translate-y-1/2 bg-[#C4602A] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow">For Kaarigars</div>
            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-8 mt-2">Artisan Participation</h3>
            <div className="space-y-7">
              {[
                { title: "Register & Build Profile", desc: "Create your artisan profile, add craft specialization and portfolio photos." },
                { title: "Apply for Open Melas", desc: "Browse scheduled exhibitions and submit your stall application with one click." },
                { title: "Get Approved", desc: "Receive live notification and status updates once the committee reviews your application." },
                { title: "Participate & Sell", desc: "Your profile is featured publicly under the event and you receive your confirmed stall allotment." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#C4602A] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow">{i + 1}</div>
                  <div>
                    <h4 className="font-bold text-[#3D2B1F] mb-0.5">{step.title}</h4>
                    <p className="text-sm text-[#9C7B6A] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-9 border-2 border-[#D4A96A] shadow-sm relative">
            <div className="absolute top-0 left-8 -translate-y-1/2 bg-[#D4A96A] text-[#3D2B1F] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow">For Visitors</div>
            <h3 className="text-2xl font-bold text-[#3D2B1F] mb-8 mt-2">Visitor Journey</h3>
            <div className="space-y-7">
              {[
                { title: "Explore Upcoming Melas", desc: "Search events by city, state, dates, or craft themes." },
                { title: "RSVP & Register", desc: "Register your attendance in seconds to reserve entry for you and your family." },
                { title: "Visit the Exhibition", desc: "Access your confirmed passes anytime via your personal Visitor Dashboard." },
                { title: "Discover & Support Artisans", desc: "Witness live demonstrations and buy authentic handmade crafts directly." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#D4A96A] text-[#3D2B1F] flex items-center justify-center font-bold text-sm shrink-0 shadow">{i + 1}</div>
                  <div>
                    <h4 className="font-bold text-[#3D2B1F] mb-0.5">{step.title}</h4>
                    <p className="text-sm text-[#9C7B6A] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#C4602A] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden earthy-texture">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#9E4B1F] rounded-full opacity-40 blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8916A] rounded-full opacity-30 blur-[80px] -translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="text-4xl mb-4">🏺</div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
            Are you a craftsperson?
          </h2>
          <p className="text-lg text-[#F5EFE6]/80 mb-10 max-w-xl mx-auto">
            Showcase your talent at the next Kaarigar Expo. Register today to apply for national and state handicraft melas.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#3D2B1F] hover:bg-[#2a1e15] text-white px-9 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-xl"
          >
            Register as Kaarigar <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
