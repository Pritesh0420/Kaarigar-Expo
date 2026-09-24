"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function KaarigarDashboard() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ phone: "", craftType: "", bio: "" });

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "kaarigar")) {
      router.push("/");
    }
    if (userProfile) {
      setProfile({
        phone: userProfile.phone || "",
        craftType: userProfile.craftType || "",
        bio: userProfile.bio || ""
      });
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    const fetchApps = async () => {
      if (!userProfile) return;
      try {
        const q = query(collection(db, "applications"), where("kaarigarId", "==", userProfile.uid));
        const snap = await getDocs(q);
        setApplications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching apps", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userProfile) fetchApps();
  }, [userProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      await updateDoc(doc(db, "users", userProfile.uid), profile);
      toast.success("Profile updated!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (authLoading || loading) return <div className="p-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Kaarigar Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Profile</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-sm text-orange-600 font-medium">Edit</button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                  <input type="text" className="w-full border p-2 rounded text-sm" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Craft Type</label>
                  <input type="text" className="w-full border p-2 rounded text-sm" value={profile.craftType} onChange={e => setProfile({...profile, craftType: e.target.value})} placeholder="e.g. Pottery, Handloom" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Bio</label>
                  <textarea className="w-full border p-2 rounded text-sm" rows={4} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-orange-600 text-white py-2 rounded text-sm font-medium">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="flex-1 border text-slate-600 py-2 rounded text-sm font-medium">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</p>
                  <p className="font-medium">{userProfile?.displayName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Craft Type</p>
                  <p className="font-medium">{userProfile?.craftType || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Bio</p>
                  <p className="text-sm text-slate-600">{userProfile?.bio || "Tell us about your craft..."}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Applications List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">My Event Applications</h2>
              <button onClick={() => router.push("/events")} className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Find Melas to Apply
              </button>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-bold text-slate-900">{app.eventTitle}</h3>
                      <p className="text-sm text-slate-500 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                <p className="text-slate-500 mb-4">You haven't applied to any events yet.</p>
                <button onClick={() => router.push("/events")} className="text-orange-600 font-medium hover:underline">
                  Browse Events
                </button>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
