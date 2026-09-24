import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

export interface EventType {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  locationName: string;
  city: string;
  startDate: string;
  endDate: string;
  status: string;
  coordinates?: { lat: number; lng: number };
}

export default function EventCard({ event }: { event: EventType }) {
  const start = new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#e8e2d2] overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <div className="h-48 overflow-hidden bg-[#e8e2d2] relative">
        <img 
          src={event.bannerUrl} 
          alt={event.title}
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${event.id}/800/400`; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#192742] shadow-sm flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-[#ddaf56]" /> {event.status}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-[#192742] mb-3 line-clamp-2 leading-tight">{event.title}</h3>
        
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2 text-[#ddaf56] shrink-0" />
            <span>{start} • 10:00</span>
          </div>
          <div className="flex text-sm text-slate-500">
            <MapPin className="w-4 h-4 mr-2 text-[#ddaf56] shrink-0 mt-0.5" />
            <span className="line-clamp-2">{event.locationName}, {event.city}</span>
          </div>
          <div className="flex items-center text-sm font-semibold text-[#192742]">
            <Users className="w-4 h-4 mr-2 text-[#ddaf56] shrink-0" />
            <span>Artisan registration open</span>
          </div>
        </div>
        
        <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">{event.description}</p>
        
        <div className="mt-auto flex gap-3">
          <Link 
            href={`/events/${event.id}`}
            className="flex-1 text-center border-2 border-[#192742] hover:bg-[#192742] hover:text-white text-[#192742] font-bold py-2.5 rounded-lg transition-colors text-xs uppercase tracking-wider"
          >
            View Details
          </Link>
          <Link 
            href={`/events/${event.id}`}
            className="flex-1 text-center bg-[#ddaf56] hover:bg-[#c99a41] text-[#192742] font-bold py-2.5 rounded-lg transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1"
          >
            RSVP Pass <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
