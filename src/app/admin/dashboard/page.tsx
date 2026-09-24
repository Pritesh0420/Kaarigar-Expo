"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, getDocs, addDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"events" | "applications" | "rsvps">("events");
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  
  // Event Creation Form
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", description: "", bannerUrl: "", locationName: "", city: "", lat: 0, lng: 0, startDate: "", endDate: ""
  });

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "admin")) {
      router.push("/");
    }
  }, [authLoading, userProfile, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const eSnap = await getDocs(collection(db, "events"));
      setEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const aSnap = await getDocs(collection(db, "applications"));
      setApplications(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const rSnap = await getDocs(collection(db, "rsvps"));
      setRsvps(rSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      toast.error("Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.role === "admin") {
      fetchData();
    }
  }, [userProfile]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRef = doc(collection(db, "events"));
      const eventData = {
        id: newRef.id,
        ...newEvent,
        coordinates: { lat: Number(newEvent.lat), lng: Number(newEvent.lng) },
        createdBy: userProfile?.uid,
        status: "upcoming"
      };
      await setDoc(newRef, eventData);
      setEvents(prev => [...prev, eventData]);
      setIsCreating(false);
      toast.success("Event created!");
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const handleUpdateAppStatus = async (appId: string, status: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "applications", appId), { status });
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (authLoading || loading) return <div className="p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 space-x-8">
        <button 
          onClick={() => setActiveTab("events")}
          className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "events" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Manage Events
        </button>
        <button 
          onClick={() => setActiveTab("applications")}
          className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "applications" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Kaarigar Applications
        </button>
        <button 
          onClick={() => setActiveTab("rsvps")}
          className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "rsvps" ? "border-orange-500 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
        >
          Visitor RSVPs
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        
        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Events List</h2>
              <button onClick={() => setIsCreating(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
                + Create New Event
              </button>
            </div>
            
            {isCreating && (
              <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold mb-4">Create Event</h3>
                <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Event Title" className="border p-2 rounded" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                  <input required placeholder="City" className="border p-2 rounded" value={newEvent.city} onChange={e => setNewEvent({...newEvent, city: e.target.value})} />
                  <input required placeholder="Location Name / Venue" className="border p-2 rounded" value={newEvent.locationName} onChange={e => setNewEvent({...newEvent, locationName: e.target.value})} />
                  <input required placeholder="Banner Image URL" className="border p-2 rounded" value={newEvent.bannerUrl} onChange={e => setNewEvent({...newEvent, bannerUrl: e.target.value})} />
                  <input required type="date" placeholder="Start Date" className="border p-2 rounded" onChange={e => setNewEvent({...newEvent, startDate: new Date(e.target.value).toISOString()})} />
                  <input required type="date" placeholder="End Date" className="border p-2 rounded" onChange={e => setNewEvent({...newEvent, endDate: new Date(e.target.value).toISOString()})} />
                  <input required type="number" step="any" placeholder="Latitude" className="border p-2 rounded" onChange={e => setNewEvent({...newEvent, lat: parseFloat(e.target.value)})} />
                  <input required type="number" step="any" placeholder="Longitude" className="border p-2 rounded" onChange={e => setNewEvent({...newEvent, lng: parseFloat(e.target.value)})} />
                  <textarea required placeholder="Description" className="border p-2 rounded md:col-span-2" rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                  <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded text-sm font-medium">Save Event</button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-sm">
                    <th className="p-3 font-semibold text-slate-700">Event Title</th>
                    <th className="p-3 font-semibold text-slate-700">City</th>
                    <th className="p-3 font-semibold text-slate-700">Status</th>
                    <th className="p-3 font-semibold text-slate-700">Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-medium">{ev.title}</td>
                      <td className="p-3 text-slate-600">{ev.city}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs uppercase">{ev.status}</span>
                      </td>
                      <td className="p-3 text-sm text-slate-500">
                        {new Date(ev.startDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Artisan Applications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-sm">
                    <th className="p-3 font-semibold text-slate-700">Kaarigar Name</th>
                    <th className="p-3 font-semibold text-slate-700">Event</th>
                    <th className="p-3 font-semibold text-slate-700">Craft Type</th>
                    <th className="p-3 font-semibold text-slate-700">Status</th>
                    <th className="p-3 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-medium">{app.kaarigarName}</td>
                      <td className="p-3 text-slate-600">{app.eventTitle}</td>
                      <td className="p-3 text-slate-600">{app.craftType}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs uppercase font-medium ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        {app.status === 'pending' && (
                          <>
                            <button onClick={() => handleUpdateAppStatus(app.id, 'approved')} className="text-xs bg-green-50 text-green-700 px-2 py-1 border border-green-200 rounded hover:bg-green-100">Approve</button>
                            <button onClick={() => handleUpdateAppStatus(app.id, 'rejected')} className="text-xs bg-red-50 text-red-700 px-2 py-1 border border-red-200 rounded hover:bg-red-100">Reject</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RSVPs Tab */}
        {activeTab === "rsvps" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Visitor Registrations</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-sm">
                    <th className="p-3 font-semibold text-slate-700">Visitor Name</th>
                    <th className="p-3 font-semibold text-slate-700">Email</th>
                    <th className="p-3 font-semibold text-slate-700">Event</th>
                    <th className="p-3 font-semibold text-slate-700">Date RSVP'd</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map(rsvp => (
                    <tr key={rsvp.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-medium">{rsvp.visitorName}</td>
                      <td className="p-3 text-slate-600">{rsvp.visitorEmail}</td>
                      <td className="p-3 text-slate-600">{rsvp.eventTitle}</td>
                      <td className="p-3 text-sm text-slate-500">{new Date(rsvp.rsvpDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
