import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

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
  const start = new Date(event.startDate).toLocaleDateString();
  const end = new Date(event.endDate).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <div className="h-48 overflow-hidden bg-slate-200 relative">
        <img 
          src={event.bannerUrl} 
          alt={event.title}
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${event.id}/800/400`; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-800 shadow-sm">
          {event.status}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{event.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="mt-auto space-y-2 mb-4">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
            <span>{start} - {end}</span>
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span>{event.locationName}, {event.city}</span>
          </div>
        </div>
        
        <Link 
          href={`/events/${event.id}`}
          className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium py-2.5 rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
