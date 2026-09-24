import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const seedDatabase = async () => {
  const events = [
    {
      id: "event-1",
      title: "Delhi Diwali Mela 2026",
      description: "A grand exhibition of festive crafts, clay diyas, and traditional handlooms. India's most celebrated seasonal crafts fair returns to Dilli Haat.",
      // Indian handicraft / mela crowd — Unsplash
      bannerUrl: "https://images.unsplash.com/photo-1605292356183-a77d0a9c9d1d?w=1200&auto=format&fit=crop",
      locationName: "Dilli Haat, INA",
      city: "New Delhi",
      coordinates: { lat: 28.5728, lng: 77.2085 },
      startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      createdBy: "admin-1",
      status: "upcoming",
    },
    {
      id: "event-2",
      title: "Jaipur Artisan Fair 2026",
      description: "Showcasing Rajasthan's finest terracotta, blue pottery, bandhani textiles, and mirror-work leathercraft from master Kaarigar families.",
      // Rajasthan pottery / blue pottery
      bannerUrl: "https://images.unsplash.com/photo-1590605095243-072811dbe64c?w=1200&auto=format&fit=crop",
      locationName: "Jawahar Kala Kendra",
      city: "Jaipur",
      coordinates: { lat: 26.8856, lng: 75.8052 },
      startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdBy: "admin-1",
      status: "active",
    },
    {
      id: "event-3",
      title: "Surajkund International Crafts Fair",
      description: "One of Asia's largest handicrafts fairs, celebrating artisans from across 30+ states and international craft traditions.",
      // Indian weaving / textile — Unsplash
      bannerUrl: "https://images.unsplash.com/photo-1616706161242-f1d591350d1c?w=1200&auto=format&fit=crop",
      locationName: "Surajkund Mela Grounds",
      city: "Faridabad",
      coordinates: { lat: 28.4783, lng: 77.3157 },
      startDate: new Date(Date.now() + 86400000 * 20).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 36).toISOString(),
      createdBy: "admin-1",
      status: "upcoming",
    },
    {
      id: "event-4",
      title: "Bengal Handloom & Terracotta Grand Expo",
      description: "Discover Biswa Bangla's authentic handloom sarees, Bankura horses, Madhubani paintings, and Dokra metal craft from Bengal's finest weavers.",
      // Loom / weaving photo
      bannerUrl: "https://images.unsplash.com/photo-1640292343595-889db1c8262e?w=1200&auto=format&fit=crop",
      locationName: "Biswa Bangla Mela Prangan, EM Bypass",
      city: "Kolkata",
      coordinates: { lat: 22.5355, lng: 88.3987 },
      startDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 20).toISOString(),
      createdBy: "admin-1",
      status: "upcoming",
    },
    {
      id: "event-5",
      title: "Shilpgram Folk Arts Carnival",
      description: "Udaipur's premier folk arts festival where master craftspeople from Rajasthan, Gujarat, and Madhya Pradesh exhibit puppetry, miniature paintings, and tribal art.",
      // Indian tribal art / folk craft
      bannerUrl: "https://images.unsplash.com/photo-1603030002297-85e206a2285a?w=1200&auto=format&fit=crop",
      locationName: "Shilpgram Rural Arts Complex, Rani Road",
      city: "Udaipur",
      coordinates: { lat: 24.5819, lng: 73.6625 },
      startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      endDate: new Date(Date.now() - 86400000 * 23).toISOString(),
      createdBy: "admin-1",
      status: "past",
    },
  ];

  const users = [
    {
      uid: "admin-1",
      email: "admin@kaarigarexpo.in",
      role: "admin",
      displayName: "Platform Admin",
      createdAt: new Date().toISOString(),
    },
    {
      uid: "artisan-1",
      email: "artisan@kaarigarexpo.in",
      role: "kaarigar",
      displayName: "Radhe Mohan",
      phone: "+91 98765 43210",
      craftType: "Handloom & Weaving",
      bio: "Weaving heritage into modern styles. Every thread tells a story of tradition, patience, and 100% handmade passion from the looms of Varanasi.",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
      createdAt: new Date().toISOString(),
    },
    {
      uid: "artisan-2",
      email: "artisan2@kaarigarexpo.in",
      role: "kaarigar",
      displayName: "Komal Desai",
      phone: "+91 77543 21098",
      craftType: "Terracotta & Pottery",
      bio: "Goa's terracotta sculptor specialising in hand-painted pots, Ganesha idols, and coconut shell jewellery — each piece celebrating the earth's natural beauty.",
      photoUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format&fit=crop",
      createdAt: new Date().toISOString(),
    },
    {
      uid: "artisan-3",
      email: "artisan3@kaarigarexpo.in",
      role: "kaarigar",
      displayName: "Sameer Maheshwari",
      phone: "+91 90112 34567",
      craftType: "Bamboo & Cane",
      bio: "A dedicated celebration of Bihar's living art forms — Madhubani and Mithila paintings on handmade paper, Bhagalpuri Tussar silk sarees, and Sujani embroidery.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
      createdAt: new Date().toISOString(),
    },
    {
      uid: "visitor-1",
      email: "visitor@kaarigarexpo.in",
      role: "visitor",
      displayName: "Priya Sharma",
      createdAt: new Date().toISOString(),
    },
  ];

  const applications = [
    {
      id: "app-1",
      eventId: "event-2",
      eventTitle: "Jaipur Artisan Fair 2026",
      kaarigarId: "artisan-1",
      kaarigarName: "Radhe Mohan",
      craftType: "Handloom & Weaving",
      description: "Will display handloom sarees, stoles, and table runners. Stall: 6×8 ft with hanging display.",
      status: "approved",
      appliedAt: new Date().toISOString(),
    },
    {
      id: "app-2",
      eventId: "event-1",
      eventTitle: "Delhi Diwali Mela 2026",
      kaarigarId: "artisan-2",
      kaarigarName: "Komal Desai",
      craftType: "Terracotta & Pottery",
      description: "Displaying Diwali diyas, terracotta vases, and hand-painted flower pots.",
      status: "pending",
      appliedAt: new Date().toISOString(),
    },
    {
      id: "app-3",
      eventId: "event-3",
      eventTitle: "Surajkund International Crafts Fair",
      kaarigarId: "artisan-3",
      kaarigarName: "Sameer Maheshwari",
      craftType: "Bamboo & Cane",
      description: "Showcasing Madhubani art pieces, Tussar silk scarves, and framed Sujani embroidery work.",
      status: "pending",
      appliedAt: new Date().toISOString(),
    },
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
    console.log("Database seeded successfully with 5 events, 4 users, 3 applications!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};
