import Link from "next/link";
import { ArrowRight, Star, Heart, Map, ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EventCard, { EventType } from "@/components/EventCard";

async function getFeaturedEvents() {
  try {
    const q = query(
      collection(db, "events"),
      where("status", "in", ["upcoming", "active"]),
      limit(3)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as EventType);
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
}

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();

  return (
    <div className="bg-[#fbf9f4] w-full">
      {/* Hero Section */}
      <section className="bg-[#192742] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text */}
          <div className="lg:w-1/2 z-10">
            <div className="inline-flex items-center gap-2 border border-[#ddaf56] text-[#ddaf56] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
              <span>✨</span> National Mela Registration & Artisan Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Celebrating India’s <span className="text-[#ddaf56]">Artisans</span>, Crafts & Culture
            </h1>
            
            <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl">
              Discover authentic local craftsmanship, meet talented master kaarigars, and experience vibrant handicraft exhibitions across India.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/events" 
                className="bg-[#ddaf56] hover:bg-[#c99a41] text-[#192742] px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg"
              >
                <Map className="w-5 h-5" /> Explore Melas
              </Link>
              <Link 
                href="/register" 
                className="bg-transparent border border-slate-500 hover:border-white hover:text-white text-slate-300 px-8 py-4 rounded-xl font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Register as Kaarigar <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Image Card Showcase */}
          <div className="lg:w-1/2 relative z-10 hidden md:block">
            <div className="relative w-full h-[450px] rounded-3xl overflow-hidden border-4 border-[#ddaf56]/20 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/hero-handloom/800/600" 
                alt="Heritage Weaves" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#192742]/90 via-transparent to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Heritage Weaves & Handloom</h3>
                <p className="text-slate-300 text-sm">Authentic artisan textiles from across India</p>
                <div className="flex items-center gap-2 mt-6">
                   <div className="w-8 h-1 bg-[#ddaf56] rounded-full"></div>
                   <div className="w-2 h-1 bg-white/40 rounded-full"></div>
                   <div className="w-2 h-1 bg-white/40 rounded-full"></div>
                </div>
              </div>

              {/* Fake carousel arrows */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-colors border border-white/20">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-colors border border-white/20">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ddaf56] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 translate-x-1/3 -translate-y-1/3"></div>
      </section>

      {/* Upcoming Melas Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold text-[#ddaf56] uppercase tracking-widest mb-2">Live & Upcoming Events</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#192742] tracking-tight">
              Upcoming Melas & Exhibitions
            </h2>
          </div>
          <Link 
            href="/events" 
            className="hidden sm:flex items-center gap-2 px-6 py-2 border-2 border-[#192742] text-[#192742] font-semibold rounded-lg hover:bg-[#192742] hover:text-white transition-colors"
          >
            View All Melas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#e8e2d2]">
            <p className="text-slate-500 mb-4">No events found. Seed the database to get started.</p>
          </div>
        )}
      </section>

      {/* Why Kaarigar Expo Section */}
      <section className="bg-white border-y border-[#e8e2d2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <p className="text-xs font-bold text-[#ddaf56] uppercase tracking-widest mb-2">Platform Benefits</p>
             <h2 className="text-3xl md:text-4xl font-extrabold text-[#192742] tracking-tight mb-4">
              Why Kaarigar Expo?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Connecting traditional craft traditions with contemporary cultural appreciation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#fbf9f4] p-8 rounded-2xl border border-[#e8e2d2] text-center hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform text-[#192742]">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192742] mb-3">Showcase Your Craft</h3>
              <p className="text-sm text-slate-600">Directly apply for stall spaces in premier craft melas, gain visibility, and sell directly to collectors.</p>
            </div>

            <div className="bg-[#fbf9f4] p-8 rounded-2xl border border-[#e8e2d2] text-center hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform text-[#ddaf56]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192742] mb-3">Discover Unique Artisans</h3>
              <p className="text-sm text-slate-600">Connect with verified master craftsmen across textiles, pottery, woodwork, brassware, and paintings.</p>
            </div>

            <div className="bg-[#fbf9f4] p-8 rounded-2xl border border-[#e8e2d2] text-center hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform text-green-600">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192742] mb-3">Join Vibrant Melas</h3>
              <p className="text-sm text-slate-600">Convenient online visitor RSVP, instant pass confirmation, and comprehensive schedules in one place.</p>
            </div>

            <div className="bg-[#fbf9f4] p-8 rounded-2xl border border-[#e8e2d2] text-center hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform text-red-500">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#192742] mb-3">Support Local Craftsmanship</h3>
              <p className="text-sm text-slate-600">Preserve indigenous heritage through transparent digital organization and community empowerment.</p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
         <div className="text-center mb-16">
            <p className="text-xs font-bold text-[#ddaf56] uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#192742] tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Kaarigars Column */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#192742] shadow-sm relative">
               <div className="absolute top-0 left-8 -translate-y-1/2 bg-[#192742] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                 For Kaarigars
               </div>
               <h3 className="text-2xl font-bold text-[#192742] mb-8 mt-2">Artisan Participation</h3>
               
               <div className="space-y-8">
                  {[
                    { title: "Register & Build Profile", desc: "Create your artisan profile, add craft specialization and portfolio photos." },
                    { title: "Apply for Open Melas", desc: "Browse scheduled exhibitions and submit your stall application with one click." },
                    { title: "Get Approved", desc: "Receive live notification and status updates once the exhibition committee reviews your application." },
                    { title: "Participate & Sell", desc: "Your profile is featured publicly under the event and you receive your confirmed stall allotment." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#fbf9f4] border border-[#e8e2d2] flex items-center justify-center text-[#192742] font-bold shrink-0">{i+1}</div>
                      <div>
                        <h4 className="font-bold text-[#192742] mb-1">{step.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Visitors Column */}
            <div className="bg-white rounded-3xl p-8 border-2 border-[#ddaf56] shadow-sm relative">
               <div className="absolute top-0 left-8 -translate-y-1/2 bg-[#ddaf56] text-[#192742] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                 For Visitors
               </div>
               <h3 className="text-2xl font-bold text-[#192742] mb-8 mt-2">Visitor Journey</h3>
               
               <div className="space-y-8">
                  {[
                    { title: "Explore Upcoming Melas", desc: "Search events by city, state, dates, or craft themes." },
                    { title: "RSVP & Register", desc: "Register your attendance in seconds to reserve entry for you and your family." },
                    { title: "Visit the Exhibition", desc: "Access your confirmed passes anytime via your personal Visitor Dashboard." },
                    { title: "Discover & Support Artisans", desc: "Meet participating kaarigars, witness live demonstrations, and buy authentic handmade crafts." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#fbf9f4] border border-[#e8e2d2] flex items-center justify-center text-[#ddaf56] font-bold shrink-0">{i+1}</div>
                      <div>
                        <h4 className="font-bold text-[#192742] mb-1">{step.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#192742] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
           <div className="text-[#ddaf56] mb-4 flex justify-center">
             <Star className="w-8 h-8" />
           </div>
           <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Are you a craftsperson?
           </h2>
           <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
             Showcase your talent at the next Kaarigar Expo. Register today to apply for national and state handicraft melas.
           </p>
           <Link 
             href="/register" 
             className="inline-flex items-center gap-2 bg-[#ddaf56] hover:bg-[#c99a41] text-[#192742] px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 shadow-lg"
           >
             Register as Kaarigar <ArrowRight className="w-5 h-5" />
           </Link>
        </div>
      </section>
      
    </div>
  );
}
