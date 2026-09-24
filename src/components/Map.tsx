"use client";

import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useMemo } from "react";

export default function Map({ center, zoom = 14 }: { center: { lat: number; lng: number }; zoom?: number }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapCenter = useMemo(() => center, [center]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center rounded-xl animate-pulse">
        <span className="text-slate-500 font-medium">Loading Map...</span>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center rounded-xl border border-slate-200 text-center p-4">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-slate-600 font-medium">Map View Unavailable</p>
        <p className="text-slate-400 text-sm mt-1">Google Maps API key is missing.</p>
        <p className="text-slate-400 text-xs mt-2">Coordinates: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}</p>
      </div>
    );
  }

  return (
    <GoogleMap
      zoom={zoom}
      center={mapCenter}
      mapContainerClassName="w-full h-full rounded-xl"
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      <Marker position={mapCenter} />
    </GoogleMap>
  );
}
