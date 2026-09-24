"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs, addDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { EventType } from "@/components/EventCard";
import Map from "@/components/Map";
import { Calendar, MapPin, UserCheck, Star, Info } from "lucide-react";
import toast from "react-hot-toast";

interface Artisan {
  id: string;
  kaarigarName: string;
  craftType: string;
  description: string;
}

export default function EventDetails() {
  const params = useParams();
  const { userProfile } = useAuth();
  
  const [event, setEvent] = useState<EventType | null>(null);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interactions
  const [isRSVPd, setIsRSVPd] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [appDescription, setAppDescription] = useState("");

  useEffect(() => {
    const fetchEventData = async () => {
      if (!params.id) return;
      
      try {
        // Fetch Event
        const eventRef = doc(db, "events", params.id as string);
        const eventSnap = await getDoc(eventRef);
        
        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() } as EventType);
        }

        // Fetch Approved Artisans
        const appsRef = collection(db, "applications");
        const qApps = query(appsRef, where("eventId", "==", params.id), where("status", "==", "approved"));
        const appsSnap = await getDocs(qApps);
        const arts = appsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Artisan));
        setArtisans(arts);

        // Check if user has interacted
        if (userProfile) {
          if (userProfile.role === "visitor") {
            const rsvpsRef = collection(db, "rsvps");
            const qRsvp = query(rsvpsRef, where("eventId", "==", params.id), where("visitorId", "==", userProfile.uid));
            const rsvpSnap = await getDocs(qRsvp);
            setIsRSVPd(!rsvpSnap.empty);
          } else if (userProfile.role === "kaarigar") {
            const appCheckRef = collection(db, "applications");
            const qCheck = query(appCheckRef, where("eventId", "==", params.id), where("kaarigarId", "==", userProfile.uid));
            const checkSnap = await getDocs(qCheck);
            setHasApplied(!checkSnap.empty);
          }
        }
      } catch (error) {
        console.error("Error fetching event details", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, [params.id, userProfile]);

  const handleRSVP = async () => {
    if (!userProfile) return toast.error("Please login to RSVP");
    try {
      const newRsvpRef = doc(collection(db, "rsvps"));
      await setDoc(newRsvpRef, {
        id: newRsvpRef.id,
        eventId: event?.id,
        eventTitle: event?.title,
        visitorId: userProfile.uid,
        visitorName: userProfile.displayName,
        visitorEmail: userProfile.email,
        visitorPhone: userProfile.phone || "",
        rsvpDate: new Date().toISOString()
      });
      setIsRSVPd(true);
      toast.success("RSVP Successful!");
    } catch (error) {
      toast.error("Error processing RSVP");
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      const newAppRef = doc(collection(db, "applications"));
      await setDoc(newAppRef, {
        id: newAppRef.id,
        eventId: event?.id,
        eventTitle: event?.title,
        kaarigarId: userProfile.uid,
        kaarigarName: userProfile.displayName,
        craftType: userProfile.craftType || "General Craft",
        description: appDescription,
        status: "pending",
        appliedAt: new Date().toISOString()
      });
      setHasApplied(true);
      setApplyModalOpen(false);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Error submitting application");
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 text-lg">Loading Event...</div>;
  if (!event) return <div className="p-20 text-center text-slate-500 text-lg">Event not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden mb-8 shadow-md">
        <img 
          src={event.bannerUrl} 
          alt={event.title} 
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${event.id}/1200/600`; }}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {event.status}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-2">{event.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Mela</h2>
            <p className="text-slate-600 text-lg leading-relaxed">{event.description}</p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-orange-500" />
              Approved Kaarigars ({artisans.length})
            </h2>
            {artisans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {artisans.map(art => (
                  <div key={art.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <h3 className="font-bold text-slate-800 text-lg">{art.kaarigarName}</h3>
                    <p className="text-sm font-medium text-orange-600 mb-2">{art.craftType}</p>
                    <p className="text-sm text-slate-600">{art.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-200 border-dashed">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500">No artisans have been approved for this event yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Event Details</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Dates</p>
                  <p className="text-sm text-slate-600">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Location</p>
                  <p className="text-sm text-slate-600">{event.locationName}, {event.city}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!userProfile ? (
              <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                <p className="text-sm text-orange-800 mb-3">Login to interact with this event.</p>
                <a href="/login" className="block w-full bg-orange-600 text-white font-medium py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  Login Now
                </a>
              </div>
            ) : userProfile.role === "visitor" ? (
              isRSVPd ? (
                <div className="w-full bg-green-50 text-green-700 border border-green-200 font-medium py-3 rounded-lg flex items-center justify-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  You're RSVP'd!
                </div>
              ) : (
                <button 
                  onClick={handleRSVP}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg shadow-sm transition-colors"
                >
                  RSVP for this Event
                </button>
              )
            ) : userProfile.role === "kaarigar" ? (
              hasApplied ? (
                <div className="w-full bg-blue-50 text-blue-700 border border-blue-200 font-medium py-3 rounded-lg text-center">
                  Application Submitted
                </div>
              ) : (
                <button 
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg shadow-sm transition-colors"
                >
                  Apply to Exhibit
                </button>
              )
            ) : null}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
             <div className="h-64 rounded-xl overflow-hidden relative z-0">
               <Map center={event.coordinates || { lat: 28.6139, lng: 77.2090 }} />
             </div>
             <a
               href={`https://www.google.com/maps/search/?api=1&query=${event.coordinates?.lat || 28.6139},${event.coordinates?.lng || 77.2090}`}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full flex justify-center items-center gap-2 bg-[#F5EFE6] hover:bg-[#EAE0CF] text-[#3D2B1F] border border-[#EAE0CF] font-bold py-2.5 rounded-xl transition-colors text-sm"
             >
               <MapPin className="w-4 h-4 text-[#C4602A]" />
               Open on Google Maps
             </a>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Apply for Booth</h3>
            <p className="text-sm text-slate-500 mb-4">Tell the organizer about what crafts you plan to exhibit at {event.title}.</p>
            <form onSubmit={submitApplication}>
              <textarea 
                required
                className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none mb-4 min-h-[120px]"
                placeholder="E.g., I need a table for my hand-painted pottery and a power outlet."
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
              />
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setApplyModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
