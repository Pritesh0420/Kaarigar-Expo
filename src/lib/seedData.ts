 import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const seedDatabase = async () => {
  const events = [
    {
      id: "event-1",
      title: "Delhi Diwali Mela",
      description: "A grand exhibition of festive crafts, diyas, and traditional handlooms.",
      bannerUrl: "https://picsum.photos/seed/event-1/1200/800",
      locationName: "Dilli Haat, INA",
      city: "New Delhi",
      coordinates: { lat: 28.5728, lng: 77.2085 },
      startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      createdBy: "admin-1",
      status: "upcoming"
    },
    {
      id: "event-2",
      title: "Jaipur Artisan Fair",
      description: "Showcasing the finest terracotta, blue pottery, and bandhani textiles.",
      bannerUrl: "https://picsum.photos/seed/event-2/1200/800",
      locationName: "Jawahar Kala Kendra",
      city: "Jaipur",
      coordinates: { lat: 26.8856, lng: 75.8052 },
      startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdBy: "admin-1",
      status: "ongoing"
    }
  ];

  const users = [
    {
      uid: "admin-1",
      email: "admin@kaarigar.com",
      role: "admin",
      displayName: "Platform Admin",
      createdAt: new Date().toISOString()
    },
    {
      uid: "artisan-1",
      email: "artisan@kaarigar.com",
      role: "kaarigar",
      displayName: "Ramesh Potter",
      phone: "+91 9876543210",
      craftType: "Terracotta",
      bio: "Crafting terracotta for 20 years in rural Rajasthan.",
      createdAt: new Date().toISOString()
    },
    {
      uid: "visitor-1",
      email: "visitor@kaarigar.com",
      role: "visitor",
      displayName: "Priya Sharma",
      createdAt: new Date().toISOString()
    }
  ];

  const applications = [
    {
      id: "app-1",
      eventId: "event-2",
      eventTitle: "Jaipur Artisan Fair",
      kaarigarId: "artisan-1",
      kaarigarName: "Ramesh Potter",
      craftType: "Terracotta",
      description: "I will display large pots and diyas.",
      status: "approved",
      appliedAt: new Date().toISOString()
    }
  ];

  try {
    for (const evt of events) {
      await setDoc(doc(collection(db, "events"), evt.id), evt);
    }
    for (const u of users) {
      await setDoc(doc(collection(db, "users"), u.uid), u);
    }
    for (const a of applications) {
      await setDoc(doc(collection(db, "applications"), a.id), a);
    }
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
