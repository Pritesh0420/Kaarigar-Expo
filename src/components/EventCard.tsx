"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

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

const statusColors: Record<string, string> = {
  upcoming: "bg-[#EAE0CF] text-[#6B4C3B] border-[#D4A96A]",
  active:   "bg-[#C4602A] text-white border-[#C4602A]",
  ongoing:  "bg-[#C4602A] text-white border-[#C4602A]",
  past:     "bg-[#9C7B6A]/20 text-[#9C7B6A] border-[#9C7B6A]",
};

export default function EventCard({ event }: { event: EventType }) {
  const start = new Date(event.startDate).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  const statusClass = statusColors[event.status] || statusColors.upcoming;

  // Since remote Firebase rules block updating the seeded mock data, we override the mock banner URLs here
  const updatedBanners: Record<string, string> = {
    "event-1": "https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1200&auto=format&fit=crop",
    "event-2": "https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=1200&auto=format&fit=crop",
    "event-3": "https://images.unsplash.com/photo-1616706161242-f1d591350d1c?w=1200&auto=format&fit=crop",
    "event-4": "https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=1200&auto=format&fit=crop",
    "event-5": "https://images.unsplash.com/photo-1603030002297-85e206a2285a?w=1200&auto=format&fit=crop",
  };
  const banner = updatedBanners[event.id] || event.bannerUrl;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EAE0CF] overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
      {/* Banner */}
      <div className="h-52 overflow-hidden bg-[#EAE0CF] relative">
        <img
          src={banner}
          alt={event.title}
          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${event.id}/800/400`; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm ${statusClass}`}>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> {event.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-[#3D2B1F] mb-3 line-clamp-2 leading-snug">{event.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-[#6B4C3B]">
            <Calendar className="w-4 h-4 mr-2 text-[#C4602A] shrink-0" />
            <span>{start}</span>
          </div>
          <div className="flex items-start text-sm text-[#6B4C3B]">
            <MapPin className="w-4 h-4 mr-2 text-[#C4602A] shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.locationName}, {event.city}</span>
          </div>
          <div className="flex items-center text-sm text-[#6B4C3B] font-medium">
            <Users className="w-4 h-4 mr-2 text-[#C4602A] shrink-0" />
            <span>Artisan registration open</span>
          </div>
        </div>

        <p className="text-sm text-[#9C7B6A] mb-5 line-clamp-2 leading-relaxed flex-1">{event.description}</p>

        {/* CTA Buttons */}
        <div className="mt-auto flex gap-2.5">
          <Link
            href={`/events/${event.id}`}
            className="flex-1 text-center border-2 border-[#3D2B1F] text-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-white font-semibold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wider"
          >
            View Details
          </Link>
          <Link
            href={`/events/${event.id}`}
            className="flex-1 text-center bg-[#C4602A] hover:bg-[#9E4B1F] text-white font-semibold py-2.5 rounded-xl transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1"
          >
            RSVP Pass <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
