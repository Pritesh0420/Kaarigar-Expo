import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "./firebase";
import { seedDatabase } from "./seedData";

let hasChecked = false; // only run once per session

export const autoSeedIfEmpty = async () => {
  if (hasChecked) return;
  hasChecked = true;

  try {
    const snap = await getDocs(query(collection(db, "events"), limit(1)));
    if (snap.empty) {
      console.log("[AutoSeed] Database is empty — seeding mock data...");
      await seedDatabase();
      console.log("[AutoSeed] Done!");
    } else {
      console.log("[AutoSeed] Data already exists — skipping seed.");
    }
  } catch (err) {
    console.warn("[AutoSeed] Could not check/seed database:", err);
  }
};
