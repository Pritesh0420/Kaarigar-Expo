"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export default function VisitorRSVPs() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "visitor")) {
      router.push("/");
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    const fetchRSVPs = async () => {
      if (!userProfile) return;
      try {
        const q = query(collection(db, "rsvps"), where("visitorId", "==", userProfile.uid));
        const snap = await getDocs(q);
        
        // Fetch event details for each RSVP to show banner and dates
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

  if (authLoading || loading) return <div className="p-20 text-center">Loading your RSVPs...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My RSVPs</h1>
      
      {rsvps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rsvps.map(rsvp => (
            <div key={rsvp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {rsvp.eventDetails?.bannerUrl && (
                <div className="h-32 w-full overflow-hidden">
                  <img 
                    src={rsvp.eventDetails.bannerUrl} 
                    alt="Event Banner" 
                    onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${rsvp.eventId}/800/400`; }}
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{rsvp.eventTitle}</h3>
                
                {rsvp.eventDetails && (
                  <div className="space-y-2 mb-4 mt-auto">
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{new Date(rsvp.eventDetails.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                      <span>{rsvp.eventDetails.locationName}, {rsvp.eventDetails.city}</span>
                    </div>
                  </div>
                )}
                
                <Link 
                  href={`/events/${rsvp.eventId}`} 
                  className="mt-2 flex items-center text-orange-600 text-sm font-medium hover:text-orange-700"
                >
                  View Event Details <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No RSVPs yet</h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't registered for any upcoming melas. Browse our events catalog to find artisan fairs near you.</p>
          <Link href="/events" className="inline-flex bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
}
